import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';
import '../index.css';
import {useStateStore} from '../Model/Context';


function TableRow({device}) {
    const handleQuantityChanged = (e) => {
        console.log(device)

        device.quantity = e.target.value
        console.log(`Device '${device.name}' quantity changed: '${device.quantity}'`)
    };

    return (
        <tr key={device.id}>
            <td>
                <RangeSlider
                    key={device.id}
                    device={device}
                />
            </td>
            <td>
                <Form.Control
                    key={device.id}
                    className='text-center'
                    size='sm'
                    type='number'
                    onChange={handleQuantityChanged}
                    value={device.quantity}
                />
            </td>
            <td className='text-center'>
                <Form.Text
                    key={device.id}
                    // style={{width: '100px'}}
                    type='number'
                >
                    {device.quantity}
                </Form.Text>
            </td>
            <td className='text-center'>
                <Form.Text
                    key={device.id}
                    type='number'
                >
                    {device.quantity}
                </Form.Text>
            </td>
        </tr>
    )
}


// renders the rows & columns of one table, currently broken out by category
function CategoryTable({table_item, columns}) {
    // query the devices associated with this category
    const devices = table_item.device_types
    console.log('Building table:')
    console.log(table_item)

    const quantityUpdated = (e) => {
        console.log(`Updated: '${e.target.value}'`)
    };


    return (
        <div>
            <Table className= 'align-left'>
                <thead>
                <tr>
                    {columns.map(column => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
                </thead>
                <tbody>

                {devices.map(device => (
                    <TableRow
                        key={device.id}
                        device={device}
                    />
                ))}
                </tbody>
            </Table>
        </div>
    )
}


export default function DataTable() {

    const buildTables = (data) => {
        const tableItems = []

        const interfaceData = data['interface_data']
        const categoryData = interfaceData['categories']
        const deviceTypes = contextData['device_types']

        for (const category of categoryData) {
            console.log(category)
            const categoryDevices = []

            for (let device of deviceTypes) {
                if (device.category_id === category.id) {
                    categoryDevices.push(device)
                }
            }

            var tableItem = {
                display_name: category.display_name,
                category_id: category.category_id,
                device_types: categoryDevices
            }
            console.log(`Building devices for: '${category.display_name}'`)
            tableItems.push(tableItem)
        }

        return tableItems
    }

    const contextData = useStateStore()
    const table_items = buildTables(contextData)
    const columnNames = contextData.interface_data.table_columns
    return (
        <div>

            {table_items.map(table_item => (
                // don't show the table if there are no entries
                table_item.device_types.length > 0 ? (
                    <Accordion
                        alwaysOpen
                        key={table_item.category_id}
                    >
                        <Accordion.Item
                            eventKey={table_item.category_id}
                        >
                            <Accordion.Header>
                                {table_item.display_name}
                            </Accordion.Header>
                            <Accordion.Body>
                                <CategoryTable
                                    key={table_item.category_id}
                                    table_item={table_item}
                                    columns={columnNames}
                                />

                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ):(
                    <></>
                )
            ))}
        </div>
    )
}
