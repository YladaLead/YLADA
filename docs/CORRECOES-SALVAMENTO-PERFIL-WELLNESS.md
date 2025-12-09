# 🔧 Correções: Problema de Salvamento de Perfil Wellness

## 🎯 Problema

**Usuários do Wellness não conseguem salvar o perfil.** O NOEL depende totalmente do perfil para orientar.

---

## 🔍 Problemas Identificados

### 1. ⚠️ Arrays Vazios Sendo Removidos
**Problema:** Arrays vazios (`[]`) são removidos pela lógica de limpeza, mas podem ser valores válidos.

**Localização:** `src/app/api/wellness/noel/onboarding/route.ts` (linha 565)

**Código Atual:**
```typescript
else if (Array.isArray(value) && value.length > 0) {
  cleanedProfileData[key] = value
}
```

**Correção Necessária:**
```typescript
else if (Array.isArray(value)) {
  // Incluir arrays mesmo se vazios (o banco pode ter default)
  cleanedProfileData[key] = value
}
```

---

### 2. ⚠️ Validação "Nenhum Dado para Salvar" Muito Restritiva
**Problema:** Se a limpeza remover todos os campos, retorna erro mesmo que seja uma edição válida.

**Localização:** `src/app/api/wellness/noel/onboarding/route.ts` (linhas 579-588)

**Problema:** Na edição, o usuário pode querer salvar apenas um campo, mas se a limpeza remover outros campos, pode dar erro.

**Correção Necessária:**
- Na edição, permitir salvar mesmo com poucos campos
- Apenas validar "nenhum dado" para novos perfis

---

### 3. ⚠️ Mensagens de Erro Não Amigáveis
**Problema:** Erros de constraint do banco retornam mensagens técnicas.

**Localização:** `src/app/api/wellness/noel/onboarding/route.ts` (linhas 608-628)

**Correção Necessária:**
- Melhorar tratamento de erros de constraint
- Adicionar mensagens mais amigáveis

---

### 4. ⚠️ Logs Insuficientes
**Problema:** Quando há erro, não há logs suficientes para diagnosticar.

**Correção Necessária:**
- Adicionar logs antes e depois de cada etapa
- Logar dados recebidos e dados limpos

---

## ✅ Correções a Implementar

### Correção 1: Ajustar Limpeza de Arrays

```typescript
// Em src/app/api/wellness/noel/onboarding/route.ts, linha ~565
// ANTES:
else if (Array.isArray(value) && value.length > 0) {
  cleanedProfileData[key] = value
}

// DEPOIS:
else if (Array.isArray(value)) {
  // Incluir arrays mesmo se vazios
  cleanedProfileData[key] = value
}
```

### Correção 2: Ajustar Validação "Nenhum Dado"

```typescript
// Em src/app/api/wellness/noel/onboarding/route.ts, linha ~579
// ANTES:
const camposParaSalvar = Object.keys(cleanedProfileData).filter(key => key !== 'user_id' && key !== 'updated_at')
if (camposParaSalvar.length === 0) {
  return NextResponse.json({ 
    error: 'Nenhum dado para salvar',
    message: 'Por favor, preencha pelo menos um campo antes de salvar.'
  }, { status: 400 })
}

// DEPOIS:
const camposParaSalvar = Object.keys(cleanedProfileData).filter(key => key !== 'user_id' && key !== 'updated_at')
// Na edição, permitir salvar mesmo com poucos campos (apenas updated_at)
if (camposParaSalvar.length === 0 && !isEditing) {
  // Apenas para novos perfis, exigir pelo menos um campo
  return NextResponse.json({ 
    error: 'Nenhum dado para salvar',
    message: 'Por favor, preencha pelo menos um campo antes de salvar.'
  }, { status: 400 })
}
// Na edição, se não houver campos, apenas atualizar updated_at (não dar erro)
```

### Correção 3: Melhorar Mensagens de Erro

```typescript
// Em src/app/api/wellness/noel/onboarding/route.ts, linha ~608
// ADICIONAR:
if (error.message?.includes('check constraint')) {
  // Extrair nome da constraint e campo
  const constraintMatch = error.message.match(/constraint "([^"]+)"/)
  const fieldMatch = error.message.match(/column "([^"]+)"/)
  
  if (constraintMatch && fieldMatch) {
    const constraintName = constraintMatch[1]
    const fieldName = fieldMatch[1]
    
    if (constraintName.includes('objetivo_principal')) {
      errorMessage = `O valor selecionado para "Objetivo Principal" não é válido. Por favor, selecione uma opção da lista.`
    } else if (constraintName.includes('tempo_disponivel')) {
      errorMessage = `O valor selecionado para "Tempo Disponível" não é válido. Por favor, selecione uma opção da lista.`
    } else {
      errorMessage = `O valor do campo "${fieldName}" não é válido. Por favor, verifique e tente novamente.`
    }
  } else {
    errorMessage = 'Um dos valores preenchidos não é válido. Por favor, verifique os campos e tente novamente.'
  }
}
```

### Correção 4: Adicionar Logs Detalhados

```typescript
// Em src/app/api/wellness/noel/onboarding/route.ts, ANTES do upsert
console.log('💾 ==========================================')
console.log('💾 SALVANDO PERFIL NOEL')
console.log('💾 ==========================================')
console.log('💾 User ID:', user.id)
console.log('💾 Modo:', isEditing ? 'EDIÇÃO' : 'NOVO ONBOARDING')
console.log('💾 Dados recebidos (raw):', JSON.stringify(body, null, 2))
console.log('💾 Dados limpos (para salvar):', JSON.stringify(cleanedProfileData, null, 2))
console.log('💾 Campos para salvar:', camposParaSalvar)
console.log('💾 ==========================================')
```

---

## 📋 Ordem de Implementação

1. ✅ **Correção 1:** Ajustar limpeza de arrays (crítico)
2. ✅ **Correção 2:** Ajustar validação "nenhum dado" (crítico)
3. ✅ **Correção 3:** Melhorar mensagens de erro (importante)
4. ✅ **Correção 4:** Adicionar logs detalhados (importante para debug)

---

## 🧪 Testes Após Correções

### Teste 1: Novo Usuário
- [ ] Criar novo usuário
- [ ] Preencher campos obrigatórios
- [ ] Salvar
- [ ] Verificar se salvou

### Teste 2: Edição
- [ ] Usuário existente
- [ ] Alterar apenas um campo
- [ ] Salvar
- [ ] Verificar se salvou

### Teste 3: Campos Booleanos
- [ ] Definir `prepara_bebidas: false`
- [ ] Salvar
- [ ] Verificar se `false` foi salvo

### Teste 4: Arrays Vazios
- [ ] Definir `publico_preferido: []`
- [ ] Salvar
- [ ] Verificar se array vazio foi tratado

---

## 📊 Status

**Investigação:** ✅ Completa
**Correções Identificadas:** ✅ 4 correções principais
**Pronto para Implementar:** ✅ Sim

---

**Próximo Passo:** Implementar as 4 correções identificadas
