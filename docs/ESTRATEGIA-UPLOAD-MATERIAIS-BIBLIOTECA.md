# 📚 Estratégia: Sistema de Upload de Materiais para Biblioteca Wellness

## 🎯 Objetivo

Criar um sistema onde uma pessoa possa fazer upload de materiais (vídeos, PDFs) vindos de Google Drive e Telegram, e esses materiais sejam automaticamente organizados nas áreas corretas da biblioteca da plataforma.

---

## 📊 Situação Atual

### Estrutura Existente

1. **Tabela `wellness_materiais`:**
   - Campos: `codigo`, `titulo`, `descricao`, `tipo` (pdf, video, link, imagem, documento)
   - `categoria` (apresentacao, cartilha, produto, treinamento, script, outro)
   - `url`, `arquivo_path`, `tags`, `ativo`, `ordem`

2. **Seções da Biblioteca:**
   - 📄 Materiais de Apresentação
   - 📖 Cartilhas de Treinamento
   - 🥤 Produtos & Bebidas
   - 💬 Scripts Oficiais
   - 🎥 Vídeos de Treinamento

3. **Sistema de Storage:**
   - Supabase Storage já configurado
   - Exemplos de upload em outros módulos (cursos, documentos)

---

## 🎯 Problema a Resolver

1. **Materiais desorganizados:**
   - Google Drive com arquivos sem nomenclatura padrão
   - Telegram com materiais misturados
   - Nomes inconsistentes

2. **Necessidade:**
   - Upload simples para pessoa delegada
   - Organização automática por área/categoria
   - Exemplo: "vídeo de recrutamento" → vai para "Vídeos de Treinamento" com tag "recrutamento"

---

## ✅ Estratégia Proposta

### 1. **Interface de Upload Simplificada**

**Página:** `/admin/wellness/biblioteca/upload` (área administrativa)

**Funcionalidades:**
- Upload de múltiplos arquivos (arrastar e soltar)
- Seleção de categoria/área de destino
- Campo para título e descrição (opcional - pode usar nome do arquivo)
- Tags automáticas baseadas na categoria
- Preview do arquivo antes de salvar

**Categorias Disponíveis:**
- **Recrutamento** → Vídeos de Treinamento (tag: recrutamento)
- **Vendas** → Materiais de Apresentação (tag: vendas)
- **Treinamento** → Cartilhas de Treinamento (tag: treinamento)
- **Produtos** → Produtos & Bebidas (tag: produtos)
- **Scripts** → Scripts Oficiais (tag: scripts)
- **Apresentações** → Materiais de Apresentação (tag: apresentacao)

### 2. **Sistema de Organização Automática**

**Fluxo:**
1. Pessoa faz upload do arquivo
2. Seleciona categoria (ex: "Recrutamento")
3. Sistema automaticamente:
   - Faz upload para Supabase Storage (`wellness-biblioteca` bucket)
   - Detecta tipo de arquivo (PDF, vídeo, etc.)
   - Cria registro na tabela `wellness_materiais`
   - Define categoria baseada na seleção
   - Adiciona tags relevantes
   - Gera código único (ex: `video-recrutamento-001`)
   - Organiza na seção correta da biblioteca

### 3. **Estrutura de Pastas no Storage**

```
wellness-biblioteca/
├── videos/
│   ├── recrutamento/
│   ├── vendas/
│   ├── treinamento/
│   └── produtos/
├── pdfs/
│   ├── apresentacao/
│   ├── cartilhas/
│   └── produtos/
└── imagens/
    └── produtos/
```

### 4. **Mapeamento Categoria → Seção da Biblioteca**

