<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    scrollable
    :fullscreen="phoneLayout"
    :width="dialogWidth"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-delta</v-icon>
        <span>Logs</span>
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          class="mt-4"
          :indeterminate="true"
          v-if="!logs.length"
        />
        <ol class="logs caption">
          <li v-for="(row, i) in logs" :key="i" :class="row.type | typeColor">
            [{{ row.type | formatType }} {{ row.timestamp / 1000 | formatTimestamp }}]
            <span v-html="row.message" />
          </li>
        </ol>
        <div ref="end" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
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
        1: 'secondary--text',
        2: 'info--text',
        4: 'warn--text',
        8: 'error--text',
      };
      return map[type];
    },
  },
})
export default class LogsDialog extends HasTask {
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

  async getLogs() {
    const lastId = this.logs.length ? this.logs[this.logs.length - 1].id : -1;
    const logs = await api.getLogs(lastId);

    if (this.destroy) {
      return;
    }

    if (logs.length) {
      this.logs = this.logs.concat(logs);

      await this.$nextTick();

      (this.$refs.end as HTMLElement).scrollIntoView();
    }
  }

  created() {
    this.setTaskAndRun(this.getLogs)
  }
}
</script>

<style lang="scss" scoped>
.logs {
  font-family: monospace;

  li {
    line-height: 1.4em;
  }
}
</style>
