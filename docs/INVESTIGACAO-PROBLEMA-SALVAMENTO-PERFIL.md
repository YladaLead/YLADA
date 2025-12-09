# 🔍 Investigação: Problema de Salvamento de Perfil Wellness

## ❌ Problema Reportado

**Usuários do Wellness não conseguem salvar o perfil.** Isso é crítico porque o NOEL depende totalmente do perfil para orientar.

---

## 🔍 Análise do Código Atual

### 1. Fluxo de Salvamento

```
Frontend (NoelOnboardingCompleto.tsx)
    ↓
handleSave() → onComplete(data)
    ↓
Frontend (home/page.tsx)
    ↓
handleOnboardingComplete() → POST /api/wellness/noel/onboarding
    ↓
Backend (onboarding/route.ts)
    ↓
Validação → Limpeza de dados → Upsert no banco
```

### 2. Pontos de Falha Identificados

#### A. Validação de Campos Obrigatórios

**Localização:** `src/app/api/wellness/noel/onboarding/route.ts` (linhas 274-313)

**Problema Potencial:**
- Validação muito rigorosa para novos perfis
- Se `objetivo_principal` ou `tempo_disponivel` estiverem vazios, retorna erro 400
- Mas na edição, esses campos podem não ser obrigatórios

**Código:**
```typescript
if (!isEditing) {
  if (!objetivo_principal || !tempo_disponivel) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }
}
```

#### B. Limpeza de Dados Muito Agressiva

**Localização:** `src/app/api/wellness/noel/onboarding/route.ts` (linhas 538-573)

**Problema Potencial:**
- A lógica de `cleanedProfileData` pode estar removendo campos válidos
- Especialmente campos booleanos que são `false`
- Arrays vazios são removidos, mas podem ser válidos

**Código:**
```typescript
// Arrays: verificar se não está vazio
else if (Array.isArray(value) && value.length > 0) {
  cleanedProfileData[key] = value
}
```

**Problema:** Se `publico_preferido` for `[]` (array vazio), ele não será incluído, mas isso pode ser um valor válido.

#### C. Validação "Nenhum Dado para Salvar"

**Localização:** `src/app/api/wellness/noel/onboarding/route.ts` (linhas 579-588)

**Problema Potencial:**
- Se a limpeza de dados remover todos os campos (exceto `user_id` e `updated_at`), retorna erro
- Isso pode acontecer se todos os campos forem considerados "inválidos"

**Código:**
```typescript
const camposParaSalvar = Object.keys(cleanedProfileData).filter(key => key !== 'user_id' && key !== 'updated_at')
if (camposParaSalvar.length === 0) {
  return NextResponse.json({ error: 'Nenhum dado para salvar' }, { status: 400 })
}
```

#### D. Tratamento de Erro no Frontend

**Localização:** `src/app/pt/wellness/home/page.tsx` (linhas 250-290)

**Problema Potencial:**
- O `handleOnboardingComplete` pode não estar propagando erros corretamente
- Se a resposta não for `ok` ou `success: true`, pode não estar lançando erro

**Código Atual:**
```typescript
const responseData = await response.json()

if (!response.ok) {
  const errorMessage = responseData.message || responseData.error || 'Erro ao salvar perfil.'
  throw new Error(errorMessage)
}

if (responseData.success) {
  // Sucesso
} else {
  throw new Error(responseData.error || 'Erro ao salvar perfil.')
}
```

**Status:** ✅ Parece correto, mas precisa verificar se está sendo chamado corretamente.

#### E. Campos Booleanos

**Localização:** `src/app/api/wellness/noel/onboarding/route.ts` (linhas 402-404, 428-430)

**Problema Potencial:**
- Campos como `prepara_bebidas` e `lembretes` são booleanos
- Se forem `false`, podem estar sendo filtrados incorretamente
- A lógica atual parece correta (linhas 553-554), mas precisa verificar

---

## 🐛 Problemas Específicos Identificados

### Problema 1: Arrays Vazios Sendo Removidos

**Cenário:**
- Usuário envia `publico_preferido: []` (array vazio)
- A lógica de limpeza remove arrays vazios
- Mas um array vazio pode ser um valor válido (significa "nenhum público preferido")

**Solução:**
- Incluir arrays mesmo se vazios, OU
- Não enviar o campo se for array vazio (deixar o banco usar o default)

### Problema 2: Validação de Valores Válidos Muito Restritiva

**Cenário:**
- Usuário envia um valor que não está na lista de valores válidos
- O backend retorna erro 400 com mensagem técnica
- O frontend pode não estar mostrando a mensagem corretamente

**Solução:**
- Melhorar mensagens de erro para serem mais amigáveis
- Verificar se o frontend está exibindo as mensagens

### Problema 3: Campos Opcionais Sendo Obrigatórios

**Cenário:**
- Na edição, alguns campos opcionais podem estar sendo tratados como obrigatórios
- Se o usuário não preencher, pode dar erro

**Solução:**
- Garantir que na edição, apenas campos realmente obrigatórios sejam validados

---

## 🔧 Correções Necessárias

