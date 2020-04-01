<template>
  <div class="drawer-footer">
    <v-expand-transition v-if="showInfo">
      <div>
        <v-divider />

        <AppFooter
          phone-layout
        />
      </div>
    </v-expand-transition>

    <v-divider />

    <div class="button-bar">
      <template v-if="phoneLayout">
        <v-btn
          icon
          @click="showInfo = !showInfo"
        >
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </template>

      <v-spacer />

      <v-menu>
        <template #activator="{ on }">
          <v-btn
            icon
            v-on="on"
          >
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item-group
            v-model="currentLocale"
            color="primary"
          >
            <v-list-item
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>

      <v-btn
        icon
        @click="toggleDarkMode"
      >
        <v-icon v-text="darkModeIcon" />
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { mapMutations } from 'vuex';
import { Watch } from 'vue-property-decorator';

import i18n, { tr, translations, defaultLocale, LocaleKey } from '@/locale';
import { DialogType, DialogConfig, SnackBarConfig, ConfigPayload } from '@/store/types';
import AppFooter from '@/components/Footer.vue';


@Component({
  components: {
    AppFooter,
  },
  methods: {
    ...mapMutations([
      'showDialog',
      'showSnackBar',
      'updateConfig',
    ]),
  },
})
export default class DrawerFooter extends Vue {
  locales = this.buildLocales()
  currentLocale = i18n.locale()
  oldLocale = this.currentLocale
  showInfo = false

  showDialog!: (_: DialogConfig) => void
  showSnackBar!: (_: SnackBarConfig) => void
  updateConfig!: (_: ConfigPayload) => void

  get darkModeIcon() {
    return this.$vuetify.theme.dark ? 'mdi-brightness-4' : 'mdi-brightness-7';
  }

  get phoneLayout() {
    return this.$vuetify.breakpoint.xsOnly;
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

  async switchLocale(locale: LocaleKey) {
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

    this.updateConfig({
      key: 'locale',
      value: locale,
    });

    this.showSnackBar({
      text: tr('label.reloading'),
    })

    location.reload();
  }

  toggleDarkMode() {
    const { theme } = this.$vuetify;
    theme.dark = !theme.dark;

    this.updateConfig({
      key: 'darkMode',
      value: theme.dark,
    });
  }

  @Watch('currentLocale')
  onCurrentLocaleChanged(v: LocaleKey) {
    this.switchLocale(v)
  }
}
</script>

<style lang="scss" scoped>
.button-bar {
  display: flex;
  padding: 0.5em;
}

.footer {
  padding: 1em;
}
</style>