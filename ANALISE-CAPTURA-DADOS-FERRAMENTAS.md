# 🔍 ANÁLISE - CAPTURA DE DADOS NAS FERRAMENTAS

**Data:** 18 de Dezembro de 2025  
**Problema identificado:** Ferramentas padrão não permitem customizar captura de dados

---

## 📊 SITUAÇÃO ATUAL

### 1. **QUIZ PERSONALIZADO** ✅
**URL:** `/pt/nutri/quiz-personalizado`

**Como funciona:**
- ✅ Permite customizar captura de dados
- ✅ Pode escolher coletar: Nome, Email, Telefone
- ✅ Pode desativar captura completamente
- ✅ Salva em `quizzes` table com configuração completa

**Configuração:**
```typescript
entrega: {
  coletarDados: true/false,
  camposColeta: {
    nome: true/false,
    email: true/false,
    telefone: true/false
  }
}
```

---

### 2. **FERRAMENTA PERSONALIZADA** ✅ 
**URL:** `/pt/nutri/ferramentas/nova`

**Como funciona:**
- ✅ Permite customizar captura de dados
- ✅ Pode escolher coletar: Nome, Email, Telefone
- ✅ Salva em `user_templates` com configuração

**Configuração:**
```typescript
{
  collect_leader_data: true/false,
  leader_data_fields: {
    name: true/false,
    email: true/false,
    phone: true/false
  }
}
```

---

### 3. **FERRAMENTAS PADRÃO (TEMPLATES)** ❌ **PROBLEMA**
**URL:** `/pt/nutri/ferramentas/templates`

**Como funciona ATUALMENTE:**
- ❌ **NÃO permite customizar captura**
- ❌ URL é fixa (ex: `ylada.com/nutri/@seu-slug/calc-imc`)
- ❌ Não tem interface para configurar campos
- ❌ Captura SEMPRE os mesmos campos (hardcoded)

**Ferramentas afetadas:**
- Calculadora de IMC
- Calculadora de Água
- Calculadora de Proteína
- Calculadora de Calorias
- Todos os quizzes prontos
- Todos os checklists prontos
- Etc.

---

## 🎯 PROBLEMA IDENTIFICADO

### **O usuário está correto:**

1. **Antes** (hipótese):
   - Cada ferramenta pronta tinha configuração própria
   - Podia escolher quais campos coletar
   
2. **Agora**:
   - Ferramentas prontas usam URL fixa
   - Não tem interface de customização
   - Captura sempre Nome + Email (hardcoded?)
   - **Telefone pode não estar sendo capturado!**

---

## 💡 SOLUÇÕES POSSÍVEIS

### **OPÇÃO 1: PADRONIZAR CAPTURA (MAIS SIMPLES)** ⭐ **RECOMENDADO**

**Descrição:**
Todas as ferramentas padrão capturam **SEMPRE** os 3 campos obrigatórios:
- ✅ Nome
- ✅ Email  
- ✅ Telefone

**Vantagens:**
- ✅ Simples de implementar
- ✅ Garante dados completos
- ✅ Não precisa interface de configuração
- ✅ Melhor para conversão em cliente (precisa de telefone)

**Desvantagens:**
- ⚠️ Menos flexibilidade
- ⚠️ Pode assustar alguns leads (pedir telefone logo)

**Como implementar:**
1. Verificar todos os componentes de ferramentas
2. Garantir que TODOS pedem Nome + Email + Telefone
3. Tornar todos os 3 campos obrigatórios
4. Documentar que ferramentas padrão sempre capturam os 3

---

### **OPÇÃO 2: ADICIONAR CONFIGURAÇÃO NAS FERRAMENTAS PADRÃO** (MAIS COMPLEXO)

**Descrição:**
Adicionar interface de configuração para cada ferramenta pronta.

**Como funcionaria:**
```
1. Nutricionista acessa ferramenta pronta
   ↓
2. Clica em "Configurar Captura de Dados"
   ↓
3. Escolhe quais campos quer coletar:
   [x] Nome
   [x] Email
   [ ] Telefone (opcional)
   ↓
4. Salva configuração
   ↓
5. Ferramenta usa essa configuração
```

**Vantagens:**
- ✅ Flexibilidade total
- ✅ Nutricionista decide por ferramenta

**Desvantagens:**
- ❌ Complexo de implementar
- ❌ Precisa interface de configuração
- ❌ Precisa salvar configuração por usuário + ferramenta
- ❌ Pode confundir usuário ("onde configuro isso?")

**Como implementar:**
1. Adicionar tabela `user_template_configs`
2. Criar interface de configuração
3. Salvar preferências por ferramenta
4. Componente de ferramenta lê configuração
5. Exibe campos conforme configuração

---

### **OPÇÃO 3: COPIAR PARA PERSONALIZADA (HÍBRIDO)**

**Descrição:**
Quando nutricionista quer customizar, copia ferramenta para personalizadas.

**Como funcionaria:**
```
1. Nutricionista vê ferramenta pronta
   ↓
2. Clica em "Personalizar esta ferramenta"
   ↓
3. Ferramenta é copiada para "Minhas Ferramentas"
   ↓
4. Abre interface de edição
   ↓
5. Pode configurar campos de captura
   ↓
6. Salva como ferramenta personalizada
   ↓
7. Usa URL personalizada
```

