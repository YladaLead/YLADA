# 🤖 Automação de Formulário → Workshop WhatsApp

## 📋 COMO FUNCIONA

### **Fluxo Completo:**

```
1. Pessoa preenche formulário público (quiz, calculadora, etc.)
   ↓
2. Sistema salva resposta e cria LEAD automaticamente
   ↓
3. Automação detecta: Lead criado + tem telefone + área = nutri
   ↓
4. Sistema busca PRÓXIMA SESSÃO ATIVA do workshop
   ↓
5. Envia mensagem WhatsApp automática com:
   - Flyer (se configurado)
   - Data, hora e link do Zoom
   - Instrução para reagendar
   ↓
6. Cria/atualiza conversa no WhatsApp com ETIQUETAS:
   - 📝 "veio_aula_pratica" (veio de formulário)
   - 📅 "recebeu_link_workshop" (recebeu convite)
   - 👋 "primeiro_contato" (primeira vez)
   ↓
7. Conversa aparece no /admin/whatsapp com tags visíveis
```

---

## 🏷️ SISTEMA DE ETIQUETAS

### **Tags Automáticas:**

Quando alguém preenche formulário e recebe convite:

- **`veio_aula_pratica`** 📝 → Pessoa veio de formulário
- **`recebeu_link_workshop`** 📅 → Recebeu convite de workshop
- **`primeiro_contato`** 👋 → Primeira vez que entrou em contato

### **Onde as Tags Aparecem:**

1. **Lista de Conversas** (`/admin/whatsapp`)
   - Badges coloridos ao lado do nome
   - 📝 Aula Prática (azul)
   - 📅 Link Workshop (roxo)
   - 👋 1º Contato (azul claro)

2. **Header da Conversa**
   - Tags visíveis no topo da conversa selecionada

3. **Menu de Ações** (3 pontos)
   - Opção "🏷️ Etiquetas (tags)" para editar manualmente

---

## ⚙️ CONFIGURAÇÃO

### **1. Criar Sessão de Workshop**

Acesse: `/admin/whatsapp/workshop`

1. Preencha:
   - **Título**: Ex: "Aula Prática ao Vivo"
   - **Data e Hora**: Quando será a apresentação
   - **Link Zoom**: URL da reunião
   - **Ativa**: ✅ Marque para ativar

2. Clique em **"+ Adicionar"**

3. A sessão aparecerá na agenda

### **2. Configurar Flyer (Opcional)**

Na mesma página (`/admin/whatsapp/workshop`):

1. Configure **Flyer padrão**:
   - URL da imagem
   - Legenda (caption)

2. O flyer será enviado automaticamente antes da mensagem de texto

---

## 🔍 COMO IDENTIFICAR USUÁRIOS ETIQUETADOS

### **Na Interface do WhatsApp:**

1. Acesse `/admin/whatsapp`
2. Procure por badges coloridos nas conversas:
   - **📝 Form** (azul) = Veio de formulário
   - **📅 Workshop** (roxo) = Recebeu convite

### **Filtrar por Tags (Futuro):**

Ainda não implementado, mas as tags estão salvas no `context` da conversa e podem ser usadas para filtrar.

---

## 📊 CONTEXTO SALVO NA CONVERSA

Quando a automação roda, salva no `context` da conversa:

```json
{
  "workshop_session_id": "uuid-da-sessao",
  "source": "form_automation",
  "form_lead": true,
  "tags": ["veio_aula_pratica", "recebeu_link_workshop", "primeiro_contato"]
}
```

Isso permite:
- Saber qual sessão foi enviada
- Identificar origem (formulário)
- Filtrar conversas por tags
- Ver histórico completo

---

## 🧪 TESTAR A AUTOMAÇÃO

### **Passo a Passo:**

1. **Criar sessão ativa:**
   - `/admin/whatsapp/workshop`
   - Adicione uma sessão com data futura
   - Marque como "Ativa"

2. **Preencher formulário:**
   - Use um formulário público (área nutri)
   - Preencha com nome e telefone válido
   - Envie

3. **Verificar:**
   - Verifique logs: `[Form Automation] ✅ Mensagem enviada`
   - Acesse `/admin/whatsapp`
   - Procure pela conversa com tags 📝 Form e 📅 Workshop

4. **Ver mensagem:**
   - Abra a conversa
   - Veja a mensagem automática enviada
   - Verifique se tem flyer (se configurado)

---

## ⚠️ IMPORTANTE

### **Requisitos para Automação Funcionar:**

1. ✅ Formulário deve ser da área **nutri**
2. ✅ Formulário deve ter campo de **telefone**
3. ✅ Deve existir **pelo menos 1 sessão ativa** com data futura
4. ✅ Instância Z-API deve estar **ativa** e **conectada**

### **Se Não Funcionar:**

1. Verifique logs no console (Vercel)
2. Procure por: `[Form Automation]`
3. Erros comuns:
   - "Nenhuma sessão ativa" → Crie uma sessão
   - "Instância não encontrada" → Configure Z-API
   - "Erro ao enviar mensagem" → Verifique token Z-API

---

## 🎯 PRÓXIMOS PASSOS

- [ ] Adicionar filtro por tags na lista de conversas
- [ ] Adicionar estatísticas de conversão (form → workshop → cliente)
- [ ] Permitir reagendamento automático quando responder "REAGENDAR"
- [ ] Adicionar mais tags (ex: "workshop_attended", "converted")
