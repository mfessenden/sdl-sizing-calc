import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {useStateStore} from '../Model/Data';


function DeviceEditForm({device}) {
    const {state, actions: {setCategory}} = useStateStore();
    const deviceCategoryId = device.category_id
    const categories = state.interface_data.categories

    return (
        <Card>
            <Card.Header>ID: {device.id}</Card.Header>
            <Card.Body>
                <Card.Title>
                    <Row>
                        <Col md={10}>
                            {device.display_name}
                        </Col>
                        <Col>
                            id: {device.id}
                        </Col>
                    </Row>
                </Card.Title>
                <Form>
                    <Row className='mb-3'>
                        <Form.Group as={Col} controlId='formIdentifier'>
                            <Form.Label>Device Identifier</Form.Label>
                            <Form.Control value={device.name}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId='formGridPassword'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control value={device.display_name}/>
                        </Form.Group>
                    </Row>

                    <Row className='mb-3'>
                        <Form.Group as={Col} controlId='formBaseWeight'>
                            <Form.Label>Base Weight</Form.Label>
                            <Form.Control value={device.base_weight}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId='formEventSize'>
                            <Form.Label>Event Size</Form.Label>
                            <Form.Control value={device.event_size}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId='formGridState'>
                            <Form.Label>Category</Form.Label>
                            <Form.Select defaultValue={deviceCategoryId}>

                                {categories.map((category) => (
                                    <>
                                        <option value={category.id}>
                                            {category.display_name}
                                        </option>
                                    </>
                                ))}

                                onChange={e => setCategory(device.id, e.target.value)}

                            </Form.Select>
                        </Form.Group>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}


function DeviceEditor() {
    const {state, actions} = useStateStore();
    const devices = state.device_types


    return (
        <Container expand='lg' className='my-5'>

            {devices.map(device =>
                // <Row className='d-flex justify-content-center'>
                <Row>
                    <DeviceEditForm device={device}/>
                </Row>
            )}
        </Container>
    )
}


export {
    DeviceEditor,
    DeviceEditForm
};