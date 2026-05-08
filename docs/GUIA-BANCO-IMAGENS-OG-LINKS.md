# Guia — banco de imagens OG para links `/l/[slug]`

## Pastas por produto (ficheiros no disco)

| Produto | Pasta em `public/` | Uso atual |
|--------|-------------------|-----------|
| Pró Líderes (presets) | `images/og/pro-lideres/` | `{stem}.jpg` por fluxo; sem fluxo → `og-default-saude.jpg` ou `og-default-recrutamento.jpg` (`pro_lideres_kind`). |
| Pro Estética capilar / corporal | `images/og/pro-estetica-capilar/`, `…-corporal/` | `byTemplateId` / `byNormalizedTheme` e basename espelhado de `ylada`; **fallback** = mesmo cartão YLADA. |
| Outros segmentos YLADA | `images/og/ylada/` | Mapa tema em `ylada-og-tema-imagem.ts`. |

Cartão unificado (parceiros / marca): `YLADA_OG_UNIFIED_SHARE_CARD_PATH` em `src/lib/ylada-og-fallback-logo.ts` → `/images/og/ylada/logo_ylada_azul_horizontal.png`.

## Mapa (código)

- **Pró Líderes preset:** `src/lib/pro-lideres/pro-lideres-preset-og-image.ts` → ficheiros em `pro-lideres/` (`proLideresOgImageRelativeFile`).
- **Pro Estética:** `src/config/ylada-link-og-image-bank.ts` + `src/lib/pro-estetica/pro-estetica-public-link-og.ts`.
- **Resto:** `src/lib/ylada-og-tema-imagem.ts`.

## Pró Líderes — placebo

O script `scripts/seed-pro-lideres-og-placeholders.mjs` gera JPEG a partir do logo: `og-default-saude.jpg`, `og-default-recrutamento.jpg`, `og-placeholder-ylada.jpg` e cada `{stem}.jpg` conhecido (ver script). Substitui as duas **default** por artes distintas (saúde vs recrutamento).

## Pro Estética

1. `byTemplateId` / `byNormalizedTheme` → ficheiro na pasta `imageDir`.
2. Caso contrário, basename do mapa YLada na pasta do produto.
3. Pele genérica / logo / sem match → **cartão YLADA** (não `sebo.jpg`).

## Referências

- `public/images/og/pro-lideres/README.md`, pastas Pro Estética
- `docs/IMAGENS-OG-QUIZZES-YLADA.md`
- `src/config/ylada-link-og-image-bank.ts`
