import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {CLEAR_STATE, RESET_UI, RESTORE_STATE, SAVE_STATE, SDL_STATE} from '../Constants';
import {useStateStore} from '../Model/Data';


/**
 * Renders the action menu in the top navbar component.
 *
 * @returns {React.Component} action menu dropdown component.
 */
export default function ActionMenu() {
    const {state, actions: {clearState, resetState, restoreState}} = useStateStore();

    // check if there's currently saved local storage data
    const savedDataExists = state.current_state.has_saved_data

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
        <Nav
            className='flex-grow-1 pe-3'
            onSelect={(selectedKey) => handleSelect(selectedKey)}
        >
            <NavDropdown
                title='Actions'
                id='offcanvasNavbarDropdown-expand-lg'
            >
                <NavDropdown.Item eventKey={SAVE_STATE} alt='Save current application data to local storage'>
                    Save State
                </NavDropdown.Item>

                <NavDropdown.Divider/>
                <NavDropdown.Item disabled={!savedDataExists} eventKey={RESTORE_STATE}
                                  alt='Restore previously saved data'>
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
    )
}