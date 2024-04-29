import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useStateStore} from '../Model/Data';
import {humanFileSize, calculateDeviceUsage} from '../Utils';
import {RetentionPeriodData} from '../Constants';


// form group for the given tab
function DataRetentionInput({tabData}) {
    const {state, actions: {setRetentionValue}} = useStateStore();
    const currentState = state.current_state
    return (
        <Container key={tabData.id} className='m-3 text-center'>
            <Form>
                <Form.Group>
                    <Form.Label className='result-label-sm'>Data Retention Period ({tabData.display_name})</Form.Label>
                    <Form.Control
                        size='sm'
                        value={currentState.retention_period_value}
                        className='result-input mx-auto text-center'
                        onChange={e => setRetentionValue(parseInt(e.target.value))}
                    />
                </Form.Group>
            </Form>
        </Container>
    );
}


/**
 * Tabbed component for selection data retention periods.
 *
 *
 *    +---------+---------+---------+---------+
 *    |  Daily  | Weekly  | Monthly | Yearly  |
 *    +---------+---------+---------+---------+
 *
 * @returns {jsx} Formatted result displaying the estimated data ingest
 */
function RetentionPeriodTabs() {
    const {state, actions: {setRetentionPeriod}} = useStateStore();
    const currentState = state.current_state

    return (
        <Tabs
            key='result-tabs'
            activeKey={currentState.retention_period_id}
            onSelect={(k) => setRetentionPeriod(parseInt(k))}
            className='align-center'
        >
            {RetentionPeriodData.map((period) => (
                <Tab
                    key={period.id}
                    eventKey={period.multiplier}
                    title={period.display_name}
                >
                    <DataRetentionInput tabData={period}/>
                </Tab>
            ))}
        </Tabs>
    );
}


function ResultDropdowns() {


    const buildInputDropdowns = (data) => {
        const dropdownMenus = []

        // dropdown input options
        const inputsData = data.calculator.inputs

        // dropdown categories
        const inputsCategories = data.calculator.inputs.input_categories
        const inputDefaults = data.calculator.inputs.input_defaults

        // data for the menu items
        const inputItems = inputsData.input_items

        for (const category of inputsCategories) {
            const categoryItems = []

            for (const inputItem of inputItems) {
                if (inputItem.input_id === category.id) {

                    // use specified weight, or the default
                    inputItem.weight = inputItem.weight ?? inputDefaults.weight
                    categoryItems.push(inputItem)
                }
            }

            // represents a dropdown menu, broken out by category
            const DropdownMenu = {
                name: category.name,
                display_name: category.display_name,
                input_id: category.id,
                dropdown_items: categoryItems
            };

            dropdownMenus.push(DropdownMenu)
        }
        return dropdownMenus
    }


    const {state} = useStateStore();
    let dropdownMenus = buildInputDropdowns(state)

    return (
        <Container className='input-item'>
            <Form>
                {dropdownMenus.map(dropdownMenu => (
                    <Row className='text-end p-1' key={`row-${dropdownMenu.input_id}`}>
                        <Col key={`col-${dropdownMenu.input_id}`}>
                            <Form.Label className='result-input-label' key={dropdownMenu.input_id}>
                                {dropdownMenu.display_name}
                            </Form.Label>
                        </Col>
                        <Col>
                            <Form.Control as='select'>
                                <option>---</option>
                                {dropdownMenu.dropdown_items.map(dropdownItem => (
                                    <option value={dropdownItem.weight} key={dropdownItem.id}>{dropdownItem.display_name}</option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Row>

                ))}
            </Form>
        </Container>
    )
}


/**
 * Calculates the estimated data ingest based on the current state & devices quantities.
 * The result if formatted a formatted card:
 *
 *
 *     +------------------------------------------------+
 *     |           Your estimated data ingest:          |
 *     |                                                |
 *     |                      0 GB                      |
 *     |                                                |
 *     |   +---------+---------+---------+---------+    |
 *     |   |  Daily  | Weekly  | Monthly | Yearly  |    |
 *     |   +---------+---------+---------+---------+    |
 *     |                                                |
 *     |           Data Retention Period (Daily)        |
 *     |                                                |
 *     |             +--------------------+             |
 *     |             |         1          |             |
 *     |             +--------------------+             |
 *     +------------------------------------------------+
 *
 *
 * @returns {jsx} Formatted result displaying the estimated data ingest
 */
export default function ResultBody() {
    const {state} = useStateStore();
    const currentState = state.current_state

    // get the total in bytes per day
    var totalBytesPerDay = 0
    const devices = state.calculator.devices.device_items
    for (let device of devices) {
        totalBytesPerDay = totalBytesPerDay + calculateDeviceUsage(device)
    }

    // calculate bytes per day * retention period
    var totalBytes = 0
    const retentionPeriodId = currentState.retention_period_id ?? 0
    const periodValue = currentState.retention_period_value ?? 1
    var multiplier = 1

    for (let period of retentionPeriods) {
        if (period.id === retentionPeriodId) {
            multiplier = period.multiplier
        }
    }

    // calculate the total size for this ingest
    totalBytes = totalBytesPerDay * (periodValue * multiplier)

    return (
        <div className='sticky-top result-sticky'>
            <Container>
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
                            <RetentionPeriodTabs/>
                        </Row>
                        <Row>
                            <ResultDropdowns/>
                        </Row>
                    </Container>
                </Card>
            </Container>
        </div>
    );
}
