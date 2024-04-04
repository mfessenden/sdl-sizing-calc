import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import RangeSlider from './Slider';

// data
const categories = ['Infrastructure', 'Security', 'Network']
const headers = ['Device Type', 'Quantity', 'EPS', 'GB/day']


// dummy handler
function onRangeChanged(value) {
    console.log(value.value)
}


const rangeData = {
    label: 'Range Value'
}

const TableItem = (props) => {

    // const onRangeChanged = (event) => {
    //     this.setState({value: event.target.value});
    // }

    return (
        <Table className= 'align-left'>
            <thead>
            <tr>
                <th className='align-left'>Device Type</th>
                <th>Quantity</th>
                <th>EPS</th>
                <th>GB/day</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
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


function DataTable(props) {
    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey='0'>
                <Accordion.Header className='tableitem-header'>Infrastructure</Accordion.Header>
                <Accordion.Body>
                    <TableItem />
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='1'>
                <Accordion.Header>Security</Accordion.Header>
                <Accordion.Body>
                    <TableItem />
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='2'>
                <Accordion.Header>Network</Accordion.Header>
                <Accordion.Body>
                    <TableItem />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default DataTable;