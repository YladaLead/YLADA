# Passo a passo — Verificar todas as páginas públicas

As verificações podem ser feitas de duas formas:

1. **Pelo agente (recomendado):** um script roda sozinho em todos os segmentos e no final mostra uma tabela com ✅ / ⚠️ / ❌ para cada etapa (Entrada, Landing, Diagnóstico, Resultado, WhatsApp). Quem mexe no projeto roda o comando abaixo.
2. **Manual:** uma pessoa abre cada página no navegador e preenche a tabela deste documento. Útil quando não há como rodar o agente.

**Como rodar o agente em todos os segmentos**

- O app precisa estar no ar (no seu computador: `npm run dev`; ou use o site em produção).
- No terminal, na pasta do projeto, rode:
  - **Teste local:** `npm run agente:simulador-todos`
  - **Teste em produção:** `URL=https://www.ylada.com npm run agente:simulador-todos`
- No final aparece uma tabela resumo com os 9 segmentos (Estética, Medicina, Perfumaria, Nutri, Psi, Odonto, Fitness, Seller, Coach). A área Wellness não entra nesse teste (proposta diferente). Coach é a única porta de entrada para coaches; a diferenciação (bem-estar, carreira, vida) ocorre no perfil dentro da plataforma.

**Verificação manual (sem agente):** abaixo está o guia para uma pessoa testar cada página no navegador e marcar ✅ / ⚠️ / ❌. Não precisa saber programar.

---

## Para que servem as páginas públicas

As páginas públicas (estética, medicina, nutri, etc.) **não são** o funil que o cliente final do profissional vai usar. Elas servem para **explicar ao futuro usuário da plataforma** (o profissional) **como funciona o processo**.

- O visitante faz uma **reflexão** sobre o posicionamento dele, os desafios dele, na **mesma filosofia** que ele vai usar com os clientes lá dentro.
- Ele vê o fluxo: perguntas → resultado → a ideia de “quero saber mais” / contato.
- O **botão ou link de WhatsApp** nessas páginas **não precisa abrir o WhatsApp de verdade**. Ele é **explicativo/simbólico**: mostra *como será* quando o profissional usar a plataforma. Ou seja: “quando você mandar o link para seu cliente, ele verá um botão que abre o WhatsApp para você”. Na página pública pode aparecer só esse entendimento, ou ao clicar pode aparecer uma **mensagem simbólica** (exemplo do que o cliente veria), para ele entender a experiência.
- O que importa na verificação: a página deixa claro que **lá dentro**, quando ele usar com o cliente de verdade, **o cliente terá o botão do WhatsApp dele**. Na página pública é só o modelo de como funciona.

---

## Antes de começar

