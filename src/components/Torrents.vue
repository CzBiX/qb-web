<template>
  <v-container fluid v-class:phone-layout="$vuetify.breakpoint.xsOnly">
    <v-layout
      column
      v-show="hasSelected"
      class="toolbar"
      >
    <v-toolbar
      flat
      color="white"
      height="56px"
      class="elevation-2"
    >
      <v-checkbox class="shrink menu-check"
        :input-value="hasSelected"
        :indeterminate="!hasSelectedAll"
        primary
        hide-details
        @click.stop="selectedRows = []"
      ></v-checkbox>
      <v-btn icon @click="confirmDelete" title="Delete">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-divider vertical inset />
      <v-btn icon @click="resumeTorrents" title="Resume">
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn icon @click="pauseTorrents" title="Pause">
        <v-icon>mdi-pause</v-icon>
      </v-btn>
      <v-divider vertical inset />
      <v-btn icon @click="showInfo" title="Info" v-if="selectedRows.length <= 4">
        <v-icon>mdi-alert-circle</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" title="Category">
            <v-icon>mdi-folder</v-icon>
          </v-btn>
        </template>
        <v-list class="category-actions">
          <v-subheader @click.stop="">
            Set category
          </v-subheader>
          <v-list-tile
            v-for="(item, i) in allCategories"
            :key="i"
            @click="setTorrentsCategory(item.key)"
            >
            <v-list-tile-action>
              <v-icon>mdi-folder-open</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.name }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider />
          <v-list-tile @click="setTorrentsCategory('')">
            <v-list-tile-action>
              <v-icon>mdi-folder-remove</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Reset
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-divider />
    </v-layout>


    <v-layout
      column
      >
    <v-data-table
      :headers="headers"
      :items="torrents"
      item-key="hash"
      :hide-actions="torrents.length <= pagination.rowsPerPage"
      v-class:hide-headers="hasSelected"
      select-all
      :pagination.sync="pagination"
      v-model="selectedRows"
      class="table"
    >
      <template v-slot:items="row">
        <td>
          <v-checkbox
            v-model="row.selected"
            hide-details
          />
        </td>
        <td
          :title="row.item.name"
          class="icon-label"
          @dblclick.prevent="showInfo(row.item)"
        >
          <v-icon :color="row.item.state | stateColor">{{ row.item.state | stateIcon }}</v-icon>
          {{ row.item.name }}
        </td>
        <td>{{ row.item.size | formatSize }}</td>
        <td>
          <v-progress-linear
            height="1.4em"
            :value="row.item.progress * 100"
            :color="row.item.state | stateColor(true)"
            class="text-xs-center ma-0"
          >
            <span :class="row.item.progress | progressColorClass">{{ row.item.progress | progress }}</span>
          </v-progress-linear>
        </td>
        <td>{{ row.item.state }}</td>
        <td>{{ row.item.num_seeds }}/{{ row.item.num_complete }}</td>
        <td>{{ row.item.num_leechs }}/{{ row.item.num_incomplete }}</td>
        <td>{{ row.item.dlspeed | formatNetworkSpeed }}</td>
        <td>{{ row.item.upspeed | formatNetworkSpeed }}</td>
        <td>{{ row.item.eta | formatDuration({dayLimit: 100}) }}</td>
        <td>{{ row.item.ratio.toFixed(2) }}</td>
        <td>
          <span :title="row.item.added_on | formatTimestamp">
            {{ row.item.added_on | formatAsDuration }} ago
          </span>
        </td>
      </template>
    </v-data-table>
    </v-layout>

    <confirm-delete-dialog v-if="toDelete.length" v-model="toDelete" />
    <info-dialog v-if="toShowInfo.length" v-model="toShowInfo" :tab="infoTab" @change="infoTab = $event" />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import ConfirmDeleteDialog from './dialogs/ConfirmDeleteDialog.vue';
import InfoDialog from './dialogs/InfoDialog.vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import _ from 'lodash';
import { api } from '../Api';
import { formatSize, formatDuration } from '../filters';
import { torrentIsState } from '../utils';
import { StateType } from '../consts';

function getStateInfo(state: string) {
  let icon;
  switch (state) {
    case 'metaDL':
    case 'allocating':
    case 'downloading':
    case 'forcedDL':
      icon = {
        icon: 'download',
        color: 'info',
      };
      break;
    case 'uploading':
    case 'forcedUP':
      icon = {
        icon: 'upload',
        color: 'info',
      };
      break;
    case 'stalledDL':
      icon = {
        icon: 'download',
        color: null,
      };
      break;
    case 'stalledUP':
      icon = {
        icon: 'upload',
        color: null,
      };
      break;
    case 'pausedDL':
      icon = {
        icon: 'pause',
        color: 'warning',
      };
      break;
    case 'pausedUP':
      icon = {
        icon: 'check',
        color: null,
      };
      break;
    case 'queuedDL':
    case 'queuedUP':
      icon = {
        icon: 'timer-sand',
        color: 'info',
      };
      break;
    case 'checkingDL':
    case 'checkingUP':
    case 'queuedForChecking':
    case 'checkingResumeData':
    case 'moving':
      icon = {
        icon: 'backup-restore',
        color: 'info',
      };
      break;
    case 'error':
    case 'unknown':
    case 'missingFiles':
      icon = {
        icon: 'alert',
        color: 'error',
      };
      break;
    default:
      throw state;
      break;
  }

  return icon;
}

