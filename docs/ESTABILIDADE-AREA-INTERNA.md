# Estabilidade da área interna — O que não pode falhar no dia a dia

**Uso:** Checklist para agentes e testes. O que tem que estar **entregue e estável** para não dar erro no uso diário.  
**Relacionado:** `docs/AGENTE-TESTE-PERFIL-E-NOEL.md`, `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md`, `docs/COBERTURA-AGENTE-TESTE-INTERNO-DUDA.md`.

---

## 1. Login e sessão

- Login com e-mail/senha funciona sempre.
- Logout encerra a sessão de fato.
- Sem “sessão perdida” no meio do uso.

## 2. Perfil empresarial

- Formulário abre, salva e persiste (nome, telefone, **tipo de atuação**, **profissão**).
- **Perfil completo (tipo + profissão) é obrigatório** para o Noel gerar link e usar ferramentas; sem perfil completo, o Noel deve orientar a preencher e **não** inventar link.
- Bloqueio do Noel e redirecionamento (quando perfil incompleto) devem funcionar **sem travar a tela**.

## 3. Noel (mentor)

- Chat abre, mensagens enviam e a resposta volta.
- Sem “Execution context destroyed” ou erro genérico que impeça a conversa.
- Respostas **coerentes com o perfil** (médico → pacientes; estética → clientes; vendedor → leads).

## 4. Diagnósticos / Links

- “Criar diagnóstico” inicia o fluxo.
- Noel gera perguntas sem quebrar (quando perfil completo).
- Link é gerado e **abre em outra aba** (público).
- Respostas do diagnóstico são gravadas e aparecem em Leads.

## 5. Leads

- Lista carrega.
- Novos leads aparecem após resposta em link.
- Sem lista vazia quando já existe dado; sem tela quebrada.

## 6. Navegação (sidebar e telas)

- Todos os itens do menu abrem a tela certa.
- Voltar/sair da página não quebra estado.
- Sem 404 ou tela em branco nas rotas principais.

## 7. Configurações e conta

- Alterações em Configurações e Perfil **salvam** e continuam valendo após recarregar ou voltar.
- Assinatura exibe plano atual sem erro.

## 8. Biblioteca

- Abre, lista itens e permite abrir/baixar sem erro de carregamento ou link quebrado.

---

## Resumo

**O que não pode falhar no dia a dia:** login, perfil completo, Noel respondendo, criação de diagnóstico + link que abre, leads atualizando, sidebar e telas abrindo, e tudo que for “salvar” de fato persistir.  
Se isso estiver entregue e estável, os erros no uso diário caem bastante.

**Perfil completo:** O script `scripts/criar-contas-teste-interno.js` preenche `ylada_noel_profile` (tipo + profissão e demais campos) para todas as contas de teste. Valores exatos da **estética (conta 11)** estão em `docs/PERFIL-ESTETICA-PREENCHIMENTO-TESTE.md`. Rodar o script antes dos testes garante que o Noel possa gerar link e que o agente valide o fluxo completo.

---

## Análise Noel (referência)

Ver **seção “Análise rápida”** no final de `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md` para:

- O que está bom (abertura, pergunta estética, perfil incompleto sem link).
- O que pode melhorar (citar link quando houver ativos; CTA mais direto; lembrar “complete o perfil” ao oferecer link).
- Próximo teste: rodar com **perfil completo** e refazer “gerar link” e “me dá o link do último diagnóstico”.
