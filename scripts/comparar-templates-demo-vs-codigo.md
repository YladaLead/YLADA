# 🔍 Comparação: Templates Demo vs Código

## 📊 Análise Baseada nas Imagens Enviadas

### ✅ TEMPLATES IDENTIFICADOS NA DEMO (das imagens)

#### CALCULADORAS (5)
1. ✅ Calculadora de Água → `hidratacao`
2. ✅ Calculadora de Calorias → `calorias`
3. ✅ Calculadora de IMC → `imc`
4. ✅ Calculadora de Proteína → `proteina`
5. ✅ Guia de Hidratação → `hydration-guide`

#### PLANILHAS (2)
6. ✅ Checklist Alimentar → `checklist-alimentar`
7. ✅ Checklist Detox → `detox-menu`

#### QUIZZES (identificados nas imagens)
8. ✅ Qual é o seu Tipo de Fome? → `hunger-type`
9. ✅ Quiz de Bem-Estar → `wellness-profile`
10. ✅ Quiz: Alimentação Saudável → `healthy-eating` ou `healthy-eating-quiz`
11. ✅ Quiz: Ganhos e Prosperidade → `ganhos` ou `gains-and-prosperity`
12. ✅ Quiz: Potencial e Crescimento → `potencial` ou `potential-and-growth`
13. ✅ Quiz: Propósito e Equilíbrio → `proposito` ou `purpose-and-balance`
14. ✅ Risco de Síndrome Metabólica → `metabolic-syndrome-risk`
15. ✅ Teste de Retenção de Líquidos → `water-retention-test`
16. ✅ Você conhece o seu corpo? → `body-awareness`
17. ✅ Você está nutrido ou apenas alimentado? → `nourished-vs-fed`
18. ✅ Você está se alimentando conforme sua rotina? → `eating-routine`

## ⚠️ PRÓXIMO PASSO NECESSÁRIO

**Precisamos verificar no banco de dados quais são exatamente os 31 templates ativos.**

Execute o script `scripts/identificar-templates-demo.sql` no Supabase para obter a lista completa dos 31 templates.

Depois disso, podemos:
1. Comparar com os diretórios em `src/app/pt/wellness/templates/`
2. Identificar templates que não estão na demo e devem ser removidos
3. Identificar templates que estão na demo mas faltam no código
4. Criar script de limpeza

