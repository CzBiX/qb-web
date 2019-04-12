import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rid: 0,
    mainData: null,
    filter: {
      type: null,
      category: null,
      site: null,
    },
    config: {
      updateInterval: 2000,
    },
    preferences: null,
  },
  mutations: {
    updateMainData(state, payload) {
      state.rid = payload.rid;
      if (payload.full_update) {
        state.mainData = payload;
      } else {
        state.mainData = _.merge({}, state.mainData, payload);
      }
    },
    updatePreferences(state, payload) {
      state.preferences = payload;
    },
    updateFilter(state, payload) {
      state.filter = _.clone(payload);
    },
  },
  getters: {
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
