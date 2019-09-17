import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { configStore } from '@/store/config';


const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    config: configStore,
  },
});

beforeEach(() => {
  store.replaceState({
    config: {
      userConfig: {},
    },
  });
});

test('load config', () => {
  const spyGet = jest.spyOn(Object.getPrototypeOf(localStorage), 'getItem');
  spyGet.mockReturnValue('{"foo": "bar"}');

  // eslint-disable-next-line no-shadow
  const store = new Vuex.Store({
    modules: {
      config: configStore,
    },
  });

  expect(store.getters.config).toMatchObject({
    foo: 'bar',
  });

  spyGet.mockRestore();
});

test('config getter', () => {
  expect(store.getters.config).not.toEqual({});
});

describe('update config', () => {
  const spySet = jest.spyOn(Object.getPrototypeOf(localStorage), 'setItem');

  beforeEach(() => {
    spySet.mockClear();
  });
  afterAll(() => {
    spySet.mockRestore();
  });

  test('update object', () => {
    store.commit('updateConfig', {
      key: 'obj',
      value: {
        foo: 'bar',
      },
    });

    expect(store.getters.config).toMatchObject({
      obj: {
        foo: 'bar',
      },
    });
    expect(spySet).toBeCalled();
  });

  test('update plain type', () => {
    store.commit('updateConfig', {
      key: 'foo',
      value: 'bar',
    });

    expect(store.getters.config).toMatchObject({
      foo: 'bar',
    });
    expect(spySet).toBeCalled();
  });
});
