# Plano de Integração de Áreas YLADA

**Objetivo:** Integrar todas as áreas pendentes (Médicos, Seller, Estética, Fitness) com o mesmo nível de perfumaria: rota própria, SEGMENT_CONTEXT no Noel, perfil e biblioteca.

**Referência:** Integração perfumaria (concluída) — ver commits e `docs/` para padrão.

---

## Estado Atual

| Área | YLADA_AREAS | SEGMENT_CONTEXT | Rota | DB Constraint | Prioridade |
|------|-------------|-----------------|------|---------------|------------|
| YLADA | ✅ | ✅ | /pt | ✅ | — |
| Psicologia | ✅ | ✅ | /pt/psi | ✅ | — |
| Psicanálise | ✅ | ✅ | /pt/psicanalise | ✅ | — |
| Odontologia | ✅ | ✅ | /pt/odonto | ✅ | — |
| Nutra | ✅ | ✅ | /pt/nutra | ✅ | — |
| Coach | ✅ | ✅ | /pt/coach | ✅ | — |
| Perfumaria | ✅ | ✅ | /pt/perfumaria | ✅ | — |
| **Médicos** | ✅ | ✅ | ✅ | ✅ (med) | 1 |
| **Seller** | ✅ | ✅ | ✅ | ✅ | 2 |
| **Estética** | ✅ | ✅ | ✅ | ✅ | 3 |
| **Fitness** | ✅ | ✅ | ✅ | ✅ | 4 |

---

## Fase 1 — Médicos (med)

**Contexto:** Segmento `med` já existe no banco e em profile flows. Médicos usam hoje a matriz YLADA. Objetivo: área dedicada com contexto específico.

### Passos

1. **Config (ylada-areas.ts)**
   - Adicionar `med` em `YladaSegmentCode`
   - Adicionar em `YLADA_AREAS`: `{ codigo: 'med', segment_code: 'med', label: 'Médicos', pathPrefix: '/pt/med' }`
   - Adicionar em `YLADA_SEGMENT_CODES`

2. **Noel (api/ylada/noel/route.ts)**
   - Adicionar `SEGMENT_CONTEXT` para med: *"Você é o Noel, mentor da YLADA para médicos. Oriente sobre rotina, links inteligentes, captação de pacientes e formação empresarial. Tom direto e prático."*
   - Adicionar `med` em `requireApiAuth`

3. **Perfil e auth**
   - `api/ylada/profile/route.ts`: adicionar `med` em `VALID_SEGMENTS` (se ainda não estiver)
   - `ylada-profile-resumo.ts`: adicionar label "Médicos"
   - `auth-server.ts`: adicionar `med` em `Area` e `matrixAreas`
   - `NoelChat.tsx`: adicionar `med` em `NoelArea`

4. **Rota /pt/med**
   - Criar `app/pt/med/layout.tsx` (validar acesso)
   - Criar `app/pt/med/page.tsx` (redirect para /pt/med/home)
   - Criar `app/pt/med/home/page.tsx` (Noel + YladaAreaShell)
   - Criar `app/pt/med/links/page.tsx`
   - Criar `app/pt/med/leads/page.tsx`
   - Criar `app/pt/med/biblioteca/page.tsx`
   - Criar `app/pt/med/perfil-empresarial/page.tsx`
   - Criar `app/pt/med/login/page.tsx`
   - Criar `app/pt/med/links/editar/[id]/page.tsx`

5. **Links e LoginForm**
   - `links/editar/[id]/page.tsx`: adicionar `med` em `useAreaFromPath`
   - `LoginForm.tsx`: adicionar `med` em perfil e labels

6. **Migration**
   - Não necessária — `med` já está no constraint do banco.

---

## Fase 2 — Seller (vendedores)

**Contexto:** Segmento genérico para vendedores. Já está em YLADA_SEGMENT_CODES e no banco.

### Passos

1. **Config (ylada-areas.ts)**
   - Adicionar em `YLADA_AREAS`: `{ codigo: 'seller', segment_code: 'seller', label: 'Vendedores', pathPrefix: '/pt/seller' }`
   - (seller já está em YLADA_SEGMENT_CODES)

2. **Noel**
   - Adicionar `SEGMENT_CONTEXT` para seller: *"Você é o Noel, mentor da YLADA para vendedores. Oriente sobre rotina, links inteligentes, funil de vendas e geração de conversas qualificadas no WhatsApp. Tom direto e prático."*
   - Adicionar `seller` em `requireApiAuth`

