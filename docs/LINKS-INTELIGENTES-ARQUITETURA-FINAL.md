# Links Inteligentes — Arquitetura Final (UX + Lógica Técnica)

> **Pacotes 1–5 consolidados:** Ver `LINKS-INTELIGENTES-PACOTES-1-5-CONSOLIDADO.md` (arquiteturas universais, tabela de decisão, schema, UX, ordem de PRs e próximo passo).

**Objetivo da página:** Motor de Arquitetura de Conversas Ativas — não “criador de quiz”. O profissional entra com intenção → sistema interpreta → decide estratégias → mostra lógica → gera fluxo → entrega link estratégico.

**Princípios:** Máximo 2 estratégias; sem pergunta “volume ou qualidade”; decisão híbrida (regra + IA); sempre templates estruturados; preview simples antes de gerar; sem dropdown duplicado, sem dupla decisão.

---

## 1. Visão do fluxo em 5 camadas

| Camada | Nome | Responsabilidade | Onde |
|--------|------|------------------|------|
| 1 | Intenção | Capturar objetivo + texto livre. Saída: objetivo, tema, area. | UI + API interpret (Etapa 1) |
| 2 | Interpretação inteligente | Classificar tipo de público, maturidade; definir 2 estratégias possíveis (qualidade + volume). | Backend: regra + opcional IA |
| 3 | Apresentação das estratégias | Mostrar 2 cards: “Estratégia 1 — Qualidade” e “Estratégia 2 — Volume”, com título e 1 linha de impacto. Usuário escolhe uma. | UI |
| 4 | Detalhamento do fluxo | Card expandido: o que o fluxo faz, perguntas, resultado, CTA. Botão único: [ Gerar esse link ]. | UI + dados do template |
| 5 | Geração e orquestração | Buscar template base, personalizar (título/CTA se IA), salvar, slug, retornar link. Preview opcional simples. | Backend orquestração |

---

## 2. Contratos técnicos por camada

### Camada 1 — Intenção (já existente, ajustar se necessário)

**Entrada (front → backend):**
- `objective`: `"captar" | "educar" | "reter" | "propagar" | "indicar"`
- `text`: string (frase livre)

**Saída (backend → front):**
```json
{
  "interpretacao": {
    "objetivo": "captar",
    "tema": "perda de peso",
    "tipo_publico": "pacientes",
    "area_profissional": "medico",
    "contexto_detectado": ["saude", "emagrecimento"]
  }
}
```
- Endpoint: `POST /api/ylada/interpret` (Etapa 1 já entrega isso).
- Nenhuma sugestão de fluxo ainda; nenhum `recommendedTemplateId` na decisão de estratégia (só no fallback atual).

---

### Camada 2 — Estratégias (novo)

**Entrada:** resultado da Camada 1 (`interpretacao`).

**Lógica (regra fixa por objetivo + área + tema):**
- Tabela de “quais 2 fluxos oferecer” por combinação (ex.: captar + medico + perda de peso → `diagnostico_risco_metabolico` + `quiz_bloqueios_emagrecimento`).
- Sempre: primeiro = mais **qualidade**, segundo = mais **volume**.
- IA não escolhe a arquitetura; só pode refinar depois título/CTA se quisermos.

**Saída (novo endpoint ou parte do interpret):**
```json
{
  "estrategias": [
    {
      "id": "diagnostico_risco_metabolico",
      "nome_exibicao": "Diagnóstico de Risco Metabólico",
      "tipo": "qualidade",
      "frase_impacto": "Atrai pacientes mais qualificados e preocupados com saúde."
    },
    {
      "id": "quiz_bloqueios_emagrecimento",
      "nome_exibicao": "Quiz: Por que você não emagrece?",
      "tipo": "volume",
      "frase_impacto": "Maior volume de leads e desperta curiosidade."
    }
  ]
}
```

**Implementação sugerida:** Regra em código (objetivo + area_profissional + tema → 2 IDs de fluxo da biblioteca). Opcional: endpoint `POST /api/ylada/strategies` com body `{ interpretacao }` retornando `estrategias`.

---

### Camada 3 — Apresentação (UI)

- Título: **“Identificamos duas estratégias para seu objetivo”** (ou “Entendemos seu objetivo” + resumo em 1 linha).
- Dois cards clicáveis:
  - Card 1: nome + “Qualidade” + frase_impacto.
  - Card 2: nome + “Volume” + frase_impacto.
- Ao clicar em um card → vai para Camada 4 (detalhe desse fluxo).
- Sem botão “Gerar link” aqui; sem dropdown.

---

### Camada 4 — Detalhamento do fluxo (UI + dados)

**Dados necessários por fluxo (biblioteca de fluxos):**
- `id`, `nome_exibicao`
- `descricao`: o que o fluxo faz (2–3 linhas).
- `perguntas`: lista curta de nomes (ex.: Idade, Peso, Altura, Circunferência abdominal, …).
- `resultado`: texto do que o visitante recebe (ex.: “Diagnóstico resumido + convite para avaliação médica”).
- `cta_padrao`: texto do botão (ex.: “Falar com Dr. ___ no WhatsApp”).

**UI:**
- Card expandido com: título do fluxo, descrição, “Perguntas que serão feitas”, “Resultado”, “CTA”.
- Um único botão: **[ Gerar esse link ]**.
- Link secundário: “Ver outra estratégia” (volta à Camada 3 e escolhe o outro card).

