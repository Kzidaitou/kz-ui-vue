<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useIcon } from '@/hooks/web/useIcon'
import { propTypes } from '@/utils/propTypes'
import { PropType } from 'vue'

const emit = defineEmits(['expand', 'reset', 'search'])

defineProps({
  showSearch: propTypes.bool.def(true),
  searchText: propTypes.string.def('搜索'),
  showReset: propTypes.bool.def(true),
  resetText: propTypes.string.def('重置'),
  showExpand: propTypes.bool.def(true),
  visible: propTypes.bool.def(false),
  size: {
    type: String as PropType<'' | 'default' | 'small' | 'large' | never>,
    defalut: () => {
      return 'default'
    }
  },
  resetDisabled: propTypes.bool.def(false)
})
const onExpand = () => {
  emit('expand')
}
const onReset = () => {
  emit('reset')
}
const onSearch = () => {
  emit('search')
}
</script>

<template>
  <div class="right-wrapper">
    <ElButton
      v-if="showExpand"
      :icon="
        useIcon({
          icon: visible ? 'ep:arrow-up' : 'ep:arrow-down',
          size: size === 'small' ? 12 : 16
        })
      "
      text
      @click="onExpand"
      :size="size"
    >
      {{ visible ? '收起' : '展开' }}
    </ElButton>
    <ElButton
      v-if="showSearch"
      @click="onSearch"
      type="primary"
      :icon="useIcon({ icon: 'ep:search', size: size === 'small' ? 12 : 16 })"
      :size="size"
    >
      {{ searchText ? searchText : '搜索' }}
    </ElButton>
    <ElButton
      v-if="showReset"
      @click="onReset"
      type="primary"
      :icon="useIcon({ icon: 'ep:refresh-right', size: size === 'small' ? 12 : 16 })"
      plain
      :disabled="resetDisabled"
      :size="size"
    >
      {{ resetText ? resetText : '重置' }}
    </ElButton>
  </div>
</template>
