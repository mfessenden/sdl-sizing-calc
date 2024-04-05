import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';
import '../index.css';

// dummy handler
function onRangeChanged(value) {
    alert(value.value)
}

function TableItem() {

    return (
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
                <tr>
                    <td>
                        Label:
                        <RangeSlider/>
                    </td>
                    <td>
                        <Form.Control
                            size='sm'
                            type='number'
                            onChange={onRangeChanged}
                        />
                    </td>
                    <td>
                        <Form.Control
                            size='sm'
                            type='number'
                        />
                    </td>
                    <td>
                        <Form.Control
                            size='sm'
                            type='number'
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}


export default function DataTable() {

    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey='0'>
                <Accordion.Header
                    bsPrefix='h1'
                >
                    Infrastructure
                </Accordion.Header>
                <Accordion.Body>
                    <TableItem/>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
                <Accordion.Header>Security</Accordion.Header>
                <Accordion.Body>
                    <TableItem/>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
                <Accordion.Header>Network</Accordion.Header>
                <Accordion.Body>
                    <TableItem/>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );

}
