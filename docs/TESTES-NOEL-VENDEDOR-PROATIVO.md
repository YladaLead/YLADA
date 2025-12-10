# 🧪 TESTES ESTRATÉGICOS - NOEL VENDEDOR PROATIVO

## 📋 Perguntas para Validar Comportamento

Use estas perguntas na página de vendas (`/pt/wellness/suporte`) para testar se o NOEL está se comportando como vendedor proativo.

---

## ✅ TESTE 1: Detecção de Oportunidades + Extração de Informações

**Pergunta:** "Como funciona na prática?"

**✅ Comportamento Esperado:**
- Deve explicar brevemente
- Deve mencionar recursos disponíveis após assinatura (scripts, ferramentas, NOEL Mentor)
- Deve extrair informações: "Qual seu nome?" ou "Me diga seu email"
- Deve incluir link de checkout

**❌ Comportamento Incorreto:**
- Apenas explica sem promover recursos
- Não extrai informações
- Não menciona acesso após assinatura
- Não inclui link

---

## ✅ TESTE 2: Pedido de Script (Oportunidade de Venda)

**Pergunta:** "Quero um script de vendas"

**✅ Comportamento Esperado:**
- Deve dizer que o sistema TEM scripts prontos
- Deve mencionar que após assinatura terá acesso completo
- Deve extrair informações (nome/email)
- Deve oferecer link de checkout
- NÃO deve dar o script completo (deve promover o sistema)

**❌ Comportamento Incorreto:**
- Diz que não tem script
- Dá o script sem promover o sistema
- Não menciona acesso após assinatura
- Não extrai informações

---

## ✅ TESTE 3: Pedido Específico (HOM)

**Pergunta:** "Quero um script para recrutar para a HOM"

**✅ Comportamento Esperado:**
- Deve confirmar que o sistema TEM scripts para HOM
- Deve mencionar biblioteca completa de scripts
- Deve mencionar ferramentas e materiais disponíveis
- Deve extrair email: "Me diga seu email que eu te envio o link"
- Deve incluir link de checkout

**❌ Comportamento Incorreto:**
- Diz que não tem ou não sabe
- Não promove recursos do sistema
- Não extrai informações
- Não oferece link

---

## ✅ TESTE 4: Interesse em Comprar

**Pergunta:** "Sim, quero assinar"

**✅ Comportamento Esperado:**
- Deve perguntar: "Você prefere o plano mensal ou anual?"
- Deve mencionar benefícios de cada plano
- Quando escolher, DEVE incluir link real (não placeholder)
- Deve mencionar recursos disponíveis após assinatura

**❌ Comportamento Incorreto:**
- Usa placeholder `[link para o plano anual]`
- Não inclui link real
- Não menciona recursos após assinatura

---

## ✅ TESTE 5: Dúvida sobre Recursos

**Pergunta:** "O que eu ganho com isso?"

**✅ Comportamento Esperado:**
- Deve listar recursos: scripts, ferramentas, fluxos, NOEL Mentor
- Deve mencionar "após assinatura" ou "com a assinatura"
- Deve extrair informações
- Deve oferecer link

**❌ Comportamento Incorreto:**
- Lista apenas benefícios genéricos
- Não menciona recursos específicos (scripts, ferramentas)
- Não menciona acesso após assinatura
- Não extrai informações

---

## ✅ TESTE 6: Objeção (Oportunidade de Converter)

**Pergunta:** "Não sei se é pra mim"

**✅ Comportamento Esperado:**
- Deve acolher a objeção
- Deve conectar com recursos do sistema
- Deve mencionar que após assinatura terá acesso a tudo
- Deve extrair informações para personalizar
- Deve oferecer link

**❌ Comportamento Incorreto:**
- Apenas acolhe sem promover
- Não conecta com recursos
- Não menciona acesso após assinatura
- Não extrai informações

---

## ✅ TESTE 7: Comparação de Planos

**Pergunta:** "Qual a diferença entre mensal e anual?"

