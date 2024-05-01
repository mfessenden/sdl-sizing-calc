import {getSavedState} from './Data';
import {SDL_STATE} from '../Constants';
import {AppState, Quote} from '../types/State';
import {generateQuote} from '../Utils';

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
    const updatedState = {...state};
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
            device.quantity = Math.round(quantity)
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
            updatedState.current_state.filter_string = newFilterString
            break;
        }

        case 'APPLY_ACTIVE_FILTER': {
            updatedState.current_state.filter_active = action.value
            updatedState.current_state.filter_string = ''
            break;
        }

        case 'SET_RETENTION_INTERVAL': {
            updatedState.current_state.current_quote.data.retention_interval = action.value
            console.log(`Setting retention interval: ${updatedState.current_state.current_quote.data.retention_interval}`);
            break;
        }

        case 'SET_RETENTION_PERIODS': {
            updatedState.current_state.current_quote.data.retention_quantity = action.value
            break;
        }

        case 'SAVE_STATE': {
            console.log(`Clearing saved data...`);
            window.localStorage.removeItem(SDL_STATE)
            console.log(`Saving current state...`);

            // set localstorage value TODO: persistence via Firebase?
            window.localStorage.setItem(SDL_STATE, JSON.stringify(updatedState));
            updatedState.current_state.has_saved_data = true
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
            const defaultState = {...ContextRawData}
            defaultState.current_state = {...AppState}
            for (let device in updatedState.calculator.devices.device_items) {
                updatedState.calculator.devices.device_items[device].quantity = 0
            }
            updatedState.current_state.current_quote = {...Quote}
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
            console.log(`Admin mode: ${action.value ? 'On' : 'Off'}`);
            break;
        }

        case 'UPDATE_DEVICE': {
            console.log(`Updating device ${action.deviceId}`)
            break;
        }

        case 'ADD_DEVICE': {
            const newDevice = action.payload
            console.log(`Adding device:  '${newDevice.name}'`)
            const currentDevices = updatedState.calculator.devices.device_items
            currentDevices.push(newDevice)
            updatedState.calculator.devices.device_items = currentDevices
            break;
        }

        case 'GENERATE_QUOTE': {
            console.log('Generating quote...')
            let quote = generateQuote(devices)
            console.log(quote)
            quote.retention_interval = updatedState.current_state
            break;
        }

        case 'TOGGLE_RESULT_BINARY': {
            const toggledValue = !updatedState.current_state.result_as_binary
            console.log(`Changing byte mode: ${toggledValue}`)
            updatedState.current_state.result_as_binary = toggledValue
            break;
        }

        case 'INPUT_WEIGHT_CHANGED': {
            const inputWeight = action.inputWeight
            const inputId = action.inputId

            switch (inputId) {
                // industry
                case 0: {
                    updatedState.current_state.current_quote.industry_id = inputWeight
                    console.log(`Setting industry id weight: ${inputWeight}`)
                    break;
                }
                case 1: {
                    updatedState.current_state.current_quote.industry_size = inputWeight
                    console.log(`Setting industry size weight: ${inputWeight}`)
                    break;
                }
                case 2: {
                    updatedState.current_state.current_quote.org_size = inputWeight
                    console.log(`Setting organization weight: ${inputWeight}`)
                    break;
                }
                default:
                    console.log(`Error: invalid inout id ${inputId} `);
            }
            break;
        }

        default:
            console.log(`Error: ${action.type} not caught by State reducer`);
    }

    return updatedState;
}
