import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {RESET_APP_STATE} from '../Constants';
import {useStateStore} from '../model/Data';


/**
 * Renders the action menu in the top navbar component.
 *
 * @returns {React.Component} action menu dropdown component.
 */
export default function ActionMenu() {
    const {actions: {resetAppState}} = useStateStore();

    const handleSelect = (eventKey) => {
        if (eventKey === RESET_APP_STATE) {
            resetAppState()
        }
    };

    return (
        <Nav
            className='flex-grow-1 pe-3'
            onSelect={(selectedKey) => handleSelect(selectedKey)}
        >
            <NavDropdown
                title='Actions'
                id='offcanvasNavbarDropdown-expand-lg'
            >
                <NavDropdown.Item active={false} eventKey={RESET_APP_STATE} alt='Reset all device quantities'>
                    Reset Calculator
                </NavDropdown.Item>

            </NavDropdown>
        </Nav>
    )
}