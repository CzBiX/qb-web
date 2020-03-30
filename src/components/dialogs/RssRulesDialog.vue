<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    persistent
    width="50%"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-filter</v-icon>
        <span v-text="$t('dialog.rss_rule.title')" />
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="toolbar">
          <v-btn icon @click="addRssRule" :title="$t('dialog.rss_rule.add_rule')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon :disabled="!selectedRuleName" @click="deleteRssRule" :title="$t('delete')">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <div class="content">
          <div v-if="!rssRules" class="loading">
            <v-progress-circular indeterminate>
            </v-progress-circular>
          </div>
          <template v-else>
            <div class="rss-rules">
              <v-list
                dense
              >
                <v-list-item-group v-model="selectedRuleName" color="primary" >
                  <v-list-item
                    v-for="(value, key) in rssRules"
                    :key="key"
                    :value="key"
                  >
                    <v-list-item-action>
                      <v-checkbox
                        dense
                        v-model="value.enabled"
                      />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="key" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
            <v-divider vertical />
            <div class="rule-details">
              <v-form class="rule-form">
                <p class="form-title" v-text="$t('dialog.rss_rule.rule_settings')" />

                <v-checkbox dense :label="$t('dialog.rss_rule.use_regex')"
                  :disabled="!selectedRule.enabled"
                  :value="selectedRule.useRegex"
                  @change="editRule('useRegex', $event)"
                />
                <v-text-field dense :label="$t('dialog.rss_rule.must_contain')"
                  :disabled="!selectedRule.enabled"
                  :value="selectedRule.mustContain"
                  @change="editRule('mustContain', $event)"
                />
                <v-text-field dense :label="$t('dialog.rss_rule.must_not_contain')"
                  :disabled="!selectedRule.enabled"
                  :value="selectedRule.mustNotContain"
                  @change="editRule('mustNotContain', $event)"
                />
                <v-text-field dense :label="$t('dialog.rss_rule.episode_filter')"
                  :disabled="!selectedRule.enabled"
                  :value="selectedRule.episodeFilter"
                  @change="editRule('episodeFilter', $event)"
                />
                <v-checkbox dense :label="$t('dialog.rss_rule.smart_episode')"
                  :disabled="!selectedRule.enabled"
                  :value="selectedRule.smartFilter"
                  @change="editRule('smartFilter', $event)"
                />

                <v-select dense :label="$t('dialog.rss_rule.assign_category')"
                  :items="categoryItems"
                  :disabled="!selectedRule.enabled"
                  :value="selectedRule.assignedCategory"
                  @change="editRule('assignedCategory', $event)"
                />
              </v-form>

              <v-divider/>

              <p class="feeds-title" v-text="$t('dialog.rss_rule.apply_to_feeds')"/>
              <v-list
                dense
                v-if="selectedRule.enabled"
              >
                <v-list-item
                  v-for="item in rssItems"
                  :key="item.value"
                >
                  <v-list-item-action>
                    <v-checkbox
                      dense
                      :input-value="hasSelectSite(item.value)"
                      @change="selectSite(item.value, $event)"
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { isEmpty, isEqual, pull, cloneDeep } from 'lodash'
import Vue from 'vue'
import Component from 'vue-class-component';

import { tr } from '@/locale'
import { Prop, Emit, Watch } from 'vue-property-decorator';
import { RssRule, Category, RssNode, RssItem } from '../../types';
import api from '../../Api';
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { DialogConfig, DialogType, SnackBarConfig } from '../../store/types';

@Component({
  computed: {
    ...mapGetters([
      'allCategories',
    ]),
  },
  methods: {
    ...mapMutations([
      'showSnackBar',
      'closeSnackBar',
    ]),
    ...mapActions([
      'asyncShowDialog',
    ]),
  },
})
export default class RssRulesDialog extends Vue {
  @Prop(Boolean)
  readonly value!: boolean
  @Prop()
  readonly rssNode!: RssNode

