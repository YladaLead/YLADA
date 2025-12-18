# 🧪 Contas de Teste - Formulários + LYA

## 📧 **Duas Contas Disponíveis**

### **1. nutri1@ylada.com** - AMBIENTE COMPLETO ✅

**Cenário:** Nutricionista já usando o sistema há tempo

**Credenciais:**
- 📧 Email: `nutri1@ylada.com`
- 🔑 Senha: `Ylada2025!`

**O que tem:**
- ✅ Perfil completo (Dra. Mariana Silva)
- ✅ CRN, especialidades, bio, foto
- ✅ 3 clientes cadastrados:
  - Ana Paula Costa (cliente engajada)
  - Roberto Santos (atleta)
  - Júlia Mendes (novo cliente)
- ✅ 3 formulários criados:
  - Anamnese Inicial
  - Recordatório 24h
  - Check-in Semanal
- ✅ 7 respostas de formulários
- ✅ **3 respostas NÃO visualizadas** (badge aparece!)

**Ideal para:**
- ✅ Testar funcionalidades completas
- ✅ Demonstrar ambiente em uso
- ✅ Testar badge de notificação
- ✅ Testar LYA com dados reais
- ✅ Validar resumos e padrões

---

### **2. demo.nutri@ylada.com** - DIA 1 (GRAVAÇÃO) 🎬

**Cenário:** Primeiro acesso, tudo zerado

**Credenciais:**
- 📧 Email: `demo.nutri@ylada.com`
- 🔑 Senha: `Ylada2025!`

**O que tem:**
- ✅ Apenas conta criada
- ✅ Perfil básico (nome + email)
- ❌ ZERO formulários
- ❌ ZERO respostas
- ❌ ZERO clientes

**Ideal para:**
- 🎥 Gravar tutoriais do zero
- 🎥 Demonstrar primeiro acesso
- 🎥 Mostrar criação de formulários
- 🎥 Testar fluxo completo
- 🎥 Usar templates pela primeira vez

---

## 🚀 **Como Executar os Scripts**

### **Setup Ambiente Completo (nutri1@ylada.com):**

