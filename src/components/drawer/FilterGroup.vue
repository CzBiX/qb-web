<template>
  <v-list-group
    v-model="group.model"
    :prepend-icon="group.model ? group.icon : group['icon-alt']"
  >
    <template v-slot:activator>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title v-class:primary--text="value !== null">
            {{ group.title }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
    <v-list-tile
      v-for="(child, i) in group.children"
      :key="i"
      v-class:primary--text="value === child.key"
      @click.stop="select(child.key)"
    >
      <v-list-tile-action>
        <v-icon>{{ child.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>
          <template v-if="child.append">
            <v-layout>
              {{ child.title }}
              <v-spacer />
              {{ child.append }}
            </v-layout>>
          </template>
          <template v-else>
            {{ child.title }}
          </template>
        </v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list-group>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    group: Object,
    value: String,
  },
  data() {
    return {
      selected: this.value,
    };
  },
  methods: {
    select(key: any) {
      this.selected = this.selected === key ? null : key;
      this.$emit('input', this.selected);
    },
  },
})
</script>