  rssRules: {[key: string]: RssRule} | null = null
  selectedRuleName: string | null = null

  allCategories!: Category[]

  asyncShowDialog!: (_: DialogConfig) => Promise<string | undefined>
  showSnackBar!: (_: SnackBarConfig) => void
  closeSnackBar!: () => void

  get selectedRule(): RssRule {
    if (!this.selectedRuleName || !(this.selectedRuleName in this.rssRules!)) {
      return {} as RssRule
    }

    return this.rssRules![this.selectedRuleName]
  }
  set selectedRule(v: RssRule) {
    this.rssRules![this.selectedRuleName!] = v
  }

  get categoryItems() {
    const uncategory: Category = {
      key: '',
      name: tr('uncategorized'),
    }

    return [uncategory, ...this.allCategories].map(c => {
      return {
        text: c.name,
        value: c.key,
      }
    })
  }
  get rssItems() {
    return this.buildRssItems(this.rssNode)
  }

  hasSelectSite(url: string) {
    return this.selectedRule.affectedFeeds.includes(url)
  }

  selectSite(url: string, enabled: boolean) {
    const rule = cloneDeep(this.selectedRule)
    const feeds = rule.affectedFeeds

    if (enabled) {
      feeds.push(url)
    } else {
      pull(feeds, url)
    }

    this.selectedRule = rule
  }

  editRule(key: keyof RssRule, value: any) {
    const rule: any = cloneDeep(this.selectedRule)
    rule[key] = value

    this.selectedRule = rule
  }

  buildRssItems(node: RssNode) {
    let result: any[] = []

    for (const [key, value] of Object.entries(node)) {
      if ('uid' in value) {
        result.push({
          text: key,
          value: value.url,
        })
      } else {
        result = result.concat(this.buildRssItems(value))
      }
    }

    return result
  }

  async fetchRssRules() {
    this.rssRules = await api.getRssRules()
  }

  async addRssRule() {
    const name = await this.asyncShowDialog({
      content: {
        text: tr('dialog.rss_rule.new_rule_name'),
        type: DialogType.Input,
      }
    })

    if (!name) {
      return
    }

    this.showSnackBar({
      text: tr('label.adding'),
    })

    await api.setRssRule(name);
    this.fetchRssRules()

    this.closeSnackBar();
  }

  async deleteRssRule() {
    const input = await this.asyncShowDialog({
      content: {
        text: tr('dialog.rss_rule.delete_rule'),
        type: DialogType.OkCancel,
      }
    })

    if (!input) {
      return
    }

    this.showSnackBar({
      text: tr('label.deleting'),
    })

    await api.removeRssRule(this.selectedRuleName!);
    this.fetchRssRules()

    this.closeSnackBar();
  }

  @Emit('input')
  closeDialog() {
    return false
  }

  created() {
    this.fetchRssRules()
  }

  @Watch('selectedRule', {deep: true})
  async onSelectedRuleChanged(v: RssRule, old: RssRule) {
    if (isEmpty(old) || isEmpty(v)) {
      // just select rule
      return
    }

    if (isEqual(v, old)) {
      return
    }

    await api.setRssRule(this.selectedRuleName!, v)
    await this.fetchRssRules()
  }
}
</script>

<style lang="scss" scoped>
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
  margin: 1em 0;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 18px;
  align-items: center;
}

.content {
  height: 75vh;
  display: flex;
}

.rss-rules {
  flex: 30%;
  
  .v-list-item__action {
    margin: 0;
  }
}

.rule-details {
  flex: 70%;

  overflow-y: auto;

  .rule-form {
    margin: 0.5em;

    .v-divider {
      margin-bottom: 1em;
    }

    .v-input--selection-controls {
      margin-top: 4px;
    }
  }

  .form-title {
    margin-bottom: 0.5em;
  }

  .feeds-title {
    margin: 0.5em;
  }

  .v-list-item {
    padding: 0 0.5em;
  }

  .v-list-item__action {
    margin: 0;
  }
}
</style>