**✅ Comportamento Esperado:**
- Deve explicar diferença
- Deve mencionar que AMBOS dão acesso completo a scripts, ferramentas, etc.
- Deve extrair informações: "Qual seu nome? Vou te ajudar a escolher"
- Deve oferecer links de ambos os planos

**❌ Comportamento Incorreto:**
- Explica apenas diferença de preço
- Não menciona recursos disponíveis
- Não extrai informações
- Não oferece links

---

## ✅ TESTE 8: Pedido de Ferramenta

**Pergunta:** "Você tem ferramentas de captação?"

**✅ Comportamento Esperado:**
- Deve confirmar que TEM ferramentas
- Deve mencionar que após assinatura terá acesso completo
- Deve listar tipos de ferramentas disponíveis
- Deve extrair informações
- Deve oferecer link

**❌ Comportamento Incorreto:**
- Diz que não tem ou não sabe
- Não promove o sistema
- Não menciona acesso após assinatura
- Não extrai informações

---

## ✅ TESTE 9: Demonstração de Interesse

**Pergunta:** "Quero começar hoje"

**✅ Comportamento Esperado:**
- Deve perguntar: "Plano mensal ou anual?"
- Deve extrair email: "Me diga seu email que eu te envio o link"
- Deve incluir link real do plano escolhido
- Deve mencionar recursos disponíveis após assinatura

**❌ Comportamento Incorreto:**
- Não extrai informações
- Usa placeholder de link
- Não menciona recursos após assinatura

---

## ✅ TESTE 10: Pergunta Genérica

**Pergunta:** "O que é o Wellness System?"

**✅ Comportamento Esperado:**
- Deve explicar brevemente
- Deve mencionar recursos principais (scripts, ferramentas, NOEL Mentor)
- Deve mencionar acesso após assinatura
- Deve extrair informações
- Deve oferecer link

**❌ Comportamento Incorreto:**
- Explica apenas conceito
- Não promove recursos
- Não menciona acesso após assinatura
- Não extrai informações
- Não oferece link

---

## 📊 CHECKLIST DE VALIDAÇÃO

Para cada resposta, verifique:

- [ ] **Extraiu informações?** (nome, email, necessidades)
- [ ] **Promoveu recursos?** (scripts, ferramentas, fluxos, NOEL Mentor)
- [ ] **Mencionou acesso após assinatura?** ("após assinar", "com a assinatura", "assim que você começar")
- [ ] **Incluiu link real?** (não placeholder, link funcional)
- [ ] **Foi proativo?** (não apenas respondeu, mas conduziu para venda)
- [ ] **Seguiu estrutura?** (Acolhimento → Clareza → Benefício + Recursos → Próximo Passo)

---

## 🚨 SINAIS DE PROBLEMA

Se o NOEL:
- ❌ Diz "não tenho" ou "não posso ajudar com isso"
- ❌ Usa placeholders `[link]` ou `[colocar link]`
- ❌ Não extrai informações do cliente
- ❌ Não menciona recursos após assinatura
- ❌ Não promove o sistema ativamente
- ❌ Apenas responde sem conduzir para venda

**Ação:** Revisar o system prompt e few-shots.

---

## ✅ SINAIS DE SUCESSO

Se o NOEL:
- ✅ Sempre menciona recursos disponíveis após assinatura
- ✅ Sempre extrai informações (nome, email)
- ✅ Sempre inclui links reais (não placeholders)
- ✅ Sempre promove o sistema e seus recursos
- ✅ Conduz ativamente para o fechamento
- ✅ Conecta necessidades com recursos do sistema

**Resultado:** NOEL está se comportando como vendedor proativo! 🎉

---

## 📝 NOTAS

- Teste na página: `/pt/wellness/suporte`
- Use diferentes cenários (interesse, objeção, dúvida, prontidão)
- Verifique se links são funcionais (clicáveis)
- Confirme que não há placeholders
- Valide extração de informações em cada interação
