# Processo exato do Perfil empresarial para o agente

Este documento descreve **passo a passo** o fluxo da página **Perfil empresarial** (`/pt/perfil-empresarial`) para o agente conseguir **vivenciar todo o preenchimento** e deixar o perfil completo. Use junto com **`docs/DADOS-PERFIL-EMPRESARIAL-ESTETICA-AGENTE.md`** para os valores a preencher.

**Teste interno (agente automatizado):** as contas usadas pelo agente têm **perfil já pré-preenchido** pelo script `scripts/criar-contas-teste-interno.js` (incluindo tipo, profissão, modalidade e canais em `ylada_noel_profile`). No teste interno o agente **apenas valida** que a página de perfil carrega com tipo e profissão presentes; o preenchimento passo a passo (Fluxo A/B deste doc) fica para outro momento.

---

## Visão geral do fluxo

A página pode aparecer de duas formas:

1. **Onboarding (3 passos)** — quando o usuário ainda não tem tipo/profissão: tela “Começar as perguntas” → Passo 1 (tipo + profissão) → Passo 2 (modalidade) → Passo 3 (canais) → “Entrar na plataforma”. Esse fluxo **salva** tipo, profissão, modalidade e canais; para ter **todos** os campos (ex.: área estética, dor, metas), o agente deve depois **voltar** em Perfil e preencher o wizard (ver abaixo).

2. **Formulário direto (wizard)** — quando já existe tipo/profissão ou ao clicar “Continuar e definir minha área”: tela com dois selects (tipo + profissão) → “Continuar e definir minha área” → para **estética** pode aparecer “Noel está analisando” e depois “Ver estratégias para meu perfil” → em seguida as **etapas do wizard** (Contexto, Especialidade, Diagnóstico, Metas, Canais, Observações) com botão “Avançar” ou “Salvar perfil”.

O agente deve **sempre** chegar ao fim do wizard e clicar em **Salvar perfil** para o perfil ficar 100% completo.

---

## URL e espera inicial

- **URL:** `{BASE_URL}/pt/perfil-empresarial`
- **Após navegar:** esperar a página estabilizar: `waitForSelector('select, button, form', { timeout: 12000 })`. Opcional: esperar texto visível “perfil” ou “Configure seu perfil” ou “Começar as perguntas”.

---

## Fluxo A — Quando aparece “Começar as perguntas” (onboarding)

1. **Clicar no botão que inicia**
   - Texto do botão: **"Começar as perguntas →"** (ou “Começar as perguntas”).
   - Seletor sugerido: `button` cujo `innerText`/`textContent` contém “Começar as perguntas”.
   - Após clicar: `await new Promise(r => setTimeout(r, 2000))`.

2. **Passo 1 — Tipo e profissão**
   - Esperar **dois** `<select>` na página.
   - **Primeiro select (Você atua como):** escolher a opção com `value="liberal"` (label: “Atendo clientes diretamente...”).
   - **Segundo select (Sua atuação / profissão):** escolher a opção com `value="estetica"` (label: “Estética”). O segundo select pode estar desabilitado até o primeiro ter valor; após selecionar o primeiro, esperar ~500 ms e então selecionar o segundo.
   - **Botão:** clicar no botão cujo texto é **"Continuar →"** (ou “Salvando...” não clicar).
   - Após clicar: esperar 2–3 s (salvamento).

3. **Passo 2 — Modalidade**
   - Esperar **radio** com `name="modalidade"`.
   - Selecionar o radio com **`value="ambos"`** (label: “Presencial e online”).
   - Clicar no botão **"Continuar →"**.
   - Esperar 2–3 s.

4. **Passo 3 — Canais**
   - Esperar **checkboxes** (pelo menos um com value `instagram`, `whatsapp` ou `indicacao`).
   - Marcar os checkboxes: **Instagram**, **WhatsApp**, **Indicação** (valores: `instagram`, `whatsapp`, `indicacao`). Cuidado: o canal “Outros” tem value `outros`.
   - Clicar no botão **"Continuar →"**.
   - Esperar 2–3 s.

