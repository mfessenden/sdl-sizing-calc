
export default function StateReducer(state, action) {
    // 'state' is an array of devices
    const updatedState =  {...state};
    const devices = state.device_types
    // state values for the current session
    const currentState = state.current_state

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
            currentState.retention_period_id = action.value
            break;
        }

        case 'SET_RETENTION_VALUE': {
            currentState.retention_period_value = action.value
            break;
        }

        default:
            console.log(`Error: ${action.type} not caught by State reducer`);
    }
    return updatedState;
}
