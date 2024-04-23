import {Card} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {useStateStore} from '../Model/Data';


export default function SettingsBody() {
    const {state, actions: {toggleDebug}} = useStateStore();
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
                                    label='Admin Mode'
                                    value={state.current_state.debug_mode}
                                    onChange={e => toggleDebug(e.target.value)}
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
