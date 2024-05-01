import {createContext, useContext, useReducer} from 'react';
import {AppState, Quote} from '../types/State';
import stateReducer from './Reducers';
import {SDL_STATE} from '../Constants';
import {calculateDeviceUsage, humanFileSize} from '../Utils';

var ContextRawData = require('../data.json');
var ContextData = initializeDatabase()


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
export function initializeDatabase() {
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

    console.log('Initializing database...')

    // devices
    const deviceTypes = devicesData['device_items']


    // set defaults if not present
    for (const deviceType of deviceTypes) {
        deviceType.base_weight = deviceType.base_weight ? deviceType.base_weight : defaultBaseWeight
        deviceType.event_size = deviceType.event_size ? deviceType.event_size : defaultEventSize
        deviceType.category_id = deviceType.category_id ? deviceType.category_id : defaultCategoryId
        deviceType.quantity = deviceType.quantity ? deviceType.quantity : defaultQuantity
    }

    // add app state & quote
    contextData['current_state'] = {...AppState}
    contextData.current_state.current_quote = {...Quote}
    contextData.current_state.admin_mode = process.env.SDL_ADMIN === 1
    contextData.current_state.has_saved_data = hasSavedData()
    return contextData
}


export const StateContext: React.Context<any | Object> = createContext(ContextData);


/**
 * Creates a custom state using a reducer and provides actions to manipulate the state.
 *
 * @param {Object} defaultState - default state to initialize the custom state with.
 * @returns {Object} An object containing the custom state and actions to manipulate the state.
 */
export const useCustomState = (defaultState = initializeDatabase()) => {
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
            loadState: () => dispatch({type: 'LOAD_STATE'}),
            clearState: () => dispatch({type: 'CLEAR_STATE'}),
            resetState: () => dispatch({type: 'RESET_STATE'}),
            restoreState: () => dispatch({type: 'RESTORE_STATE'}),
            toggleAdminMode: (value) => dispatch({type: 'TOGGLE_ADMIN', value}),
            updateDevice: (deviceId, payload) => dispatch({type: 'UPDATE_DEVICE', deviceId, payload}),
            addDevice: (payload) => dispatch({type: 'ADD_DEVICE', payload}),
            generateQuote: () => dispatch({type: 'GENERATE_QUOTE'}),
            toggleResultAsBinary: () => dispatch({type: 'TOGGLE_RESULT_BINARY'}),
            inputWeightChanged: (inputId, inputWeight) => dispatch({type: 'INPUT_WEIGHT_CHANGED', inputId, inputWeight}),
        },
    };
};


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
export const useStateStore = (): any => useContext(StateContext);



// Helper Functions


/**
 * Calculates the current ingest quote based on the given devices, retention period, and retention multiplier.
 *
 * @param {Array<object>} devices - current calculator devices.
 * @param {number} retention_quantity - data retention period quantity (from the result period input).
 * @param {number} retention_interval - data retention multiplier (days, weeks, etc.)
 *
 * @param industry_weight
 * @param industry_size_weight
 * @param org_size_weight
 * @return {number} total bytes of current quote.
 */
export function calculateQuote(devices, retention_quantity: number = 1, retention_interval: number = 1, industry_weight: number = 1, industry_size_weight: number = 1, org_size_weight: number = 1): number {

    let industryMultiplier = industry_weight * industry_size_weight * org_size_weight

    // get the total in bytes per day
    let totalBytesPerDay = 0
    let activeDevices = 0

    // for each device, calculate the usage for a given timeframe
    for (let device of devices) {
        totalBytesPerDay = totalBytesPerDay + calculateDeviceUsage(device)
        if (device.quantity) {
            activeDevices += 1;
        }
    }

    // calculate bytes per day * retention period
    // calculate the total size for this ingest
    let totalBytes: number = totalBytesPerDay * (retention_quantity * retention_interval)

    // weighted industry values
    totalBytes = totalBytes * industryMultiplier

    var logMsg: string = `Calculating... No active devices.`
    if (activeDevices) {
        logMsg = `Calculating ${activeDevices} devices: ${humanFileSize(totalBytes)}`
    }

    console.log(logMsg)
    return totalBytes
}


// TODO: grab input from 'AppState.current_quote'
export function saveQuote(devices, retention_quantity: number = 1, retention_interval: number = 1): void {

}
