<template>
  <v-app-bar
    :clipped-left="$vuetify.breakpoint.lgAndUp"
    :scroll-off-screen="!$vuetify.breakpoint.lgAndUp"
    app
    class="app-bar pl-2"
  >
    <v-app-bar-nav-icon @click="toggle" />
    <v-toolbar-title
      class="bar-title"
      v-class:sm-and-down="$vuetify.breakpoint.smAndDown"
    >
      <img
        class="icon"
        src="/favicon.ico"
      >
      <span class="title hidden-sm-and-down ml-3 mr-5">
        qBittorrent Web UI
      </span>
    </v-toolbar-title>
    <v-spacer />
    <v-text-field
      :flat="!focusedSearch"
      :solo="focusedSearch"
      :solo-inverted="!focusedSearch"
      hide-details
      clearable
      prepend-inner-icon="mdi-magnify"
      :label="$t('search')"
      @focus="focusedSearch = true"
      @blur="focusedSearch = false"
      @input="onSearch"
      :value="searchQuery"
    />
    <v-spacer />
    <v-select
      class="locales"
      :items="locales"
      prepend-inner-icon="mdi-translate"
      v-model="currentLocale"
      hide-details
      solo
      flat
    />
  </v-app-bar>
</template>

<script lang="ts">
import { throttle } from 'lodash';
import Vue from 'vue';
import { mapMutations } from 'vuex';

import i18n, { tr, translations, defaultLocale } from '@/locale';
import { DialogType, DialogConfig, SnackBarConfig } from '@/store/types';
import Component from 'vue-class-component';
import { Prop, Emit, Watch } from 'vue-property-decorator';

@Component({
  methods: {
    ...mapMutations([
      'showDialog',
      'showSnackBar',
    ]),
  },
})
export default class MainToolbar extends Vue {
  @Prop(Boolean)
  readonly value!: boolean

  showDialog!: (_: DialogConfig) => void
  showSnackBar!: (_: SnackBarConfig) => void

  locales = this.buildLocales()
  currentLocale = i18n.locale()
  oldLocale = this.currentLocale
  focusedSearch = false

  get searchQuery() {
    return this.$store.getters.config.filter.query;
  }

  buildLocales() {
    const locales: {}[] = Object.entries(translations).map(([lang, translation]) => {
      return {
        text: translation.lang,
        value: lang,
      };
    });

    return [
      {
        text: tr('auto'),
        value: null,
      },
      ...locales
    ]
  }

  @Emit('input')
  toggle() {
    return !this.value;
  }

  onSearch = throttle(async (v: string) => {
    // avoid hang input
    await this.$nextTick();
    this.$store.commit('updateConfig', {
      key: 'filter',
      value: {
        query: v,
      },
    });
  }, 400)

  async switchLocale(locale: keyof typeof translations | null) {
    if (locale === this.oldLocale) {
      return;
    }

    const confirm = await new Promise((resolve) => {
      const localeKey = !locale ? defaultLocale : locale
      this.showDialog({
        content: {
          text: tr('dialog.switch_locale.msg', { lang: translations[localeKey].lang }),
          type: DialogType.OkCancel,
          callback: resolve,
        },
      });
    });

    if (!confirm) {
      this.currentLocale = this.oldLocale;
      return;
    }

    this.$store.commit('updateConfig', {
      key: 'locale',
      value: locale,
    });

    this.showSnackBar({
      text: tr('label.reloading'),
    })

    location.reload();
  }

  @Watch('currentLocale')
  onCurrentLocaleChanged(v: keyof typeof translations) {
    this.switchLocale(v)
  }
}
</script>

<style lang="scss" scoped>
.app-bar {
  .bar-title {
    display: flex;
    align-items: center;

    .icon {
      width: 40px;
      height: 40px;
    }
  }
}
.v-toolbar__title {
  margin-left: -16px;
  width: 280px;

  &.sm-and-down {
    margin-left: -12px;
    width: 60px;
  }
}

// Fix width
// see: https://github.com/vuetifyjs/vuetify/issues/6275
.locales {
  flex-grow: 0;

  &::v-deep .v-select__selections {
    .v-select__selection {
      max-width: none;
    }

    input {
      width: 0;
    }
  }
}
</style>
