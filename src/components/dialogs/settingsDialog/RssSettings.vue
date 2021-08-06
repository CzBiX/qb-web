<template>
  <v-container>
    <v-switch
      :input-value="preferences.rss_processing_enabled"
      :label="$t('preferences.rss_processing_enabled')"
      @change="changeSettings('rss_processing_enabled', !preferences.rss_processing_enabled)"
    />
    <v-switch
      :input-value="preferences.rss_auto_downloading_enabled"
      :label="$t('preferences.rss_auto_downloading_enabled')"
      @change="changeSettings('rss_auto_downloading_enabled', !preferences.rss_auto_downloading_enabled)"
    />
    <v-text-field
      suffix="min"
      type="number"
      :value="preferences.rss_refresh_interval"
      :label="$t('preferences.rss_refresh_interval')"
      @change="changeSettings('rss_refresh_interval', $event)"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Preferences} from '@/types'
import {Component} from 'vue-property-decorator'
import {mapActions, mapGetters} from 'vuex'

@Component({
  components: {},
  computed: {
    ...mapGetters({
      preferences: 'allPreferences',
    }),
  },
  methods: {
    ...mapActions({
      updatePreferencesRequest: 'updatePreferencesRequest',
    }),
  },
})
export default class SpeedSettings extends Vue {
  preferences!: Preferences

  updatePreferencesRequest!: (_: any) => void

  changeSettings(property: string, value: string | boolean | number) {
    this.updatePreferencesRequest({[property]: value})
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

.v-input--switch {
  margin: 0
}

@include dialog-title;
</style>
