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
      <v-list-item v-else :key="item.title" @click="item.click ? item.click() : null">
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
import _ from 'lodash';
import Vue from 'vue';
import { mapState, mapMutations, mapGetters } from 'vuex';

import { tr } from '@/locale';
import { Torrent } from '@/types';
import FilterGroup from './drawer/FilterGroup.vue';
import api from '../Api';
import { formatSize } from '../filters';
import { SiteMap, StateType, AllStateTypes } from '../consts';

const stateList = [
  {
    title: tr('state.downloading'),
    state: StateType.Downloading,
    icon: 'download',
  },
  {
    title: tr('state.seeding'),
    state: StateType.Seeding,
    icon: 'upload',
  },
  {
    title: tr('state.completed'),
    state: StateType.Completed,
    icon: 'check',
  },
  {
    title: tr('state.resumed'),
    state: StateType.Resumed,
    icon: 'play',
  },
  {
    title: tr('state.paused'),
    state: StateType.Paused,
    icon: 'pause',
  },
  {
    title: tr('state.active'),
    state: StateType.Active,
    icon: 'filter',
  },
  {
    title: tr('state.inactive'),
    state: StateType.Inactive,
    icon: 'filter-outline',
  },
  {
    title: tr('state.errored'),
    state: StateType.Errored,
    icon: 'alert',
  },
];

interface MenuItem {
  icon: string,
  'icon-alt'?: string,
  title: string,
  model?: boolean,
  select?: string,
  click?: () => void,
  children?: MenuChildrenItem[],
}

interface MenuChildrenItem extends MenuItem {
  key: string | null,
  append?: string,
}

interface Data {
  tr: any,
  basicItems: MenuItem[],
  endItems: MenuItem[],
}

export default {
  components: {
    FilterGroup,
  },

  props: {
    value: Object,
  },

  data(): Data {
    const basicItems = [
      { icon: 'mdi-settings', title: tr('settings'), click: () => alert(tr('todo')) },
    ];
    const endItems = [
      { icon: 'mdi-delta', title: tr('logs'), click: () => this.updateOptions('showLogs', true) },
      { icon: 'mdi-rss-box', title: 'RSS', click: () => this.updateOptions('showRss', true) },
      { icon: 'mdi-history', title: tr('label.switch_to_old_ui'), click: this.switchUi },
    ];

    return {
      tr,
      basicItems,
      endItems,
    };
  },

  computed: {
    ...mapGetters([
      'isDataReady',
      'allTorrents',
      'allCategories',
      'torrentGroupByCategory',
      'torrentGroupBySite',
      'torrentGroupByState',
    ]),
    items(): Array<any> {
      if (!this.isDataReady) {
        return _.concat(this.basicItems, this.endItems);
      }

      const filterGroups: MenuItem[] = [];
      const totalSize = formatSize(_.sumBy(this.allTorrents, 'size'));

      const states = stateList.map((item) => {
        let value = this.torrentGroupByState[item.state];
        if (_.isUndefined(value)) {
          value = [];
        }
        const size = formatSize(_.sumBy(value, 'size'));
        const title = `${item.title} (${value.length})`;
        const append = `[${size}]`;
        return {
          icon: `mdi-${item.icon}`, title, key: item.state, append,
        };
      });
      filterGroups.push({
        icon: 'mdi-menu-up',
        'icon-alt': 'mdi-menu-down',
        title: tr('state._'),
        model: false,
        select: 'state',
        children: [
          {
            icon: 'mdi-filter-remove', title: `${tr('all')} (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
          },
          ...states,
        ],
      });

      const categories: any[] = [{
        key: '',
        name: tr('uncategorized'),
      }].concat(this.allCategories).map((category) => {
        let value = this.torrentGroupByCategory[category.key];
        if (_.isUndefined(value)) {
          value = [];
        }
        const size = formatSize(_.sumBy(value, 'size'));
        const title = `${category.name} (${value.length})`;
        const append = `[${size}]`;
        return {
          icon: 'mdi-folder-open', title, key: category.key, append,
        };
      });
      filterGroups.push({
        icon: 'mdi-menu-up',
        'icon-alt': 'mdi-menu-down',
        title: tr('category', 0),
        model: !this.$vuetify.breakpoint.xsOnly,
        select: 'category',
        children: [
          {
            icon: 'mdi-folder-open', title: `${tr('all')} (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
          },
          ...categories,
        ],
      });

      const sites: any[] = _.sortBy(Object.entries(this.torrentGroupBySite).map(([key, value]) => {
        const size = formatSize(_.sumBy(value, 'size'));
        const site = (SiteMap as any)[key];
        const title = `${site ? site.name : (key || tr('others'))} (${value.length})`;
        const icon = _.defaultTo(site ? site.icon : null, 'mdi-server');
        const append = `[${size}]`;
        return {
          icon, title, key, append,
        };
      }), 'title');
      filterGroups.push({
        icon: 'mdi-menu-up',
        'icon-alt': 'mdi-menu-down',
        title: tr('sites'),
        model: false,
        select: 'site',
        children: [
          {
            icon: 'mdi-server', title: `${tr('all')} (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
          },
          ...sites,
        ],
      });

      return _.concat(this.basicItems, [{filterGroups}] as any, this.endItems);
    },
  },

  methods: {
    async switchUi() {
      await api.switchToOldUi();

      window.location.reload(true);
    },
    updateOptions(key: string, value: any) {
      this.$emit('input', Object.assign({}, this.value, { [key]: value }));
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer .v-list-item__icon {
  margin-left: 8px;
}
</style>
