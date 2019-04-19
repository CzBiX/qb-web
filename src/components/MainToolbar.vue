<template>
  <v-toolbar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    :scroll-off-screen="!$vuetify.breakpoint.lgAndUp"
    app
  >
    <v-toolbar-title class="headline" v-class:sm-and-down="$vuetify.breakpoint.smAndDown">
      <v-toolbar-side-icon @click.stop="toggle"></v-toolbar-side-icon>
      <span class="hidden-sm-and-down">qBittorrent Web UI</span>
    </v-toolbar-title>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: Boolean,
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    },
  },
})
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  margin-left: -16px;
  width: 280px;

  &.sm-and-down {
    margin-left: -12px;
    width: 60px;
  }
}
</style>
