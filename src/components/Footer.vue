<template>
<div
  class="footer d-flex"
  :class="topLayoutClass"
  v-if="isDataReady">
  <div
    class="d-flex shrink"
    :class="phoneLayout ? 'flex-column' : 'align-center'"
    v-if="app"
  >
    <div v-if="!phoneLayout">
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
    </div>
    <v-divider vertical class="mx-2" v-if="!phoneLayout"/>
    <div class="icon-label">
      <v-icon>mdi-sprout</v-icon>
      {{ allTorrents.length }} [{{ totalSize | formatSize }}]
    </div>
    <v-divider vertical class="mx-2" v-if="!phoneLayout"/>
    <div class="icon-label">
      <v-icon>mdi-nas</v-icon>
      {{ info.free_space_on_disk | formatSize }}
    </div>
    <v-divider vertical class="mx-2" v-if="!phoneLayout"/>
    <div class="icon-label" v-if="!phoneLayout">
      <v-icon class="icon-upload-download">mdi-swap-vertical-bold</v-icon>
      <span>
        {{ info.alltime_dl | formatSize }}/{{ info.alltime_ul | formatSize }}
      </span>
    </div>
  </div>
  <div
    class="d-flex shrink"
    :class="phoneLayout ? 'flex-column' : 'align-center'"
    v-if="info"
  >
    <div v-if="!phoneLayout" class="icon-label">
      <v-icon>mdi-access-point-network</v-icon>
      {{ info.dht_nodes }} nodes
    </div>
    <v-divider vertical class="mx-2" v-if="!phoneLayout"/>
    <div class="icon-label">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-icon
            v-on="on"
            :color="info.connection_status | connectionIconColor"
          >mdi-{{ info.connection_status | connectionIcon }}</v-icon>
          <span v-if="phoneLayout">
            Network {{ info.connection_status }}
          </span>
        </template>
        <span>
          Network {{ info.connection_status }}
        </span>
      </v-tooltip>
    </div>
    <v-divider vertical class="mx-2" v-if="!phoneLayout"/>
    <div class="icon-label">
      <v-switch
        v-if="phoneLayout"
        hide-details
        :value="speedLimited"
        @change="toggleSpeedLimitsMode"
        label="Alternative speed limits"
        class="mt-0 pt-0 speed-switch"
      >
        <template v-slot:prepend>
          <v-icon
            v-bind="speedModeBind"
          >mdi-speedometer</v-icon>
        </template>
      </v-switch>
      <v-tooltip top v-else>
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
    </div>
    <v-divider vertical class="mx-2" v-if="!phoneLayout"/>
    <div class="icon-label">
      <v-icon
        :color=" info.dl_info_speed > 0 ? 'success' : null"
      >mdi-download</v-icon>
      <span>
        {{ info.dl_info_speed | formatSize }}/s
        <template v-if="info.dl_rate_limit">
          ({{ info.dl_rate_limit | formatSize}}/s)
        </template>
        <template v-if="!phoneLayout">
          [{{ info.dl_info_data | formatSize }}]
        </template>
      </span>
    </div>
    <v-divider vertical class="mx-2" v-if="!phoneLayout"/>
    <div class="icon-label">
      <v-icon
        :color=" info.up_info_speed > 0 ? 'warning' : null"
      >mdi-upload</v-icon>
      <span>
        {{ info.up_info_speed | formatSize }}/s
        <template v-if="info.up_rate_limit">
          ({{ info.up_rate_limit | formatSize}}/s)
        </template>
        <template v-if="!phoneLayout">
          [{{ info.up_info_data | formatSize }}]
        </template>
      </span>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import api from '../Api';

export default Vue.extend({
  props: {
    phoneLayout: Boolean,
  },

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
      'allTorrents',
    ]),
    totalSize() {
      return _.sumBy(this.allTorrents, 'size');
    },
    speedModeBind() {
      if (this.speedLimited) {
        return {
          class: 'speed-limited',
          color: 'warning',
        };
      }

      return {
        class: null,
        color: 'success',
      };
    },
    topLayoutClass() {
      const v = this.phoneLayout;
      if (v) {
        return ['in-drawer', 'flex-column'];
      }

      return ['mx-4', 'justify-space-between'];
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
    if (!this.isDataReady) {
      return;
    }
    this.speedLimited = this.info.use_alt_speed_limits;
    await this.getAppInfo();
  },

  watch: {
    async isDataReady(v) {
      if (v && this.app === null) {
        await this.getAppInfo();
      }
    },
    'info.use_alt_speed_limits': function (v) {
      this.speedLimited = v;
    },
  },
});
</script>

<style lang="scss" scoped>
.footer {
  font-size: 14px;
  width: 100%;
}

.icon-label {
  display: flex;
  align-items: center;

  .v-icon {
    margin-right: 4px;
  }
}

.icon-upload-download {
  transform: scaleX(-1);
}

.speed-switch {
  font-size: inherit;
  width: 100%;

  ::v-deep {
    .v-input__prepend-outer {
      margin-right: 0;
    }

    .v-input__control {
      margin-left: 4px;
      width: 100%;

      .v-input__slot {
        justify-content: space-between;

        .v-input--selection-controls__input {
          order: 2;
        }

        .v-label {
          color: inherit;
          font-size: inherit;
        }
      }
    }
  }
}

.speed-limited {
  transform: scaleX(-1);
}
.in-drawer {
  .no-icon {
    margin-left: 24px;
  }
}
</style>
