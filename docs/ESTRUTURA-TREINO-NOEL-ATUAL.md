# Estrutura atual do treino do Noel

**Objetivo:** Documentar como está o treino do Noel hoje para alinhar conversas e respostas à filosofia Ida e ao slogan **"Respostas boas começam conversas boas"** (e à ideia de provocar conversas inteligentes).

**Data:** 12/03/2025

---

## 1. Onde o treino está no código

| Camada | Arquivo | O que contém |
|--------|---------|----------------|
| **Base (Lousa 7)** | `src/lib/noel-wellness/system-prompt-lousa7.ts` | `NOEL_SYSTEM_PROMPT_LOUSA7` — identidade, arquitetura mental (5 passos), 12 aprimoramentos, algoritmos, modos, árvore de decisão, regras gerais, funções, exemplos |
| **Segurança** | `src/lib/noel-wellness/security-prompt.ts` | `NOEL_SECURITY_PROMPT` — o que não revelar, como rejeitar extração, defesas |
| **Prompt completo** | `src/lib/noel-wellness/system-prompt-lousa7.ts` | `NOEL_SYSTEM_PROMPT_WITH_SECURITY` = Lousa 7 + bloco de segurança |
| **Montagem final** | `src/app/api/wellness/noel/route.ts` | `buildSystemPrompt()` concatena: `NOEL_SYSTEM_PROMPT_WITH_SECURITY` + bloco grande "NOEL WELL" (regras de roteamento, scripts, links, functions, formato de resposta, detecção de contexto, etc.) |

Ou seja: **todo o “treino” que o Noel usa em produção** é montado em `route.ts` na função `buildSystemPrompt()`, que junta:

1. Base Lousa 7 (identidade + arquitetura mental + decisão)
2. Bloco de segurança
3. Bloco “NOEL WELL” (comportamento MLM, regras de roteamento, scripts Propagação do Bem, links, functions, formato de resposta obrigatório)

---

## 2. Conteúdo atual da base (Lousa 7) – resumo

- **Identidade:** “NOEL, o mentor inteligente oficial do Wellness System YLADA.”
- **Arquitetura mental em 5 passos:** ENTENDER → CLASSIFICAR → DECIDIR → EXECUTAR → GUIAR.
- **12 aprimoramentos:** sugestão proativa de links, mapa de links em 3 passos, explicação do porquê, ranking de links, fluxo 1 clique, temperatura do lead, filtro inteligente, “melhor ação agora”, leitura emocional, combinações de links, fluxo 7 dias, efeito multiplicador.
- **Algoritmos:** emocional, prioridade, intenção oculta.
- **Modos:** Líder, Iniciante, Acelerado.
- **Modelos mentais:** 4 tipos de distribuidor, 5 tipos de lead, gatilhos de momento.
- **Árvore de decisão:** 9 camadas do perfil estratégico (tipo de trabalho, foco, ganhos, nível Herbalife, carga horária, dias/semana, meta financeira, meta 3 meses, meta 1 ano) → 4 planos (Vendas Rápidas, Duplicação, Híbrido, Presidente).
- **Regras gerais:** direto, objetivo, personalizar por perfil, scripts quando possível, ético, próximo passo claro.
- **Funções listadas** (getUserProfile, buscarBiblioteca, recomendarFluxo, recomendarLinkWellness, getFluxoInfo, getFerramentaInfo, getQuizInfo, getLinkInfo, getMaterialInfo, etc.).
- **Exemplos de uso** (lead frio, quente, distribuidor desanimado, troca de senha).

Hoje **não há** na Lousa 7 nenhuma frase explícita sobre:
- “Respostas boas começam conversas boas”
- “Provocar conversas inteligentes”
- Filosofia Ida como eixo de conversa/resposta

---

## 3. Conteúdo do bloco “NOEL WELL” (em `route.ts`) – resumo

- **Posicionamento:** Mentor de crescimento em MLM (captação, carteira, recrutamento, equipe, volume, ganhos). Não é suporte técnico.
- **O que NUNCA falar:** ferramenta, plataforma, método, sistema, HOM, calculadora (como termo institucional), nome de empresa/tecnologia.
- **O que SEMPRE falar:** ações, pessoas, conversas, volume, equipe, faturamento, números, próximo passo em 24h.
- **Três pilares:** Clientes (carteira), Novos parceiros (equipe), Volume/ganho.
- **Formato de resposta:** (1) diagnóstico rápido, (2) ajuste estratégico, (3) meta clara, (4) próxima ação em 24h.
- **Roteamento:** perguntas institucionais (responder direto), perguntas por scripts (base de conhecimento), perguntas por apoio emocional (pode usar scripts emocionais).
- **Regras de scripts:** estrutura em 9 partes (Propagação do Bem), proibições (nunca “eu tenho”, “quero te apresentar”, etc.), dica proativa sobre compartilhamento.
- **Functions:** getFluxoInfo, getFerramentaInfo, getQuizInfo, getLinkInfo, recomendarLinkWellness, getMaterialInfo, calcularObjetivosCompletos — com regras de quando chamar e de nunca inventar links.
- **Entrega de links:** nunca “Quer que eu te envie?”; sempre entregar link e script diretamente.
- **Comportamento proativo:** quando mencionar cliente/lead/situação, oferecer links + scripts.
- **Detecção de contexto:** mapeamento situação → função a chamar (ex.: “cansado” → calculadora água + quiz energia + recomendarLinkWellness).
- **Direcionamento “fale com 10 pessoas”** para geração de contatos.
- **Formato obrigatório de resposta** quando usar functions (título, o que é, link, script sugerido, quando usar).

