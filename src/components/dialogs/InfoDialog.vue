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
        <v-tabs v-model="mTab">
          <!-- <v-tab>
            General
          </v-tab> -->
          <v-tab href="#trackers">
            Trackers
          </v-tab>
          <v-tab href="#peers">
            Peers
          </v-tab>
          <!-- <v-tab>
            Content
          </v-tab> -->
        </v-tabs>
        <v-tabs-items :value="mTab" touchless>
          <v-tab-item value="trackers">
            <panel
              v-for="torrent in torrents"
              :key="torrent.hash"
              :title="torrent.name"
              :single="torrents.length === 1"
            >
              <trackers
                :hash="torrent.hash"
                :isActive="mTab === 'trackers'"
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
                :isActive="mTab === 'peers'"
              />
            </panel>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue'
import Trackers from './Trackers.vue';
import Peers from './Peers.vue';
import Panel from './Panel.vue';

export default Vue.extend({
  components: {
    Trackers,
    Peers,
    Panel,
  },

  props: {
    value: Array,
    tab: String,
  },
  data() {
    return {
      torrents: [],
      mTab: null,
    };
  },
  created() {
    this.torrents = this.value;
    this.mTab = this.tab;
  },
  computed: {
    phoneLayout() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    dialogWidth() {
      return this.phoneLayout ? '100%' : '80%';
    },
  },
  methods: {
    closeDialog() {
      this.$emit('input', []);
    },
  },
  watch: {
    mTab(v) {
      this.$emit('change', v);
    },
  },
});
</script>

<style lang="scss" scoped>
::v-deep .v-dialog {
  max-width: 1100px;
}

::v-deep .v-datatable thead th, ::v-deep .v-datatable tbody td {
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
