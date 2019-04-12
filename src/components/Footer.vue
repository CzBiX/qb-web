<template>
<v-layout align-center justify-space-between fill-height mx-4 v-if="isDataReady">
  <v-flex shrink v-if="app">
    <v-layout>
      <v-flex>
        qBittorrent {{ app.version }}
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex>
        API version: {{ app.apiVersion }}
      </v-flex>
    </v-layout>
  </v-flex>
  <v-flex shrink v-if="info">
    <v-layout align-center>
      <v-flex>
        Disk free: {{ info.free_space_on_disk | formatSize }}
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex>
        DHT: {{ info.dht_nodes }} nodes
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-flex class="icon_label" v-on="on">
            <v-icon>mdi-{{ info.connection_status | connectionIcon }}</v-icon>
          </v-flex>
        </template>
        <span>
          Network {{ info.connection_status }}
        </span>
      </v-tooltip>
      <v-divider vertical class="mx-2"/>
      <v-flex class="icon_label">
        <v-icon>mdi-download</v-icon>
        <span>
          {{ info.dl_info_speed | formatSize }}/s
          ({{ info.dl_info_data | formatSize }}/{{ info.alltime_dl | formatSize }})
        </span>
      </v-flex>
      <v-divider vertical class="mx-2"/>
      <v-flex class="icon_label">
        <v-icon>mdi-upload</v-icon>
        <span>
          {{ info.up_info_speed | formatSize }}/s
          ({{ info.up_info_data | formatSize }}/{{ info.alltime_ul | formatSize }})
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
  },

  computed: {
    ...mapState({
    info: (state: any) => state.mainData ? state.mainData.server_state : null,
    }),
    ...mapGetters([
      'isDataReady',
    ]),
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
  },

  async created() {
    if (this.isDataReady) {
      await this.getAppInfo();
    }
  },

  watch: {
    async isDataReady(v) {
      if (v && this.app === null) {
        await this.getAppInfo();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.icon_label {
  display: flex;
  align-items: center;
}
</style>
