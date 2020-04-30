<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    fullscreen
    persistent
  >
    <v-card>
      <v-card-title class="headline">
        <v-icon class="mr-2">mdi-rss-box</v-icon>
        <span>RSS</span>
        <v-spacer />
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="toolbar">
          <v-btn
            icon
            @click="addRssItem"
            :title="$t('dialog.rss.add_feed')"
          >
            <v-icon>mdi-link-plus</v-icon>
          </v-btn>
          <v-btn
            icon
            :disabled="!selectNode"
            @click="deleteRssItem"
            :title="$t('delete')"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn
            icon
            :disabled="!selectNode"
            @click="renameRssItem"
            :title="$t('rename')"
          >
            <v-icon>mdi-file-move</v-icon>
          </v-btn>
          <v-divider vertical />
          <v-btn
            icon
            :disabled="!selectNode"
            @click="refreshRssItem"
            :title="$t('refresh')"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-spacer />
          <v-divider vertical />
          <v-switch
            :input-value="preferences.rss_processing_enabled"
            @change="changePreference('rss_processing_enabled', $event)"
            :label="$t('dialog.rss.auto_refresh')"
            hide-details
          />
          <v-divider vertical />
          <v-switch
            :input-value="preferences.rss_auto_downloading_enabled"
            @change="changePreference('rss_auto_downloading_enabled', $event)"
            :label="$t('dialog.rss.auto_download')"
            hide-details
          />
          <v-divider vertical />
          <v-btn
            icon
            @click="showRulesDialog = true"
            :title="$t('settings')"
          >
            <v-icon>mdi-cog-box</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <div class="content">
          <div class="content-inner">
            <div
              v-if="!rssNode"
              class="loading"
            >
              <v-progress-circular indeterminate />
            </div>
            <template v-else>
              <div class="rss-items">
                <v-treeview
                  open-on-click
                  open-all
                  :items="rssTree"
                  item-key="path"
                  activatable
                  dense
                  @update:active="selectNode = $event[0]"
                >
                  <template v-slot:prepend="row">
                    <v-progress-circular
                      v-if="isItemLoading(row)"
                      indeterminate
                      size="22"
                      width="2"
                    />
                    <v-icon
                      v-else
                      v-text="getRowIcon(row)"
                    />
                  </template>
                  <template v-slot:label="row">
                    {{ row.item.name }}
                    <template v-if="row.item.children">
                      ({{ row.item.children.length }})
                    </template>
                  </template>
                </v-treeview>
              </div>
              <v-divider vertical />
              <div class="rss-details">
                <div class="rss-info">
                  <p>
                    {{ $t('title._') }}:
                    <a
                      v-if="selectItem"
                      target="_blank"
                      :href="selectItem.url"
                    >{{ selectItem.title }}</a>
                  </p>
                  <p>{{ $t('date') }}: {{ (selectItem ? selectItem.lastBuildDate : null) | date }}</p>
                </div>
                <v-divider />
                <div class="list-wrapper">
                  <v-list
                    v-if="selectItem"
                    dense
                  >
                    <v-list-item-group
                      v-model="selectArticle"
                      color="primary"
                    >
                      <v-list-item
                        v-for="article in sortArticles(selectItem.articles)"
                        :key="article.id"
                        :value="article"
                      >
                        <v-list-item-content>
                          <v-list-item-title>
                            <span
                              :title="article.title"
                              v-text="article.title"
                            />
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            icon
                            @click.stop="downloadTorrent(article)"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>
              </div>
              <v-divider vertical />
              <div class="rss-desc">
                <div class="rss-info">
                  <p>
                    {{ $t('title._') }}:
                    <a
                      v-if="selectArticle"
                      target="_blank"
                      :href="selectArticle.link"
                    >{{ selectArticle.title }}</a>
                  </p>
                  <p>{{ `${$t('category', 1)}: ${selectArticle ? selectArticle.category: ''}` }}</p>
                  <p>{{ $t('date') }}: {{ (selectArticle ? selectArticle.date: null) | date }}</p>
                </div>
                <v-divider />
                <iframe
                  class="iframe"
                  sandbox="allow-same-origin"
                  v-if="selectArticle"
                  v-body="selectArticle.description"
                />
              </div>
            </template>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <RssRulesDialog
      v-if="showRulesDialog"
      :rss-node="rssNode"
      v-model="showRulesDialog"
    />
  </v-dialog>
