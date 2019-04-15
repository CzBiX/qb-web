import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);

const defaultConfig = {
  updateInterval: 2000,
  pagination: {
    rowsPerPage: 100,
  },
  filter: {
    type: null,
    category: null,
    site: null,
  },
};

const configKey = 'qb-config';

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

export default new Vuex.Store({
  state: {
    rid: 0,
    mainData: null,
    userConfig: loadConfig(),
    preferences: null,
  },
  mutations: {
    updateMainData(state, payload) {
      state.rid = payload.rid;
      if (payload.full_update) {
        state.mainData = payload;
      } else {
        const tmp: any = _.cloneDeep(state.mainData);
        if (payload.torrents_removed) {
          for (const hash of payload.torrents_removed) {
            delete tmp.torrents[hash];
          }
          delete payload.torrents_removed;
        }
        state.mainData = _.merge(tmp, payload);
      }
    },
    updatePreferences(state, payload) {
      state.preferences = payload;
    },
    updateConfig(state, payload) {
      const key = payload.key;
      const value = payload.value;
      const tmp = _.merge({}, state.userConfig[key], value);
      Vue.set(state.userConfig, key, tmp);

      saveConfig(state.userConfig);
    },
  },
  getters: {
    config(state) {
      return _.merge({}, defaultConfig, state.userConfig);
    },
    isDataReady(state) {
      return !!state.mainData;
    },
    allTorrents(state) {
      if (!state.mainData) {
        return [];
      }

      return _.map(state.mainData.torrents, (value, key) => {
        return _.merge({}, value, { hash: key });
      });
    },
    torrentGroupByCategory(state, getters) {
      return _.groupBy(getters.allTorrents, (torrent) => torrent.category);
    },
    torrentGroupBySite(state, getters) {
      return _.groupBy(getters.allTorrents, (torrent) => {
        if (!torrent.tracker) {
          return '';
        }

        const url = new URL(torrent.tracker);
        return url.hostname;
      });
    },
  },
});
