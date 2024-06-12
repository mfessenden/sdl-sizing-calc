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

/**
 * Renders the data retention input component:
 *
 *      +----------------------------------+
 *      |  Data Retention Period (Daily)   |
 *      |                                  |
 *      |      +--------------------+      |
 *      |      |         1          |      |
 *      |      +--------------------+      |
 *      +----------------------------------+
 *
 * Updating the retention value updates the current quote.
 *
 * @param {boolean} adminMode - Indicates whether to enable debug/admin mode.
 * @return {JSX.Element} - The rendered top navigation bar component.
 */
function DataRetentionInput({tabData}) {
    const {state, actions: {setRetentionPeriods}} = useStateStore();
    const currentQuote = state.current_state.current_quote
    let retentionQuantity = currentQuote.retention_quantity

    // assume 1 if NaN
    if (isNaN(retentionQuantity)) {
        retentionQuantity = 1
    }
    return (
        <Container key={tabData.id} className='m-3 text-center'>
            <Form>
                <Form.Group>
                    <Form.Label className='result-label-sm'>
                        Data Retention Period ({tabData.display_name})
                    </Form.Label>
                    <Form.Control
                        size='sm'
                        pattern='[0-9]'
                        value={retentionQuantity}
                        className='result-input mx-auto text-center'
                        onChange={e => setRetentionPeriods(parseInt(e.target.value))}
                    />
                </Form.Group>
            </Form>
        </Container>
    );
}


/**
 * Tabbed component for selection data retention periods. Selecting a tab updates the
 * current quote's 'retention_interval' property.
 *
 *    +---------+---------+---------+---------+
 *    |  Daily  | Weekly  | Monthly | Yearly  |
 *    +---------+---------+---------+---------+
 *
 * @returns {jsx} Formatted result displaying the estimated data ingest
 */
function RetentionPeriodTabs() {
    const {state, actions: {setRetentionMultiplier}} = useStateStore();
    const currentQuoteData = state.current_state.current_quote
    return (
        <Tabs
            key='result-tabs'
            activeKey={currentQuoteData.retention_interval}
            onSelect={(k) => setRetentionMultiplier(parseInt(k))}
            className='align-center'
        >
            {RetentionPeriodData.map((period) => (
                <Tab
                    key={period.id}
                    eventKey={period.interval}
                    title={period.display_name}
                >
                    <DataRetentionInput tabData={period}/>
                </Tab>
            ))}
        </Tabs>
    );
}


// here
function DropdownMenu({dropdownMenu}) {
    const {state, actions: {inputWeightChanged}} = useStateStore();
    const currentQuote = state.current_state.current_quote

    let selectedValue = '---'
    switch (dropdownMenu.input_id) {
        // industry
        case 0: {
            if (currentQuote.industry_id) {
                selectedValue = currentQuote.industry_id
            }
            break;
        }

        case 1: {
            if (currentQuote.industry_size) {
                selectedValue = currentQuote.industry_size
            }
            break;
        }

        case 2: {
            if (currentQuote.org_size) {
                selectedValue = currentQuote.org_size
            }
            break;
        }

        default:
            console.log(`Error: invalid input id ${dropdownMenu.input_id} `);
    }

    let dropdownId = useRef(dropdownMenu.input_id);

    const handleChange = (input_id, weight) => {
        inputWeightChanged(input_id, Number(weight))
    }

    return (

        <select
            value={selectedValue.toString()}
            className='form-select'
            onChange={e => handleChange(dropdownId.current, e.target.value)}
        >
            <option value='---'>---</option>
            {dropdownMenu.dropdown_items.map(dropdownItem => (
                    <option
                        value={dropdownItem.weight.toString()}
                        key={dropdownItem.id}
                    >
                        {dropdownItem.display_name}
                    </option>
                ))}
        </select>
    )
}


function ResultDropdowns() {

    const buildInputDropdowns = (data) => {
        let dropdownMenus = []

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
                dropdown_items: categoryItems,
                current_value: null
            };

            dropdownMenus.push(DropdownMenu)
        }
        return dropdownMenus
    }

    const {state} = useStateStore();
    let dropdownMenus = buildInputDropdowns(state)

    return (
        <Container>
            <Row className='p-1 result-label-sm mx-auto'>
                <Col className='mx-auto'>
                    Industry Variables
                </Col>
            </Row>
            {/*<Row className='result-label-sm align-center'>Variables</Row>*/}
            {dropdownMenus.map(dropdownMenu => (
                <Row className='text-end p-1' key={`row-${dropdownMenu.input_id}`}>
                    <Col key={`col-${dropdownMenu.input_id}`}>
                        {/*<Form.Label className='result-input-label' key={dropdownMenu.input_id}>*/}
                        <Form.Label key={dropdownMenu.input_id}>
                            {dropdownMenu.display_name}
                        </Form.Label>
                    </Col>
                    <Col>
                        <DropdownMenu dropdownMenu={dropdownMenu}/>
                    </Col>
                </Row>

            ))}
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

    const devices = state.calculator.devices.device_items
    const currentQuote = state.current_state.current_quote
    const rententionPeriodMultiplier: number = currentQuote.retention_interval
    const retentionPeriodValue: number = currentQuote.retention_quantity

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

    // calculate the final quote size
    const totalBytes: number = calculateQuote(devices, retentionPeriodValue, rententionPeriodMultiplier, industryIdWeight, industrySizeWeight, orgSizeWeight)

    return (
        <div className='sticky-top result-sticky'>
            <Container>
                <Card className='p-3'>
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
