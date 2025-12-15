# 🔄 ESTRUTURA GENÉRICA DE IMPORTAÇÃO DE CLIENTES

## 🎯 OBJETIVO
Criar um sistema de importação unificado que funcione para todos os perfis (coach, nutri, wellness) e aceite múltiplos formatos (Excel, CSV, JSON).

---

## 📊 ANÁLISE DA ESTRUTURA ATUAL

### ✅ O que já existe:
- **Componente:** `ImportClientsModal.tsx` (específico para coach)
- **APIs:** 
  - `/api/c/import/process` (alias genérico)
  - `/api/coach/import/process` (específico)
  - `/api/nutri/import/process` (específico)
- **Bibliotecas:**
  - `import-detection.ts` (detecção automática)
  - `import-normalizer.ts` (normalização de dados)
- **Formato suportado:** Excel/CSV com mapeamento de campos

### ❌ O que falta:
- Suporte para JSON estruturado
- Componente genérico reutilizável
- API unificada que detecta perfil automaticamente
- Suporte para múltiplos formatos simultâneos

---

## 🏗️ PROPOSTA DE ESTRUTURA GENÉRICA

### 1. ARQUITETURA DE CAMADAS

```
┌─────────────────────────────────────────┐
│   COMPONENTE GENÉRICO (UI)              │
│   ImportClientsModal (genérico)         │
│   - Aceita: Excel, CSV, JSON            │
│   - Detecta perfil automaticamente      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   CAMADA DE PROCESSAMENTO               │
│   - Detecção de formato                  │
│   - Normalização de dados               │
│   - Validação                           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   API UNIFICADA                         │
│   /api/import/process                   │
│   - Detecta perfil do usuário           │
│   - Roteia para handler específico      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│   HANDLERS ESPECÍFICOS                  │
│   - CoachHandler                        │
│   - NutriHandler                        │
│   - WellnessHandler                     │
└─────────────────────────────────────────┘
```

---

## 📁 ESTRUTURA DE ARQUIVOS PROPOSTA

```
src/
├── components/
│   └── shared/
│       └── ImportClientsModal.tsx          # Componente genérico
│
├── lib/
│   ├── import/
│   │   ├── detection.ts                    # Detecção de formato
│   │   ├── normalizer.ts                   # Normalização
│   │   ├── validators.ts                   # Validação
│   │   ├── handlers/
│   │   │   ├── base-handler.ts             # Handler base
│   │   │   ├── coach-handler.ts            # Handler coach
│   │   │   ├── nutri-handler.ts            # Handler nutri
│   │   │   └── wellness-handler.ts         # Handler wellness
│   │   └── formatters/
│   │       ├── excel-formatter.ts          # Processar Excel
│   │       ├── csv-formatter.ts            # Processar CSV
│   │       └── json-formatter.ts           # Processar JSON
│
└── app/
    └── api/
        └── import/
            ├── process/
            │   └── route.ts                # API unificada
            ├── validate/
            │   └── route.ts                # Validação
            └── parse/
                └── route.ts                # Parsing
```

---

## 🔧 IMPLEMENTAÇÃO DETALHADA

### 1. COMPONENTE GENÉRICO

**Arquivo:** `src/components/shared/ImportClientsModal.tsx`

```typescript
interface ImportClientsModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: () => void
  profile?: 'coach' | 'nutri' | 'wellness' // Opcional - detecta automaticamente
  acceptedFormats?: ('excel' | 'csv' | 'json')[] // Formatos aceitos
}

// Funcionalidades:
// - Upload de arquivos (Excel, CSV, JSON)
// - Preview dos dados
// - Mapeamento de campos (se necessário)
// - Validação
// - Importação
```

**Vantagens:**
- ✅ Reutilizável para todos os perfis
- ✅ Aceita múltiplos formatos
- ✅ Detecta perfil automaticamente via contexto/auth
- ✅ Interface consistente

---

### 2. API UNIFICADA

