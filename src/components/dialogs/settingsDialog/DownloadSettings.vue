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
    <h4>{{ $t('preferences.saving_management') }}</h4>
    <v-divider />
    <v-container
      class="px-0"
      fluid
    >
      <preference-row i18n-key="auto_tmm_enabled">
        <v-select
          :items="torrentMode"
          :value="preferences.auto_tmm_enabled ? torrentMode[0] : torrentMode[1]"
          @change="changeSettings('auto_tmm_enabled', $event == torrentMode[0])"
        />
      </preference-row>
      <preference-row i18n-key="torrent_changed_tmm_enabled">
        <v-select
          :items="torrentAction"
          :value="preferences.category_changed_tmm_enabled ? torrentAction[1] : torrentAction[0]"
          @change="changeSettings('torrent_changed_tmm_enabled', $event == torrentAction[1])"
        />
      </preference-row>
      <preference-row i18n-key="save_path_changed_tmm_enabled">
        <v-select
          :items="torrentAction"
          :value="preferences.category_changed_tmm_enabled ? torrentAction[1] : torrentAction[0]"
          @change="changeSettings('save_path_changed_tmm_enabled', $event == torrentAction[1])"
        />
      </preference-row>
      <preference-row i18n-key="category_changed_tmm_enabled">
        <v-select
          :items="torrentAction"
          :value="preferences.category_changed_tmm_enabled ? torrentAction[1] : torrentAction[0]"
          @change="changeSettings('category_changed_tmm_enabled', $event == torrentAction[1])"
        />
      </preference-row>
      <preference-row i18n-key="save_path">
        <v-text-field
          :value="preferences.save_path"
          @change="changeSettings('save_path', $event)"
          lazy
        />
      </preference-row>
      <preference-row i18n-key="temp_path">
        <template v-slot:header>
          <v-checkbox
            :value="preferences.temp_path_enabled"
            @change="changeSettings('temp_path_enabled', $event)"
          />
        </template>
        <v-text-field
          :disabled="!preferences.temp_path_enabled"
          :value="preferences.temp_path"
          @change="changeSettings('temp_path', $event)"
          lazy
        />
      </preference-row>
      <preference-row
        i18n-key="export_dir"
        can-be-enabled="true"
      >
        <v-text-field
          :value="preferences.export_dir"
          @change="changeSettings('export_dir', $event)"
          lazy
          clearable
        />
      </preference-row>
      <preference-row
        i18n-key="export_dir_fin"
        can-be-enabled="true"
      >
        <v-text-field
          :value="preferences.export_dir_fin"
          @change="changeSettings('export_dir_fin', $event)"
          lazy
          clearable
        />
      </preference-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Preferences} from '@/types'
import {Component} from 'vue-property-decorator'
import {mapActions, mapGetters} from 'vuex'
import PreferenceRow from './PreferenceRow.vue'
import { tr } from '@/locale'

@Component({
  components: {
    PreferenceRow,
  },
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
  torrentAction = [tr('preferences.switch_torrent_mode_to_manual'), tr('preferences.move_affected_torrent')]
  torrentMode = [tr('preferences.auto_mode'), tr('preferences.manual_mode')]

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
