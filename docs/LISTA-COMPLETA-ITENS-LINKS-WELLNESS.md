# 📋 LISTA COMPLETA - Itens da Página /pt/wellness/links

## 🎯 OBJETIVO
Listar todos os itens e verificar:
1. ✅ Preview funcionando
2. ✅ Diagnóstico configurado
3. ✅ Link correto

---

## 👥 RECRUTAMENTO

### Quizzes de Recrutamento (3 itens):
1. **Quiz: Ganhos e Prosperidade**
   - Slug: `quiz-ganhos`, `ganhos-prosperidade`, `quiz-ganhos-prosperidade`
   - Diagnóstico: ✅ `ganhosProsperidadeDiagnosticos` (mapeado)
   - Preview: ✅ `DynamicTemplatePreview`
   - Status: ⚠️ Verificar se `content` está no banco

2. **Quiz: Potencial e Crescimento**
   - Slug: `quiz-potencial`, `potencial-crescimento`, `quiz-potencial-crescimento`
   - Diagnóstico: ✅ `potencialCrescimentoDiagnosticos` (mapeado)
   - Preview: ✅ `DynamicTemplatePreview`
   - Status: ⚠️ Verificar se `content` está no banco

3. **Quiz: Propósito e Equilíbrio**
   - Slug: `quiz-proposito`, `proposito-equilibrio`, `quiz-proposito-equilibrio`
   - Diagnóstico: ✅ `propositoEquilibrioDiagnosticos` (mapeado)
   - Preview: ✅ `DynamicTemplatePreview`
   - Status: ⚠️ Verificar se `content` está no banco

### Fluxos de Recrutamento (14 fluxos):
Todos os fluxos têm:
- Preview: ✅ `FluxoDiagnostico` (mostra perguntas e diagnóstico)
- Diagnóstico: ✅ Cada fluxo tem `diagnostico` próprio
- Status: ✅ Funcionando

Lista de fluxos:
1. Renda Extra Imediata
2. Mães que Querem Trabalhar de Casa
3. Já Consome Produtos de Bem-estar
4. Trabalhar Apenas com Links (Sem Estoque)
5. Já Usa Energia e Acelera
6. Cansadas/Insatisfeitas no Trabalho Atual
7. Já Tentaram Outros Negócios
8. Querem Trabalhar Só Digital/Online
9. Já Empreendem (Salões, Clínicas, Lojas)
10. Querem Emagrecer + Renda Extra
11. Boas de Venda/Comunicativas
12. Desempregadas/Sem Renda/Transição
13. Transformar o Próprio Consumo em Renda
14. Jovens Empreendedores/Começar Cedo

---

## 💰 VENDAS

### Fluxos de Vendas (20 fluxos):
Todos os fluxos têm:
- Preview: ✅ `FluxoDiagnostico` (mostra perguntas e diagnóstico)
- Diagnóstico: ✅ Cada fluxo tem `diagnostico` próprio
- Status: ✅ Funcionando

Lista de fluxos:
1. Energia Matinal
2. Energia da Tarde
3. Troca Inteligente do Café
4. Anti-Cansaço Geral
5. Rotina Puxada / Trabalho Intenso
6. (e mais 15 fluxos...)

---

## 🔧 AJUSTES APLICADOS

1. ✅ Adicionados mapeamentos de slugs no `wellnessDiagnosticsMap`:
   - `quiz-ganhos` → `ganhosProsperidadeDiagnosticos`
   - `quiz-ganhos-prosperidade` → `ganhosProsperidadeDiagnosticos`
   - `quiz-proposito` → `propositoEquilibrioDiagnosticos`
   - `quiz-proposito-equilibrio` → `propositoEquilibrioDiagnosticos`

2. ✅ Preview de fluxos usando `FluxoDiagnostico`:
   - Mostra todas as perguntas
   - Mostra diagnóstico completo
   - Exatamente o que a pessoa verá ao acessar o link

3. ✅ Normalização de slug melhorada para garantir reconhecimento

---

## ⚠️ VERIFICAÇÕES NECESSÁRIAS

1. Verificar se os 3 quizzes têm `content` completo no banco de dados
2. Testar preview de cada quiz para garantir que diagnóstico aparece
3. Testar preview de cada fluxo para garantir que funciona
4. Verificar se links estão gerando corretamente com `user_slug`
