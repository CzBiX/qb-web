import { isPlainObject, merge } from 'lodash';
import Vue from 'vue';
import { Module } from 'vuex';
import { ConfigState, ConfigPayload } from './types';

const configKey = 'qb-config';

const defaultConfig = {
  updateInterval: 2000,
  pageOptions: {
    itemsPerPage: 50,
  },
  filter: {
    state: null,
    category: null,
    site: null,
    query: null,
  },
  locale: null,
};

function saveConfig(obj: any) {
  localStorage.setItem(configKey, JSON.stringify(obj));
}

export function loadConfig() {
  const tmp = localStorage.getItem(configKey);
  if (!tmp) {
    return {};
  }

  return JSON.parse(tmp);
}

export const configStore: Module<ConfigState, any> = {
  state() {
    return {
      userConfig: loadConfig(),
    };
  },
  mutations: {
    updateConfig(state, payload: ConfigPayload) {
      const { key, value } = payload;
      if (isPlainObject(value)) {
        const tmp = merge({}, state.userConfig[key], value);
        Vue.set(state.userConfig, key, tmp);
      } else {
        Vue.set(state.userConfig, key, value);
      }

      saveConfig(state.userConfig);
    },
  },
  getters: {
    config(state) {
      return merge({}, defaultConfig, state.userConfig);
    },
  },
};
