import React, {useRef} from 'react'
import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {CLEAR_STATE, RESET_UI, RESTORE_STATE, SAVE_STATE, SDL_HEADER, SDL_HEADER_HEIGHT, SDL_HEADER_WIDTH, SDL_STATE} from '../Constants';
import DeviceFilteringInput from './Filter';
import {hasSavedData, useStateStore} from '../Model/Data';


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
        if (eventKey === SAVE_STATE) {
            // don't save these
            state.current_state.filter_string = null
            state.current_state.filter_active = false
            window.localStorage.setItem(SDL_STATE, JSON.stringify(state));
            console.log('Saving current state....')
        } else if (eventKey === CLEAR_STATE) {
            clearState()
        } else if (eventKey === RESET_UI) {
            resetState()
        } else if (eventKey === RESTORE_STATE) {
            restoreState()
        }
    };

    return (
        <Navbar sticky='top' expand='lg' className='bg-body-tertiary mb-3'>

            {/* Logo */}
            <Navbar.Brand href='/'>
                <Image src={SDL_HEADER} width={SDL_HEADER_WIDTH} height={SDL_HEADER_HEIGHT}/>
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
                            <NavDropdown.Item eventKey={SAVE_STATE} alt='Save current application data to local storage'>
                                Save State
                            </NavDropdown.Item>

                            <NavDropdown.Divider/>
                            <NavDropdown.Item disabled={!savedDataExists} eventKey={RESTORE_STATE} alt='Restore previously saved data'>
                                Load Saved State...
                            </NavDropdown.Item>

                            <NavDropdown.Item disabled={!savedDataExists} eventKey={CLEAR_STATE} alt='Remove saved state data'>
                                Clear Saved State
                            </NavDropdown.Item>

                                <NavDropdown.Divider/>
                                <NavDropdown.Item eventKey={RESET_UI} alt='Reset all device quantities'>
                                    Reset Calculator
                                </NavDropdown.Item>

                        </NavDropdown>
                    </Nav>
                    <DeviceFilteringInput hasActiveDevices={hasActiveDevices}/>
                </Offcanvas.Body>
            </Navbar.Offcanvas>

        </Navbar>
    )
}
