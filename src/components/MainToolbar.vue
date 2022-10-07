<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    :scroll-off-screen="!$vuetify.breakpoint.lgAndUp"
    app
    class="app-bar pl-2"
    :class="{'phone-layout': phoneLayout}"
  >
    <v-app-bar-nav-icon @click="toggle" />
    <v-toolbar-title
      class="bar-title"
      v-show="!searchBarExpanded"
    >
      <img
        class="icon"
        src="img/icons/favicon-192x192.png"
      >
      <span class="title hidden-sm-and-down ml-3 mr-5">
        qBittorrent Web UI
      </span>
    </v-toolbar-title>
    <v-spacer v-if="!phoneLayout" />
    <v-text-field
      class="search-bar"
      :flat="!focusedSearch"
      :solo="focusedSearch"
      :solo-inverted="!focusedSearch"
      hide-details
      :clearable="!phoneLayout || searchBarExpanded"
      prepend-inner-icon="mdi-magnify"
      :label="$t('search')"
      @focus="focusedSearch = true"
      @blur="focusedSearch = false"
      @input="onSearch"
      :value="searchQuery"
    />
    <v-spacer v-if="!phoneLayout" />
  </v-app-bar>
</template>

<script lang="ts">
import { throttle } from 'lodash';
import Vue from 'vue';
import { mapMutations } from 'vuex';

import Component from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';

@Component({
  methods: {
    ...mapMutations([
      'setQuery',
    ]),
  },
})
export default class MainToolbar extends Vue {
  @Prop(Boolean)
  readonly value!: boolean

  setQuery!: (_: string | null) => void

  focusedSearch = false

  get searchQuery() {
    return this.$store.state.query;
  }

  get phoneLayout() {
    return this.$vuetify.breakpoint.smAndDown;
  }

  get searchBarExpanded() {
    return this.phoneLayout && (this.focusedSearch || !!this.searchQuery);
  }

  @Emit('input')
  toggle() {
    return !this.value;
  }

  onSearch = throttle(async (v: string) => {
    // avoid input lag
    await this.$nextTick();
    this.setQuery(v || null);
  }, 400)
}
</script>

<style lang="scss" scoped>
.app-bar {
  .bar-title {
    display: flex;
    align-items: center;
    margin-left: -16px;

    .icon {
      width: 40px;
      height: 40px;
    }
  }

  .search-bar {
    transition: width 0.4s;
  }

  &.phone-layout {
    .search-bar {
      flex: 1;
      margin: 0 0.5em 0 1em;
    }
  }
}
</style>
