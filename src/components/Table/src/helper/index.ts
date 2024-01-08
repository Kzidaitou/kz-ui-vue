import { firstUpperCase, humpToDash } from '@/utils'
import { isFunction } from '@/utils/is'
import { SearchBoxOption, TableBox, ToolBoxOption } from '../types'

export const setIndex = (reserveIndex: boolean, index: number, size: number, current: number) => {
  const newIndex = index + 1
  if (reserveIndex) {
    return size * (current - 1) + newIndex
  } else {
    return newIndex
  }
}

/**
 *
 * @param item 传入的组件属性
 * @returns 默认添加 clearable 属性
 */
export const setComponentProps = (item: SearchBoxOption): Recordable => {
  // const notNeedClearable = ['ColorPicker']
  // 拆分事件并组合
  const onEvents = (item?.componentProps as any)?.on || {}
  const newOnEvents: Recordable = {}

  for (const key in onEvents) {
    if (onEvents[key]) {
      newOnEvents[`on${firstUpperCase(key)}`] = (...args: any[]) => {
        onEvents[key](...args)
      }
    }
  }

  const componentProps: Recordable = {
    clearable: true,
    ...item.componentProps,
    ...newOnEvents
  }
  // 需要删除额外的属性
  if (componentProps.slots) {
    delete componentProps.slots
  }
  if (componentProps.on) {
    delete componentProps.on
  }
  return componentProps
}

/**
 *
 * @param formModel 表单数据
 * @param slotsProps 插槽属性
 */
export const setItemComponentSlots = (slotsProps: Recordable = {}): Recordable => {
  const slotObj: Recordable = {}
  for (const key in slotsProps) {
    if (slotsProps[key]) {
      if (isFunction(slotsProps[key])) {
        slotObj[humpToDash(key)] = (...args: any[]) => {
          return slotsProps[key]?.(...args)
        }
      } else {
        slotObj[humpToDash(key)] = () => {
          return slotsProps[key]
        }
      }
    }
  }
  return slotObj
}

/**
 *
 * @param item 传入的组件属性
 * @returns 默认添加 size="default" 属性
 */
export const setTableProps = (tableBoxOptions: TableBox, attrs: any): Recordable => {
  // 拆分事件并组合
  const onEvents = (tableBoxOptions as any)?.on || {}
  const newOnEvents: Recordable = {}

  for (const key in onEvents) {
    if (onEvents[key]) {
      newOnEvents[`on${firstUpperCase(key)}`] = (...args: any[]) => {
        onEvents[key](...args)
      }
    }
  }
  if (!tableBoxOptions.treeProps) {
    tableBoxOptions.treeProps = { hasChildren: 'hasChildren', children: 'children' }
  }
  const componentProps: Recordable = {
    ...attrs,
    size: 'default',
    ...tableBoxOptions,
    ...newOnEvents
  }
  // 需要删除额外的属性
  if (componentProps.columns) {
    delete componentProps.columns
  }
  if (componentProps.slots) {
    delete componentProps.slots
  }
  if (componentProps.on) {
    delete componentProps.on
  }
  return componentProps
}
/**
 *
 * @param item 传入的组件属性
 * @returns 默认添加 size="default" type="primary" 属性
 */
export const setToolProps = (ToolBoxOptions: ToolBoxOption): Recordable => {
  // 拆分事件并组合
  const onEvents = (ToolBoxOptions as any)?.on || {}
  const newOnEvents: Recordable = {}

  for (const key in onEvents) {
    if (onEvents[key]) {
      newOnEvents[`on${firstUpperCase(key)}`] = (...args: any[]) => {
        onEvents[key](...args)
      }
    }
  }
  const componentProps: Recordable = {
    size: 'default',
    type: 'primary',
    ...ToolBoxOptions,
    ...newOnEvents
  }
  // 需要删除额外的属性
  if (componentProps.component) {
    delete componentProps.component
  }
  if (componentProps.slots) {
    delete componentProps.slots
  }
  if (componentProps.on) {
    delete componentProps.on
  }
  return componentProps
}
