import type {
  ComponentName,
  InputComponentProps,
  AutocompleteComponentProps,
  InputNumberComponentProps,
  SelectComponentProps,
  SelectV2ComponentProps,
  CascaderComponentProps,
  SwitchComponentProps,
  RateComponentProps,
  ColorPickerComponentProps,
  TransferComponentProps,
  RadioGroupComponentProps,
  RadioButtonComponentProps,
  CheckboxGroupComponentProps,
  DividerComponentProps,
  DatePickerComponentProps,
  DateTimePickerComponentProps,
  TimePickerComponentProps,
  TimeSelectComponentProps,
  InputPasswordComponentProps,
  TreeSelectComponentProps,
  UploadComponentProps,
  FormItemProps
} from './form'

export interface TableProps {
  loading?: boolean // 加载状态
  spaceStyle?: object // spce布局样式
  searchForm?: object // 搜索表单
  pageSize?: number // 分页大小
  currentPage?: number // 当前页
  data?: Array<any> // 表格数据
  searchBox?: object // 搜索区配置
  toolBox?: object // 功能区配置
  tableBox?: object // 表格区配置
  paginationBox?: object // 分页区配置
}
export interface Space {
  size?: number
  direction?: 'vertical' | 'horizontal'
  alignment?: 'center' | 'normal' | 'stretch' | 'end'
}
export interface SearchBox {
  hidden?: boolean
  visibleExpandBtn?: boolean
  searchBtn?: boolean
  resetBtn?: boolean
  searchBtnText?: string
  searchBtnIcon?: any
  resetBtnText?: string
  size?: '' | 'default' | 'small' | 'large' | never
  options?: SearchBoxOption[]
  searchMethod?: (...args: any) => boolean
}
export interface SearchBoxOption {
  /**
   * 渲染的组件名称
   */
  component?: ComponentName
  /**
   * 唯一标识
   */
  field: string
  /**
   * 标题
   */
  label?: string
  /**
   * 是否允许折叠
   */
  collapseable?: boolean
  /**
   * 是否隐藏，如果为true，会连同值一同删除，类似v-if
   */
  remove?: boolean

  /**
   * 样式隐藏，不会把值一同删掉，类似v-show
   */
  hidden?: boolean
  /**
   * formItem组件属性，具体可以查看element-plus文档
   */
  formItemProps?: FormItemProps
  /**
   * 表单组件属性，具体可以查看element-plus文档
   */
  componentProps?:
    | InputComponentProps
    | AutocompleteComponentProps
    | InputNumberComponentProps
    | SelectComponentProps
    | SelectV2ComponentProps
    | CascaderComponentProps
    | SwitchComponentProps
    | RateComponentProps
    | ColorPickerComponentProps
    | TransferComponentProps
    | RadioGroupComponentProps
    | RadioButtonComponentProps
    | CheckboxGroupComponentProps
    | DividerComponentProps
    | DatePickerComponentProps
    | DateTimePickerComponentProps
    | TimePickerComponentProps
    | TimeSelectComponentProps
    | InputPasswordComponentProps
    | TreeSelectComponentProps
    | UploadComponentProps
    | any
  /**
   * @returns 远程加载下拉项
   */
  optionApi?: any
}
export interface ToolBox {
  hidden?: boolean
  options?: ToolBoxOption[]
}
export interface ToolBoxOption {
  component?: ComponentName | any
  field?: string
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  slot?: any
  on?: any
}
export interface TableBox {
  hidden?: boolean //是否隐藏
  align?: 'left' | 'center' | 'right' // 对齐方式
  headerAlign?: 'left' | 'center' | 'right' // 表头对齐方式
  rowKey?: string | ((...args: any[]) => boolean) //行数据的 Key，用来优化 Table 的渲染
  size?: string //Table 的尺寸
  reserveSelection?: boolean // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
  treeProps?: {
    hasChildren?: string
    children?: string
  }
  load?: (row: Recordable, treeNode: any, resolve: Function) => void
  columns?: TableBoxColumns[] // 表头
  selectionChange?: (...args: any[]) => string | string[]
}
export interface TableBoxColumns {
  component: string
  label?: string
  type?: string // 如果需要树形结构展示，不要传type值
  hidden?: boolean //是否隐藏
  index?: number | ((index: number) => number)
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  children?: TableBoxColumns[]
  slots?: (...args: any[]) => JSX.Element | JSX.Element[] | null
  [key: string]: any
}
export interface TableSetProps {
  prop: string
  path: string
  value: any
}
export interface TableSlotDefault {
  row: Recordable
  column: TableBoxColumns
  $index: number
  [key: string]: any
}
export interface PaginationBox {
  hidden?: boolean
  small?: boolean
  background?: boolean
  pageSize?: number
  defaultPageSize?: number
  total?: number
  pageCount?: number
  pagerCount?: number
  currentPage?: number
  defaultCurrentPage?: number
  layout?: string
  pageSizes?: number[]
  popperClass?: string
  prevText?: string
  nextText?: string
  disabled?: boolean
  hideOnSinglePage?: boolean
}
