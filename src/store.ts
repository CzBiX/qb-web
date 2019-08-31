import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { AllStateTypes } from './consts';
import { torrentIsState } from './utils';

Vue.use(Vuex);

const defaultConfig = {
  updateInterval: 2000,
  pagination: {
    itemsPerPage: 50,
  },
  filter: {
    state: null,
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
    /* eslint-disable no-param-reassign */
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
        if (payload.categories_removed) {
          for (const key of payload.categories_removed) {
            delete tmp.categories[key];
          }
          delete payload.categories_removed;
        }
        state.mainData = _.merge(tmp, payload);
      }
    },
    updatePreferences(state, payload) {
      state.preferences = payload;
    },
    updateConfig(state, payload) {
      const { key } = payload;
      const { value } = payload;
      const tmp = _.merge({}, state.userConfig[key], value);
      Vue.set(state.userConfig, key, tmp);

      saveConfig(state.userConfig);
    },
    /* eslint-enable no-param-reassign */
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

      return _.map(state.mainData.torrents,
        (value, key) => _.merge({}, value, { hash: key }));
    },
    allCategories(state) {
      if (!state.mainData) {
        return [];
      }

      const categories = _.map(state.mainData.categories,
        (value, key) => _.merge({}, value, { key }));
      return _.sortBy(categories, 'name');
    },
    torrentGroupByCategory(state, getters) {
      return _.groupBy(getters.allTorrents, torrent => torrent.category);
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
    torrentGroupByState(__, getters) {
      const result: any = {};
      const put = (state: any, torrent: any) => {
        let list: any[] = result[state];
        if (!list) {
          list = [];
          result[state] = list;
        }
        list.push(torrent);
      };

      for (const torrent of getters.allTorrents) {
        for (const type of AllStateTypes) {
          if (torrentIsState(type, torrent.state)) {
            put(type, torrent);
          }
        }
      }

      return result;
    },
  },
});
