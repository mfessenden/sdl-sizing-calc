import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {
    CLEAR_STATE,
    RESET_APP_STATE,
    RESTORE_STATE,
    SAVE_STATE
} from '../Constants';
import {hasSavedData} from '../model/Data';
import {useStateStore} from '../model/Data';


/**
 * Renders the action menu in the top navbar component.
 *
 * @returns {React.Component} action menu dropdown component.
 */
export default function ActionMenu() {
    const {actions: {clearState, resetAppState, restoreState, saveState}} = useStateStore();

    // check if there's currently saved local storage data
    const savedDataExists = hasSavedData()

    const handleSelect = (eventKey) => {
        if (eventKey === SAVE_STATE) {
            saveState()
        } else if (eventKey === CLEAR_STATE) {
            clearState()
        } else if (eventKey === RESET_APP_STATE) {
            resetAppState()
        } else if (eventKey === RESTORE_STATE) {
            restoreState()
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
                <NavDropdown.Item active={false} eventKey={SAVE_STATE} alt='Remove saved state data'>
                    Save Current State
                </NavDropdown.Item>

                <NavDropdown.Item active={false} disabled={!savedDataExists} eventKey={RESTORE_STATE}
                                  alt='Restore previously saved data'>
                    Restore Saved State
                </NavDropdown.Item>


                <NavDropdown.Item active={false} disabled={!savedDataExists} eventKey={CLEAR_STATE} alt='Remove saved state data'>
                    Clear Saved State
                </NavDropdown.Item>


                <NavDropdown.Divider/>
                <NavDropdown.Item active={false} eventKey={RESET_APP_STATE} alt='Reset all device quantities'>
                    Reset Calculator
                </NavDropdown.Item>

            </NavDropdown>
        </Nav>
    )
}