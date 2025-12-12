# 🧪 Sequência de Testes - NOEL Vendedor (Página de Vendas)

**Objetivo:** Validar se o NOEL está respondendo de forma coerente, focada em vendas e com direcionamento adequado.

**Página de Teste:** `/pt/wellness` (página de vendas do Wellness System)

**Componente:** `SalesSupportChat` (botão flutuante no canto inferior direito)

---

## 📋 Checklist de Validação

Para cada resposta do NOEL, verifique:

- ✅ **Estrutura de 4 etapas:** Acolhimento → Clareza → Benefício + Recursos → Próximo Passo
- ✅ **Foco em vendas:** Promove recursos do sistema e conduz para checkout
- ✅ **Links incluídos:** Quando menciona planos, inclui link funcional
- ✅ **Tom acolhedor:** Linguagem simples, humana e empática
- ✅ **Extração de dados:** Pede nome, email ou informações quando apropriado
- ✅ **Promoção de recursos:** Menciona scripts, ferramentas, IA após assinatura
- ✅ **Coerência:** Respostas fazem sentido e são relevantes
- ❌ **Sem termos técnicos:** Não menciona APIs, servidores, banco de dados
- ❌ **Sem pressão:** Não força venda, apenas convida

---

## 🎯 CATEGORIA 1: Perguntas Iniciais e Apresentação

### Teste 1.1 - Apresentação Inicial
**Pergunta:** "Olá, quem é você?"

**O que verificar:**
- ✅ Se apresenta como NOEL
- ✅ Se menciona que é assistente do Wellness System
- ✅ Se oferece ajuda de forma acolhedora
- ✅ Se menciona recursos disponíveis após assinatura

---

### Teste 1.2 - O que é o Wellness System
**Pergunta:** "O que é o Wellness System?"

**O que verificar:**
- ✅ Explicação clara e simples (2-3 frases)
- ✅ Foco em benefícios, não características técnicas
- ✅ Menciona recursos disponíveis após assinatura
- ✅ Conduz para próximo passo (pergunta sobre necessidade ou oferece link)

---

### Teste 1.3 - Como Funciona
**Pergunta:** "Como funciona?"

**O que verificar:**
- ✅ Explicação prática e direta
- ✅ Conecta com a vida real do usuário
- ✅ Menciona scripts personalizados, ferramentas, IA
- ✅ Próximo passo claro (extração de info ou link)

---

## 💰 CATEGORIA 2: Planos e Preços

### Teste 2.1 - Informação sobre Planos
**Pergunta:** "Quais são os planos disponíveis?"

**O que verificar:**
- ✅ Menciona plano mensal e anual
- ✅ **CRÍTICO:** Inclui links funcionais para ambos os planos
- ✅ Explica diferenças de forma simples
- ✅ Conduz para escolha ou pergunta sobre necessidade

---

### Teste 2.2 - Preço do Plano Anual
**Pergunta:** "Quanto custa o plano anual?"

**O que verificar:**
- ✅ Informa preço (R$ 59,90/mês ou valor total)
- ✅ **CRÍTICO:** Inclui link do plano anual
- ✅ Menciona benefícios do plano anual
- ✅ Próximo passo (pergunta nome/email ou oferece link)

---

### Teste 2.3 - Preço do Plano Mensal
**Pergunta:** "Quanto custa o plano mensal?"

**O que verificar:**
- ✅ Informa preço
- ✅ **CRÍTICO:** Inclui link do plano mensal
- ✅ Menciona benefícios
- ✅ Próximo passo

---

### Teste 2.4 - Diferença entre Planos
**Pergunta:** "Qual a diferença entre o plano mensal e anual?"

**O que verificar:**
- ✅ Explicação clara das diferenças
- ✅ Menciona economia do anual
- ✅ **CRÍTICO:** Inclui links para ambos
- ✅ Ajuda a escolher baseado em necessidade

---

### Teste 2.5 - Qual Plano Escolher
**Pergunta:** "Qual plano é melhor para mim?"

**O que verificar:**
- ✅ Faz perguntas para entender necessidade
- ✅ Extrai informações (tempo disponível, objetivo)
- ✅ Recomenda baseado em perfil
- ✅ **CRÍTICO:** Inclui link do plano recomendado

---

## 🎁 CATEGORIA 3: Recursos e Benefícios

### Teste 3.1 - Scripts Disponíveis
**Pergunta:** "Vocês têm scripts prontos?"