</template>

<script lang="ts">
import { get, toPath, sortBy } from 'lodash'
import { mapActions, mapMutations, mapState } from 'vuex'
import Component from 'vue-class-component'
import { Prop, Watch, Emit } from 'vue-property-decorator'

import HasTask from '@/mixins/hasTask'
import api from '@/Api';
import { tr } from '@/locale'
import { RssItem, RssNode, RssTorrent } from '@/types';
import { DialogType, DialogConfig, SnackBarConfig } from '@/store/types'
import { parseDate, formatTimestamp, formatAsDuration } from '../../filters'
import RssRulesDialog from './RssRulesDialog.vue'

let darkMode: boolean;

@Component({
  components: {
    RssRulesDialog,
  },
  computed: mapState([
    'preferences',
  ]),
  methods: {
    ...mapActions([
      'asyncShowDialog',
    ]),
    ...mapMutations([
      'showSnackBar',
      'closeSnackBar',
    ]),
  },
  filters: {
    date(str: string) {
      if (!str) {
        return null
      }

      const time = parseDate(str)!
      return tr('dialog.rss.date_format', {
        date: formatTimestamp(time),
        duration: formatAsDuration(time, {minUnit: 1}),
      })
    },
  },
  directives: {
    body: {
      inserted(el, binding) {
        const doc = (el as HTMLIFrameElement).contentDocument!

        const darkCss = darkMode ? 'body{color: #fff}' : null;

        const css = `<style>
          body{font-size:12px}
          body img{max-width: 100%}
          ${darkCss}
        </style>`

        doc.head.insertAdjacentHTML('beforeend', css)
        doc.body.innerHTML = binding.value
      },
      update(el, binding) {
        if (binding.oldValue === binding.value) {
          return
        }

        const body = (el as HTMLIFrameElement).contentDocument!.body
        body.innerHTML = binding.value
        body.scrollTo({
          top: 0,
        })
      },
    },
  },
})
export default class RssDialog extends HasTask {
  @Prop(Boolean)
  readonly value!: boolean

  rssNode: RssNode | null = null
  selectNode: string | null = null
  selectArticle: RssTorrent | null = null
  showRulesDialog = false

  preferences!: any
  asyncShowDialog!: (_: DialogConfig) => Promise<string | undefined>
  showSnackBar!: (_: SnackBarConfig) => void
  closeSnackBar!: () => void

  get rssTree() {
    if (!this.rssNode) {
      return [];
    }

    return this.buildRssTree(this.rssNode!)
  }
  get selectItem() {
    if (!this.selectNode) {
      return null
    }

    const item = get(this.rssNode, this.selectNode)
    if (!item) {
      // deleted
      return null
    }

    if ('uid' in item) {
      return item as RssItem
    }

    // Folder
    return null
  }

  get selectedPath() {
    if (!this.selectNode) {
      return null
    }

    return toPath(this.selectNode!).map(p => {
      return p.replace('\\\'', '\'').replace('\\\\', '\\');
    }).join('\\');
  }

  sortArticles(articles: RssTorrent[]) {
    return sortBy(articles, (it) => new Date(it.date || 0)).reverse();
  }

  isItemLoading(row: any) {
    const item = row.item.item
    return item && item.isLoading
  }
  
  getRowIcon(row: any) {
    const item = row.item.item
    if (item) {
      if (item.isLoading) {
        return 'mdi-refresh'
      } else if (item.hasError) {
        return 'mdi-alert'
      }

      return 'mdi-rss'
    }

    return row.open ? 'mdi-folder-open' : 'mdi-folder';
  }

