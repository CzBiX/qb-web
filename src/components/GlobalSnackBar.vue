<template>
  <v-snackbar
    v-bind="config"
    :value="config"
    @input="changed"
  >
    <template v-if="config">
      {{ config.text }}
      <v-btn
        v-if="config.callback"
        text
        color="info"
        @click="clickBtn"
      >
        {{ config.btnText ? config.btnText : $t('close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { useMutations, useState } from '@/store';

export default {
  setup() {
    const mutations = useMutations(['closeSnackBar']);
    const { config } = useState(['config'], 'snackBar');

    async function changed(v) {
      if (v) {
        return;
      }

      mutations.closeSnackBar();
    }

    function clickBtn() {
      const cb = config.value.callback;

      changed(false);

      if (cb) {
        cb();
      }
    }

    return {
      config,
      changed,
      clickBtn,
    };
  },
};
</script>
