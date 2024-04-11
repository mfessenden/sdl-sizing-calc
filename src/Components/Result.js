import {useState, React} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {useResultStore} from '../Model/Context';


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

    const handleValueChanged = (e) => {
        console.log(`Value changed: '${e.target.value}'`)
    };

    return (
        <div>
        <Form p={3}>
            <Form.Group className='text-center'>
                <Form.Label>Data Retention Period</Form.Label>
                <Form.Control
                    size='sm'
                    value='1'
                    className='text-center'
                    onChange={handleValueChanged}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>No. of Employees</Form.Label>
                <Form.Control
                    size='sm'
                    value='1'
                    className='text-center'
                    onChange={handleValueChanged}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>SOAR Seats</Form.Label>
                <Form.Control
                    size='sm'
                    value='0'
                    className='text-center'
                    onChange={handleValueChanged}
                />
            </Form.Group>
        </Form>
    </div>
    );
}


function ResultTabs() {
    const [key, setKey] = useState('daily');

    const tabChanged = (e) => {
        console.log(`Value changed: '${e.target.value}'`)
    };

    return (
        <Tabs
            id='controlled-tab-example'
            // activeKey={key}
            onSelect={(k) => setKey(k)}
            className='align-center'
            onChange={tabChanged}
        >
            <Tab
                eventKey='daily'
                title='Daily'
            >
                <TabbedResultOutput/>
            </Tab>
            <Tab
                eventKey='weekly'
                title='Weekly'
            >
                <TabbedResultOutput/>
            </Tab>
            <Tab
                eventKey='monthly'
                title='Monthly'
            >
                <TabbedResultOutput/>
            </Tab>
            <Tab
                eventKey='yearly'
                title='Yearly'
            >
                <TabbedResultOutput/>
            </Tab>
        </Tabs>
    );
}


const DropDownData = {
    industry: [
        {
            id: 0,
            name: 'energy',
            display_name: 'Energy / Utilities',
            weight: 0.95
        },
        {
            id: 1,
            name: 'consumer_product',
            display_name: 'Consumer - Products/Equipment',
            weight: 1
        },
        {
            id: 2,
            name: 'consumer_retail',
            display_name: 'Consumer - Retail/Services',
            weight: 2
        },
        {
            id: 3,
            name: 'financial_insurance',
            display_name: 'Financial - Insurance / Services',
            weight: 1.2
        },
        {
            name: 'financial_retail',
            display_name: 'Financial - Retail',
            weight: 2
        },
        {
            id: 4,
            name: 'government_federal',
            display_name: 'Government - Federal',
            weight: 1.4
        },
        {
            id: 5,
            name: 'government_local',
            display_name: 'Government - Local',
            weight: 0.75
        },
        {
            id: 6,
            name: 'government_state',
            display_name: 'Government - State',
            weight: 1
        },
        {
            id: 7,
            name: 'healthcare_services',
            display_name: 'Health Care Services',
            weight: 1.2
        },
        {
            id: 8,
            name: 'higher_education',
            display_name: 'Higher Education',
            weight: 2.5
        }
    ],
        industry_size: [
        {
            name: 'regional',
            display_name: 'Regional / SMB',
            weight: 0.25
        },
        {
            name: 'small',
            display_name: 'Small / Fortune 2000',
            weight: 0.75
        },
        {
            name: 'medium',
            display_name: 'Medium / Fortune 1000',
            weight: 1
        },
        {
            name: 'large',
            display_name: 'Large / Fortune 500',
            weight: 1.75
        },
        {
            name: 'global',
            display_name: 'Global / Fortune 200',
            weight: 3
        }
    ],
        org_size: [
        {
            name: 'size1',
            display_name: 'Under 500',
            weight: 0.25
        },
        {
            name: 'size2',
            display_name: '500 to 2000',
            weight: 0.65
        },
        {
            name: 'size3',
            display_name: '2000 to 5000',
            weight: 1
        },
        {
            name: 'size4',
            display_name: '5000 to 10000',
            weight: 1.45
        },
        {
            name: 'size5',
            display_name: '10000 to 25000',
            weight: 2
        },
        {
            name: 'size6',
            display_name: '25000 to 40000',
            weight: 2.75
        },
        {
            name: 'size7',
            display_name: '40000 to 65000',
            weight: 4.25
        },
        {
            name: 'size8',
            display_name: '65000 to 85000',
            weight: 5
        },
        {
            name: 'size9',
            display_name: 'Over 85000',
            weight: 5.85
        }
    ]
}



function DropDownItem({name, display_name, menuItems}) {

    return (
        <DropdownButton
            id={name}
            title={display_name}
            variant='secondary'
        >
            {/*<Dropdown.ItemText>{item.description}</Dropdown.ItemText>*/}
            {menuItems.map(menuItem => (
                <Dropdown.Item
                    key={menuItem.id}
                    as='button'>
                    {menuItem.display_name}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
}


export default function ResultComponent({useButton = true}) {
    const data = useResultStore()
    const dropdown_data = DropDownData.industry

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
                <Container>
                    <Row>
                        <DropDownItem
                            name='industry'
                            display_name='Industry'
                            menuItems={dropdown_data}
                        />
                    </Row>
                </Container>
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
    );
}
