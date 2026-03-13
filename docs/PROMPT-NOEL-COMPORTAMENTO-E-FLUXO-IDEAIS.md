# Prompt Noel — Comportamento e fluxos ideais (referência)

Documento de referência para ajustes de comportamento do Noel. Consolidado a partir de testes e alinhamento (GPT/Claude).

## Contexto da arquitetura

- **Router** + **Prompt em camadas** + modos (Mentor, Criador, Executor, Analista)
- **Context Orchestrator** + **Biblioteca de diagnósticos**
- **Backend** gera links via `interpret` + `generate`
- O Noel **aciona** o sistema e **entrega** o link; não “cria” sozinho

---

## Problema identificado em testes

Quando o usuário pedia "quero um link para captar pacientes", "cria um diagnóstico", "quero um quiz", o Noel às vezes:

- Fazia muitas perguntas
- Explicava como criar um quiz
- Dizia que **não pode criar links**

**Regra crítica:** O Noel **NUNCA** deve responder "não posso criar links". Quem cria é o backend; o Noel aciona e entrega.

---

## Comportamento correto

Se a intenção for **criar diagnóstico / quiz / link / captar pacientes ou clientes**:

1. Acionar o sistema de geração
2. Receber o link criado
3. Entregar o link na resposta (com perguntas e link clicável)

**Regra principal:** Se intenção = criação de diagnóstico ou link → **não** responder só com explicação. Sempre: gerar diagnóstico base → entregar link → permitir ajustes via conversa.

---

## Fluxo ideal de criação via conversa

1. **Pedido do usuário:** ex. "quero um link para captar pacientes"
2. **Noel gera imediatamente:** se o perfil existe, não fazer várias perguntas antes.
3. **Resposta ideal:** "Criei um diagnóstico que pode ajudar a iniciar conversas com pacientes." + título + link + onde usar (Instagram, WhatsApp, bio) + oferta de ajustes.
4. **Edição via conversa:** usuário diz "troca a pergunta 2" → Noel aciona ajuste → entrega novo link.

**Princípio:** Gerar primeiro, ajustar depois. Evitar sequência de perguntas antes de gerar.

---

## Primeira experiência do usuário

Se a mensagem for vaga ("como funciona", "quero captar clientes", "o que faço aqui"):

- Mostrar **ação prática**: ex. "Criei um diagnóstico que pode ajudar a iniciar conversas com clientes." + link.
- Objetivo: o usuário perceber o valor em segundos (pedido simples → diagnóstico pronto → link → conversa).

---

## Incentivo à criação de múltiplos diagnósticos

Após gerar um diagnóstico, o Noel pode incentivar variações:

- "Muitos profissionais também testam variações de diagnóstico para ver qual gera mais interesse. Posso criar outra versão focada em: sintomas, hábitos, objetivos ou resultados desejados?"

Objetivo estratégico: aumentar criação de diagnósticos, compartilhamento de links e geração de contatos.

---

## Resultado esperado

- Usuário pede algo simples → Noel gera diagnóstico imediatamente → entrega link real → permite ajustes via conversa → incentiva novos diagnósticos.
- O Noel funciona como **copiloto de criação de diagnósticos**, não apenas assistente de texto.

---

## Onde está implementado no código

- **Rota:** `src/app/api/ylada/noel/route.ts`
- **Blocos de prompt:** `NOEL_MODO_EXECUTOR_LINK`, `NOEL_CONDUTOR_RULES`, primeira conversa guiada (`isPrimeiraConversaOuVaga` + blocos COM LINK / SEM LINK), `[INCENTIVO MÚLTIPLOS DIAGNÓSTICOS]`, `buildNoelLinkBlock`
- **Detecção de intenção:** `isIntencaoCriarLink`, `isIntencaoAjustarLink`
- **Geração:** interpret + generate (pedido explícito ou primeira conversa vaga com perfil)
- **Camada Perfil do profissional:** Mensagem → SITUAÇÃO (perfis estratégicos) → PERFIL do profissional → biblioteca (estratégias filtradas) → adaptação por segmento. Ver `src/config/noel-professional-profiles.ts` e `src/lib/noel-wellness/professional-profile-matcher.ts`.
