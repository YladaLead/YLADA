# 📝 AJUSTES DE COPY - INTEGRAÇÃO LYA

**Documento de referência para ajustes de textos e copy em todas as áreas do sistema após a integração da LYA.**

**Data de criação:** 2025-01-13  
**Status:** Em andamento  
**Prioridade:** Alta

---

## 🎯 OBJETIVO

Este documento mapeia todos os ajustes necessários de copy/textos considerando que:

- **Antes:** Conteúdo era para ler e entender
- **Agora:** Conteúdo prepara para ação, LYA ativa a execução

**Princípio central:** O conteúdo não precisa explicar tudo. Precisa preparar a Nutri para agir, e a LYA entra como continuação natural.

---

## 📋 ESTRUTURA DO DOCUMENTO

1. **Pilares do Método** (5 pilares)
2. **Jornada 30 Dias** (textos introdutórios e dias)
3. **Home da Nutri** (blocos e CTAs)
4. **Landing Pages** (promessas e posicionamento)
5. **Exercícios e Ferramentas** (instruções e descrições)
6. **Materiais Complementares** (PDFs e biblioteca)
7. **Onboarding** (fluxo inicial)

---

## 1️⃣ PILARES DO MÉTODO

### **PILAR 1 - FILOSOFIA YLADA**

#### ✅ O que está BOM (manter)
- Mensagem central "o que a faculdade não ensinou"
- Conceito de Nutri como marca, sistema e experiência
- Os 4 fundamentos bem definidos
- Comparação Nutri Tradicional × Nutri-Empresária
- Promessa YLADA alinhada

#### 🔲 Ajustes necessários

**1.1. Seção "O que é ser Nutri-Empresária"**
- [ ] **Arquivo:** `src/types/pilares.ts` (linha ~39)
- [ ] **Ação:** Reduzir tom de "aula", adicionar preparação para ação
- [ ] **Sugestão de ajuste:**
  ```
  A profissional age como marca, não como prestadora.
  
  É sobre comportamento, postura e clareza.
  
  A Nutri-Empresária entende que:
  • ela é a marca
  • ela é o sistema
  • ela é a experiência
  • ela define o padrão do seu atendimento e da sua carreira
  
  Quando você se vê como Nutri-Empresária, tudo muda: como você fala, como você atende, como você se posiciona e como você cresce.
  
  💡 A LYA vai te ajudar a aplicar esses conceitos no seu momento atual, definindo seu posicionamento e o próximo passo certo para você.
  ```

**1.2. Seção "Os 4 fundamentos da Filosofia YLADA"**
- [ ] **Arquivo:** `src/types/pilares.ts` (linha ~55)
- [ ] **Ação:** Conectar cada fundamento a uma decisão prática da LYA
- [ ] **Sugestão de ajuste:**
  ```
  A Filosofia YLADA se sustenta em 4 fundamentos essenciais:
  
  🔹 Identidade
  Quem você é profissionalmente. Como você se vê e como quer ser vista. A identidade define o público, o posicionamento e o nível de autoridade.
  → A LYA usa sua identidade para definir seu posicionamento e o tipo de cliente que você deve atrair agora.
  
  🔹 Postura
  Como você quer ser percebida. Postura não é arrogância — é clareza. Posicionamento não é marketing — é autoconsciência.
  → A LYA ajusta sua comunicação e seus scripts com base na postura que você escolhe sustentar.
  
  🔹 Estrutura
  Como você organiza seu trabalho. Rotina mínima, processos simples, sistemas que mantêm tudo fluindo sem sobrecarga.
  → A LYA sempre prioriza estrutura antes de captação quando detecta desorganização.
  
  🔹 Consistência
  A constância que transforma pequenas ações em grandes resultados. É fazer todos os dias, mesmo nos dias difíceis.
  → A LYA nunca recomenda grandes planos sem rotina mínima definida.
  
  Esses 4 fundamentos trabalham juntos para criar a Nutri-Empresária completa. A LYA utiliza esses fundamentos para decidir seu foco prioritário, o tom da orientação e o próximo passo certo para você.
  ```

**1.3. Seção "O erro silencioso da Nutri brasileira"**
- [ ] **Arquivo:** `src/types/pilares.ts` (linha ~78)
- [ ] **Ação:** Reduzir frases muito longas, inserir transição para LYA
- [ ] **Sugestão de ajuste:**
  ```
  A maioria das nutricionistas vive de improviso, sem estrutura, apagando incêndio.
  
  A diferença entre Nutri Tradicional × Nutri-Empresária:
  
  ❌ Nutri Tradicional:
  • Trabalha reativamente
  • Sem rotina definida
  • Sem processos claros
  • Depende de sorte e indicações ocasionais
  • Vive no modo "apagar incêndio"
  • Agenda vazia ou lotada sem controle
  
  ✅ Nutri-Empresária:
  • Trabalha com intenção
  • Rotina mínima definida
  • Processos simples e repetíveis
  • Gera movimento diário
  • Tem controle da própria agenda
  • Crescimento previsível e sustentável
  
  O erro silencioso é acreditar que técnica sozinha é suficiente. Técnica + método = transformação real.
  
  💡 Esse conceito vai ser ativado pela LYA nos próximos passos, ajudando você a identificar onde está hoje e qual é o próximo passo certo.
  ```

