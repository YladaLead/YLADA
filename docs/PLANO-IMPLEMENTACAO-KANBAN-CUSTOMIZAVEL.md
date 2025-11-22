# 📋 Plano de Implementação - Kanban Customizável para Nutri

## 🎯 Objetivo
Permitir que nutricionistas personalizem o Kanban de clientes: adicionar/remover/renomear colunas, escolher campos do card, e definir cores.

---

## 📊 Funcionalidades do MVP

### ✅ Customizável
1. **Colunas**
   - Adicionar novas colunas
   - Remover colunas existentes
   - Renomear colunas
   - Reordenar colunas (arrastar)
   - Escolher cor de cada coluna
   - Definir descrição de cada coluna

2. **Campos do Card**
   - Mostrar/ocultar campos:
     - Nome (sempre visível)
     - Telefone
     - Email
     - Objetivo
     - Próxima consulta (data/hora)
     - Última consulta (data)
     - Tags
     - Status badge

3. **Ações Rápidas no Card**
   - Mostrar/ocultar botões:
     - WhatsApp
     - Ver perfil completo

---

## 🗄️ FASE 1: BANCO DE DADOS

### 1.1 Criar Tabela `kanban_config`

```sql
-- migrations/add-kanban-config.sql

CREATE TABLE IF NOT EXISTS kanban_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL DEFAULT 'nutri', -- 'nutri', 'coach', 'wellness'
  
  -- Configuração de colunas
  columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Estrutura: [
  --   {
  --     "id": "uuid",
  --     "value": "ativa",
  --     "label": "Ativa",
  --     "description": "Em atendimento",
  --     "color": "border-green-200 bg-green-50",
  --     "order": 1
  --   }
  -- ]
  
  -- Configuração de campos do card
  card_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Estrutura: [
  --   { "field": "telefone", "visible": true },
  --   { "field": "email", "visible": false },
  --   { "field": "objetivo", "visible": true },
  --   { "field": "proxima_consulta", "visible": true },
  --   { "field": "ultima_consulta", "visible": true },
  --   { "field": "tags", "visible": false },
  --   { "field": "status_badge", "visible": true }
  -- ]
  
  -- Configuração de ações rápidas
  quick_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Estrutura: [
  --   { "action": "whatsapp", "visible": true },
  --   { "action": "ver_perfil", "visible": true }
  -- ]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, area)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_kanban_config_user_area 
  ON kanban_config(user_id, area);

-- RLS
ALTER TABLE kanban_config ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários só veem/editam sua própria configuração
CREATE POLICY "Users can manage own kanban config"
  ON kanban_config FOR ALL
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_kanban_config_updated_at
  BEFORE UPDATE ON kanban_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 1.2 Criar Configuração Padrão para Usuários Existentes

```sql
-- Inserir configuração padrão para usuários que já têm clientes
INSERT INTO kanban_config (user_id, area, columns, card_fields, quick_actions)
SELECT 
  DISTINCT user_id,
  'nutri' as area,
  '[
    {"id": "lead", "value": "lead", "label": "Contato", "description": "Entrou agora, precisa de acolhimento", "color": "border-blue-200 bg-blue-50", "order": 1},
    {"id": "pre_consulta", "value": "pre_consulta", "label": "Pré-Consulta", "description": "Já falou com você, falta agendar", "color": "border-yellow-200 bg-yellow-50", "order": 2},
    {"id": "ativa", "value": "ativa", "label": "Ativa", "description": "Em atendimento e com plano ativo", "color": "border-green-200 bg-green-50", "order": 3},
    {"id": "pausa", "value": "pausa", "label": "Pausa", "description": "Deu um tempo, precisa nutrir relação", "color": "border-orange-200 bg-orange-50", "order": 4},
    {"id": "finalizada", "value": "finalizada", "label": "Finalizada", "description": "Concluiu o ciclo com você", "color": "border-gray-200 bg-gray-50", "order": 5}
  ]'::jsonb as columns,
  '[
    {"field": "telefone", "visible": true},
    {"field": "email", "visible": false},
    {"field": "objetivo", "visible": true},
    {"field": "proxima_consulta", "visible": true},
    {"field": "ultima_consulta", "visible": true},
    {"field": "tags", "visible": false},
    {"field": "status_badge", "visible": true}
  ]'::jsonb as card_fields,
  '[
    {"action": "whatsapp", "visible": true},
    {"action": "ver_perfil", "visible": true}
  ]'::jsonb as quick_actions
