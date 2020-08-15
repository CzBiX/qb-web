<template>
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
        <div> Some text </div>
      </v-card-text>
      <v-card-actions />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import api from '@/Api';
import Component from 'vue-class-component';
import HasTask from '../../mixins/hasTask';
import { Prop, Emit } from 'vue-property-decorator';

@Component({
  filters: {
    formatType(type: number) {
      const map: any = {
        1: 'N',
        2: 'I',
        4: 'W',
        8: 'C',
      };
      return map[type];
    },
    typeColor(type: number) {
      const map: any = {
        1: null,
        2: 'info--text',
        4: 'warn--text',
        8: 'error--text',
      };
      return map[type];
    },
  },
})
export default class SearchDialog extends HasTask {
  @Prop(Boolean)
  readonly value!: boolean

  logs: any[] = []

  get dialogWidth() {
    return this.$vuetify.breakpoint.smAndDown ? '100%' : '70%';
  }
  get phoneLayout() {
    return this.$vuetify.breakpoint.xsOnly;
  }

  @Emit('input')
  closeDialog() {
    return false
  }


}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles.scss';

@include dialog-title;

.logs {
  .log-item {
    line-height: 1.4em;

    .tag {
      font-family: monospace;
    }
  }
}
</style>
