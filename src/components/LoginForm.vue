<template>
  <v-dialog v-model="value" persistent width="25em">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
        >
          <div class="pa-0"
                        @keyup.enter.capture="submit"
            v-bind="{ [`grid-list-${$vuetify.breakpoint.name}`]: true }">
            <v-text-field
              v-model="params.username"
              prepend-icon="mdi-account"
              label="Username"
              :rules="[v => !!v || 'Username is required']"
              autofocus
              required
            />
            <v-text-field
              v-model="params.password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :rules="[v => !!v || 'Password is required']"
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
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import api from '../Api';

export default Vue.extend({
  props: {
    value: Boolean,
  },
  data() {
    return {
      valid: false,
      submitting: false,
      showPassword: false,
      loginError: null,
      params: {
        username: null,
        password: null,
      },
    };
  },

  methods: {
    async submit() {
      if (this.submitting) {
        return;
      }

      if (!(this.$refs.form as any).validate()) {
        return;
      }

      this.submitting = true;
      let data;
      try {
        data = await api.login(this.params);

        if (data === 'Ok.') {
          this.$emit('input', false);
          return;
        }

        this.loginError = data;
      } catch (e) {
        this.loginError = e.message;
      }

      this.submitting = false;
    },
  },
});
</script>
