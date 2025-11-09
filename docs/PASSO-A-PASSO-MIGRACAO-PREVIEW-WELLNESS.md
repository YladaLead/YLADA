# 🚀 PASSO A PASSO: Migração Preview Dinâmico - Wellness

## 📋 RESUMO

**Objetivo:** Migrar todos os 27 previews customizados para usar preview dinâmico baseado no `content` JSONB.

---

## ✅ PASSO 1: Verificar Content no Banco

**O que fazer:**
1. Verificar quais templates Wellness têm `content` JSONB completo
2. Identificar quais precisam de `content` criado/atualizado

**Como:**
- Executar query SQL no Supabase para listar templates Wellness
- Verificar estrutura do `content` de cada um

---

## ✅ PASSO 2: Escolher Primeiro Template

**Sugestão:** Começar com **Quiz Interativo** (mais simples)

**Por quê:**
- É um quiz básico
- Serve como modelo para os outros
- Valida o processo

---

## ✅ PASSO 3: Verificar Content do Template Escolhido

**O que verificar:**
- Template tem `content` JSONB?
- `content` tem estrutura completa (questions, options)?
- `content` está no formato correto?

**Se SIM:** Prosseguir para Passo 4
**Se NÃO:** Criar/atualizar `content` primeiro

---

## ✅ PASSO 4: Testar Preview Dinâmico

**O que fazer:**
1. Remover temporariamente preview customizado
2. Usar apenas preview dinâmico
3. Testar se funciona corretamente
4. Comparar com preview customizado original

**Se funcionar:** Prosseguir para Passo 5
**Se não funcionar:** Ajustar `content` ou preview dinâmico

---

## ✅ PASSO 5: Remover Preview Customizado

**O que fazer:**
1. Remover import do preview customizado
2. Remover código que renderiza preview customizado
3. Remover estado específico (se não usado em outro lugar)
4. Manter apenas preview dinâmico

---

## ✅ PASSO 6: Repetir para Próximo Template

**Ordem sugerida:**
1. Quiz Interativo ✅
2. Quiz Bem-Estar
3. Quiz Perfil Nutricional
4. Quiz Detox
5. Quiz Energético
6. ... (resto dos quizzes)
7. Checklists
8. Guias
9. Desafios

---

## ⚠️ IMPORTANTE

- **Fazer um template por vez**
- **Testar após cada migração**
- **Manter fallback durante transição**
- **Diagnósticos continuam hardcoded** (não mudam)

---

## 🎯 PRÓXIMO PASSO IMEDIATO

**Verificar content do Quiz Interativo no banco**

