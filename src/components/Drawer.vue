<template>
  <v-list
    dense
    expand
    class="drawer"
  >
    <template v-for="item in items">
      <v-list-group
        v-if="item.children"
        :key="item.title"
        v-model="item.model"
        :prepend-icon="item.model ? item.icon : item['icon-alt']"
        append-icon=""
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(child, i) in item.children"
          :key="i"
          @click="item.click ? item.click(child.value) : null"
        >
          <v-list-item-icon v-if="child.icon">
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ child.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <template v-else-if="item.filterGroups">
        <filter-group
          v-for="(child, i) in item.filterGroups"
          :key="i"
          :group="child"
        />
      </template>
      <v-list-item
        v-else
        :key="item.title"
        @click="item.click ? item.click() : null"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script lang="ts">
import { sortBy, sumBy, isUndefined } from 'lodash';
import Vue from 'vue';
import { mapGetters } from 'vuex';

import { tr } from '@/locale';
import { Torrent, Category, Tag } from '@/types';
import FilterGroup from './drawer/FilterGroup.vue';
import api from '../Api';
import { formatSize } from '@/filters';
import { StateType } from '@/consts';
import SiteMap from '@/sites'
import Component from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';

const stateList = [
  {
    title: tr('category_state.downloading'),
    state: StateType.Downloading,
    icon: 'download',
  },
  {
    title: tr('category_state.seeding'),
    state: StateType.Seeding,
    icon: 'upload',
  },
  {
    title: tr('category_state.completed'),
    state: StateType.Completed,
    icon: 'check',
  },
  {
    title: tr('category_state.resumed'),
    state: StateType.Resumed,
    icon: 'play',
  },
  {
    title: tr('category_state.paused'),
    state: StateType.Paused,
    icon: 'pause',
  },
  {
    title: tr('category_state.active'),
    state: StateType.Active,
    icon: 'filter',
  },
  {
    title: tr('category_state.inactive'),
    state: StateType.Inactive,
    icon: 'filter-outline',
  },
  {
    title: tr('category_state.errored'),
    state: StateType.Errored,
    icon: 'alert',
  },
];

interface MenuItem {
  icon: string;
  'icon-alt'?: string;
  title: string;
  model?: boolean | null;
  select?: string;
  click?: () => void;
  children?: MenuChildrenItem[];
}

interface MenuChildrenItem extends MenuItem {
  key: string | null;
  append?: string;
}

function getTopDomain(host: string) {
  const parts = host.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  return host;
}

@Component({
  components: {
    FilterGroup,
  },
  computed: {
    ...mapGetters([
      'isDataReady',
      'allTorrents',
      'allCategories',
      'allTags',
      'torrentGroupByCategory',
      'torrentGroupByTag',
      'torrentGroupBySite',
      'torrentGroupByState',
    ]),
  },
})
export default class Drawer extends Vue {
  @Prop()
  readonly value: any

  endItems: MenuItem[] = [
    { icon: 'mdi-delta', title: tr('logs'), click: () => this.updateOptions('showLogs', true) },
    { icon: 'mdi-card-search-outline', title: tr('search'), click: () => this.updateOptions('showSearch', true) },
  ]

  pcItems: MenuItem[] = [
    { icon: 'mdi-rss-box', title: 'RSS', click: () => this.updateOptions('showRss', true) },
    { icon: 'mdi-cog-box', title: tr('settings'), click: () => this.updateOptions('showSettings', true) },
    { icon: 'mdi-history', title: tr('label.switch_to_old_ui'), click: this.switchUi },
  ]

  isDataReady!: boolean
  allTorrents!: Torrent[]
  allCategories!: Category[]
  allTags!: Tag[]
  torrentGroupByCategory!: {[category: string]: Torrent[]}
  torrentGroupByTag!: {[tag: string]: Torrent[]}
  torrentGroupBySite!: {[site: string]: Torrent[]}
  torrentGroupByState!: {[state: string]: Torrent[]}

  created() {
    this.endItems = this.endItems.concat(this.pcItems)
  }

