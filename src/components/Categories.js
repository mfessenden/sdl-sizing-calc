import React from 'react';
import Form from 'react-bootstrap/Form';
import {DEFAULT_CATEGORY_ID} from '../Constants';
import {useStateStore} from '../Model/Data';

function onSelectionChanged(eventKey) {
    console.log(`Selection changed: ${eventKey}`)
}


/**
 * Renders a dropdown select component with the current categories.
 *
 * @param {number} defaultCategoryId - default category ID selected when the component is rendered
 * @param {function} onSelected - handler for the dropdown change
 *
 * @return {JSX.Element} The rendered dropdown select component.
 */
export default function CategoriesSelect({defaultCategoryId = DEFAULT_CATEGORY_ID, onSelected = onSelectionChanged}) {
    const {state} = useStateStore();
    const categories = state.interface_data.categories

    return (
        <Form.Select
            defaultValue={defaultCategoryId}
            onChange={e => onSelected(e.target.value)}
        >
            {categories.map((category) => (
                <>
                    <option key={category.id} value={category.id}>
                        {category.display_name}
                    </option>
                </>
            ))}
        </Form.Select>
    )
}
