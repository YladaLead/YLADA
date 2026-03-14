# Perfil Empresarial — Resumo dos Fluxos por Profissão

Tabela de referência rápida: profissão → steps → campos específicos (area_specific) → Strategic Profile.

---

## Tabela de Fluxos

| Profissão | Step "Contexto" (campos específicos) | Step "Especialidade" | Strategic Profile | Feedback Noel |
|-----------|-------------------------------------|----------------------|-------------------|---------------|
| **estetica** | area_estetica, estetica_tipo_atuacao, tempo | sub_category | ✅ Especialista Premium, Clínica Estruturada, etc. | ✅ |
| **odonto** | odonto_voce_atende, tempo | sub_category | ✅ Consultório Particular, Clínica com Convênio, etc. | ✅ |
| **psi** | publico_psi, tempo | modalidade_atendimento | ✅ Psicologia Organizacional, Terapia de Casal, etc. | ✅ |
| **fitness** | fitness_tipo_atuacao, tempo | sub_category | ✅ Personal Trainer, Treinador Online, etc. | ✅ |
| **coach** | modelo_entrega_coach, tempo | sub_category | ✅ Coach de Sessões Individuais, Coach de Grupo, etc. | ✅ |
| **nutricionista** | area_nutri, modalidade_atendimento, tempo | sub_category | ✅ Nutricionista de Emagrecimento, Esportiva, etc. | ✅ |
| **medico** | publico_principal, tempo | especialidades, foco_principal | ✅ Consultório Particular, Médico com Convênio, etc. | ✅ |
| **vendedor_suplementos** | oferta, categoria, canal_principal_vendas | — | — | — |

---

## Diagrama Simplificado (Liberal)

```
[Intro] Tipo (liberal/vendas) + Profissão
    ↓
[Contexto] Campos específicos + tempo
    ↓
[Noel analisando] (2s) → [Perfil identificado]  ← para estetica, odonto, psi, fitness, coach, nutricionista, medico
    ↓
[Especialidade] sub_category ou campos extras
    ↓
[Diagnóstico] dor_principal, prioridade, fase
    ↓
[Metas e modelo] metas, capacidade, ticket, modelo_pagamento
    ↓
[Canais e rotina] canais, rotina, frequência
    ↓
[Observações]
```

---

## Arquivos Relacionados

| Arquivo | Função |
|---------|--------|
| `src/config/ylada-profile-flows.ts` | Definição de steps e campos por profissão |
| `src/types/ylada-profile.ts` | Opções de select (AREA_ESTETICA_OPTIONS, etc.) |
| `src/lib/strategic-profile-*.ts` | Funções que mapeiam contexto → perfil estratégico |
| `src/components/perfil/PerfilEmpresarialView.tsx` | Wizard, feedback Noel, discovery de perfil |
| `docs/SEGMENT-CODES-E-AREA-SPECIFIC.md` | Mapeamento área ↔ biblioteca, chaves area_specific |
