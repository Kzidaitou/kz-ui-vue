import Table from './src/Table.vue'
import { ElTable } from 'element-plus'
import { TableBoxColumns, TableSetProps } from './src/types'

export type {
  TableBoxColumns,
  TableSlotDefault,
  PaginationBox,
  TableSetProps,
  TableProps
} from './src/types'

export interface TableExpose {
  setProps: (props: Recordable) => void
  setColumn: (columnProps: TableSetProps[]) => void
  addColumn: (column: TableBoxColumns, index?: number) => void
  delColumn: (field: string) => void
  elTableRef: ComponentRef<typeof ElTable>
}
export { Table }
