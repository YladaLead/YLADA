# ⚠️ Como Aumentar o Limite Global de Upload no Supabase

## 🎯 Problema

Ao tentar fazer upload de arquivos maiores que 50MB, você recebe o erro:
> **"Failed to upload 1 file as its size is beyond the global upload limit of 50 MB"**

Isso acontece porque o Supabase tem um **limite global** de upload que se aplica a TODOS os buckets, independente do limite individual de cada bucket.

## ✅ Solução

### Passo 1: Acessar Storage Settings

1. Acesse o **Supabase Dashboard**
2. No menu lateral, clique em **Storage**
3. No canto superior direito, clique no ícone de **Settings** (⚙️ engrenagem)

### Passo 2: Aumentar o Limite

1. Na página de Settings, role até encontrar a seção **"File size upload limit"**
2. O valor padrão é **50 MB**
3. Altere para **150 MB** (ou mais, dependendo do tamanho dos seus arquivos)
4. Clique em **"Save"** ou **"Update"**

### Passo 3: Verificar

Após salvar, você pode verificar se a alteração foi aplicada:
- O valor deve aparecer atualizado na interface
- Tente fazer upload novamente do arquivo

## 📊 Valores Recomendados

| Tipo de Arquivo | Limite Recomendado |
|----------------|-------------------|
| Imagens, PDFs pequenos | 50 MB (padrão) |
| Vídeos curtos | 100 MB |
| Vídeos de landing pages | 150 MB |
| Vídeos longos/cursos | 200-500 MB |

## ⚠️ Importante

- **Limite Global vs Limite do Bucket:**
  - O **limite global** é o máximo que o Supabase permite em qualquer upload
  - O **limite do bucket** é específico de cada bucket
  - O upload falhará se exceder **qualquer um dos dois limites**
  - Sempre verifique ambos!

- **Limites do Plano:**
  - Planos gratuitos podem ter limites menores
  - Verifique seu plano no Supabase Dashboard → Settings → Billing

## 🔍 Onde Encontrar

```
Supabase Dashboard
  └── Storage (menu lateral)
      └── Settings (ícone ⚙️ no canto superior direito)
          └── File size upload limit
```

## 🐛 Troubleshooting

### "Não consigo encontrar a opção"
- Certifique-se de estar na aba **Storage** (não Database)
- Procure pelo ícone de engrenagem no canto superior direito
- Se não aparecer, você pode não ter permissões de admin

### "O limite não está salvando"
- Verifique se você tem permissões de administrador
- Tente atualizar a página e verificar novamente
- Limites podem ter restrições baseadas no plano

### "Ainda recebo erro após aumentar"
- Verifique se salvou as alterações
- Aguarde alguns segundos para a configuração ser aplicada
- Verifique também o limite do bucket individual
- Limpe o cache do navegador e tente novamente

## 📚 Referências

- [Supabase Storage Limits](https://supabase.com/docs/guides/storage/limits)
- [Supabase Storage Settings](https://supabase.com/docs/guides/storage)
