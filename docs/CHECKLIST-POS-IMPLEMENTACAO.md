# ✅ CHECKLIST PÓS-IMPLEMENTAÇÃO - JORNADA YLADA

Este checklist ajuda a verificar se tudo está funcionando corretamente após a implementação.

---

## 📋 VERIFICAÇÕES NO BANCO DE DADOS

### 1. Verificar se todos os dias existem

```sql
SELECT 
  COUNT(*) as total_dias,
  MIN(day_number) as primeiro_dia,
  MAX(day_number) as ultimo_dia
FROM journey_days;
-- Deve retornar: total_dias = 30, primeiro_dia = 1, ultimo_dia = 30
```

### 2. Verificar se não há travessões ou "tração"

```sql
SELECT 
  day_number,
  title,
  CASE 
    WHEN objective LIKE '% — %' OR objective ILIKE '%tração%' THEN '⚠️ Problema'
    WHEN guidance LIKE '% — %' OR guidance ILIKE '%tração%' THEN '⚠️ Problema'
    WHEN action_title LIKE '% — %' OR action_title ILIKE '%tração%' THEN '⚠️ Problema'
    WHEN motivational_phrase LIKE '% — %' OR motivational_phrase ILIKE '%tração%' THEN '⚠️ Problema'
    ELSE '✅ OK'
  END as status
FROM journey_days
WHERE day_number BETWEEN 1 AND 30
ORDER BY day_number;
-- Todas as linhas devem mostrar "✅ OK"
```

### 3. Verificar estrutura dos textos (amostra)

```sql
SELECT 
  day_number,
  title,
  LEFT(objective, 60) as objective_preview,
  LEFT(guidance, 60) as guidance_preview,
  action_type,
  jsonb_array_length(checklist_items) as num_reflexoes
FROM journey_days
WHERE day_number IN (1, 8, 15, 22)
ORDER BY day_number;
-- Verificar se os textos estão completos e coerentes
```

---

## 🤖 VERIFICAÇÕES DA LYA

### 4. Testar LYA com perguntas da Semana 1

**Perguntas de teste:**
- "O que eu preciso fazer hoje?"
- "Estou confusa sobre minha identidade profissional"
- "Como eu me vejo como nutricionista?"
- "O que é ser uma Nutri-Empresária?"

**O que verificar:**
- ✅ LYA responde no formato fixo (Foco Prioritário, Ação Recomendada, etc.)
- ✅ Tom é calmo, acolhedor e seguro
- ✅ Não menciona técnicas avançadas ou vendas
- ✅ Usa as reflexões da usuária quando disponíveis
- ✅ Frase-chave: "Antes de crescer por fora, você precisa se organizar por dentro"

### 5. Testar LYA com perguntas da Semana 2

**Perguntas de teste:**
- "Tenho medo de me expor"
- "Ninguém respondeu minha mensagem"
- "Como criar uma CTA?"
- "Não sei o que falar nos stories"

**O que verificar:**
- ✅ LYA normaliza o medo
- ✅ Foca em constância, não resultado
- ✅ Não cobra vendas ou faturamento
- ✅ Frase-chave: "Você não precisa convencer ninguém. Você só precisa aparecer e convidar"

### 6. Testar LYA com perguntas da Semana 3

**Perguntas de teste:**
- "Minha rotina está bagunçada"
- "Não consigo me organizar"
- "Como criar uma rotina mínima?"
- "Estou me sentindo sobrecarregada"

**O que verificar:**
- ✅ LYA desmistifica rotina (não é agenda cheia)
- ✅ Incentiva simplificação
- ✅ Normaliza ajustes
- ✅ Frase-chave: "Constância não é rigidez. É compromisso com o que é possível"

### 7. Testar LYA com perguntas da Semana 4

**Perguntas de teste:**
- "O que é GSAL?"
- "Como crescer sem me sobrecarregar?"
- "Estou ansiosa com o crescimento"
- "O que fazer após a jornada?"

**O que verificar:**
- ✅ LYA apresenta GSAL como lógica, não fórmula
- ✅ Conecta crescimento com equilíbrio
- ✅ Valoriza o caminho percorrido
- ✅ Frase-chave: "Crescer não é correr. É sustentar o que você construiu"

