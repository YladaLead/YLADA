# Perfil Estratégico Derivado — campos usados na inferência

O `deriveStrategicProfile()` usa apenas dados que **já existem** no perfil (`ylada_noel_profile`) e na interpretação ao gerar o link. Nenhuma pergunta nova no onboarding (por enquanto).

## Campos do perfil (ylada_noel_profile) usados hoje

| Campo | Uso na inferência |
|-------|-------------------|
| `tempo_atuacao_anos` | Maturidade: &lt; 2 anos → iniciante |
| `dor_principal` | Dor dominante: agenda_vazia/agenda_instavel → agenda; autoridade/nao_postar → posicionamento; nao_converte/followup_fraco → conversao |
| `fase_negocio` | Maturidade: iniciante, em_crescimento, estabilizado, escalando → estágio e mentalidade |
| `profile_type` | Mentalidade: vendas → comercial |
| `profession` | Mentalidade: medico/nutri/psi/odont → técnico; vendas → comercial |
| `prioridade_atual` | (reservado para regras futuras) |
| `capacidade_semana` | Maturidade: ≥ 20 → crescendo |
| `objetivos_curto_prazo` | (reservado para regras futuras) |

## Contexto da interpretação (ao gerar link)

| Campo | Uso |
|-------|-----|
| `objetivo` | Urgência (captar → alta; educar/reter → média); maturidade (captar → instável quando fase em_crescimento) |
| `tema` | Dor: se tema menciona nicho/posicionamento/marca → posicionamento |
| `area_profissional` | Já usado em StrategicIntro (vendas/comercial); mentalidade por profissão |

## Onde o perfil é carregado

- **Generate** (`POST /api/ylada/links/generate`): busca `ylada_noel_profile` por `user_id` + `segment` (body.segment ou `'ylada'`), chama `deriveStrategicProfile(profile, interpretacao)` e grava `meta.strategic_profile` no `config_json` do link.
- **Link público**: lê `meta.strategic_profile` para StrategicIntro (subtítulo por `dominantPain`) e para CTA adaptativa (diagnosis route usa `getAdaptedCta(strategic_profile, cta_text)`).

## Se o usuário não tiver perfil preenchido

`deriveStrategicProfile(null, interpretacao)` retorna valores padrão baseados só na interpretação: ex. `dominantPain = 'agenda'` quando objetivo é captar, `urgencyLevel = 'alta'`, `maturityStage = 'instavel'`, `mindset = 'tecnico'`. O link continua funcionando; intro e CTA usam fallbacks.
