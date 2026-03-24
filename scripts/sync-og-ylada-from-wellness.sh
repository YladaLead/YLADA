#!/usr/bin/env bash
# Copia imagens OG da área wellness para public/images/og/ylada quando o tema é equivalente.
# Fonte: public/images/og/wellness  →  destino: public/images/og/ylada
# Execute da raiz do repo: bash scripts/sync-og-ylada-from-wellness.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
W="$ROOT/public/images/og/wellness"
Y="$ROOT/public/images/og/ylada"

if [[ ! -d "$W" || ! -d "$Y" ]]; then
  echo "Pastas wellness ou ylada não encontradas."
  exit 1
fi

copy() {
  local src="$1" dest="$2"
  if [[ ! -f "$W/$src" ]]; then
    echo "SKIP (não existe em wellness): $src"
    return
  fi
  cp "$W/$src" "$Y/$dest"
  echo "OK $src → $dest"
}

echo "=== Sincronizando OG ylada a partir de wellness ==="

# Calculadoras / nutrição (equivalência direta com slugs wellness)
copy calc-imc.jpg peso-gordura.jpg
copy calc-hidratacao.jpg hidratacao.jpg
copy calc-calorias.jpg alimentacao.jpg

copy pronto-emagrecer.jpg emagrecimento.jpg
copy diagnostico-sintomas-intestinais.jpg intestino.jpg
copy avaliacao-perfil-metabolico.jpg metabolismo.jpg
copy energia-tarde.jpg energia.jpg
copy avaliacao-sono-energia.jpg sono.jpg
copy cardapio-detox.jpg detox.jpg
copy quiz-nutrition-assessment.jpg nutri-saude.jpg
copy alimentacao-rotina.jpg rotina-saudavel.jpg

# Retenção / inchaço: wellness tem PNG — converte para JPG no nome esperado pelo app
if [[ -f "$W/retencao-liquidos.png" ]]; then
  sips -s format jpeg "$W/retencao-liquidos.png" --out "$Y/inchaço-retencao.jpg" >/dev/null
  echo "OK retencao-liquidos.png → inchaço-retencao.jpg (convertido)"
elif [[ -f "$W/retencao-liquidos.jpg" ]]; then
  copy retencao-liquidos.jpg inchaço-retencao.jpg
fi

# Bem-estar / foco / performance (Hype + avaliações)
copy avaliacao-emocional.jpg estresse.jpg
copy hype-energia-foco.jpg foco.jpg
copy hype-pre-treino.jpg performance.jpg
copy hype-pre-treino.jpg fitness-treino.jpg

copy quiz-proposito.jpg coach-proposito.jpg
copy quiz-proposito.jpg carreira.jpg
copy default.jpg default.jpg
copy quiz-wellness-profile.jpg vitalidade.jpg

# Medicina (equivalências aproximadas com material wellness)
copy template-avaliacao-inicial.jpg medicina-prevencao.jpg
copy sindrome-metabolica.jpg medicina-diabetes.jpg
copy avaliacao-perfil-metabolico.jpg medicina-pressao.jpg
copy diagnostico-eletrolitos.jpg medicina-suplementacao.jpg

copy energia-tarde.jpg vendedor-energia.jpg

# Psicologia: wellness não tem fotos específicas; reutiliza avaliação emocional / perfil
copy avaliacao-emocional.jpg psicologia-ansiedade.jpg
copy avaliacao-emocional.jpg psicologia-emocional.jpg
copy avaliacao-emocional.jpg psicologia-depressao.jpg
copy quiz-proposito.jpg psicologia-autoconhecimento.jpg
copy quiz-bem-estar.jpg psicologia-autoestima.jpg
copy avaliacao-emocional.jpg psicologia-relacionamentos.jpg

# Fallback de segmento estética + corporal (genérico bem-estar)
copy quiz-wellness-profile.jpg estetica-pele.jpg
copy conhece-seu-corpo.jpg estetica-corporal.jpg

# Odontologia e perfumaria: sem equivalente fiel em wellness — mantenha arte em ylada ou adicione cópias manuais.

echo "=== Concluído ==="
