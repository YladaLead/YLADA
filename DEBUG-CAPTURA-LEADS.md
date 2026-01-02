# 🔍 DEBUG - CAPTURA DE LEADS

**Data:** 18 de Dezembro de 2025  
**Problema:** Lead enviado com sucesso mas não aparece na lista de Leads

---

## 📋 **ENTENDENDO O SISTEMA:**

### **1. Como funciona o fluxo?**

```
Usuário acessa → Preenche → Envia lead
/pt/nutri/ana/calculadora-calorias
             ↓
        [Wrapper Dinâmico]
    /pt/nutri/[user-slug]/[tool-slug]/page.tsx
             ↓
    Busca ferramenta via API:
    /api/nutri/ferramentas/by-url?user_slug=ana&tool_slug=calculadora-calorias
             ↓
    Carrega template correspondente:
    @/app/pt/wellness/templates/calorias/page
             ↓
    Template renderiza LeadCapturePostResult
             ↓
    Usuário preenche Nome + WhatsApp
             ↓
    POST /api/wellness/leads
    {
      name: "Andre",
      phone: "19981868000",
      user_slug: "ana",
      tool_slug: "calculadora-calorias",
      ferramenta: "Calculadora de Calorias",
      resultado: "2.500 calorias/dia",
      template_id: "abc-123"
    }
             ↓
    API busca user_id de "ana" em user_profiles
             ↓
    API insere lead na tabela leads com user_id encontrado
             ↓
    Lead salvo com sucesso!
             ↓
    Nutricionista acessa: /pt/nutri/(protected)/leads
             ↓
    Página busca: GET /api/leads (com cookie de autenticação)
             ↓
    API retorna leads do usuário autenticado (user_id do token)
             ↓
    Lead deve aparecer na lista!
```

---

## 🐛 **POSSÍVEIS PROBLEMAS:**

### **1. user_slug não corresponde ao usuário logado**
- ❌ **Problema:** Lead salvo com `user_id` de "ana", mas usuário logado é outro
- ✅ **Solução:** Verificar se você está logado com a conta "ana"

### **2. user_slug "ana" não existe**
- ❌ **Problema:** API não encontra `user_id` para `user_slug='ana'`
- ✅ **Solução:** Verificar tabela `user_profiles` se existe registro com `user_slug='ana'`

### **3. Parâmetros não estão sendo capturados**
- ❌ **Problema:** `useParams()` retorna `undefined` para `user-slug` ou `tool-slug`
- ✅ **Solução:** Verificar logs no console do navegador (F12)

### **4. Lead salvo mas com user_id errado**
- ❌ **Problema:** Lead salvo mas com `user_id` diferente do usuário logado
- ✅ **Solução:** Verificar no banco de dados a tabela `leads`

---

## 🧪 **COMO DEBUGAR:**

### **PASSO 1: Verificar Logs do Navegador**

1. Abra o Console (F12 → Console)
2. Procure por logs que começam com 🔍:

```javascript
// Deve aparecer:
🔍 LeadCapturePostResult - Params: { 
  params: { 'user-slug': 'ana', 'tool-slug': 'calculadora-calorias' },
  toolSlug: 'calculadora-calorias',
  userSlug: 'ana'
}

🔍 Enviando lead: {
  name: 'Andre',
  phone: '19981868000',
  tool_slug: 'calculadora-calorias',
  user_slug: 'ana',
  ferramenta: 'Calculadora de Calorias',
  resultado: '2.500 calorias/dia',
  template_id: 'abc-123-def'
}
```

**O QUE VERIFICAR:**
- ✅ `userSlug` tem valor? (ex: 'ana')
- ✅ `toolSlug` tem valor? (ex: 'calculadora-calorias')
- ✅ Não há `undefined`?

---

### **PASSO 2: Verificar Logs do Servidor**

1. Abra o terminal onde o servidor está rodando
2. Procure por logs que começam com 🔍:

```bash
🔍 API /wellness/leads - Dados recebidos: {
  name: 'Andre',
  phone: '19981868000',
  tool_slug: 'calculadora-calorias',
  user_slug: 'ana',
  ferramenta: 'Calculadora de Calorias',
  template_id: 'abc-123-def'
}

🔍 user_id encontrado: 123-abc-def-456

🔍 Lead salvo com sucesso! ID: 789-xyz-123
```

**O QUE VERIFICAR:**
- ✅ `user_id` foi encontrado?
- ✅ Lead foi salvo com sucesso?
- ❌ Apareceu erro "user_id não encontrado"?

---

### **PASSO 3: Verificar Banco de Dados (Supabase)**

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor**
3. Abra a tabela **`user_profiles`**:
   - Procure por `user_slug = 'ana'`
   - Anote o `user_id` correspondente
4. Abra a tabela **`leads`**:
   - Procure pelos leads criados hoje
   - Verifique se o `user_id` do lead corresponde ao `user_id` de "ana"
5. Verifique se o lead está lá!

---

### **PASSO 4: Verificar Usuário Logado**

1. Acesse `/pt/nutri/(protected)/leads`
2. Abra o Console (F12)
3. Execute:

```javascript
// Verificar usuário logado
document.cookie
```

4. Procure pelo cookie de autenticação do Supabase
5. Copie o token JWT
6. Decodifique em https://jwt.io
7. Verifique o `sub` (user_id)
8. Esse `user_id` é o mesmo de "ana"?

---

## ✅ **CHECKLIST DE DEBUG:**

- [ ] Logs aparecem no navegador?
- [ ] `userSlug` e `toolSlug` têm valores corretos?
- [ ] Logs aparecem no servidor?
- [ ] `user_id` foi encontrado?
- [ ] Lead foi salvo com sucesso?
- [ ] Usuário logado é o mesmo que o `user_slug` da URL?
- [ ] Lead aparece na tabela `leads` do banco de dados?
- [ ] `user_id` do lead = `user_id` do usuário logado?

---

## 🎯 **SOLUÇÃO RÁPIDA:**

Se o problema é que **você não está logado como "ana"**, existem 3 opções:

### **Opção 1: Logar como o usuário correto**
- Faça logout
- Faça login com a conta correspondente ao `user_slug='ana'`

### **Opção 2: Acessar com seu próprio user_slug**
- Descubra seu `user_slug` em `user_profiles`
- Acesse: `/pt/nutri/[SEU-USER-SLUG]/calculadora-calorias`

### **Opção 3: Criar ferramenta no seu perfil**
- Acesse `/pt/nutri/(protected)/ferramentas`
- Crie/ative a ferramenta "Calculadora de Calorias"
- Acesse com seu próprio link

---

## 📝 **PRÓXIMOS PASSOS:**

1. Execute o teste novamente
2. Copie e cole aqui:
   - Os logs do navegador (Console)
   - Os logs do servidor (Terminal)
   - Qual usuário está logado
3. Com essas informações, posso identificar exatamente o problema!

---

**Status:** Aguardando logs do usuário  
**Última atualização:** 18 de Dezembro de 2025 - 22:45











