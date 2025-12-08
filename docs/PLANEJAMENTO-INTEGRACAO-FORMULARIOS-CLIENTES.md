# 📋 PLANEJAMENTO: INTEGRAÇÃO AUTOMÁTICA FORMULÁRIOS → CLIENTES

## 🎯 OBJETIVO
Criar integração automática entre formulários preenchidos e criação/vínculo de clientes, permitindo que:
1. Formulários preenchidos criem automaticamente fichas de clientes
2. Dados do formulário sejam mapeados para campos do cliente
3. Respostas sejam vinculadas ao cliente criado/encontrado
4. Coach seja redirecionado para a página do cliente após criação

---

## 📊 ANÁLISE DA ESTRUTURA ATUAL

### 1. Estrutura de Clientes (Coach)
**Tabela:** `clients` (ou `coach_clients` - verificar qual está sendo usada)

**Campos principais:**
- `id` (UUID)
- `user_id` (UUID) - Coach dono
- `name` (VARCHAR) - **OBRIGATÓRIO**
- `email` (VARCHAR) - opcional
- `phone` (VARCHAR) - opcional
- `whatsapp` (VARCHAR) - opcional
- `birth_date` (DATE) - opcional
- `gender` (VARCHAR) - opcional
- `cpf` (VARCHAR) - opcional
- `status` (VARCHAR) - padrão: 'lead'
- `goal` (VARCHAR) - opcional
- `instagram` (VARCHAR) - opcional
- `address_*` (vários campos) - opcional
- `custom_fields` (JSONB) - opcional
- `lead_source` (VARCHAR) - origem
- `converted_from_lead` (BOOLEAN)

**API de criação:** `/api/coach/clientes` (POST)

### 2. Estrutura de Formulários
**Tabela:** `custom_forms`
- `id` (UUID)
- `user_id` (UUID) - Coach dono
- `name` (VARCHAR)
- `structure` (JSONB) - campos do formulário
- `is_template` (BOOLEAN)

**Estrutura de `structure`:**
```json
{
  "fields": [
    {
      "id": "field_1",
      "type": "text|email|tel|date|select|...",
      "label": "Nome completo",
      "required": true,
      "placeholder": "..."
    }
  ]
}
```

### 3. Estrutura de Respostas
**Tabela:** `form_responses`
- `id` (UUID)
- `form_id` (UUID)
- `user_id` (UUID) - Coach dono
- `client_id` (UUID) - **ATUALMENTE NULL** - precisa ser preenchido
- `responses` (JSONB) - respostas do formulário
- `completed_at` (TIMESTAMP)
- `ip_address` (INET)
- `user_agent` (TEXT)

**Estrutura de `responses`:**
```json
{
  "field_1": "João Silva",
  "field_2": "joao@email.com",
  "field_3": "5511999999999",
  ...
}
```

**API de salvamento:** `/api/public/formularios/[formId]/respostas` (POST)

---

## 🔄 FLUXO PROPOSTO

### **FLUXO 1: Cliente Novo (Criação Automática)**

```
1. Cliente preenche formulário público
   ↓
2. POST /api/public/formularios/[formId]/respostas
   ↓
3. Salvar resposta em form_responses (client_id = NULL temporariamente)
   ↓
4. Extrair dados do formulário (nome, email, telefone)
   ↓
5. Verificar se cliente já existe (buscar por email ou telefone)
   ↓
6a. SE NÃO EXISTE:
    - Criar novo cliente via /api/coach/clientes
    - Vincular resposta ao cliente (UPDATE form_responses SET client_id = novo_cliente.id)
    - Retornar { success: true, client_id: novo_cliente.id, created: true }
   ↓
6b. SE JÁ EXISTE:
    - Vincular resposta ao cliente existente
    - Atualizar dados do cliente se necessário (opcional)
    - Retornar { success: true, client_id: cliente_existente.id, created: false }
   ↓
7. Frontend redireciona para /pt/coach/clientes/[client_id]
```

### **FLUXO 2: Cliente Existente (Vínculo)**

