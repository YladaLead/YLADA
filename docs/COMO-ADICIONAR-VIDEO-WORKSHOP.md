# 🎥 Como Adicionar Seu Vídeo na Landing Page do Workshop

## 📍 Localização

O vídeo está na seção "Assista ao vídeo de apresentação" da página:
`/pt/nutri/workshop`

## 🔧 Como Adicionar o Vídeo

### **Opção 1: YouTube (Recomendado)**

1. Faça upload do seu vídeo no YouTube
2. Copie o ID do vídeo (ex: se o link é `https://www.youtube.com/watch?v=ABC123xyz`, o ID é `ABC123xyz`)
3. Abra o arquivo: `src/app/pt/nutri/workshop/page.tsx`
4. Procure pela linha que contém:
   ```tsx
   <iframe
     className="w-full h-full"
     src=""
   ```
5. Substitua o `src=""` por:
   ```tsx
   src="https://www.youtube.com/embed/SEU_VIDEO_ID_AQUI"
   ```
6. Remova ou comente o `<div>` com o placeholder (o que mostra "Vídeo em breve")

**Exemplo completo:**
```tsx
<iframe
  className="w-full h-full"
  src="https://www.youtube.com/embed/ABC123xyz"
  title="Vídeo de apresentação do workshop"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
```

---

### **Opção 2: Vimeo**

1. Faça upload do seu vídeo no Vimeo
2. Copie o ID do vídeo (ex: se o link é `https://vimeo.com/123456789`, o ID é `123456789`)
3. Substitua o `src=""` por:
   ```tsx
   src="https://player.vimeo.com/video/123456789"
   ```

---

### **Opção 3: Loom**

1. Faça upload do seu vídeo no Loom
2. Copie o ID do vídeo (ex: se o link é `https://www.loom.com/share/abc123`, o ID é `abc123`)
3. Substitua o `src=""` por:
   ```tsx
   src="https://www.loom.com/embed/abc123"
   ```

---

### **Opção 4: Outro Serviço**

Se você usar outro serviço de vídeo:
1. Obtenha o código embed do vídeo
2. Substitua todo o `<iframe>` pelo código embed fornecido

---

## 🎨 Personalização (Opcional)

### **Remover o Placeholder**

Depois de adicionar o vídeo, você pode remover o `<div>` com o placeholder:

```tsx
{/* Remova ou comente este bloco após adicionar o vídeo */}
{/* 
<div className="absolute inset-0 flex items-center justify-center...">
  ...
</div>
*/}
```

### **Adicionar Autoplay (YouTube)**

Para o vídeo começar automaticamente (sem som):
```tsx
src="https://www.youtube.com/embed/SEU_VIDEO_ID?autoplay=1&mute=1"
```

### **Ocultar Controles (YouTube)**

Para ocultar os controles do YouTube:
```tsx
src="https://www.youtube.com/embed/SEU_VIDEO_ID?controls=0"
```

---

## ✅ Checklist

- [ ] Vídeo feito upload no serviço escolhido
- [ ] ID do vídeo copiado
- [ ] `src=""` atualizado no arquivo
- [ ] Placeholder removido ou comentado
- [ ] Testado no navegador (desktop e mobile)

---

## 🐛 Problemas Comuns

### **Vídeo não aparece**
- Verifique se o ID do vídeo está correto
- Verifique se o vídeo está público (não privado)
- Limpe o cache do navegador (Ctrl+F5)

### **Vídeo não é responsivo**
- O container já está configurado para ser responsivo
- Se ainda houver problemas, verifique se o `className="w-full h-full"` está no iframe

### **Erro de CORS**
- Alguns serviços podem bloquear embed em certos domínios
- Use YouTube ou Vimeo que são mais permissivos

---

## 📝 Nota Importante

O vídeo é uma parte importante da landing page porque:
- Aumenta a confiança (pessoas veem você)
- Explica melhor o workshop
- Aumenta o tempo na página (melhor para SEO)
- Melhora a conversão (pessoas que assistem se inscrevem mais)

**Dica:** Faça um vídeo curto (2-3 minutos) explicando:
- O que é o workshop
- O que a pessoa vai aprender
- Por que ela deve participar
- Como funciona (quando, onde, como)

