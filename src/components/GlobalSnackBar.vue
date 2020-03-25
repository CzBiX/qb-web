<template>
  <v-snackbar
    v-if="!!config"
    v-bind="config"
    :value="true"
    @input="changed"
  >
    {{ config.text }}
    <v-btn
      text
      color="info"
      @click="clickBtn"
    >
      {{ config.btnText ? config.btnText : 'Close' }}
    </v-btn>
  </v-snackbar>
</template>

<script>
import { useMutations, useState } from '@/store';
import { timeout } from '@/utils';

export default {
  setup() {
    const mutations = useMutations(['closeSnackBar']);
    const { config } = useState(['config'], 'snackBar');

    async function changed(v) {
      if (v) {
        return;
      }

      await timeout(150);
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
