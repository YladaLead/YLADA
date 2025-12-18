# 🎨 Feature: Personalização de Marca - Nutri YLADA

## 📋 Visão Geral

Sistema completo de personalização de marca para nutricionistas, permitindo que profissionais personalizem seus links públicos com logo, cores e identidade profissional. **Inclui integração com a LYA** para sugestões de cores e validação.

---

## ✨ Funcionalidades Implementadas

### 1. **Campos de Branding no Perfil**
- ✅ `logo_url` - URL do logo no Supabase Storage
- ✅ `brand_color` - Cor da marca em formato HEX (#RRGGBB)
- ✅ `brand_name` - Nome da marca/consultório
- ✅ `professional_credential` - Credencial profissional (CRN, especialidade)

### 2. **Upload de Logo**
- ✅ Upload direto para Supabase Storage (bucket: `nutri-logos`)
- ✅ Validação de formato (JPG, PNG, WEBP)
- ✅ Validação de tamanho (máximo 2MB)
- ✅ Preview em tempo real
- ✅ Remoção de logo

### 3. **Seção "Marca Profissional" na Configuração**
- ✅ Interface intuitiva para personalização
- ✅ Preview em tempo real (formulário e ferramenta)
- ✅ Seletor de cor com input visual e campo HEX
- ✅ Validação de formato HEX

### 4. **Component BrandingPreview**
- ✅ Preview de formulário público
- ✅ Preview de ferramenta
- ✅ Tabs para alternar entre previews
- ✅ Dicas da LYA integradas

### 5. **Integração com LYA**
- ✅ LYA pode sugerir cores baseado em psicologia das cores
- ✅ LYA valida escolhas e reforça decisões
- ✅ Contexto de branding incluído em todas as conversas
- ✅ Widget da LYA visível na página de configuração

### 6. **Páginas Públicas Personalizadas**
- ✅ Formulários públicos com branding
- ✅ Header personalizado com logo e cor
- ✅ Botões com cor da marca
- ✅ API pública para buscar branding

---

## 🗂️ Arquivos Criados/Modificados

### **Novos Arquivos**
1. `/migrations/add-branding-fields.sql` - Migration SQL
2. `/src/components/nutri/BrandingPreview.tsx` - Preview da marca
3. `/src/components/nutri/PublicBrandingHeader.tsx` - Header reutilizável
4. `/src/app/api/public/nutri/branding/[userId]/route.ts` - API pública
5. `/docs/FEATURE-BRANDING.md` - Esta documentação

### **Arquivos Modificados**
1. `/src/app/api/nutri/profile/route.ts` - API de perfil atualizada
2. `/src/app/pt/nutri/(protected)/configuracao/page.tsx` - Página de configuração
3. `/src/app/pt/nutri/[user-slug]/formulario/[slug]/page.tsx` - Formulário público
4. `/src/app/api/nutri/lya/route.ts` - LYA com contexto de branding

---

## 🚀 Como Usar

### **1. Executar Migration**
```bash
# No Supabase Dashboard, executar:
# migrations/add-branding-fields.sql
```

**⚠️ IMPORTANTE**: Criar bucket `nutri-logos` no Supabase Storage se ainda não existe:
- Dashboard > Storage > New Bucket
- Name: `nutri-logos`
- Public: ✅ Yes

### **2. Acessar Configurações**
1. Login como nutricionista
2. Ir em **Configurações** no menu
3. Rolar até **🎨 Marca Profissional**

### **3. Personalizar Marca**
1. **Upload de Logo**:
   - Clique na área de upload
   - Selecione imagem (JPG, PNG, WEBP, máx 2MB)
   - Preview aparece automaticamente

2. **Nome da Marca**:
   - Digite o nome do consultório/marca
   - Ex: "Consultório Dra. Maria Silva"

3. **Credencial Profissional**:
   - Digite CRN e especialidade
   - Ex: "CRN 12345 - Nutricionista Clínica"

4. **Cor da Marca**:
   - Use o seletor de cor visual OU
   - Digite código HEX manualmente
   - **💡 Dica**: Pergunte à LYA qual cor usar!

5. **Salvar**:
   - Clique em "💾 Salvar Alterações"

### **4. Pedir Ajuda à LYA**
Abra o chat da LYA e pergunte:
- "LYA, que cor você sugere para minha marca?"
- "LYA, o que você acha de um logo com [descrição]?"
- "LYA, azul ou verde para nutrição?"

---

## 🎨 Psicologia das Cores (LYA)

A LYA sugere cores baseado em:

| Cor | Código HEX | Significado | Ideal Para |
|-----|-----------|-------------|------------|
| 🟢 Verde | `#10B981` | Saúde, vitalidade, natureza | Nutrição, emagrecimento saudável |
| 🔵 Azul | `#3B82F6` | Confiança, profissionalismo | Consultas clínicas, corporativo |
| 🟠 Laranja | `#F97316` | Energia, entusiasmo, apetite | Nutrição esportiva, vitalidade |
| 🌸 Rosa | `#EC4899` | Cuidado, empatia, delicadeza | Nutrição materno-infantil |
| 🟣 Roxo | `#8B5CF6` | Sofisticação, transformação | Coaching nutricional premium |

---

## 📱 Onde Aparece a Personalização

### **Páginas Públicas**
- ✅ Formulários de anamnese
- ✅ Ferramentas compartilhadas
- 🔜 Landing pages personalizadas
- 🔜 Links de agendamento

### **Elementos Personalizados**
- Header com logo e nome da marca
- Cor de fundo do header
- Credencial profissional
- Botões com cor da marca
- Links públicos: `ylada.app/nutri/[seu-slug]/formulario/[nome]`

---

## 🔒 Segurança e Privacidade

- ✅ Logos são públicos (bucket público)
- ✅ Apenas nutricionistas autenticados podem fazer upload
- ✅ Políticas RLS (Row Level Security) aplicadas
- ✅ Validação de tipo e tamanho de arquivo
- ✅ API pública retorna apenas campos de branding (sem dados sensíveis)

---

## 🐛 Troubleshooting

### **Logo não aparece**
1. Verificar se bucket `nutri-logos` existe
2. Verificar se bucket é público
3. Verificar políticas de storage
4. Ver console do navegador (F12)

### **Cor não salva**
1. Verificar formato HEX válido (#RRGGBB)
2. Usar 6 dígitos (ex: #3B82F6, não #3B82F)
3. Incluir # no início

### **Preview não atualiza**
1. Clicar em "Salvar Alterações" primeiro
2. Recarregar página se necessário

### **LYA não responde sobre cores**
1. Verificar se `LYA_PROMPT_ID` ou `OPENAI_ASSISTANT_LYA_ID` está configurado
2. Ver logs da API em `/api/nutri/lya`

---

## 🎯 Próximos Passos (Roadmap)

- [ ] Landing page personalizada para cada nutricionista
- [ ] Templates de marca pré-definidos
- [ ] Editor de cores avançado (paleta completa)
- [ ] Fonte personalizada
- [ ] Múltiplos logos (claro/escuro)
- [ ] Galeria de logos sugeridos pela LYA
- [ ] Analytics de visualizações de links públicos

---

## 💡 Exemplos de Uso da LYA

### **Exemplo 1: Escolher Cor**
**Nutricionista**: "LYA, que cor você sugere para minha marca?"

**LYA**: "Para nutrição, eu sugiro duas direções:

1. **Verde (#10B981)** - Transmite saúde, vitalidade e conexão com a natureza. É a cor mais associada à nutrição saudável.

2. **Azul (#3B82F6)** - Passa confiança, profissionalismo e segurança. Ideal se você quer posicionamento mais clínico.

Qual direção combina mais com você?"

### **Exemplo 2: Validar Logo**
**Nutricionista**: "Fiz upload do meu logo. O que você acha?"

**LYA**: "Parabéns por personalizar sua marca! 🎉

Algumas dicas para garantir que seu logo esteja profissional:
- Teste em fundos claros E escuros
- Verifique se é legível em tamanhos pequenos (como no celular)
- Prefira designs simples e limpos

Seu logo aparecerá em todos os seus formulários e ferramentas compartilhados!"

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Pergunte à LYA no chat
2. Verifique esta documentação
3. Contate o suporte técnico

---

**Data de Criação**: 18/12/2025  
**Versão**: 1.0  
**Status**: ✅ Implementado e testado
