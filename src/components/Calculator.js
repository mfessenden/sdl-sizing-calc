import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';
import {useStateStore} from '../model/Data';
import {bytesToGigs, calculateItemUsage, numberToString} from '../Utils';


const headerData = [
    {
        id: 0,
        display_name: 'Device Type',
        align_center: false
    },
    {
        id: 1,
        display_name: 'Quantity',
        description: 'Number of Devices',
        align_center: true
    },
    {
        id: 2,
        display_name: 'EPS',
        description: 'Events per Second',
        align_center: true
    },
    {
        id: 3,
        display_name: 'GB/Day',
        align_center: true
    }
]


/**
 * Renders a table row component for a device.
 *
 * @param {object} device - The device object.
 *
 * @returns {JSX.Element} - The rendered table row.
 */
function CalculatorTableRow({device}) {
    const {actions: {setQuantity}} = useStateStore();

    const eventsPerSecond = device.quantity * device.base_weight
    const bytesPerDay = calculateItemUsage(device)
    const gigsPerDay = bytesToGigs(bytesPerDay)

    return (
        <tr key={device.id}>
            <td className='category-table-description'>
                <RangeSlider
                    device={device}
                    onChange={e => setQuantity(device.id, e.target.value)}
                />
            </td>
            <td className='category-table-numeric'>
                <Form.Control
                    className='text-center'
                    type='number'
                    pattern='[0-9]'
                    onChange={e => setQuantity(device.id, e.target.value)}
                    value={Number(device.quantity)}
                />
            </td>
            <td className='text-center category-table-numeric'>
                <Form.Text key={device.id} type='number'>
                    {numberToString(eventsPerSecond)}
                </Form.Text>
            </td>
            <td className='text-center category-table-numeric'>
                <Form.Text key={device.id} type='number'>
                    {numberToString(gigsPerDay)}
                </Form.Text>
            </td>
        </tr>
    )
}


/**
 * Renders a table for a given category & associated devices.
 *
 * @param {Object} table_item - The category object containing category_id and device_types.
 * @param {Array} columnData - Column header values.
 *
 * @return {JSX.Element} The rendered table for the category.
 */
function CategoryTable({table_item, columnData}) {
    // query the devices associated with this category
    const devices = table_item.device_types
    return (
        <div>
            <Table key={table_item.category_id}>
                <thead>
                <tr>
                    {columnData.map(column => (
                        <th
                            key={column.id}
                            title={column.description}
                            className={column.align_center ? 'category-header-center' : 'category-header-left'}
                        >
                            {column.display_name}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>

                {devices.map(device => (
                    <CalculatorTableRow
                        key={device.id}
                        device={device}
                    />
                ))}
                </tbody>
            </Table>
        </div>
    )
}


/**
 * This component draws the App's calculator interface.
 *
 */
export default function CalculatorBody() {

    /**
     * Collects device data and build tables filtered by the device category.
     *
     * @param {Object} data - raw device state data.
     * @returns {Object[]} - The built tables.
     */
    const buildCategoryTables = (data) => {
        const tableItems = []
        // const interfaceData = data.interface_data
        const devicesData = data.calculator.devices
        const categoryData = devicesData.device_categories
        const currentState = state.current_state
        const deviceTypes = currentState.current_quote.data.devices

        for (const category of categoryData) {
            const categoryDevices = []

            for (let device of deviceTypes) {
                if (device.category_id === category.id) {
                    categoryDevices.push(device)
                }
            }

            const tableItem = {
                name: category.name,
                display_name: category.display_name,
                category_id: category.id,
                device_types: categoryDevices
            };
            tableItems.push(tableItem)
        }

        return tableItems
    }

    const {state} = useStateStore()
    const currentState = state.current_state
    const filterString = currentState.filter_string
    const filterActive = currentState.filter_active

    const deviceTypes = currentState.current_quote.data.devices

    // filtering logic
    let filteredDevices = []
    let filterDescription = 'Result:'

    if (filterActive) {
        filteredDevices = deviceTypes.filter((device) => device.quantity > 0)
        filterDescription = `Active Devices  (${filteredDevices.length})`

    } else if (filterString) {
        filteredDevices = deviceTypes.filter((device) =>
            device.name.toLowerCase().includes(filterString) | device.display_name.toLowerCase().includes(filterString)
        )

        filterDescription = `Filtering by '${filterString}' (${filteredDevices.length} items)`
    }

    // if we're filtering items, draw one table only
    if (filteredDevices.length) {
        const filteredTableItem = {
            device_types: filteredDevices,
        }
        return (
            <Container fluid className='d-grid gap-3'>
                <Accordion alwaysOpen key='accordion-filtered' defaultActiveKey='filtered'>
                    <Accordion.Item eventKey='filtered'>
                        <Accordion.Header>{filterDescription}</Accordion.Header>
                        <Accordion.Body>
                            <CategoryTable table_item={filteredTableItem} columnData={headerData}>
                                {filteredDevices.map(device => (
                                    <CalculatorTableRow key={device.id} device={device}/>
                                ))}
                            </CategoryTable>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        )

        // build table items from the current state
    } else {
        const table_items = buildCategoryTables(state)
        return (
            <Container fluid className='d-grid gap-3'>
                {table_items.map(table_item => (
                    // don't show the table if there are no entries
                    table_item.device_types.length > 0 ? (
                        <Accordion alwaysOpen key={table_item.category_id} defaultActiveKey={0}>
                            <Accordion.Item eventKey={table_item.category_id}>
                                <Accordion.Header>{table_item.display_name}</Accordion.Header>
                                <Accordion.Body>
                                    <CategoryTable
                                        key={`category-table-${table_item.category_id}`}
                                        table_item={table_item}
                                        columnData={headerData}
                                    />

                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    ) : (
                        <></>
                    )
                ))}
            </Container>
        )
    }
}
