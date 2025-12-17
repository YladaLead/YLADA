# 📝 REVISÃO DE TEXTOS DA INTERFACE NUTRI

## 🎯 OBJETIVO

Reescrever todos os textos que "falam com programador" para linguagem de nutricionista.

**Regra:** Se o texto pudesse estar em um comentário de código, ele não pode estar na tela.

---

## 🔴 TEXTOS PROBLEMÁTICOS IDENTIFICADOS

### **1. FERRAMENTAS BLOCK**

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 55-56
💡 Dica: As ferramentas pré-definidas (calculadoras, templates) já estão prontas para uso. 
Você pode criar apenas Quizzes personalizados. Acesse suas ferramentas abaixo.
```

**Problemas:**
- "Você pode criar apenas" → explicação técnica
- "Acesse suas ferramentas abaixo" → instrução de sistema
- "pré-definidas" → termo técnico

#### ✅ **VERSÃO REESCRITA:**

```tsx
💡 Dica: Calculadoras e templates já estão prontas pra você usar. 
Quer criar algo personalizado? Comece com um Quiz.
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 64-68
<h3 className="font-semibold text-gray-900 mb-1">
  {carregando ? 'Carregando...' : `${ferramentasCount} ferramentas criadas`}
</h3>
<p className="text-sm text-gray-600">
  Acesse todas as suas ferramentas e gerencie seus links de captação
</p>
```

**Problemas:**
- "Acesse todas as suas ferramentas" → instrução de sistema
- "gerencie seus links" → termo técnico

#### ✅ **VERSÃO REESCRITA:**

```tsx
<h3 className="font-semibold text-gray-900 mb-1">
  {carregando ? 'Carregando...' : `${ferramentasCount} ferramentas criadas`}
</h3>
<p className="text-sm text-gray-600">
  Veja suas ferramentas e links de captação
</p>
```

---

### **2. GSAL BLOCK**

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 72-76
<h3 className="text-lg font-semibold text-gray-900 mb-2">
  🔒 Complete o Dia 1 da Jornada
</h3>
<p className="text-sm text-gray-600 mb-6">
  A Gestão GSAL será desbloqueada após você concluir o primeiro dia da sua jornada de transformação.
</p>
```

**Problemas:**
- "será desbloqueada" → explicação de sistema
- "após você concluir" → instrução técnica
- "jornada de transformação" → termo genérico

#### ✅ **VERSÃO REESCRITA:**

```tsx
<h3 className="text-lg font-semibold text-gray-900 mb-2">
  🔒 Complete o Dia 1 primeiro
</h3>
<p className="text-sm text-gray-600 mb-6">
  Quando chegar a hora, eu te aviso. Por enquanto, vamos organizar sua base.
</p>
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 94-96
💡 Dica: A LYA usa os dados do seu GSAL para te orientar com precisão. 
Mantenha seus números atualizados para receber orientações mais personalizadas.
```

**Problemas:**
- "usa os dados" → explicação técnica
- "Mantenha seus números atualizados" → instrução de sistema
- "orientações mais personalizadas" → termo técnico

#### ✅ **VERSÃO REESCRITA:**

```tsx
💡 Dica: Quanto mais atualizado estiver seu GSAL, melhor eu consigo te orientar.
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 103-106
<h3 className="font-semibold text-gray-900 mb-1">Resumo GSAL</h3>
<p className="text-xs text-gray-500">
  Números essenciais do seu negócio
</p>
```

**Problemas:**
- "Resumo GSAL" → termo técnico
- "Números essenciais" → pode ser mais claro

#### ✅ **VERSÃO REESCRITA:**

```tsx
<h3 className="font-semibold text-gray-900 mb-1">Como está seu negócio hoje</h3>
<p className="text-xs text-gray-500">
  Veja seus números principais
</p>
```

---

### **3. BIBLIOTECA BLOCK**

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 37-38
title="🎒 Biblioteca / Materiais Extras"
subtitle="Recursos de apoio para sua jornada"
```

**Problemas:**
- "Recursos de apoio" → termo genérico
- "Materiais Extras" → pode ser mais claro

#### ✅ **VERSÃO REESCRITA:**

```tsx
title="🎒 Biblioteca"
subtitle="Materiais que vão te ajudar no dia a dia"
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 12
description: 'Guia completo de uso do sistema'
```

**Problemas:**
- "uso do sistema" → termo técnico

#### ✅ **VERSÃO REESCRITA:**

```tsx
description: 'Guia completo da plataforma'
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 18
description: 'Vídeos explicativos das funcionalidades'
```

**Problemas:**
- "funcionalidades" → termo técnico

#### ✅ **VERSÃO REESCRITA:**

```tsx
description: 'Vídeos que explicam como usar'
```

---

### **4. ANOTAÇÕES BLOCK**

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 19-20
title="📝 Minhas Anotações"
subtitle="Registre seus insights e aprendizados"
```

