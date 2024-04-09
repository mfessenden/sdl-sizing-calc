import {React, useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';


function DropdownSelect({ options, value, ...props }) {
    const dropdown_options = options.map((item, index) => {
        return (
            <Dropdown.Item
                eventKey={item.value}
                key={index}
            >
                {item.name}
            </Dropdown.Item>
        );
    });

    return (
        <Dropdown {...props}>
            <Dropdown.Toggle variant='secondary' block style={{ textAlign: 'left' }}>
                {value}
            </Dropdown.Toggle>
            <Dropdown.Menu>{dropdown_options}</Dropdown.Menu>
        </Dropdown>
    );
}





function DropdownMenu(){
    const [values, setValues] = useState({media_type: ''});

    const options = [
        {id: 0, name: 'energy', display_name: 'Energy / Utilities', weight: 0.95},
        {id: 1, name: 'consumer_product', display_name: 'Consumer - Products/Equipment', weight: 1},
        {id: 2, name: 'consumer_retail', display_name: 'Consumer - Retail/Services', weight: 2},
        {id: 3, name: 'financial_insurance', display_name: 'Financial - Insurance / Services', weight: 1.2},
        {id: 4, name: 'government_federal', display_name: 'Government - Federal', weight: 1.4},
        {id: 5, name: 'government_local', display_name: 'Government - Local', weight: 0.75},
        {id: 6, name: 'government_state', display_name: 'Government - State', weight: 1},
    ]

    function handleItemSelect(event_value) {
        setValues({ ...values, media_type: event_value });
    }

    return(
        <DropdownSelect
            value={values.media_type}
            onSelect={handleItemSelect}
            options={options}
        />
    )
}


export {
    DropdownSelect,
    DropdownMenu
}