# SPEC — FREEMIUM INICIAL DO YLADA

> Documento de especificação para implementação pelo Claude.  
> Última atualização: 2025-03-14

---

## 0. PREMISSAS E ESCOPO (OBRIGATÓRIO)

### 0.1. Wellness não é alterado

- **Não mexer na área wellness.** O produto Wellness mantém seu fluxo atual de assinatura e comercialização.
- Wellness é produto separado; esta spec aplica-se apenas ao YLADA.

### 0.2. YLADA como produto principal

- **Tudo se dá a partir do ylada.com.** O freemium aplica-se ao produto YLADA (links inteligentes, diagnósticos, Noel).
- Entrada: ylada.com → cadastro → uso do produto.

### 0.3. Perfil definido após entrada

- **Os profissionais são definidos pelo perfil depois que entram.** O usuário entra, escolhe/define perfil (nutra, coach, psi, etc.), e a partir daí usa o YLADA.
- A assinatura do freemium é da **área `ylada`**, independente do perfil (segment) escolhido.
- Ou seja: `subscriptions.area = 'ylada'` para este freemium.

---

## 1. OBJETIVO

Implementar um modelo freemium simples, controlado e escalável para o YLADA, com foco em:

- colocar mais gente para dentro
- controlar custo de IA
- manter boa experiência
- gerar upgrade natural para o plano Pro
- preservar o growth loop dos links/diagnósticos

---

## 2. PRINCÍPIOS DO PRODUTO

### 2.1. O free deve ser útil

O plano gratuito não pode parecer demo travada. Ele precisa permitir que o usuário:

- entre
- entenda o valor
- use de verdade
- compartilhe pelo menos 1 diagnóstico
- veja algum resultado

### 2.2. O bloqueio deve parecer crescimento, não punição

**Nunca usar:**
- acesso negado
- recurso indisponível
- plano insuficiente

**Preferir:**
- seu diagnóstico está gerando resultado
- você atingiu o limite do plano gratuito deste mês
- para continuar recebendo respostas, ative o plano profissional

### 2.3. Custo de IA controlado antes da chamada

Toda verificação de limite deve acontecer **antes** de:

- chamar IA
- gerar análise avançada
- interpretar diagnóstico com IA
- gravar processamento que gere custo desnecessário

### 2.4. Limites configuráveis

Não hardcodar números na lógica. Usar constantes/configuração centralizada para ajuste futuro sem retrabalho.

---

## 3. REGRAS DO PLANO INICIAL

### 3.1. Plano Free

| Recurso | Limite |
|---------|--------|
| Links/diagnósticos ativos | 1 |
| Contatos iniciados no WhatsApp por mês | 10 |
| Análises avançadas do Noel por mês | 10 |

### 3.2. Plano Pro

- Links/diagnósticos ampliados ou ilimitados
- Contatos no WhatsApp ampliados ou ilimitados
- Análises avançadas do Noel ampliadas ou ilimitadas

No primeiro momento, o Pro remove as principais limitações do Free.

---

## 4. CONCEITOS IMPORTANTES

### 4.1. O que conta como "contato no WhatsApp"

Uma linha em `ylada_diagnosis_metrics` com `clicked_whatsapp = true`, vinculada a um link do usuário, dentro do mês vigente. Ou seja: pessoas que clicaram no botão e iniciaram contato no WhatsApp.

### 4.2. O que conta como "análise avançada do Noel"

**Conta (consome cota):**
- criar diagnóstico com inteligência
- interpretar situação específica do usuário
- analisar respostas/resultados
- sugerir estratégia personalizada
- responder com geração avançada contextual

**Não conta (quando vier de biblioteca/regra):**
- respostas simples baseadas em biblioteca
- onboarding básico
- FAQ
- orientação estática/pré-estruturada

### 4.3. Comunicação ao usuário

Internamente: controle por chamadas avançadas ou tokens.  
Externamente: mensagem simples como "10 análises estratégicas do Noel por mês". Não expor tokens.

---

## 5. CONFIGURAÇÃO CENTRAL

Criar estrutura em `src/config/` ou equivalente (manter padrão do projeto).

### 5.1. Constantes iniciais

```typescript
// Exemplo: src/config/freemium-limits.ts

export const FREEMIUM_LIMITS = {
  FREE_LIMIT_ACTIVE_LINKS: 1,
  FREE_LIMIT_WHATSAPP_CLICKS_PER_MONTH: 10,
  FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH: 10,
  SUBSCRIPTION_AREA_YLADA: 'ylada',
} as const
```

Esses valores devem poder ser alterados facilmente depois, sem refazer a arquitetura.

---

## 6. ÁREA DE ASSINATURA

### 6.1. Regra

