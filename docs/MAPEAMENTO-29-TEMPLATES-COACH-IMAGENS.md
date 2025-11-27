# 🗺️ MAPEAMENTO: 29 Templates Coach (Imagens → Banco)

## 📋 **TEMPLATES IDENTIFICADOS NAS IMAGENS**

### **CALCULADORAS (4 templates)**

| # | Nome na Imagem | Slug Esperado | Nome no Banco Pode Ser |
|---|----------------|---------------|------------------------|
| 1 | Calculadora de Água | `calculadora-agua` ou `calc-hidratacao` | "Calculadora de Água" ou "Calculadora de Hidratação" |
| 2 | Calculadora de Calorias | `calculadora-calorias` ou `calc-calorias` | "Calculadora de Calorias" |
| 3 | Calculadora de IMC | `calculadora-imc` ou `calc-imc` | "Calculadora de IMC" |
| 4 | Calculadora de Proteína | `calculadora-proteina` ou `calc-proteina` | "Calculadora de Proteína" |

---

### **QUIZZES/DIAGNÓSTICOS (25 templates)**

| # | Nome na Imagem | Slug Esperado | Nome no Banco Pode Ser | Diagnóstico Coach |
|---|----------------|---------------|------------------------|-------------------|
| 5 | desequilíbrio mineral | `retencao-liquidos` | "Teste de Retenção de Líquidos" ou "Desequilíbrio Mineral" | ✅ `retencao-liquidos.ts` |
| 6 | corporal e nutricional | `conhece-seu-corpo` | "Você conhece o seu corpo?" ou "Autoconhecimento Corporal" | ✅ `conhece-seu-corpo.ts` |
| 7 | Avalie se o comportamento alimentar é guiado mais por razão ou emoções | `disciplinado-emocional` | "Você é mais disciplinado ou emocional com a comida?" | ✅ `disciplinado-emocional.ts` |
| 8 | Você está nutrido ou apenas alimentado? | `nutrido-vs-alimentado` | "Você está nutrido ou apenas alimentado?" | ✅ `nutrido-vs-alimentado.ts` |
| 9 | Você está se alimentando conforme sua rotina? | `alimentacao-rotina` | "Você está se alimentando conforme sua rotina?" | ✅ `alimentacao-rotina.ts` |
| 10 | Diagnóstico de Sintomas Intestinais | `diagnostico-sintomas-intestinais` | "Diagnóstico de Sintomas Intestinais" | ✅ `diagnostico-sintomas-intestinais.ts` |
| 11 | Pronto para Emagrecer com Saúde? | `pronto-emagrecer` | "Pronto para Emagrecer com Saúde?" | ✅ `pronto-emagrecer.ts` |
| 12 | Qual é o seu Tipo de Fome? | `tipo-fome` | "Qual é o seu Tipo de Fome?" | ✅ `tipo-fome.ts` |
| 13 | Qual é seu perfil de intestino? | `perfil-intestino` | "Qual é seu perfil de intestino?" | ✅ `perfil-intestino.ts` |
| 14 | Quiz de Bem-Estar | `quiz-bem-estar` ou `quiz-wellness-profile` | "Quiz de Bem-Estar" ou "Descubra seu Perfil de Bem-Estar" | ✅ `quiz-bem-estar.ts` |
| 15 | Quiz de Perfil Nutricional | `quiz-perfil-nutricional` | "Quiz de Perfil Nutricional" | ✅ `quiz-perfil-nutricional.ts` |
| 16 | Avaliação do Sono e Energia | `avaliacao-sono-energia` | "Avaliação do Sono e Energia" | ✅ `avaliacao-sono-energia.ts` |
| 17 | Avaliação Inicial | `avaliacao-inicial` ou `template-avaliacao-inicial` | "Avaliação Inicial" | ✅ `avaliacao-inicial.ts` |
| 18 | Desafio 21 Dias | `desafio-21-dias` ou `template-desafio-21dias` | "Desafio 21 Dias" | ✅ `desafio-21-dias.ts` |
| 19 | Descubra seu Perfil de Bem-Estar | `quiz-bem-estar` ou `quiz-wellness-profile` | "Descubra seu Perfil de Bem-Estar" ou "Quiz de Bem-Estar" | ✅ `quiz-bem-estar.ts` |
| 20 | Diagnóstico de Eletrólitos | `diagnostico-eletrolitos` | "Diagnóstico de Eletrólitos" | ✅ `diagnostico-eletrolitos.ts` |
| 21 | Diagnóstico de Parasitose | `diagnostico-parasitose` ou `template-diagnostico-parasitose` | "Diagnóstico de Parasitose" | ✅ `diagnostico-parasitose.ts` |
| 22 | Quiz Detox | `quiz-detox` | "Quiz Detox" | ✅ `quiz-detox.ts` |
| 23 | Quiz Energético | `quiz-energetico` | "Quiz Energético" | ✅ `quiz-energetico.ts` |
| 24 | Quiz Interativo | `quiz-interativo` ou `template-story-interativo` | "Quiz Interativo" ou "Story Interativo" | ✅ `quiz-interativo.ts` |
| 25 | Quiz: Alimentação Saudável | `quiz-alimentacao-saudavel` ou `alimentacao-saudavel` | "Quiz: Alimentação Saudável" | ✅ `alimentacao-saudavel.ts` |
| 26 | Risco de Síndrome Metabólica | `sindrome-metabolica` ou `risco-sindrome-metabolica` | "Risco de Síndrome Metabólica" | ✅ `sindrome-metabolica.ts` |
| 27 | Seu corpo está pedindo Detox? | `quiz-pedindo-detox` | "Seu corpo está pedindo Detox?" | ✅ `quiz-pedindo-detox.ts` |
| 28 | Avaliação de Intolerâncias/Sensibilidades | `avaliacao-intolerancia` ou `quiz-intolerancia` | "Avaliação de Intolerâncias/Sensibilidades" | ✅ `avaliacao-intolerancia.ts` |
| 29 | Avaliação do Perfil Metabólico | `avaliacao-perfil-metabolico` ou `perfil-metabolico` | "Avaliação do Perfil Metabólico" | ✅ `perfil-metabolico.ts` |

