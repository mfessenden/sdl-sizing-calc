import {getSavedState} from './Data';
import {SDL_STATE} from '../Constants';
const ContextRawData = require('../data.json');


/**
 * Updates React context state. Receives actions from the GUI and updates accordinaly.
 *
 * @param {Object} state - current context state object.
 * @param {Object} action - The action object containing the action type and other relevant data.
 * @return {Object} - The updated state object.
 */
export default function stateReducer(state, action) {
    // 'state' is an array of devices
    const updatedState =  {...state};
    const devices = state.device_types

    switch (action.type) {
        case 'SET_NAME': {
            const deviceId = action.deviceId
            const deviceName = action.deviceName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.name = deviceName

            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_DISPLAY_NAME': {
            const deviceId = action.deviceId
            const displayName = action.displayName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.display_name = displayName
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_CATEGORY': {
            const deviceId = action.deviceId
            const categoryId = action.categoryId
            const device = devices.filter((d) => d.id === deviceId)[0]
            device.category_id = categoryId
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_QUANTITY': {
            const deviceId = action.deviceId
            const quantity = action.quantity

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.quantity = quantity
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_BASE_WEIGHT': {
            const deviceId = action.deviceId
            const baseWeight = action.baseWeight

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.base_weight = baseWeight
            updatedState.device_types[deviceId] = device
            break;
        }

        case 'SET_EVENT_SIZE': {
            const deviceId = action.deviceId
            const eventSize = action.eventSize

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.event_size = eventSize

            updatedState.device_types[deviceId] = device
            break;
        }

        case 'APPLY_FILTER_STRING': {
            const newFilterString = action.filterString
            // if we're setting a filter string, disable active filtering
            updatedState.current_state.filter_active = false
            state.current_state.filter_active = false
            updatedState.current_state.filter_string = newFilterString
            break;
        }

        case 'APPLY_ACTIVE_FILTER': {
            updatedState.current_state.filter_active = action.value
            updatedState.current_state.filter_string = ''
            break;
        }

        case 'SET_RETENTION_PERIOD': {
            updatedState.current_state.retention_period_id = action.value
            break;
        }

        case 'SET_RETENTION_VALUE': {
            updatedState.current_state.retention_period_value = action.value
            break;
        }

        case 'CLEAR_STATE': {
            window.localStorage.removeItem(SDL_STATE)
            console.log(`Clearing saved data...`);
            break;
        }

        // reset the ui ('reset-ui')
        case 'RESET_STATE': {
            const defaultState = {...ContextRawData }
            // updatedState.device_types = defaultState.device_types
            for (let device in updatedState.device_types) {
                updatedState.device_types[device].quantity = 0
            }

            updatedState.current_state.retention_period_id = defaultState.current_state.retention_period_id
            updatedState.current_state.retention_period_value = defaultState.current_state.retention_period_value
            console.log(`Resetting to default state...`);
            break;
        }
        // restore saved state ('restore-state')
        case 'RESTORE_STATE': {
            const savedState = getSavedState();
            if (savedState) {
                updatedState.device_types = savedState.device_types;
                updatedState.current_state = savedState.current_state
                console.log(`Restoring saved state...`);
            } else {
                console.log(`Error: No saved state found...`);
            }
            break;
        }


        default:
            console.log(`Error: ${action.type} not caught by State reducer`);
    }
    return updatedState;
}
