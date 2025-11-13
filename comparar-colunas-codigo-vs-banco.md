# 🔍 Comparação: Colunas do Código vs Banco de Dados

## 📋 Colunas que o CÓDIGO está tentando salvar:

### Campos Obrigatórios:
- `user_id` (UUID) - ID do usuário no auth.users
- `nome_completo` (VARCHAR) - Nome completo do usuário
- `perfil` (VARCHAR) - Área: 'wellness', 'nutri', 'coach', 'nutra'
- `updated_at` (TIMESTAMP) - Data de atualização

### Campos Opcionais:
- `whatsapp` (VARCHAR) - Número de WhatsApp
- `bio` (TEXT) - Biografia do usuário
- `user_slug` (VARCHAR) - Slug para URLs personalizadas
- `country_code` (VARCHAR) - Código do país (ex: 'BR')
- `email` (VARCHAR) - Email do usuário

## 🔍 Colunas que você vê no SUPABASE:

Execute o script `verificar-colunas-user-profiles.sql` para ver todas as colunas.

## ⚠️ Possíveis Discrepâncias:

### Se você vê no Supabase:
- `uuid` → O código usa `user_id` (pode ser a mesma coisa ou diferente)
- `whatsapp` → ✅ Correto, o código usa `whatsapp`
- `instagram` → O código NÃO salva isso (pode ser coluna antiga)
- `profession` → O código NÃO salva isso diretamente (é atualizado via bulk update)

### Colunas que o código SALVA mas você pode não ver:
- `nome_completo` → Deve estar na tabela
- `perfil` → Deve estar na tabela
- `bio` → Pode não existir se não foi criada
- `user_slug` → Pode não existir se não foi criada
- `country_code` → Pode não existir se não foi criada

## 🔧 Como Verificar:

1. Execute o script SQL `verificar-colunas-user-profiles.sql`
2. Compare com a lista acima
3. Se alguma coluna estiver faltando, pode ser que:
   - A coluna não existe no banco
   - O nome está diferente
   - O código está tentando salvar em coluna que não existe

## 📝 Exemplo de Dados que o Código Tenta Salvar:

```json
{
  "user_id": "uuid-do-usuario",
  "nome_completo": "Nome Completo",
  "whatsapp": "5519981385563",
  "perfil": "wellness",
  "bio": null,
  "user_slug": null,
  "country_code": "BR",
  "updated_at": "2025-11-12T21:22:28.827Z"
}
```

