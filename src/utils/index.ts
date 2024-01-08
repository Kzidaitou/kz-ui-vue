// import type { Plugin } from 'vue'
import { find } from 'lodash-es'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

export const getCssVar = (prop: string, dom = document.documentElement) => {
  return getComputedStyle(dom).getPropertyValue(prop)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * URL解析
 */
export function getParamFromUrl(url: string) {
  const map: any = {}
  const paramsStr = url.split('?')[1]
  if (paramsStr) {
    const paramStrList = paramsStr.split('&')
    for (let i = 0; i < paramStrList.length; i++) {
      const param = paramStrList[i].split('=')
      map[param[0]] = param[1]
    }
  }
  return map
  // const obj: any = {}
  // const reg: any = /([^?=&]+)=([^?=&]+)/g
  // url.replace(reg, (...arg: any[]) => {
  //   obj[arg[1]] = arg[2]
  // })
  // return obj
}

/**
 * 下载文件
 * @param {String} fileType 文件类型
 * @param {String} fileName 文件名称
 * @param {Blob|String} innerHTML 内容或文件流
 */
export const downloadFile = (fileType: any, fileName?: any, innerHTML?: any) => {
  let contentHTMLType = ''
  if (['svg'].includes(fileType)) {
    contentHTMLType = 'image/svg+xml'
  } else if (['excel'].includes(fileType)) {
    contentHTMLType = 'application/vnd.ms-excel,charset=utf-8'
  }
  if (contentHTMLType) {
    const contentHTML = innerHTML ? innerHTML : ''
    const data = new Blob([contentHTML], {
      type: contentHTMLType
    })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.target = '_blank'
    link.download = fileName ? fileName : `${new Date().getTime()}.${fileType}`
    link.click()
    // if (typeof window.chrome !== 'undefined') {
    //   // Chrome
    //   const link = document.createElement('a')
    //   link.href = window.URL.createObjectURL(data)
    //   link.download = filename
    //   link.click()
    // } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
    //   // IE
    //   const blob = new Blob([data], { type: 'application/force-download' })
    //   window.navigator.msSaveBlob(blob, filename)
    // } else {
    //   // Firefox
    //   const file = new File([data], filename, { type: 'application/force-download' })
    //   window.open(URL.createObjectURL(file))
    // }
  }
}
/**
 * 从数组中筛选出需要的项目
 * @param {Array} array 目标数组池
 * @param {any} val 筛选项目
 */
export const getLabelByValue = (array: any, val: any) => {
  if (Array.isArray(val)) {
    let label = ''
    val.forEach((it, i) => {
      const obj = find(array, { value: it })
      if (i === 0) {
        label = obj ? obj.label : ''
      } else {
        label = obj ? label + ',' + obj.label : ''
      }
    })
    return label ? label : '-'
  } else {
    const obj = find(array, { value: val })
    return obj ? obj.label : '-'
  }
}

/**
 * 用特定符号显示，默认为*
 * @param {String} str 字符串
 * @param {String} label 替换字符
 * @param {Number} startIndex 开始位置
 * @param {Number} endIndex 结束位置
 * @returns
 */
export const showTextWithLabel = (
  str: string,
  label: string = '*',
  startIndex: number = 0,
  endIndex?: number
) => {
  const _array: any = []
  if (str && str.split('').length > 0) {
    str.split('').forEach((it, i) => {
      if (i >= startIndex && (startIndex || startIndex === 0)) {
        if (endIndex || endIndex === 0) {
          if (i <= endIndex) {
            _array.push(label)
          } else {
            _array.push(it)
          }
        } else {
          _array.push(label)
        }
      } else {
        _array.push(it)
      }
    })
  }
  return _array.join('')
}
