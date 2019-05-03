<template>
<fieldset class="panel" v-if="!single">
  <legend v-text="title" />
  <div class="inner">
    <slot />
  </div>
</fieldset>
<div v-else>
  <slot />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    single: Boolean,
    title: String,
  },
});
</script>

<style lang="scss" scoped>
.panel {
  margin-top: 1em;

  .inner {
    max-height: 500px;
    overflow-y: auto;
  }
}

fieldset {
  border-width: 1px;

  legend {
    margin-left: 1em;
  }
}
</style>

