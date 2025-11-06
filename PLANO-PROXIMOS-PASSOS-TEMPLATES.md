# 🎯 PLANO: PRÓXIMOS PASSOS - IMPLEMENTAÇÃO DE TEMPLATES

## 📊 STATUS ATUAL

### ✅ **Implementados Completamente** (2/38)
- ✅ Checklist Detox
- ✅ Checklist Alimentar

### ⏳ **Parcialmente Implementados** (4/38)
- ⏳ Calculadora IMC (formulário OK, precisa ajustar diagnósticos)
- ⏳ Calculadora Proteína (formulário OK, precisa ajustar diagnósticos)
- ⏳ Calculadora Água (formulário OK, precisa ajustar diagnósticos)
- ⏳ Calculadora Calorias (formulário OK, precisa ajustar diagnósticos)

### ❌ **Pendentes** (32/38)
- ❌ Quizzes (5)
- ❌ Conteúdo Educativo (6)
- ❌ Diagnósticos Específicos (21)

---

## 🚀 PRÓXIMOS PASSOS SUGERIDOS

### **FASE 1: Completar Calculadoras** (Prioridade ALTA)
**Tempo estimado**: 30-45 minutos

1. ✅ Verificar se os diagnósticos estão sendo renderizados corretamente
2. ✅ Ajustar textos dos diagnósticos para realidade Wellness (se necessário)
3. ✅ Testar preview completo de cada calculadora

**Benefício**: Completar 4 templates rapidamente, deixando apenas 34 pendentes.

---

### **FASE 2: Implementar Quizzes** (Prioridade ALTA)
**Tempo estimado**: 2-3 horas

**Ordem sugerida:**
1. **Quiz Detox** (mais simples, similar ao Checklist Detox)
2. **Quiz Energético** (tema relacionado a Wellness)
3. **Quiz de Bem-Estar** (tema central para Wellness)
4. **Quiz de Perfil Nutricional** (adaptado para Wellness)
5. **Quiz Interativo** (mais complexo, deixar por último)

**Estrutura para cada Quiz:**
- Etapa 0: Landing com provocação
- Etapas 1-5: Perguntas exemplo (3-5 perguntas)
- Etapa Final: Resultado com diagnóstico completo + CTA Herbalife

**Benefício**: Adicionar 5 templates com boa estrutura de captação.

---

### **FASE 3: Implementar Conteúdo Educativo** (Prioridade MÉDIA)
**Tempo estimado**: 1-2 horas

**Templates:**
1. Mini E-book Educativo
2. Guia Nutracêutico
3. Guia Proteico
4. Tabela Comparativa
5. Tabela de Substituições

**Estrutura:**
- Etapa 0: Landing com preview do conteúdo
- Etapas 1-5: Preview de páginas/seções
- Etapa Final: CTA para download/visualização + contato Herbalife

---

### **FASE 4: Implementar Diagnósticos Específicos** (Prioridade BAIXA)
**Tempo estimado**: 4-6 horas

**Ordem sugerida (por relevância para Wellness):**
1. Seu corpo está pedindo Detox?
2. Descubra seu Perfil de Bem-Estar
3. Avaliação do Sono e Energia
4. Teste de Retenção de Líquidos
5. Qual é o seu Tipo de Fome?
6. Você está nutrido ou apenas alimentado?
7. Você conhece o seu corpo?
8. E os demais 14...

**Estrutura:**
- Etapa 0: Landing com provocação
- Etapas 1-10: 10 perguntas específicas
- Etapa Final: Resultado com diagnóstico completo + CTA Herbalife

---

## 📝 RECOMENDAÇÃO IMEDIATA

### **Começar por: FASE 1 + FASE 2**

**Justificativa:**
1. ✅ Calculadoras já estão 80% prontas (só ajustar diagnósticos)
2. ✅ Quizzes são mais simples que diagnósticos
3. ✅ Quizzes têm boa taxa de conversão
4. ✅ Estrutura similar aos Checklists já implementados

**Resultado esperado:**
- 4 Calculadoras completas
- 5 Quizzes implementados
- **Total: 11 templates completos (de 38)**

---

## 🎯 PRÓXIMA AÇÃO AGORA

**Sugestão: Começar pelo Quiz Detox**

**Por quê?**
- É o mais simples (similar ao Checklist Detox já implementado)
- Já temos diagnóstico disponível em `diagnosticos-nutri.ts`
- Vai validar o padrão para os outros 4 quizzes

**O que fazer:**
1. Verificar se `quizDetoxDiagnosticos` existe em `diagnosticos-nutri.ts`
2. Implementar preview seguindo o padrão do Checklist Detox
3. Testar no localhost
4. Replicar para os outros 4 quizzes

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO (Por Template)

Para cada template novo:

- [ ] Verificar se diagnóstico existe em `diagnosticos-nutri.ts`
- [ ] Adicionar detecção no código (`template.id === 'quiz-detox'`)
- [ ] Implementar Landing (Etapa 0)
- [ ] Implementar Perguntas exemplo (Etapas 1-5)
- [ ] Implementar Resultado Final (Etapa Final)
- [ ] Adicionar provocações estratégicas (Herbalife)
- [ ] Testar preview completo
- [ ] Verificar navegação entre etapas
- [ ] Marcar como ✅ no guia

---

## ⏱️ ESTIMATIVA TOTAL

- **FASE 1** (Calculadoras): 30-45 min
- **FASE 2** (Quizzes): 2-3 horas
- **FASE 3** (Conteúdo): 1-2 horas
- **FASE 4** (Diagnósticos): 4-6 horas

**Total estimado**: 8-12 horas de trabalho

---

## 🎯 DECISÃO

**Qual fase você prefere começar?**

1. **FASE 1** - Completar as 4 Calculadoras (rápido)
2. **FASE 2** - Implementar os 5 Quizzes (médio)
3. **Outra sugestão sua?**

**Localhost está rodando!** 🚀

