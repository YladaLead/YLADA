# Plano de Testes MVP — Outras Áreas

**Objetivo:** Testar todas as áreas críticas do MVP além do Noel, que já está funcionando.

**Status atual:** ✅ Área Noel — OK para MVP (links clicáveis confirmados)

---

## Áreas críticas para MVP

### 1. ✅ Noel (Concluído)
- **Status:** Funcionando
- **Links:** Clicáveis na interface
- **Próximo passo:** Considerar pronto para MVP

### 2. Biblioteca
- **O que testar:**
  - Listagem de diagnósticos/fluxos por área
  - Filtros (tipo, segmento)
  - Criar link a partir da biblioteca
  - Acesso aos templates

### 3. Links Gerados
- **O que testar:**
  - Listagem de links criados
  - Copiar link
  - Abrir link em nova aba
  - Link funciona para visitantes (sem login)

### 4. Leads
- **O que testar:**
  - Listagem de leads gerados
  - Filtros e busca
  - Dados do lead (nome, telefone, respostas)
  - CTA para contato

### 5. Perfil Empresarial
- **O que testar:**
  - Campos obrigatórios (nome, whatsapp, área)
  - Persistência dos dados
  - Uso pelo Noel (personalização)

### 6. Configurações
- **O que testar:**
  - Alterar dados pessoais
  - Salvar alterações
  - Troca de senha (se aplicável)

### 7. Fluxos Públicos (Páginas /l/[slug])
- **O que testar:**
  - Link abre corretamente
  - Formulário aparece
  - Preenchimento funciona
  - Resultado é exibido
  - CTA WhatsApp funciona

---

## Como adaptar o agente para outras áreas

### Opção 1: Expandir o agente atual
Adicionar novos blocos de teste após o bloco 11:

```typescript
// 12. Leads
// 13. Biblioteca (detalhado)
// 14. Fluxos públicos (E2E completo)
// 15. Perfil empresarial (edição)
```

### Opção 2: Criar agentes especializados
- `ylada-test-leads.ts` — Testa área de leads
- `ylada-test-biblioteca.ts` — Testa biblioteca
- `ylada-test-public-links.ts` — Testa links públicos (funil completo)

### Opção 3: Modo "todas as áreas"
O agente já tem `TESTE_TODAS_AREAS=1` que roda múltiplas contas.
Expandir para testar funcionalidades específicas por área.

---

## Prioridades para MVP

### Alta prioridade (crítico para MVP)
1. ✅ **Noel** — Funcionando
2. **Links públicos** — Visitante consegue preencher e ver resultado
3. **Leads** — Profissional vê os leads gerados
4. **Biblioteca** — Profissional encontra templates

### Média prioridade (importante mas não bloqueante)
5. **Perfil empresarial** — Personalização
6. **Configurações** — Dados pessoais

### Baixa prioridade (pode ficar para depois do MVP)
7. **Fluxos internos** — Criação avançada
8. **Edição de quizzes** — Editor completo

---

## Sugestão de próximos passos

1. **Testar links públicos** (funil completo)
   - Usar o agente `ylada-simulador.ts` que já existe
   - Validar: landing → formulário → resultado → CTA

2. **Testar área de Leads**
   - Criar um lead via link público
   - Verificar se aparece na área de Leads
   - Validar dados do lead

3. **Testar Biblioteca**
   - Acessar biblioteca
   - Filtrar por tipo/segmento
   - Criar link a partir de template

4. **Validar outras áreas** (med, psi, estética, etc.)
   - Usar `TESTE_TODAS_AREAS=1`
   - Verificar se conteúdo muda por área

---

## Comandos úteis

```bash
# Testar área interna completa (já existe)
npm run agente:interno

# Testar todas as áreas (sem Noel)
TESTE_TODAS_AREAS=1 npm run agente:interno

# Testar funil público (simulador)
npm run agente:simulador

# Testar com conta específica
TESTE_EMAIL=teste-interno-03@teste.ylada.com npm run agente:interno
```