FROM clients
WHERE user_id IS NOT NULL
ON CONFLICT (user_id, area) DO NOTHING;
```

---

## 🔌 FASE 2: APIs BACKEND

### 2.1 GET `/api/nutri/kanban/config`

```typescript
// src/app/api/nutri/kanban/config/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: config, error } = await supabaseAdmin
      .from('kanban_config')
      .select('*')
      .eq('user_id', user.id)
      .eq('area', 'nutri')
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // Se não existe, retornar padrão
    if (!config) {
      return NextResponse.json({
        success: true,
        data: {
          config: {
            columns: [
              { id: 'lead', value: 'lead', label: 'Contato', description: 'Entrou agora, precisa de acolhimento', color: 'border-blue-200 bg-blue-50', order: 1 },
              { id: 'pre_consulta', value: 'pre_consulta', label: 'Pré-Consulta', description: 'Já falou com você, falta agendar', color: 'border-yellow-200 bg-yellow-50', order: 2 },
              { id: 'ativa', value: 'ativa', label: 'Ativa', description: 'Em atendimento e com plano ativo', color: 'border-green-200 bg-green-50', order: 3 },
              { id: 'pausa', value: 'pausa', label: 'Pausa', description: 'Deu um tempo, precisa nutrir relação', color: 'border-orange-200 bg-orange-50', order: 4 },
              { id: 'finalizada', value: 'finalizada', label: 'Finalizada', description: 'Concluiu o ciclo com você', color: 'border-gray-200 bg-gray-50', order: 5 }
            ],
            card_fields: [
              { field: 'telefone', visible: true },
              { field: 'email', visible: false },
              { field: 'objetivo', visible: true },
              { field: 'proxima_consulta', visible: true },
              { field: 'ultima_consulta', visible: true },
              { field: 'tags', visible: false },
              { field: 'status_badge', visible: true }
            ],
            quick_actions: [
              { action: 'whatsapp', visible: true },
              { action: 'ver_perfil', visible: true }
            ]
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: { config }
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar config do Kanban:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configuração', details: error.message },
      { status: 500 }
    )
  }
}
```

### 2.2 PUT `/api/nutri/kanban/config`

```typescript
// src/app/api/nutri/kanban/config/route.ts (adicionar PUT)
export async function PUT(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { columns, card_fields, quick_actions } = body

    if (!columns || !Array.isArray(columns)) {
      return NextResponse.json(
        { error: 'columns é obrigatório e deve ser um array' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('kanban_config')
      .upsert(
        {
          user_id: user.id,
          area: 'nutri',
          columns: columns || [],
          card_fields: card_fields || [],
          quick_actions: quick_actions || [],
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id,area'
        }
      )
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: { config: data }
    })
  } catch (error: any) {
    console.error('❌ Erro ao salvar config do Kanban:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar configuração', details: error.message },
      { status: 500 }
    )
  }
}
```

---

## 🎨 FASE 3: COMPONENTES FRONTEND

### 3.1 Componente: `KanbanConfigModal.tsx`

```typescript
// src/components/nutri/KanbanConfigModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Column {
  id: string
  value: string
  label: string
  description: string
  color: string
  order: number
}

interface CardField {
  field: string
  visible: boolean
}

interface QuickAction {
  action: string
  visible: boolean
}

