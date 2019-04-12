<template>
  <div>
    <v-btn
      fab
      bottom
      color="primary"
      fixed
      right
      :disabled="!prefs"
      @click="dialog = !dialog"
      class="btn-add"
      :class="{'with-footer': $vuetify.breakpoint.smAndUp}"
    >
      <v-icon>mdi-link-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent width="50em" v-if="prefs">
      <v-card>
        <v-card-title
          class="headline grey lighten-4"
        >
          <v-icon class="mr-2">mdi-link-plus</v-icon>
          <span>Add Torrents from URLs</span>
        </v-card-title>
        <v-card-text>
          <v-form
            v-model="valid"
          >
            <v-container pa-0 v-bind="{ [`grid-list-${$vuetify.breakpoint.name}`]: true }">
              <v-layout wrap>
                <v-flex xs12>
                  <v-textarea
                    name="urls"
                    v-model="params.urls"
                    label="URLs"
                    hint="One link per line"
                    prepend-icon="mdi-link"
                    :rules="[v => !!v || 'URLs is required']"
                    :rows="$vuetify.breakpoint.xsOnly ? 1 : 3"
                    required
                    autofocus
                  />
                </v-flex>
                <v-flex>
                  <v-checkbox
                    v-model="autoStart"
                    label="Start torrent"
                    prepend-icon="mdi-play-pause"
                  />
                </v-flex>
                <v-flex>
                  <v-checkbox
                    v-model="params.skip_checking"
                    prepend-icon="mdi-progress-check"
                    label="Skip hash check"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <!-- <v-btn flat>More</v-btn> -->
          <v-spacer />
          <v-btn flat @click="dialog = false">Cancel</v-btn>
          <v-btn
            flat
            @click="submit"
            color="primary"
            :disabled="!valid"
          >
            <v-progress-circular
              v-if="submitting"
              :indeterminate="true"
            />
            <template v-else>
              Submit
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import { api } from '../Api';

export default Vue.extend({
  data() {
    return {
      dialog: false,
      valid: false,
      params: {
        urls: null,
        paused: null,
        skip_checking: null,
      },
      submitting: false,
    };
  },
  computed: {
    ...mapState({
      prefs: 'preferences',
    }),
    autoStart: {
      get(): boolean {
        if (this.params.paused === null) {
          return !this.prefs.start_paused_enabled;
        }

        return !this.params.paused;
      },
      set(value: boolean) {
        this.params.paused = !value;
      },
    },
  },

  methods: {
    async submit() {
      if (this.submitting) {
        return;
      }

      this.submitting = true;
      const resp = await api.addTorrents(this.params);

      this.submitting = false;
      this.dialog = false;
      this.params.urls = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.btn-add.with-footer {
  margin-bottom: 36px;
}
</style>
