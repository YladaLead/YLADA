# Paridade entre áreas YLADA

Tudo que for ajustado (componentes, fluxos, visuais) deve funcionar em **todas** as áreas (médico, vendedor, estética, fitness, etc.). Esta lista mostra o que já está em todas e o que falta para completar.

---

## Áreas consideradas (matriz + segmentos)

| Código       | Label        | Path prefix   |
|-------------|--------------|---------------|
| ylada       | YLADA        | /pt           |
| med         | Médicos      | /pt/med       |
| psi         | Psicologia   | /pt/psi       |
| psicanalise | Psicanálise  | /pt/psicanalise |
| odonto      | Odontologia  | /pt/odonto    |
| nutra       | Nutra        | /pt/nutra     |
| coach       | Coach        | /pt/coach     |
| perfumaria  | Perfumaria   | /pt/perfumaria |
| seller      | Vendedores   | /pt/seller    |
| estetica    | Estética     | /pt/estetica  |
| fitness     | Fitness      | /pt/fitness   |

*Wellness é produto separado; não entra nesta paridade.*

---

## 1. O que já está igual em todas as áreas

Estes **componentes/rotas** existem em todas as áreas e usam o mesmo conteúdo compartilhado (só mudam `areaCodigo` / `areaLabel`).

| Recurso | Componente / página | Áreas com rota |
|--------|----------------------|-----------------|
| **Biblioteca** | `BibliotecaPageContent` | matrix, estetica, med, psi, odonto, coach, nutra, perfumaria, seller, fitness, psicanalise |
| **Links (lista de diagnósticos)** | `LinksPageContent` | Todas (idem) |
| **Criar diagnóstico em 1 clique** | `NovoLinkPageContent` em `links/novo` | Todas (idem) |
| **Editar link** | `EditarLinkPage` (usa `useAreaFromPath`) em `links/editar/[id]` | Todas (idem) |
| **Compartilhar diagnóstico** | `CompartilharDiagnosticoContent` (dentro de Links e Editar) | Todas (via Links + Editar) |
| **Diagnóstico em movimento** (bloco na edição) | Dentro de `EditarLinkPage` | Todas (idem) |
| **Noel (Home)** | `NoelHomeContent` | matrix, estetica, med, psi, odonto, coach, perfumaria, seller, fitness, psicanalise |
| **Método YLADA** | `MetodoYLADAContent` | Todas (idem) |
| **Crescimento** | `SistemaCrescimentoContent` | Todas (idem) |
| **Leads** | `LeadsPageContent` (coach usa `ylada-leads`) | Todas (idem) |

Ou seja: **Biblioteca, Links, Links/novo, Links/editar, compartilhar e diagnóstico em movimento** estão com paridade entre as áreas.

---

## 2. O que falta em algumas áreas

### 2.1 Configuração (`YladaConfiguracaoContent`) — ✅ Completo

- **Todas as áreas** têm rota `/{area}/configuracao`: matrix, psi, odonto, estetica, psicanalise, fitness, **med, seller, perfumaria, nutra**.

### 2.2 Perfil empresarial (`PerfilEmpresarialView`) — ✅ Completo

- **Todas as áreas** têm rota `/{area}/perfil-empresarial`: matrix, med, psi, odonto, estetica, psicanalise, perfumaria, seller, fitness, **coach, nutra**.

### 2.3 Home (Noel) na Nutra — ✅ Completo

- **Nutra** passou a ter `home/page.tsx` com `NoelHomeContent`, igual às demais áreas.

### 2.4 Nutra alinhada ao padrão YLADA — ✅ Completo

- Layout de nutra passou a usar `validateProtectedAccess('nutra')` no servidor (como estética).
- Removido `ProtectedRoute` de biblioteca, links, links/editar e leads; proteção no layout.
- Landing `/pt/nutra`: se usuário logado, redireciona para `/pt/nutra/home` (como estética).

### 2.5 Painel

- **Só a matriz** tem rota `painel` com `PainelPageContent`.
- Opcional: criar `painel/page.tsx` em cada área se quiser paridade total.

---

## 4. Componentes compartilhados (referência)

- `@/components/ylada/BibliotecaPageContent`
- `@/components/ylada/NovoLinkPageContent`
- `@/components/ylada/CompartilharDiagnosticoContent`
- `@/components/ylada/NoelHomeContent`
- `@/components/ylada/MetodoYLADAContent`
- `@/components/ylada/SistemaCrescimentoContent`
- `@/components/ylada/LeadsPageContent`
- `@/components/ylada/YladaConfiguracaoContent`
- `@/components/ylada/PainelPageContent`
- `@/components/ylada/YladaAreaShell`
- `@/app/pt/(matrix)/links/page` → `LinksPageContent`
- `@/app/pt/(matrix)/links/editar/[id]/page` → `EditarLinkPage` (usa `useAreaFromPath`)
- `@/components/perfil/PerfilEmpresarialView`

Todos recebem `areaCodigo` e `areaLabel` (ou derivam do path) para que a experiência seja a mesma em todas as áreas, só mudando o shell/menu da área.
