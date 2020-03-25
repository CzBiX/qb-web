import _ from 'lodash';
import { Module } from 'vuex';
import { SnackBarState } from './types';

export const snackBarStore : Module<SnackBarState, any> = {
  state() {
    return {
      config: null,
    };
  },
  mutations: {
    showSnackBar(state, payload) {
      if (_.isString(payload)) {
        state.config = {
          text: payload,
        };
      } else {
        state.config = _.cloneDeep(payload);
      }
    },
    closeSnackBar(state) {
      state.config = null;
    },
  },
};