**O que verificar:**
- ✅ Confirma que tem scripts
- ✅ Menciona que são personalizados
- ✅ Explica que IA conhece o usuário
- ✅ **CRÍTICO:** Menciona que está disponível após assinatura
- ✅ Conduz para checkout ou pede informações

---

### Teste 3.2 - Ferramentas de Captação
**Pergunta:** "Quais ferramentas vocês oferecem?"

**O que verificar:**
- ✅ Lista ferramentas (quizzes, diagnósticos, etc.)
- ✅ Explica benefícios práticos
- ✅ **CRÍTICO:** Menciona que está disponível após assinatura
- ✅ Conecta com necessidade do usuário
- ✅ Próximo passo

---

### Teste 3.3 - Inteligência Artificial
**Pergunta:** "Como funciona a IA?"

**O que verificar:**
- ✅ Explicação simples (sem termos técnicos)
- ✅ Foco em benefício: "conhece você e se dedica ao seu sucesso"
- ✅ Menciona personalização
- ✅ **CRÍTICO:** Disponível após assinatura
- ✅ Próximo passo

---

### Teste 3.4 - NOEL Mentor
**Pergunta:** "O que é o NOEL Mentor?"

**O que verificar:**
- ✅ Explica que é assistente 24/7
- ✅ Menciona orientação personalizada
- ✅ **CRÍTICO:** Disponível após assinatura
- ✅ Conecta com necessidade
- ✅ Próximo passo

---

### Teste 3.5 - Materiais de Divulgação
**Pergunta:** "Vocês têm materiais prontos para divulgação?"

**O que verificar:**
- ✅ Confirma biblioteca de materiais
- ✅ Menciona imagens, vídeos, textos
- ✅ **CRÍTICO:** Disponível após assinatura
- ✅ Próximo passo

---

## 🛒 CATEGORIA 4: Fechamento e Checkout

### Teste 4.1 - Pedido de Link
**Pergunta:** "Me manda o link para comprar"

**O que verificar:**
- ✅ **CRÍTICO:** Inclui link funcional (não placeholder)
- ✅ Pergunta qual plano (mensal ou anual)
- ✅ Se não especificar, oferece ambos com links
- ✅ Extrai informações (nome, email) se possível

---

### Teste 4.2 - Interesse em Comprar
**Pergunta:** "Quero assinar agora"

**O que verificar:**
- ✅ Acolhe entusiasmo
- ✅ Pergunta qual plano
- ✅ **CRÍTICO:** Inclui link do plano escolhido
- ✅ Pede informações básicas (nome, email) para melhor atendimento
- ✅ Reforça benefícios

---

### Teste 4.3 - Dúvida Antes de Comprar
**Pergunta:** "Estou pensando em assinar, mas tenho dúvidas"

**O que verificar:**
- ✅ Acolhe a dúvida
- ✅ Pergunta qual a dúvida específica
- ✅ Esclarece de forma clara
- ✅ Reforça benefícios e recursos
- ✅ Conduz para checkout

---

### Teste 4.4 - Objeção de Preço
**Pergunta:** "Está muito caro"

**O que verificar:**
- ✅ Acolhe a preocupação
- ✅ Explica valor (não apenas preço)
- ✅ Menciona todos os recursos incluídos
- ✅ Compara com custo-benefício
- ✅ Oferece plano mensal como alternativa
- ✅ **CRÍTICO:** Inclui links

---

### Teste 4.5 - Objeção de Tempo
**Pergunta:** "Não tenho tempo para usar"

**O que verificar:**
- ✅ Acolhe a preocupação
- ✅ Explica que sistema economiza tempo
- ✅ Menciona scripts prontos, ferramentas automáticas
- ✅ Explica que IA facilita tudo
- ✅ Conduz para checkout

---

## ❓ CATEGORIA 5: Objeções Comuns

### Teste 5.1 - Garantia
**Pergunta:** "Tem garantia?"

**O que verificar:**
- ✅ Informa política de garantia (se houver)
- ✅ Explica de forma clara
- ✅ Reforça confiança no produto
- ✅ Próximo passo

---

### Teste 5.2 - Suporte
**Pergunta:** "E se eu tiver problema? Vocês dão suporte?"

**O que verificar:**
- ✅ Confirma suporte disponível
- ✅ Menciona NOEL 24/7
- ✅ Explica canais de contato
- ✅ Reforça que não está sozinho
- ✅ Próximo passo

---