- Usar **`ylada`** como área principal da assinatura para este produto.
- Wellness permanece com área `wellness`; não alterar.

### 6.2. Ajustar funções existentes

Garantir que `hasFreePlan()` e `hasActiveSubscription()` consultem corretamente a área `ylada` quando o contexto for YLADA (links, Noel, diagnósticos).

---

## 7. FLUXO DE LIMITE DOS LINKS/DIAGNÓSTICOS

### 7.1. Regra do link ativo

Usuário Free pode ter apenas **1 link/diagnóstico ativo**.

**Comportamento:** Se tentar criar outro link ativo enquanto já tem 1 ativo:

- bloquear criação
- mostrar mensagem amigável
- oferecer upgrade

**Copy sugerida:**
> "Seu plano gratuito permite 1 diagnóstico ativo por vez. Para criar mais diagnósticos e ampliar sua operação, ative o plano profissional."

**Onde validar:** `POST /api/ylada/links/generate` — antes de inserir novo link.

---

## 8. FLUXO DE LIMITE DE CONTATOS NO WHATSAPP MENSAIS

### 8.1. Regra

Usuário Free pode receber até **10 contatos iniciados no WhatsApp por mês** somando todos os links dele. Conta-se apenas quem clicou no botão (`clicked_whatsapp = true`).

### 8.2. Onde validar

`POST /api/ylada/links/[slug]/diagnosis` — **antes** de qualquer processamento avançado (incluindo cache hit que gera métrica).

### 8.3. Lógica do backend

1. Localizar o link pelo slug (incluindo `user_id` do dono)
2. Identificar o plano do dono (área `ylada`)
3. Se Pro → seguir normalmente
4. Se Free:
   - contar métricas com `clicked_whatsapp = true` do usuário no mês vigente (todos os links)
   - se ≥ 10: **não** chamar IA, **não** processar, **não** gravar métrica
   - retornar payload de limite atingido
   - se < 10: seguir fluxo normal

### 8.4. Contagem do mês

`created_at >= firstDayOfCurrentMonth` (início do mês vigente em UTC ou timezone configurado).

### 8.5. Resposta da API quando limite atingido

```json
{
  "success": false,
  "limit_reached": true,
  "limit_type": "whatsapp_clicks_monthly",
  "message": "Este diagnóstico atingiu o limite de 10 contatos no WhatsApp deste mês. Para continuar recebendo pessoas que te contactam, o profissional precisa ativar o plano profissional."
}
```

---

## 9. TELA PÚBLICA QUANDO LIMITE DE CONTATOS NO WHATSAPP FOR ATINGIDO

### 9.1. Objetivo

O link não deve parecer quebrado. A experiência deve comunicar: esse diagnóstico funcionou, atingiu o limite do plano gratuito, o profissional pode continuar no Pro.

### 9.2. Onde

Página pública do link (`/l/[slug]` ou equivalente). Ao receber `limit_reached: true`, não seguir fluxo normal; mostrar tela amigável.

### 9.3. Copy principal

| Elemento | Texto |
|----------|-------|
| Título | "Este diagnóstico atingiu o limite gratuito deste mês" |
| Corpo | "10 pessoas já iniciaram contato com o profissional no WhatsApp este mês. O limite do plano gratuito foi atingido." |
| Botão principal | "Ver planos" |

### 9.4. Growth loop

Incluir assinatura discreta: **"Criado com YLADA"**

Opcional: CTA secundário "Criar meu diagnóstico também" (link para ylada.com/checkout ou equivalente).

---

## 10. AVISOS PROGRESSIVOS NO DASHBOARD

### 10.1. Objetivo

A venda deve começar antes do bloqueio.

### 10.2. Onde

Área de links, dashboard ou visão principal do produto (ex.: Painel, Diagnósticos).

### 10.3. Para usuários Free

Mostrar contador: **"X/10 contatos no WhatsApp este mês"**

### 10.4. Faixas de aviso

| Faixa | Condição | Mensagem |
|-------|----------|----------|
| 50% | 5 contatos | "5 pessoas já te contactaram no WhatsApp este mês." |
| 75% | 7 contatos | "Seu diagnóstico está gerando contatos. Faltam X para o limite gratuito." |
| 100% | 10 contatos | "Seu diagnóstico atingiu o limite gratuito. Com o Pro: contatos ilimitados no WhatsApp." |

### 10.5. CTA

Em todos os avisos: botão **"Ver planos"**.

---

## 11. LIMITE DAS ANÁLIS AVANÇADAS DO NOEL

### 11.1. Regra

Usuário Free: **10 análises avançadas do Noel por mês**.

### 11.2. Estratégia