- **Onde testar:** no site no ar (ex.: https://www.ylada.com) ou no seu computador (quem desenvolve sobe o site e te passa o link).
- **Como testar:** de preferência em uma **aba anônima** ou em um navegador onde você não está logado, para simular um visitante novo.
- **Anotar:** tenha este arquivo aberto (ou impresso) e vá marcando ✅ quando estiver ok, ⚠️ quando tiver dúvida e ❌ quando algo quebrar.

---

## Segmentos que vamos verificar

São as páginas que um visitante acessa antes de fazer login. Cada uma é uma “porta de entrada” de um segmento:

| Nº | Segmento   | Endereço da página (URL) |
|----|------------|---------------------------|
| 1  | Estética   | /pt/estetica              |
| 2  | Medicina   | /pt/med                   |
| 3  | Perfumaria | /pt/perfumaria            |
| 4  | Nutri      | /pt/nutri                 |
| 5  | Psi        | /pt/psi                   |
| 6  | Odonto     | /pt/odonto                |
| 7  | Fitness    | /pt/fitness               |
| 8  | Seller     | /pt/seller                |
| 9  | Coach           | /pt/coach             |

*Wellness (Herbalife) não entra nessa verificação — proposta diferente para o YLADA.*

**Exemplo:** se o site for https://www.ylada.com, a página de estética é:  
https://www.ylada.com/pt/estetica

---

## O que verificar em CADA página (todas iguais)

Para **cada um** dos segmentos acima, faça o seguinte na ordem.

### Passo 1 — Abrir a página
- Digite o endereço (ou clique no link) daquele segmento.
- **Verificar:** a página carrega? Aparece algo quebrado ou em branco?
- **Marcar:** ✅ carregou normal | ❌ não carregou / tela em branco / erro

### Passo 2 — Ler a mensagem da primeira tela
- **Verificar:** a primeira tela explica o que é o YLADA ou o que a pessoa vai ganhar? Tem um botão tipo “Começar”, “Iniciar” ou “Fazer minha avaliação”?
- **Marcar:** ✅ está claro e tem botão | ⚠️ está confuso ou falta botão | ❌ não tem nada disso

### Passo 3 — Clicar no botão de começar
- Clique no botão que leva para o início do diagnóstico (ex.: “Começar”, “Fazer avaliação grátis”).
- **Verificar:** ao clicar, a página muda? Você vai para a próxima etapa (perguntas ou cadastro rápido)?
- **Marcar:** ✅ clicou e avançou | ❌ não acontece nada / erro

### Passo 4 — Responder as perguntas do diagnóstico
- Vá respondendo as perguntas que aparecem (escolha qualquer opção).
- **Verificar:** as perguntas aparecem uma após a outra? Consegue ir até o fim (última pergunta)?
- **Marcar:** ✅ fluxo das perguntas funciona até o fim | ⚠️ trava em alguma pergunta | ❌ não aparece pergunta / erro

### Passo 5 — Ver o resultado
- Depois da última pergunta, deve aparecer uma tela de **resultado** (seu perfil, diagnóstico ou recomendações).
- **Verificar:** essa tela aparece? O texto faz sentido (não está em branco nem quebrado)?
- **Marcar:** ✅ resultado aparece e está legível | ❌ não aparece / tela em branco / erro

### Passo 6 — Explicação do WhatsApp (simbólico)
- Na tela de resultado (ou perto dela) deve ter um botão ou texto que **explique** o que acontece quando o profissional usar a plataforma: o cliente dele verá um botão que abre o WhatsApp para o profissional. Na página pública esse botão/link é **simbólico** (pode mostrar uma mensagem de exemplo ao clicar, ou só deixar claro que “lá dentro” o cliente terá o WhatsApp dele).
- **Verificar:** existe esse elemento (botão ou texto)? O visitante entende que, quando usar a plataforma, o cliente dele terá o botão do WhatsApp? Se ao clicar aparecer uma mensagem simbólica, está claro que é um exemplo?
- **Marcar:** ✅ está claro (botão ou texto explicativo / mensagem simbólica) | ⚠️ existe mas fica confuso | ❌ não tem nada que explique isso

---

## Tabela para preencher (resumo por segmento)

Use esta tabela para marcar **cada segmento**. Assim fica fácil ver quem já foi testado e onde deu problema.

**Legenda:** ✅ OK | ⚠️ Atenção (funciona mas tem algo estranho) | ❌ Erro (não funciona)

| Segmento   | Página abre | Mensagem clara + botão | Botão funciona | Perguntas do diagnóstico | Resultado aparece | Explicação WhatsApp (simbólico) |
|------------|-------------|------------------------|----------------|---------------------------|-------------------|----------------------------------|
| 1. Estética   | | | | | | |
| 2. Medicina   | | | | | | |
| 3. Perfumaria | | | | | | |
| 4. Nutri      | | | | | | |
| 5. Psi        | | | | | | |
| 6. Odonto     | | | | | | |
| 7. Fitness    | | | | | | |
| 8. Seller     | | | | | | |
| 9. Coach           | | | | | | |

---

## Depois de preencher

- **Se tudo estiver ✅:** as páginas públicas estão ok; o próximo passo é verificar a **parte interna** (Noel, diagnósticos, geração de links, etc.).
- **Se tiver ⚠️ ou ❌:** anote em “Ações prioritárias” (abaixo) o que corrigir primeiro e passe para quem desenvolve.

---

## Ações prioritárias (o que corrigir primeiro)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Observação

- Em alguns segmentos o fluxo pode ser um pouco diferente (por exemplo, cadastro antes das perguntas). O importante é: **página abre → dá para clicar em “começar” → dá para responder as perguntas → aparece resultado → fica claro como funciona o WhatsApp quando o profissional usar a plataforma (explicação ou mensagem simbólica).**
- O WhatsApp na página pública **não precisa abrir o app de verdade**; precisa só deixar o visitante entender que, lá dentro, o cliente do profissional terá o botão do WhatsApp dele. Pode ser um texto explicativo ou um clique que mostra uma mensagem de exemplo.
- Se uma página não tiver “diagnóstico com perguntas” (só informação e contato), marque o que fizer sentido (ex.: “página abre” e “explica o contato/WhatsApp”) e deixe em branco o que não se aplica.
