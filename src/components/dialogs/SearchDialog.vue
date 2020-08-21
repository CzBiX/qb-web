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
          v-model="searchForm.valid"
          lazy-validation
        >
          <v-container>
            <v-row
              :align="'start'"
            >
              <v-col>
                <v-select
                  v-model="searchForm.plugin"
                  :items="availablePlugins"
                  item-text="name"
                  :clearable="true"
                  label="Plugins"
                />
              </v-col>

              <v-col class="col-12 col-sm-6 col-md-8">
                <v-text-field
                  v-model="searchForm.pattern"
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                />
              </v-col>

              <v-col>
                <v-select
                  v-model="searchForm.category"
                  :items="availableCategories"
                  :clearable="true"
                  item-text="name"
                  label="Categories"
                />
              </v-col>

              <v-col>
                <v-btn
                  @click="loading ? stopSearch() : triggerSearch()"
                >
                  {{ loading ? 'Stop' : 'Search' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-data-table
          :headers="grid.headers"
          :items="grid.searchItems"
          :items-per-page="10"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="triggerDownloadTorrent(item)"
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
import {
  SearchPlugin,
  SimpleCategory,
  SearchTaskResponseResult,
} from "@/types";
import { AxiosResponse } from "axios";
import { formatSize } from '../../filters';

interface GridConfig {
  searchItems: SearchTaskResponseResult[];
  downloadItem: SearchTaskResponseResult | null;
  headers: { [key: string]: any }[];
}

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

  availablePlugins: SearchPlugin[] | null = null;
  availableCategories: SimpleCategory[] | null = null;

  searchForm: {
    valid: boolean;
    category: SimpleCategory | null;
    pattern: string | null;
    plugin: SearchPlugin | null;
  } = {
    valid: false,
    category: null,
    pattern: null,
    plugin: null,
  }

  grid: GridConfig = {
    searchItems: [],
    downloadItem: null,
    headers: [
      { text: "Name", value: "fileName" },
      { text: "Size", value: "fileSize", filter: (value: any, search: string, item: number) => formatSize(item) },
      { text: "Seeders", value: "nbSeeders" },
      { text: "Leechers", value: "nbLeechers" },
      { text: "Search Engine", value: "siteUrl" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  };

  loading = false;

  logs: any[] = [];

  private _searchId = 0;

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

  async triggerDownloadTorrent(item: any) {
    return api.addTorrents(item);
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

  async triggerSearch() {
    try {

      this.grid.searchItems = []; // Clear the table
      this.loading = true;

      const response = await this._startSearch();
      this._searchId = response.id;

      this.setTaskAndRun(async () => {
       const results = await this.getResults(response.id);

       this.grid.searchItems = this.grid.searchItems.concat(results);
      });
    } catch {
      console.warn('Something when wrong with start search');
    }
  }

  async stopSearch() {
    this.cancelTask();
    this._stopSearch(this._searchId);
    this.loading = false;
  }

  private async _startSearch(): Promise<{ id: number }> {
    const result = await api.startSearch(
     this.searchForm.pattern,
     this.searchForm.plugin && this.searchForm.plugin.name,
     this.searchForm.category && this.searchForm.category.name
    );

    return result;
  }

  private async _stopSearch(id: number): Promise<AxiosResponse> {
    return await api.stopSearch(id);
  }

  async getResults(
    id: number,
    limit = 25,
    offset = 0
  ): Promise<SearchTaskResponseResult[]> {
    const response = await api.getSearchResults(id, limit, offset);
    return response.results;
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