- Respostas simples (biblioteca/regra) → não consomem cota
- Respostas avançadas (IA) → consomem 1 cota

### 11.3. Implementação

Criar controle mensal por usuário (tabela, campo agregado ou equivalente):

- `user_id`
- `month_ref` (ex.: "2025-03")
- `advanced_noel_analysis_count`

### 11.4. Comportamento ao atingir limite

- Não chamar IA
- Retornar mensagem de upgrade

**Copy:**
> "Você já utilizou as 10 análises estratégicas disponíveis no plano gratuito este mês. Para continuar recebendo análises completas do Noel, ative o plano profissional."

Botão: "Ativar plano profissional"

### 11.5. Fluxo de decisão (Noel)

```
Pergunta do usuário
  ↓
Pode responder por biblioteca/regra?
  ↓
Sim → responder sem IA (não consome)
Não → verificar limite mensal
  ↓
Se limite disponível → chamar IA e consumir 1
Se limite esgotado → exibir mensagem de upgrade
```

---

## 12. REGRAS DE UX E COPY

### 12.1. Tom

Sempre positivo, orientado a crescimento.

### 12.2. Evitar

- acesso negado
- erro de plano
- bloqueado
- indisponível por limitação

### 12.3. Preferir

- seu diagnóstico está gerando resultado
- você atingiu o limite do plano gratuito deste mês
- para continuar, ative o plano profissional
- amplie sua capacidade
- continue recebendo respostas sem interrupção

---

## 13. REGRAS PARA NOVOS USUÁRIOS

### 13.1. Plano padrão

Novos usuários entram automaticamente no plano Free (área `ylada`), caso não tenham assinatura ativa.

### 13.2. Onboarding

Usuário novo deve cair em estado utilizável imediatamente, sem ambiguidade.

---

## 14. REGRAS TÉCNICAS

### 14.1. Bloquear antes do custo

Validação de limite **antes** de chamar modelo, executar análise cara ou gravar métrica que simule uso autorizado.

### 14.2. Não quebrar links públicos

O visitante nunca deve ver erro técnico genérico, tela branca ou comportamento confuso.

### 14.3. Reaproveitar componentes

Se existem `UpgradePrompt`, `RequireFeature` ou equivalentes, reaproveitar e adaptar ao caso de limite mensal.

---

## 15. ORDEM DE IMPLEMENTAÇÃO

| Fase | Descrição |
|------|-----------|
| **1** | Definições e configuração: área `ylada`, constantes, plano Free padrão |
| **2** | Backend de respostas mensais: endpoint diagnóstico, contagem, bloqueio antes da IA |
| **3** | Frontend público: tela de limite atingido, CTA, assinatura "Criado com YLADA" |
| **4** | Dashboard: contador, avisos 50%/75%/100%, CTA de upgrade |
| **5** | Noel avançado: controle mensal, separação biblioteca vs IA, bloqueio com mensagem amigável |

---

## 16. CRITÉRIOS DE ACEITE

### 16.1. Contatos no WhatsApp mensais

- [ ] Usuário Free com < 10 contatos no WhatsApp no mês recebe novos contatos normalmente
- [ ] Usuário Free ao atingir 10 não processa novo diagnóstico (bloqueia antes)
- [ ] O link continua abrindo normalmente
- [ ] Visitante vê tela amigável, não erro técnico

### 16.2. Dashboard

- [ ] Usuário Free vê quantos contatos no WhatsApp já usou no mês
- [ ] Avisos aparecem em 50%, 75%, 100%
- [ ] CTA de upgrade funcional

### 16.3. Noel

- [ ] Respostas simples não consomem análise avançada
- [ ] Respostas avançadas consomem 1 cota
- [ ] Após 10 análises no mês, usuário Free recebe aviso de upgrade
- [ ] Usuário Pro não sofre bloqueio

### 16.4. Configuração

- [ ] Limites alteráveis facilmente
- [ ] Não depende de múltiplas mudanças de código espalhadas

---

## 17. RESUMO EXECUTIVO

| Item | Decisão |
|------|---------|
| Área de assinatura | `ylada` (wellness não alterado) |
| Plano Free | 1 link, 10 contatos WhatsApp/mês, 10 análises Noel/mês |
| Plano Pro | Remove ou amplia limites |
| Tom | Crescimento, não punição |
| Configuração | Centralizada, fácil de ajustar |

---

## 18. PEDIDO PARA IMPLEMENTAÇÃO

Claude, implementar esta lógica como primeira versão do freemium do YLADA, priorizando:

- simplicidade
- clareza de regra
- baixo retrabalho futuro
- configurabilidade
- UX positiva

Se houver conflito com a arquitetura atual, adaptar preservando a intenção de produto acima.

**Não alterar a área wellness.**
