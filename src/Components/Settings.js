import {Card} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {useStateStore} from '../Model/Data';
import {SETTINGS_PANEL_TITLE} from '../Constants';
import React from 'react';


/**
 * Renders a settings panel with options for administering the app.
 *
 * @return {JSX.Element} rendered settings panel.
 */
export default function SettingsPanel() {
    const {state} = useStateStore();
    const dataSources = state.current_state.data_sources
    console.log('Data Sources: ')
    console.log(dataSources)

    const handleChange = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        // setValidated(true);
    };

    return (
        <Form>
            <Container fluid className='d-grid gap-3'>
                <Row>
                    <Col md={8}>
                        <Card className='m-0'>
                            <Card.Header className='admin-panel-header'>
                                {SETTINGS_PANEL_TITLE}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Data Sources</Card.Title>
                                <Row className='p-3'>
                                    <Form.Control as='select' className='input-mono'>
                                        {dataSources.map((dataSource) => (
                                            <>
                                                <option key={dataSource.id}>
                                                    {dataSource.path}
                                                </option>
                                            </>
                                        ))}
                                    </Form.Control>
                                </Row>
                                {/*<Card.Title>Add Source</Card.Title>*/}
                                <Row className='p-3'>
                                    <Form.Group className='position-relative mb-3'>
                                        <Form.Label className='data-edit-label'>Add Source</Form.Label>
                                        <Form.Control
                                            type='file'
                                            required
                                            name='file'
                                            onChange={handleChange}
                                            isInvalid={false}
                                        />
                                        <Form.Control.Feedback type='invalid' tooltip>

                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>


                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>

                    </Col>
                </Row>
            </Container>
        </Form>
    )
}
