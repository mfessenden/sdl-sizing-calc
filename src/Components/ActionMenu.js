import NavDropdown from 'react-bootstrap/NavDropdown';
import {CLEAR_STATE, RESET_UI, RESTORE_STATE, SAVE_STATE} from '../Constants';
import {useStateStore} from '../Model/Data';


/**
 * Renders the action meny in the top navbar component.
 *
 * @returns {React.Component} action menu dropdown component.
 */
export default function ActionMenu() {
    const {state} = useStateStore()

    // check if there's currently saved local storage data
    const savedDataExists = state.current_state.has_saved_data


    return (
        <NavDropdown
            title='Actions'
            id='offcanvasNavbarDropdown-expand-lg'
        >
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
    )
}