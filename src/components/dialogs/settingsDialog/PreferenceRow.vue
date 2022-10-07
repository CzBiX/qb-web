<template>
  <v-row
    align="center"
    dense
  >
    <v-col
      cols="auto"
      v-if="$slots.header"
      class="header"
    >
      <slot name="header" />
    </v-col>
    <v-col>
      <span v-text="$t('preferences.' + this.$props.i18nKey)" />
    </v-col>
    <v-col>
      <slot />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {Component, Prop} from 'vue-property-decorator'
import Vue from 'vue'

@Component
export default class PreferenceRow extends Vue {
  @Prop(String)
  readonly i18nKey?: string
}
</script>

<style lang="scss" scoped>
.header {
  height: 48px;
}
</style>