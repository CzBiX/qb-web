<template>
  <v-app>
    <v-navigation-drawer
      app
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      class="drawer"
    >
      <drawer v-model="drawerOptions" />
      <template v-if="phoneLayout">
        <v-spacer />
        <v-divider />
        <v-expansion-panel
          class="drawer-footer"
          >
          <v-expansion-panel-content lazy @input="drawerFooterOpen">
            <template v-slot:header>
              <v-layout align-center>
                <v-icon class="footer-icon shrink">mdi-information-outline</v-icon>
                <span class="footer-title">Status info</span>
              </v-layout>
            </template>
            <app-footer phone-layout />
          </v-expansion-panel-content>
          <div ref="end" />
        </v-expansion-panel>
      </template>
    </v-navigation-drawer>
    <main-toolbar v-model="drawer" />

    <v-content>
      <torrents />
    </v-content>

    <add-form v-if="preferences" />
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
import MainToolbar from './components/MainToolbar.vue';
import Torrents from './components/Torrents.vue';
import AppFooter from './components/Footer.vue';
import LogsDialog from './components/dialogs/LogsDialog.vue';
import { api } from './Api';
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import Axios, { AxiosError } from 'axios';
import { sleep } from './utils';

export default Vue.extend({
  name: 'app',
  components: {
    AddForm,
    Drawer,
    LoginForm,
    Torrents,
    AppFooter,
    LogsDialog,
    MainToolbar,
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
  computed: {
    ...mapState([
      'mainData',
      'rid',
      'preferences',
    ]),
    ...mapGetters(['config']),
    phoneLayout() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
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
    async drawerFooterOpen(v: boolean) {
      if (!v) return;
      await sleep(350);

      this.$refs.end.scrollIntoView({
        behavior: 'smooth',
      });
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
.drawer {
  display: flex;
  flex-direction: column;

  .drawer-footer {
    box-shadow: none;

    ::v-deep .v-expansion-panel__header {
      padding: 12px;
    }

    .footer-icon {
      font-size: 22px;
      margin-left: 10px;
      margin-right: 28px;
    }
    .footer-title {
      font-size: 13px;
      font-weight: 500;
    }
  }
}
</style>
