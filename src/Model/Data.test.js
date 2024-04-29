import {calculateCurrentQuote} from './Data';
import {calculateDeviceUsage} from '../Utils';


const TestDevices = [
    {
        id: 0,
        name: 'test_device_0',
        display_name: 'Device with Base Weight 0.5',
        base_weight: 0.5,
        event_size: 508,
        quantity: 1
    },
    {
        id: 1,
        name: 'test_device_1',
        display_name: 'Device with Base Weight 1.0',
        base_weight: 1.0,
        event_size: 508,
        quantity: 1
    }
]


test('calculates quote correctly', () => {
    const retention_periods: number = 2;
    const retention_multiplier: number = 7; // weekly
    const result = calculateCurrentQuote(TestDevices, retention_periods, retention_multiplier)

    const expectedQuoteSize: number = 921715200
    expect(result).toBe(expectedQuoteSize)
});


test('calculate device usage', () => {
    const result = calculateDeviceUsage(TestDevices[0])
    // ((1 x 0.5) * 508) * 86400
    const expectedDeviceSize: number = 21945600
    expect(result).toBe(expectedDeviceSize)
});
