# 📹 Migração do Vídeo Wellness para Supabase Storage

Este guia explica como migrar o vídeo `wellness-hero.mp4` do diretório local para o Supabase Storage.

## 🎯 Objetivo

Mover o vídeo de `/public/videos/wellness-hero.mp4` (122MB) para o Supabase Storage para:
- ✅ Melhor performance global (CDN)
- ✅ Não ocupar espaço no Git
- ✅ Escalabilidade
- ✅ Cache otimizado

## 📋 Pré-requisitos

1. **⚠️ AUMENTAR LIMITE GLOBAL DE UPLOAD (OBRIGATÓRIO):**
   - O Supabase tem um limite global padrão de **50MB** para uploads
   - Você **DEVE** aumentar esse limite antes de fazer upload do vídeo (122MB)
   - Passos:
     1. Acesse: **Supabase Dashboard → Storage → Settings** (ícone de engrenagem)
     2. Encontre a seção **"File size upload limit"**
     3. Aumente para **150MB** (ou mais se necessário)
     4. Clique em **"Save"**
   - ⚠️ **Sem isso, o upload falhará mesmo que o bucket tenha limite maior!**

2. **Bucket criado no Supabase:**
   - Execute a migration: `migrations/032-criar-bucket-landing-pages-assets.sql`
   - Ou crie manualmente no Supabase Dashboard:
     - Nome: `landing-pages-assets`
     - Público: ✅ Sim
     - Limite de tamanho: 150MB
     - Tipos MIME permitidos: `video/mp4`, `video/webm`, `image/jpeg`, `image/png`, etc.

3. **Variáveis de ambiente configuradas:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
   ```

## 🚀 Passo a Passo

### 1. ⚠️ AUMENTAR LIMITE GLOBAL DE UPLOAD (FAZER PRIMEIRO!)

**Este é o passo mais importante!** Sem isso, o upload falhará.

1. Acesse: **Supabase Dashboard → Storage**
2. Clique no ícone de **Settings** (engrenagem) no canto superior direito
3. Role até encontrar **"File size upload limit"**
4. Altere de `50 MB` para `150 MB` (ou mais)
5. Clique em **"Save"**

**Por que isso é necessário?**
- O Supabase tem um limite global que se aplica a TODOS os buckets
- Mesmo que o bucket tenha limite de 150MB, o limite global de 50MB bloqueia uploads maiores
- Este limite precisa ser aumentado nas configurações do Storage

### 2. Criar o bucket (se ainda não existir)

Execute no Supabase SQL Editor:

```sql
-- Ver migrations/032-criar-bucket-landing-pages-assets.sql
```

Ou crie manualmente:
1. Acesse: Supabase Dashboard → Storage → New Bucket
2. Nome: `landing-pages-assets`
3. Marque como **Público**
4. Limite: 150MB
5. Tipos MIME: `video/mp4`, `video/webm`, `image/jpeg`, `image/png`, `image/webp`

### 3. Fazer upload do vídeo

Execute o script de upload:

```bash
# Instalar dependências se necessário
npm install tsx

# Executar script
npx tsx scripts/upload-wellness-hero-video.ts
```

O script irá:
- ✅ Verificar se o arquivo existe
- ✅ Fazer upload do vídeo para `landing-pages-assets/wellness-hero.mp4`
- ✅ Fazer upload do poster para `landing-pages-assets/wellness-hero-poster.png`
- ✅ Exibir a URL pública gerada

### 4. Verificar se funcionou

1. Acesse a página: `/pt/wellness`
2. Verifique se o vídeo carrega corretamente
3. Abra o DevTools → Network e confirme que o vídeo está sendo servido do Supabase

### 5. (Opcional) Remover arquivo local

Após confirmar que tudo funciona, você pode remover o arquivo local:

```bash
# Fazer backup primeiro!
cp public/videos/wellness-hero.mp4 ~/backup/

# Remover (apenas se confirmar que funciona)
rm public/videos/wellness-hero.mp4
```

## 🔧 Estrutura de Arquivos

```
src/
  lib/
    landing-pages-assets.ts  ← Helper para URLs de assets
  app/
    pt/
      wellness/
        page.tsx  ← Atualizado para usar Supabase

scripts/
  upload-wellness-hero-video.ts  ← Script de upload

migrations/
  032-criar-bucket-landing-pages-assets.sql  ← Migration do bucket
```

## 📝 Como Funciona

1. **Helper (`landing-pages-assets.ts`):**
   - Função `getLandingPageAssetUrl()` obtém URL pública do Supabase
   - Fallback para arquivo local se Supabase não estiver configurado

2. **Página (`wellness/page.tsx`):**
   - Usa `landingPageVideos.wellnessHero()` para obter URL do vídeo
   - Usa `landingPageVideos.wellnessHeroPoster()` para obter URL do poster

3. **Bucket (`landing-pages-assets`):**
   - Público: qualquer pessoa pode acessar (sem autenticação)
   - Upload: apenas admins podem fazer upload
   - CDN: Supabase fornece CDN global automaticamente

## 🐛 Troubleshooting

### Erro: "Bucket não encontrado"
- Verifique se o bucket `landing-pages-assets` foi criado
- Execute a migration SQL

### Erro: "Arquivo muito grande" ou "beyond the global upload limit"
- **Verifique o limite global primeiro:** Supabase Dashboard → Storage → Settings
- Aumente o "File size upload limit" para pelo menos 150MB
- O limite do bucket pode ser maior, mas o limite global bloqueia uploads maiores
- Se o vídeo for maior que 150MB, aumente ambos os limites

### Vídeo não carrega
- Verifique se o bucket é público
- Verifique a URL no console do navegador
- Confirme que o arquivo foi enviado corretamente

### Fallback para arquivo local
- Se `NEXT_PUBLIC_SUPABASE_URL` não estiver configurado, usa arquivo local
- Verifique variáveis de ambiente

## ✅ Checklist

- [ ] **⚠️ LIMITE GLOBAL AUMENTADO:** Storage Settings → File size upload limit = 150MB+
- [ ] Bucket `landing-pages-assets` criado e público
- [ ] Variáveis de ambiente configuradas
- [ ] Script de upload executado com sucesso
- [ ] Vídeo carrega na página `/pt/wellness`
- [ ] URL do vídeo aponta para Supabase (verificar no DevTools)
- [ ] (Opcional) Arquivo local removido após confirmação

## 🔄 Migrar Outros Vídeos

Para migrar outros vídeos (ex: `nutri-hero.mp4`):

1. Adicione o arquivo ao script `upload-wellness-hero-video.ts`
2. Execute o script novamente
3. Atualize `landing-pages-assets.ts` se necessário

## 📚 Referências

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Next.js Static Files](https://nextjs.org/docs/basic-features/static-file-serving)
