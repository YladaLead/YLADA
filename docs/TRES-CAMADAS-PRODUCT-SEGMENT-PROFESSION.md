# Três camadas de identificação (product / segment / profession)

Decisão para não misturar rota, profissão e produto no banco, no billing e no tracking.

---

## 1) Product (produto / assinatura)

- **Exemplos:** `nutri`, `wellness`, `ylada`
- **Serve para:** billing, permissões, assinatura.
- **Não muda** com a profissão do usuário.
- **Onde usamos hoje:** `user_profiles.perfil` (nutri, wellness, coach, nutra); assinaturas por produto; auth em rotas `/pt/nutri`, `/pt/wellness`. As rotas `/pt/med`, `/pt/psi`, etc. são do **produto YLADA** (um produto, vários segmentos).

---

## 2) Segment (rota / mercado)

- **Exemplos:** `med`, `psi`, `psicanalise`, `odonto`, `nutra`, `coach`
- **Serve para:** landing, copy, SEO, anúncios, **Links Inteligentes** (perguntas/templates por segmento).
- **É o que vira rota:** `/pt/med`, `/pt/psi`, `/pt/odonto`, etc.
- **Onde usamos hoje:** `src/config/ylada-areas.ts` (lista de “áreas” YLADA), layout/sidebar Med, API Noel (contexto por “área”). Na nomenclatura nova, isso é **segment**; em código legado ainda aparece como `areaCodigo` / `area` por compatibilidade.
- **Links Inteligentes:** usar **segment_code** (ex.: `smart_link_questions.segment_code`, `smart_link_sessions.segment_code`). O usuário em `/pt/med` cria link já com `segment_code = med`; perguntas e fluxo vêm do segmento.

---

## 3) Profession (perfil do usuário)

- **Exemplos:** medico, psicologo, dentista, nutricionista, vendedor_suplementos
- **Serve para:** contexto da IA (Noel), templates e refinamento.
- **Vem do:** onboarding / Perfil empresarial (metas, objetivos, especialidades).
- **Onde usamos hoje:** ainda não modelado de forma separada; o perfil empresarial (ylada_noel_profile ou equivalente) vai preencher essa camada. O Noel pode receber `segment` (rota) + `profession` (perfil) para personalizar.

---

## Regras práticas

| Camada     | Onde definir        | Onde usar                                      |
|-----------|---------------------|-------------------------------------------------|
| **product**  | Assinatura, perfil app | Billing, auth, “qual app” (nutri/wellness/ylada). |
| **segment**  | Rota + config YLADA   | Landing, menu, Links Inteligentes, Noel (contexto de mercado). |
| **profession** | Onboarding / perfil empresarial | Noel, diagnóstico, templates (refinamento).        |

- **Smart Links:** tabelas e APIs usam **segment_code** (medicina, psicologia, odonto, nutra). Profession pode ser refinamento depois.
- **Noel:** recebe `segment` (e opcionalmente `profession` quando existir perfil). O body pode aceitar `segment` e manter `area` por compatibilidade.
- **Código legado:** onde ainda existir “area” para rotas YLADA (med, psi, odonto, nutra, coach), tratar como **segment**; novo código deve preferir `segment_code` / `segment` no contrato.

---

## Arquivos de config

- **Segmentos (rotas YLADA):** `src/config/ylada-areas.ts` (hoje “áreas”; conceito = segment). Novo código pode usar `segmentCode` / `getYladaSegmentPathPrefix`.
- **Produtos:** atualmente implícito em auth e assinatura (nutri, wellness, ylada). Podemos extrair para `config/products.ts` quando for necessário centralizar.
- **Profession:** definido quando o perfil empresarial (onboarding) e tabelas como `ylada_noel_profile` estiverem definidos.

---

## Smart Links (quando implementar)

Usar **segment_code** em todas as tabelas e APIs:

- `smart_link_segments` — segment_code, name, active, order, config_json
- `smart_link_questions` — segment_code, order, key, question, type, options_json, conditional_json
- `smart_link_sessions` — user_id, segment_code, answers, status, suggested_flow, suggested_diagnosis, approved_diagnosis
- `smart_links` (ou generated_links) — user_id, segment_code, session_id, slug, title, description, content, approved_diagnosis, cta_whatsapp

Fluxo: usuário em `/pt/med` cria link → `segment_code = med`; perguntas e templates vêm por segment_code. Profession (perfil) pode refinar depois.
