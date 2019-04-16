<template>
  <div>
    <v-toolbar
      flat
      v-show="hasSelected"
      color="white"
      height="57px"
    >
      <v-checkbox class="shrink menu-check"
        :input-value="hasSelected"
        :indeterminate="!hasSelectedAll"
        primary
        hide-details
        @click.stop="selectedRows = []"
      ></v-checkbox>
      <v-btn icon @click="confirmDelete">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-divider vertical inset />
      <v-btn icon @click="resumeTorrents">
        <v-icon>mdi-play</v-icon>
      </v-btn>
      <v-btn icon @click="pauseTorrents">
        <v-icon>mdi-pause</v-icon>
      </v-btn>
      <v-divider vertical inset />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-folder</v-icon>
          </v-btn>
        </template>
        <v-list class="category-actions">
          <v-list-tile-sub-title
            class="px-3 py-1"
            @click.stop=""
            >
            Set category
          </v-list-tile-sub-title>
          <v-list-tile
            v-for="(item, i) in categories"
            :key="i"
            @click="setTorrentsCategory(item)"
            >
            <v-list-tile-action>
              <v-icon>mdi-folder-open</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>
              {{ item }}
            </v-list-tile-title>
          </v-list-tile>
          <v-divider />
          <v-list-tile @click="setTorrentsCategory('')">
            <v-list-tile-action>
              <v-icon>mdi-folder-remove</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>
              Reset
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-divider />
    <v-data-table
      :headers="headers"
      :items="torrents"
      item-key="hash"
      :hide-actions="torrents.length <= pagination.rowsPerPage"
      v-class:hide-headers="hasSelected"
      select-all
      :pagination.sync="pagination"
      v-model="selectedRows"
    >
      <template v-slot:items="row">
        <td>
          <v-checkbox
            v-model="row.selected"
            hide-details
          />
        </td>
        <td :title="row.item.name">{{ row.item.name }}</td>
        <td>{{ row.item.size | formatSize }}</td>
        <td>
          <v-progress-linear
            height="1.4em"
            :value="row.item.progress * 100"
            class="text-xs-center ma-0"
          >
            <span :class="row.item.progress | progressColorClass">{{ row.item.progress | progressText }}</span>
          </v-progress-linear>
        </td>
        <td>{{ row.item.state }}</td>
        <td>{{ row.item.num_seeds }}/{{ row.item.num_complete }}</td>
        <td>{{ row.item.num_leechs }}/{{ row.item.num_incomplete }}</td>
        <td>{{ formatNetworkSpeed(row.item.dlspeed) }}</td>
        <td>{{ formatNetworkSpeed(row.item.upspeed) }}</td>
        <td>{{ row.item.eta | formatDuration({dayLimit: 100}) }}</td>
        <td>{{ row.item.ratio.toFixed(2) }}</td>
        <td>
          <span :title="row.item.added_on | formatTimestamp">
            {{ row.item.added_on | formatAsDuration }} ago
          </span>
        </td>
      </template>
    </v-data-table>

    <confirm-delete-dialog v-if="deleteDialog" v-model="deleteDialog" :torrents="selectedRows" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ConfirmDeleteDialog from './dialogs/ConfirmDeleteDialog.vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import _ from 'lodash';
import { api } from '../Api';
import { formatSize, formatDuration } from '../filters';

export default Vue.extend({
  name: 'torrents',

  components: {
    ConfirmDeleteDialog,
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
      deleteDialog: false,
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
      'torrentGroupByCategory',
      'torrentGroupBySite',
    ]),
    ...mapState({
      filter(state, getters) {
        return getters.config.filter;
      },
      categories(state, getters) {
        return Object.keys(getters.torrentGroupByCategory).filter(_.identity);
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

      return list;
    },
    hasSelectedAll() {
      return this.hasSelected && this.selectedRows.length === Math.min(this.torrents.length, this.pagination.rowsPerPage)
    },
  },

  filters: {
    progressText(progress: number) {
      return Math.floor(progress * 100) + '%';
    },
    progressColorClass(progress: number) {
      const color = progress >= 0.5 ? 'white' : 'black';
      return color + '--text';
    },
  },

  methods: {
    ...mapMutations([
      'updateConfig',
    ]),
    confirmDelete() {
      this.deleteDialog = true;
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
    formatNetworkSpeed(speed: number) {
      if (speed === 0) {
        return null;
      }

      return formatSize(speed) + '/s';
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

<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  padding-left: 8px;
}

.category-actions .v-list__tile__action {
  min-width: 40px;
}

.menu-check {
  padding: 0;
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
