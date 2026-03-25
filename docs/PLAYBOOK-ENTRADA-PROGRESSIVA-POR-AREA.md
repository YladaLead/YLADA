# Playbook: entrada progressiva por área (YLADA)

Documento **mapa + guia** para replicar o modelo da **Estética** nas demais áreas e para novas áreas (incl. verticais “culturais” ou parceiros). Objetivo: mesma lógica de **gatilhos mentais**, **textos adaptados** e **estrutura previsível**, com rollback fácil via rota `v2`.

---

## 1. Referência implementada: Estética

| Item | Onde |
|------|------|
| Entrada nova (progressiva) | `/pt/estetica` → `EsteticaEntradaSocraticaContent.tsx` |
| Entrada antiga (minimal) | `/pt/esteticav2` → `AreaMinimalLandingById` com `areaId="estetica"` |
| Institucional longo | `/pt/estetica/como-funciona` → `EsteticaInstitutionalContent.tsx` |
| Demo “lugar da cliente” | `/pt/estetica/exemplo-cliente` + `estetica-demo-context.ts` + `estetica-demo-cliente-data.ts` |
| Cadastro | `CADASTRO_HREF = '/pt/cadastro?area=estetica'` (ajustar `area=` por vertical) |

**Regra de rollback:** manter sempre uma rota `/{area}v2` (ou convenção equivalente) apontando para o que hoje é a entrada principal, antes da troca.

---

## 2. Inventário de áreas (entrada pública hoje)

| Rota `/pt/...` | Entrada atual | `como-funciona` (institucional) | Status fluxo progressivo |
|----------------|---------------|----------------------------------|---------------------------|
| `estetica` | Progressivo | Sim | Feito (referência) |
| `esteticav2` | Minimal | — | Arquivo de rollback |
| `nutri` | Progressivo | Sim | Feito (`/pt/nutriv2` = minimal) |
| `nutriv2` | Minimal | — | Rollback |
| `nutra` | Minimal | Sim | Pendente |
| `coach` | Minimal | Sim | Pendente |
| `med` | Minimal | Sim | Pendente |
| `fitness` | Minimal | Sim | Pendente |
| `perfumaria` | Minimal | Sim | Pendente |
| `odonto` | Minimal | Sim | Pendente |
| `psi` | Minimal | Sim | Pendente |
| `psicanalise` | Minimal | Sim | Pendente |
| `seller` | `SellerInstitutionalContent` (diferente) | Ver pasta | Tratar à parte |

**Novas áreas:** ao criar pasta em `src/app/pt/{slug}/`, repetir o trio: `page.tsx` (progressivo), `{slug}v2/page.tsx` (minimal ou última versão estável), `como-funciona/page.tsx` (longo).

---

## 3. Estrutura lógica do fluxo (espelho mental da Estética)

Use como **roteiro**; textos mudam por área.

1. **Gancho / escolha** — pergunta binária ou múltipla que espelha a dor do marketing (ex.: preço vs conversa vs cliente pronto).
2. **Dor no digital (só dor)** — um passo curto: conteúdo que não vira conversa, pouca gente chamando, curtida que não vira procura (ver §3.1). **Sem** falar em link ou diagnóstico ainda. **Estética** e **Nutri** já usam esse bloco; replique nas outras áreas.
3. **Reframe** — “o problema não é o seu atendimento / nem você”; evitar culpar protocolo ou técnica. Depois: falta de clareza antes do contato → compara preço.
4. **Contraste futuro** — e se a pessoa chegasse mais preparada?
5. **Mecanismo** — perguntas simples antes do direct/WhatsApp (adaptar ao vocabulário da área).
6. **Noel** — destrava quem não sabe montar; CTA para **ver demo** + opção **continuar** sem demo.
7. **Prova leve do produto** — exemplo de prompt + entrega (perguntas, sequência).
8. **Ponte pós-demo** (só quem volta do exemplo) — biblioteca + personalização + Noel + link/compartilhamento (sem frio de plano se o objetivo for só entrada).
9. **Distribuição** — onde compartilha o link.
10. **Efeito na cliente/cliente** — percebe antes de falar com você.
11. **Benefícios práticos** — menos preço seco, menos sumiço, mais agenda (adaptar).
12. **Fechamento** — CTA persuasivo + **grátis** explícito; sem “ver exemplo” se o demo já foi visto no fluxo.

### 3.1 Passo “só dor”: post, conversa, curtida (sem solução ainda)

Use **logo após** o gancho inicial. A pessoa ainda **não** sabe o que é “o link” nem o produto: **não** antecipar convite com diagnóstico/avaliação grátis aqui (isso quebra a ordem da conversa).

Objetivo: **falar com ela** (você), sem terceirizar em “muita gente na área”, e **evitar repetir** a mesma ideia em duas frases (ex.: “não vira conversa” duas vezes).

**Template** (adaptar só a 1ª linha):

```
{Abertura por área: ex. “Se você trabalha com estética…” / “Se você atende como nutricionista…”}

Você capricha no conteúdo, mas na prática quase não vira conversa.
Muitas vezes você nem sabe direito o que postar.
Muitas vezes você nem tem gente suficiente te chamando.

Até quando o post bomba em curtida, isso nem sempre vira alguém te procurando de verdade.
```