Ou seja: o foco atual do treino é **ação, números, links, scripts e próximo passo**, e não ainda um eixo narrativo explícito tipo “respostas boas começam conversas boas” ou “provocar conversas inteligentes”.

---

## 4. Filosofia e slogan no site (referência para alinhar)

- **Home (`HomePageContent.tsx`):**
  - “Não é sobre responder mensagens. É sobre provocar conversas certas.”
  - “O resultado é menos curiosos, mais qualidade de contato e conversas que evoluem naturalmente para relacionamento e decisão.”
- **Institucional (`InstitutionalPageContent.tsx`):**
  - “Boas conversas começam com boas perguntas.”
- **Filosofia YLADA (Home):**
  - “Tecnologia só faz sentido quando melhora a conversa, fortalece o relacionamento e orienta decisões melhores no campo.”
  - “Soluções que transformam dados em clareza, interações em oportunidades e conversas em resultados reais.”

Slogan que vocês estão implantando: **“Respostas boas começam conversas boas”** (e a filosofia de provocar conversas inteligentes).

---

## 5. Onde encaixar filosofia e slogan no treino

Para que o Noel fale e se comporte alinhado a isso, o treino precisa incluir explicitamente:

1. **Na identidade / missão (Lousa 7 ou início do bloco NOEL WELL)**  
   - Uma linha tipo: “Sua missão inclui provocar conversas inteligentes: respostas boas começam conversas boas.”  
   - Pode ficar logo após “Você é NOEL…” em `system-prompt-lousa7.ts` ou no início do bloco em `route.ts`.

2. **No “estilo” ou “tom”**  
   - Orientar que cada resposta do Noel deve ser pensada como **início ou continuação de uma conversa boa** (clara, útil, que gera próximo passo), não só “resposta técnica”.

3. **No formato de resposta (bloco NOEL WELL)**  
   - Além de “diagnóstico → ajuste → meta → próxima ação”, reforçar: “Cada resposta deve ser uma **resposta boa** no sentido Ida: que qualifica a conversa e abre espaço para a próxima pergunta ou ação.”

4. **Em exemplos (Lousa 7 ou NOEL WELL)**  
   - Um exemplo que ilustre “resposta boa” = resposta que provoca conversa inteligente (ex.: em vez de só dar um link, dar link + uma pergunta ou um próximo passo que engaja).

Sugestão de **arquivos a editar** para implementar isso:

- **`src/lib/noel-wellness/system-prompt-lousa7.ts`**  
  - Inserir 1–2 frases na identidade (filosofia Ida + slogan “Respostas boas começam conversas boas”) e, se quiser, um exemplo de “resposta boa”.
- **`src/app/api/wellness/noel/route.ts`**  
  - No bloco NOEL WELL, na parte de “formato de resposta” ou “comportamento”, acrescentar a regra de que respostas devem “começar conversas boas” (objetivas, acionáveis, que convidam ao próximo passo).

---

## 6. Resumo prático

| O quê | Onde está |
|------|-----------|
| **Treino base (identidade, decisão, regras gerais)** | `src/lib/noel-wellness/system-prompt-lousa7.ts` → `NOEL_SYSTEM_PROMPT_LOUSA7` |
| **Segurança** | `src/lib/noel-wellness/security-prompt.ts` → `NOEL_SECURITY_PROMPT` |
| **Prompt “completo” (base + segurança)** | `system-prompt-lousa7.ts` → `NOEL_SYSTEM_PROMPT_WITH_SECURITY` |
| **Treino de comportamento (MLM, scripts, links, functions)** | `src/app/api/wellness/noel/route.ts` → `buildSystemPrompt()` (bloco grande após `NOEL_SYSTEM_PROMPT_WITH_SECURITY`) |
| **Filosofia/slogan no site** | `HomePageContent.tsx` (“provocar conversas certas”), `InstitutionalPageContent.tsx` (“boas perguntas”) — ainda **não** no prompt do Noel |

Para alinhar **toda a estrutura de conversa e resposta do Noel** à filosofia Ida e ao slogan “Respostas boas começam conversas boas”:

1. Incluir filosofia + slogan na **identidade** em `system-prompt-lousa7.ts`.
2. Incluir na **regra de formato de resposta** em `route.ts` que “respostas boas” = respostas que começam/conduzem conversas boas.
3. (Opcional) Adicionar 1 exemplo de “resposta boa” em um dos dois arquivos.

---

## 7. Atualização 12/03/2025 — Filosofia e 4 modos implementados

As 6 camadas de filosofia e o desenho dos 4 modos internos foram aplicados:

- **Camada 1 (Filosofia):** Em `system-prompt-lousa7.ts` — bloco "FILOSOFIA DE CONVERSA" + "MODOS INTERNOS DO NOEL" (Mentor, Criador, Executor, Analista). O usuário continua vendo apenas "Noel".
- **Camadas 2–6:** Em `route.ts` — PRINCÍPIO DE RESPOSTA DO NOEL, ESTILO DE CONVERSA, DIAGNÓSTICO COMO INÍCIO DE CONVERSA, PERGUNTAS DO NOEL, EXEMPLO DE RESPOSTA BOA.

Arquitetura ideal, Noel Suporte (chat de ajuda) e ordem de implementação estão em **`docs/NOEL-ARQUITETURA-IDEAL-YLADA.md`**.
