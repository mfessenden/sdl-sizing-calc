import {createContext, useContext, useReducer} from 'react';
import {AppState} from '../types/State';
import stateReducer from './Reducers';
import {SDL_STATE} from '../Constants';

var ContextRawData = require('../data.json');
var ContextData = setupInitialState()


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
            console.log('Restoring previously saved state....')
            return JSON.parse(value);
        } catch (e) {
            console.log(`Error loading state: ${e}`)
            return null;
        }
    }
    console.log('No saved data found....')
    return null
}


/**
 * Builds the context data for the application. Retrieves saved state data and sets default property
 * values for device types.
 *
 * @return {object} The context data object containing saved state and device type information.
 */
export function setupInitialState() {
    console.log('Building context data...')
    let contextData = getSavedState() ?? {...ContextRawData}

    // default property values
    const calculatorData = contextData.calculator

    // devices
    const devicesData = calculatorData.devices
    const deviceDefaults = devicesData['device_defaults']
    const defaultBaseWeight = deviceDefaults['base_weight']
    const defaultEventSize = deviceDefaults['event_size']
    const defaultCategoryId = deviceDefaults['category_id']
    const defaultQuantity = deviceDefaults['quantity']

    console.log('Setting up state:')

    // devices
    const deviceTypes = devicesData['device_items']


    // set defaults if not present
    for (const deviceType of deviceTypes) {
        deviceType.base_weight = deviceType.base_weight ? deviceType.base_weight : defaultBaseWeight
        deviceType.event_size = deviceType.event_size ? deviceType.event_size : defaultEventSize
        deviceType.category_id = deviceType.category_id ? deviceType.category_id : defaultCategoryId
        deviceType.quantity = deviceType.quantity ? deviceType.quantity : defaultQuantity
    }

    // add app state TODO: separate context?
    contextData['current_state'] = AppState
    return contextData
}


export const StateContext = createContext(ContextData);


/**
 * Creates a custom state using a reducer and provides actions to manipulate the state.
 *
 * @param {Object} defaultState - default state to initialize the custom state with.
 * @returns {Object} An object containing the custom state and actions to manipulate the state.
 */
export const useCustomState = (defaultState = setupInitialState()) => {
    // user our reducer to handle actions
    const [state, dispatch] = useReducer(stateReducer, defaultState);
    return {
        state,
        actions: {
            setName: (deviceId, deviceName) => dispatch({type: 'SET_NAME', deviceId, deviceName}),
            setDisplayName: (deviceId, displayName) => dispatch({type: 'SET_DISPLAY_NAME', deviceId, displayName}),
            setCategory: (deviceId, categoryId) => dispatch({type: 'SET_CATEGORY', deviceId, categoryId}),
            setQuantity: (deviceId, quantity) => dispatch({type: 'SET_QUANTITY', deviceId, quantity}),
            setBaseWeight: (deviceId, baseWeight) => dispatch({type: 'SET_BASE_WEIGHT', deviceId, baseWeight}),
            setEventSize: (deviceId, eventSize) => dispatch({type: 'SET_EVENT_SIZE', deviceId, eventSize}),
            applyFilterString: (filterString) => dispatch({type: 'APPLY_FILTER_STRING', filterString}),
            applyActiveFilter: (value) => dispatch({type: 'APPLY_ACTIVE_FILTER', value}),
            setRetentionMultiplier: (value) => dispatch({type: 'SET_RETENTION_MULTIPLIER', value}),
            setRetentionPeriods: (value) => dispatch({type: 'SET_RETENTION_PERIODS', value}),
            clearState: () => dispatch({type: 'CLEAR_STATE'}),
            resetState: () => dispatch({type: 'RESET_STATE'}),
            restoreState: () => dispatch({type: 'RESTORE_STATE'}),
            toggleAdminMode: (value) => dispatch({type: 'TOGGLE_ADMIN', value}),
            updateDevice: (deviceId, payload) => dispatch({type: 'UPDATE_DEVICE', deviceId, payload}),
            addDevice: (payload) => dispatch({type: 'ADD_DEVICE', payload}),
        },
    };
};


/**
 * Calculates the current ingest quote based on the given devices, retention period, and retention multiplier.
 *
 * @param {Array<object>} devices - current calculator devices.
 * @param {number} retention_periods - data retention period quantity (from the result period input).
 * @param {number} retention_multiplier - data retention multiplier (days, weeks, etc.)
 *
 * @return {number} total bytes of current quote.
 */
export function calculateCurrentQuote(devices, retention_periods: number = 1, retention_multiplier: number = 1): number {

    // get the total in bytes per day
    let totalBytesPerDay = 0
    let activeDevices = 0
    for (let device of devices) {
        totalBytesPerDay = totalBytesPerDay + calculateDeviceUsage(device)
        if (device.quantity) {
            activeDevices += 1;
        }
    }

    // calculate bytes per day * retention period
    // calculate the total size for this ingest
    const totalBytes: number = totalBytesPerDay * (retention_periods * retention_multiplier)
    console.log(`Calculating ${activeDevices} devices -> ${totalBytes}`)
    return totalBytes
}


/**
 * Component that provides state to the app's child components.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children components.
 * @returns {ReactElement} The StateProvider component.
 */
export const StateProvider = ({children}: any) => {
    // state contains two items: 'devices' & 'actions'
    const state = useCustomState();
    return <StateContext.Provider value={state}>{children}</StateContext.Provider>;
};


/**
 * Retrieves the state store from the context using the React `useContext` hook.
 *
 * @function useStateStore
 * @returns {Object} The state store retrieved from the context.
 */
export const useStateStore = () => useContext(StateContext);
