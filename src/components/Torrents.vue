<template>
  <div class="torrents" v-class:phone-layout="$vuetify.breakpoint.xsOnly">
    <div class="toolbar-wrapper">
      <div class="toolbar">
        <v-btn icon @click="confirmDelete" :title="$t('delete')" :disabled="!hasSelected">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn icon @click="resumeTorrents" :title="$t('resume')" :disabled="!hasSelected">
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn icon @click="pauseTorrents" :title="$t('pause')" :disabled="!hasSelected">
          <v-icon>mdi-pause</v-icon>
        </v-btn>
        <v-divider vertical inset />
        <v-btn icon @click="showInfo()" :title="$t('info')"
          :disabled="!hasSelected || selectedRows.length > 5"
        >
          <v-icon>mdi-alert-circle</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" :title="$t('category')" :disabled="!hasSelected">
              <v-icon>mdi-folder</v-icon>
            </v-btn>
          </template>
          <v-list class="category-actions">
            <v-subheader @click.stop="">
              {{ $t('title.set_category') }}
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
                  {{ $t('reset') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <template v-if="!$vuetify.breakpoint.xsOnly">
          <v-divider vertical inset />
          <v-btn icon @click="reannounceTorrents" :title="$t('reannounce')">
            <v-icon>mdi-bullhorn</v-icon>
          </v-btn>
          <v-btn icon @click="editTracker" :title="$t('title.edit_tracker')">
            <v-icon>mdi-server</v-icon>
          </v-btn>
          <v-btn icon @click="recheckTorrents" :title="$t('recheck')" :disabled="selectedRows.length == 0">
            <v-icon>mdi-backup-restore</v-icon>
          </v-btn>
        </template>
      </div>
      <v-divider />
    </div>

    <div class="table-wrapper">
      <v-data-table
        :headers="headers"
        :items="torrents"
        item-key="hash"
        fixed-header
        v-class:hide-headers="hasSelected"
        show-select
        :options.sync="pageOptions"
        v-model="selectedRows"
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
    </div>

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
import Vue from 'vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { intersection, difference } from 'lodash'

import { tr } from '@/locale'
import ConfirmDeleteDialog from './dialogs/ConfirmDeleteDialog.vue'
import ConfirmSetCategoryDialog from './dialogs/ConfirmSetCategoryDialog.vue'
import EditTrackerDialog from './dialogs/EditTrackerDialog.vue'
import InfoDialog from './dialogs/InfoDialog.vue'
import api from '../Api'
import { formatSize, formatDuration } from '../filters'
import { torrentIsState } from '../utils'
import { StateType } from '../consts'
import { DialogType, TorrentFilter, ConfigPayload, DialogConfig, SnackBarConfig } from '../store/types'
import Component from 'vue-class-component'
import { Torrent, Category } from '../types'
import { Watch } from 'vue-property-decorator'

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

@Component({
  components: {
    ConfirmDeleteDialog,
    ConfirmSetCategoryDialog,
    EditTrackerDialog,
    InfoDialog,
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
      'showDialog',
      'showSnackBar',
    ]),
  },
})
export default class Torrents extends Vue {
  readonly headers = [
    { text: tr('name'), value: 'name' },
    { text: tr('size'), value: 'size' },
    { text: tr('progress'), value: 'progress' },
    { text: tr('status'), value: 'state' },
    { text: tr('seeds'), value: 'num_complete' },
    { text: tr('peers'), value: 'num_incomplete' },
    { text: tr('dl_speed'), value: 'dlspeed' },
    { text: tr('up_speed'), value: 'upspeed' },
    { text: tr('eta'), value: 'eta' },
    { text: tr('ratio'), value: 'ratio' },
    { text: tr('added_on'), value: 'added_on' },
  ]

  readonly footerProps = {
    'items-per-page-options': [10, 20, 50, -1],
  }

  selectedRows: Torrent[] = []
  toDelete: Torrent[] = []
  toSetCategory: Torrent[] = []
  categoryToSet: string | null = null
  toShowInfo: Torrent[] = []
  toEditTracker: Torrent[] = []
  infoTab = null
  pageOptions: any = null

