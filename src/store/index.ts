import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import { configStore } from './config';
import { AllStateTypes } from '../consts';
import { torrentIsState } from '../utils';
import { RootState } from './types';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    config: configStore,
  },
  state: {
    rid: 0,
    mainData: undefined,
    preferences: null,
    pasteUrl: null,
  },
  mutations: {
    /* eslint-disable no-param-reassign */
    updateMainData(state, payload) {
      state.rid = payload.rid;
      delete payload.rid;
      if (payload.full_update) {
        delete payload.full_update;
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
    setPasteUrl(state, payload) {
      const { url } = payload;
      state.pasteUrl = url;
    },
    /* eslint-enable no-param-reassign */
  },
  getters: {
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
