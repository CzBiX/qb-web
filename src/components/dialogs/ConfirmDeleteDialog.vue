<template>
  <v-dialog :value="true" @input="closeDialog" :fullscreen="phoneLayout" width="40em">
    <v-card>
      <v-card-title
        class="headline grey lighten-4"
      >
        <v-icon class="mr-2">mdi-delete</v-icon>
        <span>Delete torrents</span>
      </v-card-title>
      <v-card-text class="pb-0">
         Are you sure you want to delete the selected torrents from the transfer list?
        <ol class="torrents pt-6">
          <li v-for="(row, i) in torrents" :key="i">
            {{ row.name }}
          </li>
        </ol>

        <v-checkbox
          v-model="deleteFiles"
          prepend-icon="mdi-file-cancel"
          label="Also delete files"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn
          @click="submit"
          color="warning"
          :disabled="submitting"
          :loading="submitting"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import api from '@/Api';

export default Vue.extend({
  props: {
    value: Array,
  },
  data() {
    return {
      deleteFiles: false,
      submitting: false,
      torrents: [],
    };
  },
  created() {
    this.torrents = this.value;
  },
  computed: {
    phoneLayout() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('input', []);
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
.v-dialog--fullscreen {
  .v-card__text {
    padding-bottom: 52px;
  }

  .v-card__actions {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
