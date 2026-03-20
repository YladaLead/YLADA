# Agente de teste — Perfil do usuário e comportamento do Noel

**Uso:** Instruções para o agente (ou pessoa) que verifica a **área do perfil** e se o **Noel se comporta de acordo com o perfil** (objetivos, segmento e comunicação).  
**Relacionado:** `docs/PASSO-A-PASSO-PARTE-INTERNA.md`, `docs/PROMPT-TESTE-PARTE-INTERNA-OUTRO-CHAT.md`, `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md`.

---

## 1. Onde está o perfil e como é preenchido

### 1.1 Fluxo geral

1. **Onboarding (primeira entrada)**  
   - Página de boas-vindas da área (ex.: YLADA Estética).  
   - Campos: **nome completo**, **telefone/WhatsApp**.  
   - Ao salvar: redireciona para **Perfil empresarial** se ainda não tiver `profile_type` e `profession`; caso contrário, para o board/home.

2. **Perfil empresarial** (`/pt/perfil-empresarial` ou `/{area}/perfil-empresarial`)  
   - **Primeira decisão:** “Como você atua?” → **profile_type**: `liberal` ou `vendas`.  
     - Liberal: atende clientes diretamente (consultório, clínica, atendimento individual).  
     - Vendas: trabalha com vendas de produtos/serviços (suplementos, cosméticos, etc.).  
   - **Segunda decisão (depende do tipo):**  
     - Se **liberal:** “Qual é o seu principal tipo de atendimento?” → **profession** (ex.: medico, estetica, odonto, psi, coach, fitness, nutricionista, outro).  
     - Se **vendas:** “O que você vende principalmente?” → **profession** (ex.: vendedor_suplementos, vendedor_cosmeticos, vendedor_perfumes, vendedor_servicos, vendedor_produtos, vendedor).  
   - **Próximas perguntas** vêm do fluxo daquele `profile_type` + `profession` (config: `config/ylada-profile-flows.ts`):  
     - Dor principal, fase do negócio, prioridade, metas, objetivos de curto prazo.  
     - Modelo de atuação (consultório, online, domicílio, etc.), capacidade por semana, ticket médio.  
     - Canais principais (Instagram, WhatsApp, indicação, etc.), rotina, frequência de postagem.  
     - Campos específicos por área (especialidades, público, etc.) em `area_specific`.  
   - Tudo é salvo na tabela **`ylada_noel_profile`** (por `user_id` + `segment`).  
   - **Segment** vem da área em que a pessoa está (ylada, med, psi, estetica, coach, seller, etc.).

3. **Diagnóstico profissional (quiz estratégico)**  
   - 4 perguntas (ex.: como gera clientes, quantas conversas por semana, o que acontece nas conversas, se usa diagnóstico antes da conversa).  
   - Config: `src/config/diagnostico-profissional.ts`.  
   - Resultado alimenta **memória estratégica** e **mapa da trilha** (estágio: atração, diagnóstico, conversa, etc.), usados pelo Noel.

### 1.2 O que o Noel recebe do perfil

- **Bloco [PERFIL DO PROFISSIONAL]:** texto gerado por `buildProfileResumo(profile)` (`src/lib/ylada-profile-resumo.ts`): segment, profile_type, profession, category, sub_category, fase_negocio, dor_principal, prioridade_atual, metas_principais, objetivos_curto_prazo, modelo de atuação, capacidade, ticket médio, canais, rotina, area_specific (especialidades, público, etc.).  
- **Resumo da trilha** (snapshot): situação atual e próximos passos no mapa estratégico.  
- **Memória estratégica:** o que o Noel já sabe da jornada (ex.: “já criou diagnóstico… próximo passo é…”).  
- **Links ativos:** lista de links/quizzes já criados pelo profissional (ordenada do mais recente ao mais antigo).

Com isso, o Noel deve **personalizar** respostas, scripts e links (ex.: médico → pacientes e agenda; estética → clientes e procedimentos; vendedor Nutra → suplementos e kits).

---

## 2. O que verificar na área do perfil

Use este checklist para garantir que a área do perfil está funcionando e que as respostas fazem sentido para o Noel.

### 2.1 Acesso e fluxo

- [ ] Acesso a **Perfil empresarial** existe (menu, link “Perfil” ou “Perfil empresarial”) e abre a tela correta para a área (ylada, estética, med, etc.).
- [ ] Se o usuário ainda não tem `profile_type` e `profession`, o fluxo leva a preencher primeiro **tipo de atuação** (liberal vs vendas) e depois **profissão/área** (conforme `ylada-profile-flows.ts` e `PROFESSION_BY_SEGMENT`).
- [ ] As opções de profissão são **coerentes com o segmento** (ex.: estética não mostra “médico”; med só “medico”).

