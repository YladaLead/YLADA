# Vídeos da Página de Vendas

## Como adicionar o vídeo principal

Você tem 3 opções para adicionar o vídeo na página de vendas (`/pt/nutri`):

### Opção 1: Vídeo Local (Recomendado para melhor performance)

1. Coloque seu vídeo na pasta `public/videos/` com o nome `nutri-hero.mp4`
2. (Opcional) Adicione uma imagem de poster (thumbnail) como `nutri-hero-poster.jpg`
3. O código já está configurado para usar este vídeo automaticamente

**Formatos suportados:**
- `.mp4` (recomendado - melhor compatibilidade)
- `.webm` (opcional - melhor compressão)

**Especificações recomendadas:**
- Resolução: 1920x1080 (Full HD) ou 1280x720 (HD)
- Proporção: 16:9
- Duração: 25 segundos (conforme especificado)
- Codec: H.264 para MP4, VP9 para WebM

### Opção 2: YouTube Embed

1. Faça upload do vídeo no YouTube
2. Copie o ID do vídeo (ex: se o link é `https://www.youtube.com/watch?v=ABC123xyz`, o ID é `ABC123xyz`)
3. No arquivo `src/app/pt/nutri/page.tsx`, descomente a seção "OPÇÃO 2: YouTube Embed"
4. Substitua `VIDEO_ID` pelo ID do seu vídeo do YouTube
5. Comente ou remova a "OPÇÃO 1: Vídeo Local"

### Opção 3: Vimeo Embed

1. Faça upload do vídeo no Vimeo
2. Copie o ID do vídeo (ex: se o link é `https://vimeo.com/123456789`, o ID é `123456789`)
3. No arquivo `src/app/pt/nutri/page.tsx`, descomente a seção "OPÇÃO 3: Vimeo Embed"
4. Substitua `VIDEO_ID` pelo ID do seu vídeo do Vimeo
5. Comente ou remova a "OPÇÃO 1: Vídeo Local"

## Exemplo de estrutura de arquivos

```
public/
  videos/
    nutri-hero.mp4          (vídeo principal)
    nutri-hero-poster.jpg   (thumbnail/thumbnail - opcional)
    README.md               (este arquivo)
```

## Notas importantes

- **Performance:** Vídeos locais oferecem melhor controle e performance, mas aumentam o tamanho do site
- **Hosting:** YouTube/Vimeo são gratuitos e não consomem espaço do servidor, mas dependem de conexão externa
- **Autoplay:** O vídeo está configurado para tocar automaticamente (muted) para melhor experiência
- **Responsivo:** O vídeo se adapta automaticamente a diferentes tamanhos de tela

