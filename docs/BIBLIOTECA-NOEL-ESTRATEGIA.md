# Biblioteca + Noel + Estratégia — conexão das features

## O que já está conectado

### 1. Biblioteca estratégica (implementado)
- **Quando usar:** cada diagnóstico tem uma linha "💡 Quando usar" (ex.: "Ideal para postar no Instagram ou enviar para quem diz que não consegue emagrecer").
- **Marketing vs CRM:** filtro e seções separadas:
  - **📣 Marketing** — gerar novos contatos (posts, stories, bio, primeiro contato).
  - **💬 CRM** — aprofundar com quem já conversou (qualificar, acompanhar).
- Um mesmo quiz pode servir aos dois (uso `ambos` na config).

### 2. Noel na Biblioteca (implementado)
- **Sugestão do Noel:** bloco "Se você quer gerar novos clientes hoje, comece com este diagnóstico" + 1 card recomendado (por segmento).
- **Comece por aqui:** 3 diagnósticos recomendados por segmento (ex.: Estética → pele, autoestima, rotina_cuidados).
- **Dica do Noel:** frase no topo (ex.: "Comece por Idade da pele, Tipo de pele ou Cuidados com a pele.").

Config: `getSugestaoNoelTemas(segmentCode)`, `getDicaNoelBiblioteca(segmentCode)` em `src/config/ylada-biblioteca.ts`.

---

## Próximo nível: Noel dinâmico por situação (não implementado)

A ideia é o Noel sugerir **em cima do contexto do profissional**:

| Situação (perfil/estado) | Sugestão do Noel |
|--------------------------|------------------|
| Poucos leads / agenda vazia | "Use este diagnóstico no Instagram hoje para gerar conversas." |
| Muitos curiosos, poucos que fecham | "Use este diagnóstico para qualificar melhor e converter." |
| Clientes ativos | "Use este para acompanhar evolução e reter." |

Isso exige:
1. **Backend:** expor “situação” do profissional (ex.: contagem de leads, diagnóstico_completo, etapa do funil).
2. **Noel:** endpoint ou regra que recebe `segment + situação` e devolve 1–3 `template_id` ou temas recomendados.
3. **Biblioteca:** chamar esse endpoint ao carregar e preencher "Sugestão do Noel" e "Comece por aqui" com a resposta.

Ou, em versão mais simples: **variantes de texto** por “dor” (agenda_vazia, muitos_curiosos, etc.) já guardada no perfil Noel (`ylada_noel_profile.dor_principal`), sem novo endpoint — só trocar a frase e os 3 temas por dor no front.

---

## Resumo

- **Hoje:** Biblioteca ensina quando usar cada item (Marketing/CRM), e o Noel dá sugestão fixa por segmento (Sugestão do Noel + Comece por aqui + Dica).
- **Depois:** Noel pode passar a sugerir com base na situação do profissional (poucos leads vs muitos curiosos vs clientes ativos), usando perfil existente ou um endpoint de recomendação.
