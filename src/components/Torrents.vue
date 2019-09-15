<template>
  <div class="torrents" v-class:phone-layout="$vuetify.breakpoint.xsOnly">
    <div
      class="toolbar"
      >
      <v-toolbar
        flat
        dense
        color="white"
        height="40px"
        class="elevation-2"
      >
        <v-btn icon @click="confirmDelete" title="Delete" :disabled="!hasSelected">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn icon @click="resumeTorrents" title="Resume" :disabled="!hasSelected">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn icon @click="pauseTorrents" title="Pause" :disabled="!hasSelected">
          <v-icon>mdi-pause</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn icon @click="showInfo()" title="Info"
          :disabled="!hasSelected || selectedRows.length > 5"
        >
          <v-icon>mdi-alert-circle</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" title="Category" :disabled="!hasSelected">
              <v-icon>mdi-folder</v-icon>
            </v-btn>
          </template>
          <v-list class="category-actions">
            <v-subheader @click.stop="">
              Set category
            </v-subheader>
            <v-list-item
              v-for="(item, i) in allCategories"
              :key="i"
              @click="setTorrentsCategory(item.key)"
              >
              <v-list-item-action>
                <v-icon>mdi-folder-open</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item @click="setTorrentsCategory('')">
              <v-list-item-action>
                <v-icon>mdi-folder-remove</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Reset
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <template v-if="!$vuetify.breakpoint.xsOnly">
          <v-divider vertical inset />
          <v-btn icon @click="reannounceTorrents" title="Reannounce">
            <v-icon>mdi-bullhorn</v-icon>
          </v-btn>
          <v-btn icon @click="editTracker" title="Edit tracker">
            <v-icon>mdi-server</v-icon>
          </v-btn>
          <v-btn icon @click="recheckTorrents" title="Recheck" :disabled="selectedRows.length == 0">
            <v-icon>mdi-backup-restore</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-divider />
    </div>


    <v-data-table
      :headers="headers"
      :items="torrents"
      item-key="hash"
      fixed-header
      v-class:hide-headers="hasSelected"
      show-select
      :options.sync="pageOptions"
      v-model="selectedRows"
      class="table"
      :loading="loading"
      dense
      :footer-props="footerProps"
      :mobile-breakpoint="0"
    >
      <template v-slot:item="row">
        <tr
        >
          <!-- @dblclick.prevent="showInfo(row.item)" -->
          <td>
            <v-checkbox
              :value="row.isSelected"
              @change="row.select"
              hide-details
            />
          </td>
          <td
            :title="row.item.name"
            class="icon-label"
          >
            <v-icon :color="row.item.state | stateColor">{{ row.item.state | stateIcon }}</v-icon>
            <span class="torrent-title">{{ row.item.name }}</span>
          </td>
          <td>{{ row.item.size | formatSize }}</td>
          <td>
            <v-progress-linear
              height="1.4em"
              :value="row.item.progress * 100"
              :color="row.item.state | stateColor(true)"
              class="text-center ma-0"
            >
              <span :class="row.item.progress | progressColorClass">
                {{ row.item.progress | progress }}
              </span>
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
        </tr>
      </template>
    </v-data-table>

    <confirm-delete-dialog v-if="toDelete.length" v-model="toDelete" />
    <confirm-set-category-dialog v-if="toSetCategory.length"
      :category="categoryToSet" v-model="toSetCategory"
    />
    <edit-tracker-dialog v-if="toEditTracker.length" v-model="toEditTracker" />
    <info-dialog
      v-if="toShowInfo.length"
      v-model="toShowInfo"
      :tab="infoTab"
      @change="infoTab = $event" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import _ from 'lodash';
import ConfirmDeleteDialog from './dialogs/ConfirmDeleteDialog.vue';
import ConfirmSetCategoryDialog from './dialogs/ConfirmSetCategoryDialog.vue';
import EditTrackerDialog from './dialogs/EditTrackerDialog.vue';
import InfoDialog from './dialogs/InfoDialog.vue';
import api from '../Api';
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
      throw Error('Unknown state');
  }

  return icon;
}

