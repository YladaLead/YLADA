# 🏘️ PLANO COMPLETO: Comunidade Interna YLADA

## 🎯 OBJETIVO

Criar uma **comunidade interna** na plataforma para substituir o grupo de WhatsApp, permitindo:
- ✅ Comunicação entre membros
- ✅ Compartilhamento de experiências
- ✅ Suporte entre pares
- ✅ Networking
- ✅ Conteúdo organizado e pesquisável
- ✅ Moderação e controle

---

## 📋 FUNCIONALIDADES PRINCIPAIS

### **1. POSTS E DISCUSSÕES**
- Criar posts (texto, imagens, links)
- Categorias/tópicos (ex: "Dúvidas", "Dicas", "Casos de Sucesso", "Networking")
- Tags para organização
- Formatação rica (markdown)

### **2. INTERAÇÕES**
- Curtir posts
- Comentar (com respostas aninhadas)
- Compartilhar posts
- Marcar como favorito
- Seguir membros

### **3. NOTIFICAÇÕES**
- Notificação quando alguém comenta seu post
- Notificação quando alguém responde seu comentário
- Notificação de novos posts em categorias que você segue
- Notificação de menções (@nome)
- Push notifications + email

### **4. BUSCA E DESCOBERTA**
- Busca por texto
- Filtros por categoria, tags, autor
- Posts mais populares
- Posts recentes
- Posts não lidos

### **5. PERFIS E NETWORKING**
- Perfil público na comunidade
- Bio, foto, área de atuação
- Estatísticas (posts, comentários, curtidas)
- Seguir outros membros
- Feed personalizado

### **6. MODERAÇÃO**
- Admin pode moderar posts/comentários
- Denunciar conteúdo inapropriado
- Ocultar/remover posts
- Banir usuários (se necessário)
- Aprovar posts (opcional - para novos membros)

### **7. ORGANIZAÇÃO**
- Categorias fixas (ex: "Dúvidas Técnicas", "Vendas", "Marketing")
- Tags livres
- Pinned posts (fixar posts importantes)
- Posts arquivados

---

## 🏗️ ESTRUTURA TÉCNICA

### **1. BANCO DE DADOS (Supabase)**

#### **Tabela: `community_posts`**
```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL, -- 'nutri', 'wellness', 'coach', 'nutra'
  
  -- Conteúdo
  titulo VARCHAR(255) NOT NULL,
  conteudo TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'texto', -- 'texto', 'imagem', 'link', 'video'
  
  -- Organização
  categoria VARCHAR(100) NOT NULL, -- 'duvidas', 'dicas', 'casos-sucesso', 'networking'
  tags TEXT[] DEFAULT '{}',
  
  -- Mídia
  imagens TEXT[], -- URLs das imagens
  video_url TEXT,
  link_url TEXT,
  link_preview JSONB, -- {title, description, image}
  
  -- Engajamento
  curtidas_count INTEGER DEFAULT 0,
  comentarios_count INTEGER DEFAULT 0,
  visualizacoes_count INTEGER DEFAULT 0,
  compartilhamentos_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'publico', -- 'publico', 'aprovacao', 'arquivado', 'removido'
  pinned BOOLEAN DEFAULT false,
  destacado BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Índices
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_posts_user ON community_posts(user_id);
CREATE INDEX idx_posts_area ON community_posts(area);
CREATE INDEX idx_posts_categoria ON community_posts(categoria);
CREATE INDEX idx_posts_status ON community_posts(status) WHERE status = 'publico';
CREATE INDEX idx_posts_tags ON community_posts USING GIN(tags);
CREATE INDEX idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_posts_pinned ON community_posts(pinned) WHERE pinned = true;
```

#### **Tabela: `community_comments`**
```sql
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE, -- Para respostas aninhadas
  
  -- Conteúdo
  conteudo TEXT NOT NULL,
  
  -- Engajamento
  curtidas_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'publico', -- 'publico', 'removido'
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX idx_comments_post ON community_comments(post_id);
CREATE INDEX idx_comments_user ON community_comments(user_id);
CREATE INDEX idx_comments_parent ON community_comments(parent_id);
CREATE INDEX idx_comments_created ON community_comments(created_at DESC);
```

#### **Tabela: `community_reactions`** (Curtidas)
```sql
CREATE TABLE community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  tipo VARCHAR(20) DEFAULT 'curtir', -- 'curtir', 'amei', 'util', etc.
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que usuário só pode curtir uma vez
  CONSTRAINT unique_user_post UNIQUE (user_id, post_id) WHERE post_id IS NOT NULL,
  CONSTRAINT unique_user_comment UNIQUE (user_id, comment_id) WHERE comment_id IS NOT NULL,
  CONSTRAINT check_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_reactions_post ON community_reactions(post_id);
CREATE INDEX idx_reactions_comment ON community_reactions(comment_id);
CREATE INDEX idx_reactions_user ON community_reactions(user_id);
```

