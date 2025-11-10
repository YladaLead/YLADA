# 🔧 TROUBLESHOOTING: PIX NÃO ESTÁ CRIANDO PAGAMENTO

## ❌ Problema

A página do PIX no Mercado Pago mostra a opção PIX, mas não permite criar o pagamento (gerar QR Code).

---

## ✅ SOLUÇÕES (Verificar nesta ordem)

### **1. Chave PIX não configurada na conta** ⚠️ CRÍTICO

**Este é o problema mais comum!**

O Mercado Pago precisa de uma **chave PIX cadastrada** na conta para gerar QR Codes.

#### Como verificar:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Seu Negócio"** → **"Configurações"** → **"Chaves Pix"**
3. Verifique se há uma chave PIX cadastrada

#### Como cadastrar chave PIX:

1. No painel do Mercado Pago
2. Vá em **"Seu Negócio"** → **"Configurações"** → **"Chaves Pix"**
3. Clique em **"Cadastrar chave Pix"**
4. Escolha o tipo de chave:
   - **CPF/CNPJ** (recomendado para empresas)
   - **E-mail**
   - **Telefone**
   - **Chave aleatória**
5. Siga o processo de cadastro
6. **Aguarde a validação** (pode levar alguns minutos)

**⚠️ IMPORTANTE:** A chave PIX deve estar na **mesma conta** onde as credenciais (Access Token) foram geradas!

---

### **2. Dados da conta não validados**

O Mercado Pago pode bloquear PIX se os dados da conta não estiverem completos ou validados.

#### Como verificar:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Seu Negócio"** → **"Meus dados"**
3. Verifique se todos os campos estão preenchidos:
   - Nome completo
   - CPF/CNPJ
   - Endereço
   - Telefone
   - E-mail verificado

#### Como validar:

1. Complete todos os dados pendentes
2. Aguarde a validação do Mercado Pago
3. Verifique se recebeu e-mail de confirmação

---

### **3. PIX não habilitado nas configurações**

Mesmo com chave PIX cadastrada, é necessário habilitar PIX como forma de pagamento.

#### Como verificar e habilitar:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Seu Negócio"** → **"Configurações"** → **"Formas de pagamento"**
3. Procure por **"Pix"** na lista
4. Se estiver desabilitado, **habilite**
5. Salve as alterações

---

### **4. Modo Sandbox (Teste) - Limitações**

No ambiente de **sandbox/teste**, o PIX pode ter limitações ou não funcionar completamente.

#### Soluções:

1. **Testar com credenciais de PRODUÇÃO** (se disponível)
2. **Usar valores pequenos** para testar em produção
3. **Aguardar** - às vezes o sandbox tem problemas temporários

---

### **5. Verificar logs do servidor**

Se o problema persistir, verifique os logs do servidor para ver se há erros na criação da preferência.

#### No Vercel:

1. Acesse: https://vercel.com/seu-projeto
2. Vá em **Deployments** → Último deploy
3. Clique em **Functions** → `/api/wellness/checkout`
4. Procure por erros relacionados a PIX ou `payment_methods`

#### Erros comuns:

- `PIX not enabled` - PIX não está habilitado na conta
- `Invalid payment method` - Método de pagamento inválido
- `Account not validated` - Conta não validada

---

## 🔍 VERIFICAÇÃO RÁPIDA

### Checklist:

- [ ] Chave PIX cadastrada na conta do Mercado Pago
- [ ] Chave PIX na mesma conta das credenciais (Access Token)
- [ ] Dados da conta completos e validados
- [ ] PIX habilitado em "Formas de pagamento"
- [ ] Testando com credenciais de produção (se possível)
- [ ] Sem erros nos logs do servidor

---

## 📞 CONTATO COM SUPORTE

Se nenhuma das soluções acima funcionar:

1. Entre em contato com o suporte do Mercado Pago
2. Informe que o PIX não está gerando QR Code
3. Mencione que:
   - A chave PIX está cadastrada (ou não)
   - Os dados da conta estão validados (ou não)
   - Está usando Checkout Pro via API
   - O erro ocorre na tela de revisão do pagamento

---

## 🧪 TESTE APÓS CORREÇÃO

Após corrigir o problema:

1. Acesse `/pt/wellness/checkout`
2. Selecione "Plano Mensal" ou "Plano Anual"
3. Clique em "Continuar para Pagamento"
4. No Mercado Pago, selecione **"Pix"**
5. Deve aparecer o **QR Code** para pagamento
6. O QR Code deve ser escaneável

---

**Última atualização:** Janeiro 2025

