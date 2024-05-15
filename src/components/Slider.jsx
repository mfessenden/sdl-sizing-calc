import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useStateStore} from '../model/Data';


/**
 * Component that takes device data and renders a single row label (device `display_name`) and a slider representing
 * the device's quantity. This is used as the first column in the calculator tables.
 *
 *     +-------------------------.---------------+
 *    |Generic Data Source     ( )------------  |
 *    +-------------------------'---------------+
 *
 * @param {Object} device - the current device being rendered.
 * @param {boolean} disabled - device has a set EPS value, so quantity is locked
 * @return {JSX.Element} - The rendered component.
 */
export default function RangeSlider({device, disabled}) {
    const {actions: {setQuantity}} = useStateStore();
    return (
        <Container>
            <Row>
                <Col md={8}>
                    <Form.Label
                        className='device-desc'
                    >
                        {device.display_name}
                    </Form.Label>
                </Col>
                <Col md={4}>
                    <Form.Range
                        key={device.id}
                        value={device.quantity}
                        onChange={e => setQuantity(device.id, e.target.value)}
                        disabled={disabled}
                    />
                </Col>
            </Row>
        </Container>
    );
}
