import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      destory: false,
      task: 0,
    };
  },
  methods: {
    cancelTask() {
      if (this.task) {
        clearTimeout(this.task);
        this.task = 0;
      }
    },
  },
  beforeDestroy() {
    this.destory = true;
    this.cancelTask();
  },
});
