# 📋 PASSO-A-PASSO: Teste Fase 1 - Formato Fixo da LYA

**Status:** ✅ Teste estrutural completo  
**Próximo:** Teste manual no navegador

---

## ✅ TESTE ESTRUTURAL (JÁ FEITO)

- ✅ Servidor rodando
- ✅ Todos os arquivos implementados
- ✅ Parser funcionando
- ✅ Componente usando novo formato
- ✅ API integrada

---

## 🧪 TESTE MANUAL NO NAVEGADOR

### **PASSO 1: Executar Migration no Supabase**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto YLADA
3. Vá em: **SQL Editor** (menu lateral)
4. Clique em: **New query**
5. Cole o conteúdo do arquivo: `migrations/155-atualizar-tabela-lya-analise-formato-fixo.sql`
6. Clique em: **Run** (ou pressione Cmd+Enter)
7. Verifique se aparece: ✅ **Success. No rows returned**

**Arquivo completo:**
```sql
-- Ver migrations/155-atualizar-tabela-lya-analise-formato-fixo.sql
```

---

### **PASSO 2: Testar no Navegador**

1. **Acesse:** http://localhost:3000
2. **Faça login** com:
   - Email: `demo.nutri@ylada.com`
   - Senha: (a senha que você configurou)
3. **Navegue para:** `/pt/nutri/home`
   - Ou clique em "Home" no menu lateral

---

### **PASSO 3: Verificar Card da LYA**

O card deve aparecer no topo da página, logo após o vídeo de boas-vindas.

**O que verificar:**

#### ✅ **Cabeçalho**
- [ ] Mostra "LYA Mentora"
- [ ] Mostra "Análise da LYA — Hoje"

#### ✅ **Bloco 1: FOCO PRIORITÁRIO**
- [ ] Ícone 🎯 aparece
- [ ] Título "FOCO PRIORITÁRIO" aparece
- [ ] Texto do foco aparece (ex: "Iniciar sua organização profissional...")

#### ✅ **Bloco 2: AÇÃO DE HOJE**
- [ ] Ícone ✅ aparece
- [ ] Título "AÇÃO DE HOJE" aparece
- [ ] Checklist aparece com ☐ (checkboxes)
- [ ] Pelo menos 1 ação listada
- [ ] Máximo 3 ações

#### ✅ **Bloco 3: ONDE APLICAR**
- [ ] Ícone 📍 aparece
- [ ] Título "ONDE APLICAR" aparece
- [ ] Texto aparece (ex: "Jornada 30 Dias → Dia 1")

#### ✅ **Bloco 4: MÉTRICA DE SUCESSO**
- [ ] Ícone 📊 aparece
- [ ] Título "MÉTRICA DE SUCESSO" aparece
- [ ] Texto aparece (ex: "Dia 1 concluído até hoje.")

#### ✅ **Botões**
- [ ] Botão "Ir para ação →" aparece (azul)
- [ ] Botão "Falar com a LYA" aparece (borda azul)
- [ ] Botão "Ir para ação" funciona (redireciona)

#### ✅ **Microcopy**
- [ ] Texto pequeno aparece no final: "A LYA usa seu progresso..."

---

### **PASSO 4: Verificar Console (F12)**

1. **Abra o Console:**
   - Chrome/Edge: `F12` ou `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Firefox: `F12` ou `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)

2. **Verifique:**
   - [ ] Sem erros vermelhos
   - [ ] Se aparecer log: `✅ [LYA] Resposta parseada com sucesso` → **PERFEITO**
   - [ ] Se aparecer log: `⚠️ [LYA] Resposta não seguiu formato fixo` → **Fallback ativado (OK)**

3. **Verifique Network:**
   - [ ] Aba "Network" no DevTools
   - [ ] Filtre por "analise"
   - [ ] Clique na requisição `/api/nutri/lya/analise`
   - [ ] Verifique Response:
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

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema 1: Card não aparece**
**Causa:** Migration não executada ou erro na API

**Solução:**
1. Verificar se migration foi executada (PASSO 1)
2. Verificar console para erros
3. Verificar Network tab para ver resposta da API

---

### **Problema 2: Formato antigo aparece (lista 1-5)**
**Causa:** Dados antigos no banco ou API não atualizada

**Solução:**
1. Limpar cache do navegador (Cmd+Shift+R)
2. Verificar se código foi atualizado (git pull)
3. Reiniciar servidor: `npm run dev`

---

### **Problema 3: Erro no console**
**Causa:** API retornando erro ou formato inválido

**Solução:**
1. Verificar mensagem de erro no console
2. Verificar Network tab para ver resposta completa
3. Se erro 401/403: fazer login novamente
4. Se erro 500: verificar logs do servidor

---

### **Problema 4: Fallback ativado (aviso no console)**
**Causa:** Resposta da LYA não seguiu formato fixo

**Solução:**
- ✅ **Isso é OK!** O fallback garante que sempre funciona
- Verificar se card ainda aparece (deve aparecer com dados do fallback)
- Se quiser corrigir: ajustar prompt da LYA (mas não é crítico)

---

## ✅ RESULTADO ESPERADO

Após todos os passos:
- ✅ Card aparece no formato novo
- ✅ 4 blocos visíveis e organizados
- ✅ Botões funcionam
- ✅ Sem erros no console
- ✅ API retorna formato correto

---

## 📊 CHECKLIST FINAL

- [ ] Migration executada no Supabase
- [ ] Login realizado com sucesso
- [ ] Card da LYA aparece na home
- [ ] 4 blocos visíveis
- [ ] Botões funcionam
- [ ] Console sem erros
- [ ] API retorna formato correto

---

**Se tudo estiver ✅, pode avançar para Fase 2!**

