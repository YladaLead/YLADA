# Checklist — Teste interno da primeira área (ylada matriz)

Use este checklist para rodar o **teste completo da parte interna** na **primeira área** (perfil **ylada / matriz**). Preencha ✅ / ⚠️ / ❌ ao concluir cada bloco.

**Testes com estética como base:** para usar **estética** como perfil de referência (board, Noel, links e biblioteca de estética), use **docs/CHECKLIST-TESTE-INTERNO-ESTETICA.md**. Os mesmos 9 blocos valem; a base recomendada é estética.

---

## Antes de começar

**Opção 1 — Agente (automático):** com o app rodando, execute `npm run agente:interno` (ou `URL=http://localhost:3002 npm run agente:interno` se estiver em outra porta). O agente faz login e percorre os 9 blocos e imprime a tabela ✅/⚠️/❌.

**Opção 2 — Manual:**

- **URL de login:** http://localhost:3002/pt/login *(se o app estiver em outra porta, use 3000 ou 3001)*
- **E-mail:** teste-interno-01@teste.ylada.com
- **Senha:** TesteYlada2025!
- **Telefone (se pedir no perfil/onboarding):** +55 19 99723-0912

**Ordem:** faça login → siga os blocos na ordem abaixo.

---

## 1. Board / Home

- [ ] Login leva para /pt/home ou /pt/painel (sem tela em branco nem erro)
- [ ] Informações do board fazem sentido para perfil ylada (matriz)
- [ ] Menu/navegação levam a Noel, ferramentas, links, configuração
- [ ] Nenhum link quebrado nem botão que não responde

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 2. Perguntas de perfil (onboarding / perfil)

- [ ] Perguntas de perfil aparecem (onboarding ou configuração/conta)
- [ ] Dados salvam e persistem ao sair/voltar
- [ ] Onde o perfil é exibido, os dados aparecem corretos
- [ ] Perfil tem informações que o Noel pode usar (tipo atuação, área, etc.)

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 3. Noel

- [ ] Noel abre e a conversa inicia sem erro
- [ ] Pergunta que depende do perfil (ex.: "qual meu próximo passo?") — resposta faz sentido para ylada/matriz
- [ ] Respostas não são genéricas; referem-se ao contexto do profissional
- [ ] Links/scripts sugeridos são coerentes e o link gerado funciona (se houver)

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 4. Configurações

- [ ] Acesso às configurações é fácil (menu/link visível)
- [ ] Alterar um campo e salvar → alteração persiste ao recarregar
- [ ] Mensagem de sucesso ou erro é clara

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 5. Botões e edições

- [ ] Em 2–3 telas (ex.: ferramentas, links): Salvar/Editar/Criar funcionam
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
- [ ] Conteúdos listados carregam
- [ ] Clicar em um item abre ou baixa o esperado

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 8. Links gerados

- [ ] Em "Links" ou "Gerar link" / "Minhas ferramentas" consegue gerar ou copiar um link
- [ ] Link gerado abre em outra aba e mostra a página correta
- [ ] Link é utilizável (ex.: pode enviar por WhatsApp)

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## 9. Aparência / Layout

- [ ] Nenhum título com palavra repetida (ex.: "Bem-vindo à YLADA YLADA")
- [ ] Elementos não sobrepostos; menus e botões legíveis
- [ ] Textos legíveis (tamanho, contraste)
- [ ] Nada essencial quebrado ou ilegível na tela

**Resultado:** __________ (✅ / ⚠️ / ❌)

---

## Tabela resumo (primeira área — ylada matriz)

| Perfil testado  | Board | Perfil (perguntas) | Noel | Configurações | Botões/Edições | Criar fluxos | Biblioteca | Links gerados | Aparência |
|-----------------|-------|--------------------|------|---------------|----------------|--------------|-------------|---------------|-----------|
| ylada (matriz)   |       |                    |      |               |                |              |             |               |           |

Preencha com ✅ / ⚠️ / ❌ conforme os resultados acima.

---

## Ações prioritárias (o que corrigir primeiro)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

*Baseado em **docs/PASSO-A-PASSO-PARTE-INTERNA.md** e **docs/TESTE-CREDENCIAIS-LOCALHOST.md**. Versão com **estética como base**: **docs/CHECKLIST-TESTE-INTERNO-ESTETICA.md**.*
