import {createContext, useContext} from 'react';
var jsonData = require('./data.json');


// Represents one of the row items in a dropdown table.
// Slider represents the quantity value
class Device {
    id: number;
    name: string
    display_name: string
    quantity: number = 0;
    event_size: number = 0;
    base_weight: number = 1;
    constructor(name: string, display_name: string, event_size: number = 0, base_weight: number = 1) {
        this.name = name;
        this.display_name = display_name;
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
    constructor(categories, periods, table_items) {
        this.categories = categories
        this.periods = periods
        this.table_items = table_items
    }
    getCategoryDisplayName(category_id: number) {
        for (const category: Category in this.categories) {
            if (category.id === category_id) {
                return category.display_name
            }
        }
        return null
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
export default function buildDataContext() {
    const defaults = jsonData['defaults']

    // default property values
    const default_event_size = defaults['device_type_event_size']
    const default_base_weight = defaults['device_base_weight']
    const default_category = defaults['device_type_category']


    // data for the table items
    const categories = jsonData['categories']
    const periods = jsonData['retention_periods']
    const device_types = jsonData['device_types']

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
            const deviceCategory = device.category ? device.category : default_category;

            if (deviceCategory === category.name) {
                const eventSize = device.event_size ? device.event_size : default_event_size;
                const baseWeight = device.base_weight ? device.base_weight : default_base_weight;
                const table_device: Device = new Device(device.name, device.display_name, eventSize, baseWeight)
                table_item.addDevice(table_device)
            }
        }
    }

    for (const period of periods) {
        const periodObj = new Period(period.id, period.name, period.display_name)
        period_items.push(periodObj)
    }

    const data_model: DataContext = new DataContext(category_items, period_items, table_items)
    return data_model
}


// create a context with data model object
export const StateContext = createContext(buildDataContext());

// returns the context data model
export const useStateStore = () => useContext(StateContext);



// Stubs for reducer handlers
function setDeviceQuantity(device: Device, quantity: number) {}