**Arquivo:** `src/app/api/import/process/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // 1. Autenticação
  const authResult = await requireApiAuth(request, ['coach', 'nutri', 'wellness', 'admin'])
  const { user, profile } = authResult
  
  // 2. Detectar formato dos dados
  const { format, data, mappings } = await request.json()
  // format: 'excel' | 'csv' | 'json'
  
  // 3. Roteamento baseado no perfil
  const handler = getHandlerForProfile(profile)
  
  // 4. Processar dados
  const result = await handler.process(data, mappings, format)
  
  return NextResponse.json(result)
}
```

**Vantagens:**
- ✅ Uma única API para todos os perfis
- ✅ Roteamento automático
- ✅ Fácil adicionar novos perfis

---

### 3. HANDLERS ESPECÍFICOS

**Arquivo:** `src/lib/import/handlers/base-handler.ts`

```typescript
abstract class BaseImportHandler {
  abstract getTableName(): string
  abstract getFieldMappings(): FieldMapping[]
  abstract validateData(data: any[]): ValidationResult
  abstract transformData(data: any[]): any[]
  abstract saveData(data: any[]): Promise<ImportResult>
  
  async process(data: any[], mappings: any[], format: string) {
    // 1. Normalizar dados
    const normalized = this.normalize(data, format)
    
    // 2. Validar
    const validation = this.validateData(normalized)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }
    
    // 3. Transformar
    const transformed = this.transformData(normalized)
    
    // 4. Salvar
    return await this.saveData(transformed)
  }
}
```

**Arquivo:** `src/lib/import/handlers/coach-handler.ts`

```typescript
class CoachImportHandler extends BaseImportHandler {
  getTableName() { return 'coach_clients' }
  
  getFieldMappings() {
    return [
      // Campos básicos
      { key: 'name', required: true },
      { key: 'email', required: false },
      // ... campos específicos do coach
      // Campos das tabelas relacionadas
      { key: 'professional.occupation', table: 'coach_client_professional' },
      { key: 'health.medications', table: 'coach_client_health' },
      // ...
    ]
  }
  
  async saveData(data: any[]) {
    // Salvar em múltiplas tabelas:
    // 1. coach_clients (principal)
    // 2. coach_client_professional
    // 3. coach_client_health
    // 4. coach_client_food_habits
    // 5. coach_client_evolution (peso inicial)
    // 6. coach_assessments (reavaliações)
    // 7. coach_emotional_behavioral_history (motivação)
  }
}
```

---

### 4. FORMATTERS (Processadores de Formato)

**Arquivo:** `src/lib/import/formatters/json-formatter.ts`

```typescript
export function processJSONFormat(data: any): NormalizedData {
  // Se for array de objetos (múltiplos clientes)
  if (Array.isArray(data)) {
    return {
      headers: extractHeaders(data[0]),
      rows: data.map(obj => Object.values(obj))
    }
  }
  
  // Se for objeto único (formato da ficha completa)
  if (data.identification) {
    return {
      headers: ['identification', 'address', 'professional', ...],
      rows: [flattenObject(data)]
    }
  }
  
  throw new Error('Formato JSON inválido')
}

function flattenObject(obj: any, prefix = ''): any {
  // Converte objeto aninhado em objeto plano
  // Ex: { identification: { name: 'João' } } → { 'identification.name': 'João' }
}
```

---

## 🔄 FLUXO DE IMPORTAÇÃO

### Fluxo 1: Planilha Excel/CSV (atual)
```
1. Upload arquivo
2. Parse Excel/CSV
3. Detecção automática de campos
4. Mapeamento manual (se necessário)
5. Validação
6. Importação
```

### Fluxo 2: JSON Estruturado (novo)
```
1. Upload arquivo JSON ou colar JSON
2. Validação de estrutura
3. Detecção automática de formato (ficha completa vs array)
4. Normalização para formato interno
5. Validação
6. Importação (salva em múltiplas tabelas)
```

### Fluxo 3: JSON Múltiplos Clientes
```
1. Upload JSON array
2. Processar cada cliente
3. Validação em lote
4. Importação em lote
```

