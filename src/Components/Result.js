import {Component, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import useStateStore from "../Models";


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
    const data = useStateStore()
    console.log('Result:')
    console.log(data)

    return (
        <Container>
            <Row className='align-center result-lg'>
                Your estimated data ingest:
            </Row>
            <Row className='align-center result-xl'>
                0.00 GB
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
