# Criativos, message match, segmentos e compliance

## Modelo híbrido (recomendado)

| Onde | O quê |
|------|--------|
| **Repo / agentes internos** | Estratégia por segmento, copy, roteiros, briefs, **prompts prontos** para geradores de imagem/vídeo, checklist de coerência com marca |
| **Ferramentas externas** | Render final, edição, biblioteca de assets, publicação em redes e ads |

Assim você ganha **governança e volume de variações** sem obrigar o YLADA a ser editor de vídeo no MVP.

---

## Agente Experiência / Message match

**Problema que resolve:** anúncio promete X; landing fala Y; usuário desconfia ou abandona.

**Entrada:** ângulo do criativo (headline, promessa, tom) + URL ou estrutura da página + segmento.

**Saída:**

- Variantes de **texto** (hero, subhead, bullets, CTA) alinhadas ao anúncio.
- Sugestão de **ordem de blocos** (o quê vem antes do formulário/WhatsApp).
- Ajustes visuais **dentro do design system** (tokens de cor, tipografia) — não criar identidade nova por campanha sem aprovação.

**Organização no time:**

- **Opção A:** agente dedicado “Experiência”.
- **Opção B:** o Criador **sempre** anexa o “pacote landing” ao entregar anúncio (menos papéis, mais disciplina no prompt).

Escolha uma opção e mantenha **consistente** nos runbooks.

---

## Segmentos (“modos”)

Para cada segmento (ex.: estética, nutri, coach, público jovem, B2B), manter um **modo** com:

- Tom de voz e vocabulário.
- Provas permitidas (cases, números, antes/depois — respeitando verdade e regulamentação).
- Canais preferenciais e formatos (vídeo curto vs carrossel).
- **Restrições** específicas (ver compliance abaixo).

Os agentes devem **carregar o modo** antes de gerar criativo ou landing.

---

## Compliance e públicos sensíveis

- **Menores / famílias:** cuidado redobrado com publicidade, coleta de dados e linguagem; cruzar com `docs` de LGPD/proteção já existentes no repo.
- **Saúde e resultados:** evitar promessas absolutas; alinhar a **revisão humana** para qualquer claim forte.
- **Antes e depois / estética:** verificar regras de plataforma de anúncio e ética profissional.

O Criador e o Experiência devem ter **lista de “nunca dizer”** vinda do negócio/jurídico.

---

## Fluxo sugerido por campanha

1. Estratégico define ângulo e segmento (modo).
2. Criador gera **variações** de anúncio + prompts de mídia.
3. Experiência (ou Criador em modo pacote) gera **landing espelhada**.
4. Revisão humana rápida: marca + compliance + message match.
5. Publicação nas ferramentas externas; tracking básico para o Otimizador.

---

## Otimização

O Otimizador deve receber **qual variante de anúncio** levou a **qual variante de landing** (mesmo que só por nome/código interno), senão os dados misturam causa e efeito.

---

## Documentos relacionados no repositório

Sem obrigatoriedade de leitura imediata — apenas para não duplicar:

- Planos de branding / feature branding, se forem a fonte de tokens e tom.
- Planos de dados e LGPD, para limites de uso de diagnósticos em copy.

Atualizar **uma** fonte de verdade para tom de voz e evitar divergência entre agentes.
