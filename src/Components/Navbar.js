import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';



export function TopNavbart() {
    return (
        <Navbar expand='lg' className='bg-body-tertiary mb-3'>
            <Container fluid>
                <Navbar.Brand href='#home'>
                    <img
                        alt=''
                        src='images/sdl-header.svg'
                        width='278'
                        height='48'
                        className='d-inline-block align-middle'
                    />{' '}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='offcanvasNavbar-expand-lg'/>
                <Navbar.Offcanvas
                    id='offcanvasNavbar-expand-lg'
                    aria-labelledby='offcanvasNavbarLabel-expand-lg'
                    placement='end'
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id='offcanvasNavbarLabel-expand-lg'>
                            SDL Calculator
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className='flex-grow-1 pe-3'>
                            <Nav.Link href='#action1'>Edit Data</Nav.Link>
                            <Nav.Link href='#action2'>Settings</Nav.Link>
                            <NavDropdown
                                title='Actions'
                                id='offcanvasNavbarDropdown-expand-lg'
                            >
                                <NavDropdown.Item href='#resetstate'>Reset State</NavDropdown.Item>
                                <NavDropdown.Item href='#savestate'>Save State</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form>
                            <Form.Control
                                type='search'
                                placeholder='Filter'
                                className='me-2'
                                aria-label='filter'
                            />
                        </Form>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>)
}