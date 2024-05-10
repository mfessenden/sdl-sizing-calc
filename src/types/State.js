// Default app state
export const AppState = {
    admin_mode: false,
    has_saved_data: false,
    filter_string: null,
    filter_active: false,
    current_quote: null,
    result_as_binary: true,
    stored_quotes: []
}


export const QuoteMetadata = {
    name: null,
    date: null,
    author: null,
    author_email: null,
}


export const Device = {
    id: null,
    base_weight: 1.0,
    event_size: 508,
    quantity: 0,
    name: null,
    display_name: null,
    eps: null
}


export const Quote = {
    industry_id: null,
    industry_size: null,
    org_size: null,
    retention_interval: 1,
    retention_quantity:  1,
    metadata: {...QuoteMetadata}
}

