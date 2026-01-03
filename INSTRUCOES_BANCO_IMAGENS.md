# 📋 Instruções - Banco de Imagens Envato Elements

## ✅ O QUE JÁ ESTÁ PRONTO

1. ✅ **Tabela no Supabase** (`media_library`)
2. ✅ **API de busca** (`/api/creative-studio/search-media-library`)
3. ✅ **Integração automática** (banco próprio → APIs → DALL-E)
4. ✅ **Script de upload em lote** (`scripts/upload-media-library.ts`)

---

## 🚀 PASSO A PASSO

### 1. Executar Migration no Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Copie e cole o conteúdo de: `migrations/019-criar-tabela-media-library.sql`
5. Clique em **Run**

**Verificar se funcionou:**
```sql
SELECT COUNT(*) FROM media_library;
```
Deve retornar `0` (tabela vazia, mas criada).

---

### 2. Criar Bucket no Supabase Storage

1. No Supabase Dashboard, vá em **Storage**
2. Clique em **New bucket**
3. Nome: `media-library`
4. **Público**: ✅ Sim (para URLs públicas)
5. Clique em **Create bucket**

**Configurar políticas:**
```sql
-- Permitir leitura pública
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'media-library');

-- Permitir upload apenas para admins (via API)
```

---

### 3. Baixar Imagens do Envato

Organize assim no HD externo:

```
envato-downloads/
├── imagens/
│   ├── nutri/
│   ├── coach/
│   ├── wellness/
│   └── nutra/
├── videos/
│   ├── nutri/
│   ├── coach/
│   ├── wellness/
│   └── nutra/
└── audios/
    ├── nutri/
    ├── coach/
    ├── wellness/
    └── nutra/
```

**Dica:** Se conseguir, nomeie os arquivos com tags:
- `nutri-agenda-vazia-001.jpg`
- `coach-treino-resultado-001.mp4`

---

### 4. Fazer Upload em Lote

Quando tiver os arquivos organizados:

```bash
# No terminal, na raiz do projeto
npx tsx scripts/upload-media-library.ts /caminho/para/envato-downloads
```

**Exemplo:**
```bash
npx tsx scripts/upload-media-library.ts /Volumes/HD-Externo/envato-downloads
```

O script vai:
- ✅ Processar todas as pastas
- ✅ Fazer upload para Supabase Storage
- ✅ Extrair tags do nome do arquivo
- ✅ Detectar área e propósito automaticamente
- ✅ Inserir metadados na tabela `media_library`

---

### 5. Testar o Sistema

1. Acesse: `http://localhost:3001/pt/creative-studio`
2. Selecione: **Nutri** → **Anúncio Rápido**
3. No chat, digite: **"Criar anúncio sobre agenda vazia"**
4. A IA vai buscar automaticamente:
   - **Primeiro**: No banco próprio (media_library)
   - **Se não encontrar**: Em APIs externas (Pexels/Unsplash)
   - **Se necessário**: Criar com DALL-E

---

## 📊 COMO FUNCIONA

### Lógica de Busca

```
1. IA sugere buscar imagem
   ↓
2. Sistema busca no media_library (banco próprio)
   ↓
3. Encontrou? → Usa do banco próprio ✅
   ↓
4. Não encontrou? → Busca em Pexels/Unsplash
   ↓
5. Não encontrou? → Cria com DALL-E
```

### Prioridades

- **Banco próprio**: Sempre primeiro (mais relevante)
- **APIs externas**: Fallback quando não tem no banco
- **DALL-E**: Última opção (criação sob demanda)

---

## 🔧 AJUSTES MANUAIS (Opcional)

Se quiser ajustar tags/relevância manualmente:

```sql
-- Atualizar tags de um item
UPDATE media_library
SET tags = ARRAY['agenda', 'vazia', 'nutricionista', 'frustracao']
WHERE id = 'uuid-do-item';

-- Aumentar relevância
UPDATE media_library
SET relevance_score = 90
WHERE file_name LIKE '%agenda-vazia%';

-- Marcar como destaque
UPDATE media_library
SET is_featured = true
WHERE area = 'nutri' AND purpose = 'dor';
```

---

## 📝 CHECKLIST

- [ ] Migration executada no Supabase
- [ ] Bucket `media-library` criado
- [ ] Imagens/vídeos baixados e organizados
- [ ] Script de upload executado
- [ ] Teste de busca funcionando
- [ ] Sistema priorizando banco próprio

---

## 🎯 RESULTADO ESPERADO

Quando você criar um vídeo:
1. ✅ IA busca automaticamente no banco próprio
2. ✅ Encontra imagens/vídeos relevantes
3. ✅ Mostra na aba "Busca" (aberta automaticamente)
4. ✅ Você seleciona e adiciona à timeline
5. ✅ Vídeo pronto com assets do banco próprio!

---

## 💡 DICAS

1. **Tags ajudam**: Nomeie arquivos com palavras-chave
2. **Organização**: Mantenha estrutura de pastas
3. **Relevância**: Ajuste `relevance_score` para priorizar
4. **Teste**: Sempre teste após upload em lote

---

## 🆘 PROBLEMAS COMUNS

**Erro: "bucket não existe"**
→ Crie o bucket `media-library` no Supabase Storage

**Erro: "tabela não existe"**
→ Execute a migration `019-criar-tabela-media-library.sql`

**Nenhum resultado encontrado**
→ Verifique se os arquivos foram uploadados corretamente

---

**Pronto! Quando você terminar de baixar, me avise e eu ajudo com o upload!** 🚀


