<template>
  <v-container>
    <h4>{{ $t("preferences.webui_remote_control") }}}</h4>
    <v-divider />
    <v-row
      dense
      align="center"
    >
      <v-col cols="2">
        <v-subheader>{{ $t("preferences.data_update_interval") }}</v-subheader>
      </v-col>
      <v-col cols="4">
        <v-text-field
          :value="config.updateInterval"
          type="number"
          lazy
          @change="updateConfig({key: 'updateInterval', value: $event})"
        />
      </v-col>
    </v-row>
    <v-row
      dense
      align="center"
    >
      <v-col cols="2">
        <v-subheader>{{ $t("preferences.ip_address") }}</v-subheader>
      </v-col>
      <v-col cols="4">
        <v-text-field
          :value="preferences.web_ui_address"
          @change="changeSettings('web_ui_address', $event)"
          lazy
        />
      </v-col>
      <v-col cols="1">
        <v-subheader>{{ $t("preferences.ip_port") }}</v-subheader>
      </v-col>
      <v-col cols="1">
        <v-text-field
          :value="preferences.web_ui_port"
          @change="changeSettings('web_ui_port', $event)"
          lazy
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-checkbox
          :label="$t('preferences.display_speed_in_title')"
          :input-value="config.displaySpeedInTitle"
          @change="updateTitleSpeedConfig($event)"
        />
      </v-col>
    </v-row>
    <h4>{{ $t("preferences.authentication") }}</h4>
    <v-divider />
    <preference-row i18n-key="web_ui_username">
      <v-text-field
        :value="preferences.web_ui_username"
        @change="changeSettings('web_ui_username', $event)"
        lazy
      />
    </preference-row>
    <preference-row i18n-key="web_ui_password">
      <v-text-field
        :value="preferences.web_ui_password"
        @change="changeSettings('web_ui_password', $event)"
        :placeholder="$t('preferences.new_password')"
        lazy
      />
    </preference-row>
    <v-alert
      color="blue"
      type="error"
      dense
    >
      <v-row
        dense
        align="center"
      >
        <v-col cols="auto">
          <v-subheader>{{ $t("preferences.web_ui_max_auth_fail_count") }}</v-subheader>
        </v-col>
        <v-col cols="1">
          <v-text-field
            :value="preferences.web_ui_max_auth_fail_count"
            @change="changeSettings('web_ui_max_auth_fail_count', $event)"
            lazy
          />
        </v-col>
        <v-col cols="auto">
          <v-subheader>{{ $t("preferences.web_ui_ban_duration") }}</v-subheader>
        </v-col>
        <v-col cols="1">
          <v-text-field
            :value="preferences.web_ui_ban_duration"
            @change="changeSettings('web_ui_ban_duration', $event)"
            lazy
          />
        </v-col>
        <v-col cols="1">
          {{ $t("preferences.web_ui_seconds") }}
        </v-col>
      </v-row>
    </v-alert>
    <v-row dense>
      <v-col>
        <v-checkbox
          :input-value="preferences.bypass_auth_subnet_whitelist_enabled"
          :label="$t('preferences.bypass_auth_subnet_whitelist')"
          @change="changeSettings('bypass_auth_subnet_whitelist_enabled', $event)"
        />
      </v-col>
      <v-col>
        <v-checkbox
          :input-value="preferences.bypass_local_auth"
          :label="$t('preferences.bypass_local_auth')"
          @change="changeSettings('bypass_local_auth', $event)"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="4">
        <v-textarea
          :value="preferences.bypass_auth_subnet_whitelist"
          @change="changeSettings('bypass_auth_subnet_whitelist', $event)"
          lazy
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import {Preferences} from '@/types'
import {Component} from 'vue-property-decorator'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import {Config} from '@/store/config'
import { ConfigPayload } from '@/store/types';
import PreferenceRow from '@/components/dialogs/settingsDialog/PreferenceRow.vue'

@Component({
  components: {PreferenceRow},
  computed: {
    ...mapGetters({
      config: 'config',
      preferences: 'allPreferences',
    }),
  },
  methods: {
    ...mapMutations([
      'updateConfig',
    ]),
    ...mapActions({
      updatePreferencesRequest: 'updatePreferencesRequest',
    }),
  },
})
export default class WebUISettings extends Vue {
  preferences!: Preferences
  config!: Config

  updateConfig!: (_: ConfigPayload) => void
  updatePreferencesRequest!: (_: any) => void

  changeSettings(property: string, value: string | boolean) {
    this.updatePreferencesRequest({[property]: value})
  }

  updateTitleSpeedConfig(event: boolean) {
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
