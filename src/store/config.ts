import { isPlainObject, merge } from 'lodash';
import Vue from 'vue';
import { Module } from 'vuex';
import { ConfigState, ConfigPayload } from './types';

const configKey = 'qb-config';

export interface Config {
  baseUrl: string | null;
  updateInterval: number;
  pageOptions: any;
  filter: {
    state: string | null;
    category: string | null;
    site: string | null;
    query: string | null;
  };
  locale: string | null;
  darkMode: string | null;
}

const defaultConfig = {
  baseUrl: null,
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
  darkMode: null,
};

function saveConfig(obj: any) {
  localStorage.setItem(configKey, JSON.stringify(obj));
}

export function loadConfig(): Partial<Config> {
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
