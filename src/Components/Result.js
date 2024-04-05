import {useState, React} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useStateStore, useResultStore} from "../Models";


/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' GB';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}


// form group for the given tab
function TabbedResultOutput() {
    return (
        <Form>
            <Form.Group>
                <Form.Label>Data Retention Period</Form.Label>
                <Form.Control size='sm' />
            </Form.Group>
            <Form.Group>
                <Form.Label>No. of Employees</Form.Label>
                <Form.Control size='sm' />
            </Form.Group>
            <Form.Group>
                <Form.Label>SOAR Seats</Form.Label>
                <Form.Control size='sm' />
            </Form.Group>
        </Form>
    );
}


function ResultTabs() {
    const [key, setKey] = useState('daily');
    const data = useStateStore()
    const periods = data.periods
    console.log('Periods: ')
    console.log(periods)
    return (
        <Tabs
            id='controlled-tab-example'
            // activeKey={key}
            onSelect={(k) => setKey(k)}
            className='align-center'
        >
            <Tab eventKey='daily' title='Daily'>
                <TabbedResultOutput/>
            </Tab>
            <Tab eventKey='weekly' title='Weekly'>
                <TabbedResultOutput/>
            </Tab>
            <Tab eventKey='monthly' title='Monthly'>
                <TabbedResultOutput/>
            </Tab>
            <Tab eventKey='yearly' title='Yearly'>
                <TabbedResultOutput/>
            </Tab>
        </Tabs>
    );
}


export default function Result() {
    const data = useResultStore()
    console.log('Result:')
    console.log(data)

    return (
        <Container>
            <Row className='align-center result-lg'>
                Your estimated data ingest:
            </Row>
            <Row className='align-center result-xl'>
                {humanFileSize(data.usage)}
            </Row>
            <Row className='align-center'>
                <ResultTabs/>
            </Row>
            <Row>
                <Col>
                    <Button
                        as='input'
                        type='button'
                        value='Get a Quote!'
                        onClick={() => {
                            alert('You clicked me!');
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
}
