<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input', $event)"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <span v-text="$t('settings')" />
          <v-spacer />
          <v-btn
            icon
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels
            v-model="panelsOpen"
            multiple
          >
            <download-settings />
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop } from "vue-property-decorator";
import DownloadSettings from "./DownloadSettings.vue";

@Component({
  components: {
    DownloadSettings
  },
  methods: {},
})
export default class SearchDialog extends Vue {
  @Prop(Boolean)
  readonly value!: boolean;

  panelsOpen = [ 0 ];

  @Emit("input")
  closeDialog() {
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

@include dialog-title;
</style>
