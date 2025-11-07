# 🌐 CONFIGURAR DOMÍNIO PRÓPRIO NO CHECKOUT STRIPE

## 🎯 POR QUE É IMPORTANTE?

### ✅ Benefícios:

1. **Maior Confiança:**
   - Cliente vê `checkout.ylada.app` em vez de `checkout.stripe.com`
   - Aumenta percepção de profissionalismo
   - Reduz abandono de carrinho

2. **Melhor Branding:**
   - Sua marca aparece na URL
   - Experiência mais coesa com seu site
   - Cliente não sente que está "saindo" do seu domínio

3. **Maior Conversão:**
   - Estudos mostram aumento de 5-15% na conversão
   - Cliente se sente mais seguro
   - Reduz fricção no processo de pagamento

4. **SEO e Marketing:**
   - Links compartilháveis com seu domínio
   - Melhor para campanhas de marketing
   - URLs mais limpas e profissionais

---

## 🔧 COMO CONFIGURAR

### Passo 1: Acessar Configurações

1. **Acesse:** Stripe Dashboard → Settings → Branding
2. **Role até:** "Custom domain for Checkout"
3. **Clique em:** "Set up custom domain"

### Passo 2: Escolher Domínio

**Opções recomendadas:**
- `checkout.ylada.app` (recomendado)
- `pay.ylada.app`
- `pagamento.ylada.app`

**Recomendação:** Use `checkout.ylada.app` (mais comum e reconhecível)

### Passo 3: Configurar DNS

O Stripe vai pedir para você adicionar um registro CNAME no seu DNS:

**Registro DNS necessário:**
```
Tipo: CNAME
Nome: checkout (ou o subdomínio que escolher)
Valor: checkout.stripe.com
TTL: 3600 (ou padrão)
```

**Exemplo para `checkout.ylada.app`:**
```
Tipo: CNAME
Nome: checkout
Valor: checkout.stripe.com
```

### Passo 4: Verificar no Stripe

1. Após adicionar o CNAME, volte ao Stripe
2. Clique em "Verify domain"
3. Aguarde alguns minutos (pode levar até 24h)
4. ✅ Quando verificar, o domínio estará ativo

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### Antes de Começar:

- [ ] Ter acesso ao painel DNS do seu domínio (ylada.app)
- [ ] Decidir qual subdomínio usar (recomendado: `checkout`)
- [ ] Verificar se o subdomínio já existe (não deve existir)

### Durante a Configuração:

- [ ] Acessar Stripe Dashboard → Settings → Branding
- [ ] Clicar em "Set up custom domain"
- [ ] Inserir o subdomínio escolhido
- [ ] Adicionar registro CNAME no DNS
- [ ] Verificar domínio no Stripe
- [ ] Aguardar verificação (pode levar algumas horas)

### Após Configurar:

- [ ] Testar checkout com domínio customizado
- [ ] Verificar se aparece `checkout.ylada.app` na URL
- [ ] Testar em diferentes navegadores
- [ ] Verificar se SSL está funcionando (HTTPS)
- [ ] Atualizar links de checkout no código (se necessário)

---

## ⚠️ IMPORTANTE

### Limitações:

1. **Apenas um domínio por conta Stripe:**
   - Se tiver conta BR e US, precisa configurar em ambas
   - Cada conta pode ter seu próprio domínio

2. **Subdomínio obrigatório:**
   - Não pode usar o domínio raiz (`ylada.app`)
   - Precisa ser subdomínio (`checkout.ylada.app`)

3. **SSL automático:**
   - Stripe fornece SSL automaticamente
   - Não precisa configurar certificado separado

4. **Tempo de propagação:**
   - DNS pode levar até 24h para propagar
   - Normalmente funciona em 1-2 horas

---

## 🔄 CONFIGURAR PARA MÚLTIPLAS CONTAS

Se você tem conta Stripe Brasil e Stripe EUA:

### Conta Brasil:
- Domínio: `checkout.ylada.app` (ou `checkout-br.ylada.app`)
- Configurar CNAME apontando para `checkout.stripe.com`

### Conta EUA:
- Domínio: `checkout-us.ylada.app` (ou usar mesmo domínio se possível)
- Configurar CNAME apontando para `checkout.stripe.com`

**Nota:** O Stripe pode permitir o mesmo domínio em contas diferentes, mas verifique nas configurações.

---

## 💡 DICAS

1. **Use subdomínio curto:**
   - `checkout.ylada.app` é melhor que `pagamento-checkout.ylada.app`
   - Mais fácil de digitar e lembrar

2. **Teste antes de usar:**
   - Configure em modo Test primeiro
   - Teste o checkout completo
   - Depois ative em produção

3. **Monitore conversão:**
   - Compare taxa de conversão antes e depois
   - Domínio customizado geralmente aumenta conversão

4. **Mantenha backup:**
   - Se o domínio customizado tiver problemas
   - Stripe sempre mantém `checkout.stripe.com` funcionando
   - Você pode desativar o custom domain a qualquer momento

---

## 📊 IMPACTO ESPERADO

### Métricas que podem melhorar:

- **Taxa de conversão:** +5% a +15%
- **Confiança do cliente:** Aumento significativo
- **Abandono de carrinho:** Redução de 3-8%
- **Tempo no checkout:** Pode aumentar (cliente mais confiante)

---

## 🚨 TROUBLESHOOTING

### Domínio não verifica:

1. **Verificar DNS:**
   - Use ferramenta como `dig` ou `nslookup`
   - Confirme que CNAME está apontando corretamente
   - Aguarde propagação (pode levar até 24h)

2. **Verificar no Stripe:**
   - Veja se há mensagens de erro
   - Verifique se o domínio está correto
   - Tente verificar novamente após algumas horas

3. **Contatar suporte:**
   - Se após 24h ainda não funcionar
   - Contate suporte do Stripe
   - Eles podem ajudar a diagnosticar

### SSL não funciona:

- Stripe fornece SSL automaticamente
- Se não funcionar, aguarde algumas horas
- Pode ser cache do navegador (limpar cache)

---

## ✅ RESUMO

**É importante configurar?** SIM! 

**Por quê?**
- Aumenta confiança
- Melhora branding
- Aumenta conversão
- É gratuito e fácil de configurar

**Tempo estimado:** 15-30 minutos (mais tempo de espera para DNS)

**Dificuldade:** Fácil (apenas adicionar CNAME no DNS)

---

**Última atualização:** {{ data atual }}

**Próximos passos:** Configurar o domínio e testar checkout

