#!/bin/bash

# Script para renomear imagens do app com nomes descritivos

cd "$(dirname "$0")/../imagens-app" || exit

echo "🔄 Renomeando imagens do app..."

# AGENDA
if [ -f "agenda/Captura de Tela 2026-01-03 às 12.37.17.png" ]; then
  mv "agenda/Captura de Tela 2026-01-03 às 12.37.17.png" "agenda/agenda-vazia.png" 2>/dev/null && echo "✅ agenda: agenda-vazia.png"
fi
if [ -f "agenda/Captura de Tela 2026-01-03 às 12.55.32.png" ]; then
  mv "agenda/Captura de Tela 2026-01-03 às 12.55.32.png" "agenda/agenda-cheia.png" 2>/dev/null && echo "✅ agenda: agenda-cheia.png"
fi

# CAPTAÇÃO
if [ -f "captacao/Captura de Tela 2026-01-03 às 12.34.48.png" ]; then
  mv "captacao/Captura de Tela 2026-01-03 às 12.34.48.png" "captacao/formulario-captacao.png" 2>/dev/null && echo "✅ captacao: formulario-captacao.png"
fi
if [ -f "captacao/Captura de Tela 2026-01-03 às 12.35.03.png" ]; then
  mv "captacao/Captura de Tela 2026-01-03 às 12.35.03.png" "captacao/dashboard-captacao.png" 2>/dev/null && echo "✅ captacao: dashboard-captacao.png"
fi

# CLIENTES
if [ -f "clientes/Captura de Tela 2026-01-03 às 12.36.40.png" ]; then
  mv "clientes/Captura de Tela 2026-01-03 às 12.36.40.png" "clientes/lista-clientes-cheia.png" 2>/dev/null && echo "✅ clientes: lista-clientes-cheia.png"
fi
if [ -f "clientes/Captura de Tela 2026-01-03 às 12.36.59.png" ]; then
  mv "clientes/Captura de Tela 2026-01-03 às 12.36.59.png" "clientes/perfil-cliente.png" 2>/dev/null && echo "✅ clientes: perfil-cliente.png"
fi

# GESTÃO DE CLIENTES
if [ -f "gestao-clientes/Captura de Tela 2026-01-03 às 12.37.38.png" ]; then
  mv "gestao-clientes/Captura de Tela 2026-01-03 às 12.37.38.png" "gestao-clientes/cadastro-cliente.png" 2>/dev/null && echo "✅ gestao-clientes: cadastro-cliente.png"
fi
if [ -f "gestao-clientes/Captura de Tela 2026-01-03 às 12.37.55.png" ]; then
  mv "gestao-clientes/Captura de Tela 2026-01-03 às 12.37.55.png" "gestao-clientes/perfil-cliente.png" 2>/dev/null && echo "✅ gestao-clientes: perfil-cliente.png"
fi
if [ -f "gestao-clientes/Captura de Tela 2026-01-03 às 12.38.04.png" ]; then
  mv "gestao-clientes/Captura de Tela 2026-01-03 às 12.38.04.png" "gestao-clientes/historico-consultas.png" 2>/dev/null && echo "✅ gestao-clientes: historico-consultas.png"
fi

# JORNADA 30 DIAS
if [ -f "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.09.png" ]; then
  mv "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.09.png" "jornada-30-dias/dia-1-onboarding.png" 2>/dev/null && echo "✅ jornada-30-dias: dia-1-onboarding.png"
fi
if [ -f "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.20.png" ]; then
  mv "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.20.png" "jornada-30-dias/dia-3-primeiro-cliente.png" 2>/dev/null && echo "✅ jornada-30-dias: dia-3-primeiro-cliente.png"
fi
if [ -f "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.33.png" ]; then
  mv "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.33.png" "jornada-30-dias/dia-5-primeira-consulta.png" 2>/dev/null && echo "✅ jornada-30-dias: dia-5-primeira-consulta.png"
fi
if [ -f "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.43.png" ]; then
  mv "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.43.png" "jornada-30-dias/dia-10-dashboard-inicial.png" 2>/dev/null && echo "✅ jornada-30-dias: dia-10-dashboard-inicial.png"
fi
if [ -f "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.52.png" ]; then
  mv "jornada-30-dias/Captura de Tela 2026-01-03 às 12.33.52.png" "jornada-30-dias/dia-15-agenda-preenchendo.png" 2>/dev/null && echo "✅ jornada-30-dias: dia-15-agenda-preenchendo.png"
fi

# VÍDEOS
if [ -f "videos/Gravação de Tela 2026-01-03 às 12.34.10.mov" ]; then
  mv "videos/Gravação de Tela 2026-01-03 às 12.34.10.mov" "videos/navegacao-dashboard-agenda.mov" 2>/dev/null && echo "✅ videos: navegacao-dashboard-agenda.mov"
fi
if [ -f "videos/Gravação de Tela 2026-01-03 às 12.35.37.mov" ]; then
  mv "videos/Gravação de Tela 2026-01-03 às 12.35.37.mov" "videos/cadastrando-cliente.mov" 2>/dev/null && echo "✅ videos: cadastrando-cliente.mov"
fi
if [ -f "videos/Gravação de Tela 2026-01-03 às 12.38.31.mov" ]; then
  mv "videos/Gravação de Tela 2026-01-03 às 12.38.31.mov" "videos/visualizando-relatorios.mov" 2>/dev/null && echo "✅ videos: visualizando-relatorios.mov"
fi
if [ -f "videos/Gravação de Tela 2026-01-03 às 12.56.46.mov" ]; then
  mv "videos/Gravação de Tela 2026-01-03 às 12.56.46.mov" "videos/agendando-consulta.mov" 2>/dev/null && echo "✅ videos: agendando-consulta.mov"
fi
if [ -f "videos/Gravação de Tela 2026-01-03 às 13.00.06.mov" ]; then
  mv "videos/Gravação de Tela 2026-01-03 às 13.00.06.mov" "videos/gestao-completa.mov" 2>/dev/null && echo "✅ videos: gestao-completa.mov"
fi

echo ""
echo "✅ Renomeação concluída!"
echo ""
echo "📋 Verifique os nomes e ajuste se necessário"


