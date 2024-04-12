import {createContext, useContext, useReducer} from 'react';
var ContextRawData = require('../data.json');
var ContextData = buildDataContext()


// Loads the current data from disk. Updates data for use as a data model
export function buildDataContext() {
    // create a copy of the original
    const contextData = { ...ContextRawData };


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
        deviceType.quantity = defaultQuantity
    }

    return contextData
}


export const StateContext = createContext(ContextData);


// Update the state date with actions
export function StateReducer(state, action) {
    // 'state' is an array of devices
    const updatedState =  {...state};
    const devices = state.device_types
    // state values for the current session
    const currentState = state.current_state
    const interfaceData = state.interface_data

    switch (action.type) {
        case 'SET_NAME': {
            const deviceId = action.deviceId
            const deviceName = action.deviceName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.name = deviceName

            console.log(`Setting name: '${deviceName}' for device: ${deviceId}`);
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_DISPLAY_NAME': {
            const deviceId = action.deviceId
            const displayName = action.displayName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.display_name = displayName
            console.log(`Setting display name: '${displayName}' for device: ${deviceId}`);
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_QUANTITY': {
            const deviceId = action.deviceId
            const quantity = action.quantity

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.quantity = quantity
            console.log(`Setting quantity: ${quantity} for device: ${deviceId}`);
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_BASE_WEIGHT': {
            const deviceId = action.deviceId
            const baseWeight = action.baseWeight

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.base_weight = baseWeight
            console.log(`Setting base weight: ${baseWeight} for device: ${deviceId}`);
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_EVENT_SIZE': {
            const deviceId = action.deviceId
            const eventSize = action.eventSize

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.event_size = eventSize

            console.log(`Setting event size: ${eventSize} for device: ${deviceId}`);
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'APPLY_FILTER_STRING': {
            const newFilterString = action.filterString
            currentState.filter_string = newFilterString
            if (!newFilterString) {
                console.log(`Clearing filter string...`);
            } else {
                console.log(`Applying filter string: '${newFilterString}'`);
            }
            break;
        }

        case 'APPLY_ACTIVE_FILTER': {
            currentState.filter_active = action.value
            const filterDescription = (currentState.filter_active) ? 'on' : 'off'
            console.log(`Filter active items is ${filterDescription}`);
            break;
        }

        case 'SET_RETENTION_PERIOD': {
            const retentionPeriods = interfaceData.retention_periods
            const retentionData = retentionPeriods.filter((d) => d.id === action.value)[0]
            console.log(`Setting retention period: ${action.value} (${retentionData.name})`);
            currentState.retention_period_id = action.value
            break;
        }

        case 'SET_RETENTION_VALUE': {
            currentState.retention_period_value = action.value
            break;
        }

        case 'SET_EMPLOYEE_COUNT': {
            currentState.employee_count = action.value
            break;
        }

        case 'SET_SEAT_COUNT': {
            currentState.soar_seats = action.value
            break;
        }


        default:
            console.log(`Error: ${action.type} not caught by State reducer`);
    }
    return updatedState;
}


export const useCustomState = (defaultState = ContextData) => {
    const [state, dispatch] = useReducer(StateReducer, defaultState);
    return {
        state,
        actions: {
            setName: (deviceId, deviceName) => dispatch({type: 'SET_NAME', deviceId, deviceName }),
            setDisplayName: (deviceId, displayName) => dispatch({type: 'SET_DISPLAY_NAME', deviceId, displayName }),
            setQuantity: (deviceId, quantity) => dispatch({type: 'SET_QUANTITY', deviceId, quantity }),
            setBaseWeight: (deviceId, baseWeight) => dispatch({type: 'SET_BASE_WEIGHT', deviceId, baseWeight }),
            setEventSize: (deviceId, eventSize) => dispatch({type: 'SET_EVENT_SIZE', deviceId, eventSize }),
            applyFilterString: (filterString) => dispatch({type: 'APPLY_FILTER_STRING', filterString }),
            applyActiveFilter: (value) => dispatch({type: 'APPLY_ACTIVE_FILTER', value }),
            setRetentionPeriod: (value) => dispatch({type: 'SET_RETENTION_PERIOD', value }),
            setRetentionValue: (value) => dispatch({type: 'SET_RETENTION_VALUE', value }),
            setEmployeeCount: (value) => dispatch({type: 'SET_EMPLOYEE_COUNT', value }),
            setSeatCount: (value) => dispatch({type: 'SET_SEAT_COUNT', value }),
        },
    };
};


export const StateProvider = ({ children }: any) => {
    // state contains two items: 'devices' & 'actions'
    const state = useCustomState();
    return <StateContext.Provider value={state}>{children}</StateContext.Provider>;
};


// returns the context JSON data
export const useStateStore = () => useContext(StateContext);
