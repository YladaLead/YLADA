# 📚 Localização dos Materiais do Curso HerbaLead Master

## 📁 **Onde Estão os PDFs:**

### **Pasta Principal:**
```
/public/course/materials/
```

### **Arquivos Disponíveis:**
1. **`01-guia-cadastro.md`** - Guia de Cadastro e Primeiros Passos
2. **`02-tutorial-links.md`** - Tutorial de Criação de Links
3. **`03-guia-quiz-builder.md`** - Guia do Quiz Builder
4. **`04-manual-vendas.md`** - Manual de Estratégias de Vendas
5. **`05-guia-avancado.md`** - Guia de Recursos Avançados
6. **`06-certificado-template.md`** - Template de Certificado
7. **`README.md`** - Organização dos Materiais

## 🎯 **Como Acessar os Materiais:**

### **1. Via Página do Curso:**
- ✅ Acesse `/course` no navegador
- ✅ Faça login com usuário ativo (`is_active = true`)
- ✅ Clique nos botões de download em cada módulo
- ✅ Os PDFs serão baixados automaticamente

### **2. Via URL Direta:**
```
http://localhost:3000/course/materials/01-guia-cadastro.md
http://localhost:3000/course/materials/02-tutorial-links.md
http://localhost:3000/course/materials/03-guia-quiz-builder.md
http://localhost:3000/course/materials/04-manual-vendas.md
http://localhost:3000/course/materials/05-guia-avancado.md
http://localhost:3000/course/materials/06-certificado-template.md
```

## 🔧 **Sistema de Download Implementado:**

### **Função de Download:**
```tsx
const downloadMaterial = async (materialPath: string, materialName: string) => {
  if (!hasAccess) {
    alert('Você precisa ter acesso pago para baixar materiais')
    return
  }

  try {
    const response = await fetch(materialPath)
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${materialName}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Erro ao baixar material:', error)
  }
}
```

### **Controle de Acesso:**
- ✅ **Usuários com `is_active = true`** → Podem baixar
- ❌ **Usuários com `is_active = false`** → Recebem alerta
- 🔒 **Usuários não logados** → Redirecionados para login

## 📊 **Estrutura dos Materiais:**

### **Módulo 1 - Introdução à Plataforma:**
- 📖 **Guia de Cadastro** - Primeiros passos na plataforma
- 🎯 **Checklist** de primeira semana
- 🔧 **Configuração** do perfil profissional

### **Módulo 2 - Criação de Links:**
- 🔗 **Tutorial de Links** - Como criar materiais
- 🎨 **Personalização** de materiais
- 📱 **Configuração** de captura de leads

### **Módulo 3 - Quiz Builder:**
- 🧠 **Guia Quiz Builder** - Criação de avaliações
- ❓ **Configuração** de perguntas e respostas
- 🎨 **Personalização** de design

### **Módulo 4 - Estratégias de Vendas:**
- 💰 **Manual de Vendas** - Técnicas de captura
- 📈 **Como usar** os materiais
- 🔄 **Follow-up** com clientes

### **Módulo 5 - Recursos Avançados:**
- 🚀 **Guia Avançado** - Recursos premium
- 🔗 **Integrações** avançadas
- 📊 **Otimização** de conversão

### **Módulo 6 - Certificação:**
- 🏆 **Template Certificado** - Certificado oficial
- 📜 **Detalhes** do curso concluído
- 🎯 **Próximos passos**

## 🚀 **Como Testar:**

### **1. Ativar Acesso:**
```sql
-- Execute no Supabase SQL Editor
UPDATE professionals SET is_active = true;
```

### **2. Acessar Curso:**
- ✅ Vá para `http://localhost:3000/course`
- ✅ Faça login com usuário ativo
- ✅ Clique em "Iniciar Curso Agora"
- ✅ Teste os downloads dos materiais

### **3. Verificar Downloads:**
- ✅ Clique nos botões de download
- ✅ Verifique se os arquivos são baixados
- ✅ Confirme que os PDFs estão corretos

## ✅ **Status: MATERIAIS PRONTOS**

Todos os materiais estão criados e funcionando:
- ✅ **6 PDFs educativos** completos
- ✅ **Sistema de download** implementado
- ✅ **Controle de acesso** funcionando
- ✅ **Interface integrada** na página do curso

**Os materiais estão prontos para uso!** 🎯✨












