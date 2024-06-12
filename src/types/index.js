// types used in the calculator


// item used to track each calculator line item
export const Device = {
    id: null,
    base_weight: 1.0,
    event_size: 508,
    quantity: 0,
    eps: null,     // ts: optional value (`eps?`)
    name: null,
    display_name: null
}


// data attributes for a saved quote
export const QuoteMetadata = {
    name: null,
    date: null,
    author: null,
    author_email: null,
}


// attributes used - along with devices - to calculate the current quote
export const Quote = {
    industry_id: null,
    industry_size: null,
    org_size: null,
    retention_interval: 1,
    retention_quantity:  1,
    display_name: null,
    metadata: {...QuoteMetadata}
}


// default app state, including the current quote
export const AppState = {
    filter_string: null,
    filter_active: false,
    result_as_binary: true,
    current_quote: null
}


// TODO: saving quotes (`QuoteMetadata` moves here, add 'AppState.saved_quotes')
export const SavedQuote = {
    data: AppState,
    metadata: QuoteMetadata
}