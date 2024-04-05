import Form from 'react-bootstrap/Form';
import {useState} from "react";


function RangeSlider({device}) {

    const [sliderValue, setSliderValue] = useState(0);

    const handleSliderChange = (e) => {
        setSliderValue(e.target.value);
    };

    return (
        <>
            <Form.Range
                value={sliderValue}
                onChange={handleSliderChange}
            />
        </>
    );
}


export default RangeSlider;