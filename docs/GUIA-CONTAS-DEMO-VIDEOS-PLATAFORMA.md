# Guia: Contas Demo para Vídeos da Plataforma

**Objetivo:** Montar material completo para criar vídeos mostrando a plataforma por dentro, com e-mails de exemplo por área e perfis já configurados.

---

## 1. Estratégia Recomendada

### Opção A: Um e-mail por área (recomendado para vídeos)

Cada vídeo mostra uma área específica. Ao entrar com o e-mail daquela área, o perfil já está configurado e o usuário vai direto para o dashboard correto.

| Área | E-mail sugerido | Senha | Perfil | Redireciona para |
|------|-----------------|------|--------|------------------|
| **Médico** | `demo.med@ylada.app` | `Demo@2025!` | med | `/pt/med/home` |
| **Psicólogo** | `demo.psi@ylada.app` | `Demo@2025!` | psi | `/pt/psi/home` |
| **Vendedor (Nutra)** | `demo.vendedor@ylada.app` | `Demo@2025!` | nutra | `/pt/nutra/home` |
| **Nutricionista** | `demo.nutri@ylada.app` | `Demo@2025!` | nutri | `/pt/nutri/home` |
| **Coach** | `demo.coach@ylada.app` | `Demo@2025!` | coach | `/pt/coach/home` |

### Opção B: Um único e-mail com múltiplos perfis

Um único e-mail (ex: `demo@ylada.app`) com vários perfis em `ylada_noel_profile` (um por segment). O usuário escolhe a área ao acessar (ex: `/pt/med` ou `/pt/psi`). Menos ideal para vídeos, pois exige escolher área manualmente.

### Opção C: Mínimo (3 contas)

Se quiser simplificar, use apenas **3 contas**:
1. **Profissional liberal (medicina)** → `demo.med@ylada.app`
2. **Profissional liberal (psicologia)** → `demo.psi@ylada.app`
3. **Vendedor** → `demo.vendedor@ylada.app`

---

## 2. O que precisa ser configurado por conta

Para cada e-mail demo:

1. **auth.users** — conta criada no Supabase (e-mail + senha)
2. **user_profiles** — perfil do app (`perfil`: med, psi, nutra, etc.) + nome
3. **ylada_noel_profile** — perfil empresarial completo (segmento, dor, metas, modelo de atuação, etc.)
4. **Assinatura** (opcional) — se a área exigir assinatura ativa para acessar conteúdo

---

## 3. Dados de perfil por área (baseados em perfis-simulados.ts)

### Médico (liberal)
- **segment:** med
- **profile_type:** liberal
- **profession:** medico
- **dor_principal:** agenda_instavel
- **fase_negocio:** em_crescimento
- **modelo_atuacao:** consultório, online
- **capacidade_semana:** 25
- **ticket_medio:** 350
- **modelo_pagamento:** convenio
- **area_specific:** especialidades (clínica_geral), temas (emagrecimento, intestino, alimentação)

### Psicólogo (liberal)
- **segment:** psi
- **profile_type:** liberal
- **profession:** psi
- **dor_principal:** sem_indicacao
- **fase_negocio:** estabilizado
- **modelo_atuacao:** consultório, online
- **capacidade_semana:** 18
- **ticket_medio:** 200
- **modelo_pagamento:** particular
- **area_specific:** temas (ansiedade, sono, autoconhecimento)

### Vendedor Nutra
- **segment:** nutra (ou ylada com profession vendedor_suplementos)
- **profile_type:** vendas
- **profession:** vendedor_suplementos
- **dor_principal:** nao_converte
- **fase_negocio:** iniciante
- **modelo_pagamento:** comissao
- **area_specific:** canal_principal_vendas (whatsapp), temas (b12_vitaminas, energia, emagrecimento)

---

## 4. Passo a passo para criar cada conta demo

### 4.1 Criar usuário no Supabase

1. Supabase Dashboard → **Authentication** → **Users**
2. **Add user**
3. Preencher:
   - **Email:** `demo.med@ylada.app` (ou o da área)
   - **Password:** `Demo@2025!`
   - Marcar **Auto Confirm User**
4. Copiar o **UUID** gerado

### 4.2 Inserir user_profiles

```sql
INSERT INTO user_profiles (user_id, perfil, nome_completo, email, created_at, updated_at)
VALUES (
  'UUID-DO-USUARIO'::uuid,
  'med',  -- ou 'psi', 'nutra', 'coach', etc.
  'Dr. Demo Medicina',
  'demo.med@ylada.app',
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  perfil = EXCLUDED.perfil,
  nome_completo = EXCLUDED.nome_completo,
  email = EXCLUDED.email,
  updated_at = NOW();
```

### 4.3 Inserir ylada_noel_profile

