# 🔄 Como Funciona a Sincronização de Perfil

## 📋 Visão Geral

Quando um usuário edita seu perfil na área Wellness, **todos os dados são salvos automaticamente no Supabase** na tabela `user_profiles`. A sincronização é **instantânea e automática**.

---

## 🔄 Fluxo Completo

### 1️⃣ **Usuário Edita o Perfil**

**Página:** `/pt/wellness/configuracao`

**Campos que podem ser editados:**
- ✅ **Nome Completo** → Salvo em `nome_completo`
- ✅ **Email** → Salvo em `email`
- ✅ **Telefone/WhatsApp** → Salvo em `whatsapp`
- ✅ **Código do País** → Salvo em `country_code` (ex: 'BR', 'US', 'PT')
- ✅ **Bio** → Salvo em `bio`
- ✅ **Slug para URL** → Salvo em `user_slug` (ex: 'joao-silva')

### 2️⃣ **Ao Clicar em "Salvar Alterações"**

O frontend chama a API:

```typescript
PUT /api/wellness/profile
```

**Dados enviados:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "whatsapp": "5511999999999",
  "countryCode": "BR",
  "bio": "Minha biografia...",
  "userSlug": "joao-silva"
}
```

### 3️⃣ **API Processa e Salva no Supabase**

**Arquivo:** `src/app/api/wellness/profile/route.ts`

**O que acontece:**
1. ✅ Valida autenticação do usuário
2. ✅ Verifica se o `user_slug` está disponível
3. ✅ Prepara os dados para salvar
4. ✅ **Salva no Supabase usando UPSERT** (atualiza se existe, cria se não existe)
5. ✅ Garante que `whatsapp` seja salvo corretamente
6. ✅ Atualiza `updated_at` automaticamente

**Tabela no Supabase:** `user_profiles`

**Colunas atualizadas:**
- `nome_completo` ← `nome`
- `email` ← `email`
- `whatsapp` ← `whatsapp` ou `telefone`
- `country_code` ← `countryCode`
- `bio` ← `bio`
- `user_slug` ← `userSlug`
- `updated_at` ← Data/hora atual

### 4️⃣ **Confirmação de Sucesso**

O usuário vê uma mensagem:
> ✅ **Perfil salvo com sucesso!**

Os dados já estão no Supabase! 🎉

---

## 🔍 Como Verificar no Supabase

### Ver Dados de um Usuário Específico

```sql
SELECT 
  email,
  nome_completo,
  whatsapp,
  country_code,
  bio,
  user_slug,
  updated_at
FROM user_profiles
WHERE email = 'naytenutri@gmail.com';
```

### Ver Todos os Perfis Wellness

```sql
SELECT 
  email,
  nome_completo,
  whatsapp,
  country_code,
  bio,
  user_slug,
  updated_at
FROM user_profiles
WHERE perfil = 'wellness'
ORDER BY updated_at DESC;
```

### Ver Últimas Atualizações

```sql
SELECT 
  email,
  nome_completo,
  whatsapp,
  updated_at
FROM user_profiles
WHERE perfil = 'wellness'
  AND updated_at >= NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;
```

---

## ✅ Garantias do Sistema

### 1. **Sincronização Automática**
- ✅ Não precisa fazer nada manual
- ✅ Dados salvos instantaneamente
- ✅ Sem necessidade de "sincronizar" depois

### 2. **Proteção contra Perda de Dados**
- ✅ Usa **UPSERT** (atualiza se existe, cria se não existe)
- ✅ Se der erro, tenta salvamento básico
- ✅ Se ainda der erro, tenta UPDATE/INSERT manual
- ✅ Logs detalhados para debug

### 3. **Validação de Dados**
- ✅ Nome completo obrigatório
- ✅ Slug obrigatório e único
- ✅ Validação de formato de telefone
- ✅ Validação de disponibilidade do slug

### 4. **Suporte a Múltiplos Países**
- ✅ `country_code` salvo automaticamente
- ✅ Formatação de telefone por país
- ✅ Exemplo: BR → +55, US → +1, PT → +351

---

## 🐛 Troubleshooting

### Problema: Dados não aparecem no Supabase

**Verificar:**
1. ✅ Usuário clicou em "Salvar Alterações"?
2. ✅ Apareceu mensagem de sucesso?
3. ✅ Verificar console do navegador (F12) para erros
4. ✅ Verificar logs do Vercel (se em produção)

**Solução:**
- Pedir para o usuário tentar salvar novamente
- Verificar se há erros no console
- Verificar se `whatsapp` está sendo enviado corretamente

### Problema: WhatsApp não está sendo salvo

**Causa comum:**
- Campo `whatsapp` vazio ou NULL
- Formato incorreto do número

**Solução:**
- Verificar se o usuário preencheu o telefone
- Verificar se o `country_code` está correto
- Verificar logs da API para ver o que está sendo recebido

---

## 📊 Estrutura da Tabela `user_profiles`

### Colunas Principais (Wellness)

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| `user_id` | UUID | ID do usuário (chave única) | `123e4567-e89b-12d3-a456-426614174000` |
| `nome_completo` | VARCHAR(255) | Nome completo | `Nayara Fernandes` |
| `email` | VARCHAR(255) | Email do usuário | `naytenutri@gmail.com` |
| `whatsapp` | VARCHAR(50) | Número de WhatsApp | `5511999999999` |
| `country_code` | VARCHAR(10) | Código do país | `BR`, `US`, `PT` |
| `bio` | TEXT | Biografia | `Nutricionista especializada...` |
| `user_slug` | VARCHAR(255) | Slug para URL | `nayara-fernandes` |
| `perfil` | VARCHAR(50) | Área do usuário | `wellness` |
| `updated_at` | TIMESTAMP | Data da última atualização | `2025-01-15 10:30:00` |

---

## 🎯 Resumo

✅ **Sincronização é AUTOMÁTICA e INSTANTÂNEA**

✅ **Todos os campos editados são salvos no Supabase**

✅ **Não precisa fazer nada manual**

✅ **Dados ficam disponíveis imediatamente no Supabase**

✅ **Sistema tem múltiplas camadas de proteção contra erros**

---

## 📝 Notas Importantes

1. **`whatsapp` vs `telefone`:**
   - O frontend envia ambos (`telefone` e `whatsapp`)
   - A API salva apenas `whatsapp` no banco
   - Se `whatsapp` estiver vazio, usa `telefone` como fallback

2. **`country_code`:**
   - É salvo automaticamente quando o usuário seleciona o país
   - Usado para formatação do telefone
   - Importante para usuários de outros países

3. **`user_slug`:**
   - Deve ser único
   - É normalizado automaticamente (remove acentos, espaços, etc.)
   - Usado nas URLs personalizadas: `ylada.com/wellness/{user_slug}/...`

4. **`updated_at`:**
   - Atualizado automaticamente toda vez que o perfil é salvo
   - Útil para saber quando foi a última alteração

---

## 🔗 Arquivos Relacionados

- **Frontend:** `src/app/pt/wellness/configuracao/page.tsx`
- **API:** `src/app/api/wellness/profile/route.ts`
- **Tabela:** `user_profiles` no Supabase
- **Documentação:** `docs/ACESSO-DADOS-PERFIL-SUPABASE.md`

