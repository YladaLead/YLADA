# Status — Agentes e testes da plataforma YLADA

**Atualizado:** 18/03/2025

---

## Onde paramos

### Agentes (scripts/agents/)

| Agente | Arquivo | Status | Descrição |
|--------|---------|--------|-----------|
| **1. Simulador** | `ylada-simulador.ts` | ✅ Pronto | Percorre funil (landing → quiz → resultado → CTA WhatsApp). Captura diagnóstico para o Agente 2. Suporta `FUNIL_PATH` por área (estética, med, perfumaria, etc.). |
| **2. Auditor Noel** | `ylada-auditor-noel.ts` | ✅ Pronto | Avalia diagnóstico (Clareza, Personalização, Coerência, Impacto, Humanização). Usa `OPENAI_API_KEY` ou imprime prompt para ChatGPT. |
| **3. Otimizador** | `ylada-otimizador-noel.ts` | ✅ Pronto | Lê diagnóstico + auditoria → gera versão otimizada. Modo LAB: mostra ORIGINAL vs OTIMIZADO. |
| **4. Parte interna** | `ylada-interno.ts` | ✅ Pronto | Login + percurso completo (Board, Perfil, Noel, Configurações, Botões, Fluxos, Biblioteca, Links, Aparência). Gera tabela ✅/⚠️/❌ para perfil ylada (matriz). |

**Fluxo atual 1 → 2 → 3:** manual. É preciso rodar o simulador, copiar o diagnóstico para `ultimo-diag.txt`, rodar o auditor, copiar a saída para `ultima-auditoria.txt`, depois rodar o otimizador.

**Comandos:** `npm run agente:simulador`, `npm run agente:auditor`, `npm run agente:otimizador`, `npm run agente:interno` (parte interna; use `URL=http://localhost:3002` se o app estiver em outra porta).

---

### Testes da plataforma

| Tipo | Status | Observação |
|------|--------|------------|
| **Unitários** | ❌ Não existe | Nenhum arquivo `.test.ts`/`.spec.ts` no projeto. |
| **E2E (funil)** | ❌ Não existe | Nenhuma pasta `e2e/` nem Playwright/Cypress configurado. |
| **Scripts pontuais** | ✅ Existem | `test:fase`, `test:strategic-profile`, `test-video-url` (tsx scripts). |
| **Validação manual** | ✅ Documentado | Checklist e plano operacional em `docs/`. Agentes 1–3 funcionam como “testes de funil” executáveis. |

Ou seja: **não há suíte automatizada de testes** (Jest/Vitest/Playwright) no projeto hoje.

---

## Próximos passos sugeridos

### Agentes

1. **Pipeline 1→2→3 automatizado**  
   - Script único (ex.: `ylada-pipeline-noel.ts` ou comando `npm run agente:pipeline`) que:  
     - Roda o simulador e grava o diagnóstico em `ultimo-diag.txt`  
     - Chama o auditor com esse arquivo e grava a saída em `ultima-auditoria.txt`  
     - Chama o otimizador e exibe ORIGINAL vs OTIMIZADO  
   - Opcional: flag para rodar só até auditor (sem otimizador).

2. **Melhorias no simulador**  
   - Ajustar seletores por área (estética, med, nutri, etc.) se algum funil tiver estrutura diferente.  
   - Salvar `ultimo-diag.txt` automaticamente ao terminar (evitar copiar/colar).

3. **Novos agentes (futuro)**  
   - Ex.: agente de relatório consolidado (todas as áreas), ou validação de acessibilidade/performance.

### Testes da plataforma

1. **Introduzir suíte de testes**  
   - **E2E:** Playwright (já usa browser, alinha com o simulador).  
   - **Unitários:** Vitest (rápido, bom com TypeScript/Next).  
   - Configuração mínima no `package.json` e primeiro teste “smoke” (ex.: home carrega).

2. **Primeiros testes E2E**  
   - Funil principal: landing → CTA → (onboarding) → diagnóstico → resultado → CTA WhatsApp.  
   - Pode reutilizar lógica/URLs do simulador (ex.: `FUNIL_PATH`).

3. **Primeiros testes unitários**  
   - Funções críticas: por exemplo formatação do diagnóstico, regras de negócio do quiz, helpers de texto.

---

## Como retomar

- **Só agentes:** implementar o pipeline 1→2→3 e gravação automática de `ultimo-diag.txt` no simulador.  
- **Só testes:** configurar Vitest + Playwright e criar o primeiro E2E do funil + um unitário de exemplo.  
- **Os dois:** pipeline dos agentes primeiro, depois configuração da suíte de testes e primeiro E2E.

Quando decidir por onde continuar (agentes, testes ou ambos), dá para desdobrar em tarefas concretas passo a passo.
