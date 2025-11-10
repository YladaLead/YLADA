# 💳 CONFIGURAR PARCELAMENTO NO MERCADO PAGO

## 🎯 CONFIGURAÇÃO RECOMENDADA

O plano anual está configurado como **pagamento único** (Preference), que permite parcelamento.

**Configuração correta:** **Parcelado Cliente (com juros)**

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
   - **"Oferecer parcelado vendedor"** (parcelamento sem juros - você absorve taxas)
   - **"Parcelado cliente"** (parcelamento com juros - cliente paga os juros)

### 3. Habilitar Parcelamento Cliente (RECOMENDADO) ✅

**Configuração correta:**
- ✅ **NÃO habilite** "Oferecer parcelado vendedor"
- ✅ **Mantenha** "Parcelado cliente" habilitado (padrão)
- Defina o número máximo de parcelas (ex: 12x)

**Como funciona:**
- Cliente escolhe: **À vista** (R$ 470,72) ou **Parcelado** (12x de R$ 47,90 = R$ 574,80)
- Se escolher parcelado, o **cliente paga os juros**
- Você recebe o valor integral (sem descontar taxas de parcelamento)

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
- ✅ Valores configurados:
  - **À vista:** R$ 470,72
  - **Parcelado:** R$ 574,80 (12x de R$ 47,90)
- ⚠️ O parcelamento é controlado pelo **painel do Mercado Pago**, não pela API

### Diferença entre Parcelado Cliente e Parcelado Vendedor:

**Parcelado Cliente (RECOMENDADO) ✅**
- Cliente paga os juros
- Você recebe o valor integral
- Cliente escolhe: à vista (mais barato) ou parcelado (com juros)

**Parcelado Vendedor (NÃO RECOMENDADO) ❌**
- Você absorve as taxas de parcelamento
- Você recebe menos que o valor cobrado
- Cliente paga sem juros (mas você perde dinheiro)

### Limitações:

- **Checkout Pro (Preference):** Parcelamento é controlado pelo painel
- **Checkout Transparente:** Permite mais controle via API, mas é mais complexo
- **Preapproval (Assinaturas):** Não oferece parcelamento (é cobrança recorrente)

---

## 🎯 RESUMO

| Item | Status |
|------|--------|
| **Código** | ✅ Correto (Preference para plano anual) |
| **Configuração no Painel** | ✅ **Parcelado Cliente (com juros)** |
| **Parcelamento via API** | ❌ Não disponível no Checkout Pro |
| **Parcelamento no Painel** | ✅ Habilitado (Parcelado Cliente) |
| **Valores** | ✅ R$ 470,72 à vista / R$ 574,80 parcelado |

---

## 📚 REFERÊNCIAS

- [Documentação Mercado Pago - Parcelamento](https://www.mercadopago.com.br/developers/pt/docs)
- [Como configurar parcelamento sem juros](https://www.youtube.com/watch?v=RgAeE7QEY2M)

---

**Última atualização:** Janeiro 2025

