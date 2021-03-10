<template>
  <v-row
    align="center"
    dense
  >
    <v-col cols="3">
      <v-subheader v-text="$t('preferences.' + this.$props.i18nKey)" />
    </v-col>
    <v-col cols="4">
      <slot />
    </v-col>
    <v-col
      cols="auto"
      v-if="$slots.header"
    >
      <slot name="header" />
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
