# 📋 INSTRUÇÕES: Identificar Templates Extras

## 🔍 PROBLEMA

A interface mostra **"Todas (39)"**, mas esperamos **35 templates**:
- **Calculadoras:** 4 ✅ (correto)
- **Planilhas:** 5 ativos + 1 inativo = 6 total ⚠️ (esperado: 2)
- **Quizzes:** 30 ativos ⚠️ (esperado: 24 = 22 quizzes + 2 desafios)

**Diferença:** +4 templates extras

---

## 🔧 SCRIPT SQL PARA IDENTIFICAR

Execute este script no Supabase:
```sql
-- Executar: scripts/listar-todos-39-templates-ativos.sql
```

Este script lista:
1. **Calculadoras (4):** Todas as calculadoras ativas
2. **Planilhas (6):** Todas as planilhas (ativas e inativas) - mostra quais são extras
3. **Quizzes (30):** Todos os quizzes ativos - separa desafios dos quizzes normais

---

## 📊 O QUE PROCURAR

### **Planilhas (esperado 2, temos 6):**
✅ Esperados:
- Cardápio Detox
- Tabela Comparativa

❓ Extras (4 templates):
- Identificar quais são os outros 4
- Verificar se são duplicatas ou templates antigos

### **Quizzes (esperado 24, temos 30):**
✅ Esperados (22 quizzes):
- Quiz Interativo
- Quiz Bem-Estar
- Quiz Perfil Nutricional
- Quiz Detox
- Quiz Energético
- Avaliação Emocional
- Quiz Intolerância
- Quiz Perfil Metabólico
- Quiz Eletrólitos
- Quiz Sintomas Intestinais
- Quiz Avaliação Inicial
- Quiz Pronto para Emagrecer
- Quiz Tipo de Fome
- Quiz Alimentação Saudável
- Quiz Síndrome Metabólica
- Quiz Retenção de Líquidos
- Quiz Conhece seu Corpo
- Quiz Nutrido vs Alimentado
- Quiz Alimentação e Rotina
- Quiz Ganhos e Prosperidade
- Quiz Potencial e Crescimento
- Quiz Propósito e Equilíbrio

✅ Esperados (2 desafios):
- Desafio 7 Dias
- Desafio 21 Dias

❓ Extras (6 templates):
- Identificar quais são os outros 6
- Verificar se são duplicatas ou templates antigos

---

## 🎯 PRÓXIMOS PASSOS

1. ⏳ Executar `scripts/listar-todos-39-templates-ativos.sql`
2. ⏳ Enviar os resultados (lista completa de templates)
3. ⏳ Identificar quais são os templates extras
4. ⏳ Decidir: remover duplicatas ou desativar templates antigos
5. ⏳ Ajustar contagem na interface

---

**Última atualização:** 2025-01-XX


