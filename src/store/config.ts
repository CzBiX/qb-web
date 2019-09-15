import _ from 'lodash';
import Vue from 'vue';
import { Module } from 'vuex';
import { RootState, ConfigState } from './types';

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
};

function saveConfig(obj: any) {
  localStorage[configKey] = JSON.stringify(obj);
}

function loadConfig() {
  const tmp = localStorage[configKey];
  if (!tmp) {
    return {};
  }

  return JSON.parse(tmp);
}

export const configStore : Module<ConfigState, RootState> = {
  state: {
    userConfig: loadConfig(),
  },
  mutations: {
    updateConfig(state, payload) {
      const { key, value } = payload;
      const tmp = _.merge({}, state.userConfig[key], value);
      Vue.set(state.userConfig, key, tmp);

      saveConfig(state.userConfig);
    },
  },
  getters: {
    config(state) {
      return _.merge({}, defaultConfig, state.userConfig);
    },
  },
};
