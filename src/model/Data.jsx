import {createContext, useContext, useReducer} from 'react';
import {AppState, Quote} from '../types/State';
import stateReducer from './Reducers';
import {SDL_STATE} from '../Constants';
import {calculateItemUsage, humanFileSize} from '../Utils';

let DatabaseData = require('../data.json');
let InitialAppState = initializeAppState()



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
 * Returns true if the app has test data saved.
 *
 * @returns {boolean} SDL calculator data exists
 */
export function hasSavedTestData() {
    return !getSavedTestState()
}


export function getSavedTestState() {
    try {
        let savedState = require('../saved-state.json');
        return savedState
    } catch (ex) {
        console.log(`Error reading test data: ${ex}`)
        return null
    }
}


/**
 * Builds the context data for the application. Retrieves saved state data and sets default property
 * values for device types.
 *
 * @return {object} The context data object containing saved state and device type information.
 */
export function initializeAppState() {
    // let contextData = getSavedState() ?? {...DatabaseData}
    let databaseData = {...DatabaseData}

    // default property values
    const calculatorData = databaseData['calculator']

    // devices
    const devicesData = calculatorData['devices']
    const deviceDefaults = devicesData['device_defaults']
    const defaultBaseWeight = deviceDefaults['base_weight']
    const defaultEventSize = deviceDefaults['event_size']
    const defaultCategoryId = deviceDefaults['category_id']
    const defaultQuantity = deviceDefaults['quantity']

    console.log('Initializing App state...')

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
    let currentState = {...AppState}
    currentState.current_quote = {...Quote}
    databaseData.current_state = currentState

    // currentState.current_quote.devices = deviceTypes

    // live updates
    databaseData.current_state.admin_mode = process.env.SDL_ADMIN === 1
    databaseData.current_state.has_saved_data = hasSavedData()  // FIXME: this works only on load
    return databaseData
}


export const StateContext: React.Context<any | Object> = createContext(InitialAppState);


/**
 * Creates a custom state using a reducer and provides actions to manipulate the state.
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
            saveState: () => dispatch({type: 'SAVE_STATE'}),
            loadState: () => dispatch({type: 'LOAD_STATE'}),
            loadTestState: () => dispatch({type: 'LOAD_TEST_STATE'}),
            clearState: () => dispatch({type: 'CLEAR_STATE'}),
            resetAppState: () => dispatch({type: 'RESET_APP_STATE'}),
            restoreState: () => dispatch({type: 'RESTORE_STATE'}),
            toggleAdminMode: (value) => dispatch({type: 'TOGGLE_ADMIN', value}),
            updateDevice: (deviceId, payload: {deviceId: number, payload: Object}) => dispatch({type: 'UPDATE_DEVICE', deviceId, payload}),
            addDevice: (payload) => dispatch({type: 'ADD_DEVICE', payload: Object}),
            generateQuote: () => dispatch({type: 'SAVE_QUOTE_INTERNAL'}),
            saveQuote: () => dispatch({type: 'SAVE_QUOTE_EXTERNAL'}),
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
 * Calculates the current ingest quote based on the given devices, retention period, and retention interval.
 *
 * @param {Array<object>} devices - current calculator devices.
 * @param {number} retention_quantity - data retention period quantity (from the result period input).
 * @param {number} retention_interval - data retention interval (days, weeks, etc.)
 *
 * @param industry_id
 * @param industry_size
 * @param org_size
 * @return {number} total bytes of current quote.
 */
export function calculateQuote(devices, retention_quantity: number = 1, retention_interval: number = 1, industry_id: number = 1, industry_size: number = 1, org_size: number = 1): number {

    let industryMultiplier = industry_id * industry_size * org_size

    // get the total in bytes per day
    let totalBytesPerDay = 0
    let activeDevices = 0

    // for each device, calculate the usage for a given timeframe
    for (let device of devices) {
        totalBytesPerDay = totalBytesPerDay + calculateItemUsage(device)
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
