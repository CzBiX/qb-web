import {
  findSameNamedTorrents, timeout, codeToFlag, sleep,
} from '@/utils';
import { mockTorrent } from './utils';

test('timeout', async () => {
  jest.useFakeTimers();

  const fn = jest.fn();

  sleep(1000).then(fn);
  expect(fn).not.toBeCalled();

  jest.advanceTimersByTime(500);
  // HACK: force wait promise,
  // see https://stackoverflow.com/a/51132058/2806903
  // and https://stackoverflow.com/a/52196951/2806903
  await Promise.resolve();
  expect(fn).not.toBeCalled();

  jest.advanceTimersByTime(500);
  await Promise.resolve();
  expect(fn).toBeCalled();
});

test('code to flag', () => {
  expect(codeToFlag('CN')).toMatchObject({
    char: '🇨🇳',
    url: expect.stringContaining('1f1e8-1f1f3'),
  });
});

describe('find same named torrents', () => {
  const torrents = [
    mockTorrent({
      hash: '0',
      name: 'A',
    }),
    mockTorrent({
      hash: '1',
      name: 'B',
    }),
    mockTorrent({
      hash: '2',
      name: 'A',
    }),
    mockTorrent({
      hash: '3',
      name: 'C',
    }),
  ];

  test.each([
    [[mockTorrent({ name: 'A' })], [torrents[0], torrents[2]]],
    [[mockTorrent({ name: 'B' })], [torrents[1]]],
    [[mockTorrent({ name: 'C' })], [torrents[3]]],
    [[mockTorrent({ hash: '0', name: 'A' })], [torrents[2]]],
  ])('case %#', (target, result) => {
    expect(findSameNamedTorrents(torrents, target)).toEqual(result);
  });
});