#### **Tabela: `community_follows`** (Seguir membros)
```sql
CREATE TABLE community_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Não pode seguir a si mesmo
  CONSTRAINT check_not_self CHECK (follower_id != following_id),
  -- Não pode seguir duas vezes
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Índices
CREATE INDEX idx_follows_follower ON community_follows(follower_id);
CREATE INDEX idx_follows_following ON community_follows(following_id);
```

#### **Tabela: `community_notifications`**
```sql
CREATE TABLE community_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tipo de notificação
  tipo VARCHAR(50) NOT NULL, -- 'comentario', 'curtida', 'resposta', 'mencao', 'novo_post'
  
  -- Referências
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Quem fez a ação
  
  -- Conteúdo
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT,
  link TEXT, -- URL para onde redirecionar
  
  -- Status
  lida BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_notifications_user ON community_notifications(user_id);
CREATE INDEX idx_notifications_lida ON community_notifications(user_id, lida) WHERE lida = false;
CREATE INDEX idx_notifications_created ON community_notifications(created_at DESC);
```

#### **Tabela: `community_reports`** (Denúncias)
```sql
CREATE TABLE community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- O que está sendo denunciado
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  
  -- Motivo
  motivo VARCHAR(100) NOT NULL, -- 'spam', 'inapropriado', 'bullying', 'outro'
  descricao TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'analisando', 'resolvido', 'rejeitado'
  resolvido_por UUID REFERENCES auth.users(id),
  resolvido_em TIMESTAMP WITH TIME ZONE,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **2. APIs (Next.js)**

#### **Estrutura de Pastas:**
```
src/app/api/community/
├── posts/
│   ├── route.ts              # GET (listar), POST (criar)
│   ├── [id]/
│   │   ├── route.ts          # GET (detalhes), PUT (editar), DELETE
│   │   ├── comments/route.ts # GET (comentários), POST (comentar)
│   │   └── react/route.ts   # POST (curtir), DELETE (descurtir)
│   └── search/route.ts       # GET (buscar posts)
├── comments/
│   └── [id]/
│       ├── route.ts          # PUT (editar), DELETE
│       └── react/route.ts    # POST (curtir comentário)
├── notifications/
│   ├── route.ts              # GET (listar), PUT (marcar como lida)
│   └── unread/route.ts       # GET (contar não lidas)
├── follows/
│   ├── route.ts              # POST (seguir), DELETE (deixar de seguir)
│   └── [userId]/route.ts     # GET (verificar se segue)
└── reports/
    └── route.ts              # POST (denunciar)
```

#### **Exemplo: API de Posts**
```typescript
// src/app/api/community/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'
import { requireApiAuth } from '@/lib/api-auth'

// GET /api/community/posts - Listar posts
export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const { user } = authResult
  const supabase = createClient()
  
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area') || userProfile?.perfil || 'wellness'
  const categoria = searchParams.get('categoria')
  const tag = searchParams.get('tag')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  let query = supabase
    .from('community_posts')
    .select(`
      *,
      user:user_profiles!community_posts_user_id_fkey(
        id,
        nome_completo,
        email,
        perfil
      ),
      reactions:community_reactions(count),
      comments:community_comments(count)
    `)
    .eq('area', area)
    .eq('status', 'publico')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)
  
  if (categoria) {
    query = query.eq('categoria', categoria)
  }
  
  if (tag) {
    query = query.contains('tags', [tag])
  }
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ posts: data, page, limit })
}

// POST /api/community/posts - Criar post
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request)
  if (authResult instanceof NextResponse) return authResult
  
  const { user, userProfile } = authResult
  const supabase = createClient()
  
  const body = await request.json()
  const { titulo, conteudo, categoria, tags, imagens, video_url, link_url } = body
  
  // Validação
  if (!titulo || !conteudo || !categoria) {
    return NextResponse.json(
      { error: 'Título, conteúdo e categoria são obrigatórios' },
      { status: 400 }
    )
  }
  
  // Criar post
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: user.id,
      area: userProfile?.perfil || 'wellness',
      titulo,
      conteudo,
      categoria,
      tags: tags || [],
      imagens: imagens || [],
      video_url,
      link_url
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Criar notificação para seguidores (opcional - pode ser assíncrono)
  // TODO: Implementar notificações
  
  return NextResponse.json({ post: data }, { status: 201 })
}
```

---

### **3. FRONTEND (React/Next.js)**

#### **Estrutura de Páginas:**
```
src/app/pt/[area]/comunidade/
├── page.tsx                  # Lista de posts (feed)
├── novo/
│   └── page.tsx             # Criar novo post
├── [id]/
│   └── page.tsx              # Detalhes do post
├── categorias/
│   └── [categoria]/
│       └── page.tsx          # Posts por categoria
└── perfil/
    └── [userId]/
        └── page.tsx          # Perfil do membro
