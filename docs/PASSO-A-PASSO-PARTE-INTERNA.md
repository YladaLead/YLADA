# Passo a passo — Verificação da parte interna (plataforma)

Este guia serve para verificar a **experiência do usuário dentro da plataforma**, após o login: board, perguntas de perfil, Noel, configurações, fluxos, biblioteca, links gerados e aparência. O objetivo é garantir que tudo funciona e que o Noel considera o perfil do profissional como prioridade.

**Como funciona hoje:** A área interna é **única**. A entrada é sempre pela **ylada.com** (ou pelo app único). Não existem mais “área Nutri” e “área Coach” separadas por URL — o projeto mudou: quem define **quem a pessoa é** e **o que ela vê** (nutri, coach, seller, etc.) é o **perfil**. A pessoa entra, faz login, e a partir do **perfil** a plataforma mostra o board, o Noel, os links e os fluxos adequados àquele tipo de profissional.

**Quem verifica:** uma pessoa (ou um agente, onde houver automação) testa cada bloco e marca ✅ / ⚠️ / ❌. Como a área é uma só, a verificação pode ser feita **por perfil** (ex.: testar logando com perfil nutri, depois com perfil coach) para conferir se a experiência muda conforme o perfil.

**Wellness:** a área Wellness ainda é diferente por dentro; fica **de fora** desta verificação. Depois de fechado o padrão da área única (ylada.com + perfil), o Wellness será ajustado para esse padrão.

**Futuro:** pode ser criado um **11º agente** focado em layout/UX (melhorias de aparência e usabilidade). Por enquanto, a verificação de “aparência” e “botões” é manual ou combinada com os outros agentes.

---

## Área definida — Como começar

**URL base:** https://www.ylada.com (ou o app em produção).

**Entrada única:**
- Página inicial (visitante): **ylada.com/pt** → se já estiver logado, redireciona para **/pt/painel**.
- Login (área interna): **ylada.com/pt/login** → perfil **ylada** (matriz) → após login redireciona para **/pt/home**.
- Board/Home interno: **/pt/home** (Noel + área) ou **/pt/painel** (painel). O que a pessoa vê depende do **perfil** (ylada, nutri, coach, etc., conforme cadastro).

**Primeiro perfil para testar:** **ylada** (área única / matriz). Quem faz login em /pt/login com conta da matriz cai em /pt/home e usa o board, Noel, configuração e links dessa área única.

**Testar em localhost:** Use **http://localhost:3000/pt/login** e as credenciais listadas em **docs/TESTE-CREDENCIAIS-LOCALHOST.md** (11 e-mails de teste + senha). Assim você não mexe em produção.

**Rodar o agente (verificação automática):**  
O agente faz login e percorre todos os blocos (Board → Perfil → Noel → Configurações → … → Aparência) e gera a tabela ✅/⚠️/❌. **Pré-requisito:** app rodando e conta de teste criada no mesmo Supabase que o app (`node scripts/criar-contas-teste-interno.js`).
- **Localhost (porta padrão):** `npm run agente:interno`
- **Outra porta:** `URL=http://localhost:3002 npm run agente:interno`
- **Ver o navegador:** `HEADLESS=false npm run agente:interno`
- **Outro e-mail/senha:** `TESTE_EMAIL=seu@email.com TESTE_SENHA=suasenha npm run agente:interno`

**Passos para iniciar a verificação agora:**
1. Abrir **http://localhost:3000/pt/login** (localhost) ou **https://www.ylada.com/pt/login** (produção).
2. Fazer **login** com uma conta de perfil **ylada** (matriz) — por exemplo a primeira conta do arquivo de credenciais de teste.
3. Confirmar que foi para **/pt/home** (ou /pt/painel).
4. Seguir a **Ordem sugerida para testar** abaixo (Board → Perfil → Noel → Configurações → Botões → Fluxos → Biblioteca → Links → Aparência).
5. Marcar na **Tabela resumo** na linha “Perfil testado” (ex.: ylada) com ✅ / ⚠️ / ❌ em cada bloco.

Depois, para conferir a personalização por perfil, repetir com outra conta (perfil nutri ou coach, se existirem no mesmo app) e ver se o conteúdo muda conforme o perfil.

---

## Visão geral do que será verificado

