import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {useStateStore} from '../Model/Data';


function DeviceEditor({device}) {
    const {state, actions: {setCategory}} = useStateStore();
    const deviceCategoryId = device.category_id
    const categories = state.interface_data.categories

    return (
        <Card key={device.id}>
            <Card.Header>{device.display_name}</Card.Header>
            <Card.Body>
                <Form>
                    <Row className='mb-3 pt-3'>
                        <Form.Group as={Col} controlId='formIdentifier'>
                            <Form.Label className='data-edit-label'>Device Identifier</Form.Label>
                            <Form.Control value={device.name}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId='formGridDescription'>
                            <Form.Label className='data-edit-label'>Description</Form.Label>
                            <Form.Control value={device.display_name}/>
                        </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                        <Form.Group as={Col} controlId='formBaseWeight'>
                            <Form.Label className='data-edit-label'>Base Weight</Form.Label>
                            <Form.Control value={device.base_weight}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId='formEventSize'>
                            <Form.Label className='data-edit-label'>Event Size</Form.Label>
                            <Form.Control value={device.event_size}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId='formGridState'>
                            <Form.Label className='data-edit-label'>Category</Form.Label>
                            <Form.Select defaultValue={deviceCategoryId}>

                                {categories.map((category) => (
                                    <>
                                        <option key={category.id} value={category.id}>
                                            {category.display_name}
                                        </option>
                                    </>
                                ))}

                                onChange={e => setCategory(device.id, e.target.value)}

                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className='flex-row-reverse mx-0'>
                        <Button className='xs bg-sentinel-one data-edit-update' disabled={false}>
                            Save
                        </Button>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}


function CategoryEditor({category}) {
    return (
        <Card key={category.id}>
            <Card.Header>{category.display_name}</Card.Header>
            <Card.Body>
                <Form>
                    <Row className='mb-3 pt-3'>
                        <Form.Group as={Col} controlId='formIdentifier'>
                            <Form.Label className='data-edit-label'>Name</Form.Label>
                            <Form.Control value={category.name}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId='formGridDescription'>
                            <Form.Label className='data-edit-label'>Display Name</Form.Label>
                            <Form.Control value={category.display_name}/>
                        </Form.Group>
                    </Row>
                    <Row className='flex-row-reverse mx-0'>
                        <Button className='xs bg-sentinel-one data-edit-update' disabled={false}>
                            Save
                        </Button>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    )
}


/**
 * Component that generates a form that can be used to add a new form.
 *
 * @return {JSX.Element} The rendered React component.
 */
function AddDeviceComponent() {
    const {state} = useStateStore();
    const categories = state.interface_data.categories

    const handleChange = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        // setValidated(true);
    };

    return (
        <div className='sticky-top result-sticky'>
            <Container>
                <Card>
                    <Card.Header>Add Device</Card.Header>
                    <Card.Body>
                        <Form>
                            <Row className='mb-3 pt-3'>
                                <Form.Group as={Col} controlId='formIdentifier'>
                                    <Form.Label className='data-edit-label'>Device Identifier</Form.Label>
                                    <Form.Control/>
                                </Form.Group>

                                <Form.Group as={Col} controlId='formGridDescription'>
                                    <Form.Label className='data-edit-label'>Description</Form.Label>
                                    <Form.Control/>
                                </Form.Group>
                            </Row>

                            <Row className='mb-3'>
                                <Form.Group as={Col} controlId='formBaseWeight'>
                                    <Form.Label className='data-edit-label'>Base Weight</Form.Label>
                                    <Form.Control/>
                                </Form.Group>

                                <Form.Group as={Col} controlId='formEventSize'>
                                    <Form.Label className='data-edit-label'>Event Size</Form.Label>
                                    <Form.Control/>
                                </Form.Group>

                                <Form.Group as={Col} controlId='formGridState'>
                                    <Form.Label className='data-edit-label'>Category</Form.Label>
                                    <Form.Select>
                                        {categories.map((category) => (
                                            <>
                                                <option key={category.id} value={category.id}>
                                                    {category.display_name}
                                                </option>
                                            </>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row className='flex-row-reverse mx-0'>
                                <Button className='xs bg-sentinel-one data-edit-update'>Add</Button>
                            </Row>
                        </Form>
                    </Card.Body>
                    <Card.Footer>Admin Mode: On</Card.Footer>
                </Card>
            </Container>
        </div>
    );
}


/**
 * Renders the admin panel component.
 *
 * @return {JSX.Element} admin panel JSX component.
 */
export default function AdminPanel() {
    const {state} = useStateStore();
    const devices = state.device_types
    const categories = state.interface_data.categories

    return (
        <Container fluid className='d-grid gap-3'>
            <Row>
                <Col md={8}>
                    <Accordion alwaysOpen>
                        <Accordion.Item eventKey='devices'>
                            <Accordion.Header>Devices</Accordion.Header>
                            <Accordion.Body>
                                {devices.map(device =>
                                    <Row key={device.id}>
                                        <Col className='p-3'>
                                            <DeviceEditor device={device}/>
                                        </Col>
                                    </Row>
                                )}

                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion alwaysOpen>
                        <Accordion.Item eventKey='categories'>
                            <Accordion.Header>Categories</Accordion.Header>
                            <Accordion.Body>
                                {categories.map(category =>
                                    <Row key={category.id}>
                                        <Col className='p-3'>
                                            <CategoryEditor category={category}/>
                                        </Col>
                                    </Row>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </Col>
                <Col md={4}>
                    <AddDeviceComponent/>
                </Col>
            </Row>
        </Container>
    )
}
