# Cobertura completa — Agente de teste interno

**Objetivo:** Este documento define **tudo** que o agente de teste interno deve cobrir para verificar se a área interna entrega o que prometemos e oferecemos: funcionalidades do Noel, biblioteca, método, experiência do usuário, edição de quizzes, calculadoras, fluxos e aparência.

**Referência:** Agente em `scripts/agents/ylada-interno.ts`. Use este doc para expandir os blocos do agente e para checklists manuais.

---

## 1. O que prometemos e oferecemos (visão geral)

| Promessa / Oferta | Onde verificar | Critério de sucesso |
|-------------------|----------------|---------------------|
| **Entrada única** (ylada.com) com conteúdo por **perfil** (área) | Login → Home | Após login, cai em /pt/home ou /pt/{área}/home; conteúdo reflete a área (estética, nutri, coach, etc.). |
| **Noel** como mentor (próximo passo, scripts, links, estratégia) | Home → Noel | Chat abre; respostas consideram perfil; links/scripts entregues quando pedidos. |
| **Biblioteca** de diagnósticos/fluxos/materiais por segmento | Menu → Biblioteca | Itens listados; filtros (tipo, segmento, situação); criar link funciona. |
| **Método YLADA** (filosofia, estratégia) | Menu → Método YLADA ou /pt/metodo-ylada | Página carrega; conteúdo legível; link no menu quando aplicável. |
| **Diagnósticos/Quizzes** criados pelo profissional | Biblioteca + Quiz personalizado | Criar diagnóstico; editar perguntas (múltipla/dissertativa); ordem; salvar; gerar link. |
| **Calculadoras** (IMC, água, proteína, calorias) | Links/Biblioteca + páginas públicas | Link gera URL; ao abrir: landing → formulário → resultado → CTA WhatsApp. |
| **Fluxos** (criar, listar, usar) | Menu Fluxos / Links | Página de fluxos existe; listagem ou criação possível; fluxos Wellness (vender/recrutar) acessíveis onde aplicável. |
| **Links gerados** utilizáveis | Menu Links / Diagnósticos | Gerar link; copiar; abrir em outra aba mostra página correta (quiz/calculadora). |
| **Perfil** que o Noel usa | Perfil empresarial / Onboarding | Campos de área, atuação, metas; dados persistem; Noel usa no contexto. |
| **Configurações** e segurança | Configurações | Alterar dados e salvar; troca de senha (senha provisória) conforme doc. |
| **Experiência** (onboarding, tom, primeira vez) | Primeiro acesso + Home | Onboarding aparece quando devido; tom acolhedor; sem overload na primeira tela. |
| **Aparência** sem erros de texto/layout | Todas as telas | Sem "YLADA YLADA" repetido; botões e menus legíveis; nada quebrado. |

---

## 2. Noel — Funcionalidades a esticar e cobrir

O Noel é o **mentor** da área interna. O agente deve verificar que as seguintes capacidades estão acessíveis e coerentes.

### 2.1 Acesso e interface

| Item | Verificação |
|------|-------------|
| Campo de chat | Existe `textarea` ou `input[type="text"]` na tela do Noel (home). |
| Envio de mensagem | Botão enviar ou submit do form envia a mensagem. |
| Resposta visível | Resposta do Noel aparece no corpo da página (não apenas loading infinito). |

### 2.2 Perguntas que o Noel deve atender (por perfil)

- **Próximo passo:** "Qual meu próximo passo?" → resposta com ação clara (24h).
- **Criar diagnóstico:** "Quero criar um diagnóstico para minha área. Como faço?" → orientação + onde criar (biblioteca/quiz personalizado).
- **Estratégia:** "Me sugira uma estratégia para captar mais clientes." → estratégia alinhada à área.
- **Link para post/Instagram:** "Pode gerar um link para eu usar no post ou no Instagram?" → link completo + script (não apenas "quer que eu te envie?").
- **Fluxo do zero:** "Como criar um fluxo de diagnóstico do zero?" → passos ou indicação da página de fluxos/biblioteca.
- **Melhor diagnóstico:** "Qual o melhor diagnóstico para começar a conversar com cliente?" → sugestão + link quando aplicável.
- **Script WhatsApp:** "Preciso de um script para enviar no WhatsApp. Pode me dar um?" → script completo entregue.
- **Organizar semana:** "Como organizar minha semana para atrair mais leads?" → orientação prática.
- **Por área:** "Sou da área de estética. O que você me recomenda para começar?" → conteúdo específico de estética (pele, autocuidado, captação).
- **Link último diagnóstico:** "Me dá o link do último diagnóstico que criei para eu compartilhar." → link ou orientação (ex.: página Links).

