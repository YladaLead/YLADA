# Planejamento: Landings + Checkout por Segmento

**Objetivo:** Todas as áreas do YLADA terão landing page + checkout idêntico. Cartão obrigatório, 7 dias de garantia, cancelamento em Configurações.

---

## 0. Regra importante: Wellness vs Coach de bem-estar

### Wellness = área existente (fora da página oficial)

- **Rota:** `/pt/wellness`
- **Uso atual:** Distribuidores Herbalife (Nutra, nutricionistas)
- **Status:** **Não mexer** — muitas pessoas já utilizam e adquirem
- **Página institucional:** **Não aparece** — Wellness funciona em paralelo, sem divulgação na página oficial do YLADA
- **Referência:** Sempre que falarmos em "Wellness", é essa área que já existe

### Coach de bem-estar = novo segmento (na página institucional)

- **Nome na página institucional:** "Coach de bem-estar"
- **Rota:** `/pt/coach-bem-estar`
- **Status:** Novo segmento com landing própria
- **Plataforma:** Usa a mesma base técnica do Wellness (login → /pt/wellness/home)

### Nutra = segmento amplo (na página institucional)

- **Foco:** Vendedores de Nutra e suplementos em geral (não exclusivo Herbalife)
- **Futuro:** Distribuidores Herbalife podem migrar para Nutra posteriormente
- **Objetivo:** Não ter uma área só para Herbalife; ter segmento amplo para vendedores de suplementos

### Resumo

| Área | O que é | Página institucional | Ação |
|------|---------|----------------------|------|
| **Wellness** | Distribuidores Herbalife (atual) | **Não aparece** | Não mexer; funciona em paralelo |
| **Coach de bem-estar** | Novo segmento para coaches | **Aparece** → /pt/coach-bem-estar | Landing criada |
| **Nutra** | Vendedores de suplementos em geral | **Aparece** | Construir landing + checkout |

---

## 1. Segmentos a implementar

| Segmento | Rota atual | Landing | Checkout |
|----------|------------|---------|----------|
| Nutri | `/pt/nutri` | ✅ Existe | ✅ Existe |
| Coach de bem-estar | `/pt/coach-bem-estar` | ✅ Existe | Usa wellness |
| Wellness (Herbalife) | `/pt/wellness` | ✅ Existe | ✅ Existe — **não na página oficial** |
| Psi | `/pt/psi` | ✅ Existe | ❌ Falta |
| Psicanálise | `/pt/psicanalise` | ❌ Falta | ❌ Falta |
| Odontologia | `/pt/odonto` | ❌ Falta | ❌ Falta |
| Estética | `/pt/estetica` | ❌ Falta | ❌ Falta |
| Fitness | `/pt/fitness` | ❌ Falta | ❌ Falta |
| Perfumaria | `/pt/perfumaria` | ❌ Falta | ❌ Falta |
| Nutra | `/pt/nutra` | ❌ Falta | ❌ Falta |
| Médicos | `/pt/med` | ❌ Falta | ❌ Falta |

**Em breve (formulário):** Profissional liberal, Vendedores em geral

---

## 2. Estrutura padrão de cada página

```
1. HERO (adaptado ao segmento)
2. DORES DO SEGMENTO
3. COMO O YLADA RESOLVE
4. COMO FUNCIONA
5. BENEFÍCIOS
6. EXEMPLOS DE AVALIAÇÕES
7. PARA QUEM É (identificação)
8. PREÇOS (checkout)
9. FAQ
10. CTA FINAL
```

**O que muda entre segmentos:** apenas Hero e Dores. O resto é igual.

---

## 3. Checkout

### 3.1 Modelo
- **Cartão obrigatório** antes de acessar
- **7 dias de garantia** (reembolso se cancelar)
- **Planos:** Mensal R$ 97 | Anual 12× R$ 59 (R$ 708)
- **Cancelar:** em Configurações (área interna)

### 3.2 Estratégia técnica

**Opção A – Checkout único com parâmetro**
- Rota: `/pt/checkout?area=psi` (ou `/pt/checkout/psi`)
- Um componente de checkout que recebe `area` e adapta textos/redirect

**Opção B – Checkout por segmento**
- Rotas: `/pt/psi/checkout`, `/pt/estetica/checkout`, etc.
- Cada um chama a mesma API: `POST /api/checkout` com `{ area: 'psi', planType, email }`

**Recomendação:** Opção B (consistência com Nutri, URLs claras para SEO).

### 3.3 API de checkout
- **Existente:** `/api/nutri/checkout` (área fixa)
- **Criar:** `/api/{area}/checkout` ou API genérica `POST /api/checkout` com `area` no body

---

## 4. Webhook Mercado Pago

### 4.1 O que já faz
- Recebe eventos `payment` e `subscription`
- Extrai `area` de `metadata` ou `external_reference`
- Áreas suportadas hoje: `wellness`, `nutri`, `coach`, `nutra`

