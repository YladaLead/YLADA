# 📹 Vídeos do app

## Vídeo do fluxo completo (YLADA)

- **Arquivo:** `ylada-fluxo-completo.mp4`
- **Onde:** `public/videos/ylada-fluxo-completo.mp4`
- Aparece na seção "Vídeo do fluxo completo" em /pt/nutri, /pt/med, /pt/psi, etc. Para usar YouTube, defina `NEXT_PUBLIC_YLADA_VIDEO_FLUXO_URL` no .env.local.

---

## Vídeo explicativo Wellness

1. **Coloque seu arquivo .mov aqui:**
   - Nome do arquivo: `wellness-explicativo.mov`
   - Caminho completo: `/public/videos/wellness-explicativo.mov`

2. **Recomendação (opcional):**
   - Para melhor compatibilidade, converta para MP4
   - Nome do arquivo: `wellness-explicativo.mp4`
   - O sistema tentará usar MP4 primeiro, depois MOV como fallback

3. **Conversão rápida (se necessário):**
   - Use ferramentas online como: CloudConvert, FreeConvert, ou HandBrake
   - Ou no terminal: `ffmpeg -i seu-video.mov wellness-explicativo.mp4`

## Estrutura esperada
```
public/videos/
  ylada-fluxo-completo.mp4   ← Fluxo completo (landing pages)
  wellness-explicativo.mov
  wellness-explicativo.mp4   ← Opcional
```
