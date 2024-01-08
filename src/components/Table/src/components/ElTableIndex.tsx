import { defineComponent } from 'vue'
import { ElTableColumn } from 'element-plus'

export default defineComponent({
  props: {
    size: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      default: '序号'
    },
    minWidth: {
      type: [Number, String],
      default: 60
    },
    fixed: {
      type: [String, Boolean],
      default: false
    },
    align: {
      type: String,
      default: 'left'
    },
    headerAlign: {
      type: String,
      default: 'left'
    }
  },
  setup(props) {
    const getTableIndex = (index: number) => {
      return props.size * (props.current - 1) + index + 1
    }
    return () => (
      <ElTableColumn
        type="index"
        label={props.label}
        min-width={props.minWidth}
        v-slots={{
          default: ({ $index }) => <span>{getTableIndex($index)}</span>
        }}
        fixed={props.fixed}
        align={props.align}
        headerAlign={props.headerAlign}
      ></ElTableColumn>
    )
  }
})
