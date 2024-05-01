import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {
    CLEAR_STATE,
    LOAD_QUOTE,
    RESET_UI,
    RESTORE_STATE,
    SAVE_QUOTE_EXTERNAL,
    SAVE_QUOTE_INTERNAL,
    SAVE_STATE,
    SDL_STATE
} from '../Constants';
import {useStateStore} from '../model/Data';


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
        if (eventKey === SDL_STATE) {
            // // don't save these
            state.current_state.filter_string = null
            state.current_state.filter_active = false

            // set localstorage value
            window.localStorage.setItem(SDL_STATE, JSON.stringify(state));  // TODO: persistence via Firebase?
            console.log('Saving current state...')

        } else if (eventKey === LOAD_QUOTE) {
            console.log('Loading previously saved quote...')
        } else if (eventKey === SAVE_QUOTE_INTERNAL) {
            console.log('Saving current quote...')
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
                <NavDropdown.Item active={false} eventKey={SAVE_QUOTE_INTERNAL} alt='Save current quote to local storage'>
                    Save Quote...
                </NavDropdown.Item>

                <NavDropdown.Item disabled={true} active={false} eventKey={SAVE_QUOTE_EXTERNAL} alt='Save current quote to JSON'>
                    Save Quote to JSON...
                </NavDropdown.Item>

                <NavDropdown.Divider/>
                <NavDropdown.Item active={false} disabled={!savedDataExists} eventKey={RESTORE_STATE}
                                  alt='Restore previously saved data'>
                    Load Quote...
                </NavDropdown.Item>

                <NavDropdown.Item active={false} disabled={!savedDataExists} eventKey={CLEAR_STATE} alt='Remove saved state data'>
                    Clear Saved State
                </NavDropdown.Item>

                <NavDropdown.Divider/>
                <NavDropdown.Item active={false} eventKey={RESET_UI} alt='Reset all device quantities'>
                    Reset Calculator
                </NavDropdown.Item>

            </NavDropdown>
        </Nav>
    )
}