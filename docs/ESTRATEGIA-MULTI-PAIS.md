# 🚀 ESTRATÉGIA MULTI-PAÍS - STRIPE BR E US

## 📋 VISÃO GERAL

O sistema detecta automaticamente o país do usuário e escolhe a conta Stripe apropriada:
- **Conta BR**: Países da América Latina
- **Conta US**: Resto do mundo (EUA, Europa, Ásia, África, etc.)

---

## 🌍 PAÍSES SUPORTADOS

### Conta Stripe BR (América Latina)
- 🇧🇷 Brasil
- 🇦🇷 Argentina
- 🇨🇱 Chile
- 🇨🇴 Colômbia
- 🇲🇽 México
- 🇵🇪 Peru
- 🇺🇾 Uruguai
- 🇵🇾 Paraguai
- 🇧🇴 Bolívia
- 🇪🇨 Equador
- 🇻🇪 Venezuela
- 🇨🇷 Costa Rica
- 🇵🇦 Panamá
- 🇬🇹 Guatemala
- 🇭🇳 Honduras
- 🇳🇮 Nicarágua
- 🇸🇻 El Salvador
- 🇩🇴 República Dominicana
- 🇨🇺 Cuba
- 🇯🇲 Jamaica
- 🇹🇹 Trinidad e Tobago
- 🇧🇿 Belize

### Conta Stripe US (Resto do Mundo)
- 🇺🇸 Estados Unidos
- 🇨🇦 Canadá
- 🇬🇧 Reino Unido
- 🇪🇺 Países da Europa
- 🇦🇺 Austrália
- 🇳🇿 Nova Zelândia
- 🇯🇵 Japão
- 🇰🇷 Coreia do Sul
- 🇸🇬 Singapura
- 🇦🇪 Emirados Árabes
- 🇿🇦 África do Sul
- E todos os outros países não listados acima

---

## 🔍 DETECÇÃO DE PAÍS

### Prioridade de Detecção:

1. **IP Country Code** (mais confiável)
   - Header: `x-vercel-ip-country` (Vercel)
   - Header: `cf-ipcountry` (Cloudflare)
   - Header: `x-country-code` (custom)
   - Header: `x-geoip-country-code` (GeoIP)

2. **Accept-Language**
   - `pt-BR` → Conta BR
   - `es-*` → Conta BR (Espanhol)
   - `pt-PT` → Conta US (Portugal)
   - Outros → Conta US

3. **Timezone**
   - Timezones da América Latina → Conta BR
   - Outros → Conta US

4. **Padrão**
   - Se não conseguir detectar → Conta US (mais internacional)

---

## 💰 MOEDAS E LOCALE

### Conta BR:
- **Moeda**: BRL (Real Brasileiro)
- **Locale**: `pt-BR` (Brasil) ou `es` (outros países latinos)

### Conta US:
- **Moeda**: USD (Dólar Americano)
- **Locale**: `en` (Inglês)

**Nota**: O Stripe converte automaticamente valores para a moeda local do cartão do usuário.

---

## 📝 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE

### Conta Stripe BR:
```env
STRIPE_SECRET_KEY_BR=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR=pk_test_...
STRIPE_WEBHOOK_SECRET_BR=whsec_...
STRIPE_CONNECT_CLIENT_ID_BR=ca_...

# Price IDs Wellness BR
STRIPE_PRICE_WELLNESS_MONTHLY_BR=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_BR=price_...
```

### Conta Stripe US:
```env
STRIPE_SECRET_KEY_US=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US=pk_test_...
STRIPE_WEBHOOK_SECRET_US=whsec_...
STRIPE_CONNECT_CLIENT_ID_US=ca_...

# Price IDs Wellness US
STRIPE_PRICE_WELLNESS_MONTHLY_US=price_...
STRIPE_PRICE_WELLNESS_ANNUAL_US=price_...
```

---

## 🔄 FLUXO DE CHECKOUT

1. **Usuário acessa checkout**
   - Sistema detecta país automaticamente

2. **Escolha da conta Stripe**
   - América Latina → Conta BR
   - Outros → Conta US

3. **Criação da sessão**
   - Usa Price ID da conta correta
   - Configura moeda e locale apropriados

4. **Redirecionamento**
   - Stripe mostra checkout na moeda/localização correta

5. **Webhook**
   - Webhook BR ou US processa pagamento
   - Assinatura criada no banco com `stripe_account` correto

---

## 📊 BANCO DE DADOS

A tabela `subscriptions` armazena:
- `stripe_account`: 'br' ou 'us'
- `currency`: 'brl' ou 'usd'
- `stripe_subscription_id`: ID único da assinatura no Stripe

---

## 🧪 TESTANDO

### Testar com país específico:
```bash
# Simular país BR
curl -H "x-vercel-ip-country: BR" https://ylada.app/api/wellness/checkout

# Simular país US
curl -H "x-vercel-ip-country: US" https://ylada.app/api/wellness/checkout

# Simular país MX (México - deve usar BR)
curl -H "x-vercel-ip-country: MX" https://ylada.app/api/wellness/checkout
```

---

## ✅ VANTAGENS DESTA ESTRATÉGIA

1. ✅ **Automático**: Detecta país sem intervenção do usuário
2. ✅ **Flexível**: Fácil adicionar novos países
3. ✅ **Escalável**: Suporta qualquer país do mundo
4. ✅ **Otimizado**: Usa conta Stripe mais apropriada para cada região
5. ✅ **Transparente**: Usuário vê preços na moeda/localização correta

---

## 🔮 EXPANSÃO FUTURA

Para adicionar mais países à conta BR:
1. Adicionar código do país em `BR_ACCOUNT_COUNTRIES` em `src/lib/stripe-helpers.ts`
2. Criar produtos/Price IDs na conta Stripe BR
3. Configurar variáveis de ambiente

Para criar contas Stripe adicionais (ex: EU, ASIA):
1. Adicionar novo tipo em `StripeAccount`
2. Criar função de mapeamento de países
3. Adicionar variáveis de ambiente
4. Atualizar lógica de detecção

