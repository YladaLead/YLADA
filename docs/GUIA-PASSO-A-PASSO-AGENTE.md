# Guia passo a passo — Abrir terminal e criar agente no YLADA

**Objetivo:** Abrir o terminal dentro do Cursor, na pasta certa, e rodar o agente 1 (ylada-simulador).

**Foco:** Agentes são para **Ylada.com** — validar as áreas medicina, perfumaria, estética, nutri, psi, odonto, fitness, seller. A área Wellness (Herbalife) é opcional.

---

## PASSO 1 — Abrir o projeto no Cursor

1. Abra o **Cursor**
2. Vá em **File → Open Folder**
3. Selecione a pasta **ylada-app** (onde está o projeto YLADA)

---

## PASSO 2 — Abrir o terminal DENTRO do Cursor

Você **não precisa** abrir o Terminal do Mac separado. Use o terminal que vem dentro do Cursor:

**Opção A (atalho):**
- Pressione: **Control + `** (crase, tecla ao lado do 1)

**Opção B (menu):**
- Vá em **Terminal → New Terminal**

---

## PASSO 3 — Confirmar que está na pasta certa

No terminal, digite:

```bash
pwd
```

Deve mostrar algo como:
```
/Users/air/ylada-app
```

Se mostrar outra pasta, rode:
```bash
cd /Users/air/ylada-app
```

---

## PASSO 4 — Instalar dependências (se ainda não fez)

```bash
npm install
```

**Se o agente der erro de Chrome:** instale o Chromium do Puppeteer:
```bash
npx puppeteer browsers install chrome
```
Ou use o Chrome do Mac (o agente tenta automaticamente).

---

## PASSO 5 — Subir o ambiente (se for testar local)

Em **um terminal**, rode:

```bash
npm run dev
```

Deixe rodando. O app vai rodar em `http://localhost:3000`.

---

## PASSO 6 — Rodar o agente 1 (em outro terminal)

Abra **outro terminal** no Cursor (Terminal → New Terminal) e rode:

```bash
npm run agente:simulador
```

Ou diretamente:

```bash
npx tsx scripts/agents/ylada-simulador.ts
```

Para testar em outra URL (ex: produção):

```bash
URL="https://seu-dominio.com" npm run agente:simulador
```

---

## PASSO 7 — Ver o resultado

O agente vai:
1. Abrir a URL
2. Percorrer o funil (landing → onboarding → diagnóstico → resultado)
3. Gerar uma tabela no terminal com STATUS e OBSERVAÇÃO de cada etapa

---

## Onde está o agente?

```
ylada-app/
  scripts/
    agents/
      ylada-simulador.ts   ← Agente 1
```

---

## Resumo rápido

| Ação | Comando |
|------|---------|
| Abrir terminal | Control + ` |
| Ver pasta atual | `pwd` |
| Entrar na pasta | `cd /Users/air/ylada-app` |
| Instalar deps | `npm install` |
| Subir app | `npm run dev` |
| Rodar agente | `npm run agente:simulador` |
| Testar área estética | `FUNIL_PATH=/pt/estetica npm run agente:simulador` |
| Testar área medicina | `FUNIL_PATH=/pt/med npm run agente:simulador` |
| Testar área perfumaria | `FUNIL_PATH=/pt/perfumaria npm run agente:simulador` |
| Ver o browser | `HEADLESS=false npm run agente:simulador` |

**Outras áreas:** `FUNIL_PATH=/pt/nutri`, `/pt/psi`, `/pt/odonto`, `/pt/fitness`, `/pt/seller`. Wellness (Herbalife): `FUNIL_PATH=/pt/wellness/templates/initial-assessment` (default).

---

## Erros comuns

| Problema | Solução |
|----------|---------|
| "pwd" mostra outra pasta | `cd /Users/air/ylada-app` |
| "command not found: npm" | Instale Node.js (nodejs.org) |
| "Cannot find module" | Rode `npm install` |
| Agente não abre página | Suba o app primeiro com `npm run dev` |
