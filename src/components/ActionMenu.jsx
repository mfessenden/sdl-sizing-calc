import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {
    CLEAR_STATE,
    LOAD_TEST_STATE,
    LOAD_QUOTE,
    RESET_APP_STATE,
    RESTORE_STATE,
    SAVE_QUOTE_EXTERNAL,
    SAVE_QUOTE_INTERNAL,
    SAVE_STATE
} from '../Constants';
import {hasSavedTestData, hasSavedData} from '../model/Data';
import {useStateStore} from '../model/Data';


/**
 * Renders the action menu in the top navbar component.
 *
 * @returns {React.Component} action menu dropdown component.
 */
export default function ActionMenu() {
    const {state, actions: {clearState, generateQuote, loadTestState, resetAppState, restoreState, saveState, saveQuote}} = useStateStore();

    // check if there's currently saved local storage data
    const savedDataExists = hasSavedData()

    // this is test state data (NYI)
    const savedStateExists = hasSavedTestData()

    const handleSelect = (eventKey) => {
        if (eventKey === SAVE_STATE) {
            saveState()
        } else if (eventKey === LOAD_QUOTE) {
            console.log('NYI: Loading previously saved quote...')
        } else if (eventKey === LOAD_TEST_STATE) {
            console.log('Loading test state...')
            loadTestState()
        } else if (eventKey === SAVE_QUOTE_INTERNAL) {
            generateQuote()
        } else if (eventKey === SAVE_QUOTE_EXTERNAL) {
            saveQuote()
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
                <NavDropdown.Item active={false} eventKey={SAVE_QUOTE_INTERNAL} alt='Save current quote to local storage'>
                    Save Quote...
                </NavDropdown.Item>

                <NavDropdown.Item disabled={false} active={false} eventKey={SAVE_QUOTE_EXTERNAL} alt='Save current quote to JSON'>
                    Save Quote to JSON...
                </NavDropdown.Item>

                <NavDropdown.Divider/>
                <NavDropdown.Item active={false} disabled={true} eventKey={LOAD_QUOTE}
                                  alt='Load a saved quote'>
                    Load Quote...
                </NavDropdown.Item>
                <NavDropdown.Divider/>

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

                <NavDropdown.Item active={false} disabled={!savedStateExists} eventKey={LOAD_TEST_STATE} alt='Remove saved state data'>
                    Load Test State Data...
                </NavDropdown.Item>


                <NavDropdown.Divider/>
                <NavDropdown.Item active={false} eventKey={RESET_APP_STATE} alt='Reset all device quantities'>
                    Reset Calculator
                </NavDropdown.Item>

            </NavDropdown>
        </Nav>
    )
}