import { merge, cloneDeep } from 'lodash'
import { Module } from 'vuex';
import { DialogState } from './types';

export const dialogStore: Module<DialogState, any> = {
  state() {
    return {
      config: null,
    };
  },
  mutations: {
    showDialog(state, payload) {
      state.config = cloneDeep(payload);
    },
    closeDialog(state) {
      state.config = null;
    },
  },
  actions: {
    asyncShowDialog({ commit }, payload) {
      return new Promise((resolve) => {
        const options = merge({}, payload, {
          callback: resolve,
        })

        commit('showDialog', options);
      })
    },
  },
};
