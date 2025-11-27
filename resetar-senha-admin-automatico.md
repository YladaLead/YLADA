# 🔐 Resetar Senha Admin - Automático

## ✅ Solução Rápida

Execute este comando no terminal (com o servidor rodando):

```bash
curl -X POST https://www.ylada.com/api/admin/emergency-reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "faulaandre@gmail.com"}'
```

**OU** acesse diretamente no navegador (após deploy):

```
https://www.ylada.com/api/admin/emergency-reset-password
```

(Método POST, use Postman ou similar)

---

## 📋 O que será feito:

1. ✅ Busca o usuário `faulaandre@gmail.com`
2. ✅ Define uma senha temporária segura
3. ✅ Garante que `is_admin = true`
4. ✅ Retorna a senha temporária na resposta da API

---

## 🔑 Credenciais após reset:

- **Email:** `faulaandre@gmail.com`
- **Senha:** Será retornada na resposta da API (não armazenada aqui por segurança)
- **Login:** https://www.ylada.com/admin/login

---

## ⚠️ IMPORTANTE:

Após fazer login, **ALTERE A SENHA** para uma mais segura!

---

## 🚀 Como executar:

### Opção 1: Via Terminal (Local)
```bash
# Com servidor rodando em localhost
curl -X POST http://localhost:3000/api/admin/emergency-reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "faulaandre@gmail.com"}'
```

### Opção 2: Via Terminal (Produção)
```bash
# Após deploy
curl -X POST https://www.ylada.com/api/admin/emergency-reset-password \
  -H "Content-Type: application/json" \
  -d '{"email": "faulaandre@gmail.com"}'
```

### Opção 3: Via Postman/Browser
1. Abra Postman ou similar
2. Método: `POST`
3. URL: `https://www.ylada.com/api/admin/emergency-reset-password`
4. Headers: `Content-Type: application/json`
5. Body (JSON):
```json
{
  "email": "faulaandre@gmail.com"
}
```

---

## 📝 Resposta esperada:

```json
{
  "success": true,
  "message": "Senha resetada com sucesso para faulaandre@gmail.com",
  "email": "faulaandre@gmail.com",
  "password": "[SENHA_TEMPORARIA_GERADA]",
  "loginUrl": "https://www.ylada.com/admin/login",
  "instructions": [
    "1. Acesse: https://www.ylada.com/admin/login",
    "2. Email: faulaandre@gmail.com",
    "3. Senha: [será retornada na resposta da API]",
    "4. Após fazer login, altere a senha para uma mais segura"
  ]
}
```

---

## ✅ Próximos Passos:

1. Execute o comando acima
2. Anote a senha retornada
3. Faça login em: https://www.ylada.com/admin/login
4. **IMPORTANTE:** Altere a senha para uma mais segura após o login

