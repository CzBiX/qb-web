import dayjs from 'dayjs';
import {
  formatDuration, formatTimestamp, formatProgress, formatSize, formatAsDuration, toPrecision,
} from '@/filters';

describe('to precision', () => {
  test.each([
    [0.1, 1, '0'],
    [0.1, 2, '0.1'],
    [122, 1, '122'],
  ])('case %#', (value, precision, result) => {
    expect(toPrecision(value, precision)).toEqual(result);
  });
});

describe('format size', () => {
  test.each([
    [0, '0 B'],
    [10, '10 B'],
    [500, '500 B'],
    [1000, '0.98 KiB'],
  ])('case %#', (value, result) => {
    expect(formatSize(value)).toEqual(result);
  });
});

describe('format duration', () => {
  test.each([
    [0, undefined, '0s'],
    [0, { minUnit: 1}, '1m'],
    [2 * 60 + 35, undefined, '1m 35s'],
    [2 * 60 + 35, { minUnit: 1}, '1m'],
    [3600 * 24, { dayLimit: 1 }, '∞'],
    [3600 * 24, undefined, '1d'],
    [3600 * 26, undefined, '1d 2h'],
  ])('case %#', (value, options, result) => {
    expect(formatDuration(value, options)).toEqual(result);
  });
});

describe('format timestamp', () => {
  test.each([
    [948602096, '2000-01-23 12:34:56'],
    [null, ''],
    [-1, ''],
  ])('case %#', (value, result) => {
    expect(formatTimestamp(value)).toEqual(result);
  });
});

test('format as duration', () => {
  const date = dayjs().subtract(1, 'd').subtract(1, 'h');
  expect(formatAsDuration(date.unix())).toEqual('1d 1h');
});

describe('format progress', () => {
  test.each([
    [0, '0.00'],
    [0.0001, '0.01'],
    [0.001, '0.10'],
    [0.01, '1.00'],
    [0.1, '10.0'],
    [1, '100'],
  ])('case %#', (value, result) => {
    expect(formatProgress(value)).toEqual(`${result}%`);
  });
});
