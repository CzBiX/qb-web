<template>
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
            @click="plugginSelectorOpen = true"
          >
            {{ $t("plugin", 2) }}
          </v-btn>
          <v-dialog
            v-if="!this.$vuetify.breakpoint.mobile"
            v-model="plugginSelectorOpen"
            max-width="20rem"
          >
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
          </v-dialog>
          <v-bottom-sheet
            scrollable
            inset
            v-model="plugginSelectorOpen"
            v-if="this.$vuetify.breakpoint.mobile"
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
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, Watch } from "vue-property-decorator";
import { SearchPlugin } from "@/types";
import { tr } from "@/locale";
import { intersection } from "lodash";
import api from "@/Api";

const ALL_KEY = "all";

const ALL_CATEGORY: Category = {
  key: ALL_KEY,
  name: tr("all")
};

interface Category {
  key: string;
  name: string;
}

export interface SearchForm {
  valid: boolean;
  category: string;
  pattern: string;
  plugins: SearchPlugin[];
}

@Component({})
export default class SearchDialogForm extends Vue {
  @Prop(Boolean)
  readonly loading: boolean = false;

  plugginSelectorOpen = false;

  availablePlugins: SearchPlugin[] = [];

  searchForm: SearchForm = {
    valid: false,
    category: ALL_KEY,
    pattern: "",
    plugins: []
  };

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

  async getAvailablePlugins(): Promise<SearchPlugin[]> {
    const availablePlugins = await api.getSearchPlugins();

    return availablePlugins
      .filter(plugin => plugin.enabled === true)
      .sort((p1, p2) => p1.fullName.localeCompare(p2.fullName));
  }

  @Emit('triggerSearch')
  triggerSearch(): SearchForm | void {
    if (!this.searchForm.valid) {
      return;
    }

   const plugins = this.hasSelectAllPlugins
      ? ALL_KEY
      : this.searchForm.plugins.map(p => p.name).join("|");

    const searchForm = Object.assign({}, this.searchForm, {
      plugins
    });

    return searchForm;
  }

  @Emit('stopSearch')
  stopSearch() {
    //
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
