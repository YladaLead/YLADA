# 🔧 Correção da Imagem OG do Nutri

## ❌ Problema Identificado

A imagem que está aparecendo no compartilhamento da página `/pt/nutri` é a imagem do "Elvis" (provavelmente uma imagem padrão do Wellness) em vez da imagem correta do Nutri.

## 📋 Situação Atual

1. **Código está correto**: O layout do nutri está configurado para usar `/images/og/nutri/default.jpg`
2. **Arquivo de imagem existe**: O arquivo `/public/images/og/nutri/default.jpg` existe
3. **Problema**: A imagem `default.jpg` atual:
   - Tem dimensões incorretas: **572x150px** (muito pequena, menor que o mínimo de 200x200px do Facebook)
   - Provavelmente contém o logo **Wellness** em vez do logo **Nutri** (conforme README indica "logo Wellness")

## ✅ Solução

### 1. Substituir a Imagem `default.jpg`

**Localização**: `/public/images/og/nutri/default.jpg`

**Requisitos da nova imagem**:
- ✅ Deve conter o **logo Nutri** (baseado em `nutri-horizontal.PNG`)
- ✅ Dimensões: **1200x630px** (formato Open Graph padrão)
- ✅ Mínimo: **200x200px** (requisito do Facebook)
- ✅ Formato: JPG (recomendado) ou PNG
- ✅ Tamanho: < 1MB (recomendado: < 500KB)

### 2. Logo de Referência

O logo correto do Nutri está em:
- `/public/images/og/nutri/nutri-horizontal.PNG` (407x151px)
- `/public/images/logo/nutri-horizontal.png`

### 3. Após Substituir a Imagem

1. Fazer commit da nova imagem
2. Fazer deploy
3. Limpar cache do Facebook:
   - Acesse: https://developers.facebook.com/tools/debug/
   - Cole: `https://www.ylada.com/pt/nutri`
   - Clique em "Limpar cache" ou "Scrape Again"

## 📝 Notas

- O código em `src/app/pt/nutri/layout.tsx` está correto e apontando para a imagem certa
- O problema é que o arquivo de imagem física precisa ser substituído
- A imagem atual tem o logo errado (Wellness/Elvis) e dimensões incorretas