### Teste 5.3 - Resultados Garantidos
**Pergunta:** "Vocês garantem resultados?"

**O que verificar:**
- ✅ **CRÍTICO:** Não promete resultados garantidos
- ✅ Explica que sistema oferece ferramentas e orientação
- ✅ Menciona que resultados dependem de uso
- ✅ Foca em benefícios e recursos
- ✅ Próximo passo

---

### Teste 5.4 - Comparação com Concorrentes
**Pergunta:** "É melhor que [concorrente]?"

**O que verificar:**
- ✅ **CRÍTICO:** Não critica concorrentes
- ✅ Foca nos próprios benefícios
- ✅ Explica diferenciais (scripts personalizados, IA)
- ✅ Próximo passo

---

## 🔧 CATEGORIA 6: Suporte Leve (Acesso)

### Teste 6.1 - Não Recebeu Acesso
**Pergunta:** "Paguei mas não recebi o acesso"

**O que verificar:**
- ✅ Acolhe com calma
- ✅ Explica que acesso chega em poucos minutos
- ✅ Orienta verificar spam/promos
- ✅ Pede informações (nome, email)
- ✅ Encaminha para suporte se necessário
- ✅ **CRÍTICO:** Não menciona "erro no sistema"

---

### Teste 6.2 - Problema de Login
**Pergunta:** "Não consigo fazer login"

**O que verificar:**
- ✅ Acolhe
- ✅ Orienta verificar email/senha
- ✅ Pede informações para verificar
- ✅ Encaminha para suporte se necessário
- ✅ **CRÍTICO:** Não menciona termos técnicos

---

### Teste 6.3 - Esqueci a Senha
**Pergunta:** "Esqueci minha senha"

**O que verificar:**
- ✅ Acolhe
- ✅ Orienta sobre recuperação
- ✅ Pede informações para verificar
- ✅ Encaminha para suporte
- ✅ **CRÍTICO:** Não menciona processos técnicos

---

## 🎯 CATEGORIA 7: Necessidades Específicas

### Teste 7.1 - Script para Vendas
**Pergunta:** "Preciso de um script para vender"

**O que verificar:**
- ✅ Confirma que tem scripts de vendas
- ✅ **CRÍTICO:** Menciona que está disponível após assinatura
- ✅ Explica que são personalizados
- ✅ Menciona IA que conhece o usuário
- ✅ Conduz para checkout

---

### Teste 7.2 - Script para Recrutamento
**Pergunta:** "Preciso de script para recrutar"

**O que verificar:**
- ✅ Confirma que tem scripts de recrutamento
- ✅ **CRÍTICO:** Menciona que está disponível após assinatura
- ✅ Explica personalização
- ✅ Conduz para checkout

---

### Teste 7.3 - Ferramenta Específica
**Pergunta:** "Vocês têm quiz de perfil nutricional?"

**O que verificar:**
- ✅ Confirma se tem ou não
- ✅ Se tem: explica benefícios
- ✅ **CRÍTICO:** Menciona que está disponível após assinatura
- ✅ Se não tem: menciona outras ferramentas disponíveis
- ✅ Conduz para checkout

---

### Teste 7.4 - Começar do Zero
**Pergunta:** "Estou começando do zero, o sistema ajuda?"

**O que verificar:**
- ✅ Acolhe e encoraja
- ✅ Explica que sistema é perfeito para iniciantes
- ✅ Menciona scripts prontos, orientação, ferramentas
- ✅ Explica que IA vai conhecer e ajudar
- ✅ **CRÍTICO:** Inclui link
- ✅ Próximo passo

---

## 🚫 CATEGORIA 8: Validação de Proibições

### Teste 8.1 - Pergunta Técnica
**Pergunta:** "Qual tecnologia vocês usam? É React ou Vue?"

**O que verificar:**
- ✅ **CRÍTICO:** Não menciona tecnologias
- ✅ Responde que não precisa saber isso
- ✅ Foca em benefícios para o usuário
- ✅ Próximo passo

---

### Teste 8.2 - Pergunta sobre Processos Internos
**Pergunta:** "Como vocês fazem a personalização? É com machine learning?"

**O que verificar:**
- ✅ **CRÍTICO:** Não explica processos internos
- ✅ Foca em benefício: "o sistema conhece você"
- ✅ Explica resultado, não processo
- ✅ Próximo passo

---

### Teste 8.3 - Pressão de Venda
**Pergunta:** "Ainda estou pensando"

