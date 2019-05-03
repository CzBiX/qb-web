<template>
  <v-data-table
    :headers="headers"
    :items="peers"
    :hide-actions="true"
  >
    <template v-slot:items="row">
      <td class="ip">
        <img
          v-if="isWindows"
          class="country-flag"
          :title="row.item.country"
          :alt="codeToFlag(row.item.country_code).char"
          :src="codeToFlag(row.item.country_code).url"
        />
        <template v-else>
          {{ codeToFlag(row.item.country_code).char }}
        </template>
        {{ row.item.ip }}
        <span class="grey--text">:{{ row.item.port }}</span>
      </td>
      <td>{{ row.item.connection }}</td>
      <td :title="row.item.flags_desc">{{ row.item.flags }}</td>
      <td>{{ row.item.client }}</td>
      <td>{{ row.item.progress | progress }}</td>
      <td>{{ row.item.dl_speed | size }}/s</td>
      <td>{{ row.item.up_speed | size }}/s</td>
      <td>{{ row.item.downloaded | size }}</td>
      <td>{{ row.item.uploaded | size }}</td>
      <td>{{ row.item.relevance | progress }}</td>
      <td>{{ row.item.files }}</td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import { codeToFlag, isWindows } from '../../utils';
import Taskable from '@/mixins/taskable';
import { api } from '../../Api';

export default Vue.extend({
  mixins: [Taskable],

  props: {
    hash: String,
    isActive: Boolean,
  },
  data() {
    const headers = [
      { text: 'IP', value: 'ip' },
      { text: 'Connection', value: 'connection' },
      { text: 'Flags', value: 'flags' },
      { text: 'Client', value: 'client' },
      { text: 'Progress', value: 'progress' },
      { text: 'DL Speed', value: 'dl_speed' },
      { text: 'UP Speed', value: 'up_speed' },
      { text: 'Downloaded', value: 'downloaded' },
      { text: 'Uploaded', value: 'uploaded' },
      { text: 'Relevance', value: 'relevance' },
      { text: 'Files', value: 'files' },
    ];

    return {
      headers,
      peersObj: null,
      rid: null,
      isWindows,
    };
  },
  computed: {
    peers() {
      return _.map(this.peersObj, (value, key) => {
        return _.merge({}, value, { key });
      });
    },
  },
  methods: {
    codeToFlag(code: string) {
      return codeToFlag(code);
    },
    async getPeers() {
      const resp = await api.getTorrentPeers(this.hash, this.rid);
      this.rid = resp.rid;

      if (resp.full_update) {
        this.peersObj = resp.peers;
      } else {
        const tmp: any = _.cloneDeep(this.peersObj);
        if (resp.peers_removed) {
          for (const key of resp.peers_removed) {
            delete tmp[key];
          }
        }
        this.peersObj = _.merge(tmp, resp.peers);
      }

      if (!this.isActive || this.destroy) {
        return;
      }

      this.task = setTimeout(this.getPeers, 2000);
    },
  },
  async created() {
    if (this.isActive) {
      await this.getPeers();
    }
  },
  watch: {
    async isActive(v) {
      if (v) {
        await this.getPeers();
      } else {
        this.cancelTask();
      }
    }
  },
});
</script>

<style lang="scss" scoped>
::v-deep .ip {
  display: flex;
  align-items: center;

  .country-flag {
    width: 1.5em;
    margin-right: 0.5em;
  }
}
</style>
