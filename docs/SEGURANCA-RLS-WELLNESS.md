# 🔒 Segurança RLS - Tabelas Wellness

## 📋 Resumo das Correções

Este documento descreve as correções de segurança aplicadas para resolver os alertas do Supabase Security Advisor.

---

## 🎯 Problema Identificado

O Supabase Security Advisor identificou **51 erros** e **59 avisos** relacionados a:

1. **RLS Desabilitado em Tabelas Públicas** - A maioria dos problemas
2. **Views com SECURITY DEFINER** - Algumas views

---

## ✅ Correções Aplicadas

### **Migration 030: Habilitar RLS em Tabelas Wellness**

**Tabelas Corrigidas:**
- ✅ `wellness_links`
- ✅ `wellness_treinos`
- ✅ `wellness_fluxos`
- ✅ `wellness_fluxos_passos`
- ✅ `wellness_fluxos_scripts`
- ✅ `wellness_fluxos_dicas`
- ✅ `wellness_materiais`
- ✅ `wellness_materiais_acesso`
- ✅ `wellness_scripts`
- ✅ `wellness_cartilhas`
- ✅ `wellness_apresentacoes`
- ✅ `wellness_produtos`
- ✅ `wellness_diagnosticos`
- ✅ `wellness_trilhas` (se existir)
- ✅ `wellness_modulos` (se existir)
- ✅ `wellness_aulas` (se existir)
- ✅ `wellness_checklists` (se existir)
- ✅ `wellness_progresso` (se existir)
- ✅ `wellness_anotacoes` (se existir)
- ✅ `wellness_acoes` (se existir)
- ✅ `wellness_passo_a_passo_diario` (se existir)

**Políticas Implementadas:**
- ✅ Usuários wellness podem ver apenas conteúdo ativo
- ✅ Usuários podem ver apenas seus próprios dados (diagnósticos, progresso, etc)
- ✅ Admins podem ver e gerenciar tudo
- ✅ Políticas de INSERT/UPDATE/DELETE restritas a admins

---

### **Migration 031: Habilitar RLS em Outras Tabelas Públicas**

**Tabelas Corrigidas:**
- ✅ `courses_trails`
- ✅ `trails_modules`
- ✅ `trails_lessons`
- ✅ `progress_user_trails`
- ✅ `library_files`
- ✅ `library_favorites`
- ✅ `microcourses`
- ✅ `tutorials`
- ✅ `client_documents`
- ✅ `contact_submissions`
- ✅ Tabelas de backup (acesso apenas para admins)

**Políticas Implementadas:**
- ✅ Usuários autenticados podem ver conteúdo ativo
- ✅ Usuários podem ver apenas seus próprios dados
- ✅ Admins têm acesso completo
- ✅ Formulários de contato podem ser criados por qualquer pessoa (público)

---

### **Migration 032: Revisar Views com SECURITY DEFINER**

**Views Corrigidas:**
- ✅ `vw_consultas_resumo` - Recriada sem SECURITY DEFINER
- ✅ `vw_formularios_respostas` - Recriada sem SECURITY DEFINER
- ✅ `vw_avaliacoes_resumo` - Recriada sem SECURITY DEFINER
- ✅ `vw_programas_adesao` - Recriada sem SECURITY DEFINER
- ✅ `vw_evolucao_resumo` - Recriada sem SECURITY DEFINER

**Mudanças:**
- ✅ Removido SECURITY DEFINER
- ✅ Adicionado filtro baseado em `auth.uid()` e `is_admin_user()`
- ✅ Views agora respeitam RLS das tabelas base

---

## 🔐 Funções Helper Criadas

### `is_wellness_user()`
Verifica se o usuário autenticado tem perfil wellness.

### `is_admin_user()`
Verifica se o usuário autenticado é admin.

---

## 📊 Padrão de Políticas RLS

### **Para Tabelas de Conteúdo (Links, Fluxos, Materiais):**
- **SELECT:** Usuários wellness veem apenas conteúdo ativo
- **SELECT:** Admins veem tudo
- **INSERT/UPDATE/DELETE:** Apenas admins

### **Para Tabelas de Dados do Usuário (Diagnósticos, Progresso):**
- **SELECT:** Usuários veem apenas seus próprios dados
- **SELECT:** Admins veem tudo
- **INSERT:** Usuários podem criar seus próprios registros
- **UPDATE/DELETE:** Apenas admins

---

## 🚀 Como Aplicar

Execute as migrations na ordem:

1. `030-habilitar-rls-tabelas-wellness.sql`
2. `031-habilitar-rls-outras-tabelas-publicas.sql`
3. `032-revisar-views-security-definer.sql`

**No Supabase SQL Editor:**
```sql
-- Execute cada migration completa
```

---

## ✅ Resultado Esperado

Após aplicar as migrations:
- ✅ Todas as tabelas wellness terão RLS habilitado
- ✅ Políticas de acesso adequadas implementadas
- ✅ Views sem SECURITY DEFINER desnecessário
- ✅ Supabase Security Advisor deve mostrar 0 erros relacionados a RLS

---

## 📝 Notas Importantes

1. **Teste após aplicar:** Verifique se os usuários ainda conseguem acessar os dados necessários
2. **Backup:** Sempre faça backup antes de aplicar migrations de segurança
3. **Monitoramento:** Após aplicar, monitore logs para garantir que não há bloqueios indevidos

---

**Data:** 2025-01-XX  
**Status:** ✅ Migrations criadas e prontas para execução