### 2.3 Funções do Noel que precisam estar “vivas”

- **Links:** `recomendarLinkWellness`, `getLinkInfo`, `getFerramentaInfo` → ao pedir link/script, o Noel entrega link completo e script (nunca só "faça login" ou "copie da plataforma").
- **Ferramentas específicas:** "Calculadora de IMC", "calculadora de água", "calculadora de proteína" → `getFerramentaInfo` retorna link personalizado + script.
- **Fluxos:** "Fluxo de pós-venda", "reativação" → conteúdo do fluxo apresentado (sem links genéricos quebrados tipo `system/vender/fluxos`).
- **Cálculo de objetivos:** "Quantos produtos preciso vender para bater minha meta?" → `calcularObjetivosCompletos()`; resposta com números e próximo passo (usa perfil quando existir).
- **Materiais:** "Você tem material de divulgação?" → busca na biblioteca; link entregue.
- **Troca de senha provisória:** "Como altero minha senha provisória?" → resposta com passos (Configurações → Segurança → Atualizar Senha).

### 2.4 Tom e humor (experiência)

- Respostas **curtas, claras e acionáveis** (não prolixas).
- **Reconhecimento** do que o usuário disse antes de dar direção.
- **Próximo passo** claro (ação em 24h quando fizer sentido).
- Sem falar de "ferramenta", "método", "sistema" de forma institucional; foco em **ações, conversas, números**.
- Em dúvida vaga: Noel pode fazer 1–2 perguntas curtas antes de responder (clarificação).

---

## 3. Biblioteca

| Item | O que verificar |
|------|------------------|
| Acesso | Menu "Biblioteca" leva à página da biblioteca (/pt/biblioteca ou /pt/{área}/biblioteca). |
| Conteúdo por área | Itens listados fazem sentido para o perfil (ex.: estética vê diagnósticos/estética). |
| Tipos | Filtro ou listagem por tipo: quiz, fluxo, ferramenta (calculadora), material. |
| Segmento / situação | Filtros de segmento e "situação" (quando usar) funcionam ou estão visíveis. |
| Criar diagnóstico/link | Botão ou fluxo "Criar diagnóstico agora" (ou equivalente); gera link e aparece em "Meus links" ou Links. |
| Contador "links criados hoje" | Se existir, exibe número coerente. |
| Clique em item | Abre detalhe, download ou geração de link conforme tipo. |

---

## 4. Método YLADA

| Item | O que verificar |
|------|------------------|
| Link no menu | Onde houver menu "Método YLADA" ou "Método", o link leva a /pt/metodo-ylada (ou equivalente). |
| Página método | Carrega sem erro; título e textos sem repetição ("YLADA YLADA"); filosofia/estratégia legível. |
| Área Nutri (método próprio) | Se teste for com perfil nutri: /pt/nutri/metodo, jornada, pilares, exercícios, biblioteca de PDFs — links e páginas acessíveis. |

---

## 5. Experiência do usuário (onboarding e primeira vez)

| Item | O que verificar |
|------|------------------|
| Primeiro acesso | Se perfil incompleto ou sem diagnóstico estratégico, redireciona para onboarding (ex.: /pt/onboarding) em vez de jogar direto na home cheia. |
| Onboarding | Formulário (nome, telefone, etc.) visível; botão "Continuar" / "Gerar meu Diagnóstico" existe e avança. |
| Após onboarding | Redireciona para /pt/home ou painel; não fica em loop. |
| Tom da primeira tela | Mensagem de boas-vindas; não overload de blocos na primeira vista (quando houver controle de "dia 1"). |
| Humor geral | Textos acolhedores, claros; sem erros de interface ("something went wrong" sem explicação). |

---

## 6. Edição de quizzes (quiz personalizado)

