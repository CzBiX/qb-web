<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input', $event)"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <span v-text="$t('settings')" />
          <v-spacer />
          <v-btn
            icon
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="tab">
            <v-tab
              v-for="item of tabList"
              :key="item"
            >
              {{ $t('preferences.' + item) }}
            </v-tab>
          </v-tabs>
          <v-fade-transition>
            <v-alert
              dense
              text
              type="success"
              v-show="preferenceUpdated"
            >
              {{ $t('preferences.change_applied') }}
            </v-alert>
          </v-fade-transition>
          <v-tabs-items v-model="tab">
            <v-tab-item key="downloads">
              <download-settings />
            </v-tab-item>
            <v-tab-item key="speed">
              <speed-settings />
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component, Emit, Prop, Watch} from 'vue-property-decorator'
import DownloadSettings from './DownloadSettings.vue'
import SpeedSettings from './SpeedSettings.vue'
import {mapGetters} from 'vuex'
import {Preferences} from '@/types'

@Component({
  components: {
    DownloadSettings,
    SpeedSettings,
  },
  computed: {
    ...mapGetters({
      preferences: 'allPreferences',
    }),
  },
  methods: {},
})
export default class SettingsDialog extends Vue {
  @Prop(Boolean)
  readonly value!: boolean
  preference!: Preferences
  preferenceUpdated = false
  tabList = ['downloads', 'speed', 'bittorrent', 'connection']
  tab = 'speed'

  @Watch('preferences')
  onPreferenceUpdate() {
    this.preferenceUpdated = true
    setTimeout(() => this.preferenceUpdated = false, 3000)
  }

  @Emit('input')
  closeDialog() {
    return false
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

@include dialog-title;
</style>
