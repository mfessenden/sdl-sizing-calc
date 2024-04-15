import React, {useRef} from 'react'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import FilterInput from './Filter';
import {useStateStore} from '../Model/Context';


// See flex usage: https://getbootstrap.com/docs/5.1/utilities/flex/
export function TopNavbar({debugMode = false}) {
    const {state} = useStateStore();
    var hasActiveDevices = false
    const devices = state.device_types
    for (let device of devices) {
        if (device.quantity > 0) {
            hasActiveDevices = true;
            break;
        }
    }

    const handleSelect = (eventKey) => {
        if (eventKey === 'save-state') {
            window.localStorage.setItem('sdl-state', JSON.stringify(state));
        } else if (eventKey === 'reset-state') {
            window.localStorage.removeItem('sdl-state')

            for (let device of state.device_types) {
                device.quantity = 0
            }
        }

        console.log(`Selected ${eventKey}`)
    };

    return (
        <Navbar expand='lg' className='bg-body-tertiary mb-3'>

            {/* Logo */}
            <Navbar.Brand href='#home'>
                <Image src='images/sdl-header.svg' width='278' height='48'/>
            </Navbar.Brand>

            {/* Collapsable Items */}
            <Navbar.Toggle aria-controls='offcanvasNavbar-expand-lg'/>
            <Navbar.Offcanvas
                id='offcanvasNavbar-expand-lg'
                aria-labelledby='offcanvasNavbarLabel-expand-lg'
                placement='end'
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id='offcanvasNavbarLabel-expand-lg'>SDL Calculator</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>

                    {debugMode &&
                        <Nav>
                            <Nav.Item><Nav.Link eventKey='/data'>Edit Data</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey='/settings'>Settings</Nav.Link></Nav.Item>
                        </Nav>
                    }


                    <Nav
                        className='flex-grow-1 pe-3'
                        onSelect={(selectedKey) => handleSelect(selectedKey)}
                    >
                        <NavDropdown
                            title='Actions'
                            id='offcanvasNavbarDropdown-expand-lg'
                        >
                            {/* these will call functions, not routes */}
                            <NavDropdown.Item eventKey='save-state'>
                                Save State
                            </NavDropdown.Item>

                            <NavDropdown.Item eventKey='reset-state'>
                                Reset State
                            </NavDropdown.Item>

                        </NavDropdown>
                    </Nav>
                    <FilterInput hasActiveDevices={hasActiveDevices}/>
                </Offcanvas.Body>
            </Navbar.Offcanvas>

        </Navbar>
    )

}
