import _ from 'lodash';
import Vue from 'vue';
import { Module } from 'vuex';
import { ConfigState } from './types';

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

export const configStore : Module<ConfigState, any> = {
  state() {
    return {
      userConfig: loadConfig(),
    };
  },
  mutations: {
    updateConfig(state, payload) {
      const { key, value } = payload;
      if (_.isPlainObject(value)) {
        const tmp = _.merge({}, state.userConfig[key], value);
        Vue.set(state.userConfig, key, tmp);
      } else {
        Vue.set(state.userConfig, key, value);
      }

      saveConfig(state.userConfig);
    },
  },
  getters: {
    config(state) {
      return _.merge({}, defaultConfig, state.userConfig);
    },
  },
};
