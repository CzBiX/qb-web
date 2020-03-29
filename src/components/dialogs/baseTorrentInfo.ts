import { Prop, Watch, Component } from 'vue-property-decorator'
import HasTask from '@/mixins/hasTask'

@Component
export default class BaseTorrentInfo extends HasTask {
  @Prop(Boolean)
  readonly isActive!: boolean

  protected fetchInfo(): Promise<void> {
    throw 'Not implement'
  }

  protected async doTask() {
    await this.fetchInfo()
    
    return !this.isActive
  }

  startTask() {
    this.setTaskAndRun(this.doTask, 5000)
  }

  created() {
    if (this.isActive) {
      this.startTask()
    }
  }

  @Watch('isActive')
  async onActived(v: boolean) {
    if (v) {
      this.startTask()
    } else {
      this.cancelTask();
    }
  }
}
