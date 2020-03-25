<template>
  <div class="torrent-content">
    <v-treeview
      open-on-click
      :items="fileTree"
    >
      <template v-slot:prepend="row">
        <v-icon v-text="getRowIcon(row)" />
      </template>
      <template v-slot:append="row">
        <span>
          [{{ getTotalSize(row.item) | size }}]
        </span>
        <span class="progress">
          {{ getTotalProgress(row.item) | progress }}
        </span>
      </template>
    </v-treeview>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import api from '../../Api';
import Taskable from '@/mixins/taskable';

/* eslint-disable camelcase */
interface File {
  name: string;
  size: number;
  progress: number;
  priority: number;
  is_seed: boolean;
  piece_range: Array<number>;
  availability: number;
}
/* eslint-disable camelcase */

interface TreeItem {
  name: string;
  item?: File;
  children?: Array<TreeItem>;
}

interface Data {
  files: Array<File>;
}

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
    getRowIcon(row: any) {
      if (row.item.item) {
        return 'mdi-file';
      }

      return row.open ? 'mdi-folder-open' : 'mdi-folder';
    },
    getTotalSize(item: TreeItem) {
      if (item.item) {
        return item.item.size;
      }

      let size = 0;
      for (const child of item.children!) {
        size += this.getTotalSize(child);
      }

      return size;
    },
    getTotalProgress(item: TreeItem) {
      if (item.item) {
        return item.item.progress;
      }

      let count = 0;
      let progress = 0;
      for (const child of item.children!) {
        count++;
        progress += this.getTotalProgress(child);
      }

      if (count === 0) {
        return 1;
      }

      return progress / count;
    },
    getFileFolder(item: File, start: number) {
      const { name } = item;
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

      const entries = _.groupBy(files, item => this.getFileFolder(item, start));

      const result = [];
      for (const [folder, values] of _.entries(entries)) {
        if (folder !== FILE_KEY) {
          const subTree = this.buildTree(values, start + folder.length + 1);
          result.push({
            name: folder,
            children: subTree,
          });
          continue;
        }

        for (const item of values) {
          result.push({
            name: item.name.substring(start),
            item,
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

.progress {
  display: inline-block;
  width: 3em;
}
</style>
