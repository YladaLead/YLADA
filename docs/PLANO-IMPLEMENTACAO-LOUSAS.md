# 🚀 PLANO DE IMPLEMENTAÇÃO DAS LOUSAS

Plano detalhado para implementar todo o conteúdo das 12 lousas no Wellness System.

---

## 📊 VISÃO GERAL

### Status Atual
- ✅ Estrutura base (Fases 1-4 completas)
- ✅ Banco de dados criado
- ✅ APIs básicas funcionando
- ✅ NOEL integrado com funções básicas
- ⏳ **PRÓXIMO: Popular conteúdo completo das lousas**

### Objetivo
Transformar todo o conteúdo documentado nas 12 lousas em dados estruturados no banco, scripts funcionais, e lógica inteligente no NOEL.

---

## 🎯 FASE 5: ABASTECER CONTEÚDO

### 5.1 — Links Wellness (37 links)

#### Tabela: `wellness_links` (já existe)

**Ação:**
1. Criar script SQL para inserir os 37 links
2. Incluir metadados:
   - `nome` (ex: "Calculadora de Água")
   - `categoria` (Saúde, Diagnóstico, Transformação, Negócio)
   - `objetivo` (captação, diagnóstico, engajamento, recrutamento)
   - `publico_alvo` (texto descritivo)
   - `quando_usar` (texto descritivo)
   - `script_curto` (texto para NOEL sugerir)
   - `url_template` (se aplicável)

**Arquivo:** `scripts/seed-wellness-links-completo.sql`

---

### 5.2 — Scripts Oficiais

#### Tabela: `wellness_scripts` (já existe)

**Ação:**
1. Popular scripts de:
   - Convite Leve (8 tipos)
   - Follow-up (5 variações)
   - Vendas por produto (6 produtos × 6 variações = 36 scripts)
   - Objeções (20+ scripts)
   - Recrutamento (12 fluxos × scripts)
   - Onboarding (clientes + distribuidores)

**Arquivo:** `scripts/seed-wellness-scripts-completo.sql`

**Estrutura por script:**
- `titulo`
- `categoria` (convite, follow-up, venda, objeção, recrutamento, onboarding)
- `produto` (se aplicável)
- `tipo_cliente` (frio, morno, quente, emocional, racional)
- `conteudo` (texto completo)
- `variações` (JSON com variações)
- `tags` (array de tags)

---

### 5.3 — Treinos (1, 3, 5 minutos)

#### Tabela: `wellness_treinos` (criar se não existir)

**Ação:**
1. Criar tabela se necessário
2. Popular:
   - 15 treinos de 1 minuto
   - 10 treinos de 3 minutos
   - 10 treinos de 5 minutos

**Estrutura:**
- `id`
- `tipo` (1min, 3min, 5min)
- `titulo`
- `conceito` (texto explicativo)
- `exemplo_pratico` (texto)
- `acao_diaria` (texto)
- `gatilho_noel` (quando NOEL deve sugerir)

**Arquivo:** `scripts/seed-wellness-treinos-completo.sql`

---

### 5.4 — Fluxos Completos

#### Tabelas: `wellness_fluxos`, `wellness_fluxos_passos`, `wellness_fluxos_scripts` (já existem)

**Ação:**
1. Popular fluxos detalhados:
   - Fluxo 2-5-10 (completo)
   - Fluxo de Convite Leve (8 tipos)
   - Fluxos de Vendas (5 tipos)
   - Fluxos de Recrutamento (12 tipos)
   - Fluxos de Onboarding (clientes + distribuidores)
   - Fluxos de Retenção (clientes + distribuidores)
   - Fluxos de Reativação

2. Para cada fluxo:
   - Criar registro em `wellness_fluxos`
   - Criar passos em `wellness_fluxos_passos`
   - Criar scripts em `wellness_fluxos_scripts`
   - Criar dicas em `wellness_fluxos_dicas`

**Arquivo:** `scripts/seed-wellness-fluxos-completo.sql`

---

### 5.5 — System Prompt do NOEL

#### Arquivo: `src/lib/noel-wellness/system-prompt.ts` (criar)

**Ação:**
1. Criar arquivo com system prompt completo
2. Incluir:
   - Arquitetura mental (5 passos)
   - 12 aprimoramentos estratégicos
   - Algoritmos avançados (emocional, prioridade, intenção)
   - Tabela de palavras-chave
   - Modos (líder, iniciante, acelerado)
   - Modelos mentais (tipos de distribuidor, tipos de lead)
   - Gatilhos de momento ideal
   - Heurísticas de venda e recrutamento
   - Lógica de sustentação