1. Acesse: [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Menu: **SQL Editor** → **New Query**
4. Abra: `scripts/SETUP-NUTRI1-COMPLETO.sql`
5. Copie TODO o conteúdo
6. Cole no editor
7. Clique: **Run**
8. ✅ Aguarde: "Success"

**Tempo estimado:** ~5 segundos

**O que cria:**
```
✅ 1 usuário
✅ 1 perfil completo
✅ 3 clientes
✅ 3 formulários
✅ 7 respostas (3 não visualizadas)
```

---

### **Setup Dia 1 (demo.nutri@ylada.com):**

1. Acesse: [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Menu: **SQL Editor** → **New Query**
4. Abra: `scripts/SETUP-DEMO-NUTRI-DIA1.sql`
5. Copie TODO o conteúdo
6. Cole no editor
7. Clique: **Run**
8. ✅ Aguarde: "Success"

**Tempo estimado:** ~2 segundos

**O que cria:**
```
✅ 1 usuário
✅ 1 perfil básico
🗑️ Limpa qualquer dado anterior
```

---

## 📊 **Comparação Rápida**

| Característica | nutri1@ylada.com | demo.nutri@ylada.com |
|---|---|---|
| **Login** | ✅ | ✅ |
| **Perfil Completo** | ✅ Sim | ⚠️ Básico |
| **Formulários** | ✅ 3 criados | ❌ Zero |
| **Respostas** | ✅ 7 (3 não lidas) | ❌ Zero |
| **Clientes** | ✅ 3 cadastrados | ❌ Zero |
| **Badge Notificação** | ✅ Aparece (3) | ❌ Não aparece |
| **Ideal para** | Testes/Demonstração | Gravações/Tutoriais |

---

## 🎬 **Roteiro de Gravação Sugerido**

### **Usando demo.nutri@ylada.com:**

1. **Login** (0:00-0:30)
   - Mostrar tela de login
   - Entrar com `demo.nutri@ylada.com`

2. **Primeiro Acesso** (0:30-2:00)
   - Tela vazia de formulários
   - Explicar o que são formulários
   - Mostrar botão "Criar Formulário"

3. **Usar Templates** (2:00-4:00)
   - Seção "Templates Prontos"
   - Clicar em "Anamnese Básica"
   - Mostrar estrutura do template
   - Clicar em "Usar Template"

4. **Compartilhar no WhatsApp** (4:00-5:00)
   - Botão verde "💬 Compartilhar no WhatsApp"
   - Mostrar mensagem pré-formatada
   - Enviar para si mesmo

5. **Responder Formulário** (5:00-7:00)
   - Abrir link recebido
   - Preencher formulário
   - Enviar resposta

6. **Ver Badge de Notificação** (7:00-8:00)
   - Voltar para área nutri
   - Badge vermelho aparece
   - Clicar em "Respostas"
   - Abrir resposta (badge some)

7. **Testar LYA** (8:00-12:00)
   - Abrir chat da LYA
   - Botões de sugestão
   - "LYA, cria um recordatório 24h"
   - "LYA, resume a última resposta"

---

## 🧪 **Testes Recomendados**

### **Com nutri1@ylada.com:**

✅ **Teste 1: Badge de Notificação**
- Entrar na conta
- Ir para Formulários
- ✅ Verificar badge "3" aparecendo
- Clicar em resposta
- ✅ Badge diminui para "2"

✅ **Teste 2: LYA Resumir**
- Abrir chat LYA
- "LYA, resume a anamnese da Júlia Mendes"
- ✅ Verifica se resume corretamente
- ✅ Verifica se NÃO faz análise clínica

✅ **Teste 3: LYA Identificar Padrões**
- "LYA, identifica padrões nas minhas anamneses"
- ✅ Deve encontrar: compulsão, ansiedade
- ✅ NÃO deve diagnosticar

---

### **Com demo.nutri@ylada.com:**

✅ **Teste 4: Criar Formulário com LYA**
- Login na conta limpa
- Abrir LYA
- "LYA, cria uma anamnese básica"
- ✅ Verifica se formulário aparece em "Meus Formulários"

✅ **Teste 5: Usar Template**
- Ir para Formulários
- Templates Prontos
- Clicar "Usar Template"
- ✅ Verifica se copia corretamente

✅ **Teste 6: Compartilhar WhatsApp**
- Criar/usar um formulário
- Clicar botão verde "WhatsApp"
- ✅ Abre WhatsApp com link correto

---

## 🔐 **Segurança**

Ambas as contas:
- ✅ Isoladas entre si
- ✅ Não afetam usuários reais
- ✅ Podem ser deletadas/recriadas
- ✅ Senha padrão: `Ylada2025!`

⚠️ **Importante:**
- Não use essas contas em produção
- São apenas para testes/demonstrações
- Podem ser resetadas a qualquer momento

---

## 🗑️ **Como Limpar/Resetar**

### **Resetar nutri1@ylada.com (voltar ao estado completo):**
```sql
-- Execute SETUP-NUTRI1-COMPLETO.sql novamente
-- Vai deletar tudo e recriar do zero
```

### **Resetar demo.nutri@ylada.com (voltar ao Dia 1):**
```sql
-- Execute SETUP-DEMO-NUTRI-DIA1.sql novamente
-- Vai limpar tudo e deixar zerado
```

---

## 📞 **Suporte**

**Dúvidas sobre as contas?**
- Consulte os scripts SQL comentados
- Verifique logs do Supabase após executar
- Os scripts exibem mensagens detalhadas

**Conta não funciona?**
- Verifique se o script foi executado com sucesso
- Confirme que está usando a senha correta
- Limpe cache do navegador

---

## ✅ **Checklist Pós-Setup**

Após executar os scripts:

- [ ] Acessar nutri1@ylada.com → Login OK
- [ ] Verificar 3 formulários criados
- [ ] Verificar badge "3" aparecendo
- [ ] Acessar demo.nutri@ylada.com → Login OK
- [ ] Verificar tela vazia (zero formulários)
- [ ] Testar criação de formulário com LYA
- [ ] Testar uso de template

---

**Última atualização:** 18/12/2024  
**Versão dos scripts:** 1.0
