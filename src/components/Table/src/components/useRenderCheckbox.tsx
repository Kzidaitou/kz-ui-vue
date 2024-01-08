import { SearchBoxOption } from '../types'
import { ComponentNameEnum, CheckboxGroupComponentProps } from '../types/form'
import { ElCheckbox, ElCheckboxButton } from 'element-plus'
import { defineComponent } from 'vue'

export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (item: SearchBoxOption) => {
    // 如果有别名，就取别名
    const componentProps = item?.componentProps as CheckboxGroupComponentProps
    const valueAlias = componentProps?.props?.value || 'value'
    const labelAlias = componentProps?.props?.label || 'label'
    const disabledAlias = componentProps?.props?.disabled || 'disabled'
    const Com = (
      item.component === ComponentNameEnum.CHECKBOX_GROUP ? ElCheckbox : ElCheckboxButton
    ) as ReturnType<typeof defineComponent>
    return componentProps?.options?.map((option) => {
      const { value, ...other } = option
      return (
        <Com
          {...other}
          disabled={option[disabledAlias || 'disabled']}
          label={option[valueAlias || 'value']}
        >
          {option[labelAlias || 'label']}
        </Com>
      )
    })
  }

  return {
    renderCheckboxOptions
  }
}
