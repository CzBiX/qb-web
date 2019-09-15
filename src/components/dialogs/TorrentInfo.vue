<template>
  <div class="torrent-info">
    <fieldset>
      <legend>Transfer</legend>
      <v-container v-if="properties" class="pa-1">
        <v-row no-gutters>
          <template
            v-for="item in transfer"
          >
            <v-col class="label" :key="item.label + '_l'" cols="3" sm="2" md="1">
              {{ item.label }}:
            </v-col>
            <v-col class="value" :key="item.label + '_v'" cols="9" sm="4" md="2">
              {{ item.value(properties) }}
            </v-col>
          </template>
        </v-row>
      </v-container>
    </fieldset>
    <fieldset>
      <legend>Information</legend>
      <v-container v-if="properties" class="pa-1">
        <v-row no-gutters>
          <template
            v-for="item in information"
          >
            <v-col class="label" :key="item.label + '_l'" cols="3" sm="2" md="1">
              {{ item.label }}:
            </v-col>
            <v-col class="value" :key="item.label + '_v'" cols="9" sm="4" md="3">
              {{ item.value(properties) }}
            </v-col>
          </template>
        </v-row>
      </v-container>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import api from '../../Api';
import Taskable from '@/mixins/taskable';
import {
  formatDuration, formatSize, formatTimestamp, toPrecision,
} from '@/filters';

/* eslint-disable camelcase */
interface Properties {
  addition_date: number;
  comment: string;
  completion_date: number;
  created_by: string;
  creation_date: number;
  dl_limit: number;
  dl_speed: number;
  dl_speed_avg: number;
  eta: number;
  last_seen: number;
  nb_connections: number;
  nb_connections_limit: number;
  peers: number;
  peers_total: number;
  piece_size: number;
  pieces_have: number;
  pieces_num: number;
  reannounce: number;
  save_path: string;
  seeding_time: number;
  seeds: number;
  seeds_total: number;
  share_ratio: number;
  time_elapsed: number;
  total_downloaded: number;
  total_downloaded_session: number;
  total_size: number;
  total_uploaded: number;
  total_uploaded_session: number;
  total_wasted: number;
  up_limit: number;
  up_speed: number;
  up_speed_avg: number;
}
/* eslint-enable camelcase */

interface Item {
  label: string;
  value: (prop: Properties) => string;
}

interface Data {
  properties?: Properties;
  transfer: Array<Item>;
  information: Array<Item>;
}

export default Vue.extend({
  mixins: [Taskable],

  props: {
    torrent: Object,
    isActive: Boolean,
  },
  data(): Data {
    return {
      properties: undefined,
      transfer: [
        {
          label: 'Time active',
          value: prop => formatDuration(prop.time_elapsed) + (prop.seeding_time ? ` (seeded ${formatDuration(prop.seeding_time)})` : ''),
        },
        { label: 'ETA', value: prop => formatDuration(prop.eta, { dayLimit: 100 }) },
        { label: 'Connections', value: prop => `${prop.nb_connections} (${prop.nb_connections_limit} max)` },
        { label: 'Downloaded', value: prop => `${formatSize(prop.total_downloaded_session)}/${formatSize(prop.total_downloaded)}` },
        { label: 'Uploaded', value: prop => `${formatSize(prop.total_uploaded_session)}/${formatSize(prop.total_uploaded)}` },
        { label: 'Seeds', value: prop => `${prop.seeds} (${prop.seeds_total} total)` },
        { label: 'DL speed', value: prop => `${formatSize(prop.dl_speed)}/s` },
        { label: 'UP speed', value: prop => `${formatSize(prop.up_speed)}/s` },
        { label: 'Peers', value: prop => `${prop.peers} (${prop.peers_total} total)` },
        { label: 'Wasted', value: prop => formatSize(prop.total_wasted) },
        { label: 'Share ratio', value: prop => toPrecision(prop.share_ratio, 2) },
        { label: 'Reannounce', value: prop => formatDuration(prop.reannounce) },
        { label: 'Last seen', value: prop => formatTimestamp(prop.last_seen) },
      ],
      information: [
        { label: 'Total size', value: prop => formatSize(prop.total_size) },
        { label: 'Pieces', value: prop => `${prop.pieces_num} x ${formatSize(prop.piece_size)} (have ${prop.pieces_have})` },
        { label: 'Created by', value: prop => prop.created_by },
        { label: 'Created on', value: prop => formatTimestamp(prop.creation_date) },
        { label: 'Added on', value: prop => formatTimestamp(prop.addition_date) },
        { label: 'Completed on', value: prop => formatTimestamp(prop.completion_date) },
        { label: 'Torrent hash', value: prop => this.torrent.hash },
        { label: 'Save path', value: prop => prop.save_path },
        { label: 'Comment', value: prop => prop.comment },
      ],
    };
  },
  methods: {
    async getProperties() {
      this.properties = await api.getTorrentProperties(this.torrent.hash);
      if (!this.isActive || this.destroy) {
        return;
      }

      this.task = setTimeout(this.getProperties, 5000);
    },
  },
  async created() {
    if (this.isActive) {
      await this.getProperties();
    }
  },
  watch: {
    async isActive(v) {
      if (v) {
        await this.getProperties();
      } else {
        this.cancelTask();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.torrent-info {
  font-size: 12px;

  .label {
    text-align: right;
    padding-right: 0.5em;
    text-transform: capitalize;
  }

  .value {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
