<template>
  <v-list dense>
    <template v-for="item in items">
      <v-layout
        v-if="item.heading"
        :key="item.heading"
        row
        align-center
      >
        <v-flex xs6>
          <v-subheader v-if="item.heading">
            {{ item.heading }}
          </v-subheader>
        </v-flex>
        <v-flex xs6 class="text-xs-center">
          <a href="#!" class="body-2 black--text">EDIT</a>
        </v-flex>
      </v-layout>
      <v-list-group
        v-else-if="item.children"
        :key="item.text"
        v-model="item.model"
        :prepend-icon="item.model ? item.icon : item['icon-alt']"
        append-icon=""
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-list-tile
          v-for="(child, i) in item.children"
          :key="i"
          @click="item.click ? item.click(child.value) : null"
        >
          <v-list-tile-action v-if="child.icon">
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ child.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>
      <template v-if="item.filterGroups">
        <filter-group
          v-for="(child, i) in item.filterGroups"
          :key="i"
          :group="child"
          v-model="filter[child.select]"
        />
      </template>
      <v-list-tile v-else :key="item.text" @click="item.click ? item.click() : null">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ item.text }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script lang="ts">
import _ from 'lodash';
import Vue from 'vue';
import FilterGroup from './drawer/FilterGroup.vue';
import { api } from '../Api';
import { mapState, mapMutations, mapGetters } from 'vuex';
import { formatSize } from '../filters';

export default {
  components: {
    FilterGroup,
  },

  props: {
    value: Object,
  },

  data() {
    return {
      filter: {
        type: null,
        category: null,
        site: null,
      },
      basicItems: null,
        // {
        //   'icon': 'mdi-menu-up',
        //   'icon-alt': 'mdi-menu-down',
        //   'text': 'Status',
        //   'model': true,
        //   'children': [
        //     { icon: 'mdi-filter-remove', text: 'All' },
        //     { icon: 'mdi-download', text: 'Downloading' },
        //     { icon: 'mdi-upload', text: 'Seeding' },
        //     { icon: 'mdi-check', text: 'Completed' },
        //     { icon: 'mdi-play', text: 'Resumed' },
        //     { icon: 'mdi-pause', text: 'Paused' },
        //     { icon: 'mdi-filter', text: 'Active' },
        //     { icon: 'mdi-filter-outline', text: 'Inactive' },
        //     { icon: 'mdi-alert', text: 'Errored' },
        //   ],
        // },
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
      'torrentGroupByCategory',
      'torrentGroupBySite',
    ]),
    items() {
      if (!this.isDataReady) {
        return _.concat(this.basicItems, this.endItems);
      }
      const filterGroups = [];
      const categories: any[] = _.sortBy(Object.entries(this.torrentGroupByCategory).map(([key, value]) => {
        const title = key ? key : 'Uncategorized';
        const append =  `(${value.length})`;
        return { icon: 'mdi-folder-open', title, key, append};
      }), (o) => o.key);
      filterGroups.push({
        'icon': 'mdi-menu-up',
        'icon-alt': 'mdi-menu-down',
        'title': 'Categories',
        'model': false,
        'select': 'category',
        'children': [
          { icon: 'mdi-folder-open', title: 'All', key: null, append: `(${this.allTorrents.length})` },
          ...categories,
        ],
      });

      const sites: any[] = _.sortBy(Object.entries(this.torrentGroupBySite).filter(([key, value]) => {
        return key;
      }).map(([key, value]) => {
        const size = formatSize(value.reduce((acc, v) => {
          return acc + v.size;
        }, 0));
        const title = key;
        const append =  `(${value.length})[${size}]`;
        return { icon: 'mdi-server', title, key, append };
      }), (o) => o.title);
      filterGroups.push({
        'icon': 'mdi-menu-up',
        'icon-alt': 'mdi-menu-down',
        'title': 'Sites',
        'model': false,
        'select': 'site',
        'children': sites,
      });

      return _.concat(this.basicItems, [{filterGroups}], this.endItems);
    },
  },

  methods: {
    ...mapMutations(['updateFilter']),
    async switchUi() {
      await api.switchToOldUi();

      location.reload(true);
    },
    updateOptions(key: string, value: any) {
      this.$emit('input', Object.assign({}, this.value, {[key]: value}));
    },
  },

  watch: {
    filter: {
      handler() {
        this.updateFilter(this.filter);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
