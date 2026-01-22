# 📱 Guia Completo - Atendimento WhatsApp

## 🎯 COMO FUNCIONA (RESUMO)

```
1. Pessoa preenche formulário
   ↓
2. Sistema envia mensagem automática (workshop)
   ↓
3. Pessoa responde no WhatsApp
   ↓
4. Você atende na área administrativa
   ↓
5. Você adiciona tags conforme a jornada
   ↓
6. Acompanha até converter em cliente
```

---

## 📋 PASSO A PASSO PRÁTICO

### **ETAPA 1: CONFIGURAR (Uma vez só)**

#### 1.1. Configurar Webhook na Z-API
- ✅ "Ao receber" → `https://www.ylada.com/api/webhooks/z-api`
- ✅ "Ao enviar" → `https://www.ylada.com/api/webhooks/z-api`
- ✅ "Notificar as enviadas por mim também" → **MARCADO**

#### 1.2. Criar Sessão de Workshop
1. Acesse: `/admin/whatsapp/workshop`
2. Clique em "+ Adicionar"
3. Preencha:
   - Título: "Aula Prática ao Vivo"
   - Data e Hora
   - Link Zoom
   - Marque "Ativa"
4. Clique em "Salvar"

#### 1.3. Configurar Flyer (Opcional)
- Na mesma página, configure URL do flyer e legenda

---

### **ETAPA 2: AUTOMAÇÃO (Já funciona sozinho)**

Quando alguém preenche formulário:
- ✅ Sistema cria lead automaticamente
- ✅ Sistema envia mensagem WhatsApp automaticamente
- ✅ Sistema adiciona tags: `veio_aula_pratica`, `recebeu_link_workshop`, `primeiro_contato`
- ✅ Conversa aparece em `/admin/whatsapp`

**Você não precisa fazer nada aqui!** 🎉

---

### **ETAPA 3: ATENDER (Você faz manualmente)**

#### 3.1. Acessar Área de Atendimento
1. Acesse: `/admin/whatsapp`
2. Veja lista de conversas à esquerda
3. Clique em uma conversa para abrir

#### 3.2. Ver Mensagens
- Mensagens do cliente aparecem à esquerda (fundo branco)
- Suas mensagens aparecem à direita (fundo verde)
- Mensagens enviadas pelo telefone aparecem como "Telefone"

#### 3.3. Responder
1. Digite sua mensagem no campo inferior
2. Clique em "Enviar"
3. Ou envie mídia clicando no 📎

---

### **ETAPA 4: ETIQUETAR (Você faz conforme a jornada)**

#### 4.1. Como Adicionar Tags
1. Abra a conversa
2. Clique nos **3 pontos** (menu) no topo
3. Clique em **"🏷️ Etiquetas (tags)"**
4. Digite as tags separadas por vírgula
5. Clique em "OK"

#### 4.2. Tags por Etapa da Jornada

**Quando a pessoa participa da aula:**
- Adicione: `participou_aula`

**Quando a pessoa não participa:**
- Adicione: `nao_participou_aula`

**Quando a pessoa pede para reagendar:**
- Adicione: `adiou_aula`

**Quando a pessoa demonstra interesse:**
- Adicione: `interessado`

**Quando a pessoa tem dúvidas:**
- Adicione: `duvidas`

**Quando a pessoa está analisando:**
- Adicione: `analisando`

**Quando a pessoa apresenta objeções:**
- Adicione: `objeções`

**Quando a pessoa está negociando:**
- Adicione: `negociando`

**Quando a pessoa vira cliente:**
- Adicione: `cliente_nutri`

**Quando a pessoa perde interesse:**
- Adicione: `perdeu`

---

## 🎯 FLUXO COMPLETO DE ATENDIMENTO

### **Cenário 1: Pessoa Participou da Aula**

