# 📱 GUIA RÁPIDO: Testar no Celular

## ⚡ MÉTODO MAIS RÁPIDO (2 minutos)

### 1️⃣ Abrir DevTools no Navegador

1. Abra `http://localhost:3000` no Chrome/Edge
2. Pressione **`F12`** (ou **`Cmd+Option+I`** no Mac)
3. Pressione **`Cmd+Shift+M`** (ou clique no ícone de celular)
4. Escolha **"iPhone 12 Pro"** ou **"Responsive"**
5. **Pronto!** Teste a responsividade

---

## 🎯 MÉTODO MAIS REALISTA (5 minutos)

### 1️⃣ Descobrir IP do Computador

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
# Procure por "IPv4 Address"
```

### 2️⃣ Iniciar Servidor para Mobile

```bash
npm run dev:mobile
```

### 3️⃣ Acessar no Celular

1. **Conecte o celular na mesma WiFi** do computador
2. **Abra o navegador** no celular
3. **Digite**: `http://SEU_IP:3000`

Exemplo: `http://192.168.1.100:3000`

---

## 🚀 MÉTODO MAIS SEGURO (Preview Vercel)

### 1️⃣ Criar Branch de Teste

```bash
git checkout -b teste-mobile
git add .
git commit -m "teste: ajustes mobile"
git push origin teste-mobile
```

### 2️⃣ Acessar Preview

1. Vá em: https://vercel.com/dashboard
2. Clique no seu projeto
3. Vá em **"Deployments"**
4. Clique no link do preview da branch `teste-mobile`
5. **Copie o link** e abra no celular

---

## ✅ Qual Método Usar?

- **Desenvolvimento rápido**: DevTools (F12)
- **Teste realista**: IP local (`npm run dev:mobile`)
- **Teste de produção**: Preview Vercel

---

## 🔧 Problemas?

**Não consegue acessar pelo IP?**
- Verifique se está na mesma WiFi
- Desative o firewall temporariamente
- Use o método DevTools (F12) que sempre funciona

**Quer mais detalhes?**
Veja: `docs/COMO-TESTAR-NO-CELULAR.md`