```sql
INSERT INTO ylada_noel_profile (
  user_id, segment, profile_type, profession,
  tempo_atuacao_anos, dor_principal, prioridade_atual, fase_negocio,
  metas_principais, objetivos_curto_prazo,
  modelo_atuacao, capacidade_semana, ticket_medio, modelo_pagamento,
  canais_principais, rotina_atual_resumo,
  area_specific, created_at, updated_at
)
VALUES (
  'UUID-DO-USUARIO'::uuid,
  'med',
  'liberal',
  'medico',
  8,
  'agenda_instavel',
  'Preencher agenda e organizar divulgação',
  'em_crescimento',
  'Aumentar número de consultas e ter mais indicações',
  'Criar rotina de posts e usar um link para qualificar quem quer agendar',
  '["consultorio", "online"]'::jsonb,
  25,
  350,
  'convenio',
  '["instagram", "indicacao"]'::jsonb,
  'Atendo 3–4 dias por semana, pouco tempo para divulgar',
  '{"especialidades": ["clinica_geral"], "temas_atuacao": ["emagrecimento", "intestino", "alimentacao"]}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (user_id, segment) DO UPDATE SET
  profile_type = EXCLUDED.profile_type,
  profession = EXCLUDED.profession,
  dor_principal = EXCLUDED.dor_principal,
  prioridade_atual = EXCLUDED.prioridade_atual,
  fase_negocio = EXCLUDED.fase_negocio,
  metas_principais = EXCLUDED.metas_principais,
  objetivos_curto_prazo = EXCLUDED.objetivos_curto_prazo,
  modelo_atuacao = EXCLUDED.modelo_atuacao,
  capacidade_semana = EXCLUDED.capacidade_semana,
  ticket_medio = EXCLUDED.ticket_medio,
  modelo_pagamento = EXCLUDED.modelo_pagamento,
  canais_principais = EXCLUDED.canais_principais,
  rotina_atual_resumo = EXCLUDED.rotina_atual_resumo,
  area_specific = EXCLUDED.area_specific,
  updated_at = NOW();
```

---

## 5. Redirecionamento após login

O `auth/callback` e o `LoginForm` redirecionam com base em `user_profiles.perfil`. Hoje estão mapeados: nutri, coach, nutra, coach-bem-estar. Os demais caem em `wellness/home`.

**Para que med, psi, seller, odonto funcionem corretamente**, é necessário atualizar o auth callback e o LoginForm para incluir:

- `med` → `/pt/med/home`
- `psi` → `/pt/psi/home`
- `odonto` → `/pt/odonto/home`
- `seller` → `/pt/seller/home` (ou `/pt/nutra/home` se seller usar nutra)
- `perfumaria` → `/pt/perfumaria/home`
- `estetica` → `/pt/estetica/home`
- `fitness` → `/pt/fitness/home`
- `ylada` → `/pt/home` (matriz)

---

## 6. Testes e Links Inteligentes por segmento

Os Links Inteligentes e quizzes já são filtrados por `segment_code`. Ao criar um link em `/pt/med/links`, o segment é `med`; em `/pt/psi/links`, o segment é `psi`. O perfil em `ylada_noel_profile` com o segment correto já direciona o Noel e as sugestões.

Não é necessário configurar nada extra: ao entrar com `demo.med@ylada.app`, o perfil `med` já está em `ylada_noel_profile`, e as APIs usam esse contexto automaticamente.

---

## 7. Alternativa: Perfis simulados (sem login real)

A plataforma já tem **perfis simulados** em `src/data/perfis-simulados.ts`, acessíveis via cookie `ylada_simulate_profile`. Em `/pt/perfis-simulados` você pode ativar um perfil (medico, psi, vendedor_nutra, etc.) e navegar como se fosse esse profissional — **sem precisar de conta**.

**Vantagem:** rápido para testes e gravações internas.  
**Desvantagem:** não é login real; para vídeos de “como o cliente entra”, precisa de conta demo.

---

## 8. Resumo prático

| O que fazer | Como |
|-------------|------|
| **E-mails** | `demo.med@ylada.app`, `demo.psi@ylada.app`, `demo.vendedor@ylada.app` (ou mais áreas) |
| **Senha única** | `Demo@2025!` (ou outra forte) |
| **Criar contas** | Supabase Auth → Add user (Auto Confirm) |
| **Configurar perfil** | `user_profiles` (perfil = med/psi/nutra) + `ylada_noel_profile` (dados completos) |
| **Redirecionamento** | Atualizar auth callback para med, psi, seller, etc. |
| **Testes/quizzes** | Já direcionados por segment; usam o perfil automaticamente |

---

## 9. Script SQL completo (exemplo para 3 contas)

Um script `SETUP-CONTAS-DEMO-VIDEOS.sql` pode:
1. Criar os 3 usuários via Supabase (manual ou API)
2. Inserir `user_profiles` e `ylada_noel_profile` para cada um
3. (Opcional) Configurar assinatura ativa se necessário

Os UUIDs dos usuários precisam ser obtidos após criar cada conta no Supabase.

---

**Criado em:** 2025-03-13  
**Referências:** `perfis-simulados.ts`, `GUIA-ACESSO-CONTA-DEMO.md`, `ylada-areas.ts`
