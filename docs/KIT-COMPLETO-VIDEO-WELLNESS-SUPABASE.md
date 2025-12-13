# 📦 Kit Completo: Vídeo Wellness no Supabase Storage

## ✅ Status da Implementação

**Data:** 13/12/2025  
**Status:** ✅ Implementado e Funcionando

### URL do Vídeo
```
https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/landing-pages-assets/wellness-hero.mp4
```

### Informações do Arquivo
- **Nome:** `wellness-hero.mp4`
- **Tamanho:** 31.88 MB
- **Bucket:** `landing-pages-assets` (Público)
- **Tipo:** `video/mp4`
- **Upload:** 13/12/2025, 13:14:32

---

## 📋 Resumo da Solução

### Problema Original
- Vídeo de 122MB ocupando espaço no Git
- Vídeo não carregava na página `/pt/wellness`
- Erros 404 ao acessar `/videos/wellness-hero.mp4`

### Solução Implementada
1. ✅ Criado bucket público `landing-pages-assets` no Supabase
2. ✅ Vídeo migrado para Supabase Storage (31.88 MB após compressão)
3. ✅ Helper criado para gerar URLs do Supabase
4. ✅ Página atualizada para usar URLs do Supabase
5. ✅ Middleware atualizado para excluir `/videos/` do processamento

---

## 🗂️ Arquivos Criados/Modificados

### Novos Arquivos
```
migrations/032-criar-bucket-landing-pages-assets.sql
src/lib/landing-pages-assets.ts
scripts/upload-wellness-hero-video.ts
scripts/test-video-url.ts
docs/MIGRAR-VIDEO-WELLNESS-SUPABASE.md
docs/AUMENTAR-LIMITE-UPLOAD-SUPABASE.md
docs/DEBUG-VIDEO-WELLNESS.md
docs/KIT-COMPLETO-VIDEO-WELLNESS-SUPABASE.md (este arquivo)
```

### Arquivos Modificados
```
src/app/pt/wellness/page.tsx
src/middleware.ts
package.json
```

---

## 🔧 Configuração do Supabase

### Bucket: `landing-pages-assets`
- **Público:** ✅ Sim
- **Limite de tamanho:** 150 MB
- **Tipos MIME permitidos:**
  - `video/mp4`
  - `video/mpeg`
  - `video/webm`
  - `video/quicktime`
  - `video/x-msvideo`
  - `image/jpeg`
  - `image/jpg`
  - `image/png`
  - `image/gif`
  - `image/webp`

### Políticas de Acesso
- **SELECT (Leitura):** Público (qualquer pessoa pode ler)
- **INSERT (Upload):** Apenas admins
- **UPDATE (Atualização):** Apenas admins
- **DELETE (Exclusão):** Apenas admins

### Limite Global de Upload
⚠️ **IMPORTANTE:** O limite global do projeto deve ser de pelo menos 150MB
- Configurar em: Supabase Dashboard → Storage → Settings
- Limite atual do bucket: 150MB
- Limite global recomendado: 150MB+

---

## 💻 Código Implementado

