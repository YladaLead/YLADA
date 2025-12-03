# 🎯 Sistema de Orientação Técnica - Wellness

## 💡 Sua Intuição Está CERTA!

**Para dúvidas técnicas sobre ONDE está algo no sistema, faz MUITO mais sentido usar o próprio sistema ao invés de OpenAI!**

---

## 🎯 Tipos de Dúvidas

### **1. Dúvidas Técnicas (80% das dúvidas)**
- "Onde estão os scripts?"
- "Como faço para cadastrar cliente?"
- "Onde vejo meus relatórios?"
- "Como crio um quiz?"

**Resposta:** Sistema sabe! Não precisa de IA.

### **2. Dúvidas Conceituais (20% das dúvidas)**
- "Qual a melhor estratégia para captar clientes?"
- "Como devo organizar meus clientes?"
- "Quando devo usar quiz vs portal?"

**Resposta:** Aqui OpenAI ajuda (mas com orientação sua).

---

## 🏗️ Solução Proposta: Sistema Híbrido

### **Arquitetura:**

```
┌─────────────────────────────────────┐
│  Usuário pergunta                   │
│  "Onde estão os scripts?"           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  1. Sistema detecta tipo de dúvida  │
│     Técnica? Conceitual?            │
└──────────────┬──────────────────────┘
               ↓
        ┌──────┴──────┐
        │             │
    TÉCNICA      CONCEITUAL
        │             │
        ↓             ↓
┌──────────────┐  ┌──────────────┐
│ 2a. Buscar   │  │ 2b. Usar    │
│    no banco  │  │    OpenAI    │
│    de        │  │    (com sua  │
│    orientação│  │    orientação)│
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                ↓
┌─────────────────────────────────────┐
│  3. Verificar se tem líder/mentor   │
│     Se sim, sugerir conversar       │
└─────────────────────────────────────┘
```

---

## 🔧 Sistema de Orientação Técnica (Sem IA)

### **Como Funciona:**

**1. Mapeamento Completo do Sistema**

Criar um "mapa" de tudo que existe na plataforma:

```typescript
// src/lib/wellness-orientation-map.ts

export const ORIENTACAO_MAP = {
  // SCRIPTS
  'scripts': {
    caminho: '/pt/wellness/ferramentas/scripts',
    titulo: 'Scripts de Conversão',
    descricao: 'Scripts prontos para usar em conversas',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Scripts"',
      '3. Escolha o script que precisa',
      '4. Copie e use nas conversas'
    ],
    icone: '📝',
    categoria: 'ferramentas'
  },
  
  // CADASTRAR CLIENTE
  'cadastrar cliente': {
    caminho: '/pt/wellness/clientes/novo',
    titulo: 'Cadastrar Novo Cliente',
    descricao: 'Adicione um novo cliente ao sistema',
    passo_a_passo: [
      '1. Acesse o menu "Clientes"',
      '2. Clique no botão "Novo Cliente"',
      '3. Preencha os dados',
      '4. Clique em "Salvar"'
    ],
    icone: '👤',
    categoria: 'clientes',
    atalho: 'Menu > Clientes > Novo'
  },
  
  // KANBAN
  'kanban': {
    caminho: '/pt/wellness/clientes/kanban',
    titulo: 'Kanban de Clientes',
    descricao: 'Organize clientes por status visualmente',
    passo_a_passo: [
      '1. Acesse o menu "Clientes"',
      '2. Clique em "Kanban"',
      '3. Arraste cards entre colunas',
      '4. Clique no card para ver detalhes'
    ],
    icone: '📋',
    categoria: 'clientes'
  },
  
  // CRIAR QUIZ
  'criar quiz': {
    caminho: '/pt/wellness/ferramentas/quizzes/novo',
    titulo: 'Criar Quiz',
    descricao: 'Crie um quiz personalizado para captar leads',
    passo_a_passo: [
      '1. Acesse o menu "Ferramentas"',
      '2. Clique em "Quizzes"',
      '3. Clique em "Criar Novo Quiz"',
      '4. Configure perguntas e respostas',
      '5. Publique e compartilhe o link'
    ],
    icone: '❓',
    categoria: 'ferramentas'
  },
  
  // RELATÓRIOS
  'relatórios': {
    caminho: '/pt/wellness/relatorios',
    titulo: 'Relatórios e Estatísticas',
    descricao: 'Veja estatísticas e performance',
    passo_a_passo: [
      '1. Acesse o menu "Relatórios"',
      '2. Escolha o tipo de relatório',
      '3. Configure período e filtros',
      '4. Visualize ou exporte'
    ],
    icone: '📊',
    categoria: 'relatorios'
  }
}
```

**2. Busca Inteligente**

