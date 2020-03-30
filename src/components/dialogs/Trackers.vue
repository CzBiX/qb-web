<template>
  <v-data-table
    :headers="headers"
    :items="trackers"
    :items-per-page="-1"
    :hide-default-footer="true"
  >
    <template v-slot:item="row">
      <tr>
        <td>{{ row.item.tier }}</td>
        <td>{{ row.item.url }}</td>
        <td>{{ row.item.status | formatTrackerStatus }}</td>
        <td>{{ row.item.num_peers | formatTrackerNum }}</td>
        <td>{{ row.item.num_seeds | formatTrackerNum }}</td>
        <td>{{ row.item.num_leeches | formatTrackerNum }}</td>
        <td>{{ row.item.num_downloaded | formatTrackerNum }}</td>
        <td>{{ row.item.msg }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import api from '../../Api';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import BaseTorrentInfo from './baseTorrentInfo';

@Component({
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
})
export default class Trackers extends BaseTorrentInfo {
  @Prop(String)
  readonly hash!: string

  readonly headers = [
    { text: '#', value: 'tier' },
    { text: 'URL', value: 'url' },
    { text: 'Status', value: 'status' },
    { text: 'Peers', value: 'num_peers' },
    { text: 'Seeds', value: 'num_seeds' },
    { text: 'Leeches', value: 'num_leeches' },
    { text: 'Downloaded', value: 'num_downloaded' },
    { text: 'Message', value: 'msg' },
  ]

  trackers = []

  async getTracker() {
    this.trackers = await api.getTorrentTracker(this.hash);
  }

  fetchInfo() {
    return this.getTracker()
  }
}
</script>
