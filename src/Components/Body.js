
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CalculatorBody from './Calculator';
import ResultBody from './Result';


/**
 * Renders the body of the calculator page.
 *
 * @returns {JSX.Element} JSX element representing the calculator body.
 */
export default function Body() {

    return (
        <Container fluid className='d-grid gap-3'>
            <Row>
                <Col md={8}>
                    <CalculatorBody/>
                </Col>
                <Col md={4}>
                    <ResultBody/>
                </Col>
            </Row>
        </Container>
    );
}
