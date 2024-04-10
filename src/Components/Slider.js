import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function RangeSlider({device}) {

    const handleSliderChange = (e) => {
        console.log(`Slider changed: ${e.target.value}`)
        device.quantity = e.target.value
    };

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
                        onChange={handleSliderChange}
                    />
                </Col>
            </Row>
        </Container>
    );
}


export default RangeSlider;