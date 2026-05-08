# OG — Pró Líderes

**Todas** as prévias Open Graph dos links **preset** Pro Líderes vêm desta pasta:  
`/images/og/pro-lideres/{stem}.png` (stem = `pro_lideres_fluxo_id` normalizado; exceção `agua` → `calc-hidratacao.png`).

- **`og-placeholder-ylada.png`** — placebo quando não há `fluxo_id`; cópia do cartão logo YLADA.
- **Por fluxo:** substitui só o ficheiro do fluxo (mantém o **mesmo nome**) pela tua arte final (PNG ou ajusta extensão em `PRO_LIDERES_OG_IMAGE_FILENAME_OVERRIDE_BY_FLUXO_ID`).

Regenerar placebos a partir do logo (`public/images/og/ylada/logo_ylada_azul_horizontal.png`):

```bash
node scripts/seed-pro-lideres-og-placeholders.mjs
```

Sobrescrever todos os PNG (ex.: logo atualizado): `node scripts/seed-pro-lideres-og-placeholders.mjs --force`

### Comprimir todas as PNG de uma vez (1200×630, WhatsApp)

```bash
npm run og:compress-pro-lideres
```

Simula sem gravar: `npm run og:compress-pro-lideres -- --dry-run`  
Grava mesmo quando o ficheiro não fica menor: `npm run og:compress-pro-lideres -- --force`

### Cache WhatsApp após trocar PNGs

Na Vercel, define (ou incrementa) **`NEXT_PUBLIC_PRO_LIDERES_OG_ASSET_VERSION`** (ex.: `1`, `2`, …).  
Isso acrescenta `?v=…` ao `og:image` e força o crawler a tratar como URL nova.
