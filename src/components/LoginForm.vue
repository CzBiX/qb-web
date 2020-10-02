<template>
  <v-dialog
    :value="true"
    persistent
    width="25em"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title>{{ $t('login') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <div
            class="pa-0"
            @keyup.enter.capture="submit"
            v-bind="{ [`grid-list-${$vuetify.breakpoint.name}`]: true }"
          >
            <v-text-field
              v-model="baseUrl"
              prepend-icon="mdi-network"
              :label="$t('label.base_url')"
              autofocus
              required
            />
            <v-text-field
              v-model="params.username"
              prepend-icon="mdi-account"
              :label="$t('username')"
              autofocus
              required
            />
            <v-text-field
              v-model="params.password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              :label="$t('password')"
              :type="showPassword ? 'text' : 'password'"
              required
            />
          </div>
        </v-form>
        <v-alert
          type="warning"
          :value="loginError"
          v-text="loginError"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="submit"
          color="primary"
          :disabled="!valid || submitting"
          :loading="submitting"
        >
          {{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';

import api from '@/Api';
import { useStore } from '@/store';

export default defineComponent({
  setup(_, { emit }) {
    const store = useStore();
    const data = reactive({
      valid: false,
      submitting: false,
      showPassword: false,
      loginError: null,
      baseUrl: store.getters.config.baseUrl || location.href,
      params: {
        username: '',
        password: '',
      },
      form: null,
    });

    const submit = async () => {
      if (data.submitting) {
        return;
      }

      if (!(data.form as any).validate()) {
        return;
      }

      data.submitting = true;
      try {
        const resp = await api.login(data.params, data.baseUrl);

        if (resp === 'Ok.') {
          api.changeBaseUrl(data.baseUrl);

          store.commit('updateConfig', {
            key: 'baseUrl',
            value: data.baseUrl,
          });
          store.commit('updateNeedAuth', false);

          emit('input', false);
          return;
        }

        data.loginError = resp;
      } catch (e) {
        data.loginError = e.message;
      }

      data.submitting = false;
    }

    return {
      ...toRefs(data),
      submit,
    }
  },
});
</script>
