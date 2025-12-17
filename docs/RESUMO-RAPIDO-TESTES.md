# ⚡ RESUMO RÁPIDO: Como Testar no Localhost

## 🚀 PASSO A PASSO RÁPIDO

### **1. Servidor Rodando?**
```bash
# Se não estiver, execute:
cd /Users/air/ylada-app
npm run dev
```
**URL:** `http://localhost:3000`

---

### **2. Resetar Conta de Teste (SQL)**
1. Abrir **Supabase SQL Editor**
2. Abrir arquivo: `scripts/reset-completo-teste.sql`
3. Substituir `'seu-email@exemplo.com'` pelo seu email de teste
4. Executar script
5. ✅ Conta resetada (sem diagnóstico, sem jornada)

---

### **3. Testar Fluxo Completo**

#### **A. Onboarding**
1. Acessar: `http://localhost:3000/pt/nutri/login`
2. Fazer login
3. ✅ Deve redirecionar para `/pt/nutri/onboarding`
4. ✅ Ver tela com mensagem LYA + botão único

#### **B. Diagnóstico**
1. Clicar em "Começar meu Diagnóstico Estratégico"
2. Preencher formulário completo
3. Salvar
4. ✅ Deve redirecionar para `/pt/nutri/home`

#### **C. Dashboard Simplificado**
1. Na home, verificar:
   - ✅ WelcomeCard grande e azul aparece
   - ✅ Análise LYA aparece
   - ✅ **NÃO aparecem:** outros blocos
   - ✅ Chat widget **NÃO aparece** (bloqueado)

#### **D. Sidebar Fase 1**
1. Verificar sidebar esquerdo:
   - ✅ Apenas 4 itens: Home, Jornada, Perfil, Configurações
   - ✅ Outros itens aparecem com 🔒
   - ✅ Indicador: "Fase atual: Fundamentos"

#### **E. Dia 1**
1. Clicar no botão do WelcomeCard: "👉 Iniciar Dia 1"
2. Completar Dia 1
3. Voltar para home
4. ✅ Chat widget aparece agora

#### **F. Avançar Fases (SQL)**
1. Para testar Fase 2:
   - Executar `scripts/reset-jornada-teste.sql`
   - Descomentar seção "OPÇÃO 2"
   - Ajustar `v_day_number := 8`
   - Executar
2. Para testar Fase 3:
   - Mesmo script, ajustar `v_day_number := 16`
   - Executar

---

## 🎯 CHECKLIST RÁPIDO

- [ ] Servidor rodando (`npm run dev`)
- [ ] Conta resetada (SQL)
- [ ] Login funciona
- [ ] Onboarding aparece
- [ ] Diagnóstico completo
- [ ] WelcomeCard aparece na home
- [ ] Sidebar mostra apenas Fase 1
- [ ] Dia 1 completo
- [ ] Chat liberado
- [ ] Fase 2 testada (SQL)
- [ ] Fase 3 testada (SQL)

---

## 🐛 PROBLEMAS COMUNS

**Onboarding não aparece?**
→ Executar `scripts/reset-diagnostico-teste.sql`

**WelcomeCard não aparece?**
→ Verificar se `current_day <= 1` (resetar jornada)

**Chat não aparece?**
→ Verificar se Dia 1 foi completado

**Sidebar mostra tudo?**
→ Verificar se `current_day` está correto

---

**Status:** ✅ Guia rápido criado  
**Próxima ação:** Seguir passos acima e testar!