```
1. Pessoa preenche formulário
   → Tags automáticas: veio_aula_pratica, recebeu_link_workshop

2. Pessoa participa da aula
   → Você adiciona: participou_aula

3. Pessoa demonstra interesse
   → Você adiciona: interessado

4. Pessoa tem dúvidas
   → Você adiciona: duvidas

5. Pessoa está analisando
   → Você adiciona: analisando

6. Pessoa fecha plano
   → Você adiciona: cliente_nutri
```

### **Cenário 2: Pessoa Não Participou**

```
1. Pessoa preenche formulário
   → Tags automáticas: veio_aula_pratica, recebeu_link_workshop

2. Data da aula passa sem confirmação
   → Você adiciona: nao_participou_aula

3. Você faz remarketing (envia novo convite)
   → Continue acompanhando
```

### **Cenário 3: Pessoa Adiou**

```
1. Pessoa preenche formulário
   → Tags automáticas: veio_aula_pratica, recebeu_link_workshop

2. Pessoa responde "REAGENDAR"
   → Você adiciona: adiou_aula

3. Você agenda nova data
   → Continue acompanhando
```

---

## 📊 ONDE VER AS TAGS

### **Na Lista de Conversas:**
- Badges coloridos ao lado de cada nome
- Exemplo: 📝 Aula Prática, 📅 Link Workshop

### **No Header da Conversa:**
- Tags visíveis no topo quando você abre uma conversa

### **Para Editar:**
- Menu 3 pontos → "🏷️ Etiquetas (tags)"

---

## 🎓 TREINAMENTO RÁPIDO

### **O que você PRECISA fazer:**
1. ✅ Criar sessões de workshop (uma vez)
2. ✅ Atender conversas que chegam
3. ✅ Adicionar tags conforme a jornada
4. ✅ Responder mensagens

### **O que o SISTEMA faz sozinho:**
1. ✅ Envia mensagem automática quando formulário é preenchido
2. ✅ Cria leads automaticamente
3. ✅ Adiciona tags iniciais automaticamente
4. ✅ Salva todas as mensagens

---

## 🔧 FERRAMENTAS DISPONÍVEIS

### **1. Enviar Convite de Workshop**
- Botão 📩 no header da conversa
- Envia flyer + link do workshop

### **2. Exportar Conversa**
- Botão ⬇️ no header da conversa
- Baixa arquivo .txt com toda a conversa

### **3. Menu de Ações (3 pontos)**
- 🏷️ Etiquetas (tags)
- 📝 Notas internas
- 🖼️ Definir avatar
- Outras opções

---

## ✅ CHECKLIST DIÁRIO

- [ ] Verificar novas conversas em `/admin/whatsapp`
- [ ] Responder mensagens não lidas
- [ ] Adicionar tags conforme a jornada
- [ ] Verificar se há sessões de workshop ativas
- [ ] Acompanhar leads até conversão

---

## 🆘 DÚVIDAS COMUNS

### **"Como sei qual tag adicionar?"**
→ Veja o documento `docs/TAGS-WHATSAPP-FINAL.md` com todas as tags

### **"A mensagem automática não foi enviada"**
→ Verifique se há sessão ativa em `/admin/whatsapp/workshop`

### **"Mensagens do telefone não aparecem"**
→ Verifique se webhook "Ao enviar" está configurado na Z-API

### **"Como ver todas as tags de uma conversa?"**
→ Abra a conversa e veja no header (topo)

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Tags:** `docs/TAGS-WHATSAPP-FINAL.md`
- **Automação:** `docs/AUTOMACAO-FORMULARIO-WORKSHOP.md`
- **Configurar Webhook:** `docs/CONFIGURAR-WEBHOOK-AO-ENVIAR-PARA-MENSAGENS-TELEFONE.md`
- **Casos Reais:** `docs/CASOS-REAIS-TAGS.md`

---

**Resumo:** Configure uma vez, depois apenas atenda e adicione tags conforme a jornada! 🚀
