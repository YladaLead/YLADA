# 📸 Como Adicionar Sua Foto na Página do Workshop

## 📍 Localização da Foto

A foto está na seção **"Quem vai conduzir o workshop"** da página:
`/pt/nutri/workshop`

## 🎯 Onde a Foto Aparece

A foto aparece em um círculo azul ao lado do seu nome "Andre Faula" na seção "Quem conduz".

**Tamanho:**
- Mobile: 128x128 pixels (w-32 h-32)
- Desktop: 160x160 pixels (w-40 h-40)
- Formato: Círculo perfeito

---

## 📝 Como Adicionar a Foto

### **Passo 1: Preparar a Foto**

1. Use uma foto de rosto (cabeça e ombros)
2. Foto quadrada funciona melhor (1:1)
3. Resolução recomendada: 400x400 pixels ou maior
4. Formato: JPG ou PNG
5. Nome do arquivo: `andre-faula.jpg` (ou `.png`)

### **Passo 2: Colocar a Foto na Pasta**

1. Coloque a foto em: `/public/images/andre-faula.jpg`
   - Se a pasta `images` não existir, crie ela dentro de `public`

**Caminho completo:**
```
/Users/air/ylada-app/public/images/andre-faula.jpg
```

### **Passo 3: Atualizar o Código**

1. Abra o arquivo: `src/app/pt/nutri/workshop/page.tsx`
2. Procure pela linha ~343 (seção "Quem conduz")
3. Você verá um código comentado assim:

```tsx
{/* DESCOMENTE QUANDO TIVER A FOTO:
<Image
  src="/images/andre-faula.jpg"
  alt="Andre Faula"
  width={160}
  height={160}
  className="w-full h-full object-cover"
  priority
/>
*/}
```

4. **Descomente** o código do `Image` (remova `{/*` e `*/}`)
5. **Comente ou remova** o div com as iniciais "AF"

**Resultado final deve ficar assim:**

```tsx
<div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
  <Image
    src="/images/andre-faula.jpg"
    alt="Andre Faula"
    width={160}
    height={160}
    className="w-full h-full object-cover"
    priority
  />
</div>
```

---

## ✅ Checklist

- [ ] Foto preparada (quadrada, boa qualidade)
- [ ] Foto salva em `/public/images/andre-faula.jpg`
- [ ] Código do `Image` descomentado
- [ ] Div com "AF" removido ou comentado
- [ ] Testado no navegador (desktop e mobile)

---

## 🎨 Dicas para a Foto

- **Fundo:** Pode ser qualquer cor, mas fundo neutro ou azul combina melhor
- **Iluminação:** Boa iluminação frontal
- **Expressão:** Sorriso leve e profissional
- **Roupa:** Profissional, mas não muito formal
- **Enquadramento:** Cabeça e ombros, centralizado

---

## 🐛 Problemas Comuns

### **Foto não aparece**
- Verifique se o arquivo está em `/public/images/`
- Verifique se o nome do arquivo está correto
- Limpe o cache do navegador (Cmd+Shift+R)

### **Foto aparece distorcida**
- Use uma foto quadrada (1:1)
- Ou ajuste o `object-cover` para `object-contain` se preferir

### **Foto muito grande/pequena**
- A foto será redimensionada automaticamente
- O container é 128px (mobile) ou 160px (desktop)
- Use uma foto de pelo menos 400x400 para melhor qualidade

---

## 📝 Nota Importante

A foto ajuda a:
- ✅ Gerar confiança
- ✅ Humanizar a marca
- ✅ Aumentar conversão (pessoas confiam mais em quem veem)

**Recomendação:** Adicione a foto o quanto antes. Páginas com foto convertem melhor que páginas sem foto.
