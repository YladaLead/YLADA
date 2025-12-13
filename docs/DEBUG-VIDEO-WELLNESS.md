# 🐛 Debug: Vídeo Wellness Não Está Rodando

## Problema
O vídeo na página `/pt/wellness` não está rodando, apenas mostra a imagem inicial (poster).

## Checklist de Verificação

### 1. Verificar URL do Vídeo

Abra o console do navegador (F12) e verifique:
- A URL do vídeo está sendo gerada corretamente?
- A URL aponta para o Supabase Storage?
- Formato esperado: `https://[projeto].supabase.co/storage/v1/object/public/landing-pages-assets/wellness-hero.mp4`

### 2. Verificar Bucket Público

No Supabase Dashboard:
1. Vá em **Storage → landing-pages-assets**
2. Verifique se o bucket está marcado como **PUBLIC** (deve ter uma tag laranja)
3. Se não estiver público, marque como público nas configurações do bucket

### 3. Verificar Arquivo no Bucket

1. No Supabase Dashboard → Storage → landing-pages-assets
2. Verifique se o arquivo `wellness-hero.mp4` existe
3. Clique no arquivo e copie a URL pública
4. Teste a URL diretamente no navegador - deve baixar ou reproduzir o vídeo

### 4. Verificar CORS (se necessário)

O Supabase Storage geralmente não tem problemas de CORS para buckets públicos, mas se houver:
1. Verifique no console do navegador se há erros de CORS
2. Se houver, pode ser necessário configurar CORS no Supabase

### 5. Verificar Variáveis de Ambiente

Certifique-se de que `NEXT_PUBLIC_SUPABASE_URL` está configurada:
- No ambiente de produção (Vercel/outro)
- Com o valor correto do seu projeto Supabase

### 6. Testar URL Diretamente

Cole a URL do vídeo diretamente no navegador:
```
https://[seu-projeto].supabase.co/storage/v1/object/public/landing-pages-assets/wellness-hero.mp4
```

Se funcionar no navegador mas não no player:
- Problema pode ser com o elemento `<video>`
- Verifique erros no console do navegador

### 7. Verificar Console do Navegador

Abra o DevTools (F12) → Console e procure por:
- Erros de carregamento de vídeo
- Erros de CORS
- Mensagens de "URL gerada" (em desenvolvimento)
- Mensagens de "Vídeo carregado" ou "Erro ao carregar vídeo"

## Soluções Comuns

### Problema: URL está incorreta
**Solução:** Verifique se `NEXT_PUBLIC_SUPABASE_URL` está configurada corretamente

### Problema: Bucket não é público
**Solução:** 
1. Supabase Dashboard → Storage → landing-pages-assets
2. Clique em Settings (⚙️)
3. Marque "Public bucket" como ativado
4. Salve

### Problema: Arquivo não existe no bucket
**Solução:** Execute o script de upload:
```bash
npm run upload-wellness-video
```

### Problema: Erro de CORS
**Solução:** Buckets públicos do Supabase não devem ter problemas de CORS. Se houver, verifique as configurações do bucket.

## Teste Rápido

1. Abra a página `/pt/wellness` em produção
2. Abra o DevTools (F12) → Console
3. Procure por mensagens de debug
4. Clique com botão direito no elemento `<video>` → Inspect
5. Verifique o atributo `src` do elemento `<source>`
6. Copie a URL e teste diretamente no navegador

## Logs de Debug

O código agora inclui logs de debug que aparecem no console:
- `🔗 URL gerada para [arquivo]: [url]` - Mostra a URL gerada
- `✅ Vídeo carregado com sucesso` - Quando o vídeo carrega
- `❌ Erro ao carregar vídeo` - Quando há erro

Verifique esses logs no console do navegador.

