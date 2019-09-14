<template>
  <div class="torrent-content">
    <v-treeview
      open-on-click
      :items="fileTree"
    >
      <template v-slot:prepend="item">
        <v-icon v-text="getItemIcon(item)" />
      </template>
    </v-treeview>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import api from '../../Api';
import Taskable from '@/mixins/taskable';

interface File {
  name: string;
  size: number;
  progress: number;
  priority: number;
  is_seed: boolean;
  piece_range: Array<number>;
  availability: number;
};

interface TreeItem {
  name: string;
  item?: File;
  children?: Array<TreeItem>;
}

interface Data {
  files: Array<File>;
};

const FILE_KEY = '/FILE/';

export default Vue.extend({
  mixins: [Taskable],

  props: {
    hash: String,
    isActive: Boolean,
  },
  data(): Data {
    return {
      files: [],
    };
  },
  computed: {
    fileTree() {
      return this.buildTree(this.files, 0);
    },
  },
  methods: {
    async getFiles() {
      this.files = await api.getTorrentFiles(this.hash);
      if (!this.isActive || this.destroy) {
        return;
      }

      this.task = setTimeout(this.getFiles, 5000);
    },
    getItemIcon(item: any) {
      if (item.item.item) {
        return 'mdi-file';
      }

      return item.open ? 'mdi-folder-open' : 'mdi-folder';
    },
    getFileFolder(item: File, start: number) {
      const name = item.name;
      const index = name.indexOf('/', start);
      if (index === -1) {
        return FILE_KEY;
      }

      return name.substring(start, index);
    },
    buildTree(files: Array<File>, start: number): Array<TreeItem> {
      if (!files.length) {
        return [];
      }

      const entries = _.groupBy(files, (item) => this.getFileFolder(item, start));

      const result = [];
      for (const [folder, values] of _.entries(entries)) {
        if (folder !== FILE_KEY) {
          const subTree = this.buildTree(values, start + folder.length + 1);
          result.push({
            name: folder,
            children: subTree,
          })
          continue;
        }

        for (const item of values) {
          result.push({
            name: item.name.substring(start),
            item: item,
          });
        }
      }

      return result;
    },
  },
  async created() {
    if (this.isActive) {
      await this.getFiles();
    }
  },
  watch: {
    async isActive(v) {
      if (v) {
        await this.getFiles();
      } else {
        this.cancelTask();
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.torrent-content {
  ::v-deep .v-treeview-node__root {
    min-height: 0;
  }
}
</style>