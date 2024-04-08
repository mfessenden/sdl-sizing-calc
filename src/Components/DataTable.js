import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';
import '../index.css';
import {useStateStore} from '../Models';


function TableItem({table_item, columns}) {
    const devices = table_item.devices

    const handleSliderChange = (e) => {
        console.log(`Updated: '${e.target}'`)
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

                {devices.map(device => (  // build a table row for each device
                    <tr>
                        <td>
                            {device.display_name}
                            <RangeSlider
                                key={device.id}
                                device={device}
                                // onChange={handleSliderChange}
                            />
                        </td>
                        <td>
                            <Form.Control
                                key={device.id}
                                className='text-center'
                                size='sm'
                                type='number'
                                onChange={handleSliderChange}
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
                // don't show the table if there are no entries
                table_item.devices.length > 0 ? (
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
                                <TableItem
                                    key={table_item.category_id}
                                    table_item={table_item}
                                    columns={data.columns}
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
