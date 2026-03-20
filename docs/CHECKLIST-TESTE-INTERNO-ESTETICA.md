# Checklist — Teste interno da parte interna (Estética como base)

Use este checklist para rodar o **teste completo da parte interna** com o perfil **Estética** como **referência**. Os mesmos 9 blocos servem para outras áreas; estética é a base para comparar e replicar.

**Por que estética como base:** perfil liberal típico (clínica/consultório), board com diagnóstico e captação, Noel com linguagem de pele/skincare/autocuidado, links e biblioteca segmentados. Validar aqui primeiro e depois replicar o fluxo para nutri, coach, perfumaria, etc.

---

## Antes de começar

**Conta estética (perfil já preenchido pelo script):**
- **E-mail:** teste-interno-11@teste.ylada.com
- **Senha:** TesteYlada2025!
- **Telefone (perfil/onboarding):** +55 19 99723-0912

**Criar/atualizar contas (inclui perfil Noel de estética):**
```bash
node scripts/criar-contas-teste-interno.js
```

**Agente (automático):** com o app rodando:
```bash
URL=http://localhost:3004 HEADLESS=false TESTE_EMAIL=teste-interno-11@teste.ylada.com TESTE_SENHA=TesteYlada2025! npm run agente:interno
```
*(Troque 3004 pela porta do seu `npm run dev`.)*

**Manual:** http://localhost:3004/pt/login → login com as credenciais acima → seguir os blocos na ordem.

---

## 1. Board / Home

- [ ] Login leva para /pt/home ou /pt/estetica/home (ou equivalente) sem tela em branco nem erro
- [ ] Informações do board fazem sentido para **estética** (diagnóstico, captação, agenda, skincare/pele)
- [ ] Menu/navegação levam a Noel, ferramentas, links, configuração
- [ ] Nenhum link quebrado nem botão que não responde

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 2. Perfil (onboarding / perguntas de perfil)

- [ ] Perguntas de perfil aparecem (onboarding ou Perfil no menu)
- [ ] Campos típicos de **estética** visíveis: área principal (facial, corporal…), tipo de atuação (clínica, autônoma…), tempo de atuação, dores, metas
- [ ] Dados salvam e persistem ao sair/voltar
- [ ] Perfil tem informações que o Noel usa (área, tipo atuação, prioridade)

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 3. Noel

- [ ] Noel abre e a conversa inicia sem erro
- [ ] Perguntas que dependem do perfil (ex.: "Qual meu próximo passo?", "Quero um link para post no Instagram") — resposta faz sentido para **estética**
- [ ] Respostas referem-se a pele, skincare, autocuidado, captação de clientes, agenda
- [ ] Links/scripts sugeridos são coerentes com estética; link gerado funciona (se houver)

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 4. Configurações

- [ ] Acesso às configurações é fácil (menu/link visível)
- [ ] Alterar um campo e salvar → alteração persiste ao recarregar
- [ ] Mensagem de sucesso ou erro é clara

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 5. Botões e edições

- [ ] Em 2–3 telas (ferramentas, links): Salvar/Editar/Criar funcionam
- [ ] Nenhum botão travado sem feedback
- [ ] Nenhum erro em vermelho ou "something went wrong" sem explicação

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 6. Criação de fluxos

- [ ] Existe entrada para "criar fluxo" ou "novo fluxo"
- [ ] Formulário/assistente abre e permite preencher
- [ ] Ao salvar, o fluxo aparece na lista e pode ser usado

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 7. Biblioteca

- [ ] Acesso à biblioteca (menu/link) funciona
- [ ] Conteúdos de **estética** (ou segmento correspondente) listados carregam
- [ ] Clicar em um item abre ou baixa o esperado

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 8. Links gerados

- [ ] Em "Links" ou "Gerar link" / "Minhas ferramentas" consegue gerar ou copiar um link
- [ ] Link gerado abre em outra aba e mostra a página correta (ex.: quiz/diagnóstico de pele ou autocuidado)
- [ ] Link é utilizável (ex.: pode enviar por WhatsApp)

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 9. Aparência / Layout

- [ ] Nenhum título com palavra repetida (ex.: "YLADA YLADA")
- [ ] Elementos não sobrepostos; menus e botões legíveis
- [ ] Textos legíveis (tamanho, contraste)
- [ ] Nada essencial quebrado ou ilegível na tela

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## Tabela resumo (estética — cobertura completa 0–11 + 1b)

| Perfil | 0 Onboard | 1 Board | 1b Método | 2 Perfil | 3 Noel | 4 Config | 5 Botões | 6 Fluxos | 7 Bibl. | 8 Links | 9 Apar. | 10 Quiz/Criar | 11 Calc. |
|--------|-----------|---------|-----------|----------|--------|----------|----------|----------|---------|---------|---------|----------------|----------|
| estética |   |   |   |   |   |   |   |   |   |   |   |   |   |

Preencha com ✅ / ⚠️ / ❌. O agente (`npm run agente:interno`) gera essa tabela automaticamente em **docs/RELATORIO-ULTIMO-TESTE-INTERNO.md**.

---

## Replicar para outras áreas

Depois de validar estética, use o **mesmo checklist** trocando apenas a conta:

| Área      | E-mail |
|-----------|--------|
| ylada     | teste-interno-01@teste.ylada.com |
| nutri     | teste-interno-03@teste.ylada.com |
| coach     | teste-interno-04@teste.ylada.com |
| estética  | teste-interno-11@teste.ylada.com **(base)** |
| perfumaria | teste-interno-12@teste.ylada.com |
| med, psi, odonto, fitness, seller, nutra | ver **docs/TESTE-CREDENCIAIS-LOCALHOST.md** |

---

## Ações prioritárias (o que corrigir primeiro)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

*Base: **docs/PASSO-A-PASSO-PARTE-INTERNA.md**, **docs/TESTE-CREDENCIAIS-LOCALHOST.md**, **docs/ESTETICA-DEMO-PERFIL.md**. Conta demo alternativa (script demo): `demo.estetica@ylada.app` / `Demo@2025!` após `node scripts/criar-contas-demo-videos.js`.*

**Cobertura completa do agente:** Para lista detalhada de tudo que o agente de teste interno deve cobrir (Noel, biblioteca, método, quizzes, calculadoras, experiência, fluxos, aparência), ver **docs/COBERTURA-AGENTE-TESTE-INTERNO-DUDA.md**.