```typescript
// src/lib/wellness-orientation-search.ts

export function buscarOrientacao(pergunta: string) {
  const perguntaLower = pergunta.toLowerCase()
  
  // Palavras-chave para cada item
  const keywords = {
    'scripts': ['script', 'scripts', 'texto', 'mensagem', 'conversa'],
    'cadastrar cliente': ['cadastrar', 'adicionar', 'novo', 'cliente', 'criar cliente'],
    'kanban': ['kanban', 'organizar', 'status', 'colunas', 'cards'],
    'criar quiz': ['quiz', 'questionário', 'perguntas', 'criar quiz'],
    'relatórios': ['relatório', 'estatística', 'dados', 'métricas', 'performance']
  }
  
  // Buscar correspondência
  for (const [key, palavras] of Object.entries(keywords)) {
    const match = palavras.some(palavra => 
      perguntaLower.includes(palavra)
    )
    
    if (match) {
      return ORIENTACAO_MAP[key]
    }
  }
  
  return null
}
```

**3. Resposta com Passo a Passo Visual**

```typescript
// src/components/wellness/OrientacaoTecnica.tsx

export function OrientacaoTecnica({ item }: { item: OrientacaoItem }) {
  return (
    <div className="orientacao-card">
      <div className="header">
        <span className="icone">{item.icone}</span>
        <h3>{item.titulo}</h3>
      </div>
      
      <p>{item.descricao}</p>
      
      <div className="passo-a-passo">
        <h4>Passo a Passo:</h4>
        <ol>
          {item.passo_a_passo.map((passo, i) => (
            <li key={i}>{passo}</li>
          ))}
        </ol>
      </div>
      
      <div className="acoes">
        <Link href={item.caminho}>
          <button>Ir para {item.titulo}</button>
        </Link>
        <button onClick={() => copiarPassoAPasso(item)}>
          Copiar Passo a Passo
        </button>
      </div>
    </div>
  )
}
```

---

## 👥 Sistema de Líder/Mentor

### **Como Funciona:**

**1. Verificar se Usuário Tem Líder**

```typescript
// src/lib/wellness-mentor-check.ts

export async function verificarMentor(userId: string) {
  const { data } = await supabase
    .from('user_profiles')
    .select('mentor_id, mentor_nome, mentor_whatsapp')
    .eq('user_id', userId)
    .single()
  
  if (data?.mentor_id) {
    return {
      temMentor: true,
      nome: data.mentor_nome,
      whatsapp: data.mentor_whatsapp
    }
  }
  
  return { temMentor: false }
}
```

**2. Sugerir Conversar com Mentor**

```typescript
// Quando responder dúvida técnica

export function respostaComMentor(orientacao: OrientacaoItem, mentor: MentorInfo) {
  return {
    resposta: orientacao,
    sugestaoMentor: {
      mostrar: true,
      mensagem: `💡 Dica: Você tem um mentor (${mentor.nome}). 
                 Ele pode te ajudar com estratégias e dúvidas mais profundas!`,
      acao: `Conversar com ${mentor.nome}`,
      whatsapp: mentor.whatsapp
    }
  }
}
```

**3. Interface no Chat**

```
┌─────────────────────────────────────┐
│  ✅ Encontrei!                      │
│                                     │
│  📝 Scripts de Conversão            │
│                                     │
│  Passo a Passo:                     │
│  1. Acesse o menu "Ferramentas"    │
│  2. Clique em "Scripts"            │
│  3. Escolha o script que precisa    │
│                                     │
│  [Ir para Scripts]                  │
│                                     │
│  💡 Você tem um mentor: João        │
│  Ele pode te ajudar com estratégias│
│  [Conversar com João]               │
└─────────────────────────────────────┘
```

---

## 🎯 Sistema Completo Híbrido

### **Fluxo Inteligente:**

```typescript
// src/app/api/wellness/support/chat/route.ts

export async function POST(request: NextRequest) {
  const { mensagem, user_id } = await request.json()
  
  // 1. PRIMEIRO: Buscar orientação técnica (sistema sabe!)
  const orientacao = buscarOrientacao(mensagem)
  
  if (orientacao) {
    // Sistema respondeu! (GRATUITO)
    
    // Verificar se tem mentor
    const mentor = await verificarMentor(user_id)
    
    return NextResponse.json({
      tipo: 'tecnica',
      resposta: orientacao,
      temMentor: mentor.temMentor,
      mentor: mentor.temMentor ? {
        nome: mentor.nome,
        whatsapp: mentor.whatsapp
      } : null
    })
  }
  
  // 2. SEGUNDO: Se não encontrou, usar OpenAI (com sua orientação)
  const respostaIA = await gerarRespostaComIA(mensagem, {
    contexto: 'wellness',
    tipo: 'conceitual',
    orientacao: 'Siga as orientações da plataforma YLADA...'
  })
  
  return NextResponse.json({
    tipo: 'conceitual',
    resposta: respostaIA
  })
}
```