5. **Passo 4 — Sucesso**
   - Deve aparecer o botão **"Entrar na plataforma"**. Clicar nele (vai para `/pt/home`).
   - **Para perfil completo:** em seguida o agente deve **ir de novo** em Perfil empresarial (`/pt/perfil-empresarial`) e seguir o **Fluxo B** (wizard) para preencher área estética, dor, metas, etc., e no fim clicar em **Salvar perfil**.

---

## Fluxo B — Formulário com “Continuar e definir minha área” (wizard)

Quando a tela já mostra os dois selects (tipo e profissão) e o botão **“Continuar e definir minha área →”**:

1. **Selecionar tipo e profissão**
   - **Primeiro select:** `value="liberal"`.
   - **Segundo select:** `value="estetica"`.
   - Clicar no botão cujo texto contém **"Continuar e definir minha área"** (ou “Continuar e definir”).
   - Esperar 2–3 s. Pode aparecer “Noel está analisando” (esperar até sumir ou aparecer o próximo passo).

2. **Se aparecer “Perfil estratégico identificado”**
   - Clicar no botão **"Ver estratégias para meu perfil →"**.
   - Esperar o formulário da primeira etapa do wizard (ex.: “Qual é o seu principal tipo de atendimento na estética?”).

3. **Wizard — Etapa a etapa (estética)**

   Para cada etapa, **preencher os campos** conforme `DADOS-PERFIL-EMPRESARIAL-ESTETICA-AGENTE.md` e depois clicar no botão de avançar.

   - **Etapa 1 (Contexto):**  
     - Select “principal tipo de atendimento na estética”: `value="facial"`.  
     - Select “Como você trabalha hoje?”: `value="autonoma"`.  
     - Input numérico “Há quanto tempo...”: `3`.  
     - Botão: **"Avançar"** ou **"Continuar para estratégias da minha área"**.

   - **Etapa 2 (Sua área na estética):**  
     - Input texto “Subárea ou nicho”: `Limpeza de pele e facial`.  
     - Botão: **"Avançar"**.

   - **Etapa 3 (Diagnóstico):**  
     - Select “O que mais está travando?”: `value="agenda_vazia"`.  
     - Input texto “O que você quer destravar?”: `Preencher agenda e divulgar mais no Instagram`.  
     - Select “Fase do seu negócio”: `value="em_crescimento"`.  
     - Botão: **"Avançar"**.

   - **Etapa 4 (Metas e modelo):**  
     - Texto metas principais, objetivos, capacidade_semana `15`, ticket_medio `180`, modelo_pagamento `avulso`.  
     - Botão: **"Avançar"**.

   - **Etapa 5 (Canais e rotina):**  
     - Multiselect canais: marcar instagram, whatsapp, indicacao.  
     - Textarea rotina: `Atendo 3 a 4 dias por semana; quero divulgar mais e usar diagnóstico para qualificar leads.`  
     - Botão: **"Avançar"**.

   - **Etapa 6 (Observações):**  
     - Textarea (opcional): `Conta de teste para validação do perfil estética.`  
     - Botão: **"Salvar perfil"** (última etapa).

4. **Após Salvar perfil**
   - Esperar mensagem de sucesso ou redirecionamento. Opcional: ir em Noel e enviar “Pode gerar um link para eu usar no post?” para validar perfil completo.

---

## Seletores estáveis (data-testid)

A página de perfil empresarial expõe os seguintes `data-testid` para o agente usar:

| data-testid | Onde aparece | Uso |
|-------------|--------------|-----|
| `perfil-comecar-perguntas` | Botão "Começar as perguntas →" | Início do onboarding |
| `perfil-select-tipo` | Select "Você atua como" | Escolher `liberal` |
| `perfil-select-profissao` | Select profissão/atuação | Escolher `estetica` |
| `perfil-continuar` | Botão "Continuar →" (passos 1, 2 e 3) | Avançar no onboarding |
| `perfil-modalidade-ambos` | Radio "Presencial e online" | Passo 2 |
| `perfil-canal-instagram`, `perfil-canal-whatsapp`, `perfil-canal-indicacao` | Checkboxes canais | Passo 3 |
| `perfil-entrar-plataforma` | Botão "Entrar na plataforma" | Fim do onboarding |
| `perfil-continuar-definir-area` | Botão "Continuar e definir minha área →" | Início do wizard |
| `perfil-avancar` | Botão "Avançar" (wizard) | Próxima etapa do wizard |
| `perfil-salvar` | Botão "Salvar perfil" | Última etapa / salvar |

