# 🎨 Guia Prático - Envato Elements para Banco de Imagens

## 🎯 Objetivo

Popular o banco de imagens (`media_library`) com conteúdo do Envato Elements para ter um acervo próprio e relevante para o Creative Studio.

---

## 📋 Estratégia de Download

### 1. **Priorizar por Necessidade**

Comece baixando imagens/vídeos que são mais usados no Creative Studio:

#### **Área: NUTRI** (Prioridade Alta)
- ✅ **Agenda vazia/cheia** - Para anúncios sobre lotar agenda
- ✅ **Nutricionista atendendo** - Para vídeos de apresentação
- ✅ **Dashboard/plataforma** - Para mostrar a ferramenta
- ✅ **Alimentos saudáveis** - Para conteúdo educativo
- ✅ **Pessoa feliz/satisfeita** - Para mostrar resultados
- ✅ **Consultório médico** - Para contexto profissional

#### **Área: COACH** (Prioridade Média)
- ✅ **Treino/exercício** - Para conteúdo fitness
- ✅ **Resultados físicos** - Para mostrar transformação
- ✅ **Pessoa motivada** - Para inspiração

#### **Área: WELLNESS** (Prioridade Média)
- ✅ **Bem-estar/meditação** - Para conteúdo holístico
- ✅ **Natureza/calma** - Para ambiente zen
- ✅ **Yoga/mindfulness** - Para práticas

#### **Área: NUTRA** (Prioridade Baixa)
- ✅ **Suplementos** - Para produtos
- ✅ **Vida saudável** - Para lifestyle

---

## 🗂️ Estrutura de Pastas Recomendada

```
envato-downloads/
├── imagens/
│   ├── nutri/
│   │   ├── hook/          # Imagens de impacto
│   │   ├── dor/           # Problemas/frustrações
│   │   ├── solucao/       # Resultados/sucessos
│   │   ├── cta/           # Chamadas para ação
│   │   └── background/    # Fundos
│   ├── coach/
│   │   ├── hook/
│   │   ├── dor/
│   │   ├── solucao/
│   │   └── cta/
│   ├── wellness/
│   └── nutra/
├── videos/
│   ├── nutri/
│   │   ├── hook/
│   │   ├── b-roll/        # Vídeos de apoio
│   │   └── background/
│   ├── coach/
│   └── wellness/
└── audios/
    ├── nutri/
    │   ├── music/         # Músicas de fundo
    │   └── effect/         # Efeitos sonoros
    └── coach/
```

---

## 🏷️ Convenção de Nomes (IMPORTANTE!)

O script extrai tags automaticamente do nome do arquivo. Use esta convenção:

### Formato: `{area}-{palavras-chave}-{numero}.{ext}`

**Exemplos:**
```
nutri-agenda-vazia-001.jpg
nutri-nutricionista-atendendo-002.jpg
nutri-dashboard-plataforma-003.jpg
coach-treino-resultado-004.mp4
wellness-meditacao-natureza-005.jpg
nutri-hook-impacto-006.jpg
nutri-dor-frustracao-007.jpg
nutri-solucao-sucesso-008.jpg
nutri-cta-acao-009.jpg
nutri-background-fundo-010.jpg
```

### Palavras-chave que o script reconhece:

**Áreas:**
- `nutri`, `coach`, `wellness`, `nutra`

**Propósitos:**
- `hook`, `chamada`, `impacto` → `purpose: 'hook'`
- `dor`, `problema`, `frustracao` → `purpose: 'dor'`
- `solucao`, `resultado`, `sucesso` → `purpose: 'solucao'`
- `cta`, `acao`, `chamada` → `purpose: 'cta'`
- `background`, `fundo` → `purpose: 'background'`

**Tags automáticas:**
- `agenda`, `vazia`, `cheia`, `consulta`, `atendimento`
- `nutricionista`, `nutri`, `dieta`, `alimentacao`, `saude`
- `coach`, `treino`, `exercicio`, `fitness`
- `wellness`, `bem-estar`, `meditacao`, `yoga`
- `dashboard`, `plataforma`, `grafico`, `resultado`
- `pessoa`, `feliz`, `satisfeito`, `profissional`
- `comida`, `saudavel`, `fruta`, `verdura`

---

## 🚀 Processo Passo a Passo

### 1. **Baixar do Envato Elements**

