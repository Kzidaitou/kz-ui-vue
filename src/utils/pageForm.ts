import { reactive } from 'vue'

type pageType = {
  size: number
  current: number
  total: number
}
class PageForm {
  pageInfo = reactive<pageType>({
    size: 10,
    current: 1,
    total: 1,
  })
  constructor(props: Partial<pageType> = {}) {
    this.pageInfo.size = props.size || 10
    this.pageInfo.current = props.current || 1
    this.pageInfo.total = props.total || 1
  }

  loadsData(data: Required<pageType>) {
    this.pageInfo.current = data.current
    this.pageInfo.total = data.total
  }

  dumpsData(data: any): pageType | { [key: string]: any } {
    return {
      size: this.pageInfo.size,
      current: this.pageInfo.current,
      ...data,
    }
  }

  changePageSize(size: number) {
    this.pageInfo.size = size
  }

  changePageCurrent(current: number) {
    this.pageInfo.current = current
  }

  changeTotalCurrent(total: number) {
    this.pageInfo.total = total
  }
}

export default PageForm
