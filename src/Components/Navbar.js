import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
    ADMIN_PANEL_NAME,
    CLEAR_STATE,
    RESET_UI,
    RESTORE_STATE,
    SAVE_STATE,
    SDL_HEADER,
    SDL_HEADER_HEIGHT,
    SDL_HEADER_WIDTH,
    SDL_STATE
} from '../Constants';
import ActionMenu from './ActionMenu';
import DeviceFilteringInput from './Filter';
import {useStateStore} from '../Model/Data';


/**
 * Renders the top navigation bar component.
 *
 * @param {boolean} adminMode - Indicates whether to enable debug/admin mode.
 * @return {JSX.Element} - The rendered top navigation bar component.
 */
export default function TopNavbar({adminMode = false}) {
    const {state, actions: {clearState, resetState, restoreState}} = useStateStore();
    var hasActiveDevices = false
    const devices = state.calculator.devices.device_items
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

            // set localstorage value
            window.localStorage.setItem(SDL_STATE, JSON.stringify(state));  // TODO: persistence via Firebase?
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
        <Navbar sticky='top' expand='lg' className='bg-body-tertiary align-middle mb-3'>

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

                    {adminMode &&
                        <Nav>
                            <Nav.Item><Nav.Link href='/admin'>{ADMIN_PANEL_NAME}</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href='/settings'>Settings</Nav.Link></Nav.Item>
                        </Nav>
                    }

                    <Nav
                        className='flex-grow-1 pe-3'
                        onSelect={(selectedKey) => handleSelect(selectedKey)}
                    >
                        <ActionMenu/>

                    </Nav>
                    <DeviceFilteringInput hasActiveDevices={hasActiveDevices}/>
                </Offcanvas.Body>
            </Navbar.Offcanvas>

        </Navbar>
    )
}
