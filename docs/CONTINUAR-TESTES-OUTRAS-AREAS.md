# Continuar Testes — Outras Áreas

**Data:** 20/03/2026  
**Status:** Área Estética testada e corrigida ✅

---

## Onde paramos

### ✅ Área Estética (teste-interno-11)
- **Status:** Testada e funcionando
- **Correções aplicadas:**
  - Fallback para buscar perfil por `user_profiles.perfil`
  - Normalização de `area_specific` (parse JSON)
  - Agente com contexto isolado (não herda sessão do navegador)
- **Resultado:** Noel funcionando, links clicáveis confirmados

---

## Próximas áreas para testar

### Contas disponíveis (12 áreas):

| # | Email | Área | Status |
|---|-------|------|--------|
| 01 | teste-interno-01@teste.ylada.com | ylada (matriz) | ⬜ Pendente |
| 02 | teste-interno-02@teste.ylada.com | ylada (matriz) | ⬜ Pendente |
| 03 | teste-interno-03@teste.ylada.com | nutri | ⬜ Pendente |
| 04 | teste-interno-04@teste.ylada.com | coach | ⬜ Pendente |
| 05 | teste-interno-05@teste.ylada.com | seller | ⬜ Pendente |
| 06 | teste-interno-06@teste.ylada.com | nutra | ⬜ Pendente |
| 07 | teste-interno-07@teste.ylada.com | med | ⬜ Pendente |
| 08 | teste-interno-08@teste.ylada.com | psi | ⬜ Pendente |
| 09 | teste-interno-09@teste.ylada.com | odonto | ⬜ Pendente |
| 10 | teste-interno-10@teste.ylada.com | fitness | ⬜ Pendente |
| 11 | teste-interno-11@teste.ylada.com | estética | ✅ Testada |
| 12 | teste-interno-12@teste.ylada.com | perfumaria | ⬜ Pendente |

---

## Como testar

### Opção 1: Testar área por área (recomendado para validação detalhada)

```bash
# Nutrição
TESTE_EMAIL=teste-interno-03@teste.ylada.com npm run agente:interno

# Medicina
TESTE_EMAIL=teste-interno-07@teste.ylada.com npm run agente:interno

# Psicologia
TESTE_EMAIL=teste-interno-08@teste.ylada.com npm run agente:interno

# Odontologia
TESTE_EMAIL=teste-interno-09@teste.ylada.com npm run agente:interno

# Fitness
TESTE_EMAIL=teste-interno-10@teste.ylada.com npm run agente:interno

# Coach
TESTE_EMAIL=teste-interno-04@teste.ylada.com npm run agente:interno

# Seller
TESTE_EMAIL=teste-interno-05@teste.ylada.com npm run agente:interno

# Nutra
TESTE_EMAIL=teste-interno-06@teste.ylada.com npm run agente:interno

# Perfumaria
TESTE_EMAIL=teste-interno-12@teste.ylada.com npm run agente:interno
```

### Opção 2: Testar todas as áreas de uma vez (sem Noel)

```bash
# Testa todas as 12 áreas em sequência (pula Noel, foca em navegação/estrutura)
TESTE_TODAS_AREAS=1 npm run agente:interno
```

**Resultado:** Relatório consolidado em `docs/RELATORIO-TODAS-AREAS-INTERNO.md`

### Opção 3: Testar com servidor em outra porta

```bash
URL=http://localhost:3004 TESTE_EMAIL=teste-interno-03@teste.ylada.com npm run agente:interno
```

---

## O que verificar em cada área

### 1. Noel (se não usar SKIP_NOEL)
- ✅ Responde corretamente
- ✅ Gera links quando solicitado
- ✅ Links aparecem clicáveis (markdown funcionando)
- ✅ Personalização por área (linguagem/contexto)

### 2. Navegação e estrutura
- ✅ Login funciona
- ✅ Home/Board carrega
- ✅ Menu específico da área aparece
- ✅ Navegação entre páginas funciona

### 3. Funcionalidades básicas
- ✅ Biblioteca carrega e lista itens
- ✅ Links gerados aparecem na página
- ✅ Configurações acessíveis
- ✅ Perfil empresarial acessível

### 4. Conteúdo por área
- ✅ Textos específicos da área aparecem
- ✅ Templates/filtros corretos na biblioteca
- ✅ Método YLADA (se aplicável à área)

---

## Prioridade de teste

### Alta prioridade (áreas principais)
1. **Nutrição** (teste-interno-03) - Área importante, tem método próprio
2. **Medicina** (teste-interno-07) - Área principal
3. **Psicologia** (teste-interno-08) - Área principal
4. **Odontologia** (teste-interno-09) - Área principal

### Média prioridade
5. **Fitness** (teste-interno-10)
6. **Coach** (teste-interno-04)
7. **Perfumaria** (teste-interno-12)

### Baixa prioridade (pode testar depois)
8. **Seller** (teste-interno-05)
9. **Nutra** (teste-interno-06)
10. **Ylada matriz** (teste-interno-01, 02)

---

## Checklist por área

Após testar cada área, verificar:

- [ ] Login funcionou
- [ ] Home/Board carregou
- [ ] Noel respondeu (se testado)
- [ ] Links foram gerados (se solicitado ao Noel)
- [ ] Biblioteca acessível
- [ ] Links gerados acessíveis
- [ ] Configurações acessíveis
- [ ] Sem erros de console
- [ ] Conteúdo específico da área aparece

---

## Documentar resultados

Após cada teste, verificar:
- `docs/RELATORIO-ULTIMO-TESTE-INTERNO.md` - Relatório do último teste
- `docs/NOEL-RESPOSTAS-TESTE-INTERNO.md` - Conversa do Noel (se testado)
- `docs/noel-respostas-teste-interno.json` - JSON da conversa

Para múltiplas áreas:
- `docs/RELATORIO-TODAS-AREAS-INTERNO.md` - Relatório consolidado

---

## Próximos passos sugeridos

1. **Testar Nutrição** (área importante, tem método próprio)
   ```bash
   TESTE_EMAIL=teste-interno-03@teste.ylada.com npm run agente:interno
   ```

2. **Testar Medicina** (área principal)
   ```bash
   TESTE_EMAIL=teste-interno-07@teste.ylada.com npm run agente:interno
   ```

3. **Testar todas de uma vez** (visão geral)
   ```bash
   TESTE_TODAS_AREAS=1 npm run agente:interno
   ```

---

## Observações

- O agente agora usa contexto isolado (não herda sessão do navegador)
- Perfis estão pré-preenchidos com `node scripts/criar-contas-teste-interno.js`
- Correções de perfil completo já aplicadas no backend
- Agente detecta links renderizados (markdown) corretamente