| Bloco | O que verificar |
|-------|------------------|
| 1. Board / Home | Acesso ao board após login; informações corretas; navegação clara. |
| 2. Perguntas de perfil | Perguntas armazenadas; perfil com dados necessários ao Noel (tipo atuação, vendedor/Nutra, especialização, produtos/empresas, metas). |
| 3. Noel | Cada resposta considera o perfil do usuário como prioridade; tom e conteúdo adequados. |
| 4. Configurações | Ajustes fáceis de encontrar e de usar; salvam corretamente. |
| 5. Botões e edições | Todos os botões funcionam; edições não quebram; sem erros ao salvar. |
| 6. Criação de fluxos | Criar novo fluxo funciona; fluxos aparecem e podem ser usados. |
| 7. Biblioteca | Conteúdos (fluxos, materiais, scripts) acessíveis e organizados. |
| 8. Links gerados | Geração de link funciona; link gerado abre e reflete o esperado. |
| 9. Aparência / Layout | Layout claro; textos sem repetição (ex.: "YLADA YLADA"); alinhamento e espaçamento ok; legibilidade; nada quebrado na tela. |

---

## Bloco 1 — Board / Home

**O que é:** Primeira tela que o profissional vê após logar. A entrada é **única** (ylada.com); o que aparece no board/home deve refletir o **perfil** da pessoa (nutri, coach, seller, etc.).

**O que verificar:**
- Ao fazer login (em ylada.com / app único), a pessoa cai no board/home correto (sem erro, sem tela em branco).
- As informações exibidas fazem sentido para o **perfil** dela (resumo, atalhos, mensagens alinhados a quem ela é).
- Menu ou navegação permitem ir para Noel, ferramentas, links, configuração, etc.
- Não há links quebrados nem botões que não respondem.

**Como marcar:** ✅ Tudo certo e coerente com o perfil | ⚠️ Algo confuso ou lento | ❌ Erro ou não carrega.

---

## Bloco 2 — Perguntas de perfil (onboarding / perfil)

**O que é:** Fluxo em que o profissional responde perguntas sobre ele (tipo de atuação, metas, objetivos, “coach de quê”, etc.). Esses dados devem ser **armazenados** e usados depois (ex.: pelo Noel). O perfil precisa ter **as informações necessárias para o Noel conduzir a conversa de forma correta**.

**Informações de perfil que fazem diferença para o Noel (verificar se existem e são usadas):**
- **Tipo de atuação:** vendedor, consultor, coach, nutricionista, etc.
- **Área/segmento:** Nutra (suplementos), Wellness, Nutri, Seller, etc.
- **Especialização:** tipo de produtos (ex.: suplementos, bebidas funcionais, produtos fechados), nicho (emagrecimento, energia, desempenho), ou “coach de quê” (bem-estar, carreira, vida).
- **Tipo de produtos ou empresas:** quando fizer sentido (ex.: marcas com que trabalha, linhas de produto, empresa/redes).
- **Metas e objetivos:** meta financeira, meta de volume, foco (vendas, equipe, ambos), tempo disponível por dia/semana.

Assim o Noel consegue personalizar respostas, scripts e links (ex.: para vendedor Nutra de suplementos vs. coach de bem-estar vs. nutricionista).

**O que verificar:**
- As perguntas aparecem no fluxo de onboarding ou na tela de perfil.
- Existem perguntas (ou campos) que capturem: tipo de atuação, área (vendedor/Nutra/suplementos quando aplicável), especialização, tipo de produtos ou empresas (quando útil).
- Ao responder e salvar, os dados são gravados (não perde ao sair/voltar).
- Onde o perfil é exibido (ex.: configuração, conta), os dados aparecem corretos.
- Se houver “definir do que você é” (ex.: coach de bem-estar, carreira, vendedor Nutra, etc.), as opções estão claras e o valor salvo é o escolhido.

**Como marcar:** ✅ Armazenamento e exibição ok; perfil tem dados necessários para o Noel | ⚠️ Algum campo não salva ou falta informação (vendedor, especialização, produtos) | ❌ Perfil não salva ou não aparece; Noel não tem como personalizar.

---

## Bloco 3 — Noel (respostas e perfil como prioridade)

**O que é:** Assistente/mentor (Noel) que responde perguntas do usuário. As respostas devem **considerar o perfil do usuário como prioridade** (metas, tipo de atuação, vendedor/Nutra/suplementos, especialização, tipo de produtos ou empresas quando existir), para **conduzir a conversa de forma correta** e não genérica.

