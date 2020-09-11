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
          <span v-text="$t('search')" />
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
          >
            <v-container fluid>
              <v-row>
                <v-col class="col-12 col-sm-6 col-md-9">
                  <v-text-field
                    v-model="searchForm.pattern"
                    prepend-inner-icon="mdi-magnify"
                    @keypress.enter="$refs.searchButton.click"
                    :label="$t('search')"
                    :rules="[v => !!v || $t('msg.item_is_required', { item: $t('query') })]"
                    clearable
                  />

                  <v-btn
                    ref="searchButton"
                    :disabled="!searchForm.valid"
                    :color="loading ? 'warning' : 'primary'"
                    @click="loading ? stopSearch() : triggerSearch()"
                  >
                    {{ loading ? $t("stop") : $t("search") }}
                  </v-btn>
                </v-col>
                <v-col class="col__plugins">
                  <v-btn
                    type="button"
                    class="btn"
                    @click="choosePluginSheetOpen = true"
                  >
                    {{ $t("plugin", 2) }}
                  </v-btn>
                  <v-bottom-sheet
                    scrollable
                    inset
                    v-model="choosePluginSheetOpen"
                  >
                    <v-sheet class="text-center">
                      <v-card>
                        <v-card-title>
                          {{ $t("plugin", 1) }} {{ $t("usage") }}
                          <v-spacer />
                          <v-btn
                            small
                            @click="toggleSelectAll"
                            :color="searchForm.plugins.length > 0 ? 'primary' : ''"
                          >
                            {{ $t("all") }}
                          </v-btn>
                        </v-card-title>
                        <v-divider />
                        <v-card-text>
                          <v-checkbox
                            v-for="(plugin, key) in availablePlugins"
                            :key="key"
                            v-model="searchForm.plugins"
                            :label="plugin.fullName"
                            :value="plugin"
                          />
                        </v-card-text>
                      </v-card>
                    </v-sheet>
                  </v-bottom-sheet>
                </v-col>
                <v-col align-self="center">
                  <v-autocomplete
                    v-model="searchForm.category"
                    :items="availableCategories"
                    item-text="name"
                    item-value="key"
                    :label="$t('category', 1)"
                  />
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
            <template #[`item.fileName`]="{ item }">
              <a
                :href="item.descrLink"
                target="_blank"
                v-text="item.fileName"
              />
            </template>
            <template v-slot:[`item.fileSize`]="{ item }">
              {{ item.fileSize | formatSize }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon @click="downloadTorrent(item)">mdi-download</v-icon>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions />
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { intersection } from "lodash";
import api from "@/Api";
import HasTask from "../../mixins/hasTask";
import { Component, Prop, Emit, Watch } from "vue-property-decorator";
import { SearchPlugin, SearchTaskTorrent } from "@/types";
import { mapGetters, mapMutations } from "vuex";
import { tr } from "@/locale";

interface GridConfig {
  searchItems: SearchTaskTorrent[];
  downloadItem: SearchTaskTorrent | null;
  headers: { [key: string]: any }[];
}

interface Category {
  key: string;
  name: string;
}

const ALL_KEY = "all";
const ALL_CATEGORY: Category = {
  key: ALL_KEY,
  name: tr("all")
};

@Component({
  computed: {
    ...mapGetters({
      allCategories: "allCategories",
      preferences: "preferences"
    })
  },
  methods: {
    ...mapMutations(["openAddForm", "setPasteUrl", "addFormDownloadItem"])
  }
})
export default class SearchDialog extends HasTask {
  private _searchId = 0;

  @Prop(Boolean)
  readonly value!: boolean;

  availablePlugins: SearchPlugin[] = [];

  searchForm: {
    valid: boolean;
    category: string;
    pattern: string;
    plugins: SearchPlugin[];
  } = {
    valid: false,
    category: ALL_KEY,
    pattern: "",
    plugins: []
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
      siteUrl: ""
    },
    headers: [
      { text: tr("name"), value: "fileName" },
      { text: tr("size"), value: "fileSize" },
      { text: tr("seeds"), value: "nbSeeders" },
      { text: tr("peers"), value: "nbLeechers" },
      { text: tr("search_engine"), value: "siteUrl" },
      { text: tr("action", 2), value: "actions", sortable: false }
    ]
  };

  loading = false;
  choosePluginSheetOpen = false;

  setPasteUrl!: (_: any) => void;
  openAddForm!: () => void;
  addFormDownloadItem!: (_: any) => void;

  get hasSelectAllPlugins() {
    return this.searchForm.plugins.length === this.availablePlugins.length;
  }

  get availableCategories() {
    if (this.hasSelectAllPlugins) {
      return [ALL_CATEGORY];
    }

    const result: Category[] = [ALL_CATEGORY, { divider: true } as any];

    const categories = intersection(
      ...this.searchForm.plugins.map(p => p.supportedCategories)
    ).map(c => ({ key: c, name: c }));
    result.push(...categories);

    return result;
  }

  get allPluginIcon() {
    if (this.hasSelectAllPlugins) return "mdi-checkbox-marked";
    if (this.searchForm.plugins.length) return "mdi-minus-box";
    return "mdi-checkbox-blank-outline";
  }

  toggleSelectAll() {
    this.searchForm.plugins = this.hasSelectAllPlugins ? [] : this.availablePlugins.slice();
  }

  async mounted() {
    this.availablePlugins = await this.getAvailablePlugins();
    this.toggleSelectAll();
  }

  async downloadTorrent(item: SearchTaskTorrent) {
    this.addFormDownloadItem({
      downloadItem: {
        title: item.fileName,
        url: item.fileUrl
      }
    });
    this.openAddForm();
  }

  async getAvailablePlugins(): Promise<SearchPlugin[]> {
    const availablePlugins = await api.getSearchPlugins();

    return availablePlugins
      .filter(plugin => plugin.enabled === true)
      .sort((p1, p2) => p1.fullName.localeCompare(p2.fullName));
  }

  async triggerSearch() {
    if (!this.searchForm.valid) {
      return;
    }

    this.grid.searchItems = []; // Clear the table
    this.loading = true;

    try {
      const response = await this._startSearch();
      this._searchId = response.id;

      this.setTaskAndRun(this.task(response.id));
    } catch {
      //
    }
  }

  async stopSearch() {
    this.cancelTask();
    await this._stopSearch(this._searchId);
    this.loading = false;
  }

  @Emit("input")
  closeDialog() {
    return false;
  }

  private async _startSearch(): Promise<{ id: number }> {
    const plugins = this.hasSelectAllPlugins
      ? ALL_KEY
      : this.searchForm.plugins.map(p => p.name).join("|");

    const result = await api.startSearch(
      this.searchForm.pattern,
      plugins,
      this.searchForm.category
    );

    return result;
  }

  private async _stopSearch(id: number) {
    await api.stopSearch(id);
    this._searchId = 0;
  }

  /**
   * Does request until the plugins return data
   */
  private task(responseId: number): CallableFunction {
    return async () => {
      const response = await api.getSearchResults(responseId);
      const isStopped = response.status === "Stopped";

      if (isStopped) {
        this.grid.searchItems = this.grid.searchItems.concat(response.results);
        this.loading = false;
      }

      return isStopped;
    };
  }

  @Watch("searchForm.plugins")
  onPluginChanged() {
    if (!this.availableCategories.find(c => c.key === this.searchForm.category)) {
      this.searchForm.category = ALL_KEY;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

@include dialog-title;

.v-form {
  .col__plugins {
    button {
      width: 100%;
    }
  }

  .col {
    display: flex;
    align-items: center;
    justify-content: center;

    > * {
      margin: 0 0.5rem;
    }
  }
}

.v-bottom-sheet {
  .v-card__text {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
