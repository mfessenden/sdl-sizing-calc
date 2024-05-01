import {calculateQuote} from './Data';
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
    const retention_quantity: number = 2;
    const retention_interval: number = 7; // weekly
    const result = calculateQuote(TestDevices, retention_quantity, retention_interval)

    const expectedQuoteSize: number = 921715200
    expect(result).toBe(expectedQuoteSize)
});


test('calculate device usage', () => {
    const result = calculateDeviceUsage(TestDevices[0], 1)
    // 0.5 * 508
    const expectedDeviceSize: number = 254
    expect(result).toBe(expectedDeviceSize)
});
