import React, {useRef} from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useStateStore, calculateQuote} from '../model/Data';
import {humanFileSize} from '../Utils';
import {IndustryDetailData, RetentionPeriodData} from '../Constants';


// form group for the given tab
function DataRetentionInput({tabData}) {
    const {state, actions: {setRetentionPeriods}} = useStateStore();
    const currentQuote = state.current_state.current_quote
    return (
        <Container key={tabData.id} className='m-3 text-center'>
            <Form>
                <Form.Group>
                    <Form.Label className='result-label-sm'>Data Retention Period ({tabData.display_name})</Form.Label>
                    <Form.Control
                        size='sm'
                        value={currentQuote.retention_quantity}
                        className='result-input mx-auto text-center'
                        onChange={e => setRetentionPeriods(parseInt(e.target.value))}
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
    const {state, actions: {setRetentionMultiplier}} = useStateStore();
    const currentState = state.current_state

    return (
        <Tabs
            key='result-tabs'
            activeKey={currentState.retention_interval}
            onSelect={(k) => setRetentionMultiplier(parseInt(k))}
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


function ResultMenu({dropdownMenu}) {
    const {actions: {inputWeightChanged}} = useStateStore();
    let dropdownId = useRef(dropdownMenu.input_id);

    const handleChange = (input_id, weight) => {
        console.log(`Menu item changed, weight: ${weight}, input id: ${input_id}`)
        inputWeightChanged(input_id, Number(weight))
    }

    return (
        <Form.Control defaultValue='---' as='select' onChange={e => handleChange(dropdownId.current, e.target.value)}>
            <option>---</option>
            {dropdownMenu.dropdown_items.map(dropdownItem => (
                <option value={dropdownItem.weight} key={dropdownItem.id}>{dropdownItem.display_name}</option>
            ))}
        </Form.Control>
    )
}


function ResultDropdowns() {


    const buildInputDropdowns = (data) => {
        const dropdownMenus = []

        // dropdown input options
        const inputsData = data.calculator.inputs

        // dropdown categories
        const inputsCategories = IndustryDetailData
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
        <Container>
            {/*<Row className='result-label-sm align-center'>Variables</Row>*/}
            <Form>
                {dropdownMenus.map(dropdownMenu => (
                    <Row className='text-end p-1' key={`row-${dropdownMenu.input_id}`}>
                        <Col key={`col-${dropdownMenu.input_id}`}>
                            {/*<Form.Label className='result-input-label' key={dropdownMenu.input_id}>*/}
                            <Form.Label key={dropdownMenu.input_id}>
                                {dropdownMenu.display_name}
                            </Form.Label>
                        </Col>
                        <Col>
                            <ResultMenu dropdownMenu={dropdownMenu}/>
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

    const devices: Array<any> = state.calculator.devices.device_items
    const rententionPeriodMultiplier: number = state.current_state.current_quote.retention_interval ?? 1
    const retentionPeriodValue: number = state.current_state.current_quote.retention_quantity ?? 1

    let industryIdWeight = 1;
    let industrySizeWeight = 1;
    let orgSizeWeight = 1;
    if (state.current_state.current_quote.industry_id) {
        industryIdWeight = state.current_state.current_quote.industry_id
    }

    if (state.current_state.current_quote.industry_size) {
        industrySizeWeight = state.current_state.current_quote.industry_size
    }

    if (state.current_state.current_quote.org_size) {
        orgSizeWeight = state.current_state.current_quote.org_size
    }

    const totalBytes: number = calculateQuote(devices, retentionPeriodValue, rententionPeriodMultiplier, industryIdWeight, industrySizeWeight, orgSizeWeight)

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
