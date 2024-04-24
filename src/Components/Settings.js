import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {useStateStore} from '../Model/Data';
import {SETTINGS_PANEL_TITLE} from '../Constants';
import Button from 'react-bootstrap/Button';


const downloadTxtFile = () => {
    console.log('download logic goes here')
}

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

                                <Card.Title className='admin-card-title'>Data Sources</Card.Title>
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


                                <Card.Title className='admin-card-title'>Quotes</Card.Title>
                                <Row className='p-3'>
                                    <Form.Control as='select' multiple className='input-mono'>
                                        <>
                                            <option>Quote 1</option>
                                            <option>Quote 2</option>
                                            <option>Quote 3</option>
                                            <option>Quote 4</option>
                                            <option>Quote 5</option>
                                            <option>Quote 6</option>
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
