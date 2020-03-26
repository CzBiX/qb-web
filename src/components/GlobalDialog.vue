<template>
  <v-dialog
    v-bind="config"
    v-model="value"
  >
    <v-card v-if="!!config">
      <v-card-title v-text="content.title" />
      <v-card-text class="content">
        <v-text-field
          v-if="isInput"
          v-model="input"
          :label="content.text"
          :rules="content.rules"
          :placeholder="content.placeholder"
          :hide-details="!content.rules"
        />
        <template v-else>
          {{ content.text }}
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-for="(btn, index) in btns"
          :key="index"
          color="info"
          text
          @click="clickBtn(btn[1])"
        >
          {{ btn[0] }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  computed, ref, watch, Ref,
} from '@vue/composition-api';

import { tr } from '@/locale';
import { DialogType, DialogConfig } from '@/store/types';
import { useMutations, useState } from '@/store';
import { timeout } from '@/utils';

const BUTTONS = {
  [DialogType.Alert]: [
    [tr('close'), false],
  ],
  [DialogType.YesNo]: [
    [tr('no'), false],
    [tr('yes'), true],
  ],
  [DialogType.OkCancel]: [
    [tr('cancel'), false],
    [tr('ok'), true],
  ],
  [DialogType.Input]: [
    [tr('cancel'), false],
    [tr('ok'), true],
  ],
};

const DefaultConfig = {
  width: '25%',
};

export default {
  setup() {
    const mutations = useMutations(['closeDialog']);
    const { config: userConfig } = useState(['config'], 'dialog');
    const config = computed(() => {
      if (!userConfig.value) {
        return null;
      }
      return Object.assign(DefaultConfig, userConfig.value) as DialogConfig;
    });
    const content = computed(() => (config.value ? config.value.content : null));
    const value = ref<boolean>();
    const input = ref<string>();

    const isInput = computed(() => {
      const type = content.value!.type
      return type === DialogType.Input
    })

    async function clickBtn(btnValue: any) {
      const cb = content.value!.callback;

      if (cb) {
        if (isInput.value) {
          cb(btnValue ? input.value : undefined)
        } else {
          cb(btnValue);
        }
      }

      mutations.closeDialog();
    }

    watch(config, (v) => {
      value.value = !!v;
    });
    watch(value, async (v) => {
      if (v || !config.value) {
        return
      }

      input.value = undefined;

      clickBtn(null);
    }, { lazy: true });

    const btns = computed(() => {
      const c = content.value;
      const dialogType = (c && c.type) ? c.type : DialogType.Alert;

      if (dialogType === DialogType.Custom) {
        return c!.buttons;
      }

      return BUTTONS[dialogType];
    });

    return {
      config,
      content,
      value,
      input,
      isInput,
      btns,
      clickBtn,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  white-space: pre-wrap;
}
</style>