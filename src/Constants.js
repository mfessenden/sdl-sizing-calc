export const SECONDS_PER_DAY = 86400;
export const BYTES_TO_GB = 0.000000001;
export const SDL_HEADER = 'sdl-header.svg';
export const SDL_HEADER_HEIGHT = 48;
export const SDL_HEADER_WIDTH = 278;
export const SDL_STATE = 'sdl-state';
export const SDL_TITLE = 'SDL Calculator';
export const SAVE_STATE = 'save-state';
export const CLEAR_STATE = 'clear-state';
export const RESET_UI = 'reset-ui';
export const RESTORE_STATE = 'restore-state';
export const ADMIN_PANEL_NAME = 'Admin Panel';
export const SETTINGS_PANEL_TITLE = 'Settings';
export const DEFAULT_CATEGORY_ID = 3;


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