  buildRssTree(node: RssNode, parent?: string) {
    const result: any = [];
    function escapeKey(key: string) {
      const escaped = key.replace('\\', '\\\\').replace('\'', '\\\'');
      return `['${escaped}']`
    }

    for (const [key, value] of Object.entries(node)) {
      const path = parent ? (parent + escapeKey(key)) : escapeKey(key)

      if ('uid' in value) {
        result.push({
          path,
          name: key,
          item: value,
        })
      } else {
        result.push({
          path,
          name: key,
          children: this.buildRssTree(value, path),
        })
      }
    }

    return result;
  }

  async addRssItem() {
    const input = await this.asyncShowDialog({
      text: tr('dialog.rss.feed_url'),
      type: DialogType.Input,
    })

    if (!input) {
      return
    }

    this.showSnackBar({
      text: tr('label.adding'),
    })

    try {
      await api.addRssFeed(input);
    } catch (e) {
      this.showSnackBar({
        text: e.response ? e.response.data : e.message,
      })
      return
    }
    await this.runTask();

    this.closeSnackBar();
  }

  async renameRssItem() {
    const input = await this.asyncShowDialog({
      text: tr('name'),
      type: DialogType.Input,
      value: this.selectedPath!,
    })

    if (!input) {
      return
    }

    this.showSnackBar({
      text: tr('label.moving'),
    })

    try {
      await api.moveRssFeed(this.selectedPath!, input);
    } catch (e) {
      this.showSnackBar({
        text: e.response ? e.response.data : e.message,
      })
      return
    }
    await this.runTask();

    this.closeSnackBar();
  }

  async deleteRssItem() {
    const confirm = await this.asyncShowDialog({
      text: tr('dialog.rss.delete_feeds'),
      type: DialogType.OkCancel,
    })

    if (!confirm) {
      return
    }

    this.showSnackBar({
      text: tr('label.deleting'),
    })

    try {
      await api.removeRssFeed(this.selectedPath!);
    } catch (e) {
      this.showSnackBar({
        text: e.response ? e.response.data : e.message,
      })
      return
    }
    await this.runTask();

    this.closeSnackBar();
  }

  async refreshRssItem() {
    await api.refreshRssFeed(this.selectedPath!);
    await this.runTask();
  }

  async changePreference(key: string, value: any) {
    await api.setPreferences({
      [key]: value,
    })
  }

  async fetchRssItems() {
    this.rssNode = await api.getRssItems()
  }

  @Emit()
  downloadTorrent(article: RssTorrent) {
    return article.torrentURL
  }

  @Watch('selectNode')
  onSelectNodeChanged() {
    this.selectArticle = null
  }

  created() {
    darkMode = this.$vuetify.theme.dark
    this.setTaskAndRun(this.fetchRssItems, 5000)
  }

  @Emit('input')
  closeDialog() {
    return false
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/styles.scss';

@include dialog-title;

.v-card {
  display: flex;
  flex-direction: column;

  .v-card__text {
    flex: 1;
    display: flex;
    flex-direction: column;

    padding: 0;
  }
}

.loading {
  width: 100%;
  text-align: center;
  margin-top: 1em;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 20px;
  align-items: center;

  .v-input--switch {
    margin: 0 0.5em;
    padding: 0;
  }
}

.content {
  flex: 1;
  position: relative;

  .content-inner {
    position: absolute;
    width: 100%;
    height: 100%;

    display: flex;
  }
}

.rss-items {
  flex: 20%;
}

.rss-details {
  flex: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .rss-info {
    margin: 0.5em 0.5em 0;
  }

  .list-wrapper {
    flex: 1;
    position: relative;

    .v-list {
      position: absolute;
      width: 100%;
      height: 100%;

      overflow-y: auto;
    }
  }

  .v-list-item__title {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-list-item {
    .v-list-item__action {
      margin: 0;
    }

    &:not(:hover) .v-list-item__action {
      display: none;
    }
  }
}

.rss-desc {
  flex: 40%;
  display: flex;
  flex-direction: column;

  .rss-info {
    margin: 0.5em 0.5em 0;
  }

  .iframe {
    border: none;
    flex: 1;
    overflow: auto;
  }
}
</style>