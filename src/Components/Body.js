
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataTable from './DataTable';
import ResultComponent from './Result';


export default function Body() {

    return (
        <Container fluid className='d-grid gap-3'>
            <Row>
                <Col md={8}>
                    <DataTable/>
                </Col>
                <Col md={4}>
                    <ResultComponent/>
                </Col>
            </Row>
        </Container>
    );
}
