<template>
<v-layout align-center justify-space-between fill-height mx-4 v-if="isDataReady">
  <v-flex shrink v-if="app">
    <v-layout>
      <v-flex>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <span v-on="on">
              qBittorrent {{ app.version }}
            </span>
          </template>
          <span>
            API version: {{ app.apiVersion }}
          </span>
        </v-tooltip>
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex>
        Disk free: {{ info.free_space_on_disk | formatSize }}
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex>
        Torrents: {{ allTorrents.length }} ({{ totalSize | formatSize }})
      </v-flex>
    </v-layout>
  </v-flex>
  <v-flex shrink v-if="info">
    <v-layout align-center>
      <v-flex>
        DHT: {{ info.dht_nodes }} nodes
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex class="icon_label">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              v-on="on"
              :color="info.connection_status | connectionIconColor"
            >mdi-{{ info.connection_status | connectionIcon }}</v-icon>
          </template>
          <span>
            Network {{ info.connection_status }}
          </span>
        </v-tooltip>
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex class="icon_label">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              v-on="on"
              v-bind="speedModeBind"
              @click="toggleSpeedLimitsMode"
            >mdi-speedometer</v-icon>
          </template>
          <span>
            Alternative speed limits {{ speedLimited ? 'enabled' : 'disabled' }}
          </span>
        </v-tooltip>
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex class="icon_label">
        <v-icon color="success">mdi-download</v-icon>
        <span>
          {{ info.dl_info_speed | formatSize }}/s
          <template v-if="info.dl_rate_limit">
            ({{ info.dl_rate_limit | formatSize}}/s)
          </template>
          [{{ info.dl_info_data | formatSize }}/{{ info.alltime_dl | formatSize }}]
        </span>
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex class="icon_label">
        <v-icon color="warning">mdi-upload</v-icon>
        <span>
          {{ info.up_info_speed | formatSize }}/s
          <template v-if="info.up_rate_limit">
            ({{ info.up_rate_limit | formatSize}}/s)
          </template>
          [{{ info.up_info_data | formatSize }}/{{ info.alltime_ul | formatSize }}]
        </span>
      </v-flex>
    </v-layout>
  </v-flex>
</v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import { api } from '../Api';
import { mapState, mapGetters } from 'vuex';

export default Vue.extend({
  data() {
    return {
      app: null,
      speedLimited: false,
    };
  },

  filters: {
    connectionIcon(status: string) {
      const statusMap: any = {
        connected: 'server-network',
        firewalled: 'server-network-off',
        disconnected: 'security-network',
      };
      return statusMap[status];
    },
    connectionIconColor(status: string) {
      const statusMap: any = {
        connected: 'success',
        firewalled: 'warning',
        disconnected: 'error',
      };
      return statusMap[status];
    },
  },

  computed: {
    ...mapState({
      info(state: any) {
        return this.isDataReady ? state.mainData.server_state : null;
      },
    }),
    ...mapGetters([
      'isDataReady',
      'allTorrents'
    ]),
    totalSize() {
      return _.sumBy(this.allTorrents, 'size');
    },
    speedModeBind() {
      if (this.speedLimited) {
        return {
          class: 'speed-limited',
          color: 'warning',
        }
      }

      return {
        class: null,
        color: 'success'
      }
    },
  },

  methods: {
    async getAppInfo() {
      let resp = await api.getAppVersion();
      const version = resp.data;

      resp = await api.getApiVersion();
      const apiVersion = resp.data;

      this.app = {
        version, apiVersion,
      };
    },
    async toggleSpeedLimitsMode() {
      this.speedLimited = !this.speedLimited;
      await api.toggleSpeedLimitsMode();
    },
  },

  async created() {
    if (this.isDataReady) {
      this.speedLimited = this.info.use_alt_speed_limits;
      await this.getAppInfo();
    }
  },

  watch: {
    async isDataReady(v) {
      if (v && this.app === null) {
        await this.getAppInfo();
      }
    },
    'info.use_alt_speed_limits'(v) {
      this.speedLimited = v;
    },
  },
});
</script>

<style lang="scss" scoped>
.icon_label {
  display: flex;
  align-items: center;
}
.speed-limited {
  transform: scaleX(-1);
}
</style>