| Categoria Selecionada | Tipo Material | Seção Biblioteca | Tags Automáticas |
|----------------------|---------------|------------------|------------------|
| Recrutamento | Vídeo | Vídeos de Treinamento | recrutamento, treinamento |
| Recrutamento | PDF | Cartilhas de Treinamento | recrutamento, cartilha |
| Vendas | Vídeo | Vídeos de Treinamento | vendas, treinamento |
| Vendas | PDF | Materiais de Apresentação | vendas, apresentacao |
| Treinamento | Vídeo/PDF | Cartilhas de Treinamento | treinamento |
| Produtos | Vídeo/PDF | Produtos & Bebidas | produtos |
| Scripts | PDF/Texto | Scripts Oficiais | scripts |
| Apresentações | PDF/Vídeo | Materiais de Apresentação | apresentacao |

### 5. **Processo Simplificado para Pessoa Delegada**

**Passo a Passo:**
1. Acessa `/admin/wellness/biblioteca/upload`
2. Arrasta arquivo(s) ou clica para selecionar
3. Seleciona categoria (ex: "Recrutamento")
4. (Opcional) Edita título/descrição
5. Clica "Adicionar à Biblioteca"
6. Sistema organiza automaticamente

**Resultado:**
- Arquivo salvo no storage
- Registro criado no banco
- Aparece automaticamente na seção correta
- Tags aplicadas para busca fácil

---

## 🗄️ Estrutura Técnica

### 1. **Nova Tabela (Opcional - para rastreamento)**