| Item | O que verificar |
|------|------------------|
| Acesso | Existe rota para criar/editar quiz (ex.: /pt/wellness/quiz-personalizado, /pt/nutri/quiz-personalizado, /pt/estetica/... conforme área). |
| Criar novo quiz | Botão ou fluxo "Novo diagnóstico" / "Criar quiz"; abre editor. |
| Tipo de pergunta | Adicionar pergunta **múltipla escolha** (opções editáveis) e **dissertativa** (texto livre). |
| Editar pergunta | Alterar título, opções (múltipla), obrigatória; salvar. |
| Ordem | Reordenar perguntas (arrastar ou setas); ordem persiste. |
| Remover pergunta | Remover pergunta e salvar. |
| Salvar quiz | Botão Salvar/Atualizar; dados persistem ao recarregar. |
| Gerar link | Após salvar, opção de gerar/copiar link; link abre a página pública do quiz (preenchível por terceiros). |
| Limite | Até 20 perguntas (API retorna erro acima disso). |

---

## 7. Calculadoras (como funcionário / experiência completa)

Cada calculadora deve ser verificada como **fluxo completo**: link gerado → página pública → formulário → resultado → CTA.

| Calculadora | Slug(s) típicos | O que verificar |
|-------------|------------------|------------------|
| **IMC** | imc, calculadora-imc, calc-imc | Landing → formulário (peso, altura, sexo, atividade) → resultado (categoria IMC) → botão/CTA WhatsApp com mensagem correta. |
| **Água / Hidratação** | agua, calculadora-agua, calc-hidratacao | Landing → formulário (peso, atividade, clima) → resultado (litros/dia) → CTA WhatsApp. |
| **Proteína** | proteina, calculadora-proteina | Landing → formulário (peso, atividade, objetivo) → resultado (gramas/dia) → CTA WhatsApp. |
| **Calorias** | calorias, calculadora-calorias | Landing → formulário (peso, altura, idade, sexo, atividade, objetivo) → resultado → CTA WhatsApp. |

| Item geral | Verificação |
|------------|-------------|
| Link na área interna | Noel ou Biblioteca/Links oferece link da calculadora; link é personalizado (com user slug quando aplicável). |
| Página pública abre | Link abre em nova aba; não 404. |
| Fórmula | Cálculo exibido é coerente (ex.: IMC = peso/(altura/100)²). |
| Mensagem WhatsApp | Botão CTA usa mensagem padrão da ferramenta (ex.: "Acabei de calcular meu IMC..."). |

---

## 8. Fluxos

| Item | O que verificar |
|------|------------------|
| Página de fluxos | Rota /pt/fluxos ou /pt/{área}/fluxos (ou equivalente) existe e carrega. |
| Conteúdo | Lista de fluxos ou mensagem clara ("criar fluxo", "novo fluxo"); não tela vazia sem explicação. |
| Wellness (se aplicável) | /pt/wellness/system/vender/fluxos e /pt/wellness/system/recrutar/fluxos listam fluxos; clicar leva ao detalhe. |
| Noel e fluxos | Ao pedir "fluxo de pós-venda" ou "reativação", Noel apresenta conteúdo (passos, scripts) sem mencionar URL quebrada. |

---

## 9. Links gerados

| Item | O que verificar |
|------|------------------|
| Página Links/Diagnósticos | Menu "Links" ou "Diagnósticos" abre página que lista ou gera links. |
| Gerar link | Ação de gerar novo link (quiz, calculadora, fluxo) funciona. |
| Copiar link | Botão copiar cola no clipboard URL utilizável. |
| Abrir link | Link abre em nova aba e mostra a página correta (quiz, calculadora, etc.). |
| Utilização | Link pode ser colado e enviado (ex.: WhatsApp); terceiro acessa sem precisar estar logado. |

---

## 10. Perfil e configurações

| Item | O que verificar |
|------|------------------|
| Perfil (perguntas de perfil) | Página de perfil empresarial ou onboarding com campos: área, tipo de atuação, especialização, metas, etc. |
| Persistência | Salvar e recarregar; dados permanecem. |
| Uso pelo Noel | Respostas do Noel consideram área/metas (ex.: estética → linguagem de pele/captação). |
| Configurações | Página de configurações acessível (menu); alterar nome/telefone/email e salvar. |
| Senha | Seção Segurança: alterar senha (atual, nova, confirmar); após atualizar, redireciona para login; orientação de senha provisória coerente com doc. |

