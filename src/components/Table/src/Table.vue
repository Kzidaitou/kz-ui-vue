<script lang="tsx">
import {
  ElSpace,
  ElTable,
  ElTableColumn,
  ElForm,
  ElFormItem,
  ElButton,
  ElRow,
  ElPagination,
  ElConfigProvider
} from 'element-plus'
import { defineComponent, ref, unref, onMounted, computed, watch, PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { isEmptyValInObject } from '@/utils/is'
import { getSlot } from '@/utils/tsxHelper'
import { get, set } from 'lodash-es'
import { componentMap } from './helper/componentMap'
import ElPageIndex from './components/ElTableIndex'
import ActionButton from './components/ActionButton.vue'
import { useRenderSelect } from './components/useRenderSelect'
import { useRenderRadio } from './components/useRenderRadio'
import { useRenderCheckbox } from './components/useRenderCheckbox'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

import type {
  TableProps,
  Space,
  SearchBox,
  ToolBox,
  TableBox,
  TableBoxColumns,
  PaginationBox,
  SearchBoxOption
} from './types'
import {
  ComponentNameEnum,
  SelectComponentProps,
  RadioGroupComponentProps,
  CheckboxGroupComponentProps,
  FormSetProps
} from './types/form'
import { setComponentProps, setItemComponentSlots, setTableProps, setToolProps } from './helper'

const { renderSelectOptions } = useRenderSelect()
const { renderRadioOptions } = useRenderRadio()
const { renderCheckboxOptions } = useRenderCheckbox()

export default defineComponent({
  name: 'Table',
  props: {
    // 加载状态
    loading: propTypes.bool.def(false),
    // spce布局样式
    spaceStyle: {
      type: Object,
      default: (): Space | undefined => undefined
    },
    // 搜索表单
    searchForm: propTypes.object.def({}),
    // 分页大小
    pageSize: propTypes.number.def(10),
    // 当前页
    currentPage: propTypes.number.def(1),
    // 总页数
    pageTotal: propTypes.number.def(0),
    // 表格数据
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    // 搜索区配置
    searchBox: {
      type: Object,
      default: (): SearchBox | undefined => undefined
    },
    // 功能区配置
    toolBox: {
      type: Object,
      default: (): ToolBox | undefined => undefined
    },
    // 表格区配置
    tableBox: {
      type: Object,
      default: (): TableBox | undefined => undefined
    },
    // 分页区配置
    paginationBox: {
      type: Object as PropType<PaginationBox>,
      default: (): PaginationBox | undefined => undefined
    },
    language: propTypes.string.def('zh-CN')
  },
  emits: [
    'update:searchForm',
    'update:pageSize',
    'update:currentPage',
    'size-change',
    'current-change'
  ],
  setup(props, { attrs, slots, emit, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()
    const elSearchFormRef = ref<ComponentRef<typeof ElForm>>()
    const visibleSearchExpand = ref(true)

    const locale = computed(() => (props.language === 'en' ? en : zhCn))

    // 注册
    onMounted(() => {
      // const tableRef = unref(elTableRef)
      // const searchFormRef = unref(elSearchFormRef)
    })
    const pageSizeRef = ref(props.pageSize)
    const currentPageRef = ref(props.currentPage)
    const pageTotalRef = ref(props.pageTotal)

    // 表单数据
    const searchForm = ref<Recordable>(props.searchForm)

    const mergeProps = ref<TableProps>({})
    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
    }

    expose({
      setProps,
      elTableRef,
      elSearchFormRef
    })
    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeRef.value = val
      }
    )
    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        currentPageRef.value = val
      }
    )
    watch(
      () => unref(getProps).pageTotal,
      (val: number) => {
        pageTotalRef.value = val
      }
    )
    watch(
      () => pageSizeRef.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )
    const emitSizeChange = (val: number) => {
      emit('size-change', val)
    }
    const emitCurrentChange = (val: number) => {
      emit('current-change', val)
    }
    const onResetForm = () => {
      if (!unref(elSearchFormRef)) return
      unref(elSearchFormRef)?.resetFields()
      unref(getProps).searchBox.searchMethod()
    }
    const onSearchForm = () => {
      if (!unref(elSearchFormRef)) return
      unref(getProps).searchBox.searchMethod()
    }
    const setVisibleSearchExpand = async () => {
      visibleSearchExpand.value = !unref(visibleSearchExpand)
    }
    const setSchema = (schemaProps: FormSetProps[]) => {
      const { searchBox } = unref(getProps)
      for (const v of searchBox.options) {
        for (const item of schemaProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          }
        }
      }
    }
    const getOptions = async (fn: Function, item: SearchBoxOption) => {
      const options = await fn()
      setSchema([
        {
          field: item.field,
          path:
            item.component === ComponentNameEnum.TREE_SELECT
              ? 'componentProps.data'
              : 'componentProps.options',
          value: options
        }
      ])
    }
    // 渲染formItem
    const renderFormItem = (v: SearchBoxOption) => {
      // 如果有optionApi，优先使用optionApi
      if (v.optionApi) {
        // 内部自动调用接口，不影响其它渲染
        getOptions(v.optionApi, v)
      }
      const formItemSlots: Recordable = {
        default: () => {
          if (v?.formItemProps?.slots?.default) {
            return v?.formItemProps?.slots?.default(searchForm.value)
          } else {
            const Com = componentMap[v.component as string] as ReturnType<typeof defineComponent>
            const componentSlots = (v?.componentProps as any)?.slots || {}
            const slotsMap: Recordable = {
              ...setItemComponentSlots(componentSlots)
            }
            if (v.component === ComponentNameEnum.SELECT) {
              //如果是select组件，并且没有自定义模板，自动渲染options
              slotsMap.default = !componentSlots.default
                ? () => renderSelectOptions(v)
                : () => {
                    return componentSlots.default(
                      unref((v?.componentProps as SelectComponentProps)?.options)
                    )
                  }
            } else if (v.component === ComponentNameEnum.SELECT_V2 && componentSlots.default) {
              // 虚拟列表
              slotsMap.default = ({ item }) => {
                return componentSlots.default(item)
              }
            } else if (
              v.component === ComponentNameEnum.RADIO_GROUP ||
              v.component === ComponentNameEnum.RADIO_BUTTON
            ) {
              //单选框组和按钮样式
              slotsMap.default = !componentSlots.default
                ? () => renderRadioOptions(v)
                : () => {
                    return componentSlots.default(
                      unref((v?.componentProps as RadioGroupComponentProps)?.options)
                    )
                  }
            } else if (
              v.component === ComponentNameEnum.CHECKBOX_GROUP ||
              v.component === ComponentNameEnum.CHECKBOX_BUTTON
            ) {
              // 多选框组和按钮样式
              slotsMap.default = !componentSlots.default
                ? () => renderCheckboxOptions(v)
                : () => {
                    return componentSlots.default(
                      unref((v?.componentProps as CheckboxGroupComponentProps)?.options)
                    )
                  }
            }
            const Comp = () => {
              // 如果field是多层路径，需要转换成对象
              const itemVal = computed({
                get: () => {
                  return get(searchForm.value, v.field)
                },
                set: (val) => {
                  set(searchForm.value, v.field, val)
                }
              })

              return (
                <Com
                  class={`${!unref(visibleSearchExpand) && v.collapseable ? '!hidden' : ''} `}
                  v-model={itemVal.value}
                  {...setComponentProps(v)}
                >
                  {{ ...slotsMap }}
                </Com>
              )
            }
            return <>{Comp()}</>
          }
        }
      }
      if (v?.formItemProps?.slots?.label) {
        formItemSlots.label = (...args: any[]) => {
          return (v?.formItemProps?.slots as any)?.label(...args)
        }
      }
      if (v?.formItemProps?.slots?.error) {
        formItemSlots.error = (...args: any[]) => {
          return (v?.formItemProps?.slots as any)?.error(...args)
        }
      }
      return (
        <ElFormItem
          v-show={!(v.hidden || (!unref(visibleSearchExpand) && v.collapseable))}
          prop={v.field}
          label={v.label || ''}
          {...(v.formItemProps || {})}
        >
          {formItemSlots}
        </ElFormItem>
      )
    }
    const renderSearch = (searchBoxOptions: SearchBox) => {
      if (!searchBoxOptions) {
        return null
      } else {
        return (
          <div class="table-search-box">
            {searchBoxOptions.hidden ? null : (
              <ElForm ref={elSearchFormRef} model={unref(searchForm)} inline class="left-wrapper">
                {searchBoxOptions.options &&
                  searchBoxOptions.options.length > 0 &&
                  searchBoxOptions.options
                    .filter((v) => !v.remove)
                    .map((item: any) => {
                      return renderFormItem(item)
                    })}
              </ElForm>
            )}
            {!searchBoxOptions.hidden ? (
              <div class="right-wrapper">
                <ActionButton
                  showSearch={searchBoxOptions.searchBtn}
                  searchText={searchBoxOptions.searchBtnText || '搜索'}
                  showReset={searchBoxOptions.resetBtn}
                  resetText={searchBoxOptions.resetBtnText || '重置'}
                  showExpand={searchBoxOptions.visibleExpandBtn}
                  size={searchBoxOptions.size ? searchBoxOptions.size : 'default'}
                  visible={visibleSearchExpand.value}
                  resetDisabled={isEmptyValInObject(unref(searchForm))}
                  onExpand={setVisibleSearchExpand}
                  onReset={onResetForm}
                  onSearch={onSearchForm}
                />
              </div>
            ) : null}
          </div>
        )
      }
    }
    const renderTool = (toolBoxOptions: ToolBox) => {
      if (!toolBoxOptions) {
        return null
      } else {
        return toolBoxOptions.hidden ? null : (
          <div class="table-tools-box">
            {toolBoxOptions.options &&
              toolBoxOptions.options.length > 0 &&
              toolBoxOptions.options.map((v: any) => {
                if (v.component === 'Button') {
                  return (
                    <ElButton
                      {...setToolProps(v)}
                      v-slots={{
                        default: (data: any) =>
                          v.slots && v.slots.default ? v.slots.default(data) : null,
                        icon: (data: any) => (v.slots && v.slots.icon ? v.slots.icon(data) : null)
                      }}
                    ></ElButton>
                  )
                } else {
                  return null
                }
              })}
          </div>
        )
      }
    }
    const renderTable = (tableBoxOptions: TableBox) => {
      if (!tableBoxOptions) return null
      const tableSlots = {}
      if (getSlot(slots, 'empty')) {
        tableSlots['empty'] = (...args: any[]) => getSlot(slots, 'empty', args)
      }
      if (getSlot(slots, 'append')) {
        tableSlots['append'] = (...args: any[]) => getSlot(slots, 'append', args)
      }
      return tableBoxOptions.hidden ? null : (
        <ElTable
          v-loading={unref(getProps).loading}
          data={unref(getProps).data}
          {...setTableProps(tableBoxOptions, attrs)}
        >
          {{
            default: () => renderTableColumn(),
            ...tableSlots
          }}
        </ElTable>
      )
    }
    const renderTreeTableColumn = (columnsChildren: TableBoxColumns[]) => {
      const { tableBox } = unref(getProps)
      return columnsChildren.map((v) => {
        if (v.hidden) return null
        const props = { ...v } as any
        if (props.children) delete props.children

        const children = v.children

        const slots = {
          default: (...args: any[]) => {
            const data = args[0]
            return children && children.length
              ? renderTreeTableColumn(children)
              : v.slots && data
                ? v.slots(data)
                : get(data.row, v.prop)
          }
        }
        if (props?.slots?.header) {
          slots['header'] = (...args: any[]) => props.slots.header(...args)
        }

        return (
          <ElTableColumn
            align={v.align || tableBox.align}
            headerAlign={v.headerAlign || tableBox.headerAlign}
            {...props}
            prop={v.prop}
          >
            {slots}
          </ElTableColumn>
        )
      })
    }
    const renderTableColumn = () => {
      const { tableBox } = unref(getProps)
      return tableBox.columns && tableBox.columns.length > 0
        ? tableBox.columns.map((v: any) => {
            if (v.hidden || (tableBox.treeProps && tableBox.treeProps.children === v.prop))
              return null
            if (v.type === 'index') {
              return (
                <ElPageIndex
                  size={pageSizeRef.value}
                  current={currentPageRef.value}
                  fixed={v.fixed}
                  align={v.align || tableBox.align}
                  headerAlign={v.headerAlign || tableBox.headerAlign}
                  label={v.label}
                  minWidth={v.minWidth || v.width}
                />
              )
            } else if (v.type === 'selection') {
              return (
                <ElTableColumn
                  type="selection"
                  reserveSelection={tableBox.reserveSelection}
                  align={v.align || tableBox.align}
                  headerAlign={v.headerAlign || tableBox.headerAlign}
                  selectable={v.selectable}
                  width={v.width || v.minWidth}
                ></ElTableColumn>
              )
            } else {
              const props = { ...v } as any
              if (props.children) delete props.children

              const children = v.children
              const slots = {
                default: (...args: any[]) => {
                  const data = args[0]
                  return children && children.length
                    ? renderTreeTableColumn(children)
                    : v.slots && data
                      ? v.slots(data)
                      : get(data.row, v.prop)
                }
              }
              if (props?.slots?.header) {
                slots['header'] = (...args: any[]) => props.slots.header(...args)
              }
              return (
                <ElTableColumn
                  align={v.align || tableBox.align}
                  headerAlign={v.headerAlign || tableBox.headerAlign}
                  {...props}
                  prop={v.prop}
                >
                  {slots}
                </ElTableColumn>
              )
            }
          })
        : null
    }
    const renderPagination = (paginationBoxOptions: PaginationBox) => {
      if (!paginationBoxOptions) return null
      return paginationBoxOptions.hidden ? null : (
        <ElSpace direction="vertical" alignment="normal" size={10} class="w-[100%]">
          <ElRow justify="end">
            <ElPagination
              v-model:pageSize={pageSizeRef.value}
              v-model:currentPage={currentPageRef.value}
              page-sizes={paginationBoxOptions.pageSizes}
              layout="sizes, prev, pager, next, total, jumper"
              total={pageTotalRef.value}
              onUpdate:page-size={emitSizeChange}
              onUpdate:current-page={emitCurrentChange}
              small={
                unref(getProps) &&
                unref(getProps).tableBox &&
                unref(getProps).tableBox.size &&
                unref(getProps).tableBox.size === 'small'
              }
            />
          </ElRow>
        </ElSpace>
      )
    }
    return () => {
      return (
        <ElConfigProvider locale={unref(locale)}>
          <ElSpace
            direction={
              unref(getProps).spaceStyle && unref(getProps).spaceStyle.direction
                ? unref(getProps).spaceStyle.direction
                : 'vertical'
            }
            alignment={
              unref(getProps).spaceStyle && unref(getProps).spaceStyle.alignment
                ? unref(getProps).spaceStyle.alignment
                : 'normal'
            }
            size={
              unref(getProps).spaceStyle && unref(getProps).spaceStyle.size
                ? unref(getProps).spaceStyle.size
                : 'small'
            }
            class="w-[100%] flex-wrap"
          >
            {unref(getProps).searchBox && renderSearch(unref(getProps).searchBox)}
            {unref(getProps).toolBox && renderTool(unref(getProps).toolBox)}
            {unref(getProps).tableBox && renderTable(unref(getProps).tableBox)}
            {unref(getProps).paginationBox && renderPagination(unref(getProps).paginationBox)}
          </ElSpace>
        </ElConfigProvider>
      )
    }
  }
})
</script>
<style scoped lang="less">
// table列表搜索区域
.table-search-box {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: space-between;

  .left-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .right-wrapper {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .el-form {
    display: flex;
  }

  .el-form-item {
    margin-right: 10px;
    margin-bottom: 10px;

    & > :deep(.el-form-item__content) {
      .el-input {
        &.el-input--small {
          width: 158px;
        }

        &.el-input--default {
          width: 190px;
        }

        &.el-input--large {
          width: 190px;
        }
      }

      .el-radio-group {
        .el-radio {
          margin-right: 10px;
        }
      }

      .el-checkbox-group {
        .el-checkbox {
          margin-right: 10px;
        }
      }

      .el-input-number {
        &.el-input-number--small {
          width: 158px;
        }

        &.el-input-number--default {
          width: 190px;
        }

        &.el-input-number--large {
          width: 190px;
        }
      }
    }
  }
}
// table列表功能区域
.table-tools-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
