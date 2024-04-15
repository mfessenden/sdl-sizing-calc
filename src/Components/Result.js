import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useStateStore} from '../Model/Data';
import {humanFileSize, calculateDeviceUsage} from '../Utils';


// form group for the given tab
function TabbedResultOutput({tabData}) {
    const {state, actions: {setRetentionValue}} = useStateStore();
    const currentState = state.current_state
    return (
        <Container className='my-8 text-center'>
            <Form>
                <Form.Group>
                    <Form.Label>Data Retention Period ({tabData.display_name})</Form.Label>
                    <Form.Control
                        size='sm'
                        value={currentState.retention_period_value}
                        className='result-input mx-auto'
                        onChange={e => setRetentionValue(parseInt(e.target.value))}
                    />
                </Form.Group>
            </Form>
        </Container>
    );
}


function ResultTabs() {
    const {state, actions: {setRetentionPeriod}} = useStateStore();
    const currentState = state.current_state
    const tabsData = state.interface_data.retention_periods

    return (
        <Tabs
            id='controlled-tab-example'
            activeKey={currentState.retention_period_id}
            onSelect={(k) => setRetentionPeriod(parseInt(k))}
            className='align-center'
        >
            {tabsData.map((tab) => (
                <Tab
                    eventKey={tab.id}
                    title={tab.display_name}
                >
                    <TabbedResultOutput tabData={tab}/>
                </Tab>
            ))}

        </Tabs>
    );
}


export default function ResultComponent() {
    const {state} = useStateStore();
    const currentState = state.current_state

    // get the total in bytes per day
    var totalBytesPerDay = 0
    const devices = state.device_types
    for (let device of devices) {
        totalBytesPerDay = totalBytesPerDay + calculateDeviceUsage(device)
    }

    var totalBytes = 0
    const retentionPeriodData = state.interface_data.retention_periods
    const retentionPeriodId = currentState.retention_period_id ?? 0
    const periodValue = currentState.retention_period_value ?? 1
    var multiplier = 1

    for (let period of retentionPeriodData) {
        if (period.id === retentionPeriodId) {
            multiplier = period.multiplier
            console.log(`Setting multiplier to ${multiplier} `);
        }
    }

    // calculate the total size for this ingest
    totalBytes = totalBytesPerDay * (periodValue * multiplier)

    return (
        // <Card className='mx-auto'>
        <Card className='m-2 p-3'>
            <Container className='my-8 text-center'>
                <Row className='result-lg'>
                    <Col className='mx-auto'>
                        Your estimated data ingest:
                    </Col>
                </Row>
                <Row className='result-xl'>

                    <Col className='mx-auto'>
                        {humanFileSize(totalBytes, true)}
                    </Col>
                </Row>
                <Row>
                    <ResultTabs/>
                </Row>
            </Container>
        </Card>
    );
}