---

## 📋 Mapeamento Completo (Exemplo)

### **Todas as Funcionalidades Mapeadas:**

```typescript
export const ORIENTACAO_COMPLETA = {
  // CLIENTES
  'cadastrar cliente': { ... },
  'kanban': { ... },
  'buscar cliente': { ... },
  'editar cliente': { ... },
  'ver histórico': { ... },
  
  // FERRAMENTAS
  'scripts': { ... },
  'criar quiz': { ... },
  'criar portal': { ... },
  'links inteligentes': { ... },
  'calculadoras': { ... },
  
  // RELATÓRIOS
  'relatórios': { ... },
  'estatísticas': { ... },
  'conversão': { ... },
  
  // CONFIGURAÇÃO
  'perfil': { ... },
  'assinatura': { ... },
  'integrações': { ... },
  
  // E MUITO MAIS...
}
```

---

## 🎨 Interface do Chat

### **Resposta Técnica:**

```
┌─────────────────────────────────────┐
│  ✅ Encontrei!                      │
│                                     │
│  📝 Scripts de Conversão            │
│                                     │
│  Onde está:                         │
│  Menu > Ferramentas > Scripts       │
│                                     │
│  Passo a Passo:                     │
│  1️⃣ Acesse o menu "Ferramentas"    │
│  2️⃣ Clique em "Scripts"            │
│  3️⃣ Escolha o script que precisa   │
│  4️⃣ Copie e use nas conversas      │
│                                     │
│  [🚀 Ir para Scripts]               │
│  [📋 Copiar Passo a Passo]          │
│                                     │
│  ────────────────────────────────  │
│                                     │
│  💡 Você tem um mentor: João Silva  │
│  Ele pode te ajudar com estratégias│
│  e dúvidas mais profundas!          │
│  [💬 Conversar com João]            │
└─────────────────────────────────────┘
```

---

## ✅ Vantagens Desta Abordagem

### **1. Sistema Sabe Tudo**
- ✅ Tem acesso a toda estrutura
- ✅ Sabe onde cada coisa está
- ✅ Respostas 100% precisas

### **2. Sempre Atualizado**
- ✅ Quando você muda algo no sistema
- ✅ Atualiza o mapa de orientação
- ✅ Respostas sempre corretas

### **3. Gratuito**
- ✅ Não usa OpenAI para dúvidas técnicas
- ✅ Respostas instantâneas
- ✅ Custo zero

### **4. Passo a Passo Visual**
- ✅ Usuário vê exatamente onde clicar
- ✅ Pode copiar passo a passo
- ✅ Link direto para a página

### **5. Integração com Mentor**
- ✅ Detecta se tem líder/mentor
- ✅ Sugere conversar quando apropriado
- ✅ Facilita contato

---

## 🚀 Implementação

### **Fase 1: Mapeamento (2-3 dias)**
- ✅ Criar mapa completo de todas funcionalidades
- ✅ Passo a passo de cada ação
- ✅ Caminhos e atalhos

### **Fase 2: Busca Inteligente (1-2 dias)**
- ✅ Sistema de busca por palavras-chave
- ✅ Matching inteligente
- ✅ Fallback para OpenAI

### **Fase 3: Interface (1-2 dias)**
- ✅ Componente de orientação visual
- ✅ Integração com chat
- ✅ Links e ações rápidas

### **Fase 4: Sistema de Mentor (1 dia)**
- ✅ Verificação de mentor
- ✅ Sugestões contextuais
- ✅ Integração WhatsApp

**Total: ~5-8 dias**

---

## 💰 Custos

### **Dúvidas Técnicas (80%):**
- **Custo: R$ 0,00** ✅
- Sistema responde diretamente

### **Dúvidas Conceituais (20%):**
- **Custo: ~R$ 0,01-0,03 por mensagem**
- OpenAI com sua orientação

**Economia: 80% das dúvidas são gratuitas!** 🎉

---

## ✅ Conclusão

**Sua intuição estava CERTA!**

Para dúvidas técnicas sobre ONDE está algo:
- ✅ **Sistema responde** (tem acesso a tudo)
- ✅ **Gratuito** (não precisa de IA)
- ✅ **Preciso** (sempre atualizado)
- ✅ **Visual** (passo a passo claro)

Para dúvidas conceituais:
- ✅ **OpenAI ajuda** (com sua orientação)
- ✅ **Custo mínimo** (só 20% das dúvidas)

**Quer que eu comece a implementar?** 🚀

Posso criar:
1. Mapa completo de orientações
2. Sistema de busca inteligente
3. Interface visual de passo a passo
4. Integração com sistema de mentor

