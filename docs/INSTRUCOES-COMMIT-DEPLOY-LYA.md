# 📋 INSTRUÇÕES - Commit e Deploy LYA

**Siga estes passos para fazer commit e deploy:**

---

## ✅ PASSO 1: Verificar arquivos no staging

Execute:
```bash
git status
```

Você deve ver arquivos como:
- `src/components/nutri/LyaAnaliseHoje.tsx`
- `src/app/api/nutri/lya/analise/route.ts`
- `src/app/api/nutri/diagnostico/`
- `src/app/api/nutri/ai/`
- `migrations/151-*` e `migrations/152-*`
- etc.

---

## ✅ PASSO 2: Fazer Commit

Execute:
```bash
git commit -m "feat: Implementar LYA - Mentora Estratégica para Nutricionistas

- Adicionar formulário de diagnóstico obrigatório
- Implementar geração automática de perfil estratégico
- Criar sistema de análise diária da LYA com RAG
- Adicionar tabelas de memória e aprendizado (Fase 1)
- Integrar busca de estado, memória e conhecimento antes de chamar OpenAI (Fase 2)
- Criar componente LyaAnaliseHoje para exibir análise na home
- Adicionar bloqueio de acesso até completar diagnóstico
- Preparar integração com Prompt Object da OpenAI (Responses API)"
```

---

## ✅ PASSO 3: Push para o repositório

Execute:
```bash
git push origin main
```

(ou `git push origin master` se sua branch principal for `master`)

---

## ✅ PASSO 4: Deploy na Vercel

**Opção A: Deploy automático**
- Se a Vercel está conectada ao repositório, o deploy acontece automaticamente após o push

**Opção B: Deploy manual**
1. Acesse: https://vercel.com
2. Vá no seu projeto
3. Clique em "Deployments"
4. Clique em "Redeploy" (se necessário)

---

## ✅ PASSO 5: Verificar após deploy

1. Aguarde o deploy terminar (2-5 minutos)
2. Acesse: `https://www.ylada.com/pt/nutri/home`
3. Faça login
4. Verifique se a análise da LYA aparece

---

## ⚠️ IMPORTANTE

**Antes do deploy, certifique-se de que:**

1. ✅ Variável `LYA_PROMPT_ID` está configurada na Vercel
2. ✅ Tabelas foram criadas no Supabase (migrations 151 e 152)
3. ✅ Variável `OPENAI_API_KEY` está configurada na Vercel

---

## 🔍 Se ainda não aparecer após deploy

1. **Verifique o console do navegador (F12)**
   - Veja se há erros
   - Execute: `fetch('/api/nutri/lya/analise', { credentials: 'include' }).then(r => r.json()).then(console.log)`

2. **Verifique os logs na Vercel**
   - Vá em "Functions" → "Logs"
   - Veja se há erros na API `/api/nutri/lya/analise`

3. **Verifique se o diagnóstico foi completado**
   - O componente só aparece se houver análise salva
   - A análise só é gerada após completar o diagnóstico

---

## ✅ PRONTO!

Após fazer commit, push e deploy, a análise da LYA deve aparecer na home!


