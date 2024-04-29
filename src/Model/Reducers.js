import {getSavedState} from './Data';
import {SDL_STATE} from '../Constants';
import {AppState} from '../types/State';
const ContextRawData = require('../data.json');


/**
 * Updates React context state. Receives actions from the GUI and updates accordingly.
 *
 * @param {Object} state - current context state object.
 * @param {Object} action - The action object containing the action type and other relevant data.
 * @return {Object} - The updated state object.
 */
export default function stateReducer(state, action) {
    // 'state' is an array of devices
    const updatedState =  {...state};
    const devices = updatedState.calculator.devices.device_items

    switch (action.type) {
        case 'SET_NAME': {
            const deviceId = action.deviceId
            const deviceName = action.deviceName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.name = deviceName

            updatedState.calculator.devices.device_items[deviceId] = device
            break;
        }

        case 'SET_DISPLAY_NAME': {
            const deviceId = action.deviceId
            const displayName = action.displayName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.display_name = displayName
            updatedState.calculator.devices.device_items[deviceId] = device
            break;
        }

        case 'SET_CATEGORY': {
            const deviceId = action.deviceId
            const categoryId = action.categoryId
            const device = devices.filter((d) => d.id === deviceId)[0]
            let currentCategoryId = device.category_id
            device.category_id = categoryId
            updatedState.calculator.devices.device_items[deviceId] = device
            console.log(`Device '${device.name}' category updated: ${currentCategoryId} -> ${categoryId}`)
            break;
        }

        case 'SET_QUANTITY': {
            const deviceId = action.deviceId
            const quantity = Number(action.quantity)
            const device = devices.filter((d) => d.id === deviceId)[0]
            device.quantity = quantity
            updatedState.calculator.devices.device_items[deviceId] = device
            break;
        }

        case 'SET_BASE_WEIGHT': {
            const deviceId = action.deviceId
            const baseWeight = action.baseWeight

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.base_weight = baseWeight
            updatedState.calculator.devices.device_items[deviceId] = device
            break;
        }

        case 'SET_EVENT_SIZE': {
            const deviceId = action.deviceId
            const eventSize = action.eventSize

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.event_size = eventSize
            updatedState.calculator.devices.device_items[deviceId] = device
            break;
        }

        case 'APPLY_FILTER_STRING': {
            const newFilterString = action.filterString
            // if we're setting a filter string, disable active filtering
            updatedState.current_state.filter_active = false
            // state.current_state.filter_active = false
            updatedState.current_state.filter_string = newFilterString
            break;
        }

        case 'APPLY_ACTIVE_FILTER': {
            updatedState.current_state.filter_active = action.value
            updatedState.current_state.filter_string = ''
            break;
        }

        case 'SET_RETENTION_MULTIPLIER': {  // TODO: rename SET_RETENTION_MULTIPLIER
            updatedState.current_state.retention_multiplier = action.value
            console.log(`Setting retention period: ${updatedState.current_state.retention_multiplier}`);
            break;
        }

        case 'SET_RETENTION_PERIODS': {
            updatedState.current_state.retention_periods = action.value
            break;
        }

        case 'CLEAR_STATE': {
            window.localStorage.removeItem(SDL_STATE)
            console.log(`Clearing saved data...`);
            updatedState.current_state.has_saved_data = false
            break;
        }

        // reset the ui ('reset-ui')
        case 'RESET_STATE': {
            const defaultState = {...ContextRawData }
            defaultState.current_state = AppState
            // updatedState.calculator.devices.device_items = defaultState.device_types
            for (let device in updatedState.calculator.devices.device_items) {
                updatedState.calculator.devices.device_items[device].quantity = 0
            }
            updatedState.current_state.retention_multiplier = AppState.retention_multiplier
            updatedState.current_state.retention_periods = AppState.retention_periods
            break;
        }
        // restore saved state ('restore-state')
        case 'RESTORE_STATE': {
            const savedState = getSavedState();
            updatedState.current_state.has_saved_data = savedState
            if (savedState) {
                updatedState.calculator.devices.device_items = savedState.calculator.devices.device_items;
                updatedState.current_state = savedState.current_state
                console.log(`Restoring saved state...`);
            } else {
                console.log(`Error: No saved state found...`);
            }
            break;
        }

        case 'TOGGLE_ADMIN': {
            updatedState.current_state.admin_mode = action.value
            state.current_state.admin_mode = action.value
            console.log(`Admin mode: ${action.value ? 'On': 'Off'}`);
            break;
        }

        case 'UPDATE_DEVICE': {
            console.log(`Updating device ${action.deviceId}`)
            break;
        }

        case 'ADD_DEVICE': {
            console.log('Adding device:')
            console.log(action.payload)
            break;
        }


        default:
            console.log(`Error: ${action.type} not caught by State reducer`);
    }
    return updatedState;
}
