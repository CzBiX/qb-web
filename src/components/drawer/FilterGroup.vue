<template>
  <v-list-group
    v-model="model"
    :prepend-icon="model ? group.icon : group['icon-alt']"
    class="filter-group"
  >
    <template v-slot:activator>
      <v-list-item-content>
        <v-list-item-title v-class:primary--text="selected !== null">
          {{ group.title }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <v-list-item
      v-for="(child, i) in group.children"
      :key="i"
      v-class:v-list-item--active="selected === child.key"
      @click.stop="select(child.key)"
    >
      <v-list-item-icon>
        <v-icon v-if="isFontIcon(child.icon)">{{ child.icon }}</v-icon>
        <div v-else>
          <v-img :src="child.icon" width='20px' height="20px" />
        </div>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          <template v-if="child.append">
            <div class="d-flex">
              {{ child.title }}
              <v-spacer />
              {{ child.append }}
            </div>
          </template>
          <template v-else>
            {{ child.title }}
          </template>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';

export default Vue.extend({
  props: {
    group: Object,
  },
  data() {
    return {
      model: this.group.model,
      selected: null,
    };
  },
  created() {
    this.selected = this.$store.getters.config.filter[this.group.select];
  },
  methods: {
    ...mapMutations([
      'updateConfig',
    ]),
    select(key: any) {
      this.selected = this.selected === key ? null : key;
      this.updateConfig({
        key: 'filter',
        value: {
          [this.group.select]: this.selected,
        },
      });
    },
    isFontIcon(icon: string) {
      return icon.startsWith('mdi-');
    },
  },
});
</script>

<style lang="scss" scoped>
.filter-group {
  ::v-deep .v-list-group__header {
    .v-list-item__icon {
      margin-left: 8px;
    }
  }

  .v-list-item {
    min-height: 0;

    .v-list-item__icon {
      margin: 2px 30px 2px 10px;

      .v-icon {
        font-size: 20px;
      }
    }

    .v-list-item__content {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}
// ::v-deep .v-list__group__header__prepend-icon {
//   padding-left: 20px;
// }
// ::v-deep .v-list__group__header [role=listitem] {
//   margin-left: -4px;
// }
// .v-list__tile__action {
//   padding-left: 6px;
// }

// .filter-group ::v-deep .v-list__group__items .v-list__tile {
//   height: 2.2em;
// }
</style>
