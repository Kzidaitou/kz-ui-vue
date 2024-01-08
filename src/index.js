import { Table } from './components/Table'
import { Icon } from './components/Icon'

import { useIcon } from '@/hooks/web/useIcon'

export { Table, Icon, useIcon }

const components = [Table, Icon]
const install = (App, options) => {
  components.forEach((component) => {
    App.component(component.name || component.__name, component)
  })
}

export default { install }
