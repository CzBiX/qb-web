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
import { tr } from '@/locale'

@Component({
  filters: {
    formatTrackerStatus(status: number) {
      const map = [
        tr('properties_widget.disabled'),
        tr('properties_widget.notContracted'),
        tr('properties_widget.working'),
        tr('properties_widget.updating'),
        tr('properties_widget.notWorking'),
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
    { text: tr('properties_widget.tier'), value: 'tier' },
    { text: tr('properties_widget.url'), value: 'url' },
    { text: tr('properties_widget.status'), value: 'status' },
    { text: tr('properties_widget.numPeers'), value: 'num_peers' },
    { text: tr('properties_widget.numSeeds'), value: 'num_seeds' },
    { text: tr('properties_widget.numLeeches'), value: 'num_leeches' },
    { text: tr('properties_widget.numDownloaded'), value: 'num_downloaded' },
    { text: tr('properties_widget.msg'), value: 'msg' },
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