---

## ✅ **VERIFICAÇÃO: DIAGNÓSTICOS IMPLEMENTADOS**

Todos os 29 templates têm diagnósticos implementados em `src/lib/diagnostics/coach/`:

✅ **Calculadoras (4):**
- `calculadora-agua.ts` ✅
- `calculadora-calorias.ts` ✅
- `calculadora-imc.ts` ✅
- `calculadora-proteina.ts` ✅

✅ **Quizzes/Diagnósticos (25):**
- `retencao-liquidos.ts` ✅
- `conhece-seu-corpo.ts` ✅
- `disciplinado-emocional.ts` ✅
- `nutrido-vs-alimentado.ts` ✅
- `alimentacao-rotina.ts` ✅
- `diagnostico-sintomas-intestinais.ts` ✅
- `pronto-emagrecer.ts` ✅
- `tipo-fome.ts` ✅
- `perfil-intestino.ts` ✅
- `quiz-bem-estar.ts` ✅
- `quiz-perfil-nutricional.ts` ✅
- `avaliacao-sono-energia.ts` ✅
- `avaliacao-inicial.ts` ✅
- `desafio-21-dias.ts` ✅
- `diagnostico-eletrolitos.ts` ✅
- `diagnostico-parasitose.ts` ✅
- `quiz-detox.ts` ✅
- `quiz-energetico.ts` ✅
- `quiz-interativo.ts` ✅
- `alimentacao-saudavel.ts` ✅
- `sindrome-metabolica.ts` ✅
- `quiz-pedindo-detox.ts` ✅
- `avaliacao-intolerancia.ts` ✅
- `perfil-metabolico.ts` ✅

---

## 🔍 **MAPEAMENTO DE SLUGS NO CÓDIGO**

### **Mapeamento em `src/lib/diagnosticos-coach.ts`:**

