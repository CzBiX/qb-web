<template>
  <div>
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
              <v-row :align="'start'">
                <v-col>
                  <v-select
                    v-model="searchForm.plugin"
                    :items="availablePlugins"
                    item-text="name"
                    :clearable="true"
                    :label="$t('plugin', 1)"
                  />
                </v-col>

                <v-col class="col-12 col-sm-6 col-md-8">
                  <v-text-field
                    v-model="searchForm.pattern"
                    prepend-inner-icon="mdi-magnify"
                    :label="$t('search')"
                  />
                </v-col>

                <v-col>
                  <v-select
                    v-model="searchForm.category"
                    :items="allCategories"
                    :clearable="true"
                    item-text="name"
                    :label="$t('category', 1)"
                  />
                </v-col>

                <v-col :align-self="'center'">
                  <v-btn
                    @click="loading ? stopSearch() : triggerSearch()"
                  >
                    {{ loading ? $t('stop') : $t('search') }}
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
            <template v-slot:[`item.fileSize`]="{ item }">
              {{ item.fileSize | formatSize }}
            </template>
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
  </div>
</template>

<script lang="ts">
import api from "@/Api";
import Component from "vue-class-component";
import HasTask from "../../mixins/hasTask";
import { Prop, Emit } from "vue-property-decorator";
import { SearchPlugin, SearchTaskTorrent } from "@/types";
import { AxiosResponse } from "axios";
import { formatSize } from "../../filters";
import { mapGetters, mapMutations } from "vuex";
import { tr } from "@/locale";

interface GridConfig {
  searchItems: SearchTaskTorrent[];
  downloadItem: SearchTaskTorrent | null;
  headers: { [key: string]: any }[];
}

@Component({
  computed: {
    ...mapGetters({
      allCategories: "allCategories",
      preferences: "preferences",
    }),
  },
  methods: {
    ...mapMutations(["openAddForm", "setPasteUrl", "addFormDownloadItem"]),
    formatSize,
    translate: tr,
  },
})
export default class SearchDialog extends HasTask {
  private _searchId = 0;

  @Prop(Boolean)
  readonly value!: boolean;

  availablePlugins: SearchPlugin[] | null = null;
  allCategories!: any;
  formatSize!: (_: any) => string;
  translate!: (_: any, __?: any) => string;

  searchForm: {
    valid: boolean;
    category: string | null;
    pattern: string | null;
    plugin: string | null;
  } = {
    valid: false,
    category: null,
    pattern: null,
    plugin: null,
  };

  grid: GridConfig = {
    searchItems: [],
    downloadItem: {
      descrLink: "",
      fileName: "",
      fileSize: 0,
      fileUrl: "",
      nbLeechers: 0,
      nbSeeders: 0,
      siteUrl: "",
    },
    headers: [
      { text: this.translate("name"), value: "fileName" },
      { text: this.translate("size"), value: "fileSize" },
      { text: this.translate("seeds"), value: "nbSeeders" },
      { text: this.translate("peers"), value: "nbLeechers" },
      { text: this.translate("search_engine"), value: "siteUrl" },
      { text: this.translate("action", 2), value: "actions", sortable: false },
    ],
  };

  loading = false;

  setPasteUrl!: (_: any) => void;
  openAddForm!: () => void;
  addFormDownloadItem!: (_: any) => void;

  async mounted() {
    this.availablePlugins = await this.getAvailablePlugins();
  }

  async downloadTorrent(item: SearchTaskTorrent) {
    this.addFormDownloadItem({
      downloadItem: {
        title: item.fileName,
        url: item.fileUrl,
      },
    });
    this.openAddForm();
  }

  async getAvailablePlugins(): Promise<SearchPlugin[]> {
    const availablePlugins = await api.getSearchPlugins();

    return availablePlugins.filter((plugin) => plugin.enabled === true);
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
      //
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
      this.searchForm.plugin,
      this.searchForm.category
    );

    return result;
  }

  private async _stopSearch(id: number): Promise<AxiosResponse> {
    return await api.stopSearch(id);
  }

  async getResults(id: number): Promise<SearchTaskTorrent[]> {
    const response = await api.getSearchResults(id);
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
</style>
