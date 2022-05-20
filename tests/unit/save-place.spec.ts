import { buildSavePlace } from '@/utils/save-place';
import { mockTorrent } from './utils'

describe('save-place', () => {
  test('case #1', () => {
    const root = buildSavePlace();
    expect(root).toStrictEqual({
      key: '',
      link: {},
      realSize: 0,
      size: 0,
      dirname: [''],
      torrents: [],
      subdirs: [],
    });
  });
  test('case #2', () => {
    const root = buildSavePlace([
      '/home/user/downloads/a/aa/aaa',
      '/home/user/downloads/a/aa/bbb',
      '/home/user/downloads/a/bb/bbb',
      '/home/user/downloads/b/cc/ccc',
    // eslint-disable-next-line @typescript-eslint/camelcase
    ].map(x => mockTorrent({save_path: x})));
    expect(root.subdirs.length).toBe(1);
    expect(root.subdirs[0].key).toBe('/home/user/downloads');
    expect(root.subdirs[0].subdirs.length).toBe(2);
  });
});
