# Quiz Nutri Carreira — Arquitetura e Páginas

Objetivo: quiz de autossegmentação para nutricionistas (diagnóstico + esperança) que leva ao vídeo de apresentação do Ilada Nutri e depois à oferta.

---

## 1. Páginas e URLs

| Página | URL | Descrição |
|--------|-----|-----------|
| **Quiz (entrada)** | `/pt/nutri/quiz` | Uma única entrada: título, subtítulo, pergunta 1 (autossegmentação). Sem login. |
| **Quiz (perguntas do grupo)** | *(mesma página, estado)* | Após a pergunta 1, mostra 3–4 perguntas do grupo escolhido (recém-formada, agenda instável, etc.). |
| **Captura + Resultado** | *(mesma página ou step)* | Opcional: pedir email/WhatsApp antes de mostrar o resultado. Depois: tela de diagnóstico (dinâmica por grupo) + CTA. |
| **Vídeo** | `/pt/nutri/quiz/video` | Vídeo 7–10 min explicando o problema e o Ilada Nutri. Destino do botão "Quero entender como resolver isso". |
| **Oferta/Checkout** | `/pt/nutri/descobrir` ou `/pt/nutri/checkout` | Já existentes. Após o vídeo, CTA pode ir para descobrir (conhecer) ou direto para planos. |

Resumo de rotas novas:

- **`/pt/nutri/quiz`** — Quiz completo (perguntas + captura + resultado + CTA).
- **`/pt/nutri/quiz/video`** — Página do vídeo pós-quiz.

---

## 2. Fluxo do usuário

```
[Bio / Story / Anúncio]
         │
         ▼
   /pt/nutri/quiz
         │
   Pergunta 1: "Qual frase mais representa seu momento?"
   → recém-formada | agenda instável | sobrecarregada | financeiro travado | confusa
         │
   Perguntas 2–4 do grupo (3–4 perguntas)
         │
   (Opcional) Captura: email e/ou telefone
         │
   POST /api/nutri/quiz/lead  →  salva lead + grupo + respostas
         │
   Tela de RESULTADO (dinâmica por grupo)
   - Acolhimento + nome do problema + consequência + potencial + esperança
   - CTA: "Quero entender como resolver isso"
         │
         ▼
   /pt/nutri/quiz/video
   - Vídeo único 7–10 min (abertura espelhada para todos os perfis)
   - CTA final: conhecer Ilada Nutri / ver planos
         │
         ▼
   /pt/nutri/descobrir  ou  /pt/nutri/checkout
```

---

## 3. Estrutura de pastas (App Router)

```
src/app/pt/nutri/
├── quiz/
│   ├── page.tsx          ← Quiz completo (perguntas + resultado + CTA)
│   ├── layout.tsx        ← opcional: layout só do quiz (header mínimo, sem sidebar)
│   └── video/
│       └── page.tsx      ← Página do vídeo pós-quiz
```

Nenhuma outra rota nova obrigatória: resultado é na mesma página do quiz (estado ou step).

---

## 4. API

### POST `/api/nutri/quiz/lead`

**Body:**

```json
{
  "nome": "opcional",
  "email": "obrigatório para captura",
  "telefone": "opcional",
  "grupo": "recem_formada | agenda_instavel | sobrecarregada | financeiro_travado | confusa",
  "respostas": { "q1": "...", "q2": "...", ... }
}
```

**Resposta:** `201` + `{ "id": "uuid", "grupo": "agenda_instavel" }`  
Usado para: salvar lead, (futuro) WhatsApp automático por grupo, e para mostrar o bloco de resultado certo na própria página.

Salva em: tabela **`quiz_nutri_leads`** (ver migration abaixo).

---

## 5. Banco de dados

Tabela **`quiz_nutri_leads`**:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | PK |
| nome | TEXT | opcional |
| email | TEXT | obrigatório |
| telefone | TEXT | opcional |
| grupo | TEXT | recem_formada, agenda_instavel, sobrecarregada, financeiro_travado, confusa |
| respostas | JSONB | todas as respostas do quiz |
| source | TEXT | ex: quiz_carreira |
| ip_address | TEXT | opcional |
| user_agent | TEXT | opcional |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

Índices: `email`, `grupo`, `created_at DESC`.

---

## 6. Conteúdo dinâmico por grupo (resultado)

Cada grupo tem um bloco de diagnóstico (texto) na própria página do quiz:

- **recem_formada** — “Você não está atrasada. Você está sem mapa.” + bullets + esperança + CTA.
- **agenda_instavel** — “Falta um sistema claro de captação…” (exemplo que o ChatGPT montou).
- **sobrecarregada** — Falta de rotina estratégica.
- **financeiro_travado** — Posicionamento que não sustenta o preço.
- **confusa** — Sem direção, próximo passo.

O `page.tsx` do quiz carrega um mapa `grupo → conteúdo` (título, parágrafos, bullets, CTA) e renderiza o bloco conforme o `grupo` retornado pela API (ou definido no estado após o último step).

---

## 7. Onde divulgar (links)

- **Link principal do quiz:** `https://www.ylada.com/pt/nutri/quiz`
- Bio Instagram: mesmo link.
- Stories: “Responde rapidinho” → mesmo link.
- WhatsApp: link único.
- Vídeo pós-quiz: `https://www.ylada.com/pt/nutri/quiz/video` (só após clicar no CTA do resultado).

---

## 8. Resumo: qual é a página?

- **Uma página de quiz:** **`/pt/nutri/quiz`** — nela acontecem: pergunta 1 → perguntas do grupo → (captura) → resultado personalizado → botão “Quero entender como resolver isso”.
- **Uma página de vídeo:** **`/pt/nutri/quiz/video`** — vídeo 7–10 min; depois CTA para descobrir/checkout.

Tudo que é “quiz” para a nutri fica em **`/pt/nutri/quiz`** (e em **`/pt/nutri/quiz/video`** para o vídeo).
