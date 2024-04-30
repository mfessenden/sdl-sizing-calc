export const SECONDS_PER_DAY: number = 86400;
export const BYTES_TO_GB: number = 0.000000001;
export const SDL_HEADER = 'sdl-header.svg';
export const SDL_HEADER_HEIGHT: number = 48;
export const SDL_HEADER_WIDTH: number = 278;
export const SDL_STATE: string = 'sdl-state';
export const SDL_TITLE: string = 'SDL Sizing Calculator';
export const SAVE_STATE: string = 'save-state';
export const CLEAR_STATE: string = 'clear-state';
export const RESET_UI: string = 'reset-ui';
export const RESTORE_STATE: string = 'restore-state';
export const ADMIN_PANEL_NAME: string = 'Admin Panel';
export const SETTINGS_PANEL_TITLE: string = 'Settings';
export const DEFAULT_CATEGORY_ID: number = 3;


// data for the retention period tabs
export const RetentionPeriodData = [
    {
        id: 0,
        name: 'daily',
        display_name: 'Daily',
        multiplier: 1
    },
    {
        id: 1,
        name: 'weekly',
        display_name: 'Weekly',
        multiplier: 7
    },
    {
        id: 2,
        name: 'monthly',
        display_name: 'Monthly',
        multiplier: 30
    },
    {
        id: 3,
        name: 'yearly',
        display_name: 'Yearly',
        multiplier: 365
    }
]

export const IndustryDetailData = [
    {
        id: 0,
        name: 'industry',
        display_name: 'Industry'
    },
    {
        id: 1,
        name: 'industry_size',
        display_name: 'Industry Size'
    },
    {
        id: 2,
        name: 'org_size',
        display_name: 'Organization Size'
    }
]
