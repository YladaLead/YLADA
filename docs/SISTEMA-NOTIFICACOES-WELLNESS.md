# 🔔 Sistema de Notificações e Lembretes - Wellness System

## 📋 Visão Geral

O sistema de notificações do Wellness System rastreia as ações do distribuidor e gera lembretes contextuais para ajudá-lo a seguir os próximos passos no processo de recrutamento e vendas.

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `wellness_acoes`

Armazena todas as ações realizadas pelo distribuidor no sistema.

**Colunas:**
- `id` (UUID) - Identificador único
- `user_id` (UUID) - ID do distribuidor
- `acao_tipo` (VARCHAR) - Tipo da ação (ex: 'gerou_link', 'copiou_script')
- `acao_descricao` (VARCHAR) - Descrição legível da ação
- `acao_metadata` (JSONB) - Dados adicionais da ação
- `pagina` (VARCHAR) - Página onde a ação foi realizada
- `rota` (VARCHAR) - Rota completa
- `created_at` (TIMESTAMP) - Data/hora da ação

---

## 🚀 Como Executar a Migration

### 1. Acesse o Supabase

1. Vá para o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Acesse **SQL Editor**

### 2. Execute a Migration

Copie e cole o conteúdo do arquivo:
```
migrations/criar-tabela-wellness-acoes.sql
```

Clique em **Run** para executar.

---

## 🎯 Tipos de Ações Rastreadas

O sistema rastreia automaticamente as seguintes ações:

| Tipo de Ação | Descrição | Quando é Registrada |
|-------------|-----------|---------------------|
| `gerou_link` | Distribuidor gerou um link personalizado | Ao gerar link no gerador |
| `visualizou_fluxo` | Visualizou um fluxo ou página específica | Ao acessar páginas de fluxos/scripts |
| `copiou_script` | Copiou um script para usar | Ao copiar script |
| `enviou_link` | Enviou um link para alguém | Ao enviar link (futuro) |
| `visualizou_apresentacao` | Visualizou links de apresentação | Ao acessar página de apresentação |
| `acessou_ferramentas` | Acessou ferramentas do sistema | Ao acessar páginas de ferramentas |
| `visualizou_diagnosticos` | Visualizou diagnósticos | Ao acessar painel de conversões |
| `configurou_perfil` | Configurou o perfil | Ao salvar configurações do perfil |
| `acessou_sistema` | Acessou a página principal | Ao entrar no sistema |

---

## 🔔 Sistema de Lembretes

### Como Funciona

1. **Rastreamento Automático**: O sistema registra ações automaticamente
2. **Geração de Lembretes**: Baseado nas ações, gera lembretes contextuais
3. **Exibição**: Lembretes aparecem na página principal do sistema

### Tipos de Lembretes

- **Info** (ℹ️) - Informações gerais
- **Success** (✅) - Confirmações positivas
- **Warning** (⚠️) - Avisos importantes
- **Action** (🎯) - Chamadas para ação

### Prioridades

- **Alta** - Lembretes urgentes (ex: configurar perfil, gerar primeiro link)
- **Média** - Lembretes importantes (ex: fazer follow-up, explorar fluxos)
- **Baixa** - Lembretes informativos

---

## 📝 Exemplos de Lembretes

### Após Gerar Link
> 📤 **Envie o link gerado**
> 
> Você gerou um link personalizado. Que tal enviar para alguém agora?
> 
> [Ver Links Gerados] →

### Após Copiar Script
> 💬 **Use o script que você copiou**
> 
> Você copiou um script. Não esqueça de usar na sua próxima conversa!

### Após Enviar Link
> ⏰ **Faça follow-up**
> 
> Você enviou um link. Lembre-se de fazer follow-up em 2 horas se a pessoa não responder.

### Primeira Vez no Sistema
> 🚀 **Gere seu primeiro link**
> 
> Ainda não gerou nenhum link? Comece agora e compartilhe com seus contatos!
> 
> [Gerar Link] →

---

## 🛠️ Como Adicionar Rastreamento em Novas Páginas

### 1. Importe o Hook

```typescript
import { useWellnessAcoes } from '@/hooks/useWellnessAcoes'
```