**Estrutura:**
```typescript
export const NOEL_SYSTEM_PROMPT = `
[Conteúdo completo da Lousa 7]
`
```

---

### 5.6 — Flux Engine (Motor de Fluxos)

#### Arquivo: `src/lib/wellness-system/flux-engine.ts` (criar)

**Ação:**
1. Criar motor que:
   - Detecta gatilhos (emocional, venda, diagnóstico, etc.)
   - Seleciona fluxo apropriado
   - Retorna próximo passo
   - Integra com NOEL

**Funcionalidades:**
- `detectTrigger(mensagem, contexto)` → retorna gatilho
- `selectFluxo(gatilho, perfil)` → retorna fluxo
- `getNextStep(fluxo, passo_atual)` → retorna próximo passo
- `getScript(fluxo, passo, tipo_cliente)` → retorna script

---

### 5.7 — Integração NOEL com Links Wellness

#### Arquivo: `src/lib/noel-wellness/links-recommender.ts` (criar)

**Ação:**
1. Criar lógica para NOEL:
   - Sugerir link baseado em contexto
   - Explicar por que sugeriu
   - Gerar script personalizado
   - Fazer follow-up baseado no link preenchido

**Funções:**
- `recommendLink(contexto, perfil_lead)` → retorna link + script
- `explainWhy(link, contexto)` → retorna explicação
- `generateFollowUp(link_preenchido, resultados)` → retorna follow-up

---

### 5.8 — Gatilhos Automáticos

#### Arquivo: `src/lib/wellness-system/triggers.ts` (criar)

**Ação:**
1. Implementar gatilhos temporais:
   - Treino diário (automático)
   - Semana nova (planejamento)
   - Sexta-feira (fechamento)
   - Domingo (reset emocional)

2. Implementar gatilhos comportamentais:
   - Dias sem ação
   - Lead sumiu
   - Cliente desanimado
   - Distribuidor travou

**Integração:**
- Criar job/cron para gatilhos temporais
- Integrar com NOEL para gatilhos comportamentais

---

## 📋 CHECKLIST DETALHADO

### Semana 1: Links e Scripts
- [ ] Criar `seed-wellness-links-completo.sql` (37 links)
- [ ] Executar seed no Supabase
- [ ] Criar `seed-wellness-scripts-completo.sql` (100+ scripts)
- [ ] Executar seed no Supabase
- [ ] Testar APIs de busca

### Semana 2: Treinos e Fluxos
- [ ] Criar tabela `wellness_treinos` (se não existir)
- [ ] Criar `seed-wellness-treinos-completo.sql` (35 treinos)
- [ ] Executar seed no Supabase
- [ ] Criar `seed-wellness-fluxos-completo.sql` (todos os fluxos)
- [ ] Executar seed no Supabase
- [ ] Testar páginas de fluxos

### Semana 3: NOEL Avançado
- [ ] Criar `system-prompt.ts` com Lousa 7 completa
- [ ] Atualizar handler do NOEL para usar novo prompt
- [ ] Criar `flux-engine.ts`
- [ ] Criar `links-recommender.ts`
- [ ] Integrar com NOEL functions
- [ ] Testar recomendações

### Semana 4: Gatilhos e Automações
- [ ] Criar `triggers.ts`
- [ ] Implementar gatilhos temporais (cron/job)
- [ ] Implementar gatilhos comportamentais
- [ ] Integrar com NOEL
- [ ] Testar fluxo completo

---

## 🎯 PRIORIDADES

### Alta Prioridade
1. ✅ Popular Links Wellness (37 links)
2. ✅ Popular Scripts de Convite Leve
3. ✅ Popular Scripts de Vendas
4. ✅ Popular Treinos (1, 3, 5 min)
5. ✅ Atualizar System Prompt do NOEL

### Média Prioridade
6. Popular Fluxos Completos
7. Implementar Flux Engine
8. Implementar Links Recommender

### Baixa Prioridade
9. Implementar Gatilhos Automáticos
10. Criar Jobs/Cron para gatilhos temporais

---

## 📝 NOTAS TÉCNICAS

### Estrutura de Dados
- Todos os scripts devem ser em português
- Manter consistência de nomenclatura
- Usar JSON para variações quando necessário
- Tags para busca semântica

### Performance
- Índices nas tabelas de busca
- Cache de recomendações frequentes
- Paginação em listagens grandes

### Testes
- Testar cada seed individualmente
- Testar integração NOEL após cada etapa
- Validar scripts com usuários reais

---

## 🚀 COMEÇAR AGORA

**Próximo passo imediato:**
Criar `scripts/seed-wellness-links-completo.sql` com os 37 Links Wellness.