---

## 🧪 TESTES DE INTEGRAÇÃO

### 8. Verificar detecção automática da semana

**Teste:**
- Criar usuário de teste no Dia 1
- Verificar se LYA aplica instruções da Semana 1
- Avançar para Dia 8
- Verificar se LYA muda para instruções da Semana 2

**O que verificar:**
- ✅ LYA identifica corretamente a semana baseado em `day_number`
- ✅ Aplica as instruções específicas da semana correta
- ✅ Mantém todas as regras gerais

### 9. Verificar uso de reflexões

**Teste:**
- Preencher exercício de reflexão do Dia 1
- Fazer pergunta relacionada à reflexão
- Verificar se LYA usa as palavras da usuária

**O que verificar:**
- ✅ LYA reconhece reflexões preenchidas
- ✅ Usa palavras da própria usuária
- ✅ Mostra acompanhamento real

### 10. Verificar formato fixo de resposta

**Teste:**
- Fazer qualquer pergunta para a LYA
- Verificar se a resposta segue o formato:

```
ANÁLISE DA LYA — HOJE

1) FOCO PRIORITÁRIO
...

2) AÇÃO RECOMENDADA
...

3) ONDE APLICAR
...

4) MÉTRICA DE SUCESSO
...
```

**O que verificar:**
- ✅ Formato fixo sempre presente
- ✅ Máximo de 3 ações recomendadas
- ✅ Métricas são mensuráveis em 24-72h

---

## 🐛 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema: LYA não está aplicando instruções da semana correta

**Solução:**
- Verificar se o `day_number` está sendo passado corretamente para a LYA
- Verificar se a lógica de detecção de semana está funcionando
- Confirmar que o prompt completo está configurado na OpenAI

### Problema: LYA está falando de temas avançados na Semana 1

**Solução:**
- Verificar se as instruções da Semana 1 estão no prompt
- Confirmar que a detecção de semana está funcionando
- Reforçar no prompt: "SE day_number entre 1 e 7, aplicar SEMANA 1"

### Problema: LYA não está usando o formato fixo

**Solução:**
- Verificar se o formato fixo está no prompt
- Adicionar exemplo de resposta no prompt
- Reforçar: "TODA resposta deve seguir o formato fixo"

### Problema: Textos ainda têm travessões ou "tração"

**Solução:**
- Executar novamente: `scripts/APLICAR-TODAS-CORRECOES-DIAS-8-30.sql`
- Executar: `scripts/CORRIGIR-TRACOS-FINAL.sql`
- Verificar manualmente no banco

---

## 📝 PRÓXIMOS PASSOS RECOMENDADOS

### Fase 1: Validação (Agora)
1. ✅ Executar todas as verificações acima
2. ✅ Testar LYA com usuários reais
3. ✅ Coletar feedback inicial

### Fase 2: Ajustes (Se necessário)
1. Ajustar prompts baseado em feedback
2. Refinar tom de voz se necessário
3. Corrigir problemas encontrados

### Fase 3: Documentação
1. Documentar casos de uso reais
2. Criar exemplos de respostas ideais
3. Atualizar guias de uso

### Fase 4: Monitoramento
1. Acompanhar métricas de uso
2. Coletar feedback contínuo
3. Iterar melhorias

---

## 🎯 MÉTRICAS DE SUCESSO

### Curto prazo (1 semana)
- ✅ LYA responde no formato correto
- ✅ Usuários completam mais dias da jornada
- ✅ Menos abandono na Semana 1

### Médio prazo (1 mês)
- ✅ Usuários avançam até a Semana 4
- ✅ Feedback positivo sobre a LYA
- ✅ Aumento de engajamento

### Longo prazo (3 meses)
- ✅ Taxa de conclusão da jornada aumenta
- ✅ Usuários se sentem mais apoiados
- ✅ LYA se torna referência na plataforma

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verificar logs da API da LYA
2. Verificar dados no banco
3. Testar com usuário de teste
4. Documentar o problema encontrado

---

**Última atualização:** Após implementação completa das Semanas 1-4
