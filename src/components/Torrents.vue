<template>
  <v-data-table
    :headers="headers"
    :items="torrents"
    item-key="hash"
    :hide-actions="torrents.length <= pagination.rowsPerPage"
    :pagination.sync="pagination"
  >
    <template v-slot:items="row">
      <td>
        <v-checkbox
          :input-value="row.selected"
          hide-details
        />
      </td>
      <td>{{ row.item.name }}</td>
      <td>{{ row.item.size | formatSize }}</td>
      <td>
        <v-progress-linear
          height="1.5em"
          :value="row.item.progress * 100"
          class="text-xs-center ma-0"
        >
          <span :class="row.item.progress | progressColorClass">{{ row.item.progress | progressText }}</span>
        </v-progress-linear>
      </td>
      <td>{{ row.item.state }}</td>
      <td>{{ row.item.num_seeds }}/{{ row.item.num_complete }}</td>
      <td>{{ row.item.num_leechs }}/{{ row.item.num_incomplete }}</td>
      <td>{{ row.item.dlspeed | formatSize }}/s</td>
      <td>{{ row.item.upspeed | formatSize }}/s</td>
      <td>{{ row.item.eta | formatDuration }}</td>
      <td>{{ row.item.ratio.toFixed(2) }}</td>
      <td>{{ row.item.added_on | formatTimestamp }}</td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import _ from 'lodash';

export default Vue.extend({
  name: 'torrents',

  data() {
    const headers = [
      { text: '', value: '#', sortable: false },
      { text: 'Name', value: 'name', class: 'th-name' },
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

    return {
      headers,
      pagination: {
        rowsPerPage: 100,
      },
    };
  },

  computed: {
    ...mapState([
      'filter',
    ]),
    ...mapGetters([
      'isDataReady',
      'allTorrents',
      'torrentGroupByCategory',
      'torrentGroupBySite',
    ]),
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
  },

  filters: {
    progressText(progress: number) {
      // if (progress >= 1) {
      //   return null;
      // }

      return Math.floor(progress * 100) + '%';
    },
    progressColorClass(progress: number) {
      const color = progress >= 0.5 ? 'white' : 'black';
      return color + '--text';
    },
  },
});
</script>

<style lang="scss" scoped>
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

::v-deep .v-datatable thead th.th-name {
  // max-width: 100px;
}
</style>
