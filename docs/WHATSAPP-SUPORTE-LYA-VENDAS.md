# 💬 WhatsApp de Suporte no Chat da LYA - Página de Vendas

## ✅ O que foi implementado

Foi adicionado um **botão de WhatsApp** no chat da LYA na página de vendas (`/pt/nutri`) para permitir que visitantes entrem em contato direto com o suporte.

---

## 🎯 Funcionalidades

### 1. **Botão Fixo no Footer do Chat**
- Botão verde sempre visível no rodapé do widget
- Texto: "Falar com Suporte no WhatsApp"
- Ícone do WhatsApp
- Abre conversa no WhatsApp com mensagem pré-preenchida

### 2. **Mensagem Pré-preenchida**
Quando o visitante clica no botão, a mensagem já vem preenchida:
```
Olá! Estou na página de vendas da YLADA Nutri e gostaria de falar com um atendente.
```

### 3. **Integração com a LYA**
A LYA foi treinada para sugerir o WhatsApp quando apropriado:
- Dúvidas muito específicas ou técnicas
- Necessidade de ajuda personalizada
- Objeções complexas
- Quando o visitante quer falar com atendente humano

---

## 📍 Localização

O botão aparece:
- **Onde:** No rodapé do widget do chat da LYA
- **Quando:** Sempre visível quando o chat está aberto
- **Posição:** Abaixo do campo de input, separado por uma linha

---

## 🔧 Configuração

### Número do WhatsApp
O número configurado é: **+55 19 99723-0912**

Para alterar o número, edite o arquivo:
```
src/components/nutri/LyaSalesWidget.tsx
```

Procure por:
```typescript
href="https://wa.me/5519997230912?text=..."
```

E altere o número `5519997230912` para o desejado.

---

## 📝 Mensagem Pré-preenchida

A mensagem padrão é:
```
Olá! Estou na página de vendas da YLADA Nutri e gostaria de falar com um atendente.
```

Para personalizar, edite o arquivo `LyaSalesWidget.tsx` e altere o parâmetro `text` na URL do WhatsApp.

---

## 🎨 Visual

O botão tem:
- **Cor:** Verde (`bg-green-500` / `hover:bg-green-600`)
- **Tamanho:** Largura total do chat
- **Ícone:** SVG do WhatsApp
- **Texto:** "Falar com Suporte no WhatsApp"
- **Efeito:** Sombra e hover suave

---

## 💡 Como a LYA Sugere o WhatsApp

A LYA foi treinada para sugerir o WhatsApp quando:

1. **Dúvidas Técnicas Complexas**
   - Quando a pergunta é muito específica
   - Quando precisa de informações que não estão no contexto

2. **Objeções Complexas**
   - Quando há múltiplas objeções
   - Quando precisa de atenção individual

3. **Interesse em Falar com Humano**
   - Quando o visitante pede explicitamente
   - Quando demonstra necessidade de confiança adicional

4. **Dúvidas Personalizadas**
   - Quando precisa de ajuda específica para seu caso
   - Quando quer entender melhor antes de comprar

**Exemplo de resposta da LYA:**
```
"Se quiser, você pode falar diretamente com nossa equipe de suporte no WhatsApp. 
Há um botão verde aqui no chat que abre a conversa. Eles podem te ajudar com 
dúvidas mais específicas ou te guiar no processo de compra."
```

---

## 🧪 Como Testar

1. **Acesse a página de vendas:**
   - `http://localhost:3000/pt/nutri` (desenvolvimento)
   - `https://www.ylada.com/pt/nutri` (produção)

2. **Abra o chat da LYA:**
   - Clique no botão flutuante azul no canto inferior direito

3. **Verifique o botão WhatsApp:**
   - Deve aparecer no rodapé do chat
   - Deve estar verde com ícone do WhatsApp
   - Texto: "Falar com Suporte no WhatsApp"

4. **Teste o clique:**
   - Clique no botão
   - Deve abrir WhatsApp Web ou app
   - Mensagem deve estar pré-preenchida

5. **Teste a sugestão da LYA:**
   - Faça uma pergunta complexa ou técnica
   - Peça para falar com um atendente
   - A LYA deve sugerir o WhatsApp

---

## 📊 Benefícios

### Para o Visitante:
- ✅ Acesso rápido ao suporte humano
- ✅ Não precisa procurar número em outro lugar
- ✅ Mensagem já vem preenchida
- ✅ Experiência fluida

### Para Vendas:
- ✅ Reduz abandono de visitantes com dúvidas
- ✅ Aumenta conversão (suporte remove objeções)
- ✅ Melhora experiência do cliente
- ✅ Facilita fechamento de vendas

---

## 🔄 Próximos Passos (Opcional)

### Melhorias Futuras Possíveis:

1. **Rastreamento de Cliques**
   - Adicionar analytics para medir quantos clicam no WhatsApp
   - Saber quando a LYA sugere vs. quando o visitante clica diretamente

2. **Mensagem Contextual**
   - Personalizar mensagem baseada na conversa
   - Incluir informações relevantes do chat

3. **Horário de Atendimento**
   - Mostrar quando o suporte está disponível
   - Sugerir melhor horário se estiver fora do expediente

4. **Múltiplos Canais**
   - Adicionar email também
   - Opção de escolher canal preferido

---

## 📝 Arquivos Modificados

1. **`src/components/nutri/LyaSalesWidget.tsx`**
   - Adicionado botão de WhatsApp no footer
   - Mensagem pré-preenchida configurada

2. **`docs/LYA-SALES-PROMPT.md`**
   - Adicionada seção sobre quando sugerir WhatsApp
   - Exemplos de como a LYA deve mencionar o WhatsApp

---

## ✅ Checklist de Verificação

Após implementar, verifique:

- [ ] Botão aparece no rodapé do chat
- [ ] Botão está verde e visível
- [ ] Ícone do WhatsApp está correto
- [ ] Clique abre WhatsApp corretamente
- [ ] Mensagem pré-preenchida está correta
- [ ] Número do WhatsApp está correto
- [ ] Funciona em mobile e desktop
- [ ] LYA sugere WhatsApp quando apropriado

---

**Última atualização:** 2024-12-16
**Versão:** 1.0.0

