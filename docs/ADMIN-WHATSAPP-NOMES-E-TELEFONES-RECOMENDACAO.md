# Admin WhatsApp: nomes e telefones — recomendação

**Objetivo:** Você conseguir visualizar bem quem é cada contato na lateral do admin e o sistema funcionar de forma estável.

---

## O que é melhor para o seu trabalho e para o sistema

### Manter o enriquecimento (recomendado)

- **Lista usa o cadastro do Supabase**  
  Nome e telefone vêm de: workshop_inscricoes, contact_submissions, leads, nutri_leads. Quem está cadastrado aparece com nome em cima e telefone formatado embaixo.

- **Menos trabalho manual**  
  Quem se inscreve no workshop ou preenche formulário já aparece com nome na lista, sem precisar editar um por um.

- **Comportamento estável**  
  Ordem de exibição é clara: 1) nome do cadastro, 2) nome da conversa (WhatsApp), 3) telefone formatado quando não houver nome. Segunda linha: telefone do cadastro quando existir, senão o número da conversa formatado.

- **Quando ainda aparece só número**  
  Acontece quando o número que a Z-API envia não “bate” com o que está no cadastro (formato diferente, prefixo, etc.). Nesses casos você pode:
  - Cadastrar a pessoa antes (workshop/formulário) com o mesmo número, ou
  - Usar **Editar nome** no admin e salvar o nome exato do cadastro — aí o sistema busca o telefone no Supabase e preenche a segunda linha.

---

## O que precisa estar no repositório para funcionar bem

Para o sistema funcionar em qualquer ambiente (local e deploy):

1. **Arquivos do enriquecimento versionados**
   - `src/lib/whatsapp-conversation-enrichment.ts`
   - `src/lib/phone-br.ts`  

   Se esses arquivos não estiverem commitados, a API quebra ao importá-los em outro clone ou no servidor.

2. **Commitar as alterações atuais**
   - API de conversas (enriquecimento + normalização BR)
   - PATCH da conversa (busca por nome e preenchimento de `display_phone`)
   - Página admin (getDisplayName/getDisplayPhone, agrupamento)

Assim o comportamento fica igual em todos os ambientes e você consegue visualizar e trabalhar com a lista de forma consistente.

---

## Resumo

| Aspecto | Recomendação |
|--------|----------------|
| Enriquecimento (nome/telefone do Supabase) | **Manter** — melhor para visualização e menos trabalho manual |
| Arquivos `whatsapp-conversation-enrichment.ts` e `phone-br.ts` | **Incluir no git** — necessários para a API e o deploy |
| Fluxo de uso | Cadastro (workshop/formulário) quando possível; “Editar nome” quando aparecer só número e você souber o nome do cadastro |

Com isso, a lista do admin fica estável, previsível e alinhada ao cadastro, e o sistema funciona bem em qualquer ambiente.
