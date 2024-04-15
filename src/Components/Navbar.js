import React, {useRef} from 'react'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import FilterInput from './Filter';
import {hasSavedData, useStateStore} from '../Model/Data';


// See flex usage: https://getbootstrap.com/docs/5.1/utilities/flex/
export function TopNavbar({debugMode = false}) {
    const {state, actions: {clearState, resetState ,restoreState}} = useStateStore();
    const savedDataExists = hasSavedData()
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
            console.log('Saving current state....')
        } else if (eventKey === 'clear-state') {
            clearState()
        } else if (eventKey === 'reset-ui') {
            resetState()
        } else if (eventKey === 'restore-state') {
            restoreState()
        }
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
                            <NavDropdown.Item eventKey='save-state' alt='Save current application data to local storage'>
                                Save State
                            </NavDropdown.Item>

                            <NavDropdown.Divider/>
                            <NavDropdown.Item disabled={!savedDataExists} eventKey='restore-state' alt='Restore previously saved data'>
                                Load Saved State...
                            </NavDropdown.Item>

                            <NavDropdown.Item disabled={!savedDataExists} eventKey='clear-state' alt='Remove saved state data'>
                                Clear Saved State
                            </NavDropdown.Item>

                            {debugMode &&
                                <>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item eventKey='reset-ui' alt='Reset all device quantities'>
                                        Reset UI
                                    </NavDropdown.Item>
                                </>
                            }

                        </NavDropdown>
                    </Nav>
                    <FilterInput hasActiveDevices={hasActiveDevices}/>
                </Offcanvas.Body>
            </Navbar.Offcanvas>

        </Navbar>
    )

}