---

## 11. Aparência e layout

| Item | O que verificar |
|------|------------------|
| Repetição "YLADA YLADA" | Nenhum título ou texto com "YLADA YLADA" duplicado. |
| Menus e botões | Visíveis e clicáveis; não sobrepostos. |
| Legibilidade | Tamanho de fonte e contraste adequados. |
| Erros de tela | Nenhum "something went wrong" ou mensagem de erro em vermelho sem contexto. |

---

## 12. Áreas (rotas e conteúdo por perfil)

O agente pode rodar com contas de diferentes áreas para garantir personalização.

| Área (código) | Path prefix | Conta teste (ex.) | O que deve refletir |
|---------------|-------------|-------------------|---------------------|
| ylada (matriz) | /pt | teste-interno-01@teste.ylada.com | Board, Noel e links genéricos matriz. |
| estetica | /pt/estetica | teste-interno-11@teste.ylada.com | Conteúdo estética (pele, autocuidado, diagnósticos estética). |
| nutri | /pt/nutri | teste-interno-03@teste.ylada.com | Método Nutri, LYA, jornada, quiz personalizado nutri. |
| coach | /pt/coach | teste-interno-04@teste.ylada.com | Conteúdo coach. |
| perfumaria | /pt/perfumaria | teste-interno-12@teste.ylada.com | Conteúdo perfumaria. |
| med, psi, odonto, fitness, seller, nutra | /pt/{área} | Ver docs/TESTE-CREDENCIAIS-LOCALHOST.md | Menu e conteúdo da área. |

Para cada área: login → home deve carregar; menu deve ter itens corretos (Noel, Biblioteca, Links, Configurações, etc.); Noel deve responder no contexto da área.

---

## 13. Tabela resumo para o agente (blocos expandidos)

Sugestão de blocos que o agente pode reportar (✅ / ⚠️ / ❌):

| # | Bloco | O que cobre |
|---|--------|-------------|
| 0 | Onboarding | Redirecionamento; formulário; botão continuar; redirecionamento pós-onboarding. |
| 1 | Board/Home | Página carrega; menu e conteúdo; coerência com perfil. |
| 2 | Perfil | Página perfil; dados visíveis e persistência. |
| 3 | Noel | Campo de chat; envio; 3+ perguntas variadas; respostas com link/script quando pedido; sem "campo não encontrado". |
| 4 | Configurações | Página carrega; opção de salvar. |
| 5 | Botões/Edições | Botões presentes; sem travamento. |
| 6 | Fluxos | Página fluxos existe e tem conteúdo (ou mensagem clara). |
| 7 | Biblioteca | Biblioteca carrega; listagem/filtros; criar link. |
| 8 | Links gerados | Página links; gerar/copiar; link abre corretamente. |
| 9 | Aparência | Sem "YLADA YLADA"; layout ok. |
| 10 | Quiz personalizado (opcional) | Acesso à página; adicionar/editar pergunta múltipla e dissertativa; salvar. |
| 11 | Calculadora (opcional) | Um link de calculadora (ex.: IMC) abre; formulário → resultado → CTA. |

---

## 14. Como usar este documento

1. **Agente automático:** O agente `scripts/agents/ylada-interno.ts` cobre os blocos **0–11** e **1b (Método YLADA)**: onboarding, board, método, perfil, Noel, configurações, botões, fluxos, biblioteca, links, aparência, quiz/criar link, calculadora (link público). Relatório em **docs/RELATORIO-ULTIMO-TESTE-INTERNO.md**.
2. **Checklist manual:** Usar as seções 1–12 como lista de verificação em testes manuais por área.
3. **Relatório:** Manter tabela resumo (como em CHECKLIST-TESTE-INTERNO-ESTETICA) com os blocos acima; documentar falhas com número do bloco e item deste doc.

Referências: `docs/PASSO-A-PASSO-PARTE-INTERNA.md`, `docs/CHECKLIST-TESTE-INTERNO-ESTETICA.md`, `docs/STATUS-AGENTES-E-TESTES.md`, `docs/O-QUE-E-A-AREA-YLADA.md`.
