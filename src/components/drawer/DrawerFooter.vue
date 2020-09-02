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

      <v-menu>
        <template #activator="{ on }">
          <v-btn
            icon
            v-on="on"
          >
            <v-icon v-text="darkModeIcon" />
          </v-btn>
        </template>

        <v-list>
          <v-list-item-group
            v-model="currentDarkMode"
            color="primary"
          >
            <v-list-item
              v-for="item in darkModes"
              :key="item[0]"
              :value="item[0]"
            >
              <v-list-item-title>{{ item[1] }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-btn
        icon
        @click="triggerApplicationShutdown"
        :title="$t('trigger_application_shutdown')"
      >
        <v-icon>mdi-power-plug-off</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { mapMutations, mapActions } from 'vuex';
import { Watch } from 'vue-property-decorator';
import api from '../../Api';

import { tr, translations, defaultLocale, LocaleKey } from '@/locale';
import { DialogType, DialogConfig, SnackBarConfig, ConfigPayload } from '@/store/types';
import AppFooter from '@/components/Footer.vue';

const AUTO_KEY = 'auto';

type AllLocaleKey = NonNullable<LocaleKey> | typeof AUTO_KEY;
type DarkModeKey = true | false | null;

@Component({
  components: {
    AppFooter,
  },
  methods: {
    ...mapMutations([
      'showSnackBar',
      'updateConfig',
    ]),
    ...mapActions([
      'asyncShowDialog',
    ]),
  },
})
export default class DrawerFooter extends Vue {
  locales = this.buildLocales()
  currentLocale = this.$store.getters.config.locale || AUTO_KEY
  currentDarkMode = this.$store.getters.config.darkMode || AUTO_KEY
  oldLocale = this.currentLocale
  showInfo = false

  darkModes = [
    [false, tr('light')],
    [true, tr('dark')],
    [AUTO_KEY, tr('auto')],
  ]

  asyncShowDialog!: (_: DialogConfig) => Promise<string | undefined>
  showSnackBar!: (_: SnackBarConfig) => void
  updateConfig!: (_: ConfigPayload) => void

  get darkModeIcon() {
    if (this.currentDarkMode == true) {
      return 'mdi-brightness-4'
    } else if (this.currentDarkMode == false) {
      return 'mdi-brightness-7'
    } else {
      return 'mdi-brightness-auto'
    }
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
        value: 'auto',
      },
      ...locales
    ]
  }

  @Watch('currentLocale')
  async onCurrentLocaleChanged(locale: AllLocaleKey) {
    if (locale === this.oldLocale) {
      return;
    }

    const localeKey = locale === AUTO_KEY ? defaultLocale : locale
    const confirm = await this.asyncShowDialog({
      text: tr('dialog.switch_locale.msg', { lang: translations[localeKey].lang }),
      type: DialogType.OkCancel,
    });

    if (!confirm) {
      this.currentLocale = this.oldLocale;
      return;
    }

    this.updateConfig({
      key: 'locale',
      value: locale === AUTO_KEY ? null : locale,
    });

    this.showSnackBar({
      text: tr('label.reloading'),
    })

    location.reload();
  }

  @Watch('currentDarkMode')
  onDarkModeChanged(mode: DarkModeKey | typeof AUTO_KEY) {
    this.updateConfig({
      key: 'darkMode',
      value: mode == AUTO_KEY ? null : mode,
    });
  }

  async triggerApplicationShutdown() {
    const v = await this.asyncShowDialog({
      title:  tr('dialog.trigger_exit_qb.title'),
      text:  tr('dialog.trigger_exit_qb.text'),
      type: DialogType.OkCancel,
    });

    if (!v) {
      return;
    }
    await api.shutdownApplication();
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