### 2.2 Perguntas que complementam o profissional

- [ ] Após escolher tipo + profissão, aparecem **perguntas adicionais** do fluxo (dor principal, fase do negócio, metas, objetivos, modelo de atuação, canais, etc.).
- [ ] As perguntas **fazem sentido** para aquele tipo e profissão (ex.: liberal com “estetica” vê perguntas de atendimento/clínica; vendas vê perguntas de funil/volume).
- [ ] Não há perguntas repetidas nem opções quebradas (valores salvos = opções exibidas).
- [ ] Campos opcionais e obrigatórios estão claros; não bloqueia sem necessidade.

### 2.3 Persistência e exibição

- [ ] Ao **salvar**, os dados são gravados (não perde ao sair/recarregar).
- [ ] Na tela de **Configurações / Conta** (ou onde o perfil é exibido), os dados aparecem **corretos** (tipo, profissão, metas, etc.).
- [ ] Editar e salvar de novo persiste; não há conflito entre segment e área.

### 2.4 Sentido para o Noel

- [ ] Os campos preenchidos são os que o Noel usa: **profile_type**, **profession**, **dor_principal**, **fase_negocio**, **metas_principais**, **objetivos_curto_prazo**, **canais_principais**, **area_specific** (especialidades, público, etc.).  
  (Referência: `buildProfileResumo` e `ylada_noel_profile`.)
- [ ] Se o usuário tem **objetivos/metas** preenchidos, isso deve aparecer no resumo que o Noel recebe e influenciar “próximo passo” e “plano”.

---

## 3. Como o agente deve se comportar baseado no perfil (teste do Noel)

Objetivo: garantir que o **Noel usa perfil, objetivos e comunicação** de forma coerente. O agente deve **testar como usuário** e avaliar se as respostas batem com o perfil.

### 3.1 Regra de ouro

- Para cada **perfil testado** (ex.: estética, med, seller), o agente deve **conhecer o que está cadastrado**: tipo de atuação, profissão, metas/objetivos, dor principal (se houver).  
- Toda pergunta feita ao Noel deve ser **avaliada**: a resposta faz sentido **para esse perfil**? (ex.: médico → “pacientes” e “agenda”; vendedor → “leads” e “conversão”.)

### 3.2 Comportamento esperado do Noel (critérios para o agente)

- **Linguagem e contexto:**  
  - Médico/med → pacientes, consultório, agenda.  
  - Estética/psi/odonto/coach/fitness → clientes (e pacientes quando for o caso).  
  - Vendedor/seller/nutra → clientes, leads, funil, kits/produtos.  
  O Noel não deve usar termo genérico quando o perfil já define (ex.: não dizer só “clientes” para médico se o correto é “pacientes”).

- **Objetivos e metas:**  
  - Se o perfil tem **metas_principais** ou **objetivos_curto_prazo**, as respostas do Noel (ex.: “qual meu próximo passo?”, “me dê um plano”) devem **alinhar** a esses objetivos, não ignorá-los.

- **Links e scripts:**  
  - Links e scripts sugeridos devem ser **coerentes com o segmento e a profissão** (ex.: estética → diagnóstico de procedimentos/estética; não sugerir quiz de suplemento como principal).

- **Respostas curtas e acionáveis:**  
  - Respostas não devem ser genéricas nem longas demais; devem incluir **próxima ação** quando fizer sentido (ver também `docs/ANALISE-NOEL-TESTE-INTERNO-19-03-2026.md`).

### 3.3 Perguntas sugeridas para o agente testar (por perfil)

O agente pode usar (ou adaptar) estas perguntas e checar se a resposta está alinhada ao perfil:

| Pergunta ao Noel | O que verificar |
|------------------|-----------------|
| “Qual meu próximo passo?” | Resposta usa segment/profissão (pacientes vs clientes vs leads); menciona estágio da trilha; se houver links ativos, cita pelo menos um link. |
| “Qual o melhor diagnóstico para começar a conversar?” | Se há links ativos: lista 1–2 com nome + URL. Se não há: sugere criar e não só pede “me fala seu nicho” sem dar direção. |
| “Como organizar minha semana para atrair mais leads?” | Resposta curta (não calendário longo); tem próxima ação em 24h; oferta de link quando fizer sentido. |
| “Me dá o link do último diagnóstico que criei para eu compartilhar.” | Entrega o primeiro link da lista (mais recente), em destaque (nome + URL), sem dizer “não tenho acesso”. |
| “Me dê um plano” / “Quero que você me dê o plano” | Se o perfil tem metas: usa metas do perfil e dá plano personalizado (não genérico). |

