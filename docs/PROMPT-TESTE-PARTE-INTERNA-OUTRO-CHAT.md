# Prompt para colar em outro chat — Teste da parte interna

Copie o bloco abaixo e cole em outro chat. Quem for executar (ou orientar) o teste da parte interna usará esse contexto e devolverá a tabela preenchida e as ações prioritárias.

**Acesso liberado:** use os e-mails e a senha abaixo para entrar na área interna e vivenciar todo o processo (login → board → perfil → Noel → configurações → fluxos → biblioteca → links → aparência).

**Perfil e Noel:** o prompt já inclui o resumo de `docs/AGENTE-TESTE-PERFIL-E-NOEL.md` (onde está o perfil, o que verificar, como o Noel deve se comportar conforme perfil e objetivos). Para o guia completo, abra esse arquivo.

---

## Credenciais para acesso (todas as contas)

**Senha (todas):** `TesteYlada2025!`

**Telefone para preenchimento interno:** ao preencher perfil ou onboarding (Telefone/WhatsApp), use em **todas** as contas: `+55 19 99723-0912` ou `5519997230912`. Assim você vê no seu WhatsApp a mensagem que chega para o profissional.

| # | E-mail | Perfil |
|---|--------|--------|
| 1 | teste-ylada@teste.ylada.com | ylada (matriz) |
| 2 | teste-ylada-2@teste.ylada.com | ylada |
| 3 | teste-nutri@teste.ylada.com | nutri |
| 4 | teste-coach@teste.ylada.com | coach |
| 5 | teste-seller@teste.ylada.com | seller |
| 6 | teste-nutra@teste.ylada.com | nutra |
| 7 | teste-med@teste.ylada.com | med |
| 8 | teste-psi@teste.ylada.com | psi |
| 9 | teste-odonto@teste.ylada.com | odonto |
| 10 | teste-fitness@teste.ylada.com | fitness |
| 11 | teste-estetica@teste.ylada.com | estética |
| 12 | teste-perfumaria@teste.ylada.com | perfumaria |
| 13 | teste-psicanalise@teste.ylada.com | psicanalise |

---

## Prompt (copiar da linha abaixo)

