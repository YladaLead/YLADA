# Noel YLADA: um mentor, todas as áreas — perfil do profissional

## Visão

- **Um único Noel** atende todas as áreas YLADA (med, psi, psicanalise, odonto, nutra, coach).
- O treino do Noel é **o mesmo** para todas as áreas; o que muda é o **contexto** de cada requisição.
- O principal diferenciador é o **perfil do profissional**: metas, objetivos, especialidades (e, se quiser, área). O Noel usa isso para personalizar respostas.
- Esse perfil é coletado por um **onboarding** quando a pessoa entra no board (ou na primeira vez que acessa a área). É o que falta hoje no “lado esquerdo” (Med/YLADA).

---

## Como funciona a integração (OpenAI)

1. **Um Noel, um “cérebro”**  
   - Mesmo modelo (ex.: gpt-4o-mini ou Assistants API no futuro).  
   - Mesma base de instruções/treino.  
   - Não é “um Noel por área”; é **um Noel** que recebe **contexto por requisição**.

2. **Contexto por requisição**  
   Em cada chamada à API do Noel entram:
   - **Área** (med, psi, odonto, etc.) → já existe hoje no `AREA_CONTEXT`.
   - **Perfil do profissional** → **a implementar**: metas, objetivos, especialidades (e o que mais fizer sentido por área).

3. **Prompt do Noel**  
   - System: instruções gerais do Noel + contexto da **área** + **resumo do perfil**.  
   - User: histórico da conversa + mensagem atual.  
   Assim o Noel “sabe” com quem está falando e em qual área, e responde de forma personalizada.

---

## O que falta no “lado esquerdo” (Med/YLADA)

Hoje na área Med (e nas outras YLADA):

- Não existe **perfil do profissional** (metas, objetivos, especialidades).
- Não existe **onboarding** ao entrar no board para preencher esse perfil.
- A API `/api/ylada/noel` só recebe `area` + `message` + `conversationHistory`; não injeta perfil.

No Wellness já existe:

- Tabela `wellness_noel_profile`.
- Onboarding (NoelOnboardingCompleto) com várias perguntas.
- A API do Noel Wellness carrega o perfil e injeta no contexto (ex.: `buildStrategicProfileContext`, `[CONTEXTO DO PERFIL]`).

Para o YLADA ficar alinhado à visão, precisamos de algo equivalente: **perfil + onboarding + injeção do perfil na API do Noel**.

---

## Arquitetura proposta

### 1. Um Noel para todas as áreas

- **Não** criar um Noel (ou um Assistant) por área.
- **Sim** usar um único fluxo de prompt/modelo em que:
  - O **system** inclui:
    - Instruções gerais do Noel (comportamento, tom).
    - Contexto da **área** (med, psi, odonto, etc.) — já temos `AREA_CONTEXT`.
    - **Resumo do perfil do profissional** (metas, objetivos, especialidades), quando existir.

### 2. Perfil do profissional (YLADA)

- **Onde guardar**  
  Uma tabela **`ylada_noel_profile`** (ou, se preferir, um JSON por usuário em uma tabela mais genérica), com algo como:
  - `user_id`
  - `area` (med, psi, psicanalise, odonto, nutra, coach) — para multi-área no futuro, ou um perfil “global” por usuário e área opcional.
  - Campos do perfil, por exemplo:
    - **Metas** (ex.: texto ou opções: “aumentar consultas”, “montar consultório”, “trilha empresarial”).
    - **Objetivos** (curto/médio prazo).
    - **Especialidades** (ex.: “clínica geral”, “psiquiatria”, “ortopedia” para med; “clínica”, “infantil” para psi; etc.).
  - Pode incluir também: tempo de atuação, tipo de atendimento (só particular, convênio, ambos), etc., conforme o que fizer sentido para o produto.

- **Quando preencher**  
  - **Onboarding** na primeira entrada no board da área (ex.: ao acessar `/pt/med/home` pela primeira vez, ou em uma tela “Complete seu perfil” antes do Noel).  
  - Opcional: edição em **Configuração** (ex.: “Perfil para o Noel”).

### 3. Onboarding no board (perguntas que “filtram” o profissional)

- Fluxo de perguntas (wizard ou uma página) para capturar:
  - Área de atuação / especialidade(s).
  - Principais metas (ex.: “organizar rotina”, “aumentar captação”, “formação empresarial”).
  - Objetivos (ex.: “abrir consultório em 1 ano”, “ter X pacientes/mês”).
  - O que for relevante para o Noel orientar (links inteligentes, diagnóstico, trilha, etc.).
- Respostas salvas em `ylada_noel_profile` (ou equivalente).
- Se o usuário pular ou não tiver perfil ainda, o Noel pode responder de forma mais genérica e, se quiser, sugerir “Complete seu perfil para eu te orientar melhor”.

### 4. API `/api/ylada/noel`

- **Hoje**: recebe `area`, `message`, `conversationHistory`; monta o system com `AREA_CONTEXT[area]` e chama o modelo.
- **Depois**:
  - Buscar **perfil** do usuário (por `user_id` e, se tiver, `area`) em `ylada_noel_profile`.
  - Montar um **resumo de perfil** em texto (ex.: “Profissional de Medicina, especialidade X, metas: …, objetivos: …”).
  - Incluir esse resumo no **system** do Noel (por exemplo, depois do `AREA_CONTEXT`).
- Assim, **o mesmo Noel** dá suporte a todas as áreas; a distinção vem de **área + perfil**.

### 5. Treino do Noel (OpenAI)

- **Um treino/base** para o Noel (instruções gerais, tom, limites, uso de área e perfil).
- Se no futuro usarem **Assistants API**: um Assistant “Noel YLADA” que recebe em cada thread/turno o contexto (área + perfil) na mensagem do sistema ou na primeira mensagem.
- Se continuarem com **Chat Completions** (como hoje): o system prompt já carrega área + perfil; o treino está nas instruções fixas + nesse contexto dinâmico.

---

## Resumo: um Noel vs um por área

| Pergunta | Resposta |
|----------|----------|
| Vai ter um Noel por área? | **Não.** Um único Noel (mesmo modelo/treino) para todas as áreas. |
| O que diferencia a resposta por área? | O **contexto** enviado em cada requisição: **área** + **perfil do profissional**. |
| O que diferencia por profissional? | O **perfil** (metas, objetivos, especialidades) preenchido no **onboarding** e injetado na API. |
| O que falta no lado Med/YLADA? | **Perfil** (tabela + onboarding com perguntas) e **uso desse perfil** na `/api/ylada/noel`. |

---

## Próximos passos sugeridos

1. **Definir** os campos do perfil YLADA (metas, objetivos, especialidades, etc.) por área (podem ser iguais ou ter pequenas variações).
2. **Criar** a tabela `ylada_noel_profile` (migration) e, se existir, API GET/POST para ler/salvar perfil.
3. **Implementar** o fluxo de onboarding no board (ex.: modal ou página em `/pt/med` que exige ou sugere preencher o perfil antes de usar o Noel).
4. **Alterar** a API `/api/ylada/noel` para carregar o perfil do usuário e injetar no system prompt (resumo em texto).
5. (Opcional) Unificar/treinar **um** Assistant/instrução “Noel YLADA” na OpenAI que já espere esse formato de contexto (área + perfil).

Assim, o Noel fica **um só**, treinado uma vez, e passa a “conhecer” o profissional via **perfil** e **área**, exatamente como você descreveu.