**Exemplos (Puppeteer):**
- `await page.click('[data-testid="perfil-comecar-perguntas"]')`
- `await page.select('[data-testid="perfil-select-tipo"]', 'liberal')`
- `await page.select('[data-testid="perfil-select-profissao"]', 'estetica')`
- `await page.click('[data-testid="perfil-modalidade-ambos"]')`
- `await page.click('[data-testid="perfil-canal-instagram"]')` (e depois whatsapp, indicacao)
- `await page.click('[data-testid="perfil-continuar"]')` (repetir após cada passo até o 3)
- `await page.click('[data-testid="perfil-continuar-definir-area"]')`
- `await page.click('[data-testid="perfil-avancar"]')` (em cada etapa do wizard)
- `await page.click('[data-testid="perfil-salvar"]')` (última etapa)

---

## Dicas para o agente não falhar

1. **Sempre esperar o elemento antes de interagir**  
   Depois de cada clique em “Continuar” ou “Avançar”, usar `waitForSelector` para o próximo bloco (ex.: próximo `select`, próximo `button` com texto “Continuar” ou “Avançar”) e um pequeno delay (500–1000 ms) antes de preencher.

2. **Selects**  
   Preferir `[data-testid="perfil-select-tipo"]` e `[data-testid="perfil-select-profissao"]`; usar `page.select(selector, 'liberal')` e depois `page.select(selector, 'estetica')`. O segundo select pode estar `disabled` até o primeiro ter valor; após selecionar o primeiro, dar um delay (~500 ms) e então selecionar o segundo.

3. **Botões**  
   Preferir sempre os `data-testid` da tabela acima (`perfil-continuar`, `perfil-continuar-definir-area`, `perfil-avancar`, `perfil-salvar`). Não clicar em botões com texto “Continuar →”, “Continuar e definir minha área”, “Avançar”, “Salvar perfil”, “Começar as perguntas”. Ignorar botões com texto “Salvando...” (disabled). Exemplo em Puppeteer: `page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Continuar/.test(x.textContent)); b?.click(); })`.

4. **Radio e checkbox**  
   Modalidade: `page.click('input[type="radio"][value="ambos"]')`. Canais: `page.click('input[type="checkbox"][value="instagram"]')`, depois `value="whatsapp"`, `value="indicacao"`.

5. **Campos de texto**  
   Preencher com `page.type(selector, value)` ou `element.type(value)` após focar. Para inputs controlados (React), às vezes é necessário disparar `input`/`change` após setar o value (como no login do agente).

6. **“Execution context was destroyed”**  
   Se der esse erro ao usar `page.evaluate`, fazer um retry: navegar de novo para `/pt/perfil-empresarial`, esperar estabilizar e repetir a ação. Evitar muitas ações dentro de um único `evaluate`; preferir sequência de `page.click`, `page.select`, `page.type`.

7. **Nome e WhatsApp**  
   O perfil completo exige nome e WhatsApp (em geral preenchidos no onboarding inicial da conta). Se o agente criar a conta pelo script `criar-contas-teste-interno.js`, o nome já pode estar em `user_profiles`; o WhatsApp pode precisar ser preenchido no onboarding da primeira entrada ou em algum campo do perfil, se existir.

---

## Resumo da ordem (checklist do agente)

- [ ] Navegar para `/pt/perfil-empresarial` e esperar select/button/form.
- [ ] Se existir “Começar as perguntas” → clicar e seguir Fluxo A (passos 1–4); depois voltar e fazer Fluxo B.
- [ ] Se existir “Continuar e definir minha área” → Fluxo B direto.
- [ ] Em Fluxo B: selecionar liberal + estetica → Continuar e definir → (se aparecer) “Ver estratégias para meu perfil” → preencher as 6 etapas do wizard com os valores do doc de dados → **Salvar perfil**.
- [ ] Validar: abrir Noel e pedir geração de link; não deve pedir para completar perfil.

Com isso o agente tem o **processo exato** do perfil empresarial para conseguir passar por todo o preenchimento e deixar o perfil completo.
