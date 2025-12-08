# 📘 Base de Conhecimento — Scripts NOEL Wellness

# 🟦 Bloco 9 — Notificações Inteligentes (Rituais · Progresso · Motivação · Recrutamento · Cultura)

**Status:** Bloco criado e iniciando preenchimento.  
**Objetivo:** Criar notificações curtas, diretas e comportamentais que ativam, orientam, motivam e acompanham o consultor diariamente.  
**Estilo:** Jim Rohn (disciplina), Mark Hughes (energia), Eric Worre (profissionalismo).  
**Formato:** Cada notificação = mensagem curta + contexto + tag + prioridade.

# 🔥 Categoria 1 — Notificações do Ritual 2–5–10

Essas notificações acionam o consultor nos três rituais do dia.

## ⭐ Notificação R5-Tarde — Produtividade
**Categoria:** notificacao_ritual  
**Título:** Ritual 5 — Hora da ação  
**Mensagem:** "Hora do Ritual 5! 💪 Escolha 5 ações simples: follow-up, indicação ou convite. Só faça."  
**Tags:** ["ritual5","tarde","produtividade"]  
**Prioridade:** 10

## ⭐ Notificação R10-Noite — Reflexão
**Categoria:** notificacao_ritual  
**Título:** Ritual 10 — Fechamento do dia  
**Mensagem:** "Feche seu dia com consciência: o que você fez hoje que aproxima você do que deseja? 10 minutos valem ouro."  
**Tags:** ["ritual10","noite","reflexao"]  
**Prioridade:** 9

# 🔥 Categoria 2 — Notificações de Progresso

Quando o consultor avança, trava ou oscila.

## ⭐ Progresso0 — Dia parado
**Categoria:** notificacao_progresso  
**Título:** Vamos retomar?  
**Mensagem:** "Hoje ficou parado… Mas tudo bem. Um passo agora muda seu dia. Escolha 1 microação e faça."  
**Tags:** ["progresso","retomar","acao"]  
**Prioridade:** 10

# 🔥 Categoria 3 — Notificações Motivacionais

Curta, direta e baseada em Rohn / Hughes / Worre.

## ⭐ Motivacional — Disciplina
**Categoria:** notificacao_motivacional  
**Título:** Disciplina diária  
**Mensagem:** "Jim Rohn dizia: a disciplina é a ponte entre sonhos e conquistas. Sua ponte te espera hoje."  
**Tags:** ["motivacao","disciplina","jim_rohn"]  
**Prioridade:** 10

## ⭐ Motivacional — Momentum
**Categoria:** notificacao_motivacional  
**Título:** Força do movimento  
**Mensagem:** "Momentum nasce de pequenas ações repetidas. Hoje é mais um tijolo colocado no seu futuro."  
**Tags:** ["motivacao","momentum","acao"]  
**Prioridade:** 9

# 🔥 Categoria 4 — Notificações de Plano (7 / 14 / 30 / 90 dias)

Ativam o consultor no plano customizado.

## ⭐ Plano — Dia 1
**Categoria:** notificacao_plano  
**Título:** Seu dia 1  
**Mensagem:** "Dia 1: Foque no simples. Ritual 2 + Ritual 5 + usar seu produto. Começar já é vitória."  
**Tags:** ["plano","dia1","inicio"]  
**Prioridade:** 10

## ⭐ Plano — Semana 1
**Categoria:** notificacao_plano  
**Título:** Semana 1  
**Mensagem:** "Semana 1 é sobre criar ritmo. Cumpra suas microtarefas. A consistência vence a força."  
**Tags:** ["plano","semana1","ritmo"]  
**Prioridade:** 9

# 🔥 Categoria 5 — Notificações para Follow-up

Lembram o consultor de fechar ciclos.

## ⭐ Follow-up — Cliente quente
**Categoria:** notificacao_followup  
**Título:** Cliente pronto  
**Mensagem:** "Aquela pessoa mostrou interesse! Envie uma mensagem agora enquanto o momento ainda está quente."  
**Tags:** ["followup","oportunidade","momento"]  
**Prioridade:** 10

# 🔥 Categoria 6 — Notificações de Recrutamento

Ativam convites de forma leve e profissional.

## ⭐ Recrutamento — Convite Leve
**Categoria:** notificacao_recrutamento  
**Título:** Seu convite do dia  
**Mensagem:** "Envie 1 convite leve hoje. Nada formal — só abrir porta. Convites mudam vidas."  
**Tags:** ["recrutamento","convite","leve"]  
**Prioridade:** 10

## ⭐ Recrutamento — Visão
**Categoria:** notificacao_recrutamento  
**Título:** Oportunidade  
**Mensagem:** "Alguém na sua lista hoje precisa do que você tem. Mostre a visão."  
**Tags:** ["recrutamento","visao","proposito"]  
**Prioridade:** 9

# 🔥 Categoria 7 — Notificações de Cultura YLADA

Criam identidade, pertencimento e propósito.

## ⭐ Cultura — Identidade
**Categoria:** notificacao_cultura  
**Título:** Cultura YLADA  
**Mensagem:** "Aqui na YLADA, acreditamos no simples, no duplicável e no humano. Faça o básico bem feito hoje."  
**Tags:** ["cultura","ylada","identidade"]  
**Prioridade:** 10

## ⭐ Cultura — Propósito
**Categoria:** notificacao_cultura  
**Título:** Transformação  
**Mensagem:** "Lembre-se: cada bebida entregue muda um dia de alguém. Cada conversa abre uma porta. Você faz parte de algo maior."  
**Tags:** ["cultura","proposito","impacto"]  
**Prioridade:** 10

---

🟢 **Observações técnicas para Claude (seed)**

- Cada notificação deve ser inserida na tabela ylada_wellness_notificacoes_modelos (caso exista) ou ylada_wellness_base_conhecimento se a notificação for tratada como script.  
- Campos necessários: categoria, título, mensagem, tags, prioridade.  
- Deve ser acionada pelo sistema conforme: ritual, progresso, plano, horário do dia, comportamento, intenção.  
- Mensagens devem ser curtas, leves, diretas e comportamentais.

🔵 **Status**

Bloco iniciado. Mais notificações podem ser adicionadas conforme estratégia, plano de 90 dias e comportamento do consultor.

