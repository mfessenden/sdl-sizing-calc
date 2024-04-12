import {useState} from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useStateStore} from '../Model/Context';
import {humanFileSize} from "../Utils";


// form group for the given tab
function TabbedResultOutput({retentionPeriodId}) {
    const {state, actions: {setRetentionValue}} = useStateStore();
    const currentState = state.current_state

    return (
        <div>
            <Form p={3}>
                <Form.Group className='text-center'>
                    <Form.Label>Data Retention Period</Form.Label>
                    <Form.Control
                        size='sm'
                        value={currentState.retention_period_value}
                        className='text-center'
                        onChange={e => setRetentionValue(parseInt(e.target.value))}
                    />

                </Form.Group>
            </Form>
        </div>
    );
}


function ResultTabs() {
    const {state, actions: {setRetentionPeriod}} = useStateStore();
    const currentState = state.current_state

    return (
        <Tabs
            id='controlled-tab-example'
            activeKey={currentState.retention_period_id}
            onSelect={(k) => setRetentionPeriod(parseInt(k))}
            className='align-center'
        >
            <Tab
                eventKey={0}
                title='Daily'
            >
                <TabbedResultOutput retentionPeriodId={0}/>
            </Tab>
            <Tab
                eventKey={1}
                title='Weekly'
            >
                <TabbedResultOutput retentionPeriodId={1}/>
            </Tab>
            <Tab
                eventKey={2}
                title='Monthly'
            >
                <TabbedResultOutput retentionPeriodId={2}/>
            </Tab>
            <Tab
                eventKey={3}
                title='Yearly'
            >
                <TabbedResultOutput retentionPeriodId={3}/>
            </Tab>
        </Tabs>
    );
}



export default function ResultComponent({useButton = true}) {

    return (
        <Card className='mx-auto my-2'>
            <Container>
                <Row className='align-center result-lg'>
                    Your estimated data ingest:
                </Row>
                <Row className='align-center result-xl'>
                    {humanFileSize(0)}
                </Row>
                <Row className='align-center'>
                    <ResultTabs/>
                </Row>

                {useButton &&
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
                }

            </Container>
        </Card>
    );
}
