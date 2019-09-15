<template>
  <v-list
    dense
    expand
    class="drawer"
  >
    <template v-for="item in items">
      <v-row
        v-if="item.heading"
        :key="item.heading"
        align="center"
      >
        <v-col cols="6">
          <v-subheader v-if="item.heading">
            {{ item.heading }}
          </v-subheader>
        </v-col>
        <v-col cols="6" class="text-center">
          <a href="#!" class="body-2 black--text">EDIT</a>
        </v-col>
      </v-row>
      <v-list-group
        v-else-if="item.children"
        :key="item.text"
        v-model="item.model"
        :prepend-icon="item.model ? item.icon : item['icon-alt']"
        append-icon=""
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
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
              {{ child.text }}
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
      <v-list-item v-else :key="item.text" @click="item.click ? item.click() : null">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
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
import FilterGroup from './drawer/FilterGroup.vue';
import api from '../Api';
import { formatSize } from '../filters';
import { SiteMap, StateType, AllStateTypes } from '../consts';

const stateList = [
  {
    title: 'Downloading',
    state: StateType.Downloading,
    icon: 'download',
  },
  {
    title: 'Seeding',
    state: StateType.Seeding,
    icon: 'upload',
  },
  {
    title: 'Completed',
    state: StateType.Completed,
    icon: 'check',
  },
  {
    title: 'Resumed',
    state: StateType.Resumed,
    icon: 'play',
  },
  {
    title: 'Paused',
    state: StateType.Paused,
    icon: 'pause',
  },
  {
    title: 'Active',
    state: StateType.Active,
    icon: 'filter',
  },
  {
    title: 'Inactive',
    state: StateType.Inactive,
    icon: 'filter-outline',
  },
  {
    title: 'Errored',
    state: StateType.Errored,
    icon: 'alert',
  },
];

export default {
  components: {
    FilterGroup,
  },

  props: {
    value: Object,
  },

  data() {
    return {
      basicItems: null,
      endItems: null,
    };
  },

  created() {
    this.basicItems = [
      { icon: 'mdi-settings', text: 'Settings', click: () => alert('TODO') },
    ];
    this.endItems = [
      { icon: 'mdi-delta', text: 'Logs', click: () => this.updateOptions('showLogs', true) },
      { icon: 'mdi-history', text: 'Switch to old UI', click: this.switchUi },
    ];
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

      const filterGroups = [];
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
        title: 'State',
        model: false,
        select: 'state',
        children: [
          {
            icon: 'mdi-filter-remove', title: `All (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
          },
          ...states,
        ],
      });

      const categories: any[] = [{
        key: '',
        name: 'Uncategorized',
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
        title: 'Categories',
        model: !this.$vuetify.breakpoint.xsOnly,
        select: 'category',
        children: [
          {
            icon: 'mdi-folder-open', title: `All (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
          },
          ...categories,
        ],
      });

      const sites: any[] = _.sortBy(Object.entries(this.torrentGroupBySite).map(([key, value]) => {
        const size = formatSize(_.sumBy(value, 'size'));
        const site = (SiteMap as any)[key];
        const title = `${site ? site.name : (key || 'Others')} (${value.length})`;
        const icon = _.defaultTo(site ? site.icon : null, 'mdi-server');
        const append = `[${size}]`;
        return {
          icon, title, key, append,
        };
      }), 'title');
      filterGroups.push({
        icon: 'mdi-menu-up',
        'icon-alt': 'mdi-menu-down',
        title: 'Sites',
        model: false,
        select: 'site',
        children: [
          {
            icon: 'mdi-server', title: `All (${this.allTorrents.length})`, key: null, append: `[${totalSize}]`,
          },
          ...sites,
        ],
      });

      return _.concat(this.basicItems, [{ filterGroups }], this.endItems);
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