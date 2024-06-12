import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';
import {useStateStore} from '../model/Data';
import {
    bytesToGigs,
    calculateItemPerSecondUsage,
    numberToString,
    calculateEventsPerSecond
} from '../Utils';
import {SECONDS_PER_DAY} from '../Constants';
import {useState} from 'react';


// Header data for device list items
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
 * Editable text component allows the user to edit and display a device's **events per second** variable. Allows the
 * user to customize the quote by clicking the text and adding a new value.
 *
 * @param {Device} device - The device object representing the device being edited.
 * @return {JSX.Element} The rendered component.
 */
function EditableEPSComponent({deviceId, eventsPerSecond, hasCustomValue, hasCurrentQuantity}) {
    const {actions: {setDeviceEPS}} = useStateStore();
    const [isEditable: boolean, setEditable] = useState(false);
    let eventsPerSecondString: string = '0'
    let eventsPerSecondTruncated: string = ''
    if (eventsPerSecond) {
        eventsPerSecondTruncated = Number(eventsPerSecond.toFixed(1))
        eventsPerSecondString = numberToString(eventsPerSecond)
    }

    let smallClassName = 'text-center'
    if (hasCustomValue) {
        smallClassName = smallClassName + ' custom-eps'
    }

    const handleChange = (e) => {
        e.preventDefault();
        setDeviceEPS(deviceId, e.target.value)
    }

    const handleBlur = (e) => {
        e.preventDefault();
        // if the user tabs out or clicks on another value, set 'not editable'
        setEditable()
    }

    if (!isEditable || !hasCurrentQuantity) {
        return (
            <small className={smallClassName} onClick={setEditable}>
                {eventsPerSecondString}
            </small>
        );
    }
    return (
        <>
            <form>
                <input
                    type='number'
                    placeholder=''
                    value={eventsPerSecondTruncated}
                    className='text-center form-control small-input'
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </form>
        </>
    )
}


/**
 * Renders a table row component for a device, including an editable range slider widget used to change device quantity.
 *
 * @param {Device} device - The device object.
 *
 * @returns {JSX.Element} - The rendered table row.
 */
function CalculatorTableRow({device}) {
    const {state, actions: {setQuantity}} = useStateStore();
    const currentQuoteData = state.current_state.current_quote

    //if this device has a custom EPS value, render the component differently
    let deviceHasCustomEPS: boolean = device.eps ?? false
    let deviceHasQuantity: boolean = device.quantity ?? false

    // industry variables (or default of 1)
    let industryIdMultiplier: number = 1
    if (currentQuoteData.industry_id) {
        industryIdMultiplier = Number(currentQuoteData.industry_id)
    }

    let industrySizeMultiplier: number = 1
    if (currentQuoteData.industry_size) {
        industrySizeMultiplier = Number(currentQuoteData.industry_size)
    }
    let orgSizeMultiplier: number = 1
    if (currentQuoteData.org_size) {
        orgSizeMultiplier = Number(currentQuoteData.org_size)
    }

    let eventsPerSecond: number = calculateEventsPerSecond(device, industryIdMultiplier, industrySizeMultiplier, orgSizeMultiplier)
    const bytesPerDay: number = calculateItemPerSecondUsage(device, industryIdMultiplier, industrySizeMultiplier, orgSizeMultiplier) * SECONDS_PER_DAY
    const gigsPerDay: number = bytesToGigs(bytesPerDay)

    return (
        <tr key={device.id}>
            <td className='category-table-description'>
                <RangeSlider
                    device={device}
                    onChange={e => setQuantity(device.id, e.target.value)}
                    disabled={deviceHasCustomEPS}
                />
            </td>
            <td className='category-table-numeric'>
                <Form.Control
                    className='text-center'
                    type='number'
                    pattern='[0-9]'
                    onChange={e => setQuantity(device.id, e.target.value)}
                    value={Number(device.quantity)}
                    disabled={deviceHasCustomEPS}
                />
            </td>
            <td className='text-center category-table-numeric'>
                <EditableEPSComponent
                    deviceId={device.id}
                    eventsPerSecond={eventsPerSecond}
                    hasCustomValue={deviceHasCustomEPS}
                    hasCurrentQuantity={deviceHasQuantity}
                />
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
 * Renders the table element for a given category & associated devices.
 *
 * @param {Object} tableItem - The category object containing category_id and device_types.
 * @param {Array} headerData - Column header values.
 *
 * @return {JSX.Element} The rendered table for the category.
 */
function CategoryTable({tableItem, headerData}) {
    // query the devices associated with this category
    const devices = tableItem.device_types
    return (
        <div>
            <Table key={tableItem.category_id}>
                <thead>
                    <tr>
                        {headerData.map(column => (
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
                        <CalculatorTableRow key={device.id} device={device}/>
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

        const devicesData = data.calculator.devices
        const categoryData = devicesData.device_categories
        const deviceTypes = devicesData.device_items

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

    const deviceTypes = state.calculator.devices.device_items

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
                            <CategoryTable tableItem={filteredTableItem} headerData={headerData}>
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
        const tableItems = buildCategoryTables(state)
        return (
            <Container fluid className='d-grid gap-3'>
                {tableItems.map(tableItem => (
                    // don't show the table if there are no entries
                    tableItem.device_types.length > 0 ? (
                        <Accordion alwaysOpen key={tableItem.category_id} defaultActiveKey={0}>
                            <Accordion.Item eventKey={tableItem.category_id}>
                                <Accordion.Header>{tableItem.display_name}</Accordion.Header>
                                <Accordion.Body>
                                    <CategoryTable
                                        key={`category-table-${tableItem.category_id}`}
                                        tableItem={tableItem}
                                        headerData={headerData}
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
