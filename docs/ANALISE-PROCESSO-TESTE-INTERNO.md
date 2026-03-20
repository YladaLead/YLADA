# Análise do processo — Teste interno (agente)

**Data da análise:** com base no último run do agente (área Estética, conta teste-interno-11).  
**Referência do run:** terminal 12 / `RELATORIO-ULTIMO-TESTE-INTERNO.md`.

---

## 1. Objetivo do processo

O **agente de teste interno** (`scripts/agents/ylada-interno.ts`) automatiza a verificação da **parte interna** do app (pós-login): fluxo de uso, Noel, biblioteca, método, links, aparência, etc.  
Ele usa a **área Estética** como base (conta `teste-interno-11@teste.ylada.com`) e cobre os blocos definidos em `docs/COBERTURA-AGENTE-TESTE-INTERNO-DUDA.md`.

**O que o processo entrega:**
- Uma **tabela de resultados** (✅ OK, ⚠️ ATENCAO, ❌ ERRO) por bloco.
- **Relatório** em `docs/RELATORIO-ULTIMO-TESTE-INTERNO.md`.
- **Respostas do Noel** em `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md` e `.json` (para revisão e definição de comportamento).

---

## 2. Resultado geral deste run

| Resumo | Valor |
|--------|--------|
| **Blocos com OK** | 11 de 12 (Login, 1, 1b, 2, 3, 4, 5, 6, 7, 8, 9, 10) |
| **Blocos com ATENCAO** | 1 (apenas 11. Calculadora) |
| **Blocos com ERRO** | 0 |

**Conclusão:** O processo está **estável e alinhado à cobertura**. O único ⚠️ é **esperado** quando não há links públicos na página Links (ver abaixo).

---

## 3. O que cada etapa validou (resumido)

| Bloco | O que foi verificado |
|-------|----------------------|
| **Login** | Login com a conta de teste e redirecionamento para a área. |
| **1. Board/Home** | Página inicial carrega; menu e conteúdo presentes. |
| **1b. Método YLADA** | Página do método carrega; **sem repetição** "YLADA YLADA" no texto. |
| **2. Perfil** | Página de perfil carrega; dados visíveis. |
| **3. Noel** | Campo de chat encontrado; 10 perguntas enviadas; respostas consideradas coerentes; **conversa salva** em `NOEL-RESPOSTAS-TESTE-INTERNO.*` para revisão. |
| **4. Configurações** | Página de configurações carrega. |
| **5. Botões/Edições** | Botões presentes na interface (edição não exercitada pelo agente). |
| **6. Criar fluxos** | Acesso a fluxos; na matriz, redireciona para Links — considerado OK. |
| **7. Biblioteca** | Biblioteca carrega; conteúdo e ação de criar presentes. |
| **8. Links gerados** | Página de links carrega. |
| **9. Aparência** | Sem repetição "YLADA YLADA" e sem erro genérico de tela. |
| **10. Quiz/Criar link** | Página de criar link/diagnóstico carrega; formulário/templates presentes. |
| **11. Calculadora** | **ATENCAO:** Nenhum link público na página Links para abrir e testar (calculadora/quiz público). |

---

## 4. Por que o 11 (Calculadora) fica em ATENCAO

O bloco **11. Calculadora** abre um **link público** (tipo `/l/...`) a partir da listagem da página Links e verifica se a página do link (quiz/calculadora) carrega com formulário/CTA.

- Se **não existir nenhum link público** na página Links, o agente não tem o que abrir e marca **ATENCAO** com a mensagem: *"Nenhum link público na página Links para testar"*.
- **Não é falha de código:** para o bloco passar como OK, a conta de teste precisa ter **pelo menos um link criado e público** (ex.: um diagnóstico ou calculadora) em Links.

**Ação opcional:** criar um link (ex.: calculadora ou quiz) na conta `teste-interno-11` e rodar o agente de novo; o 11 tende a passar.

---

## 5. Conquistas do processo (correções que levaram a este resultado)

- **1b e 9:** Ajustes no header e no sidebar (não repetir "YLADA" quando a área já é matriz) eliminaram o ERRO/ATENCAO de "YLADA YLADA".
- **3. Noel:** Esperar o `textarea`, identificar o botão "Perguntar ao Noel" e clicar nele (sem depender de `form.requestSubmit`) — envio e respostas estáveis.
- **6. Fluxos:** Considerar OK quando `/pt/fluxos` redireciona para `/pt/links` na matriz.
- **Respostas do Noel:** Conversa (perguntas + respostas) passou a ser salva em `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md` e `.json` para revisão e definição de comportamento (incl. links).

---

## 6. Próximos passos sugeridos

1. **Revisar** `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md` (e o JSON) para **definir comportamento esperado** do Noel (tom, quando entregar links, scripts, etc.).
2. **Opcional:** Criar pelo menos um link público na conta de teste e rodar o agente de novo para o bloco 11 sair de ATENCAO.
3. **Manter:** Rodar o agente após mudanças relevantes na parte interna (`npm run agente:interno` com `URL` e `HEADLESS` conforme necessário) e usar a tabela resumo no checklist/cobertura.

---

*Documento gerado a partir do run do agente de teste interno (área Estética).*
