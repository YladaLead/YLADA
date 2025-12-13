# 🧪 Como Testar a LYA - Guia Completo

## 📋 Pré-requisitos

1. ✅ Ter feito login na área Nutri
2. ✅ Ter completado o diagnóstico obrigatório
3. ✅ Ter perfil estratégico gerado automaticamente

---

## 🚀 Passo a Passo para Testar

### 1️⃣ **Acessar a Home da Nutri**

```
https://www.ylada.com/pt/nutri/home
```

ou localmente:

```
http://localhost:3000/pt/nutri/home
```

### 2️⃣ **Verificar se a Análise da LYA Aparece**

A análise deve aparecer no topo da página, em um card azul com:
- 💡 Título: "Análise da LYA para você hoje:"
- 📝 Mensagem completa da LYA
- 🔘 Botão: "Ir para ação →"

**Se não aparecer:**
- Abra o console do navegador (F12)
- Verifique erros no console
- Verifique a aba Network → procure por `/api/nutri/lya/analise`

---

## 🔍 Testes Detalhados

### **Teste 1: Verificar se a Análise é Gerada**

1. Acesse: `/pt/nutri/home`
2. A análise deve aparecer automaticamente
3. Se não aparecer, force uma nova análise:

```javascript
// No console do navegador (F12)
fetch('/api/nutri/lya/analise', {
  method: 'POST',
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
```

**Resultado esperado:**
```json
{
  "success": true,
  "analise": {
    "mensagem_completa": "...",
    "foco_principal": "...",
    "acao_pratica": "...",
    "link_interno": "...",
    "metrica_simples": "..."
  }
}
```

---

### **Teste 2: Verificar Link "Ir para ação"**

1. Clique no botão "Ir para ação →"
2. **Se você tem assinatura ou é admin/suporte:**
   - Deve redirecionar para `/pt/nutri/metodo/jornada/dia/1`
   - Não deve aparecer erro de "Acesso Restrito"

3. **Se você não tem assinatura:**
   - Deve redirecionar para `/pt/nutri/home`
   - Não deve aparecer erro

**Se aparecer erro de "Acesso Restrito":**
- Verifique se você tem assinatura ativa
- Verifique se você é admin/suporte (deve ter bypass)

---

### **Teste 3: Verificar GET da Análise**

```javascript
// No console do navegador (F12)
fetch('/api/nutri/lya/analise', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
```

**Resultado esperado:**
```json
{
  "analise": {
    "id": "...",
    "user_id": "...",
    "mensagem_completa": "...",
    "foco_principal": "...",
    "acao_pratica": "...",
    "link_interno": "...",
    "metrica_simples": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

### **Teste 4: Verificar Diagnóstico e Perfil Estratégico**

```javascript
// Verificar diagnóstico
fetch('/api/nutri/diagnostico', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)

// Verificar perfil estratégico
fetch('/api/nutri/perfil-estrategico', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
```

**Resultado esperado:**
- Diagnóstico deve existir
- Perfil estratégico deve existir
- Ambos devem ter dados válidos

---

## 🐛 Troubleshooting

### **Problema: Análise não aparece**

**Possíveis causas:**
1. ❌ Diagnóstico não foi completado
2. ❌ Perfil estratégico não foi gerado
3. ❌ Erro na API da LYA
4. ❌ Erro no OpenAI

**Solução:**
1. Verifique se completou o diagnóstico: `/pt/nutri/diagnostico`
2. Verifique o console do navegador (F12)
3. Verifique os logs da Vercel (se em produção)
4. Teste a API diretamente (veja Teste 1)

---

### **Problema: Erro "Acesso Restrito" ao clicar em "Ir para ação"**

**Possíveis causas:**
1. ❌ Usuário não tem assinatura ativa
2. ❌ Usuário não é admin/suporte
3. ❌ Link incorreto sendo gerado

**Solução:**
1. Verifique se você tem assinatura: `/api/nutri/subscription/check`
2. Verifique se você é admin/suporte (deve ter bypass)
3. Verifique o link gerado na análise

---

### **Problema: Erro na API da LYA**

**Verificar logs:**
- **Local:** Console do terminal onde está rodando `npm run dev`
- **Produção:** Vercel Dashboard → Functions → Logs

**Erros comuns:**
- `OPENAI_API_KEY` não configurada
- `LYA_PROMPT_ID` não configurado (se usando Responses API)
- Erro de conexão com OpenAI
- Erro de conexão com Supabase

---

## 📊 Verificar Dados no Banco

### **Verificar Análise Salva**

```sql
-- No Supabase SQL Editor
SELECT * FROM lya_analise_nutri
WHERE user_id = 'SEU_USER_ID'
ORDER BY created_at DESC
LIMIT 1;
```

### **Verificar Diagnóstico**

```sql
SELECT * FROM nutri_diagnostico
WHERE user_id = 'SEU_USER_ID';
```

### **Verificar Perfil Estratégico**

```sql
SELECT * FROM nutri_perfil_estrategico
WHERE user_id = 'SEU_USER_ID';
```

### **Verificar Memória de Eventos (RAG)**

```sql
SELECT * FROM ai_memory_events
WHERE user_id = 'SEU_USER_ID'
ORDER BY created_at DESC
LIMIT 5;
```

---

## ✅ Checklist de Teste Completo

- [ ] Diagnóstico foi completado
- [ ] Perfil estratégico foi gerado
- [ ] Análise da LYA aparece na home
- [ ] Mensagem da LYA faz sentido
- [ ] Botão "Ir para ação" funciona
- [ ] Link redireciona corretamente (sem erro de acesso)
- [ ] Análise é salva no banco (`lya_analise_nutri`)
- [ ] Evento é salvo na memória (`ai_memory_events`)
- [ ] Não há erros no console do navegador
- [ ] Não há erros nos logs da Vercel (produção)

---

## 🎯 Teste Rápido (1 minuto)

1. Acesse: `/pt/nutri/home`
2. Verifique se aparece o card azul com a análise da LYA
3. Clique em "Ir para ação →"
4. Verifique se não aparece erro de "Acesso Restrito"

**Se tudo funcionar:** ✅ LYA está funcionando!

**Se algo não funcionar:** Siga o troubleshooting acima.

---

## 📝 Notas Importantes

1. **A análise é gerada automaticamente** após completar o diagnóstico
2. **A análise é atualizada** quando você executa uma nova ação (futuro)
3. **O link "Ir para ação"** depende da sua assinatura/admin status
4. **A LYA usa RAG** (busca estado, memória e conhecimento antes de responder)

---

## 🔗 Links Úteis

- **Home Nutri:** `/pt/nutri/home`
- **Diagnóstico:** `/pt/nutri/diagnostico`
- **API Análise:** `/api/nutri/lya/analise`
- **API Diagnóstico:** `/api/nutri/diagnostico`
- **API Perfil:** `/api/nutri/perfil-estrategico`

---

## 💡 Dica

Se você quiser forçar uma nova análise, pode fazer um POST para `/api/nutri/lya/analise` (veja Teste 1).

A análise atual é sempre a mais recente salva no banco. Se você quiser gerar uma nova, faça um POST.



