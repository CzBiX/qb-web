<template>
  <v-app>
    <v-navigation-drawer
      app
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
    >
      <drawer v-model="drawerOptions" />
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      :scroll-toolbar-off-screen="!$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-toolbar-title class="headline">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">qBittorrent Web UI</span>
      </v-toolbar-title>
      <!-- <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
    </v-toolbar>

    <v-content>
      <v-container pa-0 fluid>
        <torrents />
      </v-container>
    </v-content>

    <add-form />
    <login-form v-if="needAuth" v-model="needAuth" />
    <logs-dialog v-if="drawerOptions.showLogs" v-model="drawerOptions.showLogs" />

    <v-footer
      app
      height="auto"
      class="elevation-4"
      v-if="$vuetify.breakpoint.smAndUp"
    >
      <app-footer />
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import AddForm from './components/AddForm.vue';
import Drawer from './components/Drawer.vue';
import LoginForm from './components/LoginForm.vue';
import Torrents from './components/Torrents.vue';
import AppFooter from './components/Footer.vue';
import LogsDialog from './components/LogsDialog.vue';
import { api } from './Api';
import { mapActions, mapState, mapMutations } from 'vuex';
import Axios, { AxiosError } from 'axios';

export default Vue.extend({
  name: 'app',
  components: {
    AddForm,
    Drawer,
    LoginForm,
    Torrents,
    AppFooter,
    LogsDialog,
  },
  data() {
    return {
      needAuth: false,
      drawer: true,
      drawerOptions: {
        showLogs: false,
      },
      task: 0,
    };
  },
  async created() {
    await this.getInitData();
  },
  beforeDestroy() {
    if (this.task) {
      clearTimeout(this.task);
    }
  },
  computed: mapState(['mainData', 'rid', 'config']),
  methods: {
    ...mapMutations([
      'updateMainData',
      'updatePreferences',
    ]),
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
    },
    async getPreferences() {
      const resp = await api.getAppPreferences();

      this.updatePreferences(resp.data);
    },
    async getMainData() {
      const rid = this.rid ? this.rid : null;
      const resp = await api.getMainData(rid);
      const mainData = resp.data;

      this.updateMainData(mainData);

      this.task = setTimeout(this.getMainData, this.config.updateInterval);
    },
  },
  watch: {
    async needAuth(v) {
      if (!v) {
        await this.getInitData();
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  margin-left: -16px;
}
.container {
  margin-bottom: 80px;
}
</style>
