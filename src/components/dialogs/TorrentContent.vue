<template>
  <div class="torrent-content">
    <v-treeview
      open-on-click
      :items="fileTree"
      :value="selected"
      selectable
      @input="selectChanged"
    >
      <template v-slot:prepend="row">
        <v-icon v-text="getRowIcon(row)" />
      </template>
      <template v-slot:append="row">
        <span>
          [{{ row.item.size | size }}]
        </span>
        <span class="progress">
          {{ row.item.progress | progress }}
        </span>
      </template>
    </v-treeview>
  </div>
</template>

<script lang="ts">
import { groupBy, xor, sumBy } from 'lodash';
import api from '../../Api';
import BaseTorrentInfo from './baseTorrentInfo'
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

enum EFilePriority {
  notDownload = 0,
  normal = 1,
  high = 6,
  maximal = 7
}

/* eslint-disable camelcase */
interface File {
  id: number;
  name: string;
  size: number;
  progress: number;
  priority: EFilePriority;
  is_seed: boolean;
  piece_range: Array<number>;
  availability: number;
}
/* eslint-disable camelcase */

interface TreeItem {
  id: number;
  name: string;
  item?: File;
  children?: Array<TreeItem>;
  size: number;
  progress: number;
}

interface Data {
  files: Array<File>;
}

const FILE_KEY = '/FILE/';

const UNWANTED_FILE = '.unwanted';

@Component
export default class TorrentContent extends BaseTorrentInfo {
  @Prop(String)
  readonly hash!: string

  files: File[] = []
  folderIndex!: number

  get fileTree(): TreeItem[] {
    return this.buildTree(this.files, 0);
  }

  get selected(): number[] {
    const list: number[] = [];

    this.files.forEach((item, index) => {
      if(item.priority !== EFilePriority.notDownload) {
        list.push(index);
      }
    })

    return list;
  }

  async getFiles() {
    const files = (await api.getTorrentFiles(this.hash) as File[])
      .sort((a, b) => a.name.localeCompare(b.name))
    files.forEach((v, i) => v.id = i)

    this.files = files
    this.folderIndex = 0
  }

  getRowIcon(row: any) {
    if (row.item.item) {
      return 'mdi-file';
    }

    return row.open ? 'mdi-folder-open' : 'mdi-folder';
  }

  selectChanged(items: Array<number>) {
    const previous = this.selected;
    const diff = xor(previous, items);

    if(diff.length == 0) return;

    api.setTorrentFilePriority(this.hash, diff, items.length > previous.length ?
      EFilePriority.normal : EFilePriority.notDownload);
  }

  getFileFolder(item: File, start: number) {
    const { name } = item;
    const index = name.indexOf('/', start);
    if (index === -1) {
      return FILE_KEY;
    }

    return name.substring(start, index);
  }

  buildTree(files: Array<File>, start: number): TreeItem[] {
    if (!files.length) {
      return [];
    }

    const entries = groupBy(files, item => this.getFileFolder(item, start));

    const result = [];
    for (const [folder, values] of Object.entries(entries)) {
      // Push .unwanted file to current folder, just like original web ui
      if(folder === UNWANTED_FILE) {
        for (const item of values) {
          result.push({
            id: item.id,
            name: item.name.substring(start + folder.length + 1),
            item,
            size: item.size,
            progress: item.progress,
          });
        }
        continue;
      }

      if (folder !== FILE_KEY) {
        const subTree = this.buildTree(values, start + folder.length + 1);
        // Offset folder id to making sure it will not influence array content
        result.push({
          id: this.files.length + this.folderIndex++,
          name: folder,
          children: subTree,
          size: sumBy(subTree, 'size'),
          progress: sumBy(subTree, 'progress') / subTree.length,
        });
        continue;
      }

      for (const item of values) {
        result.push({
          id: item.id,
          name: item.name.substring(start),
          item,
          size: item.size,
          progress: item.progress,
        });
      }
    }

    return result;
  }

  fetchInfo() {
    return this.getFiles()
  }
}
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
