# 📊 ANÁLISE: Templates Wellness vs Nutri

## 📈 Resumo Geral

| Área | Total | Ativos | Inativos |
|------|-------|--------|----------|
| **Wellness** | 38 | 37 | 1 |
| **Nutri** | 8 | 8 | 0 |
| **Diferença** | **-30** | **-29** | - |

### ⚠️ Status
- **31 templates faltando na Nutri**
- **1 template apenas na Nutri** (não existe em Wellness)

---

## 📋 Distribuição por Tipo

### Wellness
- **Calculadoras**: 4 (4 ativos)
- **Planilhas**: 6 (5 ativos, 1 inativo)
- **Quizzes**: 28 (28 ativos)

### Nutri
- **Calculadoras**: 0 ❌
- **Planilhas**: 3 (3 ativos)
- **Quizzes**: 5 (5 ativos)

---

## ❌ Templates Faltando na Nutri (31)

### Calculadoras (4 faltando)
1. Calculadora de Água
2. Calculadora de Calorias
3. Calculadora de IMC
4. Calculadora de Proteína

### Planilhas (4 faltando)
1. Cardápio Detox (inativo em Wellness)
2. Checklist Detox
3. Desafio 21 Dias
4. Guia de Hidratação

### Quizzes (23 faltando)
1. Avaliação Inicial
2. Avaliação de Fome Emocional
3. Avaliação de Intolerâncias/Sensibilidades
4. Avaliação do Perfil Metabólico
5. Avaliação do Sono e Energia
6. Diagnóstico de Eletrólitos
7. Diagnóstico de Sintomas Intestinais
8. Diagnóstico do Tipo de Metabolismo
9. Qual é o seu Tipo de Fome?
10. Quiz Detox
11. Quiz Interativo
12. Quiz de Bem-Estar
13. Quiz de Perfil Nutricional
14. Quiz: Alimentação Saudável
15. Quiz: Ganhos e Prosperidade
16. Quiz: Perfil de Bem-Estar
17. Quiz: Potencial e Crescimento
18. Risco de Síndrome Metabólica
19. Seu corpo está pedindo Detox?
20. Você conhece o seu corpo?
21. Você está nutrido ou apenas alimentado?
22. Você está se alimentando conforme sua rotina?
23. Você é mais disciplinado ou emocional com a comida?

---

## ⚠️ Templates Apenas na Nutri (1)

1. **Planilha Dieta Emagrecimento** (planilha)

---

## ✅ Próximos Passos

1. **Duplicar os 31 templates de Wellness para Nutri**
   - Script: `scripts/duplicar-templates-wellness-para-nutri.sql`
   - Manter todos os campos (content, description, etc.)
   - Apenas alterar `profession` de 'wellness' para 'nutri'

2. **Decisão sobre o template "Planilha Dieta Emagrecimento"**
   - Manter apenas na Nutri?
   - Ou também criar em Wellness?

3. **Verificar se há necessidade de ajustes de conteúdo**
   - Alguns templates podem precisar de adaptação de linguagem
   - Ex: "Quiz: Ganhos e Prosperidade" pode ser mais específico para Wellness

---

## 🔍 Como Verificar

Execute a API:
```bash
curl http://localhost:3000/api/debug/comparar-templates-wellness-nutri | jq '.'
```

Ou execute o SQL:
```bash
# No Supabase SQL Editor
scripts/comparar-templates-wellness-nutri.sql
```

