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
            ref="form"
          >
            <v-container pa-0 v-bind="{ [`grid-list-${$vuetify.breakpoint.name}`]: true }">
              <v-layout wrap>
                <v-flex
                  xs12
                  ref="fileZone"
                >
                  <div
                    v-show="files.length"
                    class="files grey lighten-4 align-center justify-space-between subheading font-weight-medium pl-2"
                    @click="selectFiles"
                  >
                    <input ref="file" type="file" multiple class="d-none" @change="onFilesChanged">
                    <span v-if="files.length == 1">Selected file: {{ files[0].name }}</span>
                    <span v-else>Selected {{ files.length }} files.</span>
                    <v-btn icon @click.stop="files = []">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                  <v-textarea
                    v-show="!files.length"
                    label="URLs"
                    hint="One link per line"
                    :placeholder="'Upload torrents by drop them here,\nor click attachment button at right to select.'"
                    prepend-icon="mdi-link"
                    append-outer-icon="mdi-attachment"
                    :rules="[v => (!!files.length || !!v || 'URLs is required')]"
                    :rows="$vuetify.breakpoint.xsOnly ? 1 : 3"
                    required
                    autofocus
                    :value="params.urls"
                    @input="setParams('urls', $event)"
                    @click:append-outer="selectFiles"
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
          <v-alert
            type="warning"
            :value="error"
            v-text="error"
          />
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
            :loading="submitting"
          >
            Submit
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
  props: {
    url: String,
  },

  data() {
    return {
      dialog: false,
      valid: false,
      files: [],
      userParams: {},
      error: null,
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
  mounted() {
    this.$refs.fileZone.addEventListener('drop', this.onDrop, true);
  },
  beforeDestroy() {
    this.$refs.fileZone.removeEventListener('drop', this.onDrop, true);
  },

  methods: {
    setParams(key: string, value: any){
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
      this.error = null;
      const files = this.files.length ? this.files : null;

      try {
        const resp = await api.addTorrents(this.userParams, files);

        if (resp !== 'Ok.') {
          this.error = resp;
        }
      } catch (e) {
        this.error = e.message
      }

      this.submitting = false;

      if (this.error) {
        return;
      }

      this.dialog = false;

      this.userParams.urls = null;
      this.files = [];

      this.$refs.form.resetValidation();
    },
    selectFiles() {
      this.$refs.file.click();
    },
    onFilesChanged() {
      this.files = this.$refs.file.files;
    },
    onDrop(e: DragEvent) {
      const transfer = e.dataTransfer!;
      const files = transfer.files;
      if (!files.length) {
        return;
      }

      e.preventDefault();
      this.files = files;
    },
  },

  watch: {
    url(v) {
      if (!v) {
        return;
      }

      if (!this.dialog) {
        Vue.set(this.userParams, 'urls', v);
        this.dialog = true;
      }

      this.$emit('input', null);
    },
    files(v) {
      this.$refs.form.validate();
    },
  },
});
</script>

<style lang="scss" scoped>
.btn-add.with-footer {
  margin-bottom: 36px;
}

.files {
  display: flex;
  height: 3em;

  border: 1px dashed;
  border-color: grey !important;
  border-radius: 2px;
}
</style>
