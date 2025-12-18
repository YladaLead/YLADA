# ✅ Checklist: Ativar Personalização de Marca

## 📋 Guia Rápido para Ativar a Feature

Siga este checklist na ordem para ativar a funcionalidade de personalização de marca.

---

## 🔧 Parte 1: Configuração Técnica (5 min)

### ☐ 1. Criar Bucket no Supabase
- [ ] Abrir Supabase Dashboard
- [ ] Ir em **Storage** → **New bucket**
- [ ] Nome: `nutri-logos`
- [ ] Marcar: **Public bucket** ✅
- [ ] Clicar em **Create bucket**

### ☐ 2. Executar Migration SQL
- [ ] Abrir Supabase Dashboard
- [ ] Ir em **SQL Editor** → **New query**
- [ ] Copiar conteúdo de `migrations/add-branding-fields.sql`
- [ ] Colar e executar (**RUN**)
- [ ] Aguardar mensagem: ✅ Success

### ☐ 3. Verificar Instalação
Executar no SQL Editor:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name IN ('logo_url', 'brand_color', 'brand_name', 'professional_credential');
```
- [ ] Retornou 4 linhas? ✅ Sucesso!

---

## 🎨 Parte 2: Testar a Feature (10 min)

### ☐ 4. Login e Acesso
- [ ] Fazer login como nutricionista
- [ ] Ir em **Configurações** no menu
- [ ] Rolar até seção **🎨 Marca Profissional**
- [ ] Verificar que a seção aparece

### ☐ 5. Upload de Logo
- [ ] Preparar um logo de teste (JPG, PNG ou WEBP, máx 2MB)
- [ ] Clicar na área de upload
- [ ] Selecionar o logo
- [ ] Verificar preview apareceu ✅
- [ ] Se aparecer erro, ler mensagem e ajustar

### ☐ 6. Escolher Cor
**Opção 1: Seletor Visual**
- [ ] Clicar no quadrado colorido
- [ ] Escolher uma cor
- [ ] Verificar que código HEX atualiza

**Opção 2: Input Manual**
- [ ] Digitar código HEX (ex: `#10B981`)
- [ ] Verificar que cor atualiza no preview

### ☐ 7. Preencher Textos
- [ ] **Nome da Marca**: Ex: "Consultório Dra. Maria"
- [ ] **Credencial**: Ex: "CRN 12345 - Nutricionista Clínica"

### ☐ 8. Preview
- [ ] Verificar preview de **Formulário**
- [ ] Clicar tab **Preview Ferramenta**
- [ ] Verificar preview de **Ferramenta**
- [ ] Cores e logo aparecem corretamente? ✅

### ☐ 9. Salvar
- [ ] Clicar em **💾 Salvar Alterações**
- [ ] Aguardar mensagem de sucesso
- [ ] Recarregar página (F5)
- [ ] Verificar que dados foram mantidos ✅

---

## 🤖 Parte 3: Testar LYA (5 min)

### ☐ 10. Abrir Chat da LYA
- [ ] Na página de Configurações
- [ ] Clicar no botão **Mentora LYA** (canto inferior direito)
- [ ] Chat abre? ✅

### ☐ 11. Pedir Sugestão de Cor
Enviar mensagem:
```
LYA, que cor você sugere para minha marca?
```
- [ ] LYA respondeu com sugestões? ✅
- [ ] Sugestões incluem códigos HEX? ✅

### ☐ 12. Validar Logo
Enviar mensagem:
```
Fiz upload do meu logo. O que você acha?
```
- [ ] LYA respondeu com dicas? ✅

---

## 🌐 Parte 4: Testar em Página Pública (10 min)

### ☐ 13. Criar Formulário de Teste
- [ ] Ir em **Formulários** no menu
- [ ] Clicar em **Novo Formulário**
- [ ] Preencher:
  - Nome: "Teste Branding"
  - Descrição: "Formulário para testar marca"
  - Adicionar 2-3 campos simples
- [ ] Salvar formulário

### ☐ 14. Copiar Link Público
- [ ] Na lista de formulários, clicar no formulário criado
- [ ] Copiar o link público (formato: `ylada.app/nutri/[seu-slug]/formulario/[nome]`)

### ☐ 15. Abrir em Modo Anônimo
- [ ] Abrir navegador em modo anônimo/privado
- [ ] Colar o link público
- [ ] Abrir a página

### ☐ 16. Verificar Branding
- [ ] Logo aparece no header? ✅
- [ ] Cor da marca está no header? ✅
- [ ] Nome da marca aparece? ✅
- [ ] Credencial aparece embaixo do nome? ✅
- [ ] Botão "Enviar" está com a cor da marca? ✅

---

## 🐛 Troubleshooting

### ❌ Logo não aparece
1. [ ] Verificar se bucket `nutri-logos` existe
2. [ ] Verificar se bucket é **público**
3. [ ] Tentar fazer novo upload
4. [ ] Ver console do navegador (F12) para erros

### ❌ Cor não salva
1. [ ] Verificar formato: `#RRGGBB` (6 caracteres)
2. [ ] Incluir `#` no início
3. [ ] Usar apenas 0-9 e A-F

### ❌ Preview não atualiza
1. [ ] Clicar em **Salvar Alterações** primeiro
2. [ ] Recarregar a página (F5)

### ❌ LYA não responde
1. [ ] Verificar se variável `LYA_PROMPT_ID` ou `OPENAI_ASSISTANT_LYA_ID` está configurada
2. [ ] Ver console do navegador para erros
3. [ ] Tentar recarregar a página

---

## 🎉 Sucesso!

Se você completou todos os checkboxes com ✅, parabéns! 
A funcionalidade de Personalização de Marca está funcionando perfeitamente.

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `docs/FEATURE-BRANDING.md` - Documentação técnica completa
- `docs/EXEMPLOS-LYA-BRANDING.md` - Exemplos de conversas com LYA
- `migrations/README-BRANDING.md` - Instruções detalhadas da migration
- `IMPLEMENTACAO-BRANDING-COMPLETA.md` - Resumo da implementação

---

## 🆘 Precisa de Ajuda?

1. **Durante o uso**: Pergunte à LYA no chat
2. **Problemas técnicos**: Verifique documentação acima
3. **Bugs**: Verificar console do navegador (F12)

---

**Tempo Total**: ~30 minutos  
**Dificuldade**: ⭐⭐☆☆☆ (Fácil)  
**Status**: ✅ Pronto para usar!
