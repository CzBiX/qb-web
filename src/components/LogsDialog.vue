<template>
  <v-dialog :value="value" @input="$emit('input', $event)" scrollable width="50%">
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-delta</v-icon>
        <span>Logs</span>
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          :indeterminate="true"
          v-if="!logs"
        />
        <ol class="logs caption">
          <li v-for="(row, i) in logs" :key="i" :class="row.type | typeColor">
            [{{ row.type | formatType }} {{ row.timestamp / 1000 | formatTimestamp }}] <span v-html="row.message" />
          </li>
        </ol>
        <div ref="end" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '../Api';
export default Vue.extend({
  props: {
    value: Boolean,
  },
  data() {
    return {
      logs: null,
    };
  },
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
  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
    async getLogs() {
      this.logs = await api.getLogs();

      await this.$nextTick();
      this.$refs.end.scrollIntoView();
    },
  },
  async created() {
    await this.getLogs();
  },
});
</script>

<style lang="scss" scoped>
.logs {
  font-family: monospace;

  li:not(:last-child) {
    line-height: 1.4em;
  }
}
</style>