```
1. Cliente preenche formulário
   ↓
2. Sistema identifica cliente por email/telefone
   ↓
3. Vincula resposta ao cliente existente
   ↓
4. Opcional: Atualizar dados do cliente com novos dados do formulário
```

---

## 🗺️ MAPEAMENTO DE CAMPOS

### **Campos Padrão do Cliente vs Campos do Formulário**

| Campo Cliente | Possíveis Campos Formulário | Prioridade | Regra |
|--------------|----------------------------|------------|-------|
| `name` | "nome", "nome_completo", "nome completo" | **ALTA** | Campo obrigatório |
| `email` | "email", "e-mail", "email_address" | **ALTA** | Usado para matching |
| `phone` | "telefone", "phone", "celular", "whatsapp" | **ALTA** | Usado para matching |
| `whatsapp` | "whatsapp", "telefone" (se tipo=tel) | **MÉDIA** | Se campo específico |
| `birth_date` | "data_nascimento", "nascimento", "birth_date" | **BAIXA** | Converter string para DATE |
| `gender` | "genero", "sexo", "gender" | **BAIXA** | Normalizar valores |
| `cpf` | "cpf", "documento" | **BAIXA** | Validar formato |
| `goal` | "objetivo", "meta", "goal" | **BAIXA** | Texto livre |
| `address_*` | "endereco", "rua", "cidade", etc. | **BAIXA** | Mapear campos específicos |
| `custom_fields` | Todos os outros campos | **BAIXA** | Armazenar em JSONB |

### **Estratégia de Mapeamento**

1. **Mapeamento por Label (Inteligente)**
   - Normalizar labels (lowercase, remover acentos, espaços)
   - Buscar palavras-chave: "nome" → name, "email" → email, etc.
   - Usar lista de sinônimos

2. **Mapeamento por Tipo de Campo**
   - `type: "email"` → `email`
   - `type: "tel"` → `phone` ou `whatsapp`
   - `type: "date"` → `birth_date` (se label contém "nascimento")

3. **Mapeamento Manual (Futuro)**
   - Permitir que coach configure mapeamento personalizado por formulário
   - Salvar em `custom_forms.mapping_config` (JSONB)

---

## 🔍 REGRAS DE MATCHING (Buscar Cliente Existente)

### **Critérios de Matching (em ordem de prioridade)**

1. **Email exato** (case-insensitive)
   - Se `responses.email` existe e não está vazio
   - Buscar: `WHERE email = LOWER(responses.email) AND user_id = form.user_id`

2. **Telefone normalizado**
   - Remover caracteres não numéricos
   - Comparar últimos 9-10 dígitos (ignorar DDI se diferente)
   - Buscar em `phone` e `whatsapp`

3. **Nome + Email** (combinado)
   - Se ambos existem, buscar por ambos

4. **Nome + Telefone** (combinado)
   - Se ambos existem, buscar por ambos

### **Regras de Decisão**

- **SE encontrar 1 cliente:** Vincular automaticamente
- **SE encontrar múltiplos clientes:** 
  - Usar o mais recente (created_at DESC)
  - Ou perguntar ao coach (futuro)
- **SE não encontrar:** Criar novo cliente

---

## ⚙️ IMPLEMENTAÇÃO TÉCNICA

### **ETAPA 1: Modificar API de Respostas**

**Arquivo:** `src/app/api/public/formularios/[formId]/respostas/route.ts`

**Mudanças:**
1. Após salvar resposta, extrair dados do formulário
2. Buscar cliente existente (matching)
3. Se não encontrar, criar novo cliente
4. Vincular resposta ao cliente
5. Retornar `client_id` na resposta

**Funções auxiliares necessárias:**
- `extractClientDataFromForm(responses, formStructure)` - Extrair dados
- `findExistingClient(userId, email, phone)` - Buscar cliente
- `createClientFromForm(userId, formData, formId)` - Criar cliente
- `normalizePhone(phone)` - Normalizar telefone
- `mapFormFieldToClientField(field, value)` - Mapear campo