```
Preciso que você execute a verificação da PARTE INTERNA da plataforma YLADA e me devolva o resultado num formato que eu possa usar. Você terá acesso à área interna para vivenciar todo o processo (login com os e-mails abaixo).

CONTEXTO
- Projeto: YLADA (ylada-app). A área interna é ÚNICA: entrada por ylada.com (ou a URL que eu indicar); o que a pessoa vê (board, Noel, links) depende do PERFIL (ylada, nutri, coach, etc.).
- Não é mais “área Nutri” e “área Coach” separadas por URL; o perfil define quem a pessoa é.
- Wellness fica de fora deste teste (é diferente por dentro).

CREDENCIAIS (use para login na área interna)
- URL de login: [preencher: ex. http://localhost:3000/pt/login ou https://www.ylada.com/pt/login]
- Senha (todas as contas): TesteYlada2025!
- Telefone para perfil/onboarding (use em todas as contas): +55 19 99723-0912 ou 5519997230912
- E-mails por perfil:
  1. teste-ylada@teste.ylada.com — ylada (matriz)
  2. teste-ylada-2@teste.ylada.com — ylada
  3. teste-nutri@teste.ylada.com — nutri
  4. teste-coach@teste.ylada.com — coach
  5. teste-seller@teste.ylada.com — seller
  6. teste-nutra@teste.ylada.com — nutra
  7. teste-med@teste.ylada.com — med
  8. teste-psi@teste.ylada.com — psi
  9. teste-odonto@teste.ylada.com — odonto
  10. teste-fitness@teste.ylada.com — fitness
  11. teste-estetica@teste.ylada.com — estética
  12. teste-perfumaria@teste.ylada.com — perfumaria
  13. teste-psicanalise@teste.ylada.com — psicanalise

PERFIL DO USUÁRIO E NOEL (referência: docs/AGENTE-TESTE-PERFIL-E-NOEL.md)
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

O QUE FAZER
1. Acesse a URL de login acima e entre com cada e-mail (e a senha) conforme o perfil que for testar. Ao preencher perfil ou onboarding (nome, telefone/WhatsApp, etc.), use o telefone +55 19 99723-0912 em todas as contas.
2. Siga o guia: docs/PASSO-A-PASSO-PARTE-INTERNA.md (ou o passo a passo que eu enviar). Use também o bloco PERFIL DO USUÁRIO E NOEL acima. Resumo do que verificar em cada bloco:
   - Board/Home: login leva ao board certo? Conteúdo faz sentido para o perfil?
   - Perfil (perguntas): onboarding/perfil salva? Dados aparecem em configuração? Perfil tem tipo de atuação, área, especialização, metas (para o Noel usar)? Fluxo tipo → profissão → perguntas adicionais coerente? Campos que o Noel usa existem e estão preenchidos?
   - Noel: abre? Respostas consideram o perfil (pacientes vs clientes vs leads)? Se o perfil tem metas, o Noel usa em "próximo passo" e "plano"? Links/scripts coerentes com o segmento?
   - Configurações: fácil achar? Salva e persiste?
   - Botões e edições: todos funcionam? Nada quebra ao editar?
   - Criar fluxos: existe? Cria e aparece?
   - Biblioteca: abre? Conteúdos carregam?
   - Links gerados: gera link? Link abre certo?
   - Aparência/Layout: layout ok? Textos sem repetição (ex.: "YLADA YLADA" no título)? Alinhamento e legibilidade ok? Nada quebrado ou ilegível?
3. Teste pelo menos com o primeiro perfil (ylada/matriz). Se der, teste com mais um ou dois perfis (ex.: nutri, coach) para ver se a experiência muda conforme o perfil.
4. Em todas as telas que abrir (incluindo a primeira após login), considere **layout**: verifique se não há repetição de palavras em títulos (ex.: "Bem-vindo à YLADA YLADA"), alinhamento, legibilidade e se nada está quebrado; registre na coluna Aparência e nas ações prioritárias se encontrar algo.

O QUE PRECISO QUE VOCÊ ME DEVOLVA
- Tabela preenchida (como no PASSO-A-PASSO-PARTE-INTERNA.md), com ✅ / ⚠️ / ❌ para cada bloco e cada perfil testado. Na coluna **Aparência**, avalie layout, textos sem repetição em títulos, alinhamento, legibilidade e se nada está quebrado. Exemplo:

| Perfil testado | Board | Perfil (perguntas) | Noel | Configurações | Botões/Edições | Criar fluxos | Biblioteca | Links gerados | Aparência |
|----------------|-------|--------------------|------|---------------|----------------|--------------|-------------|---------------|-----------|
| ylada (matriz) | ✅    | ✅                 | ⚠️   | ✅            | ...            | ...          | ...         | ...           | ...       |

- Lista de “Ações prioritárias”: o que corrigir primeiro (3 itens ou quantos fizerem sentido), incluindo problemas de layout/texto (ex.: título com palavra repetida).
- Breve resumo: o que está ok e o que mais precisa de atenção (incl. aparência/layout).
- Na análise, considere também **layout**: repetição de palavras em títulos ou frases, alinhamento, espaçamento e legibilidade nas telas que você abrir.

Se por algum motivo não puder acessar a página, me dê um CHECKLIST em tópicos para eu seguir na ordem e, ao terminar, eu te devolvo o que vi (erros, travamentos, o que passou) e você monta a tabela e as ações prioritárias para mim.
```

---

## Uso

1. Cadastre os 11 usuários no administrativo (e-mails e senha da seção "Credenciais para acesso" acima ou de docs/TESTE-CREDENCIAIS-LOCALHOST.md).
2. Libere o acesso à área interna (localhost ou URL de produção) para quem for executar o teste.
3. Abra outro chat e cole o prompt acima (só o que está entre os ```). Preencha no prompt a URL de login (ex.: http://localhost:3000/pt/login).
4. Quem responder (ou o agente) entra com cada e-mail, vivencia o fluxo interno e devolve a tabela preenchida e as ações prioritárias.
5. Use a tabela e as ações prioritárias no planejamento de correções.
