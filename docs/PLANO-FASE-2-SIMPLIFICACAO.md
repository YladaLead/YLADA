# 📋 PLANO FASE 2: Simplificação de Ferramentas e GSAL

**Data:** Hoje  
**Objetivo:** Simplificar interface e alinhar com fluxo guiado pela LYA  
**Estimativa:** ~1h30min

---

## 🎯 OBJETIVOS DA FASE 2

1. **Simplificar Ferramentas** - Links fixos, apenas Quiz customizável
2. **Desbloqueio Progressivo GSAL** - Aparece só após Dia 1
3. **GSAL Minimalista** - Apenas números essenciais

---

## 📦 FASE 2.1: Simplificar Ferramentas (30min)

### **O que fazer:**
- ✅ Remover opção de editar links de ferramentas pré-definidas
- ✅ Manter apenas Quiz Personalizado como customizável
- ✅ Links fixos para todas as outras ferramentas (calculadoras, etc.)

### **Arquivos a modificar:**
1. `src/components/nutri/home/FerramentasBlock.tsx`
   - Remover botão "Editar" para ferramentas não-quiz
   - Mostrar apenas link direto

2. `src/app/pt/nutri/ferramentas/page.tsx`
   - Filtrar: apenas Quiz aparece como "Criar Nova"
   - Outras ferramentas aparecem como "Usar" (link direto)

3. `src/app/pt/nutri/ferramentas/[id]/editar/page.tsx`
   - Bloquear edição se não for Quiz Personalizado
   - Redirecionar para página de uso se tentar editar

### **Resultado esperado:**
- Nutri vê ferramentas com links prontos
- Só pode customizar Quiz
- Menos confusão, mais foco

---

## 📦 FASE 2.2: Desbloqueio Progressivo GSAL (20min)

### **O que fazer:**
- ✅ GSAL só aparece no menu após completar Dia 1
- ✅ Bloquear acesso direto a `/pt/nutri/gsal` se não completou Dia 1
- ✅ Mostrar mensagem: "Complete o Dia 1 da Jornada para desbloquear o GSAL"

### **Arquivos a modificar:**
1. `src/components/nutri/NutriSidebar.tsx`
   - Esconder item "GSAL" do menu se `currentDay < 2`
   - Mostrar apenas após Dia 1 completo

2. `src/components/nutri/home/GSALBlock.tsx`
   - Mostrar card bloqueado se `currentDay < 2`
   - Mensagem: "Complete o Dia 1 para desbloquear"

3. Criar `src/components/auth/RequireDia1Completo.tsx`
   - Componente de proteção para rotas GSAL
   - Redireciona para `/pt/nutri/metodo/jornada/dia/1` se não completou

4. `src/app/pt/nutri/gsal/**/page.tsx`
   - Envolver com `RequireDia1Completo`

### **Resultado esperado:**
- GSAL aparece só quando faz sentido
- Nutri foca na Jornada primeiro
- Menos opções = menos confusão

---

## 📦 FASE 2.3: GSAL Minimalista (30min)

### **O que fazer:**
- ✅ Simplificar interface do GSAL
- ✅ Mostrar apenas números essenciais (Leads, Avaliações, Planos, Acompanhamentos)
- ✅ Remover campos complexos no início
- ✅ Integrar com LYA (mostrar que LYA usa esses dados)

### **Arquivos a modificar:**
1. `src/components/nutri/home/GSALBlock.tsx`
   - Mostrar apenas 4 números grandes
   - Remover detalhes complexos
   - Adicionar texto: "A LYA usa esses dados para te orientar"

2. `src/app/pt/nutri/gsal/page.tsx` (se existir)
   - Simplificar dashboard
   - Focar em números essenciais
   - Adicionar microcopy sobre LYA

### **Resultado esperado:**
- GSAL vira "sensor" (não ferramenta complexa)
- LYA usa os dados automaticamente
- Nutri não precisa entender GSAL profundamente

---

## ✅ CHECKLIST FINAL

### **Fase 2.1: Ferramentas**
- [ ] Remover edição de links não-quiz
- [ ] Filtrar criação (só Quiz)
- [ ] Bloquear edição de ferramentas fixas
- [ ] Testar fluxo

### **Fase 2.2: GSAL Desbloqueio**
- [ ] Esconder GSAL do menu até Dia 1
- [ ] Criar RequireDia1Completo
- [ ] Proteger rotas GSAL
- [ ] Testar bloqueio/desbloqueio

### **Fase 2.3: GSAL Minimalista**
- [ ] Simplificar GSALBlock
- [ ] Mostrar apenas números essenciais
- [ ] Adicionar microcopy sobre LYA
- [ ] Testar visual

---

## 🧪 TESTE FINAL

Após implementar tudo:
1. Login como nova Nutri
2. Verificar: GSAL não aparece no menu
3. Completar Dia 1
4. Verificar: GSAL aparece
5. Verificar: Ferramentas têm links fixos (exceto Quiz)
6. Verificar: GSAL mostra apenas números essenciais

---

**Próximo passo:** Começar pela Fase 2.1 (Ferramentas)