```

#### **Componentes:**
```
src/components/community/
├── PostCard.tsx              # Card de post no feed
├── PostDetail.tsx             # Detalhes completos do post
├── PostForm.tsx               # Formulário criar/editar post
├── CommentList.tsx            # Lista de comentários
├── CommentForm.tsx            # Formulário de comentário
├── ReactionButton.tsx         # Botão de curtir
├── NotificationBell.tsx      # Sino de notificações
├── NotificationList.tsx       # Lista de notificações
└── CommunitySidebar.tsx       # Sidebar com categorias, tags, etc.
```

---

## 🚀 IMPLEMENTAÇÃO - FASE A FASE

### **FASE 1: Base (Semana 1)**
1. ✅ Criar migração SQL (tabelas principais)
2. ✅ Criar APIs básicas (posts, comentários)
3. ✅ Criar página de feed
4. ✅ Criar formulário de post
5. ✅ Testar criação e listagem

### **FASE 2: Interações (Semana 2)**
1. ✅ Sistema de curtidas
2. ✅ Sistema de comentários
3. ✅ Notificações básicas
4. ✅ Busca simples

### **FASE 3: Avançado (Semana 3)**
1. ✅ Perfis de membros
2. ✅ Seguir membros
3. ✅ Feed personalizado
4. ✅ Notificações push
5. ✅ Moderação básica

### **FASE 4: Polimento (Semana 4)**
1. ✅ UI/UX refinado
2. ✅ Performance (cache, paginação)
3. ✅ Testes
4. ✅ Documentação
5. ✅ Migração do WhatsApp

---

## 📊 DIFERENÇAS: WhatsApp vs Comunidade Interna

| Recurso | WhatsApp | Comunidade Interna |
|---------|----------|-------------------|
| **Organização** | ❌ Caótico | ✅ Categorias, tags |
| **Busca** | ⚠️ Limitada | ✅ Busca completa |
| **Histórico** | ⚠️ Perdido | ✅ Sempre disponível |
| **Notificações** | ✅ Sim | ✅ Sim (push + email) |
| **Mídia** | ✅ Sim | ✅ Sim (imagens, vídeos) |
| **Moderação** | ⚠️ Manual | ✅ Ferramentas |
| **Privacidade** | ⚠️ Número exposto | ✅ Perfil controlado |
| **Profissionalismo** | ❌ Informal | ✅ Profissional |
| **Integração** | ❌ Externa | ✅ Integrado na plataforma |

---

## 💰 CUSTOS

- **Desenvolvimento:** Já incluído (você desenvolve)
- **Infraestrutura:** Já incluído (Supabase + Vercel)
- **Armazenamento:** Incluído no plano Supabase
- **Total:** **R$ 0,00** (sem custos adicionais)

---

## ✅ VANTAGENS

1. **Organização:** Conteúdo categorizado e pesquisável
2. **Profissionalismo:** Ambiente mais adequado para negócios
3. **Integração:** Tudo na mesma plataforma
4. **Controle:** Moderação e gestão completa
5. **Escalabilidade:** Suporta milhares de membros
6. **Histórico:** Nunca perde informações
7. **Busca:** Encontra qualquer conteúdo rapidamente
8. **Notificações:** Push + email (não depende de WhatsApp)

---

## 🎯 PRÓXIMOS PASSOS

1. **Aprovar plano** ✅
2. **Criar migração SQL** (tabelas)
3. **Criar APIs básicas** (posts, comentários)
4. **Criar interface** (feed, criar post)
5. **Testar com usuários beta**
6. **Lançar para todos**
7. **Migrar do WhatsApp**

---

## 📝 NOTAS IMPORTANTES

- **Privacidade:** Cada área (nutri, wellness, coach) tem sua própria comunidade
- **Moderação:** Admins podem moderar conteúdo
- **Notificações:** Push notifications já configuradas
- **Performance:** Paginação e cache para suportar muitos posts
- **Mobile:** Interface responsiva (funciona no app)

---

**Pronto para começar?** 🚀
