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
import Vue from 'vue';
import { mapMutations } from 'vuex';

import i18n, { tr, translations, defaultLocale } from '@/locale';
import { DialogType } from '@/store/types';

export default Vue.extend({
  props: {
    value: Boolean,
  },
  data() {
    let locales: {}[] = Object.entries(translations).map(([lang, translation]) => {
      return {
        text: translation.lang,
        value: lang,
      };
    });

    locales = [
      {
        text: tr('auto'),
        value: null,
      },
      ...locales
    ]

    const locale = i18n.locale();

    return {
      locales,
      oldLocale: locale,
      currentLocale: locale,
    };
  },
  methods: {
    ...mapMutations([
      'showDialog',
      'showSnackBar',
    ]),
    toggle() {
      this.$emit('input', !this.value);
    },
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

      this.showSnackBar(tr('label.reloading'))

      location.reload();
    },
  },
  watch: {
    currentLocale(v) {
      this.switchLocale(v);
    },
  },
});
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
