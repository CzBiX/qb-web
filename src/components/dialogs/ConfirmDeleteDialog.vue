<template>
  <v-dialog :value="value" @input="$emit('input', $event)" width="40em">
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-delete</v-icon>
        <span>Delete torrents</span>
      </v-card-title>
      <v-card-text>
         Are you sure you want to delete the selected torrents from the transfer list?
        <ol class="torrents pt-4">
          <li v-for="(row, i) in torrents" :key="i">
            {{ row.name }}
          </li>
        </ol>

        <v-checkbox
          v-model="deleteFiles"
          prepend-icon="mdi-file-cancel"
          label="Also delete the files on the hard disk"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn flat @click="closeDialog">Cancel</v-btn>
        <v-btn
          @click="submit"
          color="warning"
          :disabled="submitting"
        >
          <v-progress-circular
            v-if="submitting"
            indeterminate
          />
          <template v-else>
            Delete
          </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/Api';

export default Vue.extend({
  props: {
    torrents: Array,
    value: Boolean,
  },
  data() {
    return {
      deleteFiles: false,
      submitting: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit('input', false);
    },
    async submit() {
      if (this.submitting) {
        return;
      }

      this.submitting = true;

      const hashed = this.torrents.map((t: any) => t.hash);
      await api.deleteTorrents(hashed, this.deleteFiles);

      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
.torrents {
  overflow: auto;
}
</style>
