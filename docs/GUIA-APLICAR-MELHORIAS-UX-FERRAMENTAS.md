# Guia: Aplicar Melhorias de UX nas Áreas (Nutri, Coach, Nutra)

Este documento lista todas as melhorias implementadas na área **Wellness** que devem ser replicadas nas outras três áreas (**Nutri**, **Coach**, **Nutra**) para manter consistência e melhorar a experiência do usuário.

---

## 📋 Índice

1. [Melhorias no Dashboard](#melhorias-no-dashboard)
2. [Melhorias na Página de Edição](#melhorias-na-página-de-edição)
3. [Arquivos a Criar/Modificar](#arquivos-a-criarmodificar)
4. [Checklist por Área](#checklist-por-área)
5. [Código de Referência](#código-de-referência)

---

## 🎯 Melhorias no Dashboard

### O que foi implementado:

1. **Cards clicáveis para editar**
   - Todo o card é clicável e leva para a página de edição
   - Link: `/pt/{area}/ferramentas/{id}/editar`

2. **Badge de status visível**
   - Badge "Ativo" (verde) ou "Inativo" (cinza) ao lado do nome
   - Status atualizado em tempo real

3. **Toggle Ativo/Inativo**
   - Switch no lado direito de cada card
   - Verde quando ativo, cinza quando inativo
   - Atualização instantânea sem recarregar página

4. **Botão de excluir**
   - Ícone de lixeira no lado direito
   - Modal de confirmação antes de excluir
   - Remove o card da lista após exclusão

5. **Mensagens visuais (Toasts)**
   - Toasts de sucesso/erro no canto superior direito
   - Animações de entrada
   - Desaparecem automaticamente

6. **Exibição de todas as ferramentas**
   - Mostra todas as ferramentas (ativas e inativas)
   - Estatísticas contam apenas as ativas

### Arquivos a modificar:

- `src/app/pt/{area}/dashboard/page.tsx`

---

## ✏️ Melhorias na Página de Edição

### O que foi implementado:

1. **Substituição de `alert()` por Toasts**
   - Toasts visuais em vez de alerts nativos
   - Melhor experiência do usuário

2. **Toggle de Status**
   - Seção dedicada para ativar/inativar ferramenta
   - Feedback visual claro

3. **Botão de Excluir**
   - Botão vermelho na parte inferior
   - Modal de confirmação antes de excluir

4. **Estados de Loading**
   - Botões desabilitados durante operações
   - Texto "Salvando..." durante salvamento
   - Texto "Excluindo..." durante exclusão

### Arquivos a modificar:

- `src/app/pt/{area}/ferramentas/[id]/editar/page.tsx`

---

## 📁 Arquivos a Criar/Modificar

### Arquivos já criados (reutilizáveis):

✅ **Já existem e podem ser reutilizados:**
- `src/lib/template-helpers.ts` - Helpers reutilizáveis
- `src/lib/template-slug-map.ts` - Mapeamento de slugs canônicos
- `src/app/globals.css` - Animação `slideInRight` já adicionada

### Arquivos a modificar por área:

#### 1. Dashboard (`src/app/pt/{area}/dashboard/page.tsx`)

**Mudanças necessárias:**
- Adicionar imports: `useRouter` do `next/navigation`
- Adicionar estados: `mensagemSucesso`, `mensagemErro`, `excluindoId`, `mostrarConfirmacaoExclusao`, `alterandoStatusId`
- Modificar `carregarDados` para mostrar TODAS as ferramentas (não apenas ativas)
- Adicionar função `alternarStatus`
- Adicionar função `excluirFerramenta`
- Adicionar componentes de Toast e Modal de confirmação
- Modificar renderização dos cards para incluir toggle e botão excluir

#### 2. Página de Edição (`src/app/pt/{area}/ferramentas/[id]/editar/page.tsx`)

**Mudanças necessárias:**
- Adicionar estados: `salvando`, `mensagemSucesso`, `mensagemErro`, `excluindo`, `mostrarConfirmacaoExclusao`
- Substituir todos os `alert()` por `setMensagemErro()` ou `setMensagemSucesso()`
- Adicionar função `alternarStatus`
- Adicionar função `excluirFerramenta`
- Adicionar componentes de Toast e Modal de confirmação
- Adicionar seção de Status com toggle
- Adicionar botão de excluir na parte inferior

---

## ✅ Checklist por Área

### Área: **Nutri**

#### Dashboard
- [ ] Adicionar imports necessários (`useRouter`)
- [ ] Adicionar estados de mensagens e modais
- [ ] Modificar `carregarDados` para mostrar todas as ferramentas
- [ ] Adicionar função `alternarStatus`
- [ ] Adicionar função `excluirFerramenta`
- [ ] Adicionar componentes de Toast (sucesso/erro)
- [ ] Adicionar Modal de confirmação de exclusão
- [ ] Modificar cards para serem clicáveis (Link)
- [ ] Adicionar badge de status nos cards
- [ ] Adicionar toggle ativo/inativo nos cards
- [ ] Adicionar botão de excluir nos cards
- [ ] Testar funcionalidades

#### Página de Edição
- [ ] Adicionar estados necessários
- [ ] Substituir todos os `alert()` por toasts
- [ ] Adicionar função `alternarStatus`
- [ ] Adicionar função `excluirFerramenta`
- [ ] Adicionar componentes de Toast
- [ ] Adicionar Modal de confirmação
- [ ] Adicionar seção de Status com toggle
- [ ] Adicionar botão de excluir
- [ ] Testar funcionalidades

---

### Área: **Coach**

#### Dashboard
- [ ] Adicionar imports necessários (`useRouter`)
- [ ] Adicionar estados de mensagens e modais
- [ ] Modificar `carregarDados` para mostrar todas as ferramentas
- [ ] Adicionar função `alternarStatus`
- [ ] Adicionar função `excluirFerramenta`
- [ ] Adicionar componentes de Toast (sucesso/erro)
- [ ] Adicionar Modal de confirmação de exclusão
- [ ] Modificar cards para serem clicáveis (Link)
- [ ] Adicionar badge de status nos cards
- [ ] Adicionar toggle ativo/inativo nos cards
- [ ] Adicionar botão de excluir nos cards
- [ ] Testar funcionalidades

#### Página de Edição
- [ ] Adicionar estados necessários
- [ ] Substituir todos os `alert()` por toasts
- [ ] Adicionar função `alternarStatus`
- [ ] Adicionar função `excluirFerramenta`
- [ ] Adicionar componentes de Toast
- [ ] Adicionar Modal de confirmação
- [ ] Adicionar seção de Status com toggle
- [ ] Adicionar botão de excluir
- [ ] Testar funcionalidades

---

### Área: **Nutra**

#### Dashboard
- [ ] Adicionar imports necessários (`useRouter`)
- [ ] Adicionar estados de mensagens e modais
- [ ] Modificar `carregarDados` para mostrar todas as ferramentas
- [ ] Adicionar função `alternarStatus`
- [ ] Adicionar função `excluirFerramenta`
- [ ] Adicionar componentes de Toast (sucesso/erro)
- [ ] Adicionar Modal de confirmação de exclusão
- [ ] Modificar cards para serem clicáveis (Link)
- [ ] Adicionar badge de status nos cards
- [ ] Adicionar toggle ativo/inativo nos cards
- [ ] Adicionar botão de excluir nos cards
- [ ] Testar funcionalidades

#### Página de Edição
- [ ] Adicionar estados necessários
- [ ] Substituir todos os `alert()` por toasts
- [ ] Adicionar função `alternarStatus`
- [ ] Adicionar função `excluirFerramenta`
- [ ] Adicionar componentes de Toast
- [ ] Adicionar Modal de confirmação
- [ ] Adicionar seção de Status com toggle
- [ ] Adicionar botão de excluir
- [ ] Testar funcionalidades

---

## 💻 Código de Referência

### 1. Estados a adicionar no Dashboard

```typescript
const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
const [mensagemErro, setMensagemErro] = useState<string | null>(null)
const [excluindoId, setExcluindoId] = useState<string | null>(null)
const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState<string | null>(null)
const [alterandoStatusId, setAlterandoStatusId] = useState<string | null>(null)
```

### 2. Função alternarStatus (Dashboard)

```typescript
const alternarStatus = async (ferramentaId: string, statusAtual: string) => {
  try {
    setAlterandoStatusId(ferramentaId)
    const novoStatus = statusAtual === 'active' || statusAtual === 'ativa' ? 'inactive' : 'active'
    
    const response = await fetch('/api/{area}/ferramentas', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id: ferramentaId,
        status: novoStatus
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao alterar status')
    }

    // Atualizar estado local
    setFerramentasAtivas(prev => prev.map(f => 
      f.id === ferramentaId 
        ? { ...f, status: novoStatus }
        : f
    ))
    
    setMensagemSucesso(`Ferramenta ${novoStatus === 'active' ? 'ativada' : 'desativada'} com sucesso!`)
    setTimeout(() => setMensagemSucesso(null), 3000)
  } catch (error: any) {
    console.error('Erro ao alterar status:', error)
    setMensagemErro(error.message || 'Erro ao alterar status. Tente novamente.')
    setTimeout(() => setMensagemErro(null), 5000)
  } finally {
    setAlterandoStatusId(null)
  }
}
```

### 3. Função excluirFerramenta (Dashboard)

```typescript
const excluirFerramenta = async (ferramentaId: string) => {
  try {
    setExcluindoId(ferramentaId)
    
    const response = await fetch(`/api/{area}/ferramentas?id=${ferramentaId}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao excluir ferramenta')
    }

    // Remover da lista local
    setFerramentasAtivas(prev => prev.filter(f => f.id !== ferramentaId))
    
    setMensagemSucesso('Ferramenta excluída com sucesso!')
    setTimeout(() => setMensagemSucesso(null), 3000)
    setMostrarConfirmacaoExclusao(null)
  } catch (error: any) {
    console.error('Erro ao excluir ferramenta:', error)
    setMensagemErro(error.message || 'Erro ao excluir ferramenta. Tente novamente.')
    setTimeout(() => setMensagemErro(null), 5000)
    setMostrarConfirmacaoExclusao(null)
  } finally {
    setExcluindoId(null)
  }
}
```

### 4. Componente Toast de Sucesso

```tsx
{mensagemSucesso && (
  <div className="fixed top-4 right-4 bg-green-50 border-2 border-green-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <span className="text-green-600 text-2xl">✅</span>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-green-900 mb-1">Sucesso!</h3>
        <p className="text-xs text-green-700">{mensagemSucesso}</p>
      </div>
      <button 
        onClick={() => setMensagemSucesso(null)}
        className="text-green-600 hover:text-green-800 text-lg font-bold"
      >
        ×
      </button>
    </div>
  </div>
)}
```

### 5. Componente Toast de Erro

```tsx
{mensagemErro && (
  <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <span className="text-red-600 text-2xl">❌</span>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-red-900 mb-1">Erro</h3>
        <p className="text-xs text-red-700">{mensagemErro}</p>
      </div>
      <button 
        onClick={() => setMensagemErro(null)}
        className="text-red-600 hover:text-red-800 text-lg font-bold"
      >
        ×
      </button>
    </div>
  </div>
)}
```

### 6. Modal de Confirmação de Exclusão

```tsx
{mostrarConfirmacaoExclusao && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <span className="text-red-600 text-4xl">⚠️</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
          <p className="text-sm text-gray-600">
            Tem certeza que deseja excluir esta ferramenta? Esta ação não pode ser desfeita.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setMostrarConfirmacaoExclusao(null)}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          disabled={excluindoId !== null}
        >
          Cancelar
        </button>
        <button
          onClick={() => excluirFerramenta(mostrarConfirmacaoExclusao)}
          disabled={excluindoId !== null}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {excluindoId === mostrarConfirmacaoExclusao ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </div>
  </div>
)}
```

### 7. Card com Toggle e Botão Excluir (Dashboard)

```tsx
ferramentasAtivas.map((ferramenta) => {
  const isActive = ferramenta.status === 'active' || ferramenta.status === 'ativa'
  const isAlterandoStatus = alterandoStatusId === ferramenta.id
  const isExcluindo = excluindoId === ferramenta.id
  
  return (
    <div 
      key={ferramenta.id} 
      className="group relative flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-green-200"
    >
      {/* Card clicável para editar */}
      <Link 
        href={`/pt/{area}/ferramentas/${ferramenta.id}/editar`}
        className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
      >
        <span className="text-xl sm:text-2xl flex-shrink-0">{ferramenta.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{ferramenta.nome}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{ferramenta.categoria}</p>
        </div>
      </Link>
      
      {/* Estatísticas */}
      <div className="text-right flex-shrink-0 ml-3 mr-3">
        <p className="text-sm font-medium text-gray-900">{ferramenta.leads} leads</p>
        <p className="text-xs text-gray-600">{ferramenta.conversoes} conversões</p>
      </div>
      
      {/* Botões de Ação */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Toggle Ativo/Inativo */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            alternarStatus(ferramenta.id, ferramenta.status)
          }}
          disabled={isAlterandoStatus || isExcluindo}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isActive ? 'bg-green-600' : 'bg-gray-300'
          } ${isAlterandoStatus || isExcluindo ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isActive ? 'Desativar ferramenta' : 'Ativar ferramenta'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        
        {/* Botão Excluir */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setMostrarConfirmacaoExclusao(ferramenta.id)
          }}
          disabled={isAlterandoStatus || isExcluindo}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Excluir ferramenta"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
})
```

### 8. Substituir `alert()` por Toast (Página de Edição)

**Antes:**
```typescript
alert('Ferramenta atualizada com sucesso!')
```

**Depois:**
```typescript
setMensagemSucesso('Ferramenta atualizada com sucesso!')
setTimeout(() => {
  router.push('/pt/{area}/ferramentas')
}, 2000)
```

**Antes:**
```typescript
alert(error.message || 'Erro ao atualizar ferramenta. Tente novamente.')
```

**Depois:**
```typescript
setMensagemErro(error.message || 'Erro ao atualizar ferramenta. Tente novamente.')
setTimeout(() => setMensagemErro(null), 5000)
```

---

## 🔄 Substituições Necessárias

Ao aplicar nas outras áreas, substitua:

- `{area}` → `nutri`, `coach`, ou `nutra`
- `/api/wellness/` → `/api/{area}/`
- `/pt/wellness/` → `/pt/{area}/`

---

## 📝 Notas Importantes

1. **API Routes**: Certifique-se de que as rotas da API (`/api/{area}/ferramentas`) suportam:
   - `PUT` com campo `status` para alternar status
   - `DELETE` para excluir ferramentas

2. **Autenticação**: As funções devem usar `credentials: 'include'` para manter a sessão

3. **Estados**: Mantenha consistência nos nomes dos estados entre áreas

4. **Animações**: A animação `slideInRight` já está no `globals.css`, não precisa adicionar novamente

5. **Testes**: Após implementar, teste:
   - Clicar no card para editar
   - Alternar status (ativo/inativo)
   - Excluir ferramenta
   - Mensagens de sucesso/erro aparecem corretamente

---

## 🚀 Ordem Recomendada de Implementação

1. **Dashboard primeiro** (mais visível para o usuário)
2. **Página de Edição depois** (complementa o dashboard)
3. **Testar cada funcionalidade** antes de passar para a próxima área
4. **Documentar problemas encontrados** para ajustes futuros

---

## 📚 Arquivos de Referência

- **Dashboard Wellness**: `src/app/pt/wellness/dashboard/page.tsx`
- **Edição Wellness**: `src/app/pt/wellness/ferramentas/[id]/editar/page.tsx`
- **Helpers**: `src/lib/template-helpers.ts`
- **Slug Map**: `src/lib/template-slug-map.ts`
- **CSS Global**: `src/app/globals.css`

---

**Última atualização**: 2024-01-XX  
**Versão**: 1.0  
**Status**: ✅ Implementado em Wellness | ⏳ Pendente em Nutri, Coach, Nutra

