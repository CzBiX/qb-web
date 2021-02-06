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
          <SearchDialogForm
            :loading="loading"
            @triggerSearch="triggerSearch"
            @stopSearch="stopSearch"
          />

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
        <v-card-actions>
          <v-btn @click="openPluginManager">
            <v-icon>mdi-cog</v-icon> {{ $t("plugin_manager") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <PluginManager />
  </div>
</template>

<script lang="ts">
import api from "@/Api";
import HasTask from "@/mixins/hasTask";
import { Component, Prop, Emit } from "vue-property-decorator";
import { SearchTaskTorrent } from "@/types";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { tr } from "@/locale";
import SearchDialogForm from "./SearchDialogForm.vue";
import PluginManager from "./PluginsManager.vue";

interface GridConfig {
  searchItems: SearchTaskTorrent[];
  downloadItem: SearchTaskTorrent | null;
  headers: { [key: string]: any }[];
}

@Component({
  components: {
    SearchDialogForm,
    PluginManager,
  },
  computed: {
    ...mapGetters({
      allCategories: "allCategories",
      preferences: "preferences",
    }),
  },
  methods: {
    ...mapMutations(["openAddForm", "setPasteUrl", "addFormDownloadItem", "openPluginManager"]),
    ...mapActions({
      loadSearchPlugins: 'fetchSearchPlugins',
    }),
  },
})
export default class SearchDialog extends HasTask {
  private _searchId = 0;

  @Prop(Boolean)
  readonly value!: boolean;

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
      { text: tr("name"), value: "fileName" },
      { text: tr("size"), value: "fileSize" },
      { text: tr("seeds"), value: "nbSeeders" },
      { text: tr("peers"), value: "nbLeechers" },
      { text: tr("search_engine"), value: "siteUrl" },
      { text: tr("action", 2), value: "actions", sortable: false },
    ],
  };

  loading = false;

  setPasteUrl!: (_: any) => void;
  openAddForm!: () => void;
  addFormDownloadItem!: (_: any) => void;
  loadSearchPlugins!: () => void;
  openPluginManager!: () => void;

  mounted() {
    this.loadSearchPlugins(); // load the plugins so they are available in the entire module
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

  async stopSearch() {
    this.cancelTask();
    await this._stopSearch(this._searchId);
    this.loading = false;
  }

  @Emit("input")
  closeDialog() {
    return false;
  }

  async triggerSearch(searchForm: any) { // TODO: find a good way to type the form.
    this.grid.searchItems = []; // Clear the table
    this.loading = true;

    try {
      const response = await this._startSearch(searchForm);
      this._searchId = response.id;

      this.setTaskAndRun(this.task(response.id));
    } catch {
      //
    }
  }

  private async _startSearch(searchForm: any): Promise<{ id: number }> {
    const result = await api.startSearch(
      searchForm.pattern,
      searchForm.plugins,
      searchForm.category,
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

      this.grid.searchItems.splice(-1, 0, ...response.results.slice(this.grid.searchItems.length))
      if (isStopped) {
        this.loading = false;
      }

      return isStopped;
    };
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles.scss";

@include dialog-title;
</style>