**O que verificar:**
- ✅ **CRÍTICO:** Não pressiona
- ✅ Acolhe e respeita o tempo
- ✅ Oferece ajuda para esclarecer dúvidas
- ✅ Menciona que está disponível quando decidir
- ✅ Mantém tom acolhedor

---

## 📊 CATEGORIA 9: Fluxo Completo de Venda

### Teste 9.1 - Fluxo Completo (Simulação)
**Sequência de perguntas:**

1. "Olá, o que é o Wellness System?"
2. "Quanto custa?"
3. "O que está incluído?"
4. "Quero assinar"

**O que verificar:**
- ✅ Cada resposta segue estrutura de 4 etapas
- ✅ Respostas são coerentes entre si
- ✅ Constrói confiança progressivamente
- ✅ Extrai informações ao longo da conversa
- ✅ **CRÍTICO:** Inclui links quando apropriado
- ✅ Conduz naturalmente para fechamento

---

### Teste 9.2 - Fluxo com Objeções
**Sequência de perguntas:**

1. "Quero saber mais sobre o sistema"
2. "Mas está caro"
3. "E se eu não usar?"
4. "Ok, me manda o link"

**O que verificar:**
- ✅ Trata objeções de forma acolhedora
- ✅ Remove objeções com clareza
- ✅ Mantém foco em valor
- ✅ **CRÍTICO:** Inclui link no final
- ✅ Fecha de forma natural

---

## ✅ Checklist Final de Validação

Após todos os testes, verifique:

- [ ] **Estrutura:** Todas as respostas seguem 4 etapas?
- [ ] **Links:** Todos os links estão funcionais e incluídos quando apropriado?
- [ ] **Tom:** Linguagem sempre acolhedora, simples e humana?
- [ ] **Foco em Vendas:** Sempre promove recursos e conduz para checkout?
- [ ] **Extração:** Pede informações (nome, email) quando apropriado?
- [ ] **Promoção:** Sempre menciona que recursos estão disponíveis após assinatura?
- [ ] **Coerência:** Respostas fazem sentido e são relevantes?
- [ ] **Proibições:** Não menciona termos técnicos, não pressiona, não critica concorrentes?
- [ ] **Suporte Leve:** Quando detecta problema de acesso, acolhe e orienta sem termos técnicos?

---

## 📝 Template de Registro de Teste

Para cada teste, registre:

```
TESTE: [Número e Nome]
PERGUNTA: [Pergunta feita]
RESPOSTA: [Resposta do NOEL]

✅ Estrutura 4 etapas: [SIM/NÃO]
✅ Link incluído: [SIM/NÃO - qual link]
✅ Tom acolhedor: [SIM/NÃO]
✅ Foco em vendas: [SIM/NÃO]
✅ Extração de dados: [SIM/NÃO - quais dados]
✅ Promoção de recursos: [SIM/NÃO - quais recursos]
✅ Coerência: [SIM/NÃO]
❌ Termos técnicos: [NÃO/SIM - quais termos]
❌ Pressão: [NÃO/SIM]

OBSERVAÇÕES:
[Anotações sobre o que funcionou bem ou precisa melhorar]
```

---

## 🎯 Prioridades de Teste

**ALTA PRIORIDADE (Testar Primeiro):**
- Categoria 2: Planos e Preços (todos os testes)
- Categoria 4: Fechamento e Checkout (todos os testes)
- Categoria 7: Necessidades Específicas (todos os testes)

**MÉDIA PRIORIDADE:**
- Categoria 1: Perguntas Iniciais
- Categoria 3: Recursos e Benefícios
- Categoria 5: Objeções Comuns

**BAIXA PRIORIDADE (Mas Importante):**
- Categoria 6: Suporte Leve
- Categoria 8: Validação de Proibições
- Categoria 9: Fluxo Completo

---

## 🔍 Dicas para Testar

1. **Teste em sequência:** Faça os testes em ordem para verificar consistência
2. **Teste em contexto:** Use a página real `/pt/wellness`
3. **Anote tudo:** Registre cada resposta detalhadamente
4. **Teste links:** Clique nos links para verificar se funcionam
5. **Simule usuário real:** Faça perguntas como um cliente real faria
6. **Teste objeções:** Não tenha medo de testar objeções difíceis
7. **Valide estrutura:** Sempre verifique se a resposta tem as 4 etapas

---

**Última atualização:** 2025-01-27
**Versão do NOEL:** Vendedor (Sales Support) - Lousa Oficial v1.0