  get phoneLayout() {
    return this.$vuetify.breakpoint.smAndDown;
  }

  buildStateGroup(): MenuChildrenItem[] {
    return stateList.map((item) => {
      let value = this.torrentGroupByState[item.state];
      if (isUndefined(value)) {
        value = [];
      }
      const size = formatSize(sumBy(value, 'size'));
      const title = `${item.title} (${value.length})`;
      const append = `[${size}]`;
      return {
        icon: `mdi-${item.icon}`, title, key: item.state, append,
      };
    })
  }

  buildCategoryGroup(): MenuChildrenItem[] {
    return [{
      key: '',
      name: tr('uncategorized'),
    }].concat(this.allCategories).map((category) => {
      let value = this.torrentGroupByCategory[category.key];
      if (isUndefined(value)) {
        value = [];
      }
      const size = formatSize(sumBy(value, 'size'));
      const title = `${category.name} (${value.length})`;
      const append = `[${size}]`;
      return {
        icon: 'mdi-folder', title, key: category.key, append,
      };
    });
  }

  buildTagGroup(): MenuChildrenItem[] {
    return [{
      key: '',
      name: tr('untagged'),
    }].concat(this.allTags).map((tag) => {
      let value = this.torrentGroupByTag[tag.key];
      if (isUndefined(value)) {
        value = [];
      }
      const size = formatSize(sumBy(value, 'size'));
      const title = `${tag.name} (${value.length})`;
      const append = `[${size}]`;
      return {
        icon: 'mdi-folder', title, key: tag.key, append,
      };
    });
  }

  buildSiteGroup(): MenuChildrenItem[] {
    return sortBy(Object.entries(this.torrentGroupBySite).map(([key, value]) => {
      const size = formatSize(sumBy(value, 'size'));
      const domain = getTopDomain(key);
      const site = SiteMap[domain];
      const title = `${site ? site.name : (key || tr('others'))} (${value.length})`;
      const icon = site?.icon ?? 'mdi-server';
      const append = `[${size}]`;
      return {
        icon, title, key, append,
      };
    }), 'title');
  }

  get items() {
    if (!this.isDataReady) {
      return this.endItems
    }

    const filterGroups: MenuItem[] = [];
    const totalSize = formatSize(sumBy(this.allTorrents, 'size'));

    filterGroups.push({
      icon: 'mdi-menu-up',
      'icon-alt': 'mdi-menu-down',
      title: tr('category_state._'),
      model: null,
      select: 'state',
      children: [
        {
          icon: 'mdi-filter-remove', title: `${tr('all')} (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
        },
        ...this.buildStateGroup(),
      ],
    });

    filterGroups.push({
      icon: 'mdi-menu-up',
      'icon-alt': 'mdi-menu-down',
      title: tr('category', 0),
      model: null,
      select: 'category',
      children: [
        {
          icon: 'mdi-folder', title: `${tr('all')} (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
        },
        ...this.buildCategoryGroup(),
      ],
    });

    filterGroups.push({
      icon: 'mdi-menu-up',
      'icon-alt': 'mdi-menu-down',
      title: tr('tag', 0),
      model: null,
      select: 'tag',
      children: [
        {
          icon: 'mdi-folder', title: `${tr('all')} (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
        },
        ...this.buildTagGroup(),
      ],
    });

    filterGroups.push({
      icon: 'mdi-menu-up',
      'icon-alt': 'mdi-menu-down',
      title: tr('sites'),
      model: null,
      select: 'site',
      children: [
        {
          icon: 'mdi-server', title: `${tr('all')} (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
        },
        ...this.buildSiteGroup(),
      ],
    });

    return ([] as MenuItem[]).concat([{filterGroups}] as any, this.endItems);
  }

  async switchUi() {
    await api.switchToOldUi();

    window.location.reload(true);
  }

  @Emit('input')
  updateOptions(key: string, value: any) {
    return Object.assign({}, this.value, { [key]: value })
  }
}
</script>

<style lang="scss" scoped>
.drawer .v-list-item__icon {
  margin-left: 8px;
}
</style>
