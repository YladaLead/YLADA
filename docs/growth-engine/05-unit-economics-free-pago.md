# Unit economics, free, pago e agente financeiro

## Objetivo do documento

Definir **o que monitorar** e **como o agente financeiro / risco** deve se comportar em recomendações — sem implementação técnica. Os **valores numéricos** (limites, preços) são decisão da empresa e devem ser preenchidos em uma tabela operacional separada quando o negócio fechar os números.

## Princípio

Crescimento sem freio pode:

- **Quebrar caixa** (free generoso + custo de API/infra alto + abuso).
- **Travar crescimento** (free tão limitado que ninguém ativa).

O agente financeiro existe para **operacionalizar políticas** já decididas, não para inventar a estratégia de precificação sozinho.

---

## Sinais mínimos para o agente financeiro

| Sinal | Para que serve |
|-------|----------------|
| Custo variável total (API LLM, WhatsApp, hospedagem proporcional, etc.) | Saber se o mês aguenta mais volume |
| Usuários novos vs ativos | Distinguir hype de uso |
| Taxa de ativação (definir: “fez ação X”) | Free que não ativa não valida produto |
| Leads ou conversões monetizáveis | Liga growth a receita |
| Retenção simples (ex.: volta em 7 dias) | Evita escalar churn alto |
| Receita (MRR, vendas únicas, ticket) | Calcular espaço para CAC |

---

## Decisões típicas (lógica, não código)

### Free

**Liberar ou ampliar** quando:

- custo marginal por usuário ativo está **abaixo** do limite definido;
- ativação está fraca e o gargalo é **atrito**, não qualidade do lead;
- há hipótese clara de que mais uso gera **dados ou prova** para conversão.

**Restringir ou endurecer** quando:

- custo por usuário ou por lead ultrapassa limite;
- há sinal de **abuso** (automação, uso que não converte em valor);
- conversão paga existe e o free está **canibalizando** sem compensação (testar paywall ou limite).

### Pago / upgrade

**Empurrar** quando:

- valor percebido já demonstrado (uso repetido, resultados, depoimentos);
- funil de suporte aguenta volume.

**Não forçar** prematuramente na fase A se o objetivo é **aprender** — mas pode haver **teste** de preço com audiência pequena.

### Mídia paga e escala

**Gate obrigatório:** só recomendar aumento relevante de spend se:

- message match e oferta estão **validados** (ver fases no documento 03);
- existe **orçamento máximo** e critério de parada (CPA, ROAS, ou lead qualificado);
- custo total do produto + aquisição não ultrapassa limite definido pelo negócio.

---

## Formato de saída sugerido do agente financeiro (texto)

Em cada ciclo (ex.: diário ou semanal):

1. **Resumo:** 3–5 métricas na comparação com período anterior.
2. **Veredito:** manter política | ajuste leve | alerta crítico.
3. **Ações recomendadas** (no máximo 3), cada uma com:
   - dependência de aprovação humana: sim/não;
   - risco se não fizer.
4. **O que o Diretor deve saber** em uma frase (ex.: “não escalar ads esta semana”).

---

## Integração com os outros agentes

- **Diretor** propõe “ir para anúncios”; **Financeiro** pode **vetar ou limitar** o tamanho do teste.
- **Otimizador** propõe testes de copy; se o teste implicar **aumento de custo** (mais tráfego, mais chamadas de API), **Financeiro** valida.
- **Criador / Experiência** não definem limites de free; apenas consomem **brief** de “o que pode prometer” dentro da política atual.

---

## Próximo passo operacional (não técnico)

Preencher uma **tabela interna** (planilha) com:

- Limite de custo por usuário ativo / por lead.
- Política atual do plano free (o que está incluso).
- Regra de upgrade (gatilhos).
- Orçamento máximo semanal de teste de mídia.

Referenciar essa tabela nos prompts do agente financeiro quando for implementá-lo.
