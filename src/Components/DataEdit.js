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

        <Container fluid className='d-grid gap-3'>
            <Row>
                <Col md={8}>
                    <Container expand='lg' className='my-5'>

                        {devices.map(device =>
                            // <Row className='d-flex justify-content-center'>
                            <Row>
                                <DeviceEditForm device={device}/>
                            </Row>
                        )}
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}


export default function SettingsBody() {

    return (
        <Container fluid className='d-grid gap-3'>
            <Row>
                <Col md={8}>
                    <Card className='m-2 p-3'>
                        <Card.Title>Settings</Card.Title>
                        <Card.Body className='m-1'>
                            <Form>
                                <Form.Check // prettier-ignore
                                    type='switch'
                                    id='switch-debug'
                                    label='Debug Mode'
                                />
                            </Form>
                        </Card.Body>
                        <Card.Title>Data Sources</Card.Title>
                        <Card.Body className='m-1'>
                            <Form>
                                <Form.Control
                                    as='select'
                                    custom
                                >
                                    <option value='black'>Black</option>
                                    <option value='amber'>Amber</option>
                                    <option value='purple'>Purple</option>
                                    <option value='magenta'>Magenta</option>
                                    <option value='white'>White</option>
                                </Form.Control>

                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>

                </Col>
            </Row>
        </Container>
    )
}


export {
    DeviceEditor,
    DeviceEditForm
};