3. **Perfil e auth**
   - `VALID_SEGMENTS`: verificar se seller já está
   - `ylada-profile-resumo.ts`: verificar label "Vendedor"
   - `auth-server.ts`: adicionar `seller` em `Area` e `matrixAreas`
   - `NoelChat.tsx`: adicionar `seller` em `NoelArea`

4. **Rota /pt/seller**
   - Mesma estrutura de páginas que med (layout, home, links, leads, biblioteca, perfil, login, links/editar)

5. **Links e LoginForm**
   - Adicionar `seller` em `useAreaFromPath` e `LoginForm`

6. **Migration**
   - Não necessária — seller já está no constraint.

---

## Fase 3 — Estética (aesthetics / estetica)

**Contexto:** Existe na biblioteca como `aesthetics`. Não há segmento no perfil Noel hoje. Precisa criar do zero.

### Passos

1. **Definir código**
   - Usar `estetica` (português) ou `aesthetics` (alinhado à biblioteca). Recomendação: `estetica` para consistência com psi, odonto.

2. **Migration**
   - Adicionar `estetica` no constraint `ylada_noel_profile_segment_check`

3. **Config**
   - Adicionar em `YladaSegmentCode`, `YLADA_AREAS`, `YLADA_SEGMENT_CODES`

4. **Noel, perfil, auth**
   - SEGMENT_CONTEXT: *"Você é o Noel, mentor da YLADA para a área de Estética. Oriente o profissional sobre rotina, links inteligentes, captação de clientes e formação empresarial. Tom direto e prático."*
   - Atualizar profile, auth, NoelChat, requireApiAuth

5. **Rota /pt/estetica**
   - Estrutura completa de páginas

6. **Profile flows**
   - Verificar se `estetica` (profession) já mapeia para algum segmento. Ajustar `PROFESSION_BY_SEGMENT` se necessário.

7. **Biblioteca**
   - `aesthetics` já existe. Garantir mapeamento `estetica` → `aesthetics` onde fizer sentido.

---

## Fase 4 — Fitness

**Contexto:** Existe na biblioteca. Coach pode sobrepor parcialmente. Avaliar se faz sentido área dedicada ou se coach cobre.

### Passos (se optar por área dedicada)

1. **Definir código**
   - `fitness` (alinhado à biblioteca)

2. **Migration**
   - Adicionar `fitness` no constraint

3. **Config, Noel, perfil, auth, rota**
   - Mesmo padrão das fases anteriores

4. **Profile flows**
   - Mapear `personal_trainer`, `coach_fitness` para segmento `fitness` quando aplicável

---

## Ordem de Execução Sugerida

| Ordem | Fase | Esforço | Dependências |
|-------|------|---------|--------------|
| 1 | Médicos | Baixo | Nenhuma — med já existe no DB |
| 2 | Seller | Baixo | Nenhuma — seller já existe no DB |
| 3 | Estética | Médio | Migration + profile flows |
| 4 | Fitness | Médio | Migration + decisão sobre overlap com coach |

---

## Checklist por Área (template)

Para cada área nova:

- [ ] `ylada-areas.ts`: YladaSegmentCode, YLADA_AREAS, YLADA_SEGMENT_CODES
- [ ] `noel/route.ts`: SEGMENT_CONTEXT, requireApiAuth
- [ ] `profile/route.ts`: VALID_SEGMENTS
- [ ] `ylada-profile-resumo.ts`: SEGMENT_LABELS
- [ ] `auth-server.ts`: Area, matrixAreas
- [ ] `NoelChat.tsx`: NoelArea
- [ ] `links/editar/[id]/page.tsx`: useAreaFromPath
- [ ] `LoginForm.tsx`: perfil, perfilLabels, perfilAreaLabels
- [ ] Rota: layout, page, home, links, leads, biblioteca, perfil-empresarial, login, links/editar/[id]
- [ ] Migration (se segmento novo no DB)

---

## Referências

- Integração perfumaria: commits recentes, `migrations/255-ylada-perfumaria-segment.sql`
- `src/config/ylada-areas.ts`
- `src/app/api/ylada/noel/route.ts`
- `src/app/pt/perfumaria/` (estrutura de páginas)
