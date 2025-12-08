# 🔔 Como Configurar Notificações Push (Web Push API)

## 📋 Pré-requisitos

1. **Node.js instalado**
2. **Acesso ao Supabase** (para executar migração)
3. **Acesso ao Vercel** (para configurar variáveis de ambiente)

---

## 🚀 Passo a Passo

### 1. Instalar Dependência

```bash
npm install web-push
```

---

### 2. Gerar VAPID Keys

Execute o script para gerar as chaves:

```bash
node scripts/generate-vapid-keys.js
```

Isso vai gerar duas chaves:
- **Public Key** (pode ser exposta no frontend)
- **Private Key** (deve ser mantida SECRETA)

---

### 3. Executar Migração SQL

Execute no Supabase SQL Editor:

```sql
-- Arquivo: migrations/018-criar-tabela-push-subscriptions.sql
```

Isso cria a tabela `push_subscriptions` para armazenar as subscriptions dos usuários.

---

### 4. Configurar Variáveis de Ambiente

#### No `.env.local` (desenvolvimento):

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=sua-chave-publica-aqui
VAPID_PRIVATE_KEY=sua-chave-privada-aqui
VAPID_SUBJECT=mailto:admin@ylada.com
```

#### No Vercel (produção):

1. Acesse: **Settings → Environment Variables**
2. Adicione as 3 variáveis acima
3. **Importante:** `NEXT_PUBLIC_VAPID_PUBLIC_KEY` deve ter o prefixo `NEXT_PUBLIC_` para funcionar no frontend

---

### 5. Testar Localmente

1. Inicie o servidor: `npm run dev`
2. Acesse: `/pt/wellness/configuracao`
3. Na seção "Notificações Push", clique em "Ativar Notificações"
4. Permita notificações no navegador
5. Verifique se aparece "Notificações ativadas"

---

### 6. Enviar Notificação de Teste (Admin)

Como admin, você pode enviar notificações via API:

```bash
curl -X POST https://seu-dominio.com/api/push/send \
  -H "Content-Type: application/json" \
  -H "Cookie: seu-cookie-de-sessao" \
  -d '{
    "user_ids": "all",
    "title": "Teste de Notificação",
    "body": "Esta é uma notificação de teste!",
    "url": "/pt/wellness/home"
  }'
```

Ou crie uma página admin para enviar notificações.

---

## 📱 Como Funciona para o Usuário

1. **Usuário adiciona app à tela inicial** (PWA)
2. **Acessa Configurações** → Vê seção "Notificações Push"
3. **Clica em "Ativar Notificações"**
4. **Navegador pede permissão** → Usuário permite
5. **Subscription é salva** no banco de dados
6. **Quando você envia comunicado** → Usuário recebe notificação mesmo com app fechado

---

## 🔧 Troubleshooting

### Erro: "web-push não instalado"
```bash
npm install web-push
```

### Erro: "VAPID keys não configuradas"
- Verifique se as variáveis estão no `.env.local` e Vercel
- Certifique-se que `NEXT_PUBLIC_VAPID_PUBLIC_KEY` tem o prefixo correto

### Erro: "Service Worker não registrado"
- Verifique se o arquivo `/public/sw.js` existe
- Abra DevTools → Application → Service Workers
- Verifique se está registrado

### Notificações não chegam
- Verifique se o usuário permitiu notificações
- Verifique se a subscription está salva no banco (`push_subscriptions`)
- Verifique logs do servidor ao enviar

---

## 📊 Estrutura Criada

### Arquivos:
- ✅ `public/sw.js` - Service Worker
- ✅ `src/lib/push-notifications.ts` - Utilitários
- ✅ `src/components/push/PushNotificationManager.tsx` - Componente React
- ✅ `src/app/api/push/subscribe/route.ts` - API para salvar subscriptions
- ✅ `src/app/api/push/send/route.ts` - API para enviar notificações
- ✅ `migrations/018-criar-tabela-push-subscriptions.sql` - Migração SQL
- ✅ `scripts/generate-vapid-keys.js` - Script para gerar keys

### Tabela no Banco:
- `push_subscriptions` - Armazena subscriptions dos usuários

---

## 🎯 Próximos Passos

1. ✅ Instalar `web-push`
2. ✅ Gerar VAPID keys
3. ✅ Executar migração SQL
4. ✅ Configurar variáveis de ambiente
5. ✅ Testar localmente
6. ⏳ Criar interface admin para enviar notificações
7. ⏳ Integrar com sistema de comunicados existente

---

## 💡 Dicas

- **Teste sempre em HTTPS** (push notifications não funcionam em HTTP local, exceto localhost)
- **VAPID keys são únicas** - não compartilhe entre projetos
- **Subscriptions expiram** - sistema marca como inativas automaticamente quando inválidas
- **Funciona em todos navegadores modernos** (Chrome, Firefox, Safari, Edge)

---

## ✅ Pronto!

Agora você pode enviar notificações push para usuários que adicionaram o app à tela inicial! 🎉
