import {createContext, useContext, useReducer, useEffect} from 'react';
var ContextRawData = require('../data.json');


const RESULT_CONTEXT = {
    period: 0,
    usage: 0,   // total usage (in GB)
    actions: {
        setPeriod: (period_id) => {},  // handles retention period tab change
    },
};


export function ContextReducer() {
    const [state, dispatch] = useReducer(reducer, buildDataContext())
    const updatedState = { ...state };
    return updatedState;
}

function reducer(data, action) {
    switch (action.type) {
        case 'set_quantity':
            const deviceId = action.device_id
        default:
            throw new Error();
    }
}


export function setDeviceQuantity(deviceId: number, quantity: number) {
    const contextData = buildDataContext();
    const deviceTypes = contextData['device_types']


    for (const deviceType of deviceTypes) {
        if(deviceType.id === deviceId) {
            deviceType.quantity = quantity
            console.log(`Updating quantity: '${deviceType.name}' -> '${deviceType.quantity}'`)
        }
    }
}


// example from 'database.ts'
// export const getCommentsByObj = (query: object) => getAllByObj(COMMENT_TABLE, query);



export const ResultContext = createContext(RESULT_CONTEXT);

export const useResultStore = () => useContext(ResultContext);


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


// create a context with data model object
const StateContext = createContext(buildDataContext());

// returns the context data model
const useStateStore = () => useContext(StateContext);


export function StateReducer(state, action) {
    const updatedState = { ...state };
    switch (action.type) {
        case 'SET_QUANTITY': {
            updatedState.theme = action.theme;
            break;
        }
        default:
            console.log(`Error: ${action.type} not caught by State reducer`);
    }
    return updatedState;
}


export const useCustomState = (defaultState=buildDataContext()) => {
    const [state, dispatch] = useReducer(StateReducer, defaultState);
    return {
        ...state,
        actions: {
            setQuantity: (id, quantity) => dispatch({ type: 'SET_QUANTITY', id, quantity }),
        },
    };
};


const StateProvider = ({ children }: any) => {
    const state = useCustomState();
    return <StateContext.Provider value={state}>{children}</StateContext.Provider>;
};


export {
    StateContext,
    StateProvider,
    useStateStore,
}
