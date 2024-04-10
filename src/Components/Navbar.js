import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function SDLNavbar() {
    return (
        <Navbar className='bg-body-tertiary justify-content-between'>
            <Container fluid>
                <Navbar.Brand href='#home'>
                    <img
                        alt=''
                        src='images/sdl-header.svg'
                        width='278'
                        height='48'
                        className='d-inline-block align-top'
                    />{' '}
                </Navbar.Brand>
            </Container>
            <Form inline className='justify-content-end'>
                <Row>
                    <Col xs='auto'>
                        <Form.Control
                            type='text'
                            placeholder='Filter'
                            className=' mr-sm-2'
                        />
                    </Col>
                </Row>
            </Form>
        </Navbar>
    );
}
