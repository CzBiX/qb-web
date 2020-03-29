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
          <span>{{ $t('title.add_torrents') }}</span>
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
                    :label="$t('files')"
                  />
                  <v-textarea
                    v-show="!files.length"
                    label="URL"
                    :hint="$t('dialog.add_torrents.hint')"
                    :placeholder="$t('dialog.add_torrents.placeholder')"
                    prepend-icon="mdi-link"
                    append-outer-icon="mdi-attachment"
                    :rules="[v => (!!files.length || !!v || $t('msg.item_is_required', { item: 'URL' }))]"
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
                      :label="$t('category', 1)"
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
                      :label="$t('label.create_subfolder')"
                      :input-value="true"
                      @change="setParams('root_path', $event)"
                    />
                  </v-col>
                </template>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="autoStart"
                    :label="$t('label.start_torrent')"
                    prepend-icon="mdi-play-pause"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    prepend-icon="mdi-progress-check"
                    :label="$t('label.skip_hash_check')"
                    :input-value="params.skip_checking"
                    @change="setParams('skip_checking', $event)"
                  />
                </v-col>
                <template v-if="showMore">
                  <v-col cols="12" sm="6">
                    <v-checkbox
                      :label="$t('label.in_sequential_order')"
                      prepend-icon="mdi-sort-descending"
                      :ipnut-value="params.sequentialDownload"
                      @change="setParams('sequentialDownload', $event.value)"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-checkbox
                      prepend-icon="mdi-ray-start-end"
                      :label="$t('label.first_and_last_pieces_first')"
                      :input-value="params.firstLastPiecePrio"
                      @change="setParams('firstLastPiecePrio', $event)"
                    />
                  </v-col>
                </template>
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
          <v-btn text @click="showMore = !showMore" v-text="showMore ? $t('less') : $t('more')" />
          <v-spacer />
          <v-btn text @click="dialog = false">{{ $t('cancel') }}</v-btn>
          <v-btn
            text
            @click="submit"
            color="primary"
            :disabled="!valid"
            :loading="submitting"
          >
            {{ $t('submit') }}
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

import { tr } from '@/locale';
import api from '../Api';
import Component from 'vue-class-component';
import { Watch } from 'vue-property-decorator';

const defaultParams = {
  urls: null,
  category: null,
  paused: false,
  skip_checking: false,
  root_path: false,
  sequentialDownload: false,
  firstLastPiecePrio: false,
};

@Component({
  computed: {
    ...mapState({
      pasteUrl: 'pasteUrl',
      prefs: 'preferences',
    }),
    ...mapState({
      categories(state, getters) {
        return getters.allCategories.map((c: any) => ({ text: c.name, value: c.key }));
      },
    }),
  },
})
export default class AddForm extends Vue {
  dialog = false
  valid = false
  files: FileList | [] = []
  userParams = {}
  error: string | null = null
  submitting = false
  showMore = false

  pasteUrl!: string | null
  prefs!: any
  $refs!: {
    form: any,
    file: any,
    fileZone: HTMLElement,
  }
  
  get params() {
    return Object.assign({}, defaultParams, this.userParams);
  }
  get phoneLayout() {
    return this.$vuetify.breakpoint.xsOnly;
  }

  get autoStart() {
    return !this.params.paused;
  }

  set autoStart(value: boolean) {
    const paused = !value;
    const tmp = defaultParams.paused === paused ? null : paused;
    this.setParams('paused', tmp);
  }

  created() {
    defaultParams.paused = this.prefs.start_paused_enabled;
    defaultParams.root_path = this.prefs.create_subfolder_enabled;
    this.showMore = !this.phoneLayout;
  }

  mounted() {
    this.$refs.fileZone.addEventListener('drop', this.onDrop, true);
  }

  beforeDestroy() {
    this.$refs.fileZone.removeEventListener('drop', this.onDrop, true);
  }

  setParams(key: string, value: any) {
    if (_.isNil(value)) {
      Vue.delete(this.userParams, key);
    } else {
      Vue.set(this.userParams, key, value);
    }
  }

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
  }

  selectFiles() {
    const input = this.$refs.file.$el.querySelector('input[type=file]');
    input.click();
  }

  onDrop(e: DragEvent) {
    const transfer = e.dataTransfer!;
    const { files } = transfer;
    if (!files.length) {
      return;
    }

    e.preventDefault();
    this.files = files;
  }

  @Watch('pasteUrl')
  onPasteUrl(v: string) {
    if (!v) {
      return;
    }

    if (!this.dialog) {
      Vue.set(this.userParams, 'urls', v);
      this.dialog = true;
    }
  }

  @Watch('files')
  onFilesChange(v: FileList) {
    this.$refs.form.validate();
  }
}
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