  isDataReady!: boolean
  allTorrents!: Torrent[]
  allCategories!: Category[]
  torrentGroupByCategory!: {[category: string]: Torrent[]}
  torrentGroupBySite!: {[site: string]: Torrent[]}
  torrentGroupByState!: {[state: string]: Torrent[]}
  filter!: TorrentFilter

  updateConfig!: (_: ConfigPayload) => void
  showDialog!: (_: DialogConfig) => void
  showSnackBar!: (_: SnackBarConfig) => void

  get loading() {
    return !this.isDataReady;
  }
  get hasSelected() {
    return !!this.selectedRows.length;
  }
  get selectedHashes() {
    return this.selectedRows.map(r => r.hash);
  }

  get torrents() {
    if (!this.isDataReady) {
      return [];
    }
    let list = this.allTorrents;
    if (this.filter.site !== null) {
      list = intersection(list, this.torrentGroupBySite[this.filter.site]);
    }
    if (this.filter.category !== null) {
      list = intersection(list, this.torrentGroupByCategory[this.filter.category]);
    }
    if (this.filter.state !== null) {
      list = intersection(list, this.torrentGroupByState[this.filter.state]);
    }

    return list;
  }

  get hasSelectedAll() {
    return this.hasSelected && this.selectedRows.length
      === Math.min(this.torrents.length, this.pageOptions.rowsPerPage);
  }

  created() {
    this.pageOptions = this.$store.getters.config.pageOptions;
  }

  confirmDelete() {
    this.toDelete = this.selectedRows;
  }

  showInfo(row?: any) {
    this.toShowInfo = row ? [row] : this.selectedRows;
  }

  async resumeTorrents() {
    await api.resumeTorrents(this.selectedHashes);
  }

  async pauseTorrents() {
    await api.pauseTorrents(this.selectedHashes);
  }

  async reannounceTorrents() {
    if (!this.hasSelected) {
      this.selectedRows = this.allTorrents;
    }
    const v = await new Promise((resolve) => {
      this.showDialog({
        content: {
          title: 'Reannounce Torrents',
          text: 'Are you sure want to reannounce torrents?',
          type: DialogType.OkCancel,
          callback: resolve,
        },
      });
    });

    if (!v) {
      return;
    }

    await api.reannounceTorrents(this.selectedHashes);

    this.showSnackBar({text: 'Reannounced'});
  }

  async recheckTorrents() {
    const v = await new Promise((resolve) => {
      this.showDialog({
        content: {
          title: 'Recheck Torrents',
          text: 'Are you sure want to recheck torrents?',
          type: DialogType.OkCancel,
          callback: resolve,
        },
      });
    });

    if (!v) {
      return;
    }
    await api.recheckTorrents(this.selectedHashes);

    this.showSnackBar({text: 'Rechecking'});
  }

  setTorrentsCategory(category: string) {
    this.categoryToSet = category;
    this.toSetCategory = this.selectedRows;
  }

  editTracker() {
    if (this.hasSelected) {
      this.selectedRows = this.allTorrents;
    }
    this.toEditTracker = this.selectedRows;
  }

  @Watch('pageOptions', { deep: true})
  onPageOptionsChanged() {
    this.updateConfig({
      key: 'pageOptions',
      value: this.pageOptions,
    })
  }

  @Watch('filter')
  onFilterChanged() {
    this.selectedRows = []
  }

  @Watch('torrents')
  onTorrentsChanged(v: Torrent[]) {
    if (!this.hasSelected) {
      return;
    }

    const torrentHashs = v.map(t => t.hash);
    const toRemove = difference(this.selectedHashes, torrentHashs);
    if (!toRemove) {
      return;
    }

    this.selectedRows = this.selectedRows.filter(r => !toRemove.includes(r.hash));
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  margin-left: 2px;
}

.torrents {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: 100%;
}

.table-wrapper {
  flex: 1;
  position: relative;

  .v-data-table {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    display: flex;
    flex-direction: column;

    ::v-deep .v-data-table__wrapper {
      flex: 1;
    }

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
        max-width: 32em;
      }
    }
    
    ::v-deep .v-data-footer {
      margin-right: 6em;
    }
  }
}

.phone-layout {
  .v-data-table ::v-deep .v-data-footer {
    flex-wrap: nowrap;
    margin-right: 0;
  }
}

.icon-label {
  display: flex;
  align-items: center;
}
</style>
