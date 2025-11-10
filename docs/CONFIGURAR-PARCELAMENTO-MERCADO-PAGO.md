# 💳 CONFIGURAR PARCELAMENTO NO MERCADO PAGO

## 🎯 PROBLEMA

O plano anual está configurado como **pagamento único** (Preference), mas o parcelamento não está aparecendo no checkout.

## ✅ SOLUÇÃO

O parcelamento no Mercado Pago precisa ser **configurado no painel do vendedor**, não apenas via API.

---

## 📋 PASSO A PASSO

### 1. Acessar Configurações do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/
2. Faça login na sua conta
3. Vá em **"Seu Negócio"** (menu lateral)
4. Clique em **"Custos"** ou **"Configurações"**

### 2. Configurar Parcelamento

1. Procure por **"Checkout"** ou **"Formas de pagamento"**
2. Clique em **"Configurar parcelamento"** ou **"Parcelamento"**
3. Você verá opções como:
   - **"Oferecer parcelado vendedor"** (parcelamento sem juros)
   - **"Número máximo de parcelas"**
   - **"Parcelamento com juros"**

### 3. Habilitar Parcelamento

**Opção A: Parcelamento sem juros (recomendado para começar)**
- ✅ Habilite **"Oferecer parcelado vendedor"**
- Defina o número máximo de parcelas (ex: 12x)
- ⚠️ **Atenção:** As taxas serão descontadas do valor recebido

**Opção B: Parcelamento com juros**
- Habilite **"Parcelamento com juros"**
- O cliente paga os juros, você recebe o valor integral
- Mais atraente para o cliente

### 4. Salvar Configurações

- Clique em **"Salvar"** ou **"Aplicar"**
- As alterações podem levar alguns minutos para entrar em vigor

---

## 🔍 VERIFICAÇÃO

### Como verificar se está funcionando:

1. **Criar um checkout** para o plano anual
2. **Escolher "Cartão de crédito"** no checkout do Mercado Pago
3. **Verificar se aparecem opções de parcelamento** (ex: 1x, 2x, 3x, até 12x)

### Se ainda não aparecer:

1. **Verificar se está em modo TESTE:**
   - No sandbox, algumas opções podem não aparecer
   - Teste com credenciais de PRODUÇÃO (se disponível)

2. **Verificar valor mínimo:**
   - O Mercado Pago geralmente exige valor mínimo para parcelamento
   - R$ 574,80 deve ser suficiente para parcelamento

3. **Verificar tipo de cartão:**
   - Parcelamento geralmente funciona apenas com cartões de crédito
   - Cartões de débito não oferecem parcelamento

---

## 📝 NOTAS IMPORTANTES

### Sobre o Código:

- ✅ O código está correto (usando Preference para plano anual)
- ✅ O código não precisa de configuração adicional de `installments`
- ⚠️ O parcelamento é controlado pelo **painel do Mercado Pago**, não pela API

### Limitações:

- **Checkout Pro (Preference):** Parcelamento é controlado pelo painel
- **Checkout Transparente:** Permite mais controle via API, mas é mais complexo
- **Preapproval (Assinaturas):** Não oferece parcelamento (é cobrança recorrente)

---

## 🎯 RESUMO

| Item | Status |
|------|--------|
| **Código** | ✅ Correto (Preference para plano anual) |
| **Configuração no Painel** | ⚠️ **PRECISA SER FEITA** |
| **Parcelamento via API** | ❌ Não disponível no Checkout Pro |
| **Parcelamento no Painel** | ✅ Disponível e necessário |

---

## 📚 REFERÊNCIAS

- [Documentação Mercado Pago - Parcelamento](https://www.mercadopago.com.br/developers/pt/docs)
- [Como configurar parcelamento sem juros](https://www.youtube.com/watch?v=RgAeE7QEY2M)

---

**Última atualização:** Janeiro 2025