Para cada uma, o agente deve marcar:  
- ✅ Resposta alinhada ao perfil (objetivos, segmento, comunicação).  
- ⚠️ Resposta parcialmente alinhada (ex.: usa perfil mas não cita link quando deveria).  
- ❌ Resposta genérica, errada para o perfil ou que ignora objetivos/metas.

### 3.4 Tabela de verificação (perfil + Noel)

O agente pode preencher uma tabela como esta (por perfil testado):

| Perfil testado | Perfil (perguntas) | Perfil persiste? | Noel usa perfil? | Noel usa objetivos? | Links/scripts coerentes? |
|----------------|--------------------|------------------|------------------|----------------------|---------------------------|
| ylada          | ✅/⚠️/❌           | ✅/⚠️/❌         | ✅/⚠️/❌         | ✅/⚠️/❌             | ✅/⚠️/❌                  |
| estética       | …                  | …                | …                | …                    | …                         |

- **Noel usa perfil:** respostas usam tipo de atuação, profissão e contexto (pacientes/clientes/leads, agenda, etc.).  
- **Noel usa objetivos:** quando o perfil tem metas/objetivos, o Noel os reflete em “próximo passo” ou “plano”.  
- **Links/scripts coerentes:** sugestões de link e script batem com o segmento e a profissão.

---

## 4. Resumo para colar no prompt do agente

Trecho que pode ser incluído no prompt do agente de teste interno:

```
PERFIL DO USUÁRIO E NOEL

1) Onde está o perfil
- Onboarding: nome + telefone; depois redireciona para Perfil empresarial se faltar profile_type e profession.
- Perfil empresarial (/pt/perfil-empresarial ou /{area}/perfil-empresarial): primeiro "Como você atua?" (liberal vs vendas), depois profissão/área (ex.: estética, medico, vendedor_suplementos). Em seguida vêm perguntas do fluxo (dor, fase, metas, objetivos, canais, etc.). Tudo salvo em ylada_noel_profile (user_id + segment).
- Diagnóstico profissional: quiz de 4 perguntas; resultado alimenta memória e mapa da trilha usados pelo Noel.

2) O que verificar na área do perfil
- Acesso ao Perfil empresarial; fluxo tipo → profissão → perguntas adicionais; opções coerentes com o segmento.
- Perguntas complementam o profissional (fazem sentido para liberal vs vendas e para a profissão).
- Dados salvam e aparecem corretamente em Configurações/Conta.
- Campos preenchidos são os que o Noel usa (profile_type, profession, metas, objetivos, dor, canais, area_specific).

3) Como se comportar baseado no perfil (teste do Noel)
- Para cada perfil testado, saber o que está cadastrado (tipo, profissão, metas/objetivos).
- Avaliar cada resposta do Noel: faz sentido para esse perfil? (médico → pacientes/agenda; vendedor → leads/funil; estética → clientes/procedimentos.)
- Se o perfil tem metas/objetivos, o Noel deve refletir isso em "próximo passo" e "plano".
- Testar: "Qual meu próximo passo?", "Qual o melhor diagnóstico para conversar?", "Me dá o link do último diagnóstico", "Me dê um plano". Marcar ✅/⚠️/❌ se a resposta está alinhada ao perfil, usa objetivos e oferece links quando aplicável.
- Preencher tabela: Perfil (perguntas), Perfil persiste?, Noel usa perfil?, Noel usa objetivos?, Links/scripts coerentes?.
```

---

## 5. Referências no código

| O quê | Onde |
|-------|------|
| Fluxo de perguntas por tipo/profissão | `config/ylada-profile-flows.ts` |
| Profissões por segmento | `config/ylada-profile-flows.ts` (PROFESSION_BY_SEGMENT) |
| Resumo do perfil para o Noel | `src/lib/ylada-profile-resumo.ts` (buildProfileResumo) |
| Injeção do perfil no Noel | `src/app/api/ylada/noel/route.ts` (profileResumo, [PERFIL DO PROFISSIONAL]) |
| Diagnóstico profissional (quiz 4 perguntas) | `src/config/diagnostico-profissional.ts` |
| Tela de perfil empresarial | `src/components/perfil/PerfilEmpresarialView.tsx` |
| API de leitura/gravação do perfil | `src/app/api/ylada/profile/route.ts` |
| Tabela do perfil | `ylada_noel_profile` (user_id, segment, profile_type, profession, dor_principal, metas_principais, etc.) |
