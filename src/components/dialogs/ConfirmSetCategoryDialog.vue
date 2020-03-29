<template>
  <v-dialog :value="true" @input="closeDialog" :fullscreen="phoneLayout" width="40em">
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-folder</v-icon>
        <span>{{ $t('title.set_category') }}</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <template v-if="category">
          {{ $t('dialog.set_category.move', { category }) }}
        </template>
        <template v-else>
          {{ $t('dialog.set_category.reset') }}
        </template>
        <ol class="torrents pt-6">
          <li v-for="(row, i) in torrents" :key="i">
            {{ row.name }}
          </li>
        </ol>

        <v-checkbox
          v-if="sameNamedTorrents.length > 0"
          v-model="moveSameNamed"
          prepend-icon="mdi-file-multiple"
          class="mt-0"
          :label="$t('dialog.set_category.also.move_same_name_torrents', sameNamedTorrents.length)"
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
          {{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import { mapGetters } from 'vuex';

import api from '@/Api';
import { findSameNamedTorrents } from '@/utils';
import Component from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';
import { Torrent } from '../../types';

@Component({
  computed: {
    ...mapGetters(['allTorrents']),
  },
})
export default class ConfirmSetCategoryDialog extends Vue {
  @Prop(Array)
  readonly value!: Torrent[]

  @Prop(String)
  readonly category!: string

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

    let torrentsToMove;
    if (this.moveSameNamed) {
      torrentsToMove = this.torrents.concat(this.sameNamedTorrents);
    } else {
      torrentsToMove = this.torrents;
    }
    const hashes = torrentsToMove.map((t: any) => t.hash);
    await api.setTorrentsCategory(hashes, this.category);

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