**O que verificar:**
- Ao abrir o Noel (ex.: “Peça ajuda ao Noel”, chat), a conversa inicia sem erro.
- Ao perguntar algo que depende do perfil (ex.: “qual meu próximo passo?”, “me dê um plano”, “qual link usar para meu cliente?”), a resposta faz sentido para o perfil cadastrado (vendedor de Nutra/suplementos, especialização, tipo de produtos, metas, etc.).
- Respostas não são genéricas; referem-se ao contexto do profissional (ex.: se for vendedor Nutra, fala de suplementos/links Nutra; se tiver especialização, usa isso).
- Links e scripts sugeridos pelo Noel são coerentes com o perfil e, quando há link gerado, ele funciona.
- Não há mensagens de erro recorrentes nem respostas vazias.

**Como marcar:** ✅ Noel responde e usa perfil (incl. vendedor/especialização/produtos quando existir) | ⚠️ Responde mas pouco personalizado | ❌ Erro ou não considera perfil.

---

## Bloco 4 — Configurações

**O que é:** Telas onde o usuário ajusta dados da conta, preferências, notificações e **perfil** (na área única, ex.: configuração, conta/perfil).

**O que verificar:**
- Acesso às configurações é fácil (menu, link visível).
- Campos editáveis permitem alterar e **salvar**; a alteração persiste ao recarregar.
- Não há opções confusas nem botões que não fazem nada.
- Mensagens de sucesso ou erro são claras (ex.: “Salvo com sucesso”).

**Como marcar:** ✅ Fácil e salva certo | ⚠️ Confuso ou algum campo não salva | ❌ Não acessa ou não salva.

---

## Bloco 5 — Botões e edições (sem quebras)

**O que é:** Em todas as telas internas, botões de ação (Salvar, Editar, Criar, Excluir, Voltar, etc.) devem funcionar. Edições não devem quebrar a tela nem perder dados.

**O que verificar:**
- Em cada tela testada: clicar em cada botão relevante e ver se a ação ocorre (ou se aparece mensagem clara de por que não).
- Ao editar um item (ex.: ferramenta, fluxo, link), salvar e ver se volta à lista ou detalhe sem erro e com dados atualizados.
- Nenhum botão fica “travado” sem feedback (loading ou mensagem).
- Não aparecem erros em vermelho ou “something went wrong” sem explicação.

**Como marcar:** ✅ Todos os botões e edições ok | ⚠️ Algum botão falha ou edição estranha | ❌ Vários erros ou telas quebradas.

---

## Bloco 6 — Criação de novos fluxos

**O que é:** Possibilidade de criar um novo fluxo (ex.: fluxo de vendas, de diagnóstico, de follow-up), quando a área oferece isso.

**O que verificar:**
- Existe entrada clara para “criar fluxo” ou “novo fluxo” (menu, botão).
- O formulário ou assistente de criação abre e permite preencher os campos necessários.
- Ao salvar, o fluxo é criado e aparece na lista/biblioteca de fluxos.
- O fluxo criado pode ser usado (ex.: gerar link, aparecer nas opções do Noel).

**Como marcar:** ✅ Criação e uso ok | ⚠️ Cria mas não aparece ou não usa | ❌ Não cria ou dá erro.

---

## Bloco 7 — Biblioteca

**O que é:** Área onde ficam fluxos, materiais, scripts, vídeos, etc. (ex.: biblioteca de fluxos, biblioteca de materiais).

**O que verificar:**
- Acesso à biblioteca (menu ou link) funciona.
- Conteúdos listados carregam (não listas vazias sem motivo).
- Ao clicar em um item, abre ou baixa o esperado (fluxo, PDF, vídeo, etc.).
- Organização (pastas, categorias, busca, se houver) faz sentido e funciona.

**Como marcar:** ✅ Acesso e conteúdos ok | ⚠️ Algo não carrega ou está desorganizado | ❌ Não acessa ou lista quebrada.

---

## Bloco 8 — Links gerados

**O que é:** Funcionalidade de gerar link (para ferramenta, quiz, diagnóstico, etc.) e usar esse link fora da plataforma.

**O que verificar:**
- Em “Links” ou “Gerar link” / “Minhas ferramentas”, o usuário consegue gerar ou copiar um link.
- O link gerado abre em outra aba/navegador e mostra a página correta (ferramenta, quiz, etc.).
- O link é utilizável (pode ser enviado por WhatsApp, por exemplo).
- Se houver “aparência” ou “personalização” do link (ex.: título, descrição), as alterações refletem no que o cliente vê ao abrir.

