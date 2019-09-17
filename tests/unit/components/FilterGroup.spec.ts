import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import '@/directives';
import FilterGroup from '@/components/drawer/FilterGroup.vue';
import { FilterGroup as types } from '@/components/types';
import { mock } from '../utils';

const localVue = createLocalVue();
localVue.use(Vuex);

const userConfig = {
  filter: {
    foo: 'bar',
  },
};

const store = new Vuex.Store({
  getters: {
    config() {
      return userConfig;
    },
  },
  mutations: {
    updateConfig: jest.fn(),
  },
});

function mount(propsData: object) {
  return shallowMount(FilterGroup, {
    localVue,
    store,
    propsData,
    stubs: [
      'v-list-group',
      'v-list-item',
      'v-list-item-icon',
      'v-list-item-title',
      'v-list-item-content',
      'v-img',
    ],
  });
}

const emptyGroup: types.Group = {
  title: '',
  icon: '',
  children: [],
  model: false,
  select: '',
};

const emptyChild: types.Child = {
  title: '',
  key: null,
  icon: '',
  append: null,
};

const mockGroup = mock(emptyGroup);
const mockChild = mock(emptyChild);

test('normal create', () => {
  const group = mockGroup({
    children: [
      mockChild({
        key: 'bar',
      }),
    ],
    select: 'foo',
    model: true,
  });

  const wrapper = mount({
    group,
  });
  const vmAny = wrapper.vm as any;

  expect(vmAny.selected).toEqual('bar');
  expect(vmAny.model).toBeTruthy();
});

test('manual select child', () => {
  const group = mockGroup({
    select: 'foo',
  });

  const wrapper = mount({
    group,
  });
  const vmAny = wrapper.vm as any;

  vmAny.select('ha');
  expect(vmAny.selected).toEqual('ha');
});

test('unselect if can not found children', () => {
  const group = mockGroup({
    select: 'foo',
  });

  const wrapper = mount({
    group,
  });
  const { vm } = wrapper;

  expect((wrapper.vm as any).selected).toBeNull();
});
