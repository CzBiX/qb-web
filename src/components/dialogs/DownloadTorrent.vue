<template>
  <v-dialog
    :v-model="open"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ torrent.fileName }}</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-textarea
            :value="torrent.fileUrl"
            :readonly="true"
            label="File Url"
          />

          <v-text-field
            label="Save location"
            :value="savePath"
            required
          />

          <v-select
            v-model="category"
            :items="allCategories"
            :clearable="true"
            item-text="name"
            label="Categories"
          />

          <v-text-field
            label="Rename torrent"
            :value="renameTorrent"
          />

          <v-text-field
            label="Cookie"
            :value="cookie"
          />

          <v-switch
            label="Start torrent"
            :value="startTorrent"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { mapGetters } from 'vuex';
import { SearchTaskTorrent } from '@/types';
import { Prop } from 'vue-property-decorator';

@Component({
  computed: {
    ...mapGetters([
      'allCategories',
      'savePath'
    ]),
  },
})
export default class DownloadTorrent extends Vue {
  @Prop(Boolean)
  open = false;

  @Prop()
  torrent!: SearchTaskTorrent;

  allCategories!: any;
  savePath!: string;

  category = '';
  renameTorrent = '';
  cookie = '';

  startTorrent = true;
  skipHashCheck = false;
  createSubFolder = true;

  downloadInSequentialOrder = false;
  downloadFirstAndLastPieces = false;

  limitDownloadRate = 0;
  limitUploadRate = 0;
}
</script>
