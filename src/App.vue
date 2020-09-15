<template>
  <v-app ref="app">
    <v-navigation-drawer
      app
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      v-class:phone-layout="phoneLayout"
      width="300"
    >
      <drawer v-model="drawerOptions" />

      <template #append>
        <DrawerFooter />
      </template>
    </v-navigation-drawer>
    <main-toolbar v-model="drawer" />

    <v-content>
      <torrents />
    </v-content>

    <add-form v-if="preferences" />
    <login-form
      v-if="needAuth"
      v-model="needAuth"
    />
    <logs-dialog
      v-if="drawerOptions.showLogs"
      v-model="drawerOptions.showLogs"
    />
    <RssDialog
      v-if="drawerOptions.showRss"
      v-model="drawerOptions.showRss"
      @download-torrent="setPasteUrl({url: $event})"
    />
    <SearchDialog
      v-if="drawerOptions.showSearch"
      v-model="drawerOptions.showSearch"
    />

    <v-footer
      app
      class="elevation-4"
      padless
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <app-footer />
    </v-footer>

    <GlobalDialog />
    <GlobalSnackBar />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState, mapMutations } from 'vuex';
import { registerProtocolHandler, checkDownloadUrl } from './protocolHandler';

import GlobalDialog from './components/GlobalDialog.vue';
import GlobalSnackBar from './components/GlobalSnackBar.vue';

import AddForm from './components/AddForm.vue';
import Drawer from './components/Drawer.vue';
import LoginForm from './components/LoginForm.vue';
import MainToolbar from './components/MainToolbar.vue';
import Torrents from './components/Torrents.vue';
import AppFooter from './components/Footer.vue';
import LogsDialog from './components/dialogs/LogsDialog.vue';
import RssDialog from './components/dialogs/RssDialog.vue';
import SearchDialog from './components/dialogs/searchDialog/SearchDialog.vue';
import DrawerFooter from './components/drawer/DrawerFooter.vue';

import api from './Api';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { MainData } from './types';

let appWrapEl: HTMLElement;

@Component({
  components: {
    AddForm,
    Drawer,
    LoginForm,
    Torrents,
    AppFooter,
    LogsDialog,
    MainToolbar,
    GlobalDialog,
    GlobalSnackBar,
    RssDialog,
    SearchDialog,
    DrawerFooter,
  },
  computed: {
    ...mapState([
      'mainData',
      'rid',
      'preferences',
    ]),
    ...mapGetters(['config']),
  },
  methods: {
    ...mapMutations([
      'updateMainData',
      'updatePreferences',
      'setPasteUrl',
    ]),
  }
})
export default class App extends Vue {
  needAuth = false
  drawer = true
  drawerOptions = {
    showLogs: false,
    showRss: false,
  }
  task = 0
  mql?: MediaQueryList

  mainData!: MainData
  rid!: number
  preferences!: any
  config!: any

  updateMainData!: (_: any) => void
  updatePreferences!: (_: any) => void
  setPasteUrl!: (_: any) => void

  get phoneLayout() {
    return this.$vuetify.breakpoint.xsOnly;
  }

  initProtocolHandler() {
    registerProtocolHandler();
    const url = checkDownloadUrl();

    if (url) {
      this.setPasteUrl({
        url,
      });
    }
  }

  async created() {
    this.initProtocolHandler();

    await this.getInitData();
    appWrapEl = (this.$refs.app as any).$el.querySelector('.v-application--wrap');
    appWrapEl.addEventListener('paste', this.onPaste);
  }

  beforeDestroy() {
    if (this.task) {
      clearTimeout(this.task);
    }
    appWrapEl.removeEventListener('paste', this.onPaste);
  }

  async getInitData() {
    try {
      await this.getMainData();
    } catch (e) {
      if (e.response.status === 403) {
        this.needAuth = true;
      }

      return;
    }

    await this.getPreferences();
  }

  async getPreferences() {
    const resp = await api.getAppPreferences();

    this.updatePreferences(resp.data);
  }

  async getMainData() {
    const rid = this.rid ? this.rid : undefined;
    const resp = await api.getMainData(rid);
    const mainData = resp.data;

    this.updateMainData(mainData);

    this.task = setTimeout(this.getMainData, this.config.updateInterval);
  }

  onPaste(e: ClipboardEvent) {
    if ((e.target as HTMLElement).tagName === 'INPUT') {
      return;
    }

    const text = e.clipboardData!.getData('text');
    if (text) {
      this.setPasteUrl({
        url: text,
      });
    }
  }

  @Watch('needAuth')
  onNeedAuth(v: boolean) {
    if (!v) {
      this.getInitData();
    }
  }

  @Watch('config.darkMode', {immediate: true})
  onDarkMode(mode: any) {
    const { theme } = this.$vuetify;

    if (mode != null) {
      if (this.mql) {
        this.mql.removeListener(null)
        this.mql = undefined
      }
      theme.dark = mode
      return
    }

    this.mql = window.matchMedia('(prefers-color-scheme: dark)');
    this.mql.addListener((e: MediaQueryListEvent) => {
      theme.dark = e.matches
    })
    theme.dark = this.mql.matches
  }
}
</script>

<style lang="scss" scoped>
.v-footer {
  min-height: 36px;
}
</style>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>
