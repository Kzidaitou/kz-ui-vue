import 'vue/jsx'

// 引入unocss
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

import { createApp } from 'vue'

import App from './App.vue'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  setupGlobCom(app)

  setupElementPlus(app)

  app.mount('#app')
}

setupAll()
