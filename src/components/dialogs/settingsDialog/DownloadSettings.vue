<template>
  <v-expansion-panel>
    <v-expansion-panel-header> Downloads </v-expansion-panel-header>
    <v-expansion-panel-content>
      <h4>When adding a torrent</h4>
      <v-divider />

      <v-container
        class="px-0"
        fluid
      >
        <v-switch
          :input-value="preferences.create_subfolder_enabled"
          :label="`Create subfolder for torrents with multiple files`"
          @change="changeSettings('create_subfolder_enabled', !preferences.create_subfolder_enabled)"
        />
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import Vue from "vue";
import { Preferences } from "@/types";
import { Component } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  components: {},
  computed: {
    ...mapGetters({
      preferences: "allPreferences",
    }),
  },
  methods: {
    ...mapActions({
      updatePreferencesRequest: 'updatePreferencesRequest'
    })
  },
})
export default class DownloadSettings extends Vue {
  preferences!: Preferences;

  updatePreferencesRequest!: (_: any) => void;

  changeSettings(property: string, value: string | boolean) {
    this.updatePreferencesRequest({ [property]: value });
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

@include dialog-title;
</style>