---

## 📋 MUDANÇAS NECESSÁRIAS

### 1. Criar Componente Genérico
- [ ] Mover `ImportClientsModal.tsx` para `components/shared/`
- [ ] Tornar genérico (remover referências específicas de coach)
- [ ] Adicionar suporte para JSON
- [ ] Adicionar detecção automática de perfil

### 2. Criar API Unificada
- [ ] Criar `/api/import/process/route.ts`
- [ ] Implementar roteamento por perfil
- [ ] Manter compatibilidade com APIs antigas (deprecar depois)

### 3. Criar Handlers
- [ ] `BaseImportHandler` (classe abstrata)
- [ ] `CoachImportHandler` (implementação coach)
- [ ] `NutriImportHandler` (implementação nutri)
- [ ] `WellnessImportHandler` (se necessário)

### 4. Criar Formatters
- [ ] `json-formatter.ts` (processar JSON)
- [ ] Atualizar `excel-formatter.ts` e `csv-formatter.ts`

### 5. Atualizar Componentes
- [ ] Atualizar páginas de clientes para usar componente genérico
- [ ] Adicionar opção de importar JSON

---

## 🎨 INTERFACE DO COMPONENTE GENÉRICO

### Aba 1: Seleção de Formato
```
┌─────────────────────────────────────┐
│  Importar Clientes                 │
├─────────────────────────────────────┤
│                                     │
│  Escolha o formato:                 │
│  ○ Planilha (Excel/CSV)            │
│  ○ JSON Estruturado                │
│                                     │
│  [Arraste arquivos ou clique]       │
│                                     │
└─────────────────────────────────────┘
```

### Aba 2: Preview (JSON)
```
┌─────────────────────────────────────┐
│  Preview dos Dados                  │
├─────────────────────────────────────┤
│                                     │
│  Formato detectado: JSON            │
│  Clientes encontrados: 1            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Luiza Cunha Souza           │   │
│  │ 1987-09-16 | Feminino       │   │
│  │ Boca Raton, EUA             │   │
│  │ Peso: 83kg | Meta: 70kg     │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Validar] [Importar]               │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔌 INTEGRAÇÃO COM SISTEMA ATUAL

### Estratégia de Migração:

**Fase 1: Adicionar sem quebrar**
- Criar novo componente genérico
- Criar nova API unificada
- Manter APIs antigas funcionando
- Adicionar opção de usar novo sistema

**Fase 2: Migração gradual**
- Atualizar páginas para usar componente genérico
- Manter compatibilidade com formato antigo

**Fase 3: Deprecar antigo**
- Marcar APIs antigas como deprecated
- Remover após período de transição

---

## 📊 VANTAGENS DA ESTRUTURA GENÉRICA

### ✅ Reutilização
- Um único componente para todos os perfis
- Código compartilhado reduz duplicação

### ✅ Extensibilidade
- Fácil adicionar novos formatos
- Fácil adicionar novos perfis
- Fácil adicionar novas validações

### ✅ Manutenibilidade
- Código centralizado
- Mudanças em um lugar afetam todos
- Testes mais fáceis

### ✅ Flexibilidade
- Suporta múltiplos formatos
- Suporta múltiplos perfis
- Fácil customizar por perfil

---

## 🚀 PRÓXIMOS PASSOS

1. **Criar estrutura base**
   - Componente genérico
   - API unificada
   - Handler base

2. **Implementar suporte JSON**
   - JSON formatter
   - Validação de estrutura
   - Processamento de ficha completa

3. **Migrar handlers existentes**
   - Coach handler
   - Nutri handler

4. **Atualizar interfaces**
   - Adicionar opção JSON
   - Melhorar UX

5. **Testes**
   - Testar com diferentes formatos
   - Testar com diferentes perfis
   - Validar dados importados

---

**Documento criado em:** Dezembro 2025  
**Versão:** 1.0  
**Status:** Proposta - Aguardando aprovação
