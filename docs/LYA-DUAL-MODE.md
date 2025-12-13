# LYA Dual-Mode - Implementação Completa

## 🎯 Visão Geral

A LYA agora funciona em **dois modos distintos**:

1. **LYA Sales** - Landing Page (`/pt/nutri`)
   - Foco: Vendas e conversão
   - Público: Visitantes não autenticados
   - Objetivo: Converter em assinantes

2. **LYA Mentoria** - Área Logada
   - Foco: Desenvolvimento empresarial
   - Público: Nutricionistas autenticadas
   - Objetivo: Desenvolver como empresária

## 📁 Estrutura de Arquivos

```
src/
├── components/nutri/
│   ├── LyaChatWidget.tsx          # Widget interno (mentoria)
│   └── LyaSalesWidget.tsx         # Widget landing (vendas)
├── app/
│   ├── api/nutri/lya/
│   │   ├── route.ts               # API mentoria (autenticada)
│   │   └── sales/
│   │       └── route.ts           # API vendas (pública)
│   └── pt/nutri/
│       └── page.tsx                # Landing page (com LyaSalesWidget)
└── lib/
    └── lya-assistant-handler.ts   # Handler unificado (suporta ambos modos)
```

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# LYA Mentoria (área logada)
OPENAI_ASSISTANT_LYA_ID=asst_xxxxxxxxxxxxx

# LYA Sales (landing page)
OPENAI_ASSISTANT_LYA_SALES_ID=asst_yyyyyyyyyyyyy

# Secret para functions (opcional)
OPENAI_FUNCTION_SECRET=seu_secret_aqui
```

### Assistants no OpenAI

#### 1. LYA Mentoria
- **Nome**: "LYA - Mentora Empresarial Nutri"
- **System Prompt**: DOSSIÊ LYA v1.0 (completo)
- **ID**: `OPENAI_ASSISTANT_LYA_ID`

#### 2. LYA Sales
- **Nome**: "LYA Sales - YLADA Nutri"
- **System Prompt**: Ver `docs/LYA-SALES-PROMPT.md`
- **ID**: `OPENAI_ASSISTANT_LYA_SALES_ID`

## 🎨 Diferenças Visuais

### LYA Sales (Landing)
- **Cor**: Gradiente roxo (`from-purple-600 to-purple-700`)
- **Posição**: Canto inferior direito
- **Botão**: Animação pulse
- **Mensagem inicial**: Focada em vendas
- **Quick actions**: Perguntas sobre produto

### LYA Mentoria (Interna)
- **Cor**: Roxo sólido (`purple-600`)
- **Posição**: Canto inferior direito (empilhado com Support)
- **Mensagem inicial**: Focada em desenvolvimento
- **Sem quick actions**: Conversa natural

## 🔄 Fluxo de Funcionamento

### Landing Page (Sales)
1. Visitante abre `/pt/nutri`
2. Vê botão LYA com animação
3. Clica e abre `LyaSalesWidget`
4. Widget chama `/api/nutri/lya/sales`
5. API usa `OPENAI_ASSISTANT_LYA_SALES_ID`
6. Handler processa com `useSalesMode = true`
7. Resposta focada em vendas/conversão

### Área Logada (Mentoria)
1. Nutricionista autenticada acessa área
2. Vê `LyaChatWidget` (junto com Support)
3. Clica e abre chat
4. Widget chama `/api/nutri/lya`
5. API usa `OPENAI_ASSISTANT_LYA_ID`
6. Handler processa com `useSalesMode = false`
7. Resposta focada em desenvolvimento empresarial

## 📊 System Prompts

### LYA Mentoria
- Baseado no **DOSSIÊ LYA v1.0**
- Foco: Organização, rotina, desenvolvimento
- Tom: Estratégico, didático
- Fluxos: 8 fluxos empresariais

### LYA Sales
- Baseado no **LYA-SALES-PROMPT.md**
- Foco: Vendas, conversão, objeções
- Tom: Direto, persuasivo
- Fluxos: 5 fluxos de vendas

## 🚀 Próximos Passos

1. ✅ Estrutura criada
2. ⏳ Configurar Assistants no OpenAI
3. ⏳ Testar ambos os modos
4. ⏳ Ajustar System Prompts se necessário
5. ⏳ Adicionar analytics de conversão (Sales)

## 📝 Notas Importantes

- **Sales não salva interações** no banco (ou salva em tabela separada)
- **Mentoria salva tudo** para aprendizado contínuo
- **Threads separados** para cada modo
- **Mesmo handler**, diferentes Assistants
- **Visual diferenciado** para clareza

---

**Versão**: 1.0.0
**Data**: 2024
