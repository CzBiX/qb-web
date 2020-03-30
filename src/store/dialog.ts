import { merge, isString, cloneDeep } from 'lodash'
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
      if (isString(payload)) {
        state.config = {
          content: {
            text: payload,
          },
        };
      } else {
        state.config = cloneDeep(payload);
      }
    },
    closeDialog(state) {
      state.config = null;
    },
  },
  actions: {
    asyncShowDialog({ commit }, payload) {
      return new Promise((resolve) => {
        const options = merge({}, payload, {
          content: {
            callback: resolve,
          },
        })

        commit('showDialog', options);
      })
    },
  }
};