export default Vue.extend({
  name: 'torrents',

  components: {
    ConfirmDeleteDialog,
    ConfirmSetCategoryDialog,
    EditTrackerDialog,
    InfoDialog,
  },

  data() {
    const headers = [
      { text: 'Name', value: 'name' },
      { text: 'Size', value: 'size' },
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

    const footerProps = {
      'items-per-page-options': [10, 20, 50, -1],
    };

    return {
      headers,
      selectedRows: [],
      toDelete: [],
      toSetCategory: [],
      categoryToSet: null,
      toShowInfo: [],
      toEditTracker: [],
      infoTab: null,
      pageOptions: null,
      footerProps,
    };
  },

  created() {
    this.pageOptions = this.$store.getters.config.pageOptions;
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
    loading() {
      return !this.isDataReady;
    },
    hasSelected() {
      return !!this.selectedRows.length;
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
      return this.hasSelected && this.selectedRows.length
        === Math.min(this.torrents.length, this.pageOptions.rowsPerPage);
    },
  },

  filters: {
    progressColorClass(progress: number) {
      const color = progress >= 0.5 ? 'white' : 'black';
      return `${color}--text`;
    },
    formatNetworkSpeed(speed: number) {
      if (speed === 0) {
        return null;
      }

      return `${formatSize(speed)}/s`;
    },
    stateIcon(state: string) {
      const item = getStateInfo(state);
      return `mdi-${item.icon}`;
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
    async reannounceTorrents() {
      if (!this.hasSelected) {
        this.selectedRows = this.allTorrents;
      }
      await api.reannounceTorrents(this.selectedHashes);
    },
    async recheckTorrents() {
      await api.recheckTorrents(this.selectedHashes);
    },
    setTorrentsCategory(category: string) {
      this.categoryToSet = category;
      this.toSetCategory = this.selectedRows;
    },
    editTracker() {
      if (this.hasSelected) {
        this.selectedRows = this.allTorrents;
      }
      this.toEditTracker = this.selectedRows;
    },
  },

  watch: {
    pageOptions: {
      handler() {
        this.updateConfig({
          key: 'pageOptions',
          value: this.pageOptions,
        });
      },
      deep: true,
    },
    filter() {
      this.selectedRows = [];
    },
    // loading() {
    //   debugger;
    // },
  },
});
</script>

<style lang="scss" scoped>
// ::v-deep .v-toolbar__content {
//   padding-left: 8px;
// }

.torrents {
  width: 100%;
  padding: 0;

  .table {
    ::v-deep thead th, td {
      white-space: nowrap;
      padding: 0 4px;
      overflow: hidden;
    }

    ::v-deep thead th .v-data-table__checkbox {
      padding-left: 4px;
    }

    tr:nth-child(2n) {
      background-color: #eee;
    }

    td {
      font-size: 13px;
      height: auto;
      border-bottom: none !important;

      .v-input--checkbox {
        margin-top: 0;
        padding-top: 0;

        ::v-deep .v-input--selection-controls__input {
          margin: 0 4px;
        }
      }

      .torrent-title {
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 36em;
      }
    }
  }
}

.phone-layout {
  .v-data-table ::v-deep .v-data-footer {
    flex-wrap: nowrap;
    margin-right: 0;
  }
}

// .toolbar {
//   position: sticky;
//   top: 0;
//   z-index: 2;
// }

// .category-actions .v-list__tile__action {
//   min-width: 40px;
// }

// .menu-check {
//   padding: 0;
// }

.icon-label {
  display: flex;
  align-items: center;
}

// ::v-deep .v-datatable {
//   // table-layout: fixed;
// }

// ::v-deep.hide-headers .v-datatable thead {
//   display: none;
// }
</style>
