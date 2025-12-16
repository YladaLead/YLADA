// Utilitários compartilhados para formulários Coach
// Localizado aqui para evitar problemas com parênteses em imports

import React, { useState } from 'react'

export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'time' | 'email' | 'tel' | 'yesno' | 'range' | 'file'

export interface Field {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  unit?: string
  helpText?: string
}

export function TooltipButton({ 
  children, 
  onClick, 
  className, 
  tooltip 
}: { 
  children: React.ReactNode
  onClick: () => void
  className: string
  tooltip: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={className}
      >
        {children}
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs whitespace-normal">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

export function getFieldTypeLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Texto',
    textarea: 'Texto Longo',
    select: 'Seleção',
    radio: 'Múltipla Escolha',
    checkbox: 'Caixa de Seleção',
    number: 'Número',
    date: 'Data',
    time: 'Hora',
    email: 'E-mail',
    tel: 'Telefone',
    yesno: 'Sim/Não',
    range: 'Escala',
    file: 'Upload de Arquivo'
  }
  return labels[type] || type
}

export function getFieldDescription(type: FieldType): string {
  const descriptions: Record<FieldType, string> = {
    text: 'Campo de texto curto para nomes, objetivos, respostas breves',
    textarea: 'Campo de texto longo para observações, históricos, descrições detalhadas',
    select: 'Lista suspensa - cliente escolhe uma opção de uma lista',
    radio: 'Múltipla escolha - cliente escolhe apenas UMA opção entre várias',
    checkbox: 'Caixas de seleção - cliente pode marcar VÁRIAS opções',
    number: 'Campo numérico para peso, altura, medidas, quantidades (pode ter unidade como kg, cm)',
    date: 'Seletor de data com calendário visual - ao clicar, abre um calendário para escolher a data. Ideal para data de nascimento, início de programa, consultas, prazos',
    time: 'Seletor de hora com relógio visual - ao clicar, abre um seletor de hora. Ideal para horários de refeições, treinos, medicações, lembretes',
    email: 'Campo de e-mail com validação automática',
    tel: 'Campo de telefone com DDI (código do país) e formatação automática',
    yesno: 'Pergunta simples Sim/Não - ideal para questões diretas como "Pratica exercícios regularmente?"',
    range: 'Escala deslizante (slider) para notas de 1-10, níveis de energia, dor, satisfação, etc',
    file: 'Upload de arquivo para fotos, documentos, exames médicos'
  }
  return descriptions[type] || ''
}

export function getFieldPlaceholderExample(type: FieldType): string {
  const examples: Record<FieldType, string> = {
    text: 'Ex: Nome completo',
    textarea: 'Ex: Descreva seu objetivo principal',
    select: 'Ex: Objetivo principal',
    radio: 'Ex: Tipo de atividade física',
    checkbox: 'Ex: Sintomas apresentados',
    number: 'Ex: Peso atual',
    date: 'Ex: Data de nascimento',
    time: 'Ex: Horário do café da manhã',
    email: 'Ex: Seu melhor e-mail',
    tel: 'Ex: Telefone para contato',
    yesno: 'Ex: Pratica exercícios regularmente?',
    range: 'Ex: Nível de energia (1-10)',
    file: 'Ex: Foto de perfil'
  }
  return examples[type] || 'Ex: Nome do campo'
}

export function getPlaceholderExample(type: FieldType): string {
  const examples: Record<FieldType, string> = {
    text: 'Ex: Digite seu nome completo',
    textarea: 'Ex: Descreva em detalhes...',
    select: 'Ex: Selecione uma opção',
    radio: '',
    checkbox: '',
    number: 'Ex: 70',
    date: 'Clique para abrir o calendário',
    time: 'Clique para abrir o seletor de hora',
    email: 'Ex: seu@email.com',
    tel: 'Ex: (11) 99999-9999',
    yesno: '',
    range: '',
    file: ''
  }
  return examples[type] || 'Texto que aparece dentro do campo'
}

export function getHelpTextExample(type: FieldType): string {
  const examples: Record<FieldType, string> = {
    text: 'Ex: Digite seu nome completo como aparece no documento',
    textarea: 'Ex: Seja o mais detalhado possível',
    select: 'Ex: Escolha a opção que melhor descreve sua situação',
    radio: 'Ex: Selecione apenas uma opção',
    checkbox: 'Ex: Marque todas as opções que se aplicam',
    number: 'Ex: Digite seu peso atual em quilogramas',
    date: 'Ex: Clique no calendário para escolher a data (ex: data de nascimento, início do programa)',
    time: 'Ex: Clique no relógio para escolher o horário (ex: horário das refeições, treinos)',
    email: 'Ex: Usaremos este e-mail para enviar informações importantes',
    tel: 'Ex: Inclua o DDD',
    yesno: 'Ex: Responda Sim ou Não',
    range: 'Ex: Arraste o indicador para escolher seu nível',
    file: 'Ex: Formatos aceitos: JPG, PNG, PDF (máx. 5MB)'
  }
  return examples[type] || 'Ex: Texto de ajuda para o cliente'
}

export function renderFieldPreview(field: Field) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
        />
      )
    case 'textarea':
      return (
        <textarea
          placeholder={field.placeholder}
          rows={4}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white resize-none"
        />
      )
    case 'select':
      return (
        <select
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option>Selecione uma opção</option>
          {field.options?.map((opt, idx) => (
            <option key={idx}>{opt}</option>
          ))}
        </select>
      )
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input type="radio" disabled className="text-blue-600" />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input type="checkbox" disabled className="text-blue-600" />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'number':
      return (
        <div className="relative">
          <input
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            disabled
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white ${field.unit ? 'pr-12' : ''}`}
          />
          {field.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
              {field.unit}
            </span>
          )}
        </div>
      )
    case 'date':
      return (
        <div className="relative">
          <input
            type="date"
            disabled
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white cursor-pointer"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )
    case 'time':
      return (
        <div className="relative">
          <input
            type="time"
            disabled
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white cursor-pointer"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )
    case 'yesno':
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name={`yesno-${field.id}`} value="sim" disabled className="text-blue-600" />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name={`yesno-${field.id}`} value="nao" disabled className="text-blue-600" />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
      )
    case 'range':
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={field.min || 1}
            max={field.max || 10}
            step={field.step || 1}
            disabled
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{field.min || 1}</span>
            <span>{field.max || 10}</span>
          </div>
        </div>
      )
    case 'file':
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Clique para fazer upload</p>
          <input
            type="file"
            disabled
            className="hidden"
          />
        </div>
      )
    default:
      return null
  }
}

// Modal simplificado - versão básica
export function ModalEditarCampo({ campo, onChange, onSalvar, onCancelar }: {
  campo: Field
  onChange: (campo: Field) => void
  onSalvar: () => void
  onCancelar: () => void
}) {
  // Implementação básica - pode ser expandida se necessário
  return null
}
