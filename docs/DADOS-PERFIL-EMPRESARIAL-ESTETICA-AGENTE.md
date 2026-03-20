# Perfil padrão (estética) — Dados e passo a passo para o agente

Este documento define **um perfil empresarial completo e padrão** para o segmento **estética**, baseado no cenário mais comum (esteticista autônoma, facial, querendo preencher agenda e divulgar). O agente deve usar estes dados para **configurar qualquer conta de teste estética** dessa forma e ter um perfil 100% preenchido para o Noel funcionar (gerar link, recomendações personalizadas).

**Conta de teste sugerida:** `teste-interno-11@teste.ylada.com` (perfil estética).  
**Telefone padrão (credenciais):** `5519997230912` (ver `docs/TESTE-CREDENCIAIS-LOCALHOST.md`).

---

## Perfil padrão preenchido (resumo único)

Um único perfil “mais comum” — todos os campos com valor definido. O agente deve preencher **exatamente** assim.

| Campo | Valor |
|-------|--------|
| **Onboarding (se aparecer)** | |
| nome | Teste Interno 11 |
| whatsapp / telefone | 5519997230912 |
| **Tela inicial Perfil empresarial** | |
| profile_type | liberal |
| profession | estetica |
| **Etapa 1 — Contexto** | |
| area_estetica | facial |
| estetica_tipo_atuacao | autonoma |
| tempo_atuacao_anos | 3 |
| **Etapa 2 — Especialidade** | |
| sub_category | Limpeza de pele e facial |
| **Etapa 3 — Diagnóstico** | |
| dor_principal | agenda_vazia |
| prioridade_atual | Preencher agenda e divulgar mais no Instagram |
| fase_negocio | em_crescimento |
| **Etapa 4 — Metas e modelo** | |
| metas_principais | Aumentar número de clientes e ter agenda estável |
| objetivos_curto_prazo | Criar diagnóstico para captar leads e postar 3x por semana |
| capacidade_semana | 15 |
| ticket_medio | 180 |
| modelo_pagamento | avulso |
| **Etapa 5 — Canais e rotina** | |
| canais_principais | instagram, whatsapp, indicacao |
| rotina_atual_resumo | Atendo 3 a 4 dias por semana; quero divulgar mais e usar diagnóstico para qualificar leads. |
| **Etapa 6 — Observações** | |
| observacoes | Conta de teste para validação do perfil estética. |

---

## Passo a passo completo para o agente configurar

O agente deve executar na ordem abaixo. Em cada passo: preencher o valor indicado e, quando houver botão “Avançar” ou “Continuar”, clicar antes de seguir.

1. **Login**  
   - URL: `/pt/login`.  
   - E-mail: `teste-interno-11@teste.ylada.com` (ou a conta estética que estiver testando).  
   - Senha: `TesteYlada2025!`.

2. **Onboarding (somente se a URL for /pt/onboarding)**  
   - Campo nome: `Teste Interno 11`.  
   - Campo telefone/WhatsApp: `5519997230912`.  
   - Clicar no botão “Continuar” ou “Gerar meu Diagnóstico” (ou equivalente).  
   - Aguardar redirecionamento para /pt/home ou /pt/painel.

3. **Abrir Perfil empresarial**  
   - Clicar em “Perfil” no menu (sidebar) ou acessar `/pt/perfil-empresarial`.

4. **Tela inicial (tipo e profissão)**  
   - No select “Tipo de atuação” (ou “Você atua como”): escolher **“Atendo clientes diretamente (consultório, clínica, atendimento individual)”** (value `liberal`).  
   - No select “Sua atuação na área” / “Qual é o seu principal tipo de atendimento?”: escolher **“Estética”** (value `estetica`).  
   - Clicar **Avançar** ou **Continuar**.

5. **Etapa 1 — Contexto**  
   - “Qual é o seu principal tipo de atendimento na estética?”: **Estética facial** (`facial`).  
   - “Como você trabalha hoje?”: **Autônoma** (`autonoma`).  
   - “Há quanto tempo você trabalha com estética?”: **3** (número).  
   - Clicar **Avançar**.

6. **Etapa 2 — Sua área na estética**  
   - “Subárea ou nicho (opcional)”: **Limpeza de pele e facial**.  
   - Clicar **Avançar**.

7. **Etapa 3 — Diagnóstico**  
   - “O que mais está travando agora?”: **Agenda vazia** (`agenda_vazia`).  
   - “O que você quer destravar primeiro?”: **Preencher agenda e divulgar mais no Instagram**.  
   - “Fase do seu negócio”: **Em crescimento** (`em_crescimento`).  
   - Clicar **Avançar**.

