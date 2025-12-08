# ✅ CHECKLIST FINAL - ANTES DE COMMIT E DEPLOY

**Data:** 2025-01-27  
**Status:** ⚠️ **REVISÃO FINAL**

---

## ✅ O QUE JÁ FOI FEITO

- [x] ✅ Detector de perfil criado (`profile-detector.ts`)
- [x] ✅ Pipeline de resposta atualizado (`route.ts`)
- [x] ✅ SQL de migração criado e executado com sucesso
- [x] ✅ Script de testes criado
- [x] ✅ Código compatível com estrutura antiga e nova

---

## ⚠️ O QUE AINDA FALTA (ANTES DE COMMIT/DEPLOY)

### 🔴 CRÍTICO (Fazer ANTES do deploy)

#### 1. Atualizar Prompt Mestre no Assistants API

**Status:** ⚠️ **PENDENTE**

**O que fazer:**
1. Acessar: https://platform.openai.com/assistants
2. Encontrar o Assistant configurado em `OPENAI_ASSISTANT_NOEL_ID`
3. Clicar em "Edit"
4. No campo "Instructions", colar o Prompt Mestre completo:

```
Você é o NOEL — Núcleo Oficial de Engajamento e Liderança do Wellness System.

Seu papel é orientar distribuidores Herbalife em vendas, duplicação, liderança e ação diária, usando sempre a linguagem e abordagem adequada ao perfil do usuário.

Regras centrais:

1. Responda exatamente o que foi pedido.
2. Use linguagem simples, direta e prática.
3. Sempre ofereça uma ação imediata (CTA).
4. Evite explicações desnecessárias.
5. Adapte a linguagem ao perfil detectado automaticamente.
6. Nunca recomende medicamentos, diagnósticos ou promessas de saúde.
7. Baseie-se sempre na cultura ética Herbalife.
8. Priorize clareza, movimento e duplicação.

Perfis possíveis do usuário:

- beverage_distributor (vende bebidas funcionais: Energia, Acelera, Turbo Detox, kits R$39,90/49,90)
- product_distributor (vende shake, chá, aloe ou produtos fechados)
- wellness_activator (vende programa + acompanhamento, Portal Fit, transformação 30-60-90 dias)

Se o perfil estiver salvo no banco, use-o.
Se não estiver claro, detecte por palavras-chave ou faça 1 pergunta de clarificação.

Categorias internas que você deve acionar:

- vendas
- convites
- recrutamento
- scripts
- duplicação (fluxo 2-5-10)
- onboarding
- clientes
- plano_presidente

Estrutura da Resposta:

1. Entregar a resposta principal em até 3 linhas.
2. Adicionar um script pronto (se fizer sentido).
3. Finalizar com CTA que mova o usuário para a ação.
4. Sempre pergunte se o usuário quer otimizar, continuar ou ver variações.
```

5. Clicar em "Save"

**⚠️ IMPORTANTE:** Sem isso, o NOEL não terá o comportamento esperado!

---

#### 2. Verificar Variáveis de Ambiente

**Status:** ⚠️ **VERIFICAR**

**Variáveis necessárias:**

**Local (.env.local):**
```env
OPENAI_ASSISTANT_NOEL_ID=asst_xxxxxxxxxxxxx
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Vercel (Production):**
```env
OPENAI_ASSISTANT_NOEL_ID=asst_xxxxxxxxxxxxx
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://www.ylada.com
```

**Como verificar:**
1. Verificar se `OPENAI_ASSISTANT_NOEL_ID` está configurado
2. Verificar se o ID está correto
3. Se não estiver, adicionar na Vercel antes do deploy

---

### 🟡 RECOMENDADO (Fazer ANTES do deploy)

#### 3. Testar Localmente

**Status:** ⚠️ **RECOMENDADO**

**O que fazer:**
1. Rodar servidor local:
   ```bash
   npm run dev
   ```

2. Acessar: `http://localhost:3000/pt/wellness/noel`

3. Testar pelo menos 3 perguntas:
   - "Me dá um convite leve."
   - "Como vendo o turbo detox?"
   - "O que é 2-5-10?"

4. Verificar nos logs:
   - ✅ Perfil sendo detectado
   - ✅ Respostas personalizadas
   - ✅ Sem erros no console

---

### 🟢 OPCIONAL (Pode fazer DEPOIS do deploy)

#### 4. Testes Automáticos

**Status:** 🟢 **OPCIONAL**

**O que fazer:**
- Executar `scripts/testar-noel-completo.ts` quando autenticação estiver configurada
- Ou testar manualmente via interface web

---

## 📋 CHECKLIST FINAL

Antes de fazer commit e deploy, confirme:

- [ ] ✅ Migração SQL executada com sucesso
- [ ] ⚠️ **Prompt Mestre atualizado no Assistants API** (CRÍTICO)
- [ ] ⚠️ **Variáveis de ambiente verificadas** (CRÍTICO)
- [ ] 🟡 Testado localmente (recomendado)
- [ ] 🟢 Código revisado

---

## 🚀 APÓS CONFIRMAR TUDO

### Commit:
```bash
git add .
git commit -m "feat: implementar detecção de perfil e pipeline completo do NOEL

- Adiciona detector de perfil automático (3 perfis)
- Atualiza pipeline de resposta com contexto de perfil
- Adiciona colunas profile_type, category_detected, thread_id
- Cria tabela noel_user_settings
- Compatível com estrutura antiga e nova"
```

### Deploy:
```bash
git push
# Deploy automático na Vercel
```

---

## ⚠️ ATENÇÃO

**NÃO fazer commit/deploy se:**
- ❌ Prompt Mestre não foi atualizado no Assistants API
- ❌ Variáveis de ambiente não estão configuradas
- ❌ Migração SQL não foi executada (mas você já confirmou que foi ✅)

**PODE fazer commit/deploy se:**
- ✅ Migração SQL executada
- ✅ Prompt Mestre atualizado
- ✅ Variáveis verificadas
- ✅ Testado localmente (ou vai testar em produção)

---

## 📝 RESUMO

**O que falta:**
1. ⚠️ Atualizar Prompt Mestre no Assistants API (5 minutos)
   - 📄 Arquivo pronto: `docs/PROMPT-MESTRE-NOEL-PARA-COPIAR.txt`
   - 📋 Instruções: `docs/INSTRUCOES-ATUALIZAR-PROMPT-MESTRE.md`

2. ⚠️ Verificar variáveis de ambiente (2 minutos)
   - ✅ Local: Verificado e OK
   - ⚠️ Vercel: Verificar se está configurado

3. 🟡 Testar localmente (10 minutos)
   - 📖 Guia completo: `docs/GUIA-TESTE-RAPIDO-NOEL.md`
   - 🚀 Script rápido: `scripts/teste-rapido-noel.sh`

**Total estimado:** ~7-17 minutos

**Depois disso:** ✅ Pronto para commit + deploy!

---

**Última atualização:** 2025-01-27
