# 🧪 COMO TESTAR - Links Corretos do NOEL

**Data:** 2025-01-27  
**Objetivo:** Verificar se o NOEL está gerando links corretos para todas as ferramentas

---

## ⏰ ANTES DE TESTAR

### 1. **Aguardar Deploy**
- O deploy na Vercel deve iniciar automaticamente após o commit
- Aguarde 2-5 minutos para o deploy concluir
- Verifique o status em: https://vercel.com/dashboard

### 2. **Verificar Deploy Concluído**
- Acesse: https://www.ylada.com/pt/wellness
- Faça login
- Verifique se a página carrega normalmente

---

## 🧪 TESTES PRÁTICOS

### **TESTE 1: Calculadora de Água** ⭐ (Principal)

**Pergunta para o NOEL:**
```
Quero enviar a calculadora de água para um cliente
```

**Resultado Esperado:**
- ✅ NOEL deve responder com um link
- ✅ Link deve ser: `https://www.ylada.com/pt/wellness/andre/agua`
- ✅ Link deve funcionar (não mostrar "Ferramenta não encontrada")
- ❌ Link NÃO deve ser: `calculadora-agua` ou `calc-hidratacao`

**Como Verificar:**
1. Copie o link fornecido pelo NOEL
2. Cole no navegador
3. Deve abrir a calculadora de água (não mostrar erro)

---

### **TESTE 2: Calculadora de IMC**

**Pergunta para o NOEL:**
```
Preciso da calculadora de IMC
```

**Resultado Esperado:**
- ✅ Link deve ser: `https://www.ylada.com/pt/wellness/andre/imc2`
- ✅ Link deve funcionar

---

### **TESTE 3: Calculadora de Calorias**

**Pergunta para o NOEL:**
```
Quero enviar a calculadora de calorias
```

**Resultado Esperado:**
- ✅ Link deve ser: `https://www.ylada.com/pt/wellness/andre/prot`
- ✅ Link deve funcionar

---

### **TESTE 4: Avaliação Inicial**

**Pergunta para o NOEL:**
```
Preciso do link da avaliação inicial
```

**Resultado Esperado:**
- ✅ Link deve ser: `https://www.ylada.com/pt/wellness/andre/avaliacao-inicial`
- ✅ Link deve funcionar

---

### **TESTE 5: Avaliação de Fome Emocional**

**Pergunta para o NOEL:**
```
Quero enviar a avaliação de fome emocional
```

**Resultado Esperado:**
- ✅ Link deve ser: `https://www.ylada.com/pt/wellness/andre/avaliacao-de-fome-emocional`
- ✅ Link deve funcionar

---

## 🔍 VERIFICAÇÕES ADICIONAIS

### **1. Verificar Logs do Servidor**

Se tiver acesso aos logs da Vercel, procure por:

```
✅ [getFerramentaInfo] Link gerado com ferramenta escolhida
```

Deve mostrar:
- `tool_slug_usado: 'agua'` (ou outro slug correto)
- `link_gerado: 'https://www.ylada.com/pt/wellness/andre/agua'`
- `aviso: 'Link usa tool_slug, NÃO template_slug'`

---

### **2. Verificar no Banco de Dados**

Execute este SQL para ver todas as ferramentas:

```sql
SELECT 
  ut.slug as tool_slug,
  ut.template_slug,
  ut.title,
  CONCAT('https://www.ylada.com/pt/wellness/andre/', ut.slug) as link_correto
FROM user_templates ut
INNER JOIN user_profiles up ON up.user_id = ut.user_id
WHERE 
  up.user_slug = 'andre'
  AND ut.profession = 'wellness'
  AND ut.status = 'active'
ORDER BY ut.slug;
```

Compare os links gerados pelo NOEL com os links corretos do SQL.

---

## ❌ PROBLEMAS COMUNS

### **Problema 1: Link ainda está errado**

**Sintoma:**
- NOEL gera link com `calculadora-agua` ou `calc-hidratacao`
- Link não funciona

**Solução:**
1. Verifique se o deploy foi concluído
2. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)
3. Teste novamente
4. Se persistir, verifique os logs do servidor

---

### **Problema 2: "Erro no servidor"**

**Sintoma:**
- NOEL responde com "Erro no servidor"

**Solução:**
1. Verifique os logs do servidor na Vercel
2. Verifique se as variáveis de ambiente estão corretas
3. Verifique se o Supabase está acessível

---

### **Problema 3: Link funciona mas é diferente do esperado**

**Sintoma:**
- Link funciona mas não é o mais curto (ex: usa `calculadora-de-agua` ao invés de `agua`)

**Solução:**
- Isso pode acontecer se houver múltiplas ferramentas
- A function prioriza o slug mais curto, mas se não encontrar, usa outro
- Verifique no banco se existe uma ferramenta com slug mais curto

---

## ✅ CHECKLIST DE TESTES

- [ ] Deploy concluído na Vercel
- [ ] Teste 1: Calculadora de Água → Link `/andre/agua` funciona
- [ ] Teste 2: Calculadora de IMC → Link `/andre/imc2` funciona
- [ ] Teste 3: Calculadora de Calorias → Link `/andre/prot` funciona
- [ ] Teste 4: Avaliação Inicial → Link `/andre/avaliacao-inicial` funciona
- [ ] Teste 5: Fome Emocional → Link `/andre/avaliacao-de-fome-emocional` funciona
- [ ] Todos os links abrem corretamente (não mostram erro)
- [ ] Logs do servidor mostram `tool_slug_usado` correto

---

## 🎯 RESULTADO ESPERADO

Após todos os testes:

✅ **NOEL sempre gera links corretos**  
✅ **Links sempre funcionam**  
✅ **Usa sempre o `tool_slug` (não `template_slug`)**  
✅ **Prioriza slug mais curto quando há múltiplas opções**

---

**Boa sorte com os testes! 🚀**


