export default Vue.extend({
  name: 'torrents',

  components: {
    ConfirmDeleteDialog,
    InfoDialog,
  },

  data() {
    const headers = [
      { text: 'Name', value: 'name', width: 'auto', class: 'th-name' },
      { text: 'Size', value: 'size', width: '54px' },
      { text: 'Progress', value: 'progress' },
      { text: 'Status', value: 'state' },
      { text: 'Seeds', value: 'num_complete' },
      { text: 'Peers', value: 'num_incomplete' },
      { text: 'DL Speed', value: 'dlspeed' },
      { text: 'UP Speed', value: 'upspeed' },
      { text: 'ETA', value: 'eta' },
      { text: 'Ratio', value: 'ratio' },
      { text: 'Added', value: 'added_on' },
    ];

    return {
      headers,
      selectedRows: [],
      toDelete: [],
      toShowInfo: [],
      infoTab: null,
      pagination: null,
    };
  },

  created() {
    this.pagination = this.$store.getters.config.pagination;
  },

  computed: {
    ...mapGetters([
      'isDataReady',
      'allTorrents',
      'allCategories',
      'torrentGroupByCategory',
      'torrentGroupBySite',
      'torrentGroupByState',
    ]),
    ...mapState({
      filter(state, getters) {
        return getters.config.filter;
      },
    }),
    hasSelected() {
      return this.selectedRows.length;
    },
    selectedHashes() {
      return this.selectedRows.map(_.property('hash'));
    },
    torrents() {
      if (!this.isDataReady) {
        return [];
      }
      let list = this.allTorrents;
      if (this.filter.site !== null) {
        list = _.intersection(list, this.torrentGroupBySite[this.filter.site]);
      }
      if (this.filter.category !== null) {
        list = _.intersection(list, this.torrentGroupByCategory[this.filter.category]);
      }
      if (this.filter.state !== null) {
        list = _.intersection(list, this.torrentGroupByState[this.filter.state]);
      }

      return list;
    },
    hasSelectedAll() {
      return this.hasSelected && this.selectedRows.length === Math.min(this.torrents.length, this.pagination.rowsPerPage)
    },
  },

  filters: {
    progressColorClass(progress: number) {
      const color = progress >= 0.5 ? 'white' : 'black';
      return color + '--text';
    },
    formatNetworkSpeed(speed: number) {
      if (speed === 0) {
        return null;
      }

      return formatSize(speed) + '/s';
    },
    stateIcon(state: string) {
      const item = getStateInfo(state);
      return 'mdi-' + item.icon;
    },
    stateColor(state: string, isProgress?: boolean) {
      const item = getStateInfo(state);
      if (!isProgress) {
        return item.color;
      }

      return item.color || '#0008';
    },
  },

  methods: {
    ...mapMutations([
      'updateConfig',
    ]),
    confirmDelete() {
      this.toDelete = this.selectedRows;
    },
    showInfo(row?: any) {
      this.toShowInfo = row ? [row] : this.selectedRows;
    },
    async resumeTorrents() {
      await api.resumeTorrents(this.selectedHashes);
    },
    async pauseTorrents() {
      await api.pauseTorrents(this.selectedHashes);
    },
    async setTorrentsCategory(category: string) {
      await api.setTorrentsCategory(this.selectedHashes, category);
    },
  },

  watch: {
    pagination: {
      handler() {
        this.updateConfig({
          key: 'pagination',
          value: this.pagination,
        });
      },
      deep: true,
    },
  },
});
</script>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>


<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  padding-left: 8px;
}

.container {
  padding: 0 0 80px;
  height: calc(100vh - 100px); // footer + toobar = 100px
  overflow-y: scroll;

  &.phone-layout {
    height: calc(100vh - 56px); // toobar = 56px
  }
}

.toolbar {
  position: sticky;
  top: 0;
  z-index: 2;
}

.category-actions .v-list__tile__action {
  min-width: 40px;
}

.menu-check {
  padding: 0;
}

.icon-label {
  display: flex;
  align-items: center;
}

::v-deep .v-datatable thead th, .v-datatable tbody td {
  padding: 0 2px !important;
  width: auto;
  height: auto;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:first-child {
    padding: 0 0 0 8px !important;
  }
  &:last-child {
    padding-right: 8px !important;
  }
}

::v-deep .v-datatable {
  // table-layout: fixed;
}

::v-deep.hide-headers .v-datatable thead {
  display: none;
}

::v-deep .v-datatable thead th.th-name {
  // max-width: 100px;
}
</style>
