import {createContext, useContext, useReducer} from 'react';
import {AppState, Device, Quote} from '../types';
import stateReducer from './Reducers';
import {SDL_STATE, SECONDS_PER_DAY} from '../Constants';
import {calculateItemPerSecondUsage} from '../Utils';


// default app state data
let DatabaseData = require('../data.json');

// app state, either from a saved state or from an initialized new state
let InitialAppState = initializeAppState()

// create a state provider context, used by child components, initialized via 'StateProvider'
export const StateContext: React.Context<any | Object> = createContext(InitialAppState);


/**
 * Returns true if the app has data in local storage.
 *
 * @returns {boolean} SDL calculator data exists
 */
export function hasSavedData() {
    return !!window.localStorage.getItem(SDL_STATE);
}


/**
 * Retrieves the saved data state from local storage.
 *
 * @returns {*|Object} Saved state.
 *
 * Returns the parsed JSON object if it exists in local storage. Otherwise, returns a
 * shallow copy of the default JSON data object.
 */
export function getSavedState() {
    if (window.localStorage.getItem(SDL_STATE)) {
        const value = window.localStorage.getItem(SDL_STATE)
        try {
            return JSON.parse(value);
        } catch (e) {
            console.log(`Error loading state: ${e}`)
            return null;
        }
    }
    return null
}


/**
 * Saves the current state to local storage.
 *
 * @param {Object} state - current state to be saved.
 * @return {void}
 */
export function saveCurrentState(state) {
    window.localStorage.removeItem(SDL_STATE)
    window.localStorage.setItem(SDL_STATE, JSON.stringify(state));
}


/**
 * Builds context data for the current app state.
 *
 * Retrieves saved state data and sets default property values for device types.
 *
 * @return {object} The context data object containing saved state and device type information.
 */
export function initializeAppState() {

    // if saved app state exists, use that, else default data
    let databaseData = getSavedState() ?? {...DatabaseData}

    // calculator default attributes
    const calculatorData = databaseData['calculator']

    // update the devices with defaults if the attributes are not present (quantity, etc.)
    const devicesData = calculatorData['devices']  // todo: get this from default data
    const deviceDefaults = devicesData['device_defaults']
    const devices = devicesData['device_items']

    // set defaults if not present
    for (const device of devices) {
        device.base_weight = device.base_weight ? device.base_weight : deviceDefaults['base_weight']
        device.event_size = device.event_size ? device.event_size : deviceDefaults['event_size']
        device.category_id = device.category_id ? device.category_id : deviceDefaults['category_id']
        device.quantity = device.quantity ? device.quantity : deviceDefaults['quantity']
    }

    // if there isn't saved state in localStorage, initialize the current app state & quote
    const hasSavedState = hasSavedData()

    if (!hasSavedState) {
        // add app state & quote
        let currentState = {...AppState}
        currentState.current_quote = {...Quote}
        databaseData.current_state = currentState
    }

    return databaseData
}


/**
 * Combines an initialized state & reducer actions, used to update the current app state.
 *
 * @param {Object} defaultState - default state to initialize the custom state with.
 * @returns {Object} An object containing the custom state and actions to manipulate the state.
 */
export const useCustomState = (defaultState = initializeAppState()) => {
    // user our reducer to handle actions
    const [state, dispatch] = useReducer(stateReducer, defaultState);
    return {
        state,
        actions: {
            setName: (deviceId: number, deviceName) => dispatch({type: 'SET_NAME', deviceId, deviceName}),
            setDisplayName: (deviceId: number, displayName: string) => dispatch({type: 'SET_DISPLAY_NAME', deviceId, displayName}),
            setCategory: (deviceId: number, categoryId: number) => dispatch({type: 'SET_CATEGORY', deviceId, categoryId}),
            setQuantity: (deviceId: number, quantity: number) => dispatch({type: 'SET_QUANTITY', deviceId, quantity}),
            setBaseWeight: (deviceId: number, baseWeight: number) => dispatch({type: 'SET_BASE_WEIGHT', deviceId, baseWeight}),
            setEventSize: (deviceId: number, eventSize: number) => dispatch({type: 'SET_EVENT_SIZE', deviceId, eventSize}),
            applyFilterString: (filterString: string) => dispatch({type: 'APPLY_FILTER_STRING', filterString}),
            applyActiveFilter: (value) => dispatch({type: 'APPLY_ACTIVE_FILTER', value}),
            setRetentionMultiplier: (value) => dispatch({type: 'SET_RETENTION_INTERVAL', value}),
            setRetentionPeriods: (value) => dispatch({type: 'SET_RETENTION_PERIODS', value}),
            resetAppState: () => dispatch({type: 'RESET_APP_STATE'}),
            toggleAdminMode: (value) => dispatch({type: 'TOGGLE_ADMIN', value}),
            updateDevice: (deviceId, payload: {deviceId: number, payload: Object}) => dispatch({type: 'UPDATE_DEVICE', deviceId, payload}),
            addDevice: (payload) => dispatch({type: 'ADD_DEVICE', payload: Object}),
            toggleResultAsBinary: () => dispatch({type: 'TOGGLE_RESULT_BINARY'}),
            inputWeightChanged: (inputId, inputWeight) => dispatch({type: 'INPUT_WEIGHT_CHANGED', inputId, inputWeight}),
            setDeviceEPS: (deviceId: number, eventsPerSecond: number) => dispatch({type: 'UPDATE_EPS', deviceId, eventsPerSecond}),
        },
    };
};


/**
 * Component that provides app state to the app's child components.
 *
 * @param {ReactNode} children - The children components.
 * @returns {ReactElement} The StateProvider component.
 */
export const StateProvider = ({children}: any) => {
    // state contains two items: 'devices' & 'actions'
    const state = useCustomState();
    return <StateContext.Provider value={state}>{children}</StateContext.Provider>;
}


/**
 * Retrieves the state store from the context using the React `useContext` hook.
 *
 * @function useStateStore
 * @returns {Object} The state store retrieved from the context.
 */
export const useStateStore = (): any => useContext(StateContext);


// Helper Functions


/**
 * Calculates the current ingest quote based on the given devices, retention period, and retention interval.
 *
 * @param {Device[]} devices - current calculator devices.
 * @param {number} retentionQuantity - data retention period quantity (from the result period input).
 * @param {number} retentionInterval - data retention interval (days, weeks, etc.)
 * @param industryIdMultiplier - multiplier based on industry identifier
 * @param industrySizeMultiplier - multiplier based on industry size
 * @param orgSizeMultiplier - multiplier based on a specific organization size range
 * @return {number} total bytes of current quote.
 */
export function calculateQuote(
    devices: Device[],
    retentionQuantity: number = 1,
    retentionInterval: number = 1,
    industryIdMultiplier: number = 1,
    industrySizeMultiplier: number = 1,
    orgSizeMultiplier: number = 1
): number {

    // get the total in bytes per time period (in days)
    let totalBytesPerPeriod = 0

    // for each device, calculate the usage for a given timeframe
    for (let device of devices) {
        const totalBytesPerSecond: number = calculateItemPerSecondUsage(device, industryIdMultiplier, industrySizeMultiplier, orgSizeMultiplier)
        totalBytesPerPeriod = totalBytesPerPeriod + (totalBytesPerSecond * SECONDS_PER_DAY)
    }

    if (retentionQuantity < 1) {
        // console.log('retention quantity cannot be zero.')
    }

    // calculate bytes per day * retention period
    // calculate the total size for this ingest
    return totalBytesPerPeriod * (retentionQuantity * retentionInterval)
}