8. **Etapa 4 — Metas e modelo**  
   - “Metas principais”: **Aumentar número de clientes e ter agenda estável**.  
   - “Objetivos curto e médio prazo”: **Criar diagnóstico para captar leads e postar 3x por semana**.  
   - “Quantos atendimentos por semana?”: **15**.  
   - “Ticket médio (R$)”: **180**.  
   - “Forma de pagamento” / “Modelo de pagamento”: **Avulso** (`avulso`).  
   - Clicar **Avançar**.

9. **Etapa 5 — Canais e rotina**  
   - “Onde seus clientes te encontram?” (multiselect): marcar **Instagram**, **WhatsApp**, **Indicação**.  
   - “Como está sua rotina hoje?”: **Atendo 3 a 4 dias por semana; quero divulgar mais e usar diagnóstico para qualificar leads.**  
   - Clicar **Avançar**.

10. **Etapa 6 — Observações**  
    - “Algo mais que o Noel deve saber?”: **Conta de teste para validação do perfil estética.** (ou deixar em branco).  
    - Clicar **Salvar** / **Concluir** / **Finalizar**.

11. **Verificação**  
    - Ir em **Noel** (sidebar).  
    - Enviar: **“Pode gerar um link para eu usar no post ou no Instagram?”**  
    - Resultado esperado: Noel gera um link (perfil completo). Se pedir para completar perfil, conferir se nome e WhatsApp estão preenchidos (onboarding ou área do perfil).

**Nome e WhatsApp:** Se o sistema ainda considerar perfil incompleto, garantir que em algum momento (onboarding ou perfil) tenham sido preenchidos **nome** = `Teste Interno 11` e **whatsapp** = `5519997230912`.

---

## Pré-requisito: Onboarding (se a conta cair em /pt/onboarding)

Se após o login a tela for **onboarding** (nome + telefone):

| Campo        | Valor para o agente |
|-------------|----------------------|
| Nome completo | `Teste Interno 11` |
| Telefone / WhatsApp | `5519997230912` |

Depois clicar em **Continuar** / **Gerar meu Diagnóstico** (ou equivalente) para ir para a área interna.

---

## Tela inicial do Perfil empresarial (escolha de tipo e profissão)

Antes das etapas do wizard, o formulário pede:

| Campo         | Valor (value) | Label visível |
|--------------|----------------|----------------|
| Tipo de atuação | `liberal` | Atendo clientes diretamente (consultório, clínica, atendimento individual) |
| Sua atuação na área | `estetica` | Estética |

**Ação:** Selecionar **liberal** e em seguida **Estética**, depois avançar.

---

## Etapa 1 — Contexto (perfil profissional)

| Campo (key) | Valor para o agente | Opções válidas (value) |
|-------------|---------------------|------------------------|
| **area_estetica** (Qual é o seu principal tipo de atendimento na estética?) | `facial` | facial, corporal, depilacao_laser, harmonizacao, capilar, integrativa, outro |
| **estetica_tipo_atuacao** (Como você trabalha hoje?) | `autonoma` | autonoma, clinica_propria, dentro_salao, equipe_colaboradora |
| **tempo_atuacao_anos** (Há quanto tempo você trabalha com estética?) | `3` | número (ex.: 1, 2, 3, 5) |

---

## Etapa 2 — Sua área na estética (especialidade)

| Campo (key) | Valor para o agente |
|-------------|---------------------|
| **sub_category** (Subárea ou nicho – opcional) | `Limpeza de pele e facial` |

Texto livre; pode ser curto (ex.: “Limpeza de pele”, “Facial e corporal”).

---

## Etapa 3 — Diagnóstico

| Campo (key) | Valor para o agente | Opções válidas (liberal) |
|-------------|---------------------|---------------------------|
| **dor_principal** (O que mais está travando agora?) | `agenda_vazia` | agenda_vazia, agenda_instavel, sem_indicacao, nao_converte, nao_postar, followup_fraco, autoridade, retorno, precificacao, organizacao, outra |
| **prioridade_atual** (O que você quer destravar primeiro?) | `Preencher agenda e divulgar mais no Instagram` | texto livre |
| **fase_negocio** (Fase do seu negócio) | `em_crescimento` | iniciante, em_crescimento, estabilizado, escalando |

---

## Etapa 4 — Metas e modelo

| Campo (key) | Valor para o agente | Opções / formato |
|-------------|---------------------|-------------------|
| **metas_principais** | `Aumentar número de clientes e ter agenda estável` | texto livre |
| **objetivos_curto_prazo** | `Criar diagnóstico para captar leads e postar 3x por semana` | texto livre |
| **capacidade_semana** (Quantos atendimentos por semana?) | `15` | número |
| **ticket_medio** (Ticket médio R$) | `180` | número |
| **modelo_pagamento** | `avulso` | particular, convenio, plano, recorrencia, avulso, comissao, outro |

