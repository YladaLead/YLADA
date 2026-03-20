# 🔒 Como Resolver o Aviso "Site Não Seguro" (SSL/HTTPS)

## ❌ Problema

O navegador mostra um aviso vermelho de "Site não seguro" ao acessar `www.ylada.com`, indicando que:
- O site está usando HTTP em vez de HTTPS
- OU o certificado SSL não está configurado corretamente
- OU há um problema com o certificado SSL

---

## ✅ Solução: Configurar SSL no Vercel

O Vercel fornece certificados SSL automaticamente para todos os domínios. Se você está vendo o aviso, siga estes passos:

### **Passo 1: Verificar Domínio na Vercel**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **YLADA**
3. Vá em **Settings** → **Domains**

### **Passo 2: Verificar se o Domínio Está Configurado**

Você deve ver `www.ylada.com` (e possivelmente `ylada.com`) na lista de domínios.

**Se o domínio NÃO estiver na lista:**

1. Clique em **"Add Domain"**
2. Digite: `www.ylada.com`
3. Clique em **"Add"**
4. Siga as instruções para configurar DNS

### **Passo 3: Configurar DNS (se necessário)**

O Vercel vai pedir para você adicionar registros DNS no seu provedor de domínio:

**Registros DNS necessários:**

```
Tipo: A
Nome: @ (ou deixe em branco para o domínio raiz)
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

**OU (se o Vercel fornecer valores diferentes):**

Use os valores exatos que o Vercel mostrar na tela de configuração.

### **Passo 4: Aguardar Propagação DNS**

- DNS pode levar de 1 hora a 48 horas para propagar
- Geralmente funciona em 1-2 horas
- O Vercel vai mostrar o status: "Pending" → "Valid" ✅

### **Passo 5: Verificar SSL**

Após o DNS propagar:

1. O Vercel vai emitir automaticamente um certificado SSL
2. Aguarde alguns minutos (pode levar até 24h)
3. O status do domínio deve mudar para: **"Valid"** ✅

---

## 🔍 Verificar Status do SSL

### **Opção 1: Verificar no Vercel**

1. Vá em **Settings** → **Domains**
2. Verifique se o domínio mostra: **"Valid"** ✅
3. Se mostrar **"Pending"** ou **"Error"**, veja a mensagem de erro

### **Opção 2: Verificar no Navegador**

1. Acesse: `https://www.ylada.com`
2. Clique no **cadeado** na barra de endereço
3. Deve mostrar: **"Conexão segura"** ou **"Secure"**

### **Opção 3: Usar Ferramenta Online**

Acesse: https://www.ssllabs.com/ssltest/
- Digite: `www.ylada.com`
- Clique em **"Submit"**
- Verifique a nota (deve ser A ou A+)

---

## ⚠️ Problemas Comuns

### **1. Domínio Redirecionando para HTTP**

**Sintoma:** O site abre em `http://` em vez de `https://`

**Solução:**
- Verifique se há redirecionamentos no código que forçam HTTP
- O Vercel deve redirecionar automaticamente HTTP → HTTPS
- Se não estiver redirecionando, verifique as configurações do projeto

### **2. Certificado SSL Expirado**

**Sintoma:** O certificado existe mas está expirado

**Solução:**
- O Vercel renova automaticamente os certificados
- Se estiver expirado, pode ser um problema temporário
- Aguarde algumas horas ou force renovação no Vercel

### **3. Certificado SSL Inválido para Subdomínio**

**Sintoma:** `www.ylada.com` funciona mas `ylada.com` não

**Solução:**
- Adicione ambos os domínios no Vercel:
  - `www.ylada.com`
  - `ylada.com`
- Configure redirecionamento: `ylada.com` → `www.ylada.com` (ou vice-versa)

### **4. DNS Não Propagado**

**Sintoma:** O domínio não resolve ou aponta para lugar errado

**Solução:**
1. Verifique os registros DNS no seu provedor de domínio
2. Use ferramenta para verificar: https://dnschecker.org/
3. Aguarde propagação (pode levar até 48h)

---

## 🔧 Configuração Adicional (Opcional)

### **Forçar HTTPS no Next.js**

Se quiser garantir que todas as requisições usem HTTPS, adicione no `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}
```

**Nota:** O Vercel já faz isso automaticamente, mas essa configuração adiciona headers de segurança extras.

---

## 📋 Checklist de Verificação

- [ ] Domínio `www.ylada.com` está adicionado no Vercel
- [ ] DNS está configurado corretamente
- [ ] Status do domínio no Vercel mostra "Valid" ✅
- [ ] Site abre em `https://www.ylada.com` (não `http://`)
- [ ] Navegador mostra cadeado verde/seguro
- [ ] Não há avisos de "Site não seguro"

---

## 🆘 Se Nada Funcionar

1. **Verifique os logs do Vercel:**
   - Vá em **Deployments** → Último deploy
   - Verifique se há erros relacionados a SSL

2. **Entre em contato com suporte do Vercel:**
   - https://vercel.com/support
   - Explique que o certificado SSL não está sendo emitido

3. **Verifique se há conflitos:**
   - Outros serviços usando o mesmo domínio
   - Configurações de DNS conflitantes
   - Firewall bloqueando conexões SSL

---

**Última atualização:** Março 2026
