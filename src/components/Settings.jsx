import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import {useStateStore} from '../model/Data';
import {SETTINGS_PANEL_TITLE} from '../Constants';


const downloadTxtFile = () => {
    console.log('download logic goes here')
}

/**
 * Renders a settings panel with options for administering the app.
 *
 * @return {JSX.Element} rendered settings panel.
 */
export default function SettingsPanel() {
    const {state, actions: {toggleResultAsBinary}} = useStateStore();

    const bytesMode: boolean = state.current_state.result_as_binary
    const bytesModeCheckLabel: string = bytesMode ? 'Bytes Mode: binary' : 'Bytes Mode: metric'

    const handleChange = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        // setValidated(true);
    };

    const onBytesModeToggled = ({ target: { value } }) => {
        toggleResultAsBinary()
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
                                <Card.Title className='admin-card-title'>General</Card.Title>
                                <Form.Check // prettier-ignore
                                    type='switch'
                                    id='custom-switch'
                                    label={bytesModeCheckLabel}
                                    onChange={onBytesModeToggled}
                                    checked={state.current_state.result_as_binary}
                                />

                                <Card.Title className='admin-card-title'>Quotes</Card.Title>
                                <Row className='p-3'>
                                    <Form.Control as='select' multiple className='input-mono'>
                                        <>
                                            <option key='option1'>Quote 1</option>
                                            <option key='option2'>Quote 2</option>
                                            <option key='option3'>Quote 3</option>
                                            <option key='option4'>Quote 4</option>
                                            <option key='option5'>Quote 5</option>
                                            <option key='option6'>Quote 6</option>
                                        </>
                                    </Form.Control>
                                </Row>

                                <Row className='flex-row-reverse mx-0'>
                                    <Button className='xs bg-sentinel-one data-edit-update'>Remove</Button>
                                </Row>


                                <Row className='flex-row-reverse p-3'>
                                    <Form.Group className='position-relative mb-3'>
                                        <Form.Label className='data-edit-label'>Load Quote</Form.Label>
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

                                <Row>
                                    <Button className='bg-sentinel-one' style={{maxWidth: '200px'}} onClick={downloadTxtFile}>Save Quote</Button>
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
