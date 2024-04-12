import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import FilterInput from './Filter';


// See flex usage: https://getbootstrap.com/docs/5.1/utilities/flex/
export function TopNavbar({debugMode = false}) {

    return (
        <Navbar expand='lg' className='bg-body-tertiary mb-3'>
            <Navbar.Brand href='#home'>
                <Image src='images/sdl-header.svg' width='278' height='48'/>
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

                    {debugMode &&
                        // <Nav className='flex-grow-1 pe-3'>
                        <Nav>
                            <Nav.Link href='/data'>Edit Data</Nav.Link>
                            <Nav.Link href='/settings'>Settings</Nav.Link>
                            <NavDropdown
                                title='Actions'
                                id='offcanvasNavbarDropdown-expand-lg'
                            >
                                {/* these will call functions, not routes */}
                                <NavDropdown.Item href='#resetstate'>Reset State</NavDropdown.Item>
                                <NavDropdown.Item href='#savestate'>Save State</NavDropdown.Item>
                            </NavDropdown>
                            <FilterInput/>
                        </Nav>
                    }
                    <FilterInput/>
                </Offcanvas.Body>
            </Navbar.Offcanvas>

        </Navbar>)
}