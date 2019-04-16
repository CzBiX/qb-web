<template>
  <div>
    <v-btn
      fab
      bottom
      color="primary"
      fixed
      right
      @click="dialog = !dialog"
      class="btn-add"
      :class="{'with-footer': $vuetify.breakpoint.smAndUp}"
    >
      <v-icon>mdi-link-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent width="50em">
      <v-card>
        <v-card-title
          class="headline grey lighten-4"
        >
          <v-icon class="mr-2">mdi-link-plus</v-icon>
          <span>Add Torrents</span>
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
                    label="URLs"
                    hint="One link per line"
                    prepend-icon="mdi-link"
                    :rules="[v => !!v || 'URLs is required']"
                    :rows="$vuetify.breakpoint.xsOnly ? 1 : 3"
                    required
                    autofocus
                    :value="params.urls"
                    @input="setParams('urls', $event)"
                  />
                </v-flex>
                <v-flex>
                  <v-combobox
                    label="Category"
                    prepend-icon="mdi-folder"
                    clearable
                    hide-no-data
                    :items="categories"
                    :value="params.category"
                    @input="setParams('category', $event)"
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
                    prepend-icon="mdi-progress-check"
                    label="Skip hash check"
                    :value="params.skip_checking"
                    @change="setParams('skip_checking', $event)"
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
import _ from 'lodash';
import Vue from 'vue';
import { mapState } from 'vuex';
import { api } from '../Api';

const defaultParams = {
  urls: null,
  category: null,
  paused: false,
  skip_checking: false,
};

export default Vue.extend({
  data() {
    return {
      dialog: false,
      valid: false,
      userParams: {},
      submitting: false,
    };
  },
  computed: {
    ...mapState({
      prefs: 'preferences',
      categories(state, getters) {
        return Object.keys(getters.torrentGroupByCategory).filter(_.identity);
      },
    }),
    params() {
      return Object.assign({}, defaultParams, this.userParams);
    },
    autoStart: {
      get(): boolean {
        return !this.params.paused;
      },
      set(value: boolean) {
        const paused = !value;
        const tmp = defaultParams.paused === paused ? null : paused;
        this.setParams('paused', tmp);
      },
    },
  },
  created() {
    defaultParams.paused = this.prefs.start_paused_enabled;
  },

  methods: {
    setParams(key: string, value: any){
      debugger;
      if (_.isNil(value)) {
        Vue.delete(this.userParams, key);
      } else {
        Vue.set(this.userParams, key, value);
      }
    },
    async submit() {
      if (this.submitting) {
        return;
      }

      this.submitting = true;
      const resp = await api.addTorrents(this.userParams);

      this.submitting = false;
      this.dialog = false;
      this.userParams.urls = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.btn-add.with-footer {
  margin-bottom: 36px;
}
</style>
