import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';
import '../index.css';
import {useStateStore} from "../Models";


// dummy handler
function onRangeChanged(value) {
    alert(value.value)
}

function TableItem({table_item}) {
    const devices = table_item.devices
    return (
        <div>
            <Table className= 'align-left'>
                <thead>
                <tr>
                    {/*{props.categories.map(category => (*/}
                    {/*<th className='align-left'>{category}</th>*/}

                    <th>Device Type</th>
                    <th>Quantity</th>
                    <th>EPS</th>
                    <th>GB/day</th>
                </tr>
                </thead>
                <tbody>

                {devices.map(device => (
                    <tr>
                        <td>
                            {device.display_name}
                            <RangeSlider
                                // value={device.quantity}
                                device={device}
                            />
                        </td>
                        <td>
                            <Form.Control
                                size='sm'
                                type='number'
                                onChange={onRangeChanged}
                                value={device.quantity}
                            />
                        </td>
                        <td>
                            <Form.Control
                                size='sm'
                                type='number'
                                value={device.quantity}
                            />
                        </td>
                        <td>
                            <Form.Control
                                size='sm'
                                type='number'
                                value={device.quantity}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}


export default function DataTable() {
    const data = useStateStore()
    const table_items = data.table_items
    return (
        <div>
            {table_items.map(table_item => (
                <Accordion alwaysOpen>
                    <Accordion.Item eventKey={table_item.category_id}>
                        <Accordion.Header>
                            {table_item.display_name}
                        </Accordion.Header>
                        <Accordion.Body>
                            <TableItem
                                table_item={table_item}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            ))}
        </div>
    )
}