### Helper: `src/lib/landing-pages-assets.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BUCKET_NAME = 'landing-pages-assets'

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function getLandingPageAssetUrl(fileName: string): string {
  if (!supabase) {
    return `/videos/${fileName}` // Fallback local
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

export const landingPageVideos = {
  get wellnessHero() {
    return getLandingPageAssetUrl('wellness-hero.mp4')
  },
  get wellnessHeroPoster() {
    return getLandingPageAssetUrl('wellness-hero-poster.png')
  },
  // ... outros vídeos
}
```

### Uso na Página: `src/app/pt/wellness/page.tsx`
```tsx
import { landingPageVideos } from '@/lib/landing-pages-assets'

<video 
  controls
  loop
  playsInline
  preload="metadata"
  poster={landingPageVideos.wellnessHeroPoster}
  onError={(e) => {
    console.error('❌ Erro ao carregar vídeo:', e)
  }}
>
  <source src={landingPageVideos.wellnessHero} type="video/mp4" />
</video>
```

---

## 🚀 Scripts Disponíveis

### Upload do Vídeo
```bash
npm run upload-wellness-video
```
- Faz upload do vídeo e poster para o Supabase
- Exibe a URL pública gerada

### Testar URL
```bash
npm run test-video-url
```
- Verifica se a URL está acessível
- Testa se o arquivo existe no bucket
- Mostra informações do arquivo

---

## 📝 Migration SQL

### Executar no Supabase SQL Editor
```sql
-- migrations/032-criar-bucket-landing-pages-assets.sql
```

**Importante:** Após executar a migration:
1. Verificar se o bucket está marcado como **Público**
2. Verificar se as políticas foram criadas corretamente
3. Aumentar o limite global de upload se necessário

---

## ✅ Checklist de Verificação

### Configuração Inicial
- [x] Bucket `landing-pages-assets` criado
- [x] Bucket marcado como público
- [x] Limite global de upload aumentado para 150MB+
- [x] Políticas de acesso configuradas
- [x] Vídeo enviado para o Supabase

### Código
- [x] Helper `landing-pages-assets.ts` criado
- [x] Página `/pt/wellness` atualizada
- [x] Middleware atualizado
- [x] Scripts de upload e teste criados

### Testes
- [x] URL do vídeo acessível
- [x] Vídeo carrega na página
- [x] Logs de debug funcionando
- [x] Fallback local funcionando (se Supabase não configurado)

---

## 🔍 Troubleshooting

### Vídeo não carrega
1. Verificar console do navegador (F12)
2. Verificar se a URL está correta
3. Testar URL diretamente no navegador
4. Verificar se bucket está público
5. Executar `npm run test-video-url`

### Erro 404
- Verificar se arquivo existe no bucket
- Verificar nome do arquivo (case-sensitive)
- Verificar se bucket está público

### Erro de CORS
- Buckets públicos do Supabase não devem ter problemas de CORS
- Se houver, verificar configurações do bucket

### Limite de upload excedido
- Verificar limite global (Storage → Settings)
- Verificar limite do bucket
- Comprimir vídeo se necessário

---

## 📊 Benefícios da Solução

### Performance
- ✅ CDN global do Supabase
- ✅ Cache otimizado
- ✅ Carregamento mais rápido

### Escalabilidade
- ✅ Não ocupa espaço no Git
- ✅ Não sobrecarrega servidor Next.js
- ✅ Suporta múltiplos vídeos grandes

### Manutenção
- ✅ Fácil adicionar novos vídeos
- ✅ Centralizado no Supabase
- ✅ Scripts automatizados

---

## 🔄 Próximos Passos (Opcional)

### Otimizações Futuras
1. **Compressão de vídeo:**
   - Reduzir ainda mais o tamanho (20-30MB ideal)
   - Usar formatos mais eficientes (H.265)
   - Criar múltiplas resoluções (720p, 1080p)

2. **Lazy Loading:**
   - Carregar vídeo apenas quando visível
   - Usar `loading="lazy"` ou Intersection Observer

3. **Thumbnails:**
   - Gerar thumbnails automáticos
   - Usar como poster do vídeo

4. **Analytics:**
   - Rastrear visualizações
   - Monitorar taxa de carregamento

---

## 📚 Documentação Relacionada

- [Migração do Vídeo](MIGRAR-VIDEO-WELLNESS-SUPABASE.md)
- [Aumentar Limite de Upload](AUMENTAR-LIMITE-UPLOAD-SUPABASE.md)
- [Debug do Vídeo](DEBUG-VIDEO-WELLNESS.md)

---

## 🔗 Links Úteis

- **URL do Vídeo:** https://fubynpjagxxqbyfjsile.supabase.co/storage/v1/object/public/landing-pages-assets/wellness-hero.mp4
- **Supabase Dashboard:** https://supabase.com/dashboard/project/fubynpjagxxqbyfjsile/storage/buckets/landing-pages-assets
- **Página Wellness:** https://ylada.app/pt/wellness

---

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs no console do navegador
2. Executar script de teste: `npm run test-video-url`
3. Verificar documentação de debug
4. Verificar configurações do Supabase

---

**Última atualização:** 13/12/2025  
**Versão:** 1.0.0
