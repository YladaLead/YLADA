# 📋 GUIA DE EXECUÇÃO - SEMANAS 2, 3 e 4

Este guia explica como aplicar todas as atualizações e correções para as semanas 2, 3 e 4 da Jornada YLADA.

## ✅ O QUE FOI CRIADO

### Scripts SQL (para atualizar o banco de dados):

1. **`scripts/ATUALIZAR-SEMANA2-COMPLETA.sql`**
   - Atualiza dias 8-14 com textos melhorados do ChatGPT
   - Sem travessões, sem "tração"
   - Mesmo padrão da Semana 1

2. **`scripts/ATUALIZAR-SEMANA3-COMPLETA.sql`**
   - Atualiza dias 15-21 com textos melhorados do ChatGPT
   - Sem travessões, sem "tração"
   - Mesmo padrão da Semana 1

3. **`scripts/ATUALIZAR-SEMANA4-COMPLETA.sql`**
   - Atualiza dias 22-30 com textos melhorados do ChatGPT
   - Sem travessões, sem "tração"
   - Mesmo padrão da Semana 1

4. **`scripts/APLICAR-TODAS-CORRECOES-DIAS-8-30.sql`**
   - Remove travessões e "tração" que possam ter sobrado
   - Execute DEPOIS dos scripts de atualização

### Documentação:

5. **`docs/PROMPTS-LYA-SEMANAS-2-3-4.md`**
   - Todos os prompts de treinamento da LYA
   - Semana 2: Captação & Movimento
   - Semana 3: Rotina & Estrutura
   - Semana 4: Crescimento & GSAL

## 🚀 ORDEM DE EXECUÇÃO

Execute os scripts SQL nesta ordem:

### 1️⃣ Atualizar Semana 2 (Dias 8-14)
```sql
-- Execute: scripts/ATUALIZAR-SEMANA2-COMPLETA.sql
```

### 2️⃣ Atualizar Semana 3 (Dias 15-21)
```sql
-- Execute: scripts/ATUALIZAR-SEMANA3-COMPLETA.sql
```

### 3️⃣ Atualizar Semana 4 (Dias 22-30)
```sql
-- Execute: scripts/ATUALIZAR-SEMANA4-COMPLETA.sql
```

### 4️⃣ Aplicar Correções Finais
```sql
-- Execute: scripts/APLICAR-TODAS-CORRECOES-DIAS-8-30.sql
```

## ✅ VERIFICAÇÃO

Após executar todos os scripts, verifique:

1. **Quantos dias existem no banco:**
```sql
SELECT COUNT(*) FROM journey_days WHERE day_number BETWEEN 8 AND 30;
-- Deve retornar 23 (dias 8 a 30)
```

2. **Se há travessões ou "tração" restantes:**
```sql
SELECT day_number, title
FROM journey_days
WHERE day_number BETWEEN 8 AND 30
  AND (
    objective LIKE '% — %' OR objective ILIKE '%tração%' OR
    guidance LIKE '% — %' OR guidance ILIKE '%tração%' OR
    action_title LIKE '% — %' OR action_title ILIKE '%tração%' OR
    motivational_phrase LIKE '% — %' OR motivational_phrase ILIKE '%tração%'
  );
-- Deve retornar 0 linhas (nenhum problema encontrado)
```

## 📝 PRÓXIMOS PASSOS

### Para integrar os prompts da LYA:

Os prompts estão documentados em `docs/PROMPTS-LYA-SEMANAS-2-3-4.md`.

Você precisará:

1. **Integrar os prompts no sistema da LYA**
   - Adicionar lógica condicional baseada na semana atual
   - Usar os prompts como "system prompts" ou contexto adicional

2. **Testar a LYA em cada semana**
   - Verificar se o tom está correto
   - Confirmar que as respostas seguem as diretrizes

3. **Ajustar se necessário**
   - Os prompts são guias, podem precisar de refinamento baseado em uso real

## 🎯 RESUMO

✅ **Textos atualizados:** Dias 8-30 com conteúdo melhorado do ChatGPT
✅ **Correções aplicadas:** Sem travessões, sem "tração"
✅ **Prompts organizados:** Documentação completa da LYA para semanas 2-4
✅ **Padrão mantido:** Mesmo formato e qualidade da Semana 1

A jornada completa (30 dias) está agora:
- ✅ Com textos melhorados e consistentes
- ✅ Sem problemas de formatação
- ✅ Com treinamento da LYA documentado
- ✅ Pronta para uso
