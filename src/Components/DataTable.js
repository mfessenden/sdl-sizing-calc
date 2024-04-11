import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';
import '../index.css';
import {useStateStore} from '../Model/Context';


function TableRow({device}) {
    const {state, actions: {setQuantity}} = useStateStore();
    return (
        <tr key={device.id}>
            <td>
                <RangeSlider
                    key={device.id}
                    device={device}
                    onChange={e => setQuantity(device.id, e.target.value)}
                />
            </td>
            <td>
                <Form.Control
                    key={device.id}
                    className='text-center'
                    size='sm'
                    type='number'
                    onChange={e => setQuantity(device.id, e.target.value)}
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

    return (
        <div>
            <Table className='align-left'>
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
        // const interfaceData = data['state']
        const interfaceData = data.interface_data
        const categoryData = interfaceData.categories
        const deviceTypes = data.device_types

        for (const category of categoryData) {
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
            tableItems.push(tableItem)
        }

        return tableItems
    }

    const {state, actions} = useStateStore()
    const currentState = state.current_state
    const columnNames = state.interface_data.table_columns
    const deviceTypes = state.device_types
    const filterString = currentState.filter_string

    if (filterString) {
        const filteredDevices = deviceTypes.filter((device) =>
            device.name.toLowerCase().includes(filterString) | device.display_name.toLowerCase().includes(filterString)
        )
        console.log(filteredDevices)
        const filteredTableItem = {

            device_types: filteredDevices,
        }
        return (
            <div>
                <Accordion alwaysOpen>
                    <Accordion.Item>
                        <Accordion.Header>
                            Results:
                        </Accordion.Header>
                        <Accordion.Body>
                            <CategoryTable
                                table_item={filteredTableItem}
                                columns={columnNames}
                            >
                                {filteredDevices.map(device => (
                                    <TableRow
                                        key={device.id}
                                        device={device}
                                    />
                                ))}
                            </CategoryTable>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        )
    } else {
        const table_items = buildTables(state)
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
                    ) : (
                        <></>
                    )
                ))}
            </div>
        )
    }
}
