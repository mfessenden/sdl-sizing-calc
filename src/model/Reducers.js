import {saveCurrentState} from './Data';
import {Quote} from '../types';


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
    const currentState = updatedState.current_state
    const currentQuoteData = currentState.current_quote

    switch (action.type) {
        case 'SET_NAME': {
            const deviceId = action.deviceId
            const deviceName = action.deviceName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.name = deviceName
            break;
        }

        case 'SET_DISPLAY_NAME': {
            const deviceId = action.deviceId
            const displayName = action.displayName

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.display_name = displayName
            break;
        }

        case 'SET_CATEGORY': {
            const deviceId = action.deviceId
            const categoryId = action.categoryId
            const device = devices.filter((d) => d.id === deviceId)[0]
            device.category_id = categoryId
            break;
        }

        case 'SET_QUANTITY': {
            const deviceId = action.deviceId
            const quantity = Number(action.quantity)
            const device = devices.filter((d) => d.id === deviceId)[0]
            device.quantity = Math.round(quantity)
            break;
        }

        case 'SET_BASE_WEIGHT': {
            const deviceId = action.deviceId
            const baseWeight = action.baseWeight

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.base_weight = baseWeight
            break;
        }

        case 'SET_EVENT_SIZE': {
            const deviceId = action.deviceId
            const eventSize = action.eventSize

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.event_size = eventSize
            break;
        }

        case 'APPLY_FILTER_STRING': {
            const newFilterString = action.filterString
            // if we're setting a filter string, disable active filtering
            currentState.filter_active = false
            currentState.filter_string = newFilterString
            break;
        }

        case 'APPLY_ACTIVE_FILTER': {
            currentState.filter_active = action.value
            currentState.filter_string = ''
            break;
        }

        case 'SET_RETENTION_INTERVAL': {
            currentQuoteData.retention_interval = action.value
            break;
        }

        case 'SET_RETENTION_PERIODS': {
            currentQuoteData.retention_quantity = action.value
            break;
        }

        // reset the app ui state
        case 'RESET_APP_STATE': {
            for (let device of updatedState.calculator.devices.device_items) {
                device.quantity = 0
            }
            updatedState.current_state.current_quote = {...Quote}
            updatedState.current_state.filter_active = false
            updatedState.current_state.filter_string = null
            break;
        }

        case 'INPUT_WEIGHT_CHANGED': {
            const inputWeight = action.inputWeight
            const inputId = action.inputId

            switch (inputId) {
                // industry
                case 0: {
                    currentQuoteData.industry_id = inputWeight
                    break;
                }
                case 1: {
                    currentQuoteData.industry_size = inputWeight
                    break;
                }
                case 2: {
                    currentQuoteData.org_size = inputWeight
                    break;
                }
                default:
                    console.log(`Error: invalid input id ${inputId} `);
            }
            break;
        }

        // user sets the device EPS manually
        case 'UPDATE_EPS': {
            const deviceId = action.deviceId
            const eventsPerSecond = action.eventsPerSecond

            const device = devices.filter((d) => d.id === deviceId)[0]
            device.eps = eventsPerSecond
            break;
        }

        default:
            console.log(`Error: ${action.type} not caught by State reducer`);
    }
    // save the current state
    saveCurrentState(updatedState)
    return updatedState;
}
