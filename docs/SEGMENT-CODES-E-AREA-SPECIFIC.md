# Segment Codes e area_specific — Referência Rápida

Documento de referência para desenvolvedores sobre a diferença entre códigos de área/rota e segmentos da biblioteca, e sobre as chaves em `area_specific`.

---

## 1. Área (rota) vs Segmento da Biblioteca

| Área (rota / areaCodigo) | Segmento da biblioteca | Uso |
|--------------------------|------------------------|-----|
| `estetica` | `aesthetics` | Quizzes, diagnósticos de pele |
| `psi`, `psicanalise` | `psychology` | Quizzes de ansiedade, sono |
| `odonto` | `dentistry` | Quizzes de saúde bucal |
| `fitness` | `fitness` | Quizzes de treino, energia |
| `med` | `medicine` | Quizzes de metabolismo |
| `nutra`, `seller` | `nutrition_vendedor` | Vendas de suplementos |
| `nutri` | `nutrition` | Nutrição clínica |
| `perfumaria` | `perfumaria` | Perfumaria |
| `coach` | `fitness` | Coach mapeia para fitness na biblioteca |

**Por quê?** A biblioteca usa códigos em inglês (aesthetics, psychology, dentistry, fitness) alinhados a `diagnosis-segment`. As rotas usam códigos em português (estetica, psi, odonto, fitness). O mapeamento está em `getBibliotecaSegmentFromArea()` e `getBibliotecaSegmentFromProfile()` em `src/config/ylada-biblioteca.ts`.

---

## 2. Chaves em area_specific (por profissão)

Campos específicos por profissão, persistidos em `ylada_noel_profile.area_specific` (JSONB).

| Profissão | Chaves em area_specific |
|-----------|-------------------------|
| `estetica` | `area_estetica`, `estetica_tipo_atuacao` |
| `odonto` | `odonto_voce_atende` |
| `psi` | `publico_psi`, `modalidade_atendimento` |
| `fitness` | `fitness_tipo_atuacao` |
| `coach` | `modelo_entrega_coach` |
| `nutricionista` | `area_nutri`, `modalidade_atendimento` |
| `medico` | `publico_principal`, `especialidades`, `especialidade_outra`, `foco_principal`, `desperdicio_principal`, `modelo_receita`, `equipe_operacional` |
| `vendedor_suplementos` | `oferta`, `categoria`, `canal_principal_vendas` |

**Detalhes:** Ver `src/config/ylada-profile-flows.ts` — cada campo com `source: 'area_specific'` tem `path` definindo a chave no JSON.

---

## 3. Campos comuns (colunas)

Campos que vão em colunas fixas da tabela (não em `area_specific`): `profile_type`, `profession`, `category`, `sub_category`, `tempo_atuacao_anos`, `dor_principal`, `prioridade_atual`, `fase_negocio`, `metas_principais`, `objetivos_curto_prazo`, `modelo_atuacao`, `capacidade_semana`, `ticket_medio`, `modelo_pagamento`, `canais_principais`, `rotina_atual_resumo`, `frequencia_postagem`, `observacoes`.

---

## 4. Strategic Profiles

Cada profissão com descoberta de perfil estratégico usa as chaves de `area_specific` do step "contexto" (e, no caso de médico, também do step "especialidade") para gerar o perfil. Ver `src/lib/strategic-profile-*.ts`.
