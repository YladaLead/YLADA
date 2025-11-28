# 🔧 Corrigir Imagens OG no WhatsApp

## ❌ PROBLEMA

Quando compartilha links no WhatsApp, está aparecendo o logo do YLADA ao invés das imagens específicas das ferramentas (Nutri e Coach).

---

## ✅ CORREÇÕES APLICADAS

### **1. Domínio Corrigido**
- Alterado de `https://www.ylada.com` para `https://ylada.app`
- URLs das imagens agora usam domínio correto

### **2. URLs Absolutas Garantidas**
- Todas as URLs de imagens OG agora são absolutas (com `http://` ou `https://`)
- Sistema verifica e corrige automaticamente se URL não for absoluta

### **3. Área Específica**
- Nutri: usa imagens de `/images/og/nutri/`
- Coach: usa imagens de `/images/og/coach/`
- Wellness: usa imagens de `/images/og/wellness/`

---

## 🔍 COMO VERIFICAR

### **1. Verificar URL da Imagem**

Acesse a página da ferramenta e veja o código fonte (Ctrl+U ou Cmd+U):

```html
<meta property="og:image" content="https://ylada.app/images/og/nutri/calc-imc.jpg" />
```

**Deve mostrar:**
- ✅ URL absoluta (começa com `https://`)
- ✅ Domínio correto (`ylada.app`)
- ✅ Caminho correto (`/images/og/nutri/` ou `/images/og/coach/`)
- ✅ Nome do arquivo correto (ex: `calc-imc.jpg`)

---

### **2. Testar URL da Imagem Diretamente**

Abra no navegador:
```
https://ylada.app/images/og/nutri/calc-imc.jpg
```

**Deve:**
- ✅ Carregar a imagem
- ✅ Não dar erro 404
- ✅ Mostrar a imagem correta (não o logo padrão)

---

### **3. Limpar Cache do WhatsApp**

O WhatsApp **cacha as imagens OG** por até 7 dias. Para ver as novas imagens:

**Opção 1: Usar Debugger do Facebook**
1. Acesse: https://developers.facebook.com/tools/debug/
2. Cole a URL da ferramenta
3. Clique em **"Scrape Again"** (Raspar Novamente)
4. Isso força o WhatsApp a buscar a imagem novamente

**Opção 2: Adicionar Parâmetro na URL**
1. Adicione `?v=2` no final da URL ao compartilhar
2. Exemplo: `https://ylada.app/pt/nutri/usuario/ferramenta?v=2`
3. Isso faz o WhatsApp tratar como URL nova

**Opção 3: Aguardar**
- Cache do WhatsApp expira em até 7 dias
- Após isso, as novas imagens aparecerão automaticamente

---

## 🐛 DEBUG

### **Ver Logs no Console**

Os logs mostram:
- `[OG Metadata] Image URL (Nutri):` - URL da imagem sendo usada
- `[OG Metadata] Image URL (Coach):` - URL da imagem sendo usada

Verifique se:
- ✅ `baseUrl` está correto (`https://ylada.app`)
- ✅ `absoluteImageUrl` começa com `https://`
- ✅ `imagePath` está correto (`/images/og/nutri/...`)

---

## 📋 CHECKLIST

- [ ] Domínio correto: `https://ylada.app` (não `www.ylada.com`)
- [ ] URLs absolutas (começam com `https://`)
- [ ] Imagens existem nas pastas (`/images/og/nutri/` e `/images/og/coach/`)
- [ ] Nomes dos arquivos estão corretos (ex: `calc-imc.jpg`)
- [ ] Cache do WhatsApp limpo (usar Facebook Debugger)

---

## 🚀 PRÓXIMOS PASSOS

1. **Fazer deploy** das correções
2. **Testar URL** diretamente no navegador
3. **Limpar cache** usando Facebook Debugger
4. **Compartilhar novamente** no WhatsApp
5. **Verificar** se imagem aparece correta

---

## ⚠️ IMPORTANTE

- **WhatsApp cacheia por até 7 dias**
- **Use Facebook Debugger** para forçar atualização
- **URLs devem ser absolutas** (com `https://`)
- **Domínio deve ser `ylada.app`** (não `www.ylada.com`)

