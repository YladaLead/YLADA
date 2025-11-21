# 🎯 PLANO DE AÇÃO: Completar Templates Nutri

## 📊 SITUAÇÃO ATUAL

- **78 templates** no banco
- **29 diagnósticos** prontos no código (37%)
- **49 templates** sem diagnóstico (63%)
- **Muitos templates** sem `content` completo (sequência de perguntas)

---

## 🔍 PRÓXIMA VERIFICAÇÃO NECESSÁRIA

**Execute a Query #1 e #2 do SQL** para verificar:
- Quais templates têm `content` completo (sequência de perguntas)
- Quais templates têm `content` vazio ou incompleto

Isso vai mostrar **exatamente** o que precisa ser completado.

---

## ✅ TEMPLATES QUE JÁ TÊM TUDO (Diagnóstico + Content)

Estes templates **provavelmente** já estão completos (têm diagnóstico no código):

1. ✅ `quiz-interativo`
2. ✅ `quiz-bem-estar`
3. ✅ `quiz-perfil-nutricional`
4. ✅ `quiz-detox`
5. ✅ `quiz-energetico`
6. ✅ `calculadora-imc`
7. ✅ `calculadora-proteina`
8. ✅ `calculadora-agua`
9. ✅ `calculadora-calorias`
10. ✅ `checklist-alimentar`
11. ✅ `checklist-detox`
12. ✅ `guia-hidratacao`
13. ✅ `guia-nutraceutico`
14. ✅ `guia-proteico`
15. ✅ `desafio-7-dias`
16. ✅ `desafio-21-dias`
17. ✅ `tabela-comparativa`
18. ✅ `tabela-substituicoes`
19. ✅ `avaliacao-inicial`
20. ✅ `mini-ebook`

---

## ⚠️ TEMPLATES QUE PRECISAM DE ATENÇÃO

### **Categoria 1: Tem diagnóstico, mas pode faltar content**

Estes templates têm diagnóstico no código, mas precisam verificar se têm `content` completo:

- `cardapio-detox`
- `diario-alimentar`
- `formulario-recomendacao`
- `infografico-educativo`
- `planner-refeicoes`
- `rastreador-alimentar`
- `receitas`
- `simulador-resultados`
- `story-interativo`
- `tabela-sintomas`
- `tabela-metas-semanais`
- `plano-alimentar-base`

### **Categoria 2: Não tem diagnóstico, precisa criar**

**Prioridade ALTA (templates importantes):**

1. ❌ `avaliacao-intolerancia` / `avaliacao-sensibilidades`
2. ❌ `avaliacao-perfil-metabolico` / `diagnostico-perfil-metabolico`
3. ❌ `diagnostico-eletrolitos` / `diagnostico-eletritos` (typo)
4. ❌ `diagnostico-sintomas-intestinais`
5. ❌ `pronto-emagrecer`
6. ❌ `tipo-fome` / `quiz-tipo-fome`
7. ❌ `quiz-alimentacao-saudavel`
8. ❌ `sindrome-metabolica` / `avaliacao-sindrome-metabolica`
9. ❌ `retencao-liquidos` / `teste-retencao-liquidos`
10. ❌ `conhece-seu-corpo` / `autoconhecimento-corporal`

**Prioridade MÉDIA:**

11. ❌ `nutrido-vs-alimentado` / `nutrido-alimentado`
12. ❌ `alimentacao-rotina` / `avaliacao-rotina-alimentar`
13. ❌ `quiz-ganhos`
14. ❌ `quiz-potencial`
15. ❌ `quiz-proposito`
16. ❌ `avaliacao-sono-energia`
17. ❌ `perfil-intestino`
18. ❌ `disciplinado-emocional`
19. ❌ `avaliacao-fome-emocional` / `quiz-fome-emocional`
20. ❌ `template-diagnostico-parasitose`

---

## 🛠️ AÇÕES POR TEMPLATE

### **Para cada template, verificar e completar:**

1. **Tem `content` JSONB completo?**
   - [ ] Se NÃO → Criar sequência de perguntas no formato JSONB
   - [ ] Se SIM → Verificar se está no formato correto

2. **Tem diagnóstico mapeado?**
   - [ ] Se NÃO → Criar arquivo em `src/lib/diagnostics/nutri/[slug].ts`
   - [ ] Se SIM → Verificar se está completo (6 seções)

3. **Slug está correto?**
   - [ ] Verificar se slug corresponde ao diagnóstico
   - [ ] Adicionar aliases se necessário em `diagnosticosNutri`

4. **Preview funciona?**
   - [ ] Testar no `DynamicTemplatePreview`
   - [ ] Verificar se perguntas aparecem sequencialmente
   - [ ] Verificar se diagnósticos aparecem no final

---

## 📋 CHECKLIST DE TRABALHO

### **Fase 1: Verificação (AGORA)**
- [x] Listar todos os templates do banco
- [ ] Verificar quais têm `content` completo (Query #1 do SQL)
- [ ] Verificar quais têm `content` vazio/incompleto (Query #2 do SQL)
- [ ] Comparar com diagnósticos disponíveis

### **Fase 2: Completar Content (PRIORIDADE)**
- [ ] Para cada template sem `content`:
  - [ ] Criar sequência de perguntas no formato JSONB
  - [ ] Seguir estrutura do `DynamicTemplatePreview`
  - [ ] Garantir que todas as perguntas têm opções completas

### **Fase 3: Criar Diagnósticos (SEGUNDA PRIORIDADE)**
- [ ] Para cada template sem diagnóstico:
  - [ ] Criar arquivo em `src/lib/diagnostics/nutri/[slug].ts`
  - [ ] Adicionar ao `diagnosticosNutri` em `src/lib/diagnosticos-nutri.ts`
  - [ ] Seguir estrutura padrão (6 seções)

### **Fase 4: Limpeza (TERCEIRA PRIORIDADE)**
- [ ] Consolidar templates duplicados
- [ ] Corrigir typos nos slugs
- [ ] Adicionar slugs faltantes

---

## 🎯 RECOMENDAÇÃO

**Começar pela Fase 1:** Execute as queries #1 e #2 do SQL para ver exatamente quais templates têm `content` completo e quais estão vazios. Isso vai dar uma visão clara do trabalho necessário.

Depois, priorizar:
1. Templates mais usados/populares
2. Templates que já têm diagnóstico mas faltam content
3. Templates novos que precisam de tudo







