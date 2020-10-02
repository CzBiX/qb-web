import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import store from '@/store';
import { RootState } from '@/store/types';
import { mock, mockBaseTorrent } from '../utils';


const localVue = createLocalVue();
localVue.use(Vuex);

const emtpyState: RootState = {
  rid: 0,
  mainData: undefined,
  preferences: null,
  pasteUrl: null,
  needAuth: false,
};

const mockState = mock(emtpyState);

beforeEach(() => {
  store.replaceState(emtpyState);
});

test('update preferences', () => {
  const obj = {
    url: 'something',
  };
  store.commit('updatePreferences', obj);

  expect(store.state.preferences).toEqual(obj);
});

test('set paste url', () => {
  store.commit('setPasteUrl', {
    url: 'something',
  });

  expect(store.state.pasteUrl).toEqual('something');
});

describe('all torrents getter', () => {
  test('empty', () => {
    expect(store.getters.allTorrents).toEqual([]);
  });

  test('with data', () => {
    store.replaceState(mockState({
      mainData: {
        categories: {},
        // eslint-disable-next-line @typescript-eslint/camelcase
        server_state: undefined as any,
        torrents: {
          a: mockBaseTorrent({}),
          b: mockBaseTorrent({}),
        },
      },
    }));

    expect(store.getters.allTorrents).toMatchObject([
      { hash: 'a' }, { hash: 'b' },
    ]);
  });
});
