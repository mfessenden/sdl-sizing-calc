import Form from 'react-bootstrap/Form';


function RangeSlider({device}) {
    return (
        <>
            <Form.Range
                value={device.quantity}
            />
        </>
    );
}


export default RangeSlider;