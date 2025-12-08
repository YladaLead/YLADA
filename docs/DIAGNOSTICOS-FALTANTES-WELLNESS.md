# 🔍 Diagnósticos Faltantes - Wellness Templates

## 📊 SITUAÇÃO ATUAL

### ✅ Templates COM Diagnóstico Mapeado (40+)

Lista dos templates que **TÊM** diagnóstico configurado no `wellnessDiagnosticsMap`:

1. ✅ `quiz-interativo`
2. ✅ `quiz-bem-estar`
3. ✅ `quiz-perfil-nutricional`
4. ✅ `quiz-detox`
5. ✅ `quiz-energetico`
6. ✅ `avaliacao-emocional`
7. ✅ `avaliacao-intolerancia`
8. ✅ `intolerancia`
9. ✅ `perfil-metabolico`
10. ✅ `avaliacao-inicial`
11. ✅ `diagnostico-eletrolitos`
12. ✅ `diagnostico-sintomas-intestinais`
13. ✅ `pronto-emagrecer`
14. ✅ `tipo-fome`
15. ✅ `alimentacao-saudavel`
16. ✅ `sindrome-metabolica`
17. ✅ `retencao-liquidos`
18. ✅ `conhece-seu-corpo`
19. ✅ `nutrido-vs-alimentado`
20. ✅ `alimentacao-rotina`
21. ✅ `ganhos-prosperidade`
22. ✅ `potencial-crescimento`
23. ✅ `quiz-potencial`
24. ✅ `quiz-potencial-crescimento`
25. ✅ `proposito-equilibrio`
26. ✅ `calculadora-imc`
27. ✅ `calculadora-proteina`
28. ✅ `calculadora-agua`
29. ✅ `calculadora-calorias`
30. ✅ `checklist-alimentar`
31. ✅ `checklist-detox`
32. ✅ `mini-ebook`
33. ✅ `guia-nutraceutico`
34. ✅ `guia-proteico`
35. ✅ `guia-hidratacao`
36. ✅ `desafio-7-dias`
37. ✅ `desafio-21-dias`
38. ✅ `wellness-profile`
39. ✅ `descubra-seu-perfil-de-bem-estar`
40. ✅ `descoberta-perfil-bem-estar`
41. ✅ `template-diagnostico-parasitose`
42. ✅ `diagnostico-parasitose`
43. ✅ `parasitose`

---

## ❌ Templates SEM Diagnóstico Mapeado (CORRIGIDOS)

### ✅ Correções Aplicadas:

1. ✅ **`quiz-fome-emocional`** → Agora mapeado para `tipoFomeDiagnosticos`
2. ✅ **`hunger-type`** → Agora mapeado para `tipoFomeDiagnosticos`
3. ✅ **`avaliacao-fome-emocional`** → Agora mapeado para `tipoFomeDiagnosticos`
4. ✅ **`fome-emocional`** → Agora mapeado para `tipoFomeDiagnosticos`
5. ✅ **`quiz-tipo-fome`** → Agora mapeado para `tipoFomeDiagnosticos`
6. ✅ **`tipo-de-fome`** → Agora mapeado para `tipoFomeDiagnosticos`

### ✅ Variações de Calculadoras Adicionadas:

7. ✅ **`calc-imc`** → Agora mapeado para `calculadoraImcDiagnosticos`
8. ✅ **`imc`** → Agora mapeado para `calculadoraImcDiagnosticos`
9. ✅ **`calc-proteina`** → Agora mapeado para `calculadoraProteinaDiagnosticos`
10. ✅ **`proteina`** → Agora mapeado para `calculadoraProteinaDiagnosticos`
11. ✅ **`calc-hidratacao`** → Agora mapeado para `calculadoraAguaDiagnosticos`
12. ✅ **`calc-agua`** → Agora mapeado para `calculadoraAguaDiagnosticos`
13. ✅ **`hidratacao`** → Agora mapeado para `calculadoraAguaDiagnosticos`
14. ✅ **`agua`** → Agora mapeado para `calculadoraAguaDiagnosticos`
15. ✅ **`calculadora-hidratacao`** → Agora mapeado para `calculadoraAguaDiagnosticos`
16. ✅ **`calc-calorias`** → Agora mapeado para `calculadoraCaloriasDiagnosticos`
17. ✅ **`calorias`** → Agora mapeado para `calculadoraCaloriasDiagnosticos`

---

## ⚠️ Templates que AINDA PODEM ESTAR FALTANDO

Se ainda aparecer a mensagem de erro, verificar:

1. **Slugs com prefixos diferentes**:
   - `template-*` (ex: `template-quiz-fome-emocional`)
   - Verificar se o `buildSlugCandidates` está removendo o prefixo corretamente

2. **Slugs com variações de nome**:
   - Verificar o slug exato no banco de dados
   - Comparar com o mapeamento atual

3. **Templates novos**:
   - Se um template foi criado recentemente, pode não ter diagnóstico ainda
   - Verificar se existe arquivo em `src/lib/diagnostics/wellness/`

---

## 🔧 CORREÇÕES NECESSÁRIAS

### 1. Adicionar Mapeamentos Faltantes

Adicionar no `wellnessDiagnosticsMap` em `src/components/shared/DynamicTemplatePreview.tsx`:

```typescript
const wellnessDiagnosticsMap: Record<string, DiagnosticosPorFerramenta> = {
  // ... mapeamentos existentes ...
  
  // ADICIONAR ESTES:
  'quiz-fome-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  'hunger-type': wellnessDiagnostics.tipoFomeDiagnosticos,
  'avaliacao-fome-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  'fome-emocional': wellnessDiagnostics.tipoFomeDiagnosticos,
  
  // Outros possíveis que podem estar faltando:
  'quiz-tipo-fome': wellnessDiagnostics.tipoFomeDiagnosticos,
  'tipo-de-fome': wellnessDiagnostics.tipoFomeDiagnosticos,
}
```

### 2. Verificar Outros Templates

Alguns templates podem ter slugs diferentes no banco vs. no código. Verificar:

- Templates com `-` vs `_` (ex: `quiz-fome-emocional` vs `quiz_fome_emocional`)
- Templates com prefixos diferentes (ex: `template-`, `calc-`, `quiz-`)
- Templates com nomes em inglês vs português

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Para cada template que não mostra diagnóstico:

1. [ ] Verificar o slug exato do template no banco de dados
2. [ ] Verificar se existe arquivo de diagnóstico correspondente em `src/lib/diagnostics/wellness/`
3. [ ] Adicionar mapeamento no `wellnessDiagnosticsMap`
4. [ ] Testar no preview
5. [ ] Verificar se também funciona na ferramenta real

---

## 🎯 PRÓXIMOS PASSOS

1. **Imediato**: Adicionar mapeamentos para `quiz-fome-emocional` e variações
2. **Verificação**: Listar todos os templates do banco e comparar com o mapeamento
3. **Documentação**: Criar script SQL para identificar templates sem diagnóstico
4. **Prevenção**: Adicionar validação no preview para alertar sobre templates sem diagnóstico

---

**Status**: 🔍 Em análise - Identificando todos os templates faltantes

