# OG — Pró Líderes

**Todas** as prévias Open Graph dos links **preset** Pro Líderes vêm desta pasta:  
`/images/og/pro-lideres/{stem}.jpg` (stem = `pro_lideres_fluxo_id` normalizado; exceção `agua` → `calc-hidratacao.jpg`).

- **`og-default-saude.jpg`** / **`og-default-recrutamento.jpg`** — OG genéricas (sem `pro_lideres_fluxo_id`). Nomes e regra `sales` vs `recruitment`: `src/lib/pro-lideres/pro-lideres-og-default-assets.ts`. Regenerar a partir de `_sources/*.source.png`: `npm run og:build-pro-lideres-defaults`.
- **`og-placeholder-ylada.jpg`** — legado / seed a partir do logo (opcional).
- **Por fluxo:** substitui só o ficheiro do fluxo (mantém o **mesmo nome** `{stem}.jpg`) ou usa `PRO_LIDERES_OG_IMAGE_FILENAME_OVERRIDE_BY_FLUXO_ID` para outro nome/extensão.

Regenerar placebos a partir do logo (`public/images/og/ylada/logo_ylada_azul_horizontal.png`):

```bash
node scripts/seed-pro-lideres-og-placeholders.mjs
```

Sobrescrever todos os JPG placebos (ex.: logo atualizado): `node scripts/seed-pro-lideres-og-placeholders.mjs --force`

### Comprimir PNG legadas de uma vez (1200×630)

```bash
npm run og:compress-pro-lideres
```

Simula sem gravar: `npm run og:compress-pro-lideres -- --dry-run`  
Grava mesmo quando o ficheiro não fica menor: `npm run og:compress-pro-lideres -- --force`

### Cache WhatsApp após trocar JPGs/PNGs

Na Vercel, define (ou incrementa) **`NEXT_PUBLIC_PRO_LIDERES_OG_ASSET_VERSION`** (ex.: `1`, `2`, …).  
Isso acrescenta `?v=…` ao `og:image` e força o crawler a tratar como URL nova.