interface KanbanConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: { columns: Column[], card_fields: CardField[], quick_actions: QuickAction[] }) => void
  initialConfig?: {
    columns: Column[]
    card_fields: CardField[]
    quick_actions: QuickAction[]
  }
}

export default function KanbanConfigModal({
  isOpen,
  onClose,
  onSave,
  initialConfig
}: KanbanConfigModalProps) {
  const [columns, setColumns] = useState<Column[]>(initialConfig?.columns || [])
  const [cardFields, setCardFields] = useState<CardField[]>(initialConfig?.card_fields || [])
  const [quickActions, setQuickActions] = useState<QuickAction[]>(initialConfig?.quick_actions || [])
  const [newColumnLabel, setNewColumnLabel] = useState('')
  const [newColumnDescription, setNewColumnDescription] = useState('')
  const [newColumnColor, setNewColumnColor] = useState('border-blue-200 bg-blue-50')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddColumn = () => {
    if (!newColumnLabel.trim()) return

    const newColumn: Column = {
      id: `custom-${Date.now()}`,
      value: `custom_${Date.now()}`,
      label: newColumnLabel,
      description: newColumnDescription || '',
      color: newColumnColor,
      order: columns.length + 1
    }

    setColumns([...columns, newColumn])
    setNewColumnLabel('')
    setNewColumnDescription('')
    setNewColumnColor('border-blue-200 bg-blue-50')
  }

  const handleRemoveColumn = (columnId: string) => {
    // Não permitir remover se for uma das colunas padrão essenciais
    const defaultColumns = ['lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada']
    const column = columns.find(c => c.id === columnId)
    if (column && defaultColumns.includes(column.value)) {
      alert('Não é possível remover colunas padrão do sistema.')
      return
    }
    setColumns(columns.filter(c => c.id !== columnId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = columns.findIndex(c => c.id === active.id)
    const newIndex = columns.findIndex(c => c.id === over.id)

    const newColumns = [...columns]
    const [removed] = newColumns.splice(oldIndex, 1)
    newColumns.splice(newIndex, 0, removed)

    // Atualizar ordem
    const reordered = newColumns.map((col, index) => ({
      ...col,
      order: index + 1
    }))

    setColumns(reordered)
  }

  const handleSave = () => {
    onSave({
      columns,
      card_fields: cardFields,
      quick_actions: quickActions
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Customizar Kanban</h2>
          <p className="text-gray-600 mt-1">Personalize suas colunas e campos do card</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Seção: Colunas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Colunas</h3>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columns.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {columns.map((column) => (
                    <SortableColumnItem
                      key={column.id}
                      column={column}
                      onRemove={handleRemoveColumn}
                      onUpdate={(id, updates) => {
                        setColumns(columns.map(c => c.id === id ? { ...c, ...updates } : c))
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Adicionar Nova Coluna */}
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Adicionar Nova Coluna</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newColumnLabel}
                  onChange={(e) => setNewColumnLabel(e.target.value)}
                  placeholder="Nome da coluna (ex: Aguardando Exames)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newColumnDescription}
                  onChange={(e) => setNewColumnDescription(e.target.value)}
                  placeholder="Descrição (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={newColumnColor}
                  onChange={(e) => setNewColumnColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="border-blue-200 bg-blue-50">Azul</option>
                  <option value="border-green-200 bg-green-50">Verde</option>
                  <option value="border-yellow-200 bg-yellow-50">Amarelo</option>
                  <option value="border-orange-200 bg-orange-50">Laranja</option>
                  <option value="border-purple-200 bg-purple-50">Roxo</option>
                  <option value="border-pink-200 bg-pink-50">Rosa</option>
                  <option value="border-gray-200 bg-gray-50">Cinza</option>
                </select>
                <button
                  onClick={handleAddColumn}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  ➕ Adicionar Coluna
                </button>
              </div>
            </div>
          </div>

          {/* Seção: Campos do Card */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campos do Card</h3>
            <div className="space-y-2">
              {cardFields.map((field) => (
                <label key={field.field} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-700">
                    {field.field === 'telefone' && '📞 Telefone'}
                    {field.field === 'email' && '📧 Email'}
                    {field.field === 'objetivo' && '🎯 Objetivo'}
                    {field.field === 'proxima_consulta' && '📅 Próxima Consulta'}
                    {field.field === 'ultima_consulta' && '🕐 Última Consulta'}
                    {field.field === 'tags' && '🏷️ Tags'}
                    {field.field === 'status_badge' && '🏷️ Badge de Status'}
                  </span>
                  <input
                    type="checkbox"
                    checked={field.visible}
                    onChange={(e) => {
                      setCardFields(cardFields.map(f => 
                        f.field === field.field ? { ...f, visible: e.target.checked } : f
                      ))
                    }}
                    className="w-5 h-5 text-blue-600"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Seção: Ações Rápidas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <label key={action.action} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-700">
                    {action.action === 'whatsapp' && '💬 WhatsApp'}
                    {action.action === 'ver_perfil' && '👁️ Ver Perfil'}
                  </span>
                  <input
                    type="checkbox"
                    checked={action.visible}
                    onChange={(e) => {
                      setQuickActions(quickActions.map(a => 
                        a.action === action.action ? { ...a, visible: e.target.checked } : a
                      ))
                    }}
                    className="w-5 h-5 text-blue-600"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Salvar Configuração
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar para item de coluna arrastável
function SortableColumnItem({
  column,
  onRemove,
  onUpdate
}: {
  column: Column
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<Column>) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        ⋮⋮
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={column.label}
          onChange={(e) => onUpdate(column.id, { label: e.target.value })}
          className="font-semibold text-gray-900 border-none focus:outline-none focus:ring-0 p-0"
        />
        <input
          type="text"
          value={column.description}
          onChange={(e) => onUpdate(column.id, { description: e.target.value })}
          className="text-xs text-gray-500 border-none focus:outline-none focus:ring-0 p-0 mt-1 w-full"
          placeholder="Descrição..."
        />
      </div>
      <select
        value={column.color}
        onChange={(e) => onUpdate(column.id, { color: e.target.value })}
        className="text-xs border border-gray-300 rounded px-2 py-1"
      >
        <option value="border-blue-200 bg-blue-50">Azul</option>
        <option value="border-green-200 bg-green-50">Verde</option>
        <option value="border-yellow-200 bg-yellow-50">Amarelo</option>
        <option value="border-orange-200 bg-orange-50">Laranja</option>
        <option value="border-purple-200 bg-purple-50">Roxo</option>
        <option value="border-pink-200 bg-pink-50">Rosa</option>
        <option value="border-gray-200 bg-gray-50">Cinza</option>
      </select>
      <button
        onClick={() => onRemove(column.id)}
        className="text-red-600 hover:text-red-700"
      >
        🗑️
      </button>
    </div>
  )
}
```

### 3.2 Atualizar `kanban/page.tsx`

- Carregar configuração do usuário ao montar
- Renderizar colunas dinamicamente baseado na config
- Renderizar campos do card baseado na config
- Adicionar botão "⚙️ Customizar" no header
- Abrir modal de configuração

---

## ✅ FASE 4: TESTES E VALIDAÇÃO

1. Testar criação de coluna customizada
2. Testar remoção de coluna (exceto padrões)
3. Testar reordenação de colunas
4. Testar mostrar/ocultar campos do card
5. Testar persistência da configuração
6. Testar com múltiplos usuários (isolamento)

---

## 📝 RESUMO

- **1 tabela:** `kanban_config`
- **2 endpoints:** GET e PUT `/api/nutri/kanban/config`
- **1 componente:** `KanbanConfigModal.tsx`
- **1 atualização:** `kanban/page.tsx`

**Estimativa:** 2-3 dias de desenvolvimento

