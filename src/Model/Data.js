import {createContext, useContext, useReducer} from 'react';
import StateReducer from './Reducers';
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
            return value;
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
    var contextData = getSavedState() ?? {...ContextRawData }
    // default property values
    const deviceDefaults = contextData['device_type_defaults']
    const defaultBaseWeight = deviceDefaults['base_weight']
    const defaultEventSize = deviceDefaults['event_size']
    const defaultCategoryId = deviceDefaults['category_id']
    const defaultQuantity = deviceDefaults['quantity']


    // devices
    const deviceTypes = contextData['device_types']

    // set defaults if not present
    for (const deviceType of deviceTypes) {
        deviceType.base_weight = deviceType.base_weight ? deviceType.base_weight : defaultBaseWeight
        deviceType.event_size = deviceType.event_size ? deviceType.event_size : defaultEventSize
        deviceType.category_id = deviceType.category_id ? deviceType.category_id : defaultCategoryId
        deviceType.quantity = deviceType.quantity ? deviceType.quantity : defaultQuantity
    }

    return contextData
}


export const StateContext = createContext(ContextData);


export const useCustomState = (defaultState = ContextData) => {
    const [state, dispatch] = useReducer(StateReducer, defaultState);
    return {
        state,
        actions: {
            setName: (deviceId, deviceName) => dispatch({type: 'SET_NAME', deviceId, deviceName }),
            setDisplayName: (deviceId, displayName) => dispatch({type: 'SET_DISPLAY_NAME', deviceId, displayName }),
            setCategory: (deviceId, categoryId) => dispatch({type: 'SET_CATEGORY', deviceId, categoryId }),
            setQuantity: (deviceId, quantity) => dispatch({type: 'SET_QUANTITY', deviceId, quantity }),
            setBaseWeight: (deviceId, baseWeight) => dispatch({type: 'SET_BASE_WEIGHT', deviceId, baseWeight }),
            setEventSize: (deviceId, eventSize) => dispatch({type: 'SET_EVENT_SIZE', deviceId, eventSize }),
            applyFilterString: (filterString) => dispatch({type: 'APPLY_FILTER_STRING', filterString }),
            applyActiveFilter: (value) => dispatch({type: 'APPLY_ACTIVE_FILTER', value }),
            setRetentionPeriod: (value) => dispatch({type: 'SET_RETENTION_PERIOD', value }),
            setRetentionValue: (value) => dispatch({type: 'SET_RETENTION_VALUE', value }),
            clearState: () => dispatch({type: 'CLEAR_STATE'}),
            resetState: () => dispatch({type: 'RESET_STATE'}),
            restoreState: () => dispatch({type: 'RESTORE_STATE'}),
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
export const StateProvider = ({ children }: any) => {
    // state contains two items: 'devices' & 'actions'
    const state = useCustomState();
    return <StateContext.Provider value={state}>{children}</StateContext.Provider>;
};


/**
 * Retrieve the state store from React.
 */
export const useStateStore = () => useContext(StateContext);
