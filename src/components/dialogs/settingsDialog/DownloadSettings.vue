<template>
  <v-container>
    <h4>{{ $t('preferences.adding_torrent') }}</h4>
    <v-divider />
    <v-container
      class="px-0"
      fluid
    >
      <v-switch
        :input-value="preferences.create_subfolder_enabled"
        :label="$t('preferences.create_subfolder_enabled')"
        @change="changeSettings('create_subfolder_enabled', !preferences.create_subfolder_enabled)"
      />
      <v-switch
        :input-value="preferences.start_paused_enabled"
        :label="$t('preferences.start_paused_enabled')"
        @change="changeSettings('start_paused_enabled', !preferences.start_paused_enabled)"
      />
      <v-switch
        :input-value="preferences.auto_delete_mode"
        :label="$t('preferences.auto_delete_mode')"
        @change="changeSettings('auto_delete_mode', !preferences.auto_delete_mode)"
      />
    </v-container>
    <v-divider />
    <v-container
      class="px-0"
      fluid
    >
      <v-switch
        :input-value="preferences.preallocate_all"
        :label="$t('preferences.preallocate_all')"
        @change="changeSettings('preallocate_all', !preferences.preallocate_all)"
      />
      <v-switch
        :input-value="preferences.incomplete_files_ext"
        :label="$t('preferences.incomplete_files_ext')"
        @change="changeSettings('incomplete_files_ext', !preferences.incomplete_files_ext)"
      />
    </v-container>
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
export default class DownloadSettings extends Vue {
  preferences!: Preferences

  updatePreferencesRequest!: (_: any) => void

  changeSettings(property: string, value: string | boolean) {
    this.updatePreferencesRequest({[property]: value})
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

h4 {
  margin-top: 8px;
  padding-left: 4px
}

.v-input--switch {
  margin: 0
}

@include dialog-title;
</style>
