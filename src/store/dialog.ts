import _ from 'lodash';
import { Module } from 'vuex';
import { DialogState } from './types';

export const dialogStore : Module<DialogState, any> = {
  state() {
    return {
      config: null,
    };
  },
  mutations: {
    showDialog(state, payload) {
      if (_.isString(payload)) {
        state.config = {
          content: {
            text: payload,
          },
        };
      } else {
        state.config = _.cloneDeep(payload);
      }
    },
    closeDialog(state) {
      state.config = null;
    },
  },
};
