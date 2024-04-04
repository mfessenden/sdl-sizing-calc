import Form from 'react-bootstrap/Form';


const RangeSlider = (props) => {
    return (
        <>
            <Form.Label>
                {props.label}
            </Form.Label>
            <Form.Range />
        </>
    );
}


export default RangeSlider;