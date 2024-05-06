import {getSavedState, getSavedTestState} from './Data';
import {SDL_STATE} from '../Constants';
import {AppState, Quote} from '../types/State';
import {generateQuote} from '../Utils';
import {saveExternalQuote} from '../Utils';


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
            let currentCategoryId = device.category_id
            device.category_id = categoryId
            console.log(`Device '${device.name}' category updated: ${currentCategoryId} -> ${categoryId}`)
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
            console.log(`-> Setting retention interval: ${updatedState.current_state.current_quote.retention_interval}`);  // TODO: update this after testing
            break;
        }

        case 'SET_RETENTION_PERIODS': {
            currentQuoteData.retention_quantity = action.value
            console.log(`-> Setting retention quantity: ${updatedState.current_state.current_quote.retention_quantity}`);  // TODO: update this after testing
            break;
        }

        case 'SAVE_STATE': {
            console.log(`Clearing saved data...`);
            window.localStorage.removeItem(SDL_STATE)
            console.log(`-> Saving current state...`);

            // set localstorage value TODO: persistence via Firebase?
            window.localStorage.setItem(SDL_STATE, JSON.stringify(updatedState));
            break;
        }

        case 'CLEAR_STATE': {
            window.localStorage.removeItem(SDL_STATE)
            console.log(`-> Clearing saved data...`);
            // updatedState.current_state.has_saved_data = false
            break;
        }

        // reset the app ui state
        case 'RESET_APP_STATE': {
            for (let device of updatedState.calculator.devices.device_items) {
                device.quantity = 0
            }

            console.log(`-> Resetting app state...`)
            updatedState.current_state.current_quote = {...Quote}
            console.log(`-> Returning state: `)
            console.log(updatedState.current_state)
            break;
        }

        // restore saved state ('restore-state')
        case 'RESTORE_STATE': {
            const savedState = getSavedState();
            if (savedState) {
                updatedState.calculator.devices.device_items = savedState.calculator.devices.device_items
                // TODO: this might not be updating correctly
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

        case 'SAVE_QUOTE_INTERNAL': {
            console.log('Generating quote...')
            let quote = generateQuote(devices)
            console.log(quote)
            //quote.retention_interval = updatedState.current_state
            break;
        }

        case 'SAVE_QUOTE_EXTERNAL': {
            let quote = generateQuote(devices)

            // pass data from current
            const currentQuote = updatedState.current_state.current_quote
            quote.data.retention_interval = currentQuote.retention_interval
            quote.data.retention_quantity = currentQuote.retention_quantity
            quote.data.industry_id = currentQuote.industry_id
            quote.data.industry_size = currentQuote.industry_size
            quote.data.org_size = currentQuote.org_size
            console.log('Saving current quote...')
            saveExternalQuote(quote)
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
                    currentQuoteData.industry_id = inputWeight
                    console.log(`Setting industry id weight: ${inputWeight}`)
                    console.log(inputWeight)
                    break;
                }
                case 1: {
                    currentQuoteData.industry_size = inputWeight
                    console.log(`Setting industry size weight: ${inputWeight}`)
                    break;
                }
                case 2: {
                    currentQuoteData.org_size = inputWeight
                    console.log(`Setting organization weight: ${inputWeight}`)
                    break;
                }
                default:
                    console.log(`Error: invalid inout id ${inputId} `);
            }
            break;
        }

        case 'LOAD_TEST_STATE': {
            const savedState = getSavedTestState()
            if (savedState) {
                updatedState.calculator.devices.device_items = savedState.calculator.devices.device_items
                // TODO: this might not be updating correctly
                updatedState.current_state = savedState.current_state
                console.log(`Restoring test state...`);
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