**1.4. Seção "A promessa YLADA"**
- [ ] **Arquivo:** `src/types/pilares.ts` (linha ~104)
- [ ] **Ação:** Atualizar promessa com presença da LYA (sem virar "IA salvadora")
- [ ] **Sugestão de ajuste:**
  ```
  "Menos corrida. Mais lucro. Mais identidade."
  
  Essa é a promessa do Método YLADA.
  
  Não é sobre trabalhar mais horas. É sobre trabalhar com método.
  Não é sobre fazer mais coisas. É sobre fazer as coisas certas.
  Não é sobre correr atrás de clientes. É sobre criar um sistema que traz clientes até você.
  
  A promessa YLADA é transformar sua prática em uma carreira previsível, organizada e lucrativa — com o suporte diário da LYA para te guiar no próximo passo certo, sem perder sua essência, sem perder sua humanidade, sem perder sua paixão pela nutrição.
  ```

**1.5. Campo de Anotação**
- [ ] **Arquivo:** `src/types/pilares.ts` (linha ~120)
- [ ] **Ação:** Tornar perguntas mais específicas para alimentar melhor a LYA
- [ ] **Sugestão de ajuste:**
  ```
  Antes: "O que mais fez sentido para você neste Pilar?"
  
  Depois: "O que você percebeu sobre sua identidade profissional? Onde hoje você sente mais falta de estrutura?"
  ```
- [ ] **Nota:** Essas respostas alimentam melhor `ai_state_user` e análise da LYA

**1.6. Bloco "Como a LYA usa este Pilar"**
- [ ] **Arquivo:** `src/app/pt/nutri/metodo/pilares/[id]/page.tsx`
- [ ] **Ação:** Adicionar bloco explicativo após os 4 fundamentos
- [ ] **Sugestão de implementação:**
  ```tsx
  {/* Adicionar após seção "Os 4 fundamentos" */}
  <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
    <h3 className="font-semibold text-gray-900 mb-4 text-lg">
      💡 Como a LYA usa este Pilar
    </h3>
    <p className="text-gray-700 leading-relaxed mb-3">
      A LYA utiliza os fundamentos deste Pilar para decidir:
    </p>
    <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
      <li>seu foco prioritário (captação, organização, fechamento ou acompanhamento)</li>
      <li>o tom da orientação (acolhedor, firme, direto ou estratégico)</li>
      <li>o próximo passo certo para você</li>
    </ul>
    <p className="text-gray-700 leading-relaxed">
      Após ler este Pilar, a LYA vai te orientar sobre como aplicar esses conceitos no seu momento atual.
    </p>
  </div>
  ```

**1.7. CTA Final - Inserir botão para LYA**
- [ ] **Arquivo:** `src/app/pt/nutri/metodo/pilares/[id]/page.tsx` (linha ~322)
- [ ] **Ação:** Adicionar botão "Ver orientação da LYA para hoje" antes de "Aplicar este Pilar no GSAL"
- [ ] **Sugestão de implementação:**
  ```tsx
  {/* CTA Final no Rodapé */}
  <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    {/* Novo bloco: Próximo passo com a LYA */}
    <div className="mb-6 pb-6 border-b border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-3 text-lg">
        🤝 Próximo passo com a LYA
      </h3>
      <p className="text-gray-700 mb-4 leading-relaxed">
        A LYA vai te orientar agora sobre como aplicar este Pilar no seu momento atual.
      </p>
      <Link
        href="/pt/nutri/home"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md font-medium"
      >
        Ver orientação da LYA para hoje →
      </Link>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Botão: Aplicar este Pilar no GSAL */}
      <Link
        href="/pt/nutri/gsal"
        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
      >
        Aplicar este Pilar no GSAL
      </Link>
      
      {/* Botão: Voltar para a Jornada */}
      <Link
        href={jornadaDay ? `/pt/nutri/metodo/jornada/dia/${jornadaDay}` : '/pt/nutri/metodo/jornada'}
        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
      >
        {jornadaDay ? `← Voltar para Dia ${jornadaDay}` : '← Voltar para a Jornada'}
      </Link>
    </div>
  </div>
  ```

