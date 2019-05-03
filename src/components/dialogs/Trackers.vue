<template>
  <v-data-table
    :headers="headers"
    :items="trackers"
    :hide-actions="true"
  >
    <template v-slot:items="row">
      <td>{{ row.item.tier }}</td>
      <td>{{ row.item.url }}</td>
      <td>{{ row.item.status | formatTrackerStatus }}</td>
      <td>{{ row.item.num_peers | formatTrackerNum }}</td>
      <td>{{ row.item.num_seeds | formatTrackerNum }}</td>
      <td>{{ row.item.num_leeches | formatTrackerNum }}</td>
      <td>{{ row.item.num_downloaded | formatTrackerNum }}</td>
      <td>{{ row.item.msg }}</td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '../../Api';
import Taskable from '@/mixins/taskable';

export default Vue.extend({
  mixins: [Taskable],

  props: {
    hash: String,
    isActive: Boolean,
  },
  data() {
    const headers = [
      { text: '#', value: 'tier' },
      { text: 'URL', value: 'url' },
      { text: 'Status', value: 'status' },
      { text: 'Peers', value: 'num_peers' },
      { text: 'Seeds', value: 'num_seeds' },
      { text: 'Leeches', value: 'num_leeches' },
      { text: 'Downloaded', value: 'num_downloaded' },
      { text: 'Message', value: 'msg' },
    ];

    return {
      headers,
      trackers: [],
    };
  },
  filters: {
    formatTrackerStatus(status: number) {
      const map = [
        'Disabled',
        'Not contacted',
        'Working',
        'Updating',
        'Not working',
      ];

      return map[status];
    },
    formatTrackerNum(num: number) {
      if (num === -1) {
        return 'N/A';
      }

      return num.toString();
    },
  },
  methods: {
    async getTracker() {
      this.trackers = await api.getTorrentTracker(this.hash);
      if (!this.isActive || this.destroy) {
        return;
      }

      this.task = setTimeout(this.getTracker, 5000);
    },
  },
  async created() {
    if (this.isActive) {
      await this.getTracker();
    }
  },
  watch: {
    async isActive(v) {
      if (v) {
        await this.getTracker();
      } else {
        this.cancelTask();
      }
    }
  },
});
</script>
