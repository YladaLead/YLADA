#!/bin/bash

# Script para organizar logos do YLADA
cd "$(dirname "$0")"

# Criar estrutura de pastas
mkdir -p ../images/logo/ylada/quadrado/{verde,laranja,vermelho,roxo,azul-claro}

# Organização baseada na descrição da imagem
# Verde: 2, 3
for num in 2 3; do
  if [ -f "${num}.png" ]; then
    cp "${num}.png" "../images/logo/ylada/quadrado/verde/ylada-quadrado-verde-${num}.png"
  fi
  if [ -f "${num}.jpg" ]; then
    cp "${num}.jpg" "../images/logo/ylada/quadrado/verde/ylada-quadrado-verde-${num}.jpg"
  fi
done

# Laranja/Ouro: 12, 13, 14, 15
for num in 12 13 14 15; do
  if [ -f "${num}.png" ]; then
    cp "${num}.png" "../images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-${num}.png"
  fi
  if [ -f "${num}.jpg" ]; then
    cp "${num}.jpg" "../images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-${num}.jpg"
  fi
done

# Vermelho: 16, 17
for num in 16 17; do
  if [ -f "${num}.png" ]; then
    cp "${num}.png" "../images/logo/ylada/quadrado/vermelho/ylada-quadrado-vermelho-${num}.png"
  fi
  if [ -f "${num}.jpg" ]; then
    cp "${num}.jpg" "../images/logo/ylada/quadrado/vermelho/ylada-quadrado-vermelho-${num}.jpg"
  fi
done

# Roxo: 18, 19, 20, 21, 22, 23, 24, 25
for num in 18 19 20 21 22 23 24 25; do
  if [ -f "${num}.png" ]; then
    cp "${num}.png" "../images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-${num}.png"
  fi
  if [ -f "${num}.jpg" ]; then
    cp "${num}.jpg" "../images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-${num}.jpg"
  fi
done

# Azul claro: 28, 29, 30, 31
for num in 28 29 30 31; do
  if [ -f "${num}.png" ]; then
    cp "${num}.png" "../images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-${num}.png"
  fi
  if [ -f "${num}.jpg" ]; then
    cp "${num}.jpg" "../images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-${num}.jpg"
  fi
done

echo "✅ Logos organizados!"
echo "📁 Estrutura criada em: public/images/logo/ylada/"

