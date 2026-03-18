# Agente 2 — Auditor do Noel

**Objetivo:** Avaliar se o diagnóstico gerado pelo Noel é bom de verdade (clareza, impacto, personalização, utilidade).

---

## Fluxo

1. **Agente 1** (Simulador) → valida o funil e **captura o diagnóstico**.
2. **Agente 2** (Auditor) → recebe esse texto e **avalia a qualidade** do diagnóstico.

---

## Input do Agente 2

O bloco de texto capturado pelo Agente 1:

```
DIAGNÓSTICO CAPTURADO (para Agente 2)
----------------------------------------------------------------------
[texto do diagnóstico]
----------------------------------------------------------------------
```

---

## Output (formato fixo)

```
CRITÉRIO        | NOTA | OBSERVAÇÃO
Clareza         | X    | ...
Personalização  | X    | ...
Coerência       | X    | ...
Impacto         | X    | ...
Humanização     | X    | ...

NOTA FINAL: X/10

CLASSIFICAÇÃO: Excelente (8–10) | Médio (6–7) | Fraco (<6)

RESUMO GERAL (1–2 linhas): [pronto para uso comercial ou não]
```

Nota: 0 a 10 para cada critério; nota final + classificação + resumo decisório ao final.

---

## Prompt (para ChatGPT ou script)

Copie o bloco abaixo e, no final, cole o diagnóstico.

```
Você é um auditor especialista em avaliação de diagnósticos gerados por IA.

Você receberá um diagnóstico criado por uma IA chamada Noel, usado em um SaaS chamado YLADA.

Seu objetivo é avaliar a qualidade desse diagnóstico como se fosse um profissional real lendo.

Avalie os seguintes critérios:

1. Clareza
O texto é fácil de entender? Está direto ou confuso?

2. Personalização
Parece feito para a pessoa ou genérico?

3. Coerência
O diagnóstico faz sentido como um todo?

4. Impacto
Gera reflexão? Faz a pessoa pensar "isso é pra mim"?

5. Humanização
Parece escrito por alguém humano ou por um robô?

Dê uma nota de 0 a 10 para cada critério.

Regras importantes:
- Seja direto
- Seja honesto (não tente "agradar")
- Se algo estiver ruim, explique o porquê
- Não reescreva o diagnóstico, apenas avalie

Formato obrigatório de resposta:

CRITÉRIO        | NOTA | OBSERVAÇÃO
Clareza         | X    | ...
Personalização  | X    | ...
Coerência       | X    | ...
Impacto         | X    | ...
Humanização     | X    | ...

No final da avaliação, gere também:

NOTA FINAL: X/10

CLASSIFICAÇÃO (escolha uma): Excelente (8–10) | Médio (6–7) | Fraco (<6)

RESUMO GERAL (1–2 linhas): Explique rapidamente se esse diagnóstico está pronto para uso comercial ou não.

Agora avalie o seguinte diagnóstico:

[COLE O DIAGNÓSTICO AQUI]
```

---

## Uso na prática

### Passo 1 — Rodar Agente 1

```bash
npm run agente:simulador
```

### Passo 2 — Copiar do terminal

O bloco **DIAGNÓSTICO CAPTURADO (para Agente 2)** (todo o texto entre os traços).

### Passo 3 — Avaliar com Agente 2

**Opção A — Manual (ChatGPT)**  
Colar o prompt acima no ChatGPT, substituir `[COLE O DIAGNÓSTICO AQUI]` pelo texto copiado e enviar.

**Opção B — Script (com OpenAI)**  
Salvar o diagnóstico em um arquivo (ex.: `ultimo-diag.txt`) e rodar:

```bash
OPENAI_API_KEY=sk-... npx tsx scripts/agents/ylada-auditor-noel.ts < ultimo-diag.txt
# ou
DIAGNOSTICO_FILE=ultimo-diag.txt OPENAI_API_KEY=sk-... npm run agente:auditor
```

O script imprime a tabela de avaliação no terminal.

---

## Como interpretar as notas

| Faixa   | Ação |
|---------|------|
| **8–10** | Excelente → não mexe |
| **6–7**  | Médio → pode melhorar depois |
| **&lt; 6** | Problema real → ajustar Noel |

---

## Regra importante

**Não ajuste o Noel com 1 teste.**

Faça 3 a 5 diagnósticos, rode o Auditor em cada um e olhe o **padrão** das notas antes de decidir mudanças.

---

## Próximo passo

Depois de rodar 3 avaliações, você pode:

- Ajustes finos no Noel  
- Ou validar que já está bom  
- Ou partir para o marketing  

---

## Futuro (melhoria contínua)

Salvar histórico das avaliações em formato estruturado, por exemplo:

```json
{
  "diagnostico": "...",
  "notas": { "clareza": 8, "personalizacao": 6, "coerencia": 7, "impacto": 6, "humanizacao": 8 },
  "notaFinal": 7.2,
  "classificacao": "Médio",
  "data": "2025-03-18"
}
```

Isso permite: melhoria contínua do Noel, dados para pitch e prova de qualidade.
