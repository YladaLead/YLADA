# 📦 GUIA: QUANDO FAZER COMMIT E DEPLOY

Este guia ajuda a decidir quando fazer commit e deploy das mudanças.

---

## ✅ O QUE FOI IMPLEMENTADO AGORA

### Mudanças no Banco de Dados:
- ✅ Textos da Semana 1 melhorados (Dias 1-7)
- ✅ Textos das Semanas 2, 3 e 4 atualizados (Dias 8-30)
- ✅ Travessões e "tração" removidos
- ✅ Scripts SQL executados no Supabase

### Mudanças no Código:
- ✅ `src/types/pilares.ts` - Corrigido travessão no subtítulo do Pilar 1
- ✅ Scripts SQL criados (não precisam de commit, são para Supabase)

### Documentação:
- ✅ Prompts da LYA completos
- ✅ Guias de revisão criados

---

## 🎯 QUANDO FAZER COMMIT

### ✅ FAÇA COMMIT AGORA:

**Mudanças no código que precisam ser commitadas:**

1. **`src/types/pilares.ts`**
   - Mudança: travessão removido do subtítulo do Pilar 1
   - Status: ✅ Pronto para commit

**Comando sugerido:**
```bash
git add src/types/pilares.ts
git commit -m "fix: remove travessão do subtítulo do Pilar 1 (Filosofia YLADA)"
```

### ⚠️ NÃO PRECISA COMMITAR:

- Scripts SQL (são para executar no Supabase, não no código)
- Documentação de revisão (guia interno)
- Scripts de verificação SQL

---

## 🚀 QUANDO FAZER DEPLOY

### ✅ FAÇA DEPLOY AGORA SE:

1. **Mudanças no código foram commitadas**
   - ✅ `src/types/pilares.ts` foi corrigido
   - ✅ Está funcionando localmente

2. **Mudanças no banco foram aplicadas**
   - ✅ Scripts SQL executados no Supabase
   - ✅ Verificação passou (0 travessões, 0 "tração")

3. **Testes básicos feitos**
   - ✅ Interface carrega corretamente
   - ✅ Textos aparecem sem travessões

### ⏸️ ESPERE PARA DEPLOY SE:

1. **Ainda está testando localmente**
   - Aguarde terminar os testes
   - Valide que tudo está funcionando

2. **Revisão colaborativa ainda não começou**
   - Pode fazer deploy, mas avise que está em revisão
   - Ou aguarde feedback inicial

3. **Há problemas conhecidos**
   - Corrija primeiro
   - Depois faça deploy

---

## 📋 CHECKLIST ANTES DE DEPLOY

### Verificações Técnicas:
- [ ] Mudanças no código commitadas
- [ ] Scripts SQL executados no Supabase
- [ ] Verificação SQL passou (0 problemas)
- [ ] Teste local básico feito
- [ ] Não há erros de lint/TypeScript

### Verificações de Conteúdo:
- [ ] Textos não têm travessões visíveis
- [ ] Textos não têm "tração" incorreto
- [ ] Interface carrega corretamente
- [ ] Exercícios de reflexão funcionam

### Verificações da LYA:
- [ ] Prompt completo configurado na OpenAI
- [ ] LYA responde no formato correto
- [ ] Teste básico com LYA feito

---

## 🎯 RECOMENDAÇÃO PARA AGORA

### Opção 1: Deploy Imediato (Recomendado)
**Se você já:**
- ✅ Executou todos os scripts SQL
- ✅ Testou localmente
- ✅ Verificou que não há problemas

**Faça:**
1. Commit da mudança no `pilares.ts`
2. Deploy
3. Continue com revisão colaborativa

**Vantagem:** Já está no ar, pode testar em produção

### Opção 2: Deploy Após Revisão Inicial
**Se você prefere:**
- Testar mais antes de colocar no ar
- Fazer ajustes baseado em feedback inicial

**Faça:**
1. Commit da mudança no `pilares.ts`
2. Continue testando localmente
3. Faça deploy após revisar os primeiros dias

**Vantagem:** Mais seguro, menos risco

---

## 📝 COMANDOS SUGERIDOS

### 1. Commit das Mudanças no Código

```bash
# Ver o que mudou
git status

# Adicionar mudanças
git add src/types/pilares.ts

# Commit
git commit -m "fix: remove travessão do subtítulo do Pilar 1

- Remove travessão (—) do subtítulo 'O que a faculdade não ensinou'
- Substitui por vírgula para evitar confusão com 'tração'
- Mantém consistência com textos da jornada"

# Push
git push origin main
```

### 2. Deploy (se usar Vercel/Netlify)
- Deploy automático após push (se configurado)
- Ou faça deploy manual no painel

---

## ⚠️ IMPORTANTE

### O que NÃO precisa de deploy:
- Scripts SQL (já executados no Supabase)
- Documentação de revisão (guia interno)
- Mudanças no banco (já aplicadas)

### O que PRECISA de deploy:
- Mudanças no código TypeScript/React
- Mudanças em componentes
- Mudanças em APIs (se houver)

---

## 🎯 RESUMO

**Status Atual:**
- ✅ Banco de dados: atualizado (scripts SQL executados)
- ✅ Código: 1 arquivo modificado (`pilares.ts`)
- ✅ Documentação: completa (não precisa commit)

**Recomendação:**
1. **Commit agora:** `src/types/pilares.ts`
2. **Deploy agora:** Se já testou localmente
3. **Ou aguarde:** Se quer testar mais antes

---

## 📞 PRÓXIMOS PASSOS

Após commit/deploy:
1. Continuar revisão colaborativa
2. Coletar feedback
3. Fazer ajustes se necessário
4. Novo commit/deploy se houver correções

---

**Última atualização:** Após implementação completa da jornada