**Como marcar:** ✅ Gera e abre certo | ⚠️ Gera mas algo não reflete (ex.: aparência) | ❌ Não gera ou link quebrado.

---

## Bloco 9 — Aparência / Layout (visual e usabilidade)

**O que é:** Aspecto visual e clareza da interface: layout, textos (incl. repetições), alinhamento, espaçamento, responsividade.

**O que verificar:**
- **Textos:** sem repetição indevida (ex.: "Bem-vindo à YLADA YLADA"; títulos ou frases com palavra duplicada). Textos legíveis (tamanho, contraste).
- **Layout:** elementos não sobrepostos; menus e botões legíveis; alinhamento e espaçamento consistentes.
- **Responsividade:** em mobile (ou redimensionando a janela), a tela se adapta de forma aceitável.
- Nada essencial escondido ou ilegível; nenhum elemento quebrado na tela.

**Como marcar:** ✅ Layout e textos ok (sem repetição, legível) | ⚠️ Pequenos problemas (alinhamento, texto repetido, contraste) | ❌ Layout quebrado, ilegível ou repetição óbvia (ex.: "YLADA YLADA").

**Nota:** Pode ser criado um **11º agente** focado em layout/UX (contraste, elementos clicáveis, etc.). Enquanto não existir, a verificação inclui layout e texto (incl. repetições) manualmente ou pelo agente que testa a parte interna.

---

## Tabela resumo (preencher por perfil testado)

A área interna é **uma só** (entrada por ylada.com); a experiência muda conforme o **perfil**. Use uma linha por **tipo de perfil** com que você testou (ex.: perfil nutri, perfil coach), para conferir se a plataforma se adapta corretamente a cada um. Wellness fica de fora até alinharmos ao padrão.

**Legenda:** ✅ OK | ⚠️ Atenção | ❌ Erro

| Perfil testado | Board | Perfil (perguntas) | Noel | Configurações | Botões/Edições | Criar fluxos | Biblioteca | Links gerados | Aparência |
|----------------|-------|--------------------|------|---------------|----------------|--------------|-------------|---------------|-----------|
| ylada (matriz) |       |                    |      |               |                |              |             |               |           |
| (ex.: nutri)   |       |                    |      |               |                |              |             |               |           |
| (ex.: coach)   |       |                    |      |               |                |              |             |               |           |

---

## Ordem sugerida para testar

1. Entrar em **ylada.com** (ou no app único) e fazer **login**. A plataforma usa o **perfil** para definir o que você vê (nutri, coach, seller, etc.).
2. **Board** — conferir home e menu; ver se faz sentido para o seu perfil.
3. **Perfil** — abrir configuração/conta e conferir se as perguntas de perfil estão salvas e visíveis; se faltar, passar pelo onboarding. O perfil é o que **define a área** (quem você é na plataforma).
4. **Noel** — abrir o Noel, fazer 2–3 perguntas (uma genérica e uma que dependa do perfil) e ver se as respostas fazem sentido e usam o perfil.
5. **Configurações** — alterar um campo, salvar e recarregar para confirmar.
6. **Botões e edições** — em 2–3 telas (ex.: ferramentas, links), clicar em Salvar/Editar/Criar e ver se tudo responde bem.
7. **Criar fluxo** — se existir, criar um fluxo e ver se aparece e pode ser usado.
8. **Biblioteca** — abrir e conferir listagem e um item.
9. **Links gerados** — gerar ou copiar um link e abrir em outra aba.
10. **Aparência** — passar pelas telas e anotar se algo está quebrado ou ilegível.

Para conferir a personalização por perfil: repita os passos logando com **outro perfil** (ex.: primeiro nutri, depois coach) e verifique se o board, Noel e links mudam conforme o perfil.

---

## Agentes e automação

- **Hoje:** Os agentes 1–3 (simulador, auditor, otimizador) cobrem as **páginas públicas**. A parte interna é em grande parte **verificação manual** com este guia.
- **Futuro:**
  - Um **agente interno** pode ser criado para fazer smoke tests nas rotas protegidas (login → home → Noel → links), desde que haja credenciais de teste.
  - Um **11º agente** focado em **layout/UX** pode checar aparência (contraste, elementos clicáveis, responsividade) em telas críticas.

Quando esses agentes existirem, este documento pode ser atualizado com os comandos e o que cada um cobre.

---

## Ações prioritárias (o que corrigir primeiro)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
