<template>
  <div class="torrent-info">
    <div class="progress">
      <span>{{ $t('properties_widget.progress') }}:</span>
      <canvas
        ref="canvas"
        class="progress-inner"
      />
      <span>{{ torrent.progress | progress }}</span>
    </div>
    <fieldset>
      <legend>{{ $t('properties_widget.transfer') }}</legend>
      <v-container
        v-if="properties"
        class="pa-1"
      >
        <v-row no-gutters>
          <template
            v-for="item in transfer"
          >
            <v-col
              class="label"
              :key="item.label + '_l'"
              cols="3"
              sm="2"
              md="1"
            >
              {{ item.label }}:
            </v-col>
            <v-col
              class="value"
              :key="item.label + '_v'"
              cols="9"
              sm="4"
              md="2"
            >
              {{ item.value(properties) }}
            </v-col>
          </template>
        </v-row>
      </v-container>
    </fieldset>
    <fieldset>
      <legend>{{ $t('properties_widget.information') }}</legend>
      <v-container
        v-if="properties"
        class="pa-1"
      >
        <v-row no-gutters>
          <template
            v-for="item in information"
          >
            <v-col
              class="label"
              :key="item.label + '_l'"
              cols="3"
              sm="2"
              md="1"
            >
              {{ item.label }}:
            </v-col>
            <v-col
              class="value"
              :key="item.label + '_v'"
              cols="9"
              sm="4"
              md="3"
            >
              {{ item.value(properties) }}
            </v-col>
          </template>
        </v-row>
      </v-container>
    </fieldset>
  </div>
</template>

<script lang="ts">
import {chunk, countBy} from 'lodash'

import api from '../../Api'
import {formatDuration, formatSize, formatTimestamp, toPrecision} from '@/filters'

import {Torrent, TorrentProperties} from '@/types'
import Component from 'vue-class-component'
import {Prop, Watch} from 'vue-property-decorator'
import BaseTorrentInfo from './baseTorrentInfo'
import { tr } from '@/locale'

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
      label: tr('properties_widget.timeActive'),
      value: prop => formatDuration(prop.time_elapsed) + (prop.seeding_time ? ` ($tr('properties_widget.seeded') ${formatDuration(prop.seeding_time)})` : ''),
    },
    { label: tr('properties_widget.eta'), value: prop => formatDuration(prop.eta, { dayLimit: 100 }) },
    { label: tr('properties_widget.connections'), value: prop => `${prop.nb_connections} (${prop.nb_connections_limit} ${tr('properties_widget.max')})` },
    { label: tr('properties_widget.downloaded'), value: prop => `${formatSize(prop.total_downloaded_session)}/${formatSize(prop.total_downloaded)}` },
    { label: tr('properties_widget.uploaded'), value: prop => `${formatSize(prop.total_uploaded_session)}/${formatSize(prop.total_uploaded)}` },
    { label: tr('properties_widget.seeds'), value: prop => `${prop.seeds} (${prop.seeds_total} ${tr('properties_widget.total')})` },
    { label: tr('properties_widget.downloadSpeed'), value: prop => `${formatSize(prop.dl_speed)}/${tr('properties_widget.second')}` },
    { label: tr('properties_widget.uploadSpeed'), value: prop => `${formatSize(prop.up_speed)}/${tr('properties_widget.second')}` },
    { label: tr('properties_widget.peers'), value: prop => `${prop.peers} (${prop.peers_total} ${tr('properties_widget.total')})` },
    { label: tr('properties_widget.wasted'), value: prop => formatSize(prop.total_wasted) },
    { label: tr('properties_widget.shareRatio'), value: prop => toPrecision(prop.share_ratio, 3) },
    { label: tr('properties_widget.reannounce'), value: prop => formatDuration(prop.reannounce) },
    { label: tr('properties_widget.lastSeen'), value: prop => formatTimestamp(prop.last_seen) },
  ]

  information: Item[] = [
    { label: tr('properties_widget.totalSize'), value: prop => formatSize(prop.total_size) },
    { label: tr('properties_widget.pieces'), value: prop => `${prop.pieces_num} x ${formatSize(prop.piece_size)} (${tr('properties_widget.have')} ${prop.pieces_have})` },
    { label: tr('properties_widget.createdBy'), value: prop => prop.created_by },
    { label: tr('properties_widget.createdOn'), value: prop => formatTimestamp(prop.creation_date) },
    { label: tr('properties_widget.addedOn'), value: prop => formatTimestamp(prop.addition_date) },
    { label: tr('properties_widget.completedOn'), value: prop => formatTimestamp(prop.completion_date) },
    { label: tr('properties_widget.torrentHash'), value: () => this.torrent.hash },
    { label: tr('properties_widget.savePath'), value: prop => prop.save_path },
    { label: tr('properties_widget.comment'), value: prop => prop.comment },
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

    return el.getContext('2d')!;
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
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    const partNum = clientWidth / 2;
    const offset = clientWidth / partNum;
    const chunkSize = Math.floor(v.length / partNum);

    const chunks = chunk(v, chunkSize);
    for (let i = 0; i < partNum; i++) {
      const states = countBy(chunks[i]);
      const downloading = states[PieceState.Downloading];
      const empty = states[PieceState.Empty] || 0;
      const downloaded = states[PieceState.Downloaded];
      let color;
      if (downloading) {
        color = 'lightgreen';
      } else if (downloaded >= empty) {
        color = 'lightblue';
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
