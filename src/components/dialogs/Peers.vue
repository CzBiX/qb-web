<template>
  <v-data-table
    :headers="headers"
    :items="peers"
    :items-per-page="-1"
    :hide-default-footer="true"
  >
    <template v-slot:item="row">
      <tr>
        <td class="ip">
          <template v-if="row.item.country_code">
            <img
              v-if="isWindows"
              class="country-flag"
              :title="row.item.country"
              :alt="codeToFlag(row.item.country_code).char"
              :src="codeToFlag(row.item.country_code).url"
            >
            <template v-else>
              {{ codeToFlag(row.item.country_code).char }}
            </template>
          </template>
          {{ row.item.ip }}
          <span class="grey--text">
            :{{ row.item.port }}
          </span>
        </td>
        <td>{{ row.item.connection }}</td>
        <td :title="row.item.flags_desc">
          {{ row.item.flags }}
        </td>
        <td>{{ row.item.client }}</td>
        <td>{{ row.item.progress | progress }}</td>
        <td>{{ row.item.dl_speed | networkSpeed }}</td>
        <td>{{ row.item.downloaded | networkSize }}</td>
        <td>{{ row.item.up_speed | networkSpeed }}</td>
        <td>{{ row.item.uploaded | networkSize }}</td>
        <td>{{ row.item.relevance | progress }}</td>
        <td>{{ row.item.files }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { map, merge, cloneDeep } from 'lodash';
import { codeToFlag, isWindows } from '../../utils';
import api from '../../Api';
import { formatSize } from '../../filters';
import BaseTorrentInfo from './baseTorrentInfo';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { tr } from '@/locale'

@Component({
  filters: {
    networkSpeed(speed: number) {
      if (speed === 0) {
        return null;
      }

      return `${formatSize(speed)}/s`;
    },
    networkSize(size: number) {
      if (size === 0) {
        return null;
      }

      return formatSize(size);
    },
  },
})
export default class Peers extends BaseTorrentInfo {
  @Prop(String)
  readonly hash!: string

  headers = [
    { text: tr('properties_widget.ip'), value: 'ip' },
    { text: tr('properties_widget.connection'), value: 'connection' },
    { text: tr('properties_widget.flags'), value: 'flags' },
    { text: tr('properties_widget.client'), value: 'client' },
    { text: tr('properties_widget.progress'), value: 'progress' },
    { text: tr('properties_widget.downloadSpeed'), value: 'dl_speed' },
    { text: tr('properties_widget.downloaded'), value: 'downloaded' },
    { text: tr('properties_widget.uploadSpeed'), value: 'up_speed' },
    { text: tr('properties_widget.uploaded'), value: 'uploaded' },
    { text: tr('properties_widget.relevance'), value: 'relevance' },
    { text: tr('properties_widget.files'), value: 'files' },
  ]

  peersObj: any = null
  rid: number | null = null
  isWindows: boolean = isWindows

  get peers() {
    return map(this.peersObj, (value, key) => merge({}, value, { key }));
  }

  codeToFlag(code: string) {
    if (code) {
      return codeToFlag(code);
    }

    return {};
  }

  async getPeers() {
    const resp = await api.getTorrentPeers(this.hash, this.rid || undefined);
    this.rid = resp.rid;

    if (resp.full_update) {
      this.peersObj = resp.peers;
    } else {
      const tmp: any = cloneDeep(this.peersObj);
      if (resp.peers_removed) {
        for (const key of resp.peers_removed) {
          delete tmp[key];
        }
      }
      this.peersObj = merge(tmp, resp.peers);
    }
  }

  fetchInfo() {
    return this.getPeers()
  }

  startTask() {
    this.setTaskAndRun(this.doTask, 2000)
  }
}
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
