# Agente 3 — Otimizador do Noel (modo LAB)

**Objetivo:** Comparar ORIGINAL vs OTIMIZADO e dar clareza: vale a pena mudar o Noel ou não?

**Modo controlado:** não altera o Noel; só gera uma versão otimizada para você comparar e decidir.

---

## Fluxo

1. **Agente 1** → captura diagnóstico → salva em `ultimo-diag.txt`
2. **Agente 2** → audita → salva saída em `ultima-auditoria.txt`
3. **Agente 3** → lê diagnóstico + auditoria → gera versão otimizada → mostra ORIGINAL vs OTIMIZADO

---

## Uso

### Passo 1 — Rodar Agente 1

```bash
npm run agente:simulador
```

Copiar o bloco **DIAGNÓSTICO CAPTURADO** e salvar em `ultimo-diag.txt`.

### Passo 2 — Rodar Agente 2

```bash
OPENAI_API_KEY=sk-... DIAGNOSTICO_FILE=ultimo-diag.txt npm run agente:auditor
```

Copiar toda a saída do Auditor e salvar em `ultima-auditoria.txt`.

### Passo 3 — Rodar Agente 3

```bash
npm run agente:otimizador
```

Ou com caminhos customizados:

```bash
DIAGNOSTICO_FILE=diag.txt AUDITORIA_FILE=audit.txt OPENAI_API_KEY=sk-... npm run agente:otimizador
```

---

## Saída

```
COMPARAÇÃO — NOEL (Agente 3 — Otimizador)

🔹 ORIGINAL:
...

🔹 OTIMIZADO:
...
```

---

## Como decidir

- Se o **otimizado** estiver claramente melhor (mais direto, mais humano, mais impacto) → aí sim você ajusta o prompt do Noel.
- **Não automatize** a troca: você decide com base na comparação.

---

## Regra

Não altere o Noel em produção com base em 1 teste. Rode 2 ou 3 ciclos (original → auditor → otimizado) e só então faça ajustes cirúrgicos.
