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
        <v-icon v-if="isFontIcon(child.icon)">{{ child.icon }}</v-icon>
        <div v-else>
          <v-img :src="child.icon" width='22px' height="22px" />
        </div>
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
    isFontIcon(icon: string) {
      return icon.startsWith('mdi-');
    },
  },
});
</script>

<style lang="scss" scoped>
::v-deep .v-list__group__header__prepend-icon {
  padding-left: 20px;
}
::v-deep .v-list__group__header [role=listitem] {
  margin-left: -4px;
}
.v-list__tile__action {
  padding-left: 6px;
}
</style>
