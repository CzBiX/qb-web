import { Module } from "vuex";
import { SearchPlugin } from "@/types";
import { SearchEnginePage } from "./types";
import api from "@/Api";

export default {
  state: {
    searchPlugins: [],
    isPluginManagerOpen: false,
  },
  mutations: {
    setSearchPlugins(state, plugins: SearchPlugin[] | undefined | null) {
      state.searchPlugins = plugins;
    },
    openPluginManager(state) {
      state.isPluginManagerOpen = true;
    },
    closePluginManager(state) {
      state.isPluginManagerOpen = false;
    },
  },
  getters: {
    allSearchPlugins(state): SearchPlugin[] | undefined | null {
      return state.searchPlugins;
    },
  },
  actions: {
    fetchSearchPlugins({ dispatch }) {
      // semantic helper
      dispatch("getSearchPluginsRequest");
    },
    async getSearchPluginsRequest({ dispatch }) {
      try {
        const searchPlugins = await api.getSearchPlugins();

        dispatch("getSearchPluginRequestSuccess", searchPlugins);
      } catch {
        dispatch("getSearchPluginsRequestFailure");
      }
    },
    getSearchPluginRequestSuccess({ commit }, searchPlugins) {
      commit("setSearchPlugins", undefined);

      commit("setSearchPlugins", searchPlugins);
    },
    getSearchPluginRequestFailure({ commit }) {
      commit("setSearchPlugins", null);
    },
    togglePluginAvailability({ dispatch }, plugin) {
      dispatch("togglePluginEnableRequest", plugin);
    },
    async togglePluginEnableRequest({ dispatch }, plugin: SearchPlugin) {
      try {
        await api.enablePlugin(plugin, !plugin.enabled); // switch plugin enable state

        dispatch("enablePluginRequestSuccess", plugin);
      } catch {
        // Do nothing
      }
    },
    enablePluginRequestSuccess({ dispatch }) {
      dispatch('fetchSearchPlugins'); // refresh the plugins
    },
    async updatePluginsRequest({ dispatch }) {
      try {
        await api.updateSearchPlugins();

        dispatch("updatePluginsRequestSuccess");
      } catch {
        dispatch("updatePluginsRequestFailure");
      }
    },
    async updatePluginsRequestSuccess({ dispatch }) {
      await dispatch('getSearchPluginsRequest');
    },
    updatePluginsRequestFailure() {
      // Do nothing
    },
  },
} as Module<SearchEnginePage, any>;
