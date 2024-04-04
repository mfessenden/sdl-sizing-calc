var jsonData = require('./data.json');


// Represents one of the row items in a dropdown table.
// Slider represents the quantity value
class Device {
    quantity = 0;
    event_size = 0;
    base_weight = 1;
    constructor(name, display_name, event_size=0, base_weight=1) {
        this.name = name;
        this.display_name = display_name;
        this.event_size = event_size;
        this.base_weight = base_weight;
    }
}


// Represents a dropdown table payload
class AccordionTableItem {
    devices = []
    constructor(name, display_name, devices=[]) {
        this.name = name;
        this.display_name = display_name;
        this.devices = devices;
    }
    addDevice(device) {
        this.devices.push(device)
    }
}


class DataModel {
    columns = []
    table_items = []
    constructor(columns, table_items=[]) {
        this.columns = columns;
        this.table_items = table_items;
    }
}


// Loads the current data from disk and returns a data object
// for use in the app
export default function loadData() {
    const defaults = jsonData['defaults']

    // default property values
    const default_event_size = defaults['device_type_event_size']
    const default_base_weight = defaults['device_base_weight']
    const default_category = defaults['device_type_category']
    const default_columns = defaults['columns']

    // data for the table items
    const categories = jsonData['categories']
    const device_types = jsonData['device_types']

    // result table items
    const table_items = []

    // iterate categories to build the table items
    for (const category of categories) {
        const table_item: AccordionTableItem = new AccordionTableItem(category.name, category.display_name);
        table_items.push(table_item)
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

    const data_model: DataModel = new DataModel(default_columns, table_items)
    return data_model
}
