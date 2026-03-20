# Como continuar os testes (e dar certo)

---

## Acessar agora e ir verificando

| O quê | Onde |
|-------|------|
| **App** | Abra no navegador a URL que apareceu no terminal ao rodar `npm run dev` (ex.: **http://localhost:3004** — a porta pode ser 3000, 3003, 3004, etc.). |
| **Login** | **http://localhost:PORTA/pt/login** — E-mail: `teste-interno-01@teste.ylada.com` | Senha: `TesteYlada2025!` |
| **Verificação manual** | Depois de logar, siga **docs/CHECKLIST-TESTE-INTERNO-ESTETICA.md** (estética como base) ou **docs/CHECKLIST-TESTE-INTERNO-PRIMEIRA-AREA.md** (ylada matriz) e vá marcando ✅/⚠️/❌ em cada bloco. |
| **Verificação pelo agente** | Em outro terminal: `URL=http://localhost:PORTA HEADLESS=false npm run agente:interno` (troque PORTA pela porta do app). O agente usa por padrão a **conta Estética** (teste-interno-11). O **resultado** aparece **no final do terminal** e em **docs/RELATORIO-ULTIMO-TESTE-INTERNO.md**. |

**Contas já criadas:** as 12 contas de teste foram criadas/atualizadas. Basta o app estar rodando e usar o login acima.

---

## 1. Criar as contas de teste (só uma vez, se precisar de novo)

No terminal, na pasta do projeto:

```bash
node scripts/criar-contas-teste-interno.js
```

- **Não** rode isso no SQL Editor do Supabase (o arquivo é JavaScript, não SQL).
- O script usa o Supabase do seu `.env.local` e cria/atualiza as 12 contas (e-mail + senha + perfil + telefone + perfil Noel).
- Você deve ver algo como: `✅ 12/12 contas prontas.`

---

## 2. Subir o app

Em um terminal (deixe aberto):

```bash
npm run dev
```

- Anote em qual porta o app abriu (ex.: `http://localhost:3000` ou `3001` ou `3002`).

---

## 3. Rodar o teste

**Opção A — Agente (automático)**  
Em **outro** terminal:

- Se o app está na porta **3000**:  
  `npm run agente:interno`
- Se está em **outra porta** (ex.: 3004):  
  `URL=http://localhost:3004 HEADLESS=false npm run agente:interno`

O agente abre o navegador, faz login e percorre Board → Perfil → Noel → Configurações → … → Aparência. **Onde ver o resultado:** no **final do terminal**, a tabela com ✅ / ⚠️ / ❌ (e uma linha pronta para colar no PASSO-A-PASSO).

**Opção B — Manual**  
Abra no navegador: `http://localhost:3000/pt/login` (ou a porta que apareceu).  
Login: `teste-interno-01@teste.ylada.com` | Senha: `TesteYlada2025!`  
Siga o **docs/CHECKLIST-TESTE-INTERNO-PRIMEIRA-AREA.md** ou **docs/PASSO-A-PASSO-PARTE-INTERNA.md**.

---

## Resumo

| Passo | O que fazer |
|-------|------------------|
| 1 | `node scripts/criar-contas-teste-interno.js` (no terminal, **não** no Supabase SQL) |
| 2 | `npm run dev` (deixar rodando) |
| 3 | `npm run agente:interno` ou `URL=http://localhost:3002 npm run agente:interno` (em outro terminal) **ou** testar manualmente no navegador |

Se o login do agente falhar, use no passo 3 as mesmas credenciais que funcionam no seu login manual (mesmo Supabase no `.env.local`).
