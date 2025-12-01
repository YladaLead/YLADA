# 🔍 DEBUG: Receitas Mensais Wellness

## Problema Reportado
- Hoje mesmo teve 3 pagantes mensais na área Wellness
- Não está sendo computado corretamente nos pagantes mensais

## Possíveis Causas

### 1. Filtro de Período Excluindo Assinaturas Recentes
- Se houver filtro de período ativo, pode estar excluindo assinaturas criadas hoje
- Verificar se `periodoRapido === 'todos'` está sendo respeitado

### 2. Categorização Incorreta
- Assinaturas podem estar sendo marcadas como gratuitas quando são pagantes
- Verificar se `amount > 0` está sendo respeitado

### 3. Filtro de Área
- Verificar se o filtro de área está funcionando corretamente
- Se `filtroArea === 'todos'`, deve incluir todas as áreas

### 4. Tipo de Assinatura
- Verificar se `plan_type = 'monthly'` está sendo identificado corretamente
- Verificar se o tipo está sendo convertido para 'mensal' corretamente

## Scripts de Diagnóstico

Execute os scripts SQL para verificar:
1. `scripts/diagnosticar-mensais-wellness.sql` - Lista todas as mensais Wellness
2. `scripts/verificar-assinaturas-gratuitas-incorretas.sql` - Verifica categorização

## Verificações

1. **No Frontend:**
   - Verificar se `filtroArea` está como 'todos' ou 'wellness'
   - Verificar se `periodoRapido` está como 'todos'
   - Verificar se `periodo` está como 'mes' (para mostrar mensais)

2. **Na API:**
   - Verificar se filtros de período estão sendo aplicados quando não deveriam
   - Verificar se categorização está correta (amount > 0 = pagante)

3. **No Banco:**
   - Verificar se há 3 assinaturas mensais Wellness ativas com amount > 0
   - Verificar se foram criadas hoje

