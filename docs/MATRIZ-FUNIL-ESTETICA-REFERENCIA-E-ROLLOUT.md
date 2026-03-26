# Matriz YLADA: Estética como referência + rollout por área

Documento vivo para alinhar produto e engenharia: **a Estética é o padrão** de experiência pública e de primeira home; as demais áreas migram **uma por vez**. Inclui decisões de **pós-cadastro** e como incluir **área nova/genérica**.

**Relacionado:** `docs/MATRIZ-CENTRAL-CRONOGRAMA.md`, `docs/YLADA-PARIDADE-AREAS.md`, `src/config/ylada-areas.ts`.

---

## 1. Princípio

- **Uma filosofia:** do primeiro toque no site até a primeira ação na área logada, o usuário deve sentir **um fluxo contínuo** (perguntas no mesmo estilo → resultado claro → prévia / cadastro → onboarding → home com CTA forte), sem “quiz novo colado em landing antiga”.
- **Estética = referência:** tudo que outra área quiser igual, copia o **comportamento e a cadência** da Estética; copy e nichos mudam por segmento.
- **Implementação:** **uma área por entrega** (PR/deploy), com smoke test e analytics antes da próxima.

---

## 2. O que a Estética faz hoje (referência de produto)

Ordem ideal que o time quer replicar:

| Etapa | O usuário vê / faz |
|--------|---------------------|
| Site | `ylada.com/pt` → “Comece agora” → `/pt/segmentos` |
| Segmento | Toque em Estética → `/pt/entrada/estetica` (escolha de **foco** / nicho) |
| Quiz curto | `/pt/estetica` — várias perguntas **no mesmo formato** (título + opções), barra de progresso |
| Fechamento | Tela de resultado + CTA (ex.: “Ver na prática”) |
| Prévia cliente | Fluxo “como a cliente vê” (ex.: `ver-pratica` / demo) |
| Cadastro | Quando fizer sentido no funil |
| Onboarding | Perfil / “Word” após cadastro na área |
| Primeira home | Banner de ativação enxuto + Noel (chat colapsado até expandir) |

**Regra de ouro (produto):** perto da ação, **menos texto**; o banner pós-onboarding foi enxugado nesse espírito.

---

## 3. Decisões internas — depois que a pessoa entra (área logada)

Consolidado das decisões recentes; vale manter **paridade** entre áreas da matriz onde fizer sentido:

- **Home:** `NoelHomeContent` + `PosOnboardingHomePanel` por `areaCodigo`; banner **full** na primeira visita pós-onboarding (flag em `sessionStorage`), depois some conforme links / preferências.
- **Banner pós-onboarding:** foco no CTA principal (“Criar meu link agora”); sem microcopy extra que gere fricção.
- **Noel:** mensagem contextual conforme links/views/leads (`noel-contextual-welcome.ts`); home com chat **colapsado** até o usuário optar por expandir.
- **Estudo interno (opcional):** rota tipo `/pt/{area}/preview-primeira-home` com `noindex` para alinhar time em UX (Estética já tem; replicar por área se útil).
- **Como usar:** página em `/pt/{area}/como-usar` com `ComoUsarContent`; revisar copy quando o funil público mudar.

---

## 4. Arquitetura técnica (mapa rápido)

| Peça | Função |
|------|--------|
| `YLADA_AREAS` + `publicEntry` | `standard` \| `custom` \| `none` — quem usa o motor de quiz unificado |
| `getPublicFlowConfig` + `ylada-public-flow-registry.ts` | Config por área (`estetica` hoje) |
| `YladaPublicEntryFlow` | UI do quiz curto (perguntas + resultado) |
| `ylada-public-flow-handoff.ts` | Handoff `ylada.com` → raiz da área (sessionStorage) |
| `getMatrixHubHrefForArea` | Hub `/pt/segmentos` → `/pt/entrada/{area}` quando `areaUsesStandardPublicFlowMotor` |
| Onboarding / home | `ylada-pos-onboarding.ts`, `PosOnboardingHomePanel`, `NoelHomeContent` |

**Estado atual (resumo):**

- **Áreas com `publicEntry: 'standard'`** (incl. Estética, Med, Psi, Odonto, Nutra, Coach, Perfumaria, Fitness, Psicanálise): quiz unificado em `/pt/{area}` + escolha de nicho em `/pt/entrada/{area}` com handoff; não há mais fallback só-nicho (`ylada-matrix-entrada-fallback` removido).
- **Nutri** e segmentos sem `standard`: hub pode apontar direto para `/pt/{area}` até migração.

---

## 5. Tabela de áreas (matriz) — alvo de paridade

Áreas em `YLADA_AREAS` com rota própria (excl. hub genérico `ylada` e casos especiais):