### **ETAPA 2: Mapeamento de Campos**

**Arquivo:** `src/lib/form-to-client-mapper.ts` (NOVO)

**Funções:**
- `normalizeLabel(label: string): string` - Normalizar label
- `detectFieldType(field: Field): string` - Detectar tipo de campo cliente
- `mapFormResponsesToClient(form: Form, responses: Record<string, any>): ClientData`

**Configuração de mapeamento:**
```typescript
const FIELD_MAPPING = {
  name: ['nome', 'nome completo', 'nome_completo', 'name', 'full_name'],
  email: ['email', 'e-mail', 'email_address', 'correio'],
  phone: ['telefone', 'phone', 'celular', 'whatsapp', 'contato'],
  whatsapp: ['whatsapp', 'wpp'],
  birth_date: ['data_nascimento', 'nascimento', 'birth_date', 'data de nascimento'],
  gender: ['genero', 'sexo', 'gender'],
  cpf: ['cpf', 'documento', 'rg'],
  goal: ['objetivo', 'meta', 'goal', 'objetivo principal'],
  // ...
}
```

### **ETAPA 3: Validações e Tratamento de Erros**

**Validações necessárias:**
1. **Nome obrigatório:** Se não encontrar campo "nome", usar "Cliente sem nome" ou gerar nome temporário
2. **Email válido:** Validar formato antes de usar para matching
3. **Telefone válido:** Normalizar e validar antes de usar
4. **Duplicatas:** Verificar se cliente já existe antes de criar
5. **Permissões:** Garantir que cliente criado pertence ao coach correto

**Tratamento de erros:**
- Se falhar ao criar cliente: Salvar resposta mesmo assim (client_id = NULL)
- Log de erros para debug
- Retornar erro específico para frontend

### **ETAPA 4: Frontend - Redirecionamento**

**Arquivo:** `src/app/pt/c/[user-slug]/formulario/[slug]/page.tsx`

**Mudanças:**
1. Após sucesso no envio, verificar se `response.client_id` existe
2. Se existir, redirecionar para `/pt/coach/clientes/[client_id]`
3. Mostrar mensagem: "Cliente criado! Redirecionando..."
4. Se não existir, manter comportamento atual

---

## 🎨 INTERFACE/UX

### **1. Notificação na Home/Dashboard**

**Arquivo:** `src/app/pt/coach/home/page.tsx`

**Implementação:**
- Badge/contador de formulários novos não visualizados
- Tarja destacada: "Você tem X novos formulários preenchidos"
- Link direto para página de respostas

**API necessária:** 
- `GET /api/coach/formularios/respostas/novas` - Contar respostas não visualizadas

### **2. Página de Respostas Melhorada**

**Arquivo:** `src/app/pt/coach/formularios/[id]/respostas/page.tsx`

**Melhorias:**
- Badge "NOVO" em respostas recentes (últimas 24h)
- Botão destacado "Ver Cliente" se client_id existe
- Botão "Criar Cliente" se client_id é NULL
- Filtro por status: "Todos", "Vinculados", "Não vinculados"

### **3. Página do Cliente - Aba de Formulários**

**Arquivo:** `src/app/pt/coach/clientes/[id]/page.tsx`

**Nova aba:**
- Mostrar todos os formulários preenchidos pelo cliente
- Link para ver resposta completa
- Data de preenchimento

---

## 🗄️ MUDANÇAS NO BANCO DE DADOS

### **1. Adicionar campo `viewed` em `form_responses`**

```sql
ALTER TABLE form_responses
ADD COLUMN IF NOT EXISTS viewed BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_form_responses_viewed 
ON form_responses(user_id, viewed, created_at);
```

### **2. Adicionar campo `mapping_config` em `custom_forms` (futuro)**

```sql
ALTER TABLE custom_forms
ADD COLUMN IF NOT EXISTS mapping_config JSONB;
```

