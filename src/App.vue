<script setup lang="ts">
import { Table } from './components/Table/'

import { computed, h, ref } from 'vue'
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'

const loading = ref(false)
const tableData = ref<Array<any>>([{ a: 1 }])
const tableConfig = computed(() => {
  return {
    spaceStyle: {
      size: 10,
      direction: 'vertical',
      alignment: 'normal'
    },

    searchBox: {
      hidden: false,
      visibleExpandBtn: true,
      resetBtn: true,
      options: [
        {
          component: 'Input',
          field: 'appName',
          label: '',
          collapseable: false,
          componentProps: {
            placeholder: '应用名称',
            filterable: true,
            on: {
              change: (_val: any) => {}
            }
          }
        }
      ],
      searchMethod: () => {}
    },
    toolBox: {
      hidden: false,
      options: [
        {
          component: 'Button',
          slots: {
            default: () => {
              return '新增版本'
            },
            icon: () => {
              return useIcon({ icon: 'ep:plus', size: 12 })
            }
          },
          on: {
            click: () => {}
          }
        },
        {
          component: 'Button',
          plain: true,
          disabled: false,
          slots: {
            default: () => {
              return '版本回滚&切换'
            }
          },
          on: {
            click: () => {}
          }
        }
      ]
    },
    tableBox: {
      hidden: false,
      showOverflowTooltip: true,
      columns: [
        {
          type: 'column',
          prop: 'version',
          label: '版本号',
          minWidth: '100',
          fixed: 'left',
          sortable: true
        },
        {
          type: 'column',
          prop: 'versionRemarks',
          label: '版本描述',
          minWidth: '200',
          fixed: false
        },
        {
          type: 'column',
          prop: 'releaseUser',
          label: '发布人',
          minWidth: '100',
          fixed: false
        },
        {
          type: 'column',
          prop: 'releaseTime',
          label: '发布时间',
          minWidth: '180',
          sortable: true
        },
        {
          type: 'column',
          prop: 'tools',
          label: '操作',
          width: '180',
          fixed: 'right',
          headerAlign: 'left',
          align: 'left',
          slots: (_data: any) => {
            return h('div', {}, [
              h(
                ElButton,
                {
                  type: 'primary',
                  text: true,
                  class: 'ml-[0] !p-[0]',
                  size: 'small'
                },
                {
                  default: () => '详情'
                }
              )
            ])
          }
        }
      ]
    },
    paginationBox: {
      hidden: false
    }
  }
})
</script>

<template>
  <Table
    :loading="loading"
    :spaceStyle="tableConfig.spaceStyle"
    :searchBox="tableConfig.searchBox"
    :toolBox="tableConfig.toolBox"
    :tableBox="tableConfig.tableBox"
    :paginationBox="tableConfig.paginationBox"
    :data="tableData"
  />
</template>

<style scoped></style>
