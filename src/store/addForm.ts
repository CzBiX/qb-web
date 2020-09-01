import { Module } from 'vuex';
import { AddFormState } from './types';

export const addFormStore: Module<AddFormState, any> = {
  state() {
    return {
      isOpen: false,
      downloadItem: null
    };
  },
  getters: {
    isOpen(state) {
      return state.isOpen;
    }
  },
  mutations: {
    openAddForm(state) {
      state.isOpen = true;
    },
    closeAddForm(state) {
      state.isOpen = false;
      state.downloadItem = null;
    },
    addFormDownloadItem(state, payload) {
      const { downloadItem } = payload;
      state.downloadItem = downloadItem;
    }
  },
};
