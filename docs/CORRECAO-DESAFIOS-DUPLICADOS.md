# 🔧 CORREÇÃO: Desafios Duplicados

## 🔴 PROBLEMA IDENTIFICADO

Os Desafios 7 Dias e 21 Dias estão aparecendo **duplicados**:
- Uma versão como `planilha` (antiga, incorreta)
- Uma versão como `quiz` (nova, correta - criada pelos scripts SQL)

**Resultado:** Os Desafios aparecem 2 vezes na lista, inflando a contagem.

---

## 🔧 SOLUÇÃO

### **Script SQL Criado:**
`scripts/remover-desafios-duplicados-planilha.sql`

**O que faz:**
1. ✅ Verifica as versões duplicadas antes
2. ✅ **Desativa** as versões antigas (tipo `planilha`)
3. ✅ Mantém apenas as versões corretas (tipo `quiz`)
4. ✅ Mostra contagem final

**Por que desativar e não deletar?**
- Mais seguro (pode reverter se necessário)
- Mantém histórico no banco
- Não quebra referências existentes

---

## 📊 RESULTADO ESPERADO

**Antes:**
- Planilhas: 4 total (3 ativos, 1 inativo)
- Quizzes: 32 ativos
- **Total:** 39 ativos

**Depois:**
- Planilhas: 4 total (1 ativo, 3 inativos) - Desafios desativados
- Quizzes: 32 ativos (mantém os 2 Desafios como quiz)
- **Total:** 37 ativos (ainda faltam 2 para chegar a 35)

---

## 🎯 PRÓXIMOS PASSOS

1. ⏳ Executar `scripts/remover-desafios-duplicados-planilha.sql`
2. ⏳ Verificar contagem final
3. ⏳ Identificar os outros 2 templates extras (provavelmente duplicatas de quizzes)
4. ⏳ Remover/desativar duplicatas restantes

---

**Última atualização:** 2025-01-XX


