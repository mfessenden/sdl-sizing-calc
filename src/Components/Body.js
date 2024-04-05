
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataTable from './DataTable';
import Result from './Result';



export default function Body() {
    return (
        <Container>
            <Row>
                <Col md={8}>
                    <DataTable/>
                </Col>
                <Col md={4}>
                    <Result/>
                </Col>
            </Row>
        </Container>
    );
}
