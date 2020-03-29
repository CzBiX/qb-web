<template>
  <v-dialog :value="true" @input="closeDialog" :fullscreen="phoneLayout" width="40em">
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-delete</v-icon>
        <span>{{ $t('title.delete_torrents') }}</span>
      </v-card-title>
      <v-card-text class="pb-0">
        {{ $t('dialog.delete_torrents.msg') }}
        <ol class="torrents pt-6">
          <li v-for="(row, i) in torrents" :key="i">
            {{ row.name }}
          </li>
        </ol>

        <v-checkbox
          v-model="deleteFiles"
          prepend-icon="mdi-file-cancel"
          :label="$t('label.also_delete_files')"
        />
        <v-checkbox
          v-if="sameNamedTorrents.length > 0"
          v-model="deleteSameNamed"
          prepend-icon="mdi-file-multiple"
          class="mt-0"
          :label="$t('dialog.delete_torrents', sameNamedTorrents.length)"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">{{ $t('cancel') }}</v-btn>
        <v-btn
          @click="submit"
          color="warning"
          :disabled="submitting"
          :loading="submitting"
        >
          {{ $t('delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

import api from '@/Api';
import { findSameNamedTorrents } from '@/utils';
import { Torrent } from '../../types';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';

@Component({
  computed: {
    ...mapGetters(['allTorrents']),
  },
})
export default class ConfirmDeleteDialog extends Vue {
  @Prop(Array)
  readonly value!: Torrent[]

  deleteFiles = false
  deleteSameNamed = false
  moveSameNamed = false
  submitting = false
  torrents: Torrent[] = []
  sameNamedTorrents: Torrent[] = []

  allTorrents!: Torrent[]

  created() {
    this.torrents = this.value;
    this.sameNamedTorrents = findSameNamedTorrents(this.allTorrents, this.torrents);
  }

  get phoneLayout() {
    return this.$vuetify.breakpoint.xsOnly;
  }

  @Emit('input')
  closeDialog() {
    return []
  }

  async submit() {
    if (this.submitting) {
      return;
    }

    this.submitting = true;

    let torrentsToDelete;
    if (this.deleteSameNamed) {
      torrentsToDelete = this.torrents.concat(this.sameNamedTorrents);
    } else {
      torrentsToDelete = this.torrents;
    }
    const hashes = torrentsToDelete.map((t: any) => t.hash);
    await api.deleteTorrents(hashes, this.deleteFiles);

    this.closeDialog();
  }
}
</script>

<style lang="scss" scoped>
.torrents {
  overflow: auto;
}
.v-dialog--fullscreen {
  .v-card__text {
    padding-bottom: 52px;
  }

  .v-card__actions {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
