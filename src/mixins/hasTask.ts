import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HasTask extends Vue {
  destroy?: boolean
  call?: CallableFunction
  taskId?: number
  interval: number = 2000

  setTaskAndRun(call: CallableFunction, interval?: number) {
    this.call = call

    if (interval) {
      this.interval = interval
    }

    this.runTask()
  }

  async runTask() {
    this.cancelTask()

    const r = this.call!()
    if (r instanceof Promise) {
      await r
    }

    if (this.destroy) {
      return
    }

    this.taskId = setTimeout(this.runTask, this.interval)
  }

  cancelTask() {
    if (this.taskId) {
      clearTimeout(this.taskId);
      this.taskId = 0;
    }
  }

  beforeDestroy() {
    this.destroy = true;
    this.cancelTask();
  }
}