### 4.2 O que falta
- Incluir novas áreas: `psi`, `psicanalise`, `odonto`, `estetica`, `fitness`, `perfumaria`, `med`
- Garantir que `metadata.area` seja enviado na criação da Preference/Preapproval
- `determineFeatures()`: definir features por área (ex.: psi = ['ferramentas', 'links', 'noel'])
- Criar `user_profiles` com `perfil` correto (psi, psicanalise, odonto, etc.)

### 4.3 Arquivos a alterar
- `src/app/api/webhooks/mercado-pago/route.ts` – aceitar novas áreas
- `src/lib/payment-gateway.ts` – preços para novas áreas
- `src/lib/mercado-pago-subscriptions.ts` – tipo `area` estendido

---

## 5. Preços (padrão Nutri)

| Área | Mensal | Anual |
|------|--------|-------|
| nutri | R$ 97 | R$ 708 |
| psi, psicanalise, odonto, estetica, fitness, perfumaria, nutra, med | R$ 97 | R$ 708 |

---

## 6. Ordem de construção sugerida

### Fase 1 – Infraestrutura (1–2 dias)
1. **API checkout genérica** – `POST /api/checkout` com `area` ou criar `/api/psi/checkout`, etc.
2. **Payment gateway** – adicionar preços para psi, psicanalise, odonto, estetica, fitness, perfumaria, med
3. **Webhook** – aceitar e processar essas áreas
4. **Página de checkout reutilizável** – componente que recebe `area` como prop

### Fase 2 – Landings (1 por dia ou em lote)

**Wellness** (Herbalife) — não alterar; não aparece na página institucional.

1. **Coach de bem-estar** – ✅ landing criada em /pt/coach-bem-estar
2. **Psi** – já tem landing; adicionar checkout e apontar botões
3. **Psicanálise** – copiar Psi, ajustar Hero + Dores
4. **Odontologia** – idem
5. **Estética** – idem
6. **Fitness** – idem
7. **Perfumaria** – idem
8. **Nutra** – idem (se não tiver)
9. **Médicos** – idem

### Fase 3 – Configuração
1. **Configurações** – garantir que cancelamento funcione em todas as áreas (já existe para Nutri e Wellness)
2. **Redirect pós-pagamento** – enviar para `/pt/{area}/home` ou equivalente

---

## 7. Template de conteúdo por segmento

Para cada novo segmento, preencher:

```yaml
segmento: psi  # ou psicanalise, odonto, etc.
hero:
  titulo: "YLADA para Psicólogos"
  subtitulo: "Pare de perder tempo com curiosos no Instagram."
  subsubtitulo: "Inicie conversas com pessoas que já demonstraram interesse em atendimento."
dores:
  - "Curiosos pedindo informação sem intenção real"
  - "Pessoas que somem depois da conversa"
  - "Dificuldade em conduzir a interação"
para_quem:
  - "Recebem muitas mensagens no Instagram"
  - "Querem organizar a captação"
  - "Querem iniciar conversas com contexto"
exemplos_avaliacoes:
  - "Seu nível de ansiedade pode estar alto?"
  - "Você pode estar acumulando estresse?"
  - "Você está sobrecarregado emocionalmente?"
```

---

## 8. Fluxo completo

```
Página institucional (/pt)
    ↓
Card do segmento (ex: Psicologia)
    ↓
Landing do segmento (/pt/psi)
    ↓
Botão "Começar teste gratuito de 7 dias"
    ↓
Checkout (/pt/psi/checkout) — cartão obrigatório
    ↓
Pagamento aprovado
    ↓
Webhook cria conta + subscription (area=psi)
    ↓
Redirect para /pt/psi/home (ou pagamento-sucesso → home)
    ↓
Usuário usa a plataforma
    ↓
Cancelar em Configurações (/pt/psi/configuracao)
```

---

## 9. Checklist de implementação

- [ ] API checkout para psi, psicanalise, odonto, estetica, fitness, perfumaria, med
- [ ] Payment gateway: preços para novas áreas
- [ ] Webhook: aceitar novas áreas e criar user_profiles com perfil correto
- [ ] Página checkout reutilizável (ou copiar Nutri e parametrizar)
- [ ] Landing Psi: botões → checkout
- [ ] Landing Psicanálise
- [ ] Landing Odontologia
- [ ] Landing Estética
- [ ] Landing Fitness
- [ ] Landing Perfumaria
- [ ] Landing Nutra (se não existir)
- [ ] Landing Médicos
- [ ] Configuração: cancelamento em todas as áreas
- [ ] Página pagamento-sucesso por área (ou única com redirect)

---

## 10. Observações

- **Nutri** já tem checkout próprio; manter como está.
- **Wellness** (Herbalife): **não mexer** — área em uso, muitos usuários ativos. **Não aparece na página institucional** — funciona em paralelo.
- **Coach de bem-estar**: novo segmento em `/pt/coach-bem-estar`; usa plataforma Wellness; **aparece na página institucional**.
- **Nutra** (vendedores de suplementos em geral): construir do zero; segmento amplo, não exclusivo Herbalife.
- **Profissional liberal e Vendedores** continuam com formulário "Solicitar acesso".
- **SEO:** Cada landing vira página indexável (ex: "ylada para psicólogos", "ferramenta para nutricionistas").
