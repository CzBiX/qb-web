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
    <v-dialog
      v-model="dialog"
      eager
      persistent
      width="40em"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-4"
        >
          <v-icon class="mr-2">mdi-link-plus</v-icon>
          <span>Add Torrents</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form
            v-model="valid"
            ref="form"
          >
            <v-container>
              <v-row no-gutters>
                <v-col
                  ref="fileZone"
                >
                  <v-file-input
                    v-show="files.length"
                    v-model="files"
                    ref="file"
                    multiple
                    chips
                    outlined
                    label="Files"
                  />
                  <v-textarea
                    v-show="!files.length"
                    label="URLs"
                    hint="One link per line"
                    :placeholder="placeholder"
                    prepend-icon="mdi-link"
                    append-outer-icon="mdi-attachment"
                    :rules="[v => (!!files.length || !!v || 'URLs is required')]"
                    :rows="$vuetify.breakpoint.xsOnly ? 1 : 3"
                    required
                    :autofocus="!phoneLayout"
                    :value="params.urls"
                    @input="setParams('urls', $event)"
                    @click:append-outer="selectFiles"
                  />
                </v-col>
              </v-row>
              <v-row no-gutters>
                <template v-if="showMore">
                  <v-col cols="12" sm="6">
                    <v-combobox
                      label="Category"
                      prepend-icon="mdi-folder"
                      clearable
                      hide-no-data
                      :items="categories"
                      :value="params.category"
                      @input="setParams('category', $event.value)"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-checkbox
                      prepend-icon="mdi-file-tree"
                      label="Create subfolder"
                      :input-value="true"
                      @change="setParams('root_path', $event)"
                    />
                  </v-col>
                </template>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="autoStart"
                    label="Start torrent"
                    prepend-icon="mdi-play-pause"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    prepend-icon="mdi-progress-check"
                    label="Skip hash check"
                    :input-value="params.skip_checking"
                    @change="setParams('skip_checking', $event)"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-alert
            type="warning"
            :value="error"
            v-text="error"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showMore = !showMore" v-text="showMore ? 'Less' : 'More'" />
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn
            text
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
import api from '../Api';

const defaultParams = {
  urls: null,
  category: null,
  paused: false,
  skip_checking: false,
  root_path: false,
};

export default Vue.extend({
  data() {
    return {
      placeholder: 'Upload torrents by drop them here,\nor click attachment button at right to select.',
      dialog: false,
      valid: false,
      files: [],
      userParams: {},
      error: null,
      submitting: false,
      showMore: false,
    };
  },
  computed: {
    ...mapState({
      pasteUrl: 'pasteUrl',
      prefs: 'preferences',
    }),
    ...mapState({
      categories(state, getters) {
        return getters.allCategories.map(c => ({ text: c.name, value: c.key }));
      },
    }),
    params() {
      return Object.assign({}, defaultParams, this.userParams);
    },
    phoneLayout() {
      return this.$vuetify.breakpoint.xsOnly;
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
    defaultParams.root_path = this.prefs.create_subfolder_enabled;
    this.showMore = !this.phoneLayout;
  },
  mounted() {
    (this.$refs.fileZone as HTMLElement).addEventListener('drop', this.onDrop, true);
  },
  beforeDestroy() {
    (this.$refs.fileZone as HTMLElement).removeEventListener('drop', this.onDrop, true);
  },

  methods: {
    setParams(key: string, value: any) {
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
      let files;
      if (this.files.length) {
        ({ files } = this);
        Vue.delete(this.userParams, 'urls');
      } else {
        files = null;
      }

      try {
        const resp = await api.addTorrents(this.userParams, files);

        if (resp !== 'Ok.') {
          this.error = resp;
        }
      } catch (e) {
        this.error = e.message;
      }

      this.submitting = false;

      if (this.error) {
        return;
      }

      this.dialog = false;

      Vue.delete(this.userParams, 'urls');
      this.files = [];

      this.$refs.form.resetValidation();
    },
    selectFiles() {
      const input = this.$refs.file.$el.querySelector('input[type=file]');
      input.click();
    },
    onDrop(e: DragEvent) {
      const transfer = e.dataTransfer!;
      const { files } = transfer;
      if (!files.length) {
        return;
      }

      e.preventDefault();
      this.files = files;
    },
  },

  watch: {
    pasteUrl(v) {
      if (!v) {
        return;
      }

      if (!this.dialog) {
        Vue.set(this.userParams, 'urls', v);
        this.dialog = true;
      }
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

.container {
  padding: 12px 0 0;

  .col {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
