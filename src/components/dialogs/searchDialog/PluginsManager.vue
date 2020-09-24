<template>
  <v-dialog
    v-model="searchEngineState.isPluginManagerOpen"
    max-width="20rem"
    scrollable
  >
    <v-card>
      <v-card-title> <v-icon>mdi-toy-brick</v-icon> {{ $t("plugin", 1) }} {{ $t("manager") }} </v-card-title>
      <v-card-text>
        <v-switch
          v-for="(plugin, key) in searchEngineState.searchPlugins"
          :key="key"
          :input-value="plugin.enabled"
          :label="plugin.fullName"
          @change="togglePluginAvailability(plugin)"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { SearchEnginePage } from "@/store/types";
import { SearchPlugin } from '@/types';
import Vue from "vue";
import Component from "vue-class-component";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState({
      searchEngineState: "searchEngine"
    })
  },
  methods: {
    ...mapActions({
      togglePluginAvailabilityAction: "togglePluginAvailability"
    })
  }
})
export default class PluginsManager extends Vue {
  searchEngineState!: SearchEnginePage;
  togglePluginAvailabilityAction!: (_: any) => void;

  togglePluginAvailability(plugin: SearchPlugin) {
    this.togglePluginAvailabilityAction(plugin);
  }
}
</script>
