# Programação: Biblioteca Estética — Expansão e Personalização

**Data:** 24/03/2026  
**Objetivo:** Expandir temas de Estética (cabelo, unhas, sobrancelha, maquiagem), vincular Sugestão do Noel ao perfil do usuário e despoluir a interface.

---

## 1. Ajustes de UX (rápidos)

| # | Tarefa | Status | Arquivo(s) |
|---|--------|--------|------------|
| 1.1 | Remover texto "Filtrar por tema:" — deixar só os pills | ✅ Feito | `BibliotecaPageContent.tsx` |
| 1.2 | Manter ícone 💡 com tooltip da Dica do Noel (quando houver) | Feito | — |

---

## 2. Temas e segmento Estética

| # | Tarefa | Status | Arquivo(s) |
|---|--------|--------|------------|
| 2.1 | Adicionar temas **cabelo**, **unhas**, **sobrancelha**, **maquiagem** ao segmento `aesthetics` | ✅ Feito | `ylada-segmentos-dores-objetivos.ts` |
| 2.2 | Garantir labels em `getTemaLabel` para os novos temas | ✅ Feito | via SEGMENTOS_DORES_OBJETIVOS |
| 2.3 | Atualizar `AREA_ESTETICA_OPTIONS` com: Unhas, Sobrancelha, Maquiagem | ✅ Feito | `ylada-profile.ts` |

---

## 3. Sugestão do Noel por perfil

| # | Tarefa | Status | Arquivo(s) |
|---|--------|--------|------------|
| 3.1 | `getIdeiaRapidaDoDia(segmentCode, areaEspecifica?)` — aceitar segmento + subárea | ✅ Feito | `ylada-biblioteca.ts` |
| 3.2 | Mapear `area_estetica` → tema prioritário: capilar→cabelo, facial→pele, unhas→unhas, etc. | ✅ Feito | `ylada-biblioteca.ts` |
| 3.3 | `IDEIAS_RAPIDAS_ESTETICA`: ideias por subárea (pele, cabelo, unhas, sobrancelha, maquiagem) | ✅ Feito | `ylada-biblioteca.ts` |
| 3.4 | `BibliotecaPageContent`: buscar perfil, passar para `getIdeiaRapidaDoDia` | ✅ Feito | `BibliotecaPageContent.tsx` |

---

## 4. Biblioteca: itens para novos temas

| # | Tarefa | Status | Descrição |
|---|--------|--------|-----------|
| 4.1 | Migration: templates para cabelo | ✅ Feito | migration 283 |
| 4.2 | Migration: templates para unhas | ✅ Feito | migration 283 |
| 4.3 | Migration: templates para sobrancelha | ✅ Feito | migration 283 |
| 4.4 | Migration: templates para maquiagem | ✅ Feito | migration 283 |
| 4.5 | Migration: `ylada_biblioteca_itens` | ✅ Feito | migration 283 |
| 4.6 | Definir `flow_id` ou `template_id` para cada novo item | Pendente | Reutilizar `diagnostico_risco` ou criar fluxos específicos |

---

## 5. Perfil empresarial

| # | Tarefa | Status | Descrição |
|---|--------|--------|------------|
| 5.1 | Expandir `AREA_ESTETICA_OPTIONS` | Pendente | Adicionar: unhas, sobrancelha, maquiagem (capilar já existe = cabelo) |
| 5.2 | Garantir que `area_estetica` é enviado na API profile | Feito | Já existe em `ylada_noel_profile.area_specific` |
| 5.3 | Biblioteca buscar profile com `area_specific` | Pendente | API `/api/ylada/profile` retorna `area_specific`; `BibliotecaPageContent` já pode receber via contexto ou prop |

---

## 6. Ordem sugerida de execução

```
Fase A — Config e UX (1–2h)
├── 1.1 Remover "Filtrar por tema"
├── 2.1 + 2.2 Adicionar temas cabelo, unhas, sobrancelha, maquiagem
└── 5.1 Expandir AREA_ESTETICA_OPTIONS

Fase B — Sugestão personalizada (2–3h)
├── 3.1 + 3.2 + 3.3 Implementar getIdeiaRapidaDoDia(segment, areaEspecifica)
└── 3.4 BibliotecaPageContent passar profile para sugestão

Fase C — Biblioteca de conteúdo (4–8h)
├── 4.1 a 4.4 Criar templates (quiz content)
├── 4.5 Migration ylada_biblioteca_itens
└── 4.6 Definir flow_id/template_id
```

---

## 7. Mapeamento area_estetica → tema

| area_estetica (perfil) | tema (biblioteca) | Exemplo de sugestão |
|------------------------|-------------------|----------------------|
| facial | pele | "O que sua pele está precisando?" |
| corporal | gordura_localizada, celulite, flacidez | "O que pode estar causando sua celulite?" |
| capilar | cabelo | "Seu cabelo está saudável?" |
| harmonizacao | rejuvenescimento | "Sua pele parece mais jovem ou mais velha?" |
| unhas *(novo)* | unhas | "Suas unhas estão fortes e saudáveis?" |
| sobrancelha *(novo)* | sobrancelha | "Qual formato de sobrancelha combina com você?" |
| maquiagem *(novo)* | maquiagem | "Qual maquiagem valoriza seu tipo de pele?" |
| depilacao_laser | pele | Fallback para pele |
| integrativa | pele | Fallback para pele |
| outro | pele | Fallback para pele |

---

## 8. Observações

- **Templates novos:** Podem reutilizar a arquitetura `diagnostico_risco` com blocos de resultado dinâmicos (Noel gera).
- **Fallback:** Se o perfil não tiver `area_estetica` ou o tema não existir na biblioteca, usar sugestão genérica (pele ou tema mais usado).
- **Biblioteca vazia:** Se não houver itens para cabelo/unhas/sobrancelha/maquiagem, o filtro mostrará vazio até a migration rodar.
