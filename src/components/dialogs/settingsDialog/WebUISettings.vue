<template>
  <v-container>
    <v-checkbox
      :label="$t('preferences.display_speed_in_title')"
      :input-value="config.displaySpeedInTitle"
      @change="updateTitleSpeedConfig($event)"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Preferences} from '@/types'
import {Component} from 'vue-property-decorator'
import {mapGetters, mapMutations} from 'vuex'
import {Config} from '@/store/config'

@Component({
  components: {},
  computed: {
    ...mapGetters(['config']),
  },
  methods: {
    ...mapMutations([
      'updateConfig',
    ]),
  },
})

export default class WebUISettings extends Vue {
  preferences!: Preferences
  config!: Config

  private updateTitleSpeedConfig(event: boolean) {
    this.updateConfig({
      key: 'displaySpeedInTitle',
      value: event,
    })
    if(!event) {
      document.title = 'qBittorrent Web UI'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
