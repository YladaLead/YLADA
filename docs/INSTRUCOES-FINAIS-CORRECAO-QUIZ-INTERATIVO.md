# ✅ INSTRUÇÕES FINAIS - CORREÇÃO QUIZ INTERATIVO NUTRI

## 🎯 SLUG CORRETO IDENTIFICADO

O slug do Quiz Interativo na área Nutri é: **`quiz-interativo-nutri`**

---

## 📝 SCRIPT SQL PARA EXECUTAR

Execute este script no Supabase SQL Editor:

**Arquivo:** `migrations/corrigir-quiz-interativo-nutri-slug-correto.sql`

Este script corrige:
- ✅ Questão 3: "Quanta Qual a quantidade de" → "Qual a quantidade de"
- ✅ Questão 3: Opções limpas (remove texto duplicado)
- ✅ Questão 5: "Quase nunea" → "Quase nunca"

---

## 🔍 VERIFICAÇÃO APÓS EXECUTAR

Após executar o SQL, verifique se as correções foram aplicadas:

```sql
SELECT 
  name,
  slug,
  content->'questions'->2->>'question' as questao_3,
  content->'questions'->4->'options'->0->>'label' as questao_5_opcao_a
FROM templates_nutrition
WHERE slug = 'quiz-interativo-nutri';
```

**Resultado esperado:**
- Questão 3: "Qual a quantidade de água você costuma beber por dia?"
- Questão 5, Opção A: "(A) Quase nunca Não pratico"

---

## ⚠️ SE AINDA APARECER ERRADO

### 1. **Limpar Cache do Navegador**
- Pressione `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)
- Ou abra em modo anônimo/privado

### 2. **Verificar se o SQL foi executado**
- Confirme que o UPDATE afetou 1 linha
- Verifique o resultado da query de verificação

### 3. **Verificar Build/Deploy**
- Se estiver em produção, verificar se o deploy foi feito
- Se estiver em desenvolvimento, reiniciar o servidor

---

## ✅ CHECKLIST FINAL

- [x] Código TypeScript corrigido (pontuação, Quiz Detox)
- [ ] SQL executado com slug correto (`quiz-interativo-nutri`)
- [ ] Cache do navegador limpo
- [ ] Verificação no banco confirmada

