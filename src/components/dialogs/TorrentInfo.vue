<template>
  <div class="torrent-info">
    <div class="progress">
      <span>Progress:</span>
      <canvas ref="canvas" class="progress-inner" />
      <span>{{ torrent.progress | progress }}</span>
    </div>
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
import { chunk, countBy } from 'lodash';

import Vue from 'vue';
import api from '../../Api';
import {
  formatDuration, formatSize, formatTimestamp, toPrecision,
} from '@/filters';

import { TorrentProperties, Torrent } from '@/types'
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import BaseTorrentInfo from './baseTorrentInfo';

interface Item {
  label: string;
  value: (prop: TorrentProperties) => string;
}

enum PieceState {
  Empty,
  Downloading,
  Downloaded,
}

@Component({

})
export default class TorrentInfo extends BaseTorrentInfo {
  @Prop()
  readonly torrent!: Torrent

  properties: TorrentProperties | null = null

  transfer: Item[] = [
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
    { label: 'Share ratio', value: prop => toPrecision(prop.share_ratio, 3) },
    { label: 'Reannounce', value: prop => formatDuration(prop.reannounce) },
    { label: 'Last seen', value: prop => formatTimestamp(prop.last_seen) },
  ]

  information: Item[] = [
    { label: 'Total size', value: prop => formatSize(prop.total_size) },
    { label: 'Pieces', value: prop => `${prop.pieces_num} x ${formatSize(prop.piece_size)} (have ${prop.pieces_have})` },
    { label: 'Created by', value: prop => prop.created_by },
    { label: 'Created on', value: prop => formatTimestamp(prop.creation_date) },
    { label: 'Added on', value: prop => formatTimestamp(prop.addition_date) },
    { label: 'Completed on', value: prop => formatTimestamp(prop.completion_date) },
    { label: 'Torrent hash', value: prop => this.torrent.hash },
    { label: 'Save path', value: prop => prop.save_path },
    { label: 'Comment', value: prop => prop.comment },
  ]
  pieces: PieceState[] = []
  canvas: CanvasRenderingContext2D | null = null

  async getData() {
    this.properties = await api.getTorrentProperties(this.torrent.hash);
    this.pieces = await api.getTorrentPieceStates(this.torrent.hash);
  }

  initCanvas(el: HTMLCanvasElement) {
    const { clientWidth, clientHeight } = el;
    /* eslint-disable no-param-reassign */
    el.width = clientWidth;
    el.height = clientHeight;
    /* eslint-enable no-param-reassign */

    const ctx = el.getContext('2d')!;
    return ctx;
  }

  fetchInfo() {
    return this.getData()
  }

  @Watch('pieces')
  onPiecesChanged(v: PieceState[]) {
    let ctx;
    if (this.canvas) {
      ctx = this.canvas
    } else {
      ctx = this.initCanvas(this.$refs.canvas as HTMLCanvasElement)
      this.canvas = ctx
    }

    const { clientHeight, clientWidth } = ctx.canvas;
    const partNum = clientWidth / 2;
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    const offset = clientWidth / partNum;
    const chunkSize = v.length / partNum;

    const chunks = chunk(v, chunkSize);
    for (let i = 0; i < partNum; i++) {
      const states = countBy(chunks[i]);
      const downloading = states[PieceState.Downloading];
      const empty = states[PieceState.Empty];
      const downloaded = states[PieceState.Downloaded];
      let color;
      if (downloading) {
        color = 'green';
      } else if (downloaded >= empty) {
        color = 'blue';
      } else {
        continue;
      }

      ctx.fillStyle = color;
      ctx.fillRect(i * offset, 0, offset, clientHeight);
    }
  }
}
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

  .progress {
    margin: 0.5em;
    display: flex;

    .progress-inner {
      margin: 0 1em;
      align-self: center;
      height: 16px;
      flex-grow: 1;
      border: 1px inset;
    }
  }
}
</style>
