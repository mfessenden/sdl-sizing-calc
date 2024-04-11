
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataTable from './DataTable';
import ResultComponent from './Result';
import {useStateStore} from "../Model/Context";



export default function Body() {
    const {state, actions} = useStateStore()
    const currentState = state.current_state

    return (
        <Container fluid>
            <Row>
                <Col md={8}>
                    <DataTable/>
                </Col>
                <Col md={4}>
                    <ResultComponent useButton={false}/>
                </Col>
            </Row>
        </Container>
    );
}
