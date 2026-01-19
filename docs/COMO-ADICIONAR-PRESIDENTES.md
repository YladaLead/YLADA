# 🏆 Como Adicionar Presidentes Manualmente

## 📍 Localização

Acesse: **`/admin/presidentes`**

Ou pelo dashboard admin: Clique em "Presidentes Autorizados"

---

## ➕ Como Adicionar um Presidente

### **Passo a Passo:**

1. **Acesse a página** `/admin/presidentes`
2. **Preencha o formulário:**
   - **Nome Completo do Presidente** * (obrigatório)
     - ⚠️ **IMPORTANTE:** Use o nome **padronizado** exatamente como deve aparecer no dropdown
     - Exemplo: `"Andre e Deise Faula"` (não `"André e Deise"` ou `"Andre e Deise"`)
   - **Email** (opcional)
   - **Observações** (opcional)
3. **Clique em "Adicionar Presidente"**
4. **Pronto!** O presidente já aparece no dropdown da página de trial

---

## 📋 Exemplos de Nomes Padronizados

Use estes nomes exatos (já cadastrados):

- `Claudinei Leite`
- `Andre e Deise Faula`
- `Marcelino e Valdete`
- `Carlota Batista`
- `Gladis e Marino`
- `Marcio e Ana Pasqua`

---

## ⚠️ Regras Importantes

1. **Nomes devem ser padronizados** - O nome que você colocar aqui é o que aparece no dropdown
2. **Case-sensitive** - O sistema verifica se já existe (case-insensitive), mas use o padrão correto
3. **Não duplicar** - Se o presidente já existe, você receberá uma mensagem de erro
4. **Reativar** - Se um presidente inativo for adicionado novamente, ele será reativado automaticamente

---

## 🔍 Verificar Lista

A lista de presidentes aparece abaixo do formulário:

- ✅ **Ativos** - Aparecem no dropdown
- ❌ **Inativos** - Não aparecem no dropdown (mas podem ser reativados)

---

## 🗑️ Desativar Presidente

1. Encontre o presidente na lista
2. Clique em **"Desativar"**
3. O presidente não aparecerá mais no dropdown, mas os dados são mantidos

---

## 📊 Relatório de Trials por Presidente

Para ver quantos trials cada presidente tem:

1. Acesse `/admin/trials`
2. Role até a seção **"📊 Relatório por Presidente"**
3. Veja estatísticas de:
   - Trials Ativos
   - Trials Expirados
   - Total por presidente

---

## 🎯 Fluxo Completo

1. **Admin adiciona presidente** → `/admin/presidentes`
2. **Presidente aparece no dropdown** → `/pt/wellness/trial/presidentes`
3. **Pessoa seleciona presidente** → Cria conta
4. **Sistema salva nome do presidente** → Para rastreamento
5. **Admin vê relatório** → `/admin/trials` (seção "Relatório por Presidente")

---

## 💡 Dicas

- **Padronize antes de adicionar** - Defina o nome exato que todos devem usar
- **Use observações** - Anote informações úteis sobre cada presidente
- **Email opcional** - Pode ser útil para contato futuro
- **Reative ao invés de criar novo** - Se um presidente foi desativado, adicione novamente para reativar