```typescript
export const diagnosticosCoach: Record<string, DiagnosticosPorFerramenta> = {
  // Calculadoras
  'calculadora-agua': calculadoraAguaDiagnosticos,
  'calculadora-calorias': calculadoraCaloriasDiagnosticos,
  'calculadora-imc': calculadoraImcDiagnosticos,
  'calculadora-proteina': calculadoraProteinaDiagnosticos,
  
  // Quizzes/Diagnósticos
  'retencao-liquidos': retencaoLiquidosDiagnosticos,
  'teste-retencao-liquidos': retencaoLiquidosDiagnosticos,
  'conhece-seu-corpo': conheceSeuCorpoDiagnosticos,
  'voce-conhece-seu-corpo': conheceSeuCorpoDiagnosticos,
  'autoconhecimento-corporal': conheceSeuCorpoDiagnosticos,
  'disciplinado-emocional': disciplinadoEmocionalDiagnosticos,
  'nutrido-vs-alimentado': nutridoVsAlimentadoDiagnosticos,
  'voce-nutrido-ou-apenas-alimentado': nutridoVsAlimentadoDiagnosticos,
  'alimentacao-rotina': alimentacaoRotinaDiagnosticos,
  'diagnostico-sintomas-intestinais': diagnosticoSintomasIntestinaisDiagnosticos,
  'pronto-emagrecer': prontoEmagrecerDiagnosticos,
  'tipo-fome': tipoFomeDiagnosticos,
  'quiz-tipo-fome': tipoFomeDiagnosticos,
  'perfil-intestino': perfilIntestinoDiagnosticos,
  'quiz-bem-estar': quizBemEstarDiagnosticos,
  'descoberta-perfil-bem-estar': quizBemEstarDiagnosticos,
  'descubra-seu-perfil-de-bem-estar': quizBemEstarDiagnosticos,
  'quiz-perfil-nutricional': quizPerfilNutricionalDiagnosticos,
  'avaliacao-sono-energia': avaliacaoSonoEnergiaDiagnosticos,
  'quiz-sono-energia': avaliacaoSonoEnergiaDiagnosticos,
  'avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'template-avaliacao-inicial': avaliacaoInicialDiagnosticos,
  'desafio-21-dias': desafio21DiasDiagnosticos,
  'template-desafio-21dias': desafio21DiasDiagnosticos,
  'diagnostico-eletrolitos': diagnosticoEletrolitosDiagnosticos,
  'diagnostico-parasitose': diagnosticoParasitoseDiagnosticos,
  'template-diagnostico-parasitose': diagnosticoParasitoseDiagnosticos,
  'quiz-detox': quizDetoxDiagnosticos,
  'quiz-energetico': quizEnergeticoDiagnosticos,
  'quiz-interativo': quizInterativoDiagnosticos,
  'alimentacao-saudavel': alimentacaoSaudavelDiagnosticos,
  'quiz-alimentacao-saudavel': alimentacaoSaudavelDiagnosticos,
  'sindrome-metabolica': sindromeMetabolicaDiagnosticos,
  'risco-sindrome-metabolica': sindromeMetabolicaDiagnosticos,
  'quiz-pedindo-detox': quizPedindoDetoxDiagnosticos,
  'seu-corpo-esta-pedindo-detox': quizPedindoDetoxDiagnosticos,
  'avaliacao-intolerancia': avaliacaoIntoleranciaDiagnosticos,
  'quiz-intolerancia': avaliacaoIntoleranciaDiagnosticos,
  'avaliacao-perfil-metabolico': perfilMetabolicoDiagnosticos,
  'perfil-metabolico': perfilMetabolicoDiagnosticos,
  'quiz-perfil-metabolico': perfilMetabolicoDiagnosticos,
}
```

---

## 📊 **QUERY PARA VERIFICAR NO BANCO**

Execute esta query para verificar quais templates estão no banco:

```sql
SELECT 
  name as nome,
  slug,
  type as tipo,
  is_active,
  CASE 
    WHEN slug IS NULL OR slug = '' THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE language = 'pt'
  AND profession = 'coach'
ORDER BY type, name;
```

---

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ Executar `migrations/verificar-templates-coach-completo.sql` para ver todos os templates no banco
2. ✅ Comparar nomes das imagens com nomes no banco
3. ✅ Verificar se slugs correspondem aos mapeamentos em `diagnosticos-coach.ts`
4. ✅ Identificar discrepâncias entre nomes e slugs
5. ✅ Criar script de correção definitiva baseado na análise real

---

## ⚠️ **OBSERVAÇÕES IMPORTANTES**

1. **Nomes podem ser diferentes:** O nome na imagem pode ser diferente do nome no banco
2. **Slugs devem corresponder:** Os slugs no banco devem corresponder aos mapeamentos em `diagnosticos-coach.ts`
3. **Diagnósticos existem:** Todos os 29 templates têm diagnósticos implementados
4. **Múltiplos slugs:** Alguns templates podem ter múltiplos slugs mapeados (ex: `desafio-21-dias` e `template-desafio-21dias`)

