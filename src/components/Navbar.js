import Image from 'react-bootstrap/Image'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
    ADMIN_PANEL_NAME,
    SDL_HEADER,
    SDL_HEADER_HEIGHT,
    SDL_HEADER_WIDTH,
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

                    <ActionMenu/>
                    <DeviceFilteringInput hasActiveDevices={hasActiveDevices}/>
                </Offcanvas.Body>
            </Navbar.Offcanvas>

        </Navbar>
    )
}