| Código | Label | Funil público alvo | Notas |
|--------|--------|---------------------|--------|
| estetica | Estética | **Referência** (`standard`) | Base para todas |
| med | Médicos | **standard** | Paridade motor |
| psi | Psicologia | **standard** | Paridade motor |
| psicanalise | Psicanálise | **standard** | Paridade motor |
| odonto | Odontologia | **standard** | Paridade motor |
| nutra | Nutra | **standard** | Paridade motor |
| coach | Coach | **standard** | Paridade motor |
| perfumaria | Perfumaria | **standard** | Paridade motor |
| seller | Vendedores | Igual Estética | A migrar |
| fitness | Fitness | **standard** | Paridade motor |
| nutri | Nutri | **Custom** ou fase própria | APIs/rotas legadas; não forçar paridade no mesmo PR |

**“Oito áreas”** no discurso comercial pode variar; na matriz de código são **10 segmentos** acima (sem contar `ylada`). Nutri costuma ser tratada à parte.

---

## 6. Passo a passo — implantar **uma** área (paridade Estética)

Repetir este bloco por área, **um deploy por vez**.

### 6.1 Produto / conteúdo

1. Definir **nichos** (ou ausência) e **perguntas** do quiz curto (espelhar cadência da Estética: 5–7 telas + resultado).
2. Definir copy do **resultado** e CTA para **prévia cliente** (URL equivalente a `ver-pratica` / demo).
3. Definir **cadastro** (`/pt/cadastro?area=…`) e deep links.
4. Revisar **onboarding** da área: ao concluir, setar flag pós-onboarding (`ylada_pos_onboarding` / fluxo já usado na Estética).
5. Conferir **home** (banner + Noel) e **Como usar**.

### 6.2 Engenharia

1. Criar `ylada-public-flow-{area}.ts` (ou bloco no registry) com `PublicFlowConfig`: paths, nichos, `resolveQuestions`, `resultCopy`, analytics.
2. Registrar em `CONFIG_BY_AREA` em `ylada-public-flow-registry.ts`.
3. Em `ylada-areas.ts`: `publicEntry: 'standard'` para essa área.
4. Trocar `/pt/{area}/page.tsx` (ou componente atual) para usar `YladaPublicEntryFlow` + `getPublicFlowConfig('{area}')` como a Estética (`EsteticaQuizPublicContent`).
5. Remover ou arquivar landing **socrática legada** dessa área após paridade (evitar duas entradas).
6. `getMatrixHubHrefForArea` já usa só `areaUsesStandardPublicFlowMotor` (sem fallback legado).
7. Eventos em `analytics-events.ts` alinhados ao prefixo da área.
8. QA: mobile, fluxo feliz `segmentos → entrada → quiz → prévia → cadastro → onboarding → home`, usuário já logado (redirect home).

### 6.3 Critério de “pronto”

- Sensação de **um quiz só até o fim**, no **mesmo layout** da Estética.
- Nada de “primeira tela tipo quiz + sequência antiga diferente” sem aviso no time.

---

## 7. Passo a passo — área **nova / genérica**

Para um segmento que **ainda não existe** em `YLADA_AREAS`:

1. **Produto:** aprovar `codigo` (slug de rota), label, nichos e tom de voz do quiz (pode partir de template Estética com placeholders).
2. **Registro:** adicionar linha em `YLADA_AREAS` (`pathPrefix`, `segment_code`, `publicEntry: 'standard'` quando o funil estiver pronto).
3. **Código:** seguir a seção 6.2; reutilizar **só** o motor (`YladaPublicEntryFlow`) + **nova** config.
4. **Menu / sidebar:** `YladaSidebar` e rotas protegidas conforme padrão das outras áreas.
5. **APIs / Noel:** garantir `area` aceito em `/api/ylada/noel` e perfis permitidos (`YLADA_API_ALLOWED_PROFILES` etc.).
6. **Institucional:** incluir na lista do piloto (`INSTITUTIONAL_AREAS`) e, se necessário, `getYladaLandingAreas` / links de marketing.
7. **Nutri / Wellness:** se a área for “fora da matriz” no produto, usar `publicEntry: 'custom'` e documentar exceção.

---

## 8. Ordem sugerida de rollout (ajustável pelo negócio)

1. **Estética** — concluída como referência.  
2. **Medicina** — maior impacto percebido (“quiz até o fim”).  
3. **Psicologia** — mesmo molde que Med.  
4. **Odontologia** — entrada socrática hoje, alinhar ao motor.  
5. **Psicanálise, Fitness, Perfumaria, Nutra, Coach, Seller** — priorizar por tráfego/contrato.

Nutri: trilha separada quando o escopo matriz + Nutri estiver fechado.

---

## 9. Manutenção deste documento

- Atualizar a **tabela §5** e o **estado atual §4** a cada área migrada.  
- Se mudar a referência Estética (novo passo no funil), atualizar **§2** e o checklist **§6**.  
- Data da última revisão: colocar no rodapé em commits que tocarem rollout.

---

*Última atualização: março/2026 — alinhado ao estado do repo após funil matriz (entrada + handoff + motor Estética + transição Med/Psi).*
