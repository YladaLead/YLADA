# 🧪 TESTE FASE 1: Formato Fixo da LYA

**Data:** Hoje  
**Objetivo:** Verificar se o novo formato fixo está funcionando corretamente

---

## ✅ CHECKLIST DE TESTE

### **1. Executar Migration no Supabase**
- [ ] Acessar Supabase Dashboard → SQL Editor
- [ ] Executar arquivo: `migrations/155-atualizar-tabela-lya-analise-formato-fixo.sql`
- [ ] Verificar se colunas foram criadas:
  - `foco_prioritario`
  - `acoes_recomendadas` (JSONB)
  - `onde_aplicar`
  - `metrica_sucesso`

### **2. Testar no Localhost**
- [ ] Acessar http://localhost:3000
- [ ] Fazer login com `demo.nutri@ylada.com`
- [ ] Navegar para `/pt/nutri/home`
- [ ] Verificar se card da LYA aparece

### **3. Verificar Formato Visual**
- [ ] Card mostra cabeçalho "LYA Mentora"
- [ ] Bloco 1: 🎯 FOCO PRIORITÁRIO (aparece)
- [ ] Bloco 2: ✅ AÇÃO DE HOJE (checklist com ☐)
- [ ] Bloco 3: 📍 ONDE APLICAR (aparece)
- [ ] Bloco 4: 📊 MÉTRICA DE SUCESSO (aparece)
- [ ] Botão "Ir para ação →" funciona
- [ ] Botão "Falar com a LYA" aparece

### **4. Verificar Console (F12)**
- [ ] Sem erros no console
- [ ] API `/api/nutri/lya/analise` retorna 200
- [ ] Resposta tem formato correto:
  ```json
  {
    "analise": {
      "foco_prioritario": "...",
      "acoes_recomendadas": ["...", "..."],
      "onde_aplicar": "...",
      "metrica_sucesso": "...",
      "link_interno": "..."
    }
  }
  ```

### **5. Verificar Parser**
- [ ] Se resposta da LYA segue formato → parser funciona
- [ ] Se resposta não segue formato → fallback ativado
- [ ] Logs no console mostram validação

---

## 🔍 O QUE VERIFICAR

### **Cenário 1: Resposta Válida**
- ✅ Parser extrai os 4 blocos corretamente
- ✅ Componente renderiza todos os blocos
- ✅ Botões funcionam

### **Cenário 2: Resposta Inválida (Fallback)**
- ✅ Parser detecta formato inválido
- ✅ Fallback é ativado automaticamente
- ✅ Componente ainda renderiza (com dados do fallback)
- ✅ Logs mostram aviso no console

### **Cenário 3: Primeira Vez (Sem Análise)**
- ✅ Componente mostra loading
- ✅ API gera nova análise
- ✅ Análise aparece no formato novo

---

## 🐛 PROBLEMAS COMUNS

### **Problema 1: Card não aparece**
- **Causa:** Migration não executada
- **Solução:** Executar migration no Supabase

### **Problema 2: Formato antigo aparece**
- **Causa:** Dados antigos no banco
- **Solução:** Migration converte automaticamente, mas pode precisar gerar nova análise

### **Problema 3: Erro no console**
- **Causa:** API retornando formato antigo
- **Solução:** Verificar se backend está atualizado (redeploy)

---

## 📝 RESULTADO ESPERADO

Após teste bem-sucedido:
- ✅ Card aparece no formato novo
- ✅ 4 blocos visíveis e organizados
- ✅ Botões funcionam
- ✅ Sem erros no console

---

**Próximo passo:** Se tudo funcionar, avançar para Fase 2 (Simplificação)

