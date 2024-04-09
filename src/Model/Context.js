import {createContext, useContext} from 'react';

var jsonData = require('../data.json');


// Represents one of the row items in a dropdown table.
// Slider represents the quantity value
class Device {
    id: number;
    name: string
    display_name: string
    category_id: number
    quantity: number = 0;
    event_size: number = 0;
    base_weight: number = 1;
    constructor(id: number, name: string, display_name: string, category_id: number, event_size: number = 0, base_weight: number = 1) {
        this.id = id;
        this.name = name;
        this.display_name = display_name;
        this.category_id = category_id;
        this.event_size = event_size;
        this.base_weight = base_weight;
    }
}


class Category {
    id: number;
    name: string
    display_name: string
    constructor(id: number, name: string, display_name: string) {
        this.id = id;
        this.name = name;
        this.display_name = display_name;
    }
}


class Period {
    id: number;
    name: string
    display_name: string
    constructor(id: number, name: string, display_name: string) {
        this.id = id;
        this.name = name;
        this.display_name = display_name;
    }
}


// Represents a dropdown table payload
class CalculatorTable {
    category_id: number
    display_name: string
    devices: Array<Device> = []

    constructor(category_id: number, display_name: string) {
        this.category_id = category_id
        this.display_name = display_name
    }

    addDevice(device) {
        this.devices.push(device)
    }
}


// data model delegate class
class DataContext {
    categories: Array<Category> = []
    periods: Array<Period> = []
    table_items: Array<CalculatorTable> = []
    columns: Array<string> = []  // table column names
    constructor(categories, periods, table_items, columns) {
        this.categories = categories
        this.periods = periods
        this.table_items = table_items
        this.columns = columns
    }
    getCategoryDisplayName(category_id: number) {
        for (const category: Category in this.categories) {
            if (category.id === category_id) {
                return category.display_name
            }
        }
        return null
    }

    setDeviceQuantity(device_id: number, quantity: number) {

        for (const table_item: CalculatorTable in this.table_items) {
            for (const device: Device in table_item.devices) {
                if (device.id === device_id) {
                    console.log(`Updating device id: ${device_id} -> ${quantity}`)
                    device.quantity = quantity
                }
            }
        }
    }
}


// TODO: add reducer
const RESULT_CONTEXT = {
    period: 0,
    usage: 0,   // total usage (in GB)
    actions: {
        setPeriod: (period_id) => {},  // handles retention period tab change
    },
};


export const ResultContext = createContext(RESULT_CONTEXT);
export const useResultStore = () => useContext(ResultContext);


// TODO: build a thin wrapper around JSON data, don't use classes
// Loads the current data from disk and returns a data object
// for use in the app
export function buildDataContext() {
    // create a copy of the original
    const contextData = { ...jsonData };
    const defaults = contextData['defaults']

    // default property values
    const default_event_size = defaults['device_type_event_size']
    const default_base_weight = defaults['device_base_weight']
    const default_category_id = defaults['device_type_category_id']
    const columns = defaults['columns']


    // data for the table items
    const categories = contextData['categories']
    const periods = contextData['retention_periods']
    const device_types = contextData['device_types']

    // result table items
    const table_items = []
    const category_items = []
    const period_items = []

    // iterate categories to build the table items
    for (const category of categories) {
        const categoryObj = new Category(category.id, category.name, category.display_name)
        const table_item: CalculatorTable = new CalculatorTable(category.id, category.display_name);
        table_items.push(table_item)
        category_items.push(categoryObj)

        // build device types
        for (const device of device_types) {

            // use default category of 'infrastructure' if not specified
            const deviceCategoryId = device.category_id ? device.category_id : default_category_id;

            if (deviceCategoryId === category.id) {
                const eventSize = device.event_size ? device.event_size : default_event_size;
                const baseWeight = device.base_weight ? device.base_weight : default_base_weight;
                const table_device: Device = new Device(device.id, device.name, device.display_name, device.category_id, eventSize, baseWeight)
                table_item.addDevice(table_device)
            }
        }
    }

    for (const period of periods) {
        const periodObj = new Period(period.id, period.name, period.display_name)
        period_items.push(periodObj)
    }

    return new DataContext(category_items, period_items, table_items, columns)
}


// create a context with data model object
const StateContext = createContext(buildDataContext());

// returns the context data model
const useStateStore = () => useContext(StateContext);


// Stubs for reducer handlers
function setDeviceQuantity(device: Device, quantity: number) {}


export {
    Category,
    Device,
    Period,
    CalculatorTable,
    DataContext,
    StateContext,
    useStateStore,
}
