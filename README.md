# kz-ui-vue

基于element-plus的vue3组件库。

## 功能特色

- Table业务组件：带搜索、工具栏、分页的Table业务组件
- Icon组件：支持本地svg和iconify的图标组件

## 安装

```shell
#npm安装
npm install kz-ui-vue

#pnpm安装
pnpm install kz-ui-vue
```

## 使用示例

### Table业务组件

```ts
//引入Table业务组件
import { Table } from 'kz-ui-vue'
//引入相关样式
import 'kz-ui-vue/style.css'
```

#### Table业务组件配置

```ts
{
    // 加载状态
    loading: false,
    // element-plus的spce布局样式
    spaceStyle: {
      size: 10,
      direction: 'vertical',
      alignment: 'normal'
    },
    // 搜索区域绑定的表单
    searchForm: {},
    // 分页大小
    pageSize: 10,
    // 当前页
    currentPage: 1,
    // 总页数
    pageTotal: 0,
    // 表格数据
    data: [],
    // 搜索区配置,详见'SearchBox配置'
    searchBox: {},
    // 功能区配置,详见'ToolBox配置'
    toolBox: {},
    // 表格区配置,详见'TableBox配置'
    tableBox: {},
    // 分页区配置,详见'PaginationBox配置'
    paginationBox: {}
  }
```

#### SearchBox配置

```ts
{
  // 是否隐藏
  hidden: false,
  // 是否显示收起/展开按钮
  visibleExpandBtn: false,
  // 是否显示搜索按钮
  searchBtn: true,
  // 是否显示重置按钮
  resetBtn: true,
  // 搜索按钮文字
  searchBtnText: '搜索',
  // 重置按钮文字
  resetBtnText: '重置',
  // 大小：'' | 'default' | 'small' | 'large'
  size: '',
  // 搜索配置选项,详见'SearchBoxOption配置'
  options: [],
  // 搜索按钮回调方法
  searchMethod: (...args: any) => Function,
}
```

##### SearchBoxOption配置

```ts
{
  /**
   * 渲染的组件名称
   * 目前支持：'Input','Select','RadioGroup', 'RadioButton','CheckboxGroup','CheckboxButton','Autocomplete','InputNumber','Cascader','Switch','Slider','TimePicker','DatePicker','Rate','ColorPicker','Transfer','Divider','TimeSelect','SelectV2','InputPassword','Editor','TreeSelect','Upload','Button'
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
```

#### ToolBox配置

```ts
{
  // 是否隐藏
  hidden: false,
  // 操作配置项,详见'ToolBoxOption配置'
  options: []
}
```

##### ToolBoxOption配置

```ts
{
  /**
   * 渲染的组件名称
   * 目前只支持'Button'
   */
  component?: 'Button'
  // 唯一标识
  field?: string
  // 标题
  label?: string
  // 类型
  type?: string
  // 按钮是否为禁用状态
  disabled?: boolean
  /**
   * 插槽
   * default	自定义默认内容
   * loading	自定义加载中组件
   * icon	自定义图标组件
   */
  slot?: any
  /**
   * 方法
   * click 点击方法
   */
  on?: any
}
```

#### TableBox配置

```ts
{
  // 是否隐藏
  hidden?: boolean
  // 对齐方式
  align?: 'left' | 'center' | 'right'
  // 表头对齐方式
  headerAlign?: 'left' | 'center' | 'right'
  // 行数据的 Key，用来优化 Table 的渲染
  rowKey?: string | ((...args: any[]) => boolean)
  // Table的尺寸
  size?: string
  // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
  reserveSelection?: boolean
  // 树状配置
  treeProps?: {
    hasChildren?: string
    children?: string
  }
  // 懒加载方法
  load?: (row: Recordable, treeNode: any, resolve: Function) => void
  // 表头,具体参考'TableBoxColumns配置'
  columns?: TableBoxColumns[]
  // 多选方法
  selectionChange?: (...args: any[]) => string | string[]
}
```

##### TableBoxColumns配置

```ts
{
  //显示的标题
  label?: string
  // 如果需要树形结构展示，不要传type值
  type?: '' | 'selection' | 'index'
  // 是否隐藏
  hidden?: boolean
  // 宽度
  width?: string | number
  // 最大宽度
  minWidth?: string | number
  // 列是否固定在左侧或者右侧。 true 表示固定在左侧
  fixed?: boolean | 'left' | 'right'
  // 表格的对齐方式
  align?: 'left' | 'center' | 'right'
  // 表头对齐方式， 若不设置该项，则使用表格的对齐方式
  headerAlign?: 'left' | 'center' | 'right'
  // 树形数据配置
  children?: TableBoxColumns[]
  // 插槽，可以自定义
  slots?: (...args: any[]) => JSX.Element | JSX.Element[] | null
  // 其他element-plus的table组件的属性配置
  [key: string]: any
}
```

#### PaginationBox配置

```ts
{
  // 是否隐藏
  hidden?: boolean
  // 每页显示条目个数
  pageSize?: number
  // 总条目数
  total?: number
  // 当前页数
  currentPage?: number
  // 每页显示个数选择器的选项设置
  pageSizes?: number[]
}
```

#### Table业务组件回调函数

```ts
{
  // pageSize 改变时触发
  @size-change: (val: number) => Function,
  // currentPage 改变时触发
  @current-change: (val: number) => Function,
}
```

### Icon组件

```ts
//引入Icon组件
import { Icon } from 'kz-ui-vue'
//引入相关样式
import 'kz-ui-vue/style.css'
```

#### Icon组件配置

```ts
{
  // icon name
  icon: string,
  // icon color
  color: string,
  // icon size default 16
  size: number,
  // icon class
  class: string,
  // icon hover color
  hoverColor: string
}
```