**Referência no código:** `EsteticaEntradaSocraticaContent.tsx` e `NutriEntradaSocraticaContent.tsx` (passo com “Exatamente isso”, logo após a escolha inicial).

### 3.2 Onde falar de “link”, diagnóstico ou convite

Só **depois** que a dor e o caminho (perguntas antes do WhatsApp, Noel, etc.) estiverem claros. Exemplos de encaixe: passo do **mecanismo**, **ponte pós-demo** ou **distribuição do link**. Ali sim vale conectar **convite claro** (avaliação / diagnóstico / passo gratuito) com o **link**, com linguagem alinhada ao produto e ao jurídico da área.

**Modal demo (quando existir):** telas curtas → local/contexto → segmento/nicho → uma linha “só falta começar”, sem explicar demais o que a tela final já mostra.

**Avanço linear vs pós-demo:** um passo dedicado após o demo pode ser **pulado** no `next` normal (como `step === 6 → 8` na estética), para quem não passou pelo exemplo.

---

## 4. Gatilhos e copy — o que adaptar por área

| Eixo | Pergunta para o texto da área |
|------|-------------------------------|
| Dor | O que drena tempo? (direct, orçamento vazio, desmarcação, comparação por preço…) |
| Post / Instagram | Passo 2 = só dor (§3.1); convite pelo link só depois (§3.2) |
| Público | Quem fala na landing: nutri, dentista, coach… (pronome, jargão leve) |
| Promessa | Clareza **antes** do contato; mensagem no WhatsApp **com contexto** |
| Prova social | Usar com critério; remover se estiver fraca ou genérica |
| Risco / fricção | “Grátis”, “sem…” só se for verdade no produto |
| Demo | Faz sentido “exemplo cliente” com nichos da área? Se não, demo mais curta ou só Noel |

Manter **frases curtas**, **poucos parágrafos por tela**, **sem travessão** se o padrão do produto for assim.

---

## 5. Checklist técnico por migração (por área)

- [ ] Criar `src/app/pt/{area}v2/page.tsx` copiando o conteúdo atual de `page.tsx` (minimal).
- [ ] Substituir `src/app/pt/{area}/page.tsx` pelo componente de entrada progressiva.
- [ ] Definir `CADASTRO_HREF` com `?area=` correto (igual cadastro existente da vertical).
- [ ] Eventos `trackEvent`: prefixo estável por área (`{area}_landing_...`, `{area}_demo_...`) para não misturar métricas.
- [ ] Se houver demo com rota dedicada: `{area}-demo-context.ts`, dados de nicho, `sessionStorage` com prefixo único.
- [ ] Metadata (`title` / `description`) na nova entrada.
- [ ] Link interno para `como-funciona` se fizer sentido no header/footer da progressiva.
- [ ] Testar: usuário logado redireciona para `/{area}/home` (ou equivalente), como na estética.
- [ ] Incluir o **passo §3.1** (dor no digital, sem link) no **segundo passo** do `STEPS`, como em estética e nutri; **§3.2** em passo posterior.

---

## 6. Evolução recomendada (código)

Hoje a Estética está **acoplada** a um único arquivo grande. Para várias áreas:

1. **Fase A** — Clonar e renomear (`NutriEntradaSocraticaContent`, etc.), trocar só `STEPS` e constantes (rápido, entrega por vertical).
2. **Fase B** — Extrair componente genérico (`AreaProgressiveLanding`) recebendo `config: { steps, cadastroHref, demoConfig, analyticsPrefix }` e manter **só dados** por pasta `src/lib/{area}-landing-config.ts` (menos duplicação, novas áreas mais fáceis).

Só entrar na Fase B quando 2+ áreas estiverem validadas com texto estável.

---

## 7. Áreas “culturais” / novas verticais

Para parceiros ou nichos novos:

- Definir `slug` único em `src/app/pt/{slug}/`.
- Preencher a **tabela do §4** com alguém do domínio (dor + vocabulário).
- Seguir o **checklist §5**; se não houver `AreaMinimalLandingById`, criar `v2` com landing estática mínima ou última versão aprovada.

---

## 8. Arquivos-chave para consulta rápida

```
src/app/pt/estetica/page.tsx
src/app/pt/estetica/EsteticaEntradaSocraticaContent.tsx
src/app/pt/esteticav2/page.tsx
src/lib/estetica-demo-context.ts
src/lib/estetica-demo-cliente-data.ts
src/app/pt/estetica/exemplo-cliente/
src/app/pt/nutri/page.tsx
src/app/pt/nutri/NutriEntradaSocraticaContent.tsx
src/app/pt/nutriv2/page.tsx
src/lib/nutri-demo-context.ts
src/lib/nutri-demo-cliente-data.ts
src/app/pt/nutri/exemplo-cliente/
src/components/pilot/AreaMinimalLandingById.tsx
```

Atualizar este doc quando uma área for migrada (marcar status na tabela do §2).
