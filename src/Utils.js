import {Device} from './types';
import {BYTES_TO_GB} from './Constants';


/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si: boolean = false, dp: number = 1) {
    if (isNaN(bytes)) {
        return '0 GB'
    }
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' GB';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}


/**
 * Converts a number to a string with a fixed precision of one decimal place.
 *
 * @param {number} value - number to convert.
 * @returns {string} - converted number as a string.
 */
export function numberToString(value: number): string {
    value = parseFloat(value)
    if (value === 0) {
        return '0'
    } else if (value < 0.1) {
        return '0.1'
    } else {
        const valueString: string = value.toFixed(1)
        if (valueString.endsWith('.0')) {
            return value.toFixed()
        } else {
            return valueString
        }
    }
}


/**
 * Calculates the events per second for a given device.
 *
 * @param {Device} item - device information object
 * @param industryIdMultiplier - multiplier based on industry identifier
 * @param industrySizeMultiplier - multiplier based on industry size
 * @param orgSizeMultiplier - multiplier based on a specific organization size range
 * @return {number} - calculated events per second value for the given device
 */
export function calculateEventsPerSecond(item: Device, industryIdMultiplier: number = 1, industrySizeMultiplier: number = 1, orgSizeMultiplier: number = 1): number {
    if (!item.quantity) {
        return 0
    }
    if (item.eps) {
        return Number(item.eps)
    }

    // weighted industry values
    const industryMultiplier: number = industryIdMultiplier * industrySizeMultiplier * orgSizeMultiplier
    return (parseFloat(item.quantity) * item.base_weight) * industryMultiplier
}


/**
 * Calculates the device usage (in bytes per second) based on the given device information.
 *
 * @param item - device information object
 * @param industryIdMultiplier - multiplier based on industry identifier
 * @param industrySizeMultiplier - multiplier based on industry size
 * @param orgSizeMultiplier - multiplier based on a specific organization size range
 * @return {number} - The device usage in bytes for a given time period.
 */
export function calculateItemPerSecondUsage(item: Device, industryIdMultiplier: number = 1, industrySizeMultiplier: number = 1, orgSizeMultiplier: number = 1): number {
    if (!item.quantity) {
        return 0
    }
    const eventsPerSecond: number = calculateEventsPerSecond(item, industryIdMultiplier, industrySizeMultiplier, orgSizeMultiplier)
    return eventsPerSecond * item.event_size
}


/**
 * Converts bytes to gigabytes.
 *
 * @param {number} bytes - bytes to be converted.
 * @return {number} - the value expressed in gigabytes.
 */
export function bytesToGigs(bytes: number): number {
    return bytes * BYTES_TO_GB
}
