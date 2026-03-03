# Teste do Fluxo Mínimo YLADA

**Objetivo:** Validar que o fluxo completo funciona de ponta a ponta.

---

## Pré-requisitos

- Servidor rodando (`npm run dev`)
- Usuário logado com perfil `ylada` (ou admin)
- Perfil empresarial preenchido OU perfil simulado ativo

---

## Passos do teste

### 1. Ativar perfil simulado (opcional)

1. Acesse `/pt/perfis-simulados`
2. Clique em **Ativar** no perfil "Médico — Emagrecimento" (ou similar)
3. Confirme que aparece "Simulação ativa"

### 2. Conversar com o Noel

1. Acesse `/pt/home` (Noel)
2. Digite: **"quero captar pacientes para emagrecimento"**
3. O Noel deve:
   - Detectar a intenção
   - Chamar interpret + generate
   - Responder descrevendo o que criou (ex.: "Criei o Quiz Pronto para Emagrecer para você")
   - Incluir um link em markdown: [título](url)

### 3. Abrir o link gerado

1. Clique no link na resposta do Noel (ou copie a URL)
2. Deve abrir `/l/[slug]` com:
   - Intro (título, subtítulo)
   - Botão "Começar"
   - Formulário com 4 perguntas (após Começar)

### 4. Preencher o formulário

Preencha com dados que exercitem o diagnóstico:

- **q1 (sintomas):** "cansado, inchado, compulsão"
- **q2 (tentou):** "dieta, academia, 3 vezes"
- **q3 (impacto):** "muito"
- **q4 (vezes):** "4"

### 5. Ver resultado

1. Clique em "Ver resultado"
2. Deve aparecer:
   - Título do diagnóstico
   - Resumo
   - Destaque (main_blocker)
   - Teaser (consequence + growth)
   - Botão CTA (ex.: "Fale comigo sobre isso")

### 6. Clicar no CTA

- Se WhatsApp configurado: abre WhatsApp com mensagem pré-preenchida
- Se não: mostra "Botão WhatsApp não configurado"

---

## O que verificar

| Etapa | Esperado |
|-------|----------|
| Noel detecta | Responde com link gerado |
| Link abre | Formulário com 4 perguntas |
| Diagnóstico | Reflete as respostas (mais sintomas/tentativas = risco mais alto) |
| CTA | Abre WhatsApp ou avisa que não está configurado |

---

## Problemas comuns

- **Noel não gera link:** Verificar se perfil está preenchido (tipo de atuação, profissão)
- **Link 404:** Slug pode estar incorreto; verificar no banco `ylada_links`
- **Diagnóstico genérico:** Verificar se o mapeamento (diagnosis-normalize) está sendo aplicado
- **WhatsApp não abre:** Configurar `cta_whatsapp` no link ou no perfil