1. Acesse [Envato Elements](https://elements.envato.com)
2. Busque por termos específicos (ex: "nutritionist consultation")
3. Baixe e organize na estrutura de pastas
4. **Renomeie os arquivos** seguindo a convenção acima

### 2. **Fazer Upload em Lote**

```bash
# No terminal, na raiz do projeto
npx tsx scripts/upload-media-library.ts /caminho/para/envato-downloads
```

**Exemplo:**
```bash
npx tsx scripts/upload-media-library.ts /Volumes/HD-Externo/envato-downloads
```

### 3. **Verificar Upload**

```sql
-- Ver quantos arquivos foram uploadados
SELECT COUNT(*) FROM media_library;

-- Ver por área
SELECT area, COUNT(*) 
FROM media_library 
GROUP BY area;

-- Ver por propósito
SELECT purpose, COUNT(*) 
FROM media_library 
GROUP BY purpose;

-- Ver últimas imagens adicionadas
SELECT file_name, area, purpose, tags, relevance_score
FROM media_library
ORDER BY created_at DESC
LIMIT 20;
```

---

## 💡 Sugestões de Busca no Envato

### Para NUTRI:

**Buscar por:**
- "nutritionist consultation"
- "empty calendar schedule"
- "healthy food nutrition"
- "medical consultation room"
- "happy client patient"
- "dashboard analytics"
- "healthcare professional"

**Filtrar por:**
- ✅ Lifestyle
- ✅ Business
- ✅ Healthcare
- ✅ Food & Drink

### Para COACH:

**Buscar por:**
- "fitness training workout"
- "personal trainer gym"
- "transformation results"
- "motivation exercise"

**Filtrar por:**
- ✅ Sports & Fitness
- ✅ Lifestyle
- ✅ People

### Para WELLNESS:

**Buscar por:**
- "meditation yoga mindfulness"
- "nature calm peaceful"
- "wellness spa relaxation"
- "holistic health"

**Filtrar por:**
- ✅ Lifestyle
- ✅ Nature
- ✅ Health & Wellness

---

## 🎯 Estratégia de Teste

### Fase 1: Teste Pequeno (Recomendado)
1. Baixe **10-20 imagens** de cada área
2. Organize e renomeie
3. Faça upload
4. Teste no Creative Studio
5. Verifique se a busca está funcionando

### Fase 2: Expansão
1. Se funcionou bem, expanda para **50-100 imagens** por área
2. Adicione vídeos e áudios
3. Ajuste tags e relevância conforme necessário

### Fase 3: Manutenção
1. Adicione novas imagens conforme necessidade
2. Ajuste `relevance_score` para priorizar as melhores
3. Marque como `is_featured = true` as mais usadas

---

## 🔧 Ajustes Manuais (Opcional)

### Aumentar Relevância de Imagens Específicas

```sql
-- Marcar imagens de agenda vazia como altamente relevantes
UPDATE media_library
SET relevance_score = 90,
    is_featured = true
WHERE file_name LIKE '%agenda-vazia%'
  AND area = 'nutri';
```

### Adicionar Tags Manualmente

```sql
-- Adicionar tags específicas
UPDATE media_library
SET tags = ARRAY['agenda', 'vazia', 'nutricionista', 'frustracao', 'problema']
WHERE id = 'uuid-do-item';
```

### Ajustar Propósito

```sql
-- Corrigir propósito de uma imagem
UPDATE media_library
SET purpose = 'hook'
WHERE file_name LIKE '%impacto%';
```

---

## ✅ Checklist de Teste

Após fazer upload, teste:

- [ ] Buscar "agenda vazia" no Creative Studio
- [ ] Buscar "nutricionista atendendo"
- [ ] Buscar "dashboard plataforma"
- [ ] Verificar se resultados aparecem na aba "Busca"
- [ ] Verificar se imagens carregam corretamente
- [ ] Verificar se tags estão corretas
- [ ] Verificar se área e propósito estão corretos

---

## 🎨 Dicas Finais

1. **Qualidade > Quantidade**: Melhor ter 50 imagens bem organizadas que 500 bagunçadas
2. **Tags são importantes**: O sistema busca principalmente por tags
3. **Nomes descritivos**: Quanto mais descritivo o nome, melhor a busca
4. **Teste antes de expandir**: Sempre teste com poucas imagens primeiro
5. **Organize por propósito**: Facilita encontrar o que precisa

---

## 🆘 Problemas Comuns

**"Nenhum resultado encontrado"**
→ Verifique se os arquivos foram uploadados e se as tags estão corretas

**"Imagens não carregam"**
→ Verifique se o bucket `media-library` está público no Supabase

**"Tags não aparecem"**
→ Verifique se o nome do arquivo contém palavras-chave reconhecidas

---

**Pronto para começar! 🚀**

Baixe algumas imagens do Envato, organize na estrutura de pastas, renomeie seguindo a convenção e execute o script de upload!