### Correção 1: Ajustar Limpeza de Arrays

```typescript
// ANTES (linha 565):
else if (Array.isArray(value) && value.length > 0) {
  cleanedProfileData[key] = value
}

// DEPOIS:
else if (Array.isArray(value)) {
  // Incluir arrays mesmo se vazios (o banco pode ter default)
  cleanedProfileData[key] = value
}
```

### Correção 2: Melhorar Validação de Campos Obrigatórios

```typescript
// Garantir que na edição, não obrigue campos que já existem
if (!isEditing) {
  // Novo onboarding: campos obrigatórios
  if (!objetivo_principal || !tempo_disponivel) {
    return NextResponse.json({ 
      error: 'Campos obrigatórios faltando',
      message: 'Por favor, preencha o objetivo principal e o tempo disponível.',
      required: ['objetivo_principal', 'tempo_disponivel']
    }, { status: 400 })
  }
} else {
  // Edição: apenas validar se valores foram fornecidos
  // Não obrigar campos que já existem
}
```

### Correção 3: Melhorar Mensagens de Erro

```typescript
// Adicionar mais contexto nas mensagens de erro
if (error.code === '23505') {
  errorMessage = 'Este perfil já existe. Tente atualizar a página (F5).'
} else if (error.code === '23503') {
  errorMessage = 'Erro de referência. Verifique se o usuário existe.'
} else if (error.message?.includes('check constraint')) {
  errorMessage = `Valor inválido: ${error.message}. Por favor, verifique os campos preenchidos.`
} else if (error.message?.includes('column') || error.message?.includes('schema')) {
  errorMessage = 'Estamos atualizando o sistema. Por favor, atualize a página (F5) e tente novamente.'
}
```

### Correção 4: Adicionar Logs Detalhados

```typescript
// Antes de salvar, logar exatamente o que será salvo
console.log('💾 Dados que serão salvos:', JSON.stringify(cleanedProfileData, null, 2))
console.log('💾 Campos para salvar:', camposParaSalvar)
console.log('💾 Modo:', isEditing ? 'EDIÇÃO' : 'NOVO ONBOARDING')
```

---

## 📋 Checklist de Verificação

### Backend (`/api/wellness/noel/onboarding/route.ts`)
- [ ] Validação de campos obrigatórios está correta?
- [ ] Limpeza de dados não está removendo campos válidos?
- [ ] Arrays vazios estão sendo tratados corretamente?
- [ ] Campos booleanos (`false`) estão sendo incluídos?
- [ ] Mensagens de erro são amigáveis?
- [ ] Logs estão detalhados o suficiente?

### Frontend (`NoelOnboardingCompleto.tsx`)
- [ ] Validação de campos obrigatórios antes de salvar?
- [ ] Tratamento de erro está correto?
- [ ] `setSaving(false)` sempre é chamado?
- [ ] Mensagens de erro são exibidas ao usuário?

### Frontend (`home/page.tsx`)
- [ ] `handleOnboardingComplete` propaga erros corretamente?
- [ ] Mensagens de erro são exibidas?
- [ ] Estado de loading é gerenciado corretamente?

### Frontend (`conta/perfil/page.tsx`)
- [ ] Validação antes de salvar?
- [ ] Tratamento de erro está correto?
- [ ] Campos opcionais não são obrigatórios na edição?

---

## 🧪 Testes Necessários

### Teste 1: Novo Usuário (Onboarding Inicial)
1. Criar novo usuário
2. Preencher apenas campos obrigatórios
3. Tentar salvar
4. **Esperado:** Deve salvar com sucesso

### Teste 2: Edição de Perfil Existente
1. Usuário com perfil já completo
2. Alterar apenas um campo
3. Tentar salvar
4. **Esperado:** Deve salvar apenas o campo alterado

### Teste 3: Campos Booleanos
1. Definir `prepara_bebidas: false`
2. Definir `lembretes: false`
3. Tentar salvar
4. **Esperado:** Deve salvar os valores `false` corretamente

### Teste 4: Arrays Vazios
1. Definir `publico_preferido: []`
2. Tentar salvar
3. **Esperado:** Deve salvar ou usar default do banco

### Teste 5: Valores Inválidos
1. Tentar salvar com `objetivo_principal: 'valor_invalido'`
2. **Esperado:** Deve retornar erro claro e amigável

---

## 🔍 Próximos Passos

1. ✅ Criar este relatório de investigação
2. ⏳ Verificar logs do servidor para erros específicos
3. ⏳ Testar cada cenário acima
4. ⏳ Implementar correções necessárias
5. ⏳ Testar novamente após correções

---

## 📊 Status Atual

**Problemas Identificados:**
- ⚠️ Arrays vazios podem estar sendo removidos incorretamente
- ⚠️ Mensagens de erro podem não ser suficientemente claras
- ⚠️ Validação pode estar muito restritiva na edição

**Próxima Ação:**
- Implementar correções sugeridas
- Adicionar logs mais detalhados
- Melhorar tratamento de erros

---

**Status:** 🔍 Investigação completa - Pronto para implementar correções
