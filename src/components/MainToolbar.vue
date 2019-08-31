<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    :scroll-off-screen="!$vuetify.breakpoint.lgAndUp"
    app
    class="app-bar pl-2"
  >
    <v-app-bar-nav-icon @click="toggle" />
    <v-toolbar-title class="bar-title" v-class:sm-and-down="$vuetify.breakpoint.smAndDown">
      <img class="icon" src="/favicon.ico">
      <span class="title hidden-sm-and-down ml-3 mr-5">qBittorrent Web UI</span>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    value: Boolean,
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    },
  },
});
</script>

<style lang="scss" scoped>
.app-bar {
  .bar-title {
    display: flex;
    align-items: center;

    .icon {
      width: 40px;
      height: 40px;
    }
  }
}
.v-toolbar__title {
  margin-left: -16px;
  width: 280px;

  &.sm-and-down {
    margin-left: -12px;
    width: 60px;
  }
}
</style>