---

### **PILAR 2 - ROTINA MÍNIMA YLADA**

#### 🔲 Ajustes necessários

**2.1. Seção "O que é Rotina Mínima"**
- [ ] **Arquivo:** `src/types/pilares.ts` (linha ~134)
- [ ] **Ação:** Adicionar conexão com LYA
- [ ] **Sugestão:** Adicionar ao final: "A LYA vai te ajudar a definir sua rotina mínima ideal baseada no seu momento atual e tempo disponível."

**2.2. Seção "Os 3 blocos diários"**
- [ ] **Arquivo:** `src/types/pilares.ts` (linha ~145)
- [ ] **Ação:** Conectar cada bloco a decisões da LYA
- [ ] **Sugestão:** Adicionar: "A LYA prioriza o bloco certo para você baseado no seu foco atual (captação, organização, fechamento ou acompanhamento)."

**2.3. Campo de Anotação**
- [ ] **Arquivo:** `src/types/pilares.ts`
- [ ] **Ação:** Ajustar pergunta para ser mais específica
- [ ] **Sugestão:** "Qual bloco da sua rotina está mais desorganizado hoje? O que te impede de ter uma rotina mínima consistente?"

---

### **PILAR 3 - CAPTAÇÃO YLADA**

#### 🔲 Ajustes necessários

**3.1. Campo de Anotação**
- [ ] **Arquivo:** `src/types/pilares.ts`
- [ ] **Ação:** Ajustar pergunta
- [ ] **Sugestão:** "Qual é sua maior dificuldade em captar clientes hoje? Quantos leads você gera por semana atualmente?"

**3.2. Adicionar bloco "Como a LYA usa este Pilar"**
- [ ] **Arquivo:** `src/app/pt/nutri/metodo/pilares/[id]/page.tsx`
- [ ] **Ação:** Similar ao Pilar 1, adaptado para captação

---

### **PILAR 4 - ATENDIMENTO QUE ENCANTA**

#### 🔲 Ajustes necessários

**4.1. Campo de Anotação**
- [ ] **Arquivo:** `src/types/pilares.ts`
- [ ] **Ação:** Ajustar pergunta
- [ ] **Sugestão:** "O que você sente que falta no seu atendimento para converter mais? Qual é sua taxa de conversão atual?"

---

### **PILAR 5 - GSAL & CRESCIMENTO**

#### 🔲 Ajustes necessários

**5.1. Campo de Anotação**
- [ ] **Arquivo:** `src/types/pilares.ts`
- [ ] **Ação:** Ajustar pergunta
- [ ] **Sugestão:** "Quantos clientes você tem em acompanhamento hoje? Qual é seu faturamento mensal atual?"

---

## 2️⃣ JORNADA 30 DIAS

### **Textos Introdutórios**

#### 🔲 Ajustes necessários

**2.1. Página principal da Jornada**
- [ ] **Arquivo:** `src/app/pt/nutri/metodo/jornada/page.tsx`
- [ ] **Ação:** Adicionar menção à LYA como guia
- [ ] **Sugestão:** "A LYA vai te orientar dia a dia sobre qual é o próximo passo certo para você nesta jornada."

**2.2. Texto de cada dia**
- [ ] **Arquivo:** `src/app/pt/nutri/metodo/jornada/dia/[numero]/page.tsx`
- [ ] **Ação:** Adicionar conexão com análise da LYA
- [ ] **Sugestão:** Adicionar bloco: "💡 A LYA analisou seu perfil e recomenda este dia como próximo passo. Veja a análise completa na home."

---

## 3️⃣ HOME DA NUTRI

### **Blocos e Componentes**

#### 🔲 Ajustes necessários

**3.1. Bloco "Análise da LYA para você hoje"**
- [x] **Arquivo:** `src/components/nutri/LyaAnaliseHoje.tsx`
- [x] **Status:** ✅ Já ajustado (formatação e ordem dos itens)

**3.2. Bloco "Jornada de Transformação"**
- [ ] **Arquivo:** `src/components/nutri/home/JornadaBlock.tsx`
- [ ] **Ação:** Adicionar menção à LYA
- [ ] **Sugestão:** "Continue sua jornada com orientação personalizada da LYA"

**3.3. Bloco "Pilares do Método"**
- [ ] **Arquivo:** `src/components/nutri/home/PilaresBlock.tsx`
- [ ] **Ação:** Adicionar texto sobre LYA ajudar a priorizar
- [ ] **Sugestão:** "A LYA vai te ajudar a identificar qual pilar focar primeiro baseado no seu momento atual."

---

## 4️⃣ LANDING PAGES

### **Página Principal Nutri**

#### 🔲 Ajustes necessários

