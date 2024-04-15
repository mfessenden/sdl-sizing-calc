import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useStateStore} from '../Model/Data';


function RangeSlider({device}) {
    const {state, actions: {setQuantity}} = useStateStore();
    return (
        <Container>
            <Row>
                <Col md={8}>
                    <Form.Label>
                        {device.display_name}
                    </Form.Label>
                </Col>
                <Col md={4}>
                    <Form.Range
                        key={device.id}
                        value={device.quantity}
                        onChange={e => setQuantity(device.id, e.target.value)}
                    />
                </Col>
            </Row>
        </Container>
    );
}


export default RangeSlider;