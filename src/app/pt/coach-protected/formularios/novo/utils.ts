// Utilitários compartilhados para formulários Coach
// Exportados aqui para evitar problemas com parênteses em imports
// Re-exporta de coach/(protected)/formularios/novo/page

export type { FieldType, Field } from '../../coach/(protected)/formularios/novo/page'
export { 
  TooltipButton,
  getFieldTypeLabel,
  getFieldDescription,
  getFieldPlaceholderExample,
  getPlaceholderExample,
  getHelpTextExample,
  renderFieldPreview,
  ModalEditarCampo
} from '../../coach/(protected)/formularios/novo/page'