**4.1. Promessa principal**
- [ ] **Arquivo:** `src/app/pt/nutri/page.tsx`
- [ ] **Ação:** Integrar LYA na promessa (sem exagerar)
- [ ] **Sugestão:** "A faculdade forma Nutris. A YLADA forma Nutri-Empresárias — com suporte diário da LYA para te guiar no próximo passo certo."

**4.2. Seção "O que é a YLADA Nutri?"**
- [ ] **Arquivo:** `src/app/pt/nutri/page.tsx`
- [ ] **Ação:** Adicionar menção à LYA como diferencial
- [ ] **Sugestão:** "Tudo o que você precisa para crescer com consistência está aqui, com orientação personalizada da LYA."

---

## 5️⃣ EXERCÍCIOS E FERRAMENTAS

### **Instruções e Descrições**

#### 🔲 Ajustes necessários

**5.1. Textos introdutórios dos exercícios**
- [ ] **Arquivo:** Componentes de exercícios
- [ ] **Ação:** Adicionar: "A LYA pode te orientar sobre como aplicar este exercício no seu momento atual."

**5.2. Descrições de ferramentas**
- [ ] **Arquivo:** Componentes de ferramentas
- [ ] **Ação:** Adicionar conexão com LYA quando relevante

---

## 6️⃣ MATERIAIS COMPLEMENTARES (PDFs)

### **Biblioteca e PDFs**

#### 🔲 Ajustes necessários

**6.1. Texto introdutório em todos os PDFs**
- [ ] **Arquivo:** PDFs na biblioteca
- [ ] **Ação:** Adicionar no início:
  ```
  "Este material é uma base conceitual. A aplicação prática acontece com a LYA dentro da plataforma."
  ```

**6.2. Texto final em todos os PDFs**
- [ ] **Arquivo:** PDFs na biblioteca
- [ ] **Ação:** Adicionar no final:
  ```
  "Após a leitura, volte ao sistema e veja a orientação da LYA para aplicar este conteúdo no seu momento atual."
  ```

**6.3. Blocos de materiais complementares nos Pilares**
- [ ] **Arquivo:** `src/app/pt/nutri/metodo/pilares/[id]/page.tsx` (linha ~90)
- [ ] **Ação:** Adicionar nota sobre LYA
- [ ] **Sugestão:** "💡 Estes materiais são complementares. A aplicação prática acontece com a LYA na plataforma."

---

## 7️⃣ ONBOARDING

### **Fluxo Inicial**

#### 🔲 Ajustes necessários

**7.1. Mensagem após diagnóstico completo**
- [ ] **Arquivo:** Componente de onboarding
- [ ] **Ação:** Adicionar: "A LYA analisou suas respostas e preparou uma orientação personalizada para você. Veja na home."

**7.2. Introdução à LYA**
- [ ] **Arquivo:** Componente de onboarding ou página dedicada
- [ ] **Ação:** Criar seção explicando o que é a LYA e como ela funciona
- [ ] **Sugestão:** "A LYA é sua mentora estratégica. Ela analisa seu perfil, seu progresso e te orienta sobre o próximo passo certo, sempre baseado no Método YLADA."

---

## 📊 RESUMO DE PRIORIDADES

### **Alta Prioridade (Fazer primeiro)**
1. ✅ Ajustes na análise da LYA (já feito)
2. ⬜ Pilar 1 - Todos os ajustes (fundamentos, promessa, campo anotação, bloco LYA, CTA)
3. ⬜ Campo de anotação de todos os 5 pilares
4. ⬜ CTAs nos pilares (botão LYA)

### **Média Prioridade**
5. ⬜ Textos introdutórios da Jornada
6. ⬜ Blocos na home
7. ⬜ Landing page principal

### **Baixa Prioridade (Pode fazer depois)**
8. ⬜ Exercícios e ferramentas
9. ⬜ PDFs (quando houver tempo para editar)
10. ⬜ Onboarding (se não houver página dedicada ainda)

---

## 🎯 PRINCÍPIOS PARA TODOS OS AJUSTES

1. **Não mudar tudo** - Apenas refinar, alinhar e integrar
2. **Tom:** Menos aula, mais preparação para ação
3. **Pontes explícitas:** Sempre conectar conteúdo → LYA → ação
4. **Sem exagero:** LYA não é "IA salvadora", é mentoria integrada
5. **Continuidade natural:** Pilar → LYA → Execução

---

## 📝 NOTAS IMPORTANTES

- Este documento é vivo e deve ser atualizado conforme ajustes são feitos
- Marque com ✅ quando concluído
- Use ⬜ para pendente
- Use 🔄 para em andamento

---

**Última atualização:** 2025-01-13  
**Próxima revisão:** Após conclusão dos itens de alta prioridade