**Vantagens:**
- ✅ Flexibilidade quando necessário
- ✅ Simples mantém simples
- ✅ Já existe infraestrutura de personalizadas

**Desvantagens:**
- ⚠️ Cria "duplicação" (ferramenta padrão + cópia)
- ⚠️ URL muda (não é mais padrão)

---

## 🎯 RECOMENDAÇÃO FINAL

### **IMPLEMENTAR OPÇÃO 1: PADRONIZAR CAPTURA**

**Por quê:**
1. ✅ MVP - Simples e rápido
2. ✅ Leads completos (com telefone)
3. ✅ Melhor para conversão
4. ✅ Não precisa UI complexa
5. ✅ Fácil de testar

**Ação:**
1. Garantir que TODAS ferramentas padrão capturam:
   - Nome (obrigatório)
   - Email (obrigatório)
   - Telefone (obrigatório)
   
2. Adicionar mensagem clara na ferramenta:
   ```
   💡 Para receber seu resultado, precisamos de:
   - Seu nome
   - Seu email
   - Seu telefone (para enviar via WhatsApp)
   ```

3. Tornar impossível enviar sem os 3 campos

4. Documentar comportamento

---

## 🛠️ IMPLEMENTAÇÃO - OPÇÃO 1

### **Passo 1: Verificar componentes atuais**

Verificar quais campos cada ferramenta está coletando:
- Calculadora IMC → ?
- Calculadora Água → ?
- Calculadora Proteína → ?
- Quiz prontos → ?

### **Passo 2: Padronizar todos**

Criar componente padrão de captura:

```typescript
// src/components/shared/LeadCaptureForm.tsx

interface LeadCaptureFormProps {
  onSubmit: (data: { nome: string; email: string; telefone: string }) => void
  ctaText?: string
}

export default function LeadCaptureForm({ onSubmit, ctaText = "Ver Resultado" }: LeadCaptureFormProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!nome || !email || !telefone) {
      alert('Todos os campos são obrigatórios')
      return
    }
    
    onSubmit({ nome, email, telefone })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nome Completo *</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Digite seu nome"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="seu@email.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">WhatsApp *</label>
        <input
          type="tel"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="(11) 99999-9999"
        />
      </div>
      
      <p className="text-xs text-gray-600 italic">
        💡 Vamos enviar seu resultado por email e WhatsApp
      </p>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
      >
        {ctaText}
      </button>
    </form>
  )
}
```

### **Passo 3: Usar em todas as ferramentas**

Substituir forms customizados pelo componente padrão:

```typescript
// Antes (cada ferramenta tinha seu form)
<input name="email" /> // só email

// Depois (todas usam o mesmo)
<LeadCaptureForm 
  onSubmit={(data) => handleLeadCapture(data)}
  ctaText="Ver Meu Resultado"
/>
```

### **Passo 4: Salvar lead completo**

Garantir que API salva os 3 campos:

```typescript
// /api/templates/[templateId]/submit
const leadData = {
  user_id: ferramentaUserId,
  name: nome,        // ✅ Obrigatório
  email: email,      // ✅ Obrigatório
  phone: telefone,   // ✅ Obrigatório
  template_id: templateId,
  additional_data: {
    ferramenta: 'Calculadora IMC',
    resultado: resultado,
    // ...
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Análise Inicial:**
- [ ] Listar todas as ferramentas padrão
- [ ] Verificar quais campos cada uma coleta ATUALMENTE
- [ ] Identificar quais NÃO coletam telefone
- [ ] Verificar se há configuração no banco (leader_data_collection)

### **Desenvolvimento:**
- [ ] Criar componente `LeadCaptureForm.tsx` padronizado
- [ ] Atualizar todas as ferramentas para usar componente
- [ ] Tornar os 3 campos obrigatórios
- [ ] Adicionar validações (email válido, telefone com DDD)
- [ ] Testar cada ferramenta

### **API:**
- [ ] Verificar endpoint `/api/templates/[id]/submit`
- [ ] Garantir que salva nome, email E telefone
- [ ] Validar que lead é criado com dados completos
- [ ] Testar criação de lead

### **Documentação:**
- [ ] Documentar que ferramentas padrão capturam 3 campos
- [ ] Atualizar help/tooltips
- [ ] Informar nutricionistas da mudança

---

## 🎯 DECISÃO PENDENTE

**O que você prefere?**

### **Opção A: Padronizar (SEMPRE Nome + Email + Telefone)**
- ⏱️ Implementação: 2-4 horas
- ✅ Simples, direto, MVP
- ✅ Leads completos
- ⚠️ Menos flexibilidade

### **Opção B: Adicionar Configuração**
- ⏱️ Implementação: 8-12 horas
- ✅ Flexibilidade total
- ❌ Complexo
- ❌ Pode confundir

### **Opção C: Híbrido (Copiar para personalizar)**
- ⏱️ Implementação: 4-6 horas
- ✅ Melhor dos dois mundos
- ⚠️ Cria duplicação

---

**Recomendo: OPÇÃO A (Padronizar)**

Motivo: É MVP, funciona, e todos os leads virão completos (nome + email + telefone).

---

**Última atualização:** 18 de Dezembro de 2025  
**Status:** Aguardando decisão para implementar

