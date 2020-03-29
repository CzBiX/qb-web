<template>
  <v-dialog
    :value="true"
    @input="closeDialog"
    :width="dialogWidth"
    :fullscreen="phoneLayout"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-alert-circle</v-icon>
        <span>Info</span>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tab">
          <v-tab href="#general">
            General
          </v-tab>
          <v-tab href="#trackers">
            Trackers
          </v-tab>
          <v-tab href="#peers">
            Peers
          </v-tab>
          <v-tab href="#content">
            Content
          </v-tab>
        </v-tabs>
        <v-tabs-items :value="tab" touchless>
          <v-tab-item value="general">
            <panel
              v-for="torrent in torrents"
              :key="torrent.hash"
              :title="torrent.name"
              :single="torrents.length === 1"
            >
              <torrent-info
                :torrent="torrent"
                :isActive="mTab === 'general'"
                />
            </panel>
          </v-tab-item>
          <v-tab-item value="trackers">
            <panel
              v-for="torrent in torrents"
              :key="torrent.hash"
              :title="torrent.name"
              :single="torrents.length === 1"
            >
              <trackers
                :hash="torrent.hash"
                :isActive="tab === 'trackers'"
              />
            </panel>
          </v-tab-item>
          <v-tab-item value="peers">
            <panel
              v-for="torrent in torrents"
              :key="torrent.hash"
              :title="torrent.name"
              :single="torrents.length === 1"
            >
              <peers
                :hash="torrent.hash"
                :isActive="tab === 'peers'"
              />
            </panel>
          </v-tab-item>
          <v-tab-item value="content">
            <panel
              v-for="torrent in torrents"
              :key="torrent.hash"
              :title="torrent.name"
              :single="torrents.length === 1"
            >
              <torrent-content
                :hash="torrent.hash"
                :isActive="tab === 'content'"
              />
            </panel>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import TorrentInfo from './TorrentInfo.vue';
import TorrentContent from './TorrentContent.vue';
import Trackers from './Trackers.vue';
import Peers from './Peers.vue';
import Panel from './Panel.vue';
import Component from 'vue-class-component';
import { Prop, Emit, Watch, PropSync } from 'vue-property-decorator';
import { Torrent } from '../../types';

@Component({
  components: {
    TorrentInfo,
    TorrentContent,
    Trackers,
    Peers,
    Panel,
  },
})
export default class InfoDialog extends Vue {
  @Prop(Array)
  readonly value!: Torrent[]

  @PropSync('tab', String)
  tab!: string

  torrents!: Torrent[]

  created() {
    this.torrents = this.value
  }

  get phoneLayout() {
    return this.$vuetify.breakpoint.xsOnly;
  }
  get dialogWidth() {
    return this.phoneLayout ? '100%' : '80%';
  }

  @Emit('input')
  closeDialog() {
    return false
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-dialog {
  max-width: 1100px;

  .v-card__text {
    min-height: 200px;
    padding: 0 8px 8px;
  }
}

::v-deep .v-data-table thead th, ::v-deep .v-data-table tbody td {
  padding: 0 2px !important;
  height: auto;

  white-space: nowrap;

  &:first-child {
    padding: 0 0 0 8px !important;
  }
  &:last-child {
    padding-right: 8px !important;
  }
}

.v-dialog--fullscreen {
  .v-card__text {
    padding-bottom: 52px;
  }

  .v-card__actions {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