### 2. Use o Hook

```typescript
function MinhaPageContent() {
  const { registrarAcao } = useWellnessAcoes()
  
  // Registrar ação ao acessar a página
  useEffect(() => {
    registrarAcao({
      tipo: 'visualizou_fluxo',
      descricao: 'Acessou a página X',
      pagina: 'Nome da Página',
      rota: '/pt/wellness/system/...'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Registrar ação em eventos específicos
  const handleAcao = () => {
    registrarAcao({
      tipo: 'gerou_link',
      descricao: 'Gerou link para...',
      metadata: { /* dados adicionais */ },
      pagina: 'Nome da Página',
      rota: '/pt/wellness/system/...'
    })
  }
}
```

---

## 🔧 APIs Disponíveis

### POST `/api/wellness/acoes`

Registra uma nova ação do distribuidor.

**Request:**
```json
{
  "tipo": "gerou_link",
  "descricao": "Gerou link para o fluxo X",
  "metadata": {
    "fluxoId": "energia-matinal",
    "tipoFluxo": "cliente"
  },
  "pagina": "Gerador de Links",
  "rota": "/pt/wellness/system/ferramentas/gerador-link"
}
```

### GET `/api/wellness/acoes`

Busca ações recentes do distribuidor.

**Query Params:**
- `limite` (opcional) - Número máximo de ações (padrão: 50)
- `dias` (opcional) - Últimos N dias (padrão: 7)

### GET `/api/wellness/lembretes`

Busca lembretes baseados nas ações do distribuidor.

**Response:**
```json
{
  "success": true,
  "data": {
    "lembretes": [
      {
        "id": "enviar-link-gerado",
        "titulo": "📤 Envie o link gerado",
        "mensagem": "Você gerou um link personalizado...",
        "tipo": "action",
        "acao": {
          "texto": "Ver Links Gerados",
          "rota": "/pt/wellness/system/ferramentas/gerador-link"
        },
        "prioridade": "alta"
      }
    ]
  }
}
```

---

## 🎨 Componente de Notificações

O componente `WellnessNotificacoes` exibe automaticamente os lembretes na página principal do sistema.

**Localização:** `src/components/wellness-system/WellnessNotificacoes.tsx`

**Características:**
- Exibe até 3 lembretes por padrão
- Botão "Ver mais" para exibir todos
- Botão de fechar em cada notificação
- Cores diferentes por tipo (info, success, warning, action)
- Botões de ação diretos para navegação

---

## 📊 Personalização de Lembretes

Para adicionar novos lembretes ou modificar existentes, edite o arquivo:

`src/lib/wellness-system/lembretes.ts`

### Estrutura de Configuração

```typescript
export const configuracaoLembretes: Record<TipoAcao, {
  proximosPassos: Lembrete[]
  tempoParaLembrete?: number // em horas
}> = {
  gerou_link: {
    proximosPassos: [
      {
        id: 'enviar-link-gerado',
        titulo: '📤 Envie o link gerado',
        mensagem: 'Você gerou um link personalizado...',
        tipo: 'action',
        acao: {
          texto: 'Ver Links Gerados',
          rota: '/pt/wellness/system/ferramentas/gerador-link'
        },
        prioridade: 'alta'
      }
    ],
    tempoParaLembrete: 2 // 2 horas depois
  }
}
```

---

## ✅ Checklist de Implementação

- [x] Migration criada (`criar-tabela-wellness-acoes.sql`)
- [x] API de ações (`/api/wellness/acoes`)
- [x] API de lembretes (`/api/wellness/lembretes`)
- [x] Hook `useWellnessAcoes`
- [x] Componente `WellnessNotificacoes`
- [x] Integração na página principal
- [x] Rastreamento no gerador de links
- [x] Rastreamento na página de scripts
- [ ] Rastreamento em outras páginas (conforme necessário)

---

## 🚨 Importante

1. **Execute a migration** antes de usar o sistema
2. O sistema funciona de forma **não intrusiva** - não quebra o fluxo se falhar
3. As ações são registradas **automaticamente** em segundo plano
4. Os lembretes são **contextuais** e baseados nas ações reais do distribuidor

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