---

## Etapa 5 — Canais e rotina

| Campo (key) | Valor para o agente | Opções (multiselect) |
|-------------|---------------------|-----------------------|
| **canais_principais** (Onde seus clientes te encontram?) | `['instagram','whatsapp','indicacao']` | instagram, whatsapp, indicacao, trafego_pago |
| **rotina_atual_resumo** (Como está sua rotina hoje?) | `Atendo 3 a 4 dias por semana; quero divulgar mais e usar diagnóstico para qualificar leads.` | texto livre (textarea) |
| **frequencia_postagem** (se existir) | `1 a 2 vezes por semana` | texto livre |

---

## Etapa 6 — Observações

| Campo (key) | Valor para o agente |
|-------------|---------------------|
| **observacoes** (Algo mais que o Noel deve saber?) | `Conta de teste para validação do perfil estética.` |

Pode ficar em branco ou com texto curto.

---

## Nome e WhatsApp no perfil (obrigatório para “perfil completo”)

Para o sistema considerar o **perfil empresarial completo** (e liberar o Noel com qualidade e geração de link), é necessário ter **nome** e **WhatsApp** em `area_specific` do perfil. Isso pode vir:

- do **onboarding** (se a conta passou por /pt/onboarding e preencheu nome + telefone), ou  
- do próprio **Perfil empresarial**, se a tela tiver campos de nome/telefone (dependendo da implementação).

**Valores que o agente deve garantir (se houver campo na tela ou na API):**

| Campo (em area_specific ou formulário) | Valor |
|----------------------------------------|--------|
| **nome** | `Teste Interno 11` |
| **whatsapp** | `5519997230912` |

Se a interface do Perfil empresarial não tiver nome/telefone, garantir que o onboarding já foi preenchido com esses valores antes de rodar o teste do perfil.

---

## Resumo em uma tabela (valores únicos por campo)

| Campo | Valor |
|-------|--------|
| profile_type | liberal |
| profession | estetica |
| area_estetica | facial |
| estetica_tipo_atuacao | autonoma |
| tempo_atuacao_anos | 3 |
| sub_category | Limpeza de pele e facial |
| dor_principal | agenda_vazia |
| prioridade_atual | Preencher agenda e divulgar mais no Instagram |
| fase_negocio | em_crescimento |
| metas_principais | Aumentar número de clientes e ter agenda estável |
| objetivos_curto_prazo | Criar diagnóstico para captar leads e postar 3x por semana |
| capacidade_semana | 15 |
| ticket_medio | 180 |
| modelo_pagamento | avulso |
| canais_principais | instagram, whatsapp, indicacao |
| rotina_atual_resumo | Atendo 3 a 4 dias por semana; quero divulgar mais e usar diagnóstico para qualificar leads. |
| observacoes | Conta de teste para validação do perfil estética. |
| nome (area_specific) | Teste Interno 11 |
| whatsapp (area_specific) | 5519997230912 |

---

## Ordem de preenchimento pelo agente

1. **Login** com `teste-interno-11@teste.ylada.com` e senha `TesteYlada2025!`.
2. Se redirecionar para **/pt/onboarding**: preencher **Nome** = `Teste Interno 11`, **Telefone** = `5519997230912` e avançar.
3. Ir em **Perfil** (sidebar) → **Perfil empresarial** (ou acessar `/pt/perfil-empresarial`).
4. **Tela inicial:** selecionar tipo **liberal** e profissão **Estética**; avançar.
5. **Etapa 1 (Contexto):** area_estetica = `facial`, estetica_tipo_atuacao = `autonoma`, tempo_atuacao_anos = `3`; avançar.
6. **Etapa 2 (Sua área na estética):** sub_category = `Limpeza de pele e facial`; avançar.
7. **Etapa 3 (Diagnóstico):** dor_principal = `agenda_vazia`, prioridade_atual e fase_negocio conforme tabela; avançar.
8. **Etapa 4 (Metas e modelo):** preencher metas_principais, objetivos_curto_prazo, capacidade_semana, ticket_medio, modelo_pagamento; avançar.
9. **Etapa 5 (Canais e rotina):** canais_principais (múltipla escolha), rotina_atual_resumo; avançar.
10. **Etapa 6 (Observações):** observacoes (opcional); **Salvar** / concluir.
11. **Verificar:** recarregar a página ou abrir Noel e pedir “Gere um link para eu usar no post” — o Noel deve conseguir gerar o link (perfil completo).

Use a seção **“Passo a passo completo para o agente configurar”** (início do doc) como roteiro; a tabela **“Perfil padrão preenchido (resumo único)”** é a fonte única de valores.