**Estrutura:**
```json
{
  "auto_create_client": true,
  "field_mapping": {
    "field_1": "name",
    "field_2": "email",
    "field_3": "phone"
  }
}
```

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Backend - Mapeamento e Criação**
- [ ] Criar `src/lib/form-to-client-mapper.ts`
- [ ] Implementar `extractClientDataFromForm()`
- [ ] Implementar `findExistingClient()`
- [ ] Implementar `createClientFromForm()`
- [ ] Implementar `normalizePhone()`
- [ ] Modificar `/api/public/formularios/[formId]/respostas` (POST)
- [ ] Adicionar validações
- [ ] Adicionar tratamento de erros
- [ ] Testes unitários

### **Fase 2: Banco de Dados**
- [ ] Adicionar coluna `viewed` em `form_responses`
- [ ] Criar índice para performance
- [ ] Migration script

### **Fase 3: Frontend - Redirecionamento**
- [ ] Modificar página de formulário público
- [ ] Adicionar redirecionamento após sucesso
- [ ] Mensagem de feedback

### **Fase 4: Interface - Notificações**
- [ ] API para contar respostas não visualizadas
- [ ] Badge na home/dashboard
- [ ] Tarja de notificação
- [ ] Melhorar página de respostas
- [ ] Adicionar aba de formulários na página do cliente

### **Fase 5: Testes e Validação**
- [ ] Testar criação de cliente novo
- [ ] Testar vínculo com cliente existente
- [ ] Testar matching por email
- [ ] Testar matching por telefone
- [ ] Testar casos de erro
- [ ] Testar redirecionamento
- [ ] Testar notificações

---

## ⚠️ PONTOS DE ATENÇÃO / RISCOS

### **1. Duplicação de Clientes**
- **Risco:** Criar múltiplos clientes para mesma pessoa
- **Mitigação:** Matching robusto (email + telefone)
- **Solução futura:** Merge de clientes duplicados

### **2. Dados Incompletos**
- **Risco:** Formulário sem nome/email/telefone
- **Mitigação:** Gerar nome temporário, permitir edição depois
- **Validação:** Nome mínimo obrigatório

### **3. Performance**
- **Risco:** Matching lento com muitos clientes
- **Mitigação:** Índices em email e phone
- **Otimização:** Cache de buscas recentes

### **4. Privacidade**
- **Risco:** Criar cliente sem consentimento explícito
- **Mitigação:** Considerar apenas formulários públicos (já é assim)
- **Futuro:** Checkbox "Criar minha ficha de cliente"

### **5. Campos Personalizados**
- **Risco:** Formulário com campos não mapeados
- **Mitigação:** Armazenar em `custom_fields` (JSONB)
- **Futuro:** Permitir mapeamento manual

---

## 🚀 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

1. **Backend Core** (Fase 1)
   - Mapeamento de campos
   - Matching de clientes
   - Criação automática

2. **Banco de Dados** (Fase 2)
   - Migration
   - Índices

3. **Frontend Básico** (Fase 3)
   - Redirecionamento
   - Feedback

4. **Interface Avançada** (Fase 4)
   - Notificações
   - Melhorias visuais

5. **Testes e Ajustes** (Fase 5)
   - Validação completa
   - Correções

---

## 📊 MÉTRICAS DE SUCESSO

- ✅ Taxa de criação automática de clientes > 80%
- ✅ Taxa de matching correto > 90%
- ✅ Tempo de processamento < 2 segundos
- ✅ Zero duplicatas de clientes (após ajustes)
- ✅ Notificações funcionando corretamente

---

## 🔮 MELHORIAS FUTURAS

1. **Mapeamento Manual:** Coach configura mapeamento por formulário
2. **Merge de Clientes:** Ferramenta para unir clientes duplicados
3. **Validação de Dados:** Validar CPF, email, etc. antes de criar
4. **Templates de Cliente:** Pré-preencher campos comuns
5. **Webhook/Notificação:** Notificar coach por email/WhatsApp
6. **Histórico de Vínculos:** Log de quando cliente foi vinculado

---

**Data de criação:** 2025-01-06
**Versão:** 1.0
**Status:** 📋 Planejamento Completo - Aguardando Aprovação


