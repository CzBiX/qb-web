<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    scrollable
    fullscreen
    persistent
  >
    <v-card>
      <v-card-title class="headline">
        <v-icon class="mr-2">mdi-card-search-outline</v-icon>
        <span>Search</span>
        <v-spacer />
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="pattern"
            prepend-inner-icon="mdi-magnify"
            label="Search"
          />

          <v-select
            v-model="plugin"
            :items="availablePlugins"
            item-text="name"
            :clearable="true"
            label="Plugins"
          />

          <v-select
            v-model="category"
            :items="availableCategories"
            :clearable="true"
            item-text="name"
            label="Categories"
          />
        </v-form>

        <v-data-table
          :headers="grid.headers"
          :items="grid.searchItems"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="downloadTorrent(item)"
            >
              mdi-download
            </v-icon>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import api from "@/Api";
import Component from "vue-class-component";
import HasTask from "../../mixins/hasTask";
import { Prop, Emit } from "vue-property-decorator";
import { SearchPlugin, Category, SimpleCategory } from "@/types";

@Component({
  filters: {
    formatType(type: number) {
      const map: any = {
        1: "N",
        2: "I",
        4: "W",
        8: "C",
      };
      return map[type];
    },
    typeColor(type: number) {
      const map: any = {
        1: null,
        2: "info--text",
        4: "warn--text",
        8: "error--text",
      };
      return map[type];
    },
  },
})
export default class SearchDialog extends HasTask {
  @Prop(Boolean)
  readonly value!: boolean;

  public valid = false;
  public category: Category | null = null;
  public pattern: string | null = null;
  public plugin: SearchPlugin | null = null;
  public availablePlugins: SearchPlugin[] | null = null;
  public availableCategories: SimpleCategory[] | null = null;

  public grid = {
    searchItems: [
      {
        name: "Frozen Yogurt",
        size: 159,
        seeders: 6,
        leechers: 24,
        searchEngine: "Jackett",
      },
    ],
    downloadItem: null,
    headers: [
      { text: "Name", value: "name" },
      { text: "Size", value: "size" },
      { text: "Seeders", value: "seeders" },
      { text: "Leechers", value: "leechers" },
      { text: "Search Engine", value: "searchEngine" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  };

  logs: any[] = [];

  async mounted() {
    this.availablePlugins = await this.getAvailablePlugins();
    this.availableCategories = await this.getAvailableCategories();
  }

  get dialogWidth() {
    return this.$vuetify.breakpoint.smAndDown ? "100%" : "70%";
  }
  get phoneLayout() {
    return this.$vuetify.breakpoint.xsOnly;
  }

  async downloadTorrent(item: any) {
    throw new Error('Implementation is missing!');
  }

  async getAvailablePlugins(): Promise<SearchPlugin[]> {
    const availablePlugins = await api.getSearchPlugins();

    return availablePlugins.filter((plugin) => plugin.enabled === true);
  }

  async getAvailableCategories(): Promise<SimpleCategory[] | null> {
    const categories = await api.getSearchCategories();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(categories).map(([key, value]) => value);
  }

  @Emit("input")
  closeDialog() {
    return false;
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

@include dialog-title;

.logs {
  .log-item {
    line-height: 1.4em;

    .tag {
      font-family: monospace;
    }
  }
}
</style>