**Fonte dos dados:** Biblioteca de fluxos (JSON ou banco): um registro por `id` de fluxo com os campos acima. Template técnico (schema do quiz/calculadora) pode ser outro objeto referenciado por `template_id` para a Camada 5.

---

### Camada 5 — Geração e orquestração (backend)

**Entrada:**
- `interpretacao` (da Camada 1).
- `fluxo_escolhido_id` (ex.: `diagnostico_risco_metabolico`).
- Opcional: `titulo_personalizado`, `cta_personalizado` (se no futuro a IA preencher).

**Lógica:**
1. Buscar template base do fluxo (por `fluxo_escolhido_id` → `template_id` no catálogo de fluxos).
2. Personalizar variáveis (título, CTA, nome do profissional) a partir de template + interpretação/perfil.
3. Criar registro em `ylada_links` (user_id, template_id, slug, config_json, …).
4. Gerar slug único.
5. Retornar: `{ url, slug, title }` e, se quiser, HTML ou URL de preview.

**Sem:** segundo “Gerar link” na página; sem dropdown de escolha de template na geração; sem decisão de arquitetura aqui (já foi na Camada 3/4).

---

## 3. Biblioteca de fluxos (estrutura mínima)

Cada fluxo padrão tem:

- `id`: string (ex.: `diagnostico_risco_metabolico`).
- `nome_exibicao`: string para a UI.
- `tipo`: `"qualidade" | "volume"`.
- `frase_impacto`: uma linha para o card da Camada 3.
- `descricao`: texto para o card expandido (Camada 4).
- `perguntas`: string[] (rótulos das perguntas).
- `resultado`: string (o que o visitante recebe).
- `cta_padrao`: string.
- `template_id`: UUID do template em `ylada_link_templates` (para a Camada 5).

Regra de negócio (Camada 2): tabela ou função que, dado (objetivo, area_profissional, tema), retorna 2 `id`s de fluxos (qualidade + volume). Ex.: para (captar, medico, perda de peso) → [diagnostico_risco_metabolico, quiz_bloqueios_emagrecimento]. Se tema/área não tiver par específico, usar par padrão (ex. agenda + faturamento com os 2 templates atuais).

---

## 4. UX da página (blocos)

1. **Bloco 1 — Intenção**  
   Título: “Qual é o objetivo deste link?”  
   Botões: Captar | Educar | Reter | Propagar | Indicar.  
   Campo: “Em uma frase, o que você quer alcançar?”  
   Botão: [ Avançar ].

2. **Bloco 2 — Interpretação + Estratégias**  
   Texto: “Entendemos seu objetivo. Você quer [objetivo] [tema]. Identificamos duas estratégias possíveis.”  
   Dois cards (qualidade + volume).  
   Ao clicar → Bloco 3.

3. **Bloco 3 — Detalhe do fluxo**  
   Card expandido com descrição, perguntas, resultado, CTA.  
   [ Gerar esse link ] | “Ver outra estratégia”.

4. **Bloco 4 — Pós-geração**  
   Mensagem de sucesso + link copiável + preview (opcional).  
   Sem novo “Gerar link” nem dropdown.

**Removidos:** “Gerar link” inferior com dropdown; sugestão genérica (“Recomendamos um quiz” sem estratégias); decisão automática sem explicação.

---

## 5. Decisões fechadas (para não refatorar)

- Sempre **no máximo 2 estratégias**.
- **Não** perguntar “volume ou qualidade” ao usuário; sistema decide e mostra as 2.
- **Decisão de arquitetura:** regra por objetivo + área + tema; IA só para refinar título/CTA se implementado depois.
- **Sempre** templates estruturados; nunca gerar fluxo do zero.
- **Preview** simples antes de gerar (título, perguntas, resultado, CTA) + um botão “Gerar link agora”.
- **Um único** botão de geração de link (no detalhe do fluxo); sem duplicidade.

---

## 6. Ordem de implementação sugerida

1. **Biblioteca de fluxos**  
   Definir 2 fluxos (ex.: qualidade + volume para “perda de peso”) com estrutura acima; se ainda não existir template no banco, mapear para os atuais (diagnostico_agenda, calculadora_perda) como fallback.

2. **Camada 2 no backend**  
   Serviço/endpoint que recebe `interpretacao` e retorna `estrategias` (2 itens) por regra.

3. **UI Camadas 2 e 3**  
   Após “Avançar”, mostrar “Entendemos seu objetivo” + 2 cards; ao clicar, mostrar detalhe (Camada 4) com dados da biblioteca.

4. **UI Camada 4**  
   Card expandido + botão “Gerar esse link” e “Ver outra estratégia”.

5. **Camada 5**  
   Endpoint de geração que recebe `fluxo_escolhido_id` + contexto; usa template; persiste; retorna link. Remover “Gerar link” inferior e dropdown da página.

6. **Preview (opcional)**  
   Tela ou modal simples com título, perguntas, resultado, CTA antes de confirmar “Gerar link agora”.

---

## 7. Resumo

- **Intenção** → interpretação (já existe Etapa 1).
- **Interpretação** → regra retorna **2 estratégias** (qualidade + volume).
- **UI** mostra as 2; usuário **escolhe uma** → vê **detalhe** → **um botão** “Gerar esse link”.
- **Backend** gera link a partir do template do fluxo escolhido; sem segunda decisão na tela.

Isso deixa a página pronta para ser implementada com eficiência e eficácia, sem confusão de decisão e com percepção clara de “sistema estratégico”.