```sql
CREATE TABLE wellness_biblioteca_uploads (
  id UUID PRIMARY KEY,
  uploaded_by UUID REFERENCES auth.users(id),
  arquivo_original TEXT,
  arquivo_path TEXT,
  categoria_selecionada TEXT,
  material_id UUID REFERENCES wellness_materiais(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. **API Endpoint**

**POST `/api/admin/wellness/biblioteca/upload`**

**Request:**
```json
{
  "file": File,
  "categoria": "recrutamento" | "vendas" | "treinamento" | "produtos" | "scripts" | "apresentacoes",
  "titulo": "Título do Material (opcional)",
  "descricao": "Descrição (opcional)",
  "tags": ["tag1", "tag2"] // opcional
}
```

**Response:**
```json
{
  "success": true,
  "material": {
    "id": "uuid",
    "codigo": "video-recrutamento-001",
    "titulo": "Título",
    "url": "https://...",
    "categoria": "treinamento",
    "tipo": "video"
  }
}
```

### 3. **Bucket Supabase Storage**

**Nome:** `wellness-biblioteca`

**Estrutura de Políticas:**
- **Upload:** Apenas admins
- **Read:** Usuários wellness autenticados
- **Delete:** Apenas admins

---

## 🔄 Fluxo Completo

### Upload de Vídeo de Recrutamento

1. **Pessoa delegada:**
   - Baixa vídeo do Google Drive/Telegram
   - Acessa `/admin/wellness/biblioteca/upload`
   - Faz upload do arquivo
   - Seleciona categoria: "Recrutamento"
   - Clica "Adicionar"

2. **Sistema automaticamente:**
   - Detecta que é vídeo (`.mp4`, `.mov`, etc.)
   - Faz upload para `wellness-biblioteca/videos/recrutamento/`
   - Gera código: `video-recrutamento-001`
   - Cria registro em `wellness_materiais`:
     - `tipo`: `video`
     - `categoria`: `treinamento` (mapeamento automático)
     - `tags`: `['recrutamento', 'treinamento']`
     - `url`: URL pública do storage
   - Aparece em "Vídeos de Treinamento" com filtro "recrutamento"

3. **Usuário final:**
   - Acessa `/pt/wellness/biblioteca/videos`
   - Vê o vídeo na lista
   - Pode filtrar por tag "recrutamento"

---

## 🎨 Interface Proposta

### Tela de Upload

```
┌─────────────────────────────────────────┐
│  📚 Adicionar Material à Biblioteca     │
├─────────────────────────────────────────┤
│                                         │
│  [Arraste arquivos aqui ou clique]     │
│  ou                                     │
│  [📁 Selecionar Arquivos]               │
│                                         │
│  Arquivos selecionados:                │
│  ✅ video-recrutamento.mp4              │
│                                         │
│  Categoria:                             │
│  [▼ Selecionar Categoria]              │
│    • Recrutamento                       │
│    • Vendas                             │
│    • Treinamento                        │
│    • Produtos                           │
│    • Scripts                            │
│    • Apresentações                      │
│                                         │
│  Título (opcional):                     │
│  [___________________________]         │
│                                         │
│  Descrição (opcional):                  │
│  [___________________________]          │
│  [___________________________]          │
│                                         │
│  [❌ Cancelar]  [✅ Adicionar à Biblioteca] │
└─────────────────────────────────────────┘
```

---

## 🔮 Melhorias Futuras (Fase 2)

### 1. **Integração com Google Drive**
- Conectar conta Google Drive
- Listar arquivos do Drive
- Selecionar e importar diretamente
- Sincronização automática

### 2. **Integração com Telegram**
- Bot do Telegram
- Enviar arquivo para o bot
- Bot pergunta categoria
- Upload automático

### 3. **Detecção Inteligente**
- Analisar nome do arquivo
- Sugerir categoria automaticamente
- Exemplo: "video-recrutamento.mp4" → sugere "Recrutamento"

### 4. **Bulk Upload**
- Upload de múltiplos arquivos de uma vez
- Aplicar mesma categoria para todos
- Processamento em lote

---

## 📋 Checklist de Implementação

### Fase 1: Upload Básico
- [ ] Criar bucket `wellness-biblioteca` no Supabase Storage
- [ ] Criar API endpoint `/api/admin/wellness/biblioteca/upload`
- [ ] Criar página `/admin/wellness/biblioteca/upload`
- [ ] Implementar upload de arquivo único
- [ ] Implementar seleção de categoria
- [ ] Mapear categoria → seção da biblioteca
- [ ] Criar registro em `wellness_materiais`
- [ ] Testar upload de vídeo
- [ ] Testar upload de PDF

### Fase 2: Melhorias
- [ ] Upload múltiplo
- [ ] Preview de arquivo
- [ ] Edição de título/descrição
- [ ] Tags automáticas
- [ ] Validação de tipos de arquivo
- [ ] Limite de tamanho

### Fase 3: Integrações (Futuro)
- [ ] Integração Google Drive
- [ ] Bot Telegram
- [ ] Detecção inteligente de categoria

---

## ⚠️ Considerações Importantes

### Segurança
- Apenas admins podem fazer upload
- Validação de tipos de arquivo permitidos
- Limite de tamanho (ex: 100MB para vídeos, 10MB para PDFs)
- Sanitização de nomes de arquivo

### Performance
- Upload assíncrono para arquivos grandes
- Barra de progresso
- Compressão de vídeos (opcional)

### Organização
- Nomenclatura consistente de arquivos
- Tags padronizadas
- Códigos únicos gerados automaticamente

---

## 🎯 Resultado Esperado

**Para o Administrador:**
- Sistema simples de upload
- Organização automática
- Controle total sobre categorias

**Para a Pessoa Delegada:**
- Interface intuitiva
- Processo rápido (3 cliques)
- Feedback claro (sucesso/erro)

**Para os Usuários:**
- Materiais organizados
- Fácil de encontrar
- Tags para busca

---

## 📝 Resumo

**Estratégia:** Sistema de upload administrativo onde a pessoa seleciona a categoria e o sistema organiza automaticamente o material na seção correta da biblioteca, com tags e estrutura de pastas no storage.

**Vantagens:**
- ✅ Simples para usar
- ✅ Organização automática
- ✅ Escalável (fácil adicionar novas categorias)
- ✅ Rastreável (saber quem uploadou o quê)

**Próximo Passo:** Implementar Fase 1 (Upload Básico)

---

**Status:** 📋 Análise completa - Pronto para implementação quando autorizado
