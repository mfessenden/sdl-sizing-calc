import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import {useStateStore} from '../Model/Data';


export default function FilterInput({hasActiveDevices = false}) {
    const {state, actions: {applyFilterString, applyActiveFilter}} = useStateStore();
    const isFilteringActive = state.current_state.filter_active
    const activeButtonText = (isFilteringActive) ? 'Active: On' : 'Active: Off'
    return (
        <Nav className='justify-content-end'>
            <Container className='d-flex justify-content-end'>
                <Row>
                    <Col>
                        <Form>
                            <Form.Control
                                type='search'
                                placeholder='Filter'
                                className='me-2'
                                aria-label='filter'
                                onChange={e => applyFilterString(e.target.value.toLowerCase())}
                            />
                        </Form>
                    </Col>

                    {hasActiveDevices &&
                        <Col>
                            <Button
                                className='xs bg-sentinel-one'
                                alt='Only filter devices with current quality'
                                onClick={() => {
                                applyActiveFilter(!isFilteringActive)
                            }}
                            >
                                {activeButtonText}
                            </Button>

                        </Col>
                    }
                </Row>
            </Container>
        </Nav>)
}