**Problemas:**
- "Registre" → instrução de sistema
- "insights" → termo técnico/coach

#### ✅ **VERSÃO REESCRITA:**

```tsx
title="📝 Minhas Anotações"
subtitle="Anote o que você aprendeu hoje"
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 27
placeholder="Escreva seus insights e aprendizados aqui..."
```

**Problemas:**
- "insights" → termo técnico

#### ✅ **VERSÃO REESCRITA:**

```tsx
placeholder="O que você aprendeu hoje? Anote aqui..."
```

---

### **5. JORNADA BLOCK**

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 42-47
<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
  Jornada de Transformação YLADA
</h2>
<p className="text-gray-700 text-sm sm:text-base">
  Você não precisa fazer tudo. Você precisa fazer o próximo passo certo.
</p>
```

**Problemas:**
- "Jornada de Transformação" → termo genérico/coach
- Texto está bom, mas pode ser mais direto

#### ✅ **VERSÃO REESCRITA:**

```tsx
<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
  Sua Jornada de 30 Dias
</h2>
<p className="text-gray-700 text-sm sm:text-base">
  Você não precisa fazer tudo. Só o próximo passo certo.
</p>
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 53
<p className="text-gray-600 text-sm">Carregando progresso...</p>
```

**Problemas:**
- "Carregando progresso" → pode ser mais humano

#### ✅ **VERSÃO REESCRITA:**

```tsx
<p className="text-gray-600 text-sm">Carregando...</p>
```

---

### **6. PILARES BLOCK**

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 48-49
title="Os 5 Pilares do Método YLADA"
subtitle="A base sólida da sua transformação profissional"
```

**Problemas:**
- "base sólida" → termo genérico
- "transformação profissional" → termo coach

#### ✅ **VERSÃO REESCRITA:**

```tsx
title="Os 5 Pilares do Método YLADA"
subtitle="O que você precisa saber para crescer"
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 12
description: 'Fundamentos da transformação profissional'
```

**Problemas:**
- "Fundamentos" → termo acadêmico
- "transformação profissional" → termo coach

#### ✅ **VERSÃO REESCRITA:**

```tsx
description: 'Como pensar e agir como Nutri-Empresária'
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 19
description: 'Rotina diária que gera resultados'
```

**Problemas:**
- "gera resultados" → termo genérico

#### ✅ **VERSÃO REESCRITA:**

```tsx
description: 'Rotina que funciona no dia a dia'
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 26
description: 'Estratégias para captar leads diários'
```

**Problemas:**
- "captar leads" → termo técnico de marketing

#### ✅ **VERSÃO REESCRITA:**

```tsx
description: 'Como fazer clientes chegarem até você'
```

---

#### ❌ **TEXTO ATUAL (PROBLEMÁTICO):**

```tsx
// Linha 40
description: 'Sistema completo de gestão'
```

**Problemas:**
- "Sistema completo" → termo técnico

#### ✅ **VERSÃO REESCRITA:**

```tsx
description: 'Como organizar suas clientes do início ao fim'
```

---

## 📋 RESUMO DE MUDANÇAS

### **PADRÕES IDENTIFICADOS:**

1. **"Você pode..."** → Remover ou reescrever
2. **"Acesse..."** → "Veja..." ou "Vamos..."
3. **"Gerencie..."** → "Cuide de..." ou "Organize..."
4. **"Será desbloqueado..."** → "Quando chegar a hora..."
5. **"Funcionalidades"** → "Como usar"
6. **"Sistema"** → "Plataforma" ou remover
7. **"Recursos"** → "Ferramentas" ou "Materiais"
8. **"Insights"** → "O que você aprendeu"
9. **"Leads"** → "Clientes" ou "Pessoas interessadas"
10. **"Transformação profissional"** → Remover ou simplificar

---

## ✅ CHECKLIST DE APLICAÇÃO

Para cada texto revisado:

- [ ] Remove explicações de sistema
- [ ] Remove termos técnicos
- [ ] Usa linguagem do dia a dia
- [ ] Foca em ação, não explicação
- [ ] Responde: "O que é isso pra mim?" ou "O que eu faço agora?"
- [ ] Soa como conversa, não manual

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Aplicar mudanças nos componentes identificados
2. ✅ Revisar outros componentes (Sidebar, Diagnóstico, etc.)
3. ✅ Criar guia de microcopy oficial
4. ✅ Treinar time para usar essas regras

---

**Documento criado para revisão sistemática de textos.**
**Aplicar mudanças gradualmente, testando impacto.**
