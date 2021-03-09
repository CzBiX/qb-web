<template>
  <v-container>
    <v-container
      fluid
    >
      <v-container>
        <v-row justify="center">
          <v-col
            cols="12"
            md="4"
          >
            <h4> {{ $t('preferences.global_rate_limits') }}</h4>
            <v-text-field
              @change="changeSettings('dl_limit', convertToBytes($event))"
              :label="$t('preferences.dl_limit')"
              :placeholder="convertToKB(preferences.dl_limit)"
              lazy
            />
            <v-text-field
              @change="changeSettings('up_limit', convertToBytes($event))"
              :label="$t('preferences.up_limit')"
              :placeholder="convertToKB(preferences.up_limit)"
              lazy
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <h4> {{ $t('preferences.alternate_rate_limits') }}</h4>
            <v-text-field
              type="number"
              @change="changeSettings('alt_dl_limit', convertToBytes($event))"
              :label="$t('preferences.dl_limit')"
              :placeholder="convertToKB(preferences.alt_dl_limit)"
              lazy
            />
            <v-text-field
              type="number"
              @change="changeSettings('alt_up_limit', convertToBytes($event))"
              :label="$t('preferences.up_limit')"
              :placeholder="convertToKB(preferences.alt_up_limit)"
              lazy
            />
            <v-checkbox
              :label="$t('preferences.alternate_schedule_enable_time')"
              @change="changeSettings('scheduler_enabled', $event)"
              :input-value="preferences.scheduler_enabled"
            />
          </v-col>
        </v-row>
        <v-row
          v-if="preferences.scheduler_enabled"
          class="justify-center"
        >
          <v-col
            cols="auto"
          >
            <v-time-picker
              :value="preferences.schedule_from_hour + ':' + preferences.schedule_from_min"
              color="green lighten-1"
              format="24hr"
              header-color="primary"
              @input="updateSchedulerFrom($event)"
            />
          </v-col>
          <v-col
            cols="auto"
          >
            <v-time-picker
              :value="preferences.schedule_to_hour + ':' + preferences.schedule_to_min"
              color="green lighten-1"
              format="24hr"
              @input="updateSchedulerTo($event)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-container>
    <v-container
      class="px-0"
      fluid
    >
      <v-switch
        :input-value="preferences.limit_utp_rate"
        :label="$t('preferences.limit_utp_rate')"
        @change="changeSettings('limit_utp_rate', !preferences.limit_utp_rate)"
      />
      <v-switch
        :input-value="preferences.limit_tcp_overhead"
        :label="$t('preferences.limit_tcp_overhead')"
        @change="changeSettings('limit_tcp_overhead', !preferences.limit_tcp_overhead)"
      />
      <v-switch
        :input-value="preferences.limit_lan_peers"
        :label="$t('preferences.limit_lan_peers')"
        @change="changeSettings('limit_lan_peers', !preferences.limit_lan_peers)"
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
    convertToKB(value: number): string {
      return (value / 1024).toString()
    },
    convertToBytes(value: number): number {
      return value * 1024
    },
  },
})
export default class SpeedSettings extends Vue {
  preferences!: Preferences

  updatePreferencesRequest!: (_: any) => void

  changeSettings(property: string, value: string | boolean | number) {
    this.updatePreferencesRequest({[property]: value})
  }

  updateSchedulerFrom(event: string) {
    const strings = event.split(':')
    this.updatePreferencesRequest({'schedule_from_hour': strings[0], 'schedule_from_min': strings[1]})
  }

  updateSchedulerTo(event: string) {
    const strings = event.split(':')
    this.updatePreferencesRequest({'schedule_to_hour': strings[0], 'schedule_to_min': strings[1]})
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
