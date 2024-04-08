import Form from 'react-bootstrap/Form';
import {useStateStore} from '../Models';


function RangeSlider({device}) {
    const data = useStateStore()

    const handleSliderChange = (e) => {
        // device.quantity = e.target.value

        data.setDeviceQuantity(device.id, e.target.value)
        console.log(`Device updated: '${device.name}', value: '${device.quantity}'`)
    };

    return (
        <>
            <Form.Range
                key={device.id}
                value={device.quantity}
                onChange={handleSliderChange}
            />
        </>
    );
}


export default RangeSlider;