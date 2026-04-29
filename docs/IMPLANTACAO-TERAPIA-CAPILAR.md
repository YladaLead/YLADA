# Implantação — Terapia capilar (Pro Estética Capilar)

**Secundário:** usar **depois** do go-live corporal definido em [IMPLANTACAO-PRO-ESTETICA-CORPORAL.md](./IMPLANTACAO-PRO-ESTETICA-CORPORAL.md) (“Definição de pronto”).

Mesmo rigor que o doc corporal, com rotas e smoke específicos.

## Smoke rápido

| # | Fluxo | Critério |
|---|--------|----------|
| 1 | `/pro-estetica-capilar/painel` | Acesso ao tenant capilar. |
| 2 | **Links** → `/painel/biblioteca-links` | Biblioteca só modelos **capilares** (sem lista corporal misturada). |
| 3 | Criar link → `/l/{slug}` | Funil adequado ao modelo. |
| 4 | **Noel** | Respostas focadas em couro cabeludo/fios; mencionar Biblioteca YLADA para links — não substituir por formulários externos. |

Noel usa `message_tone`, `message_tone_notes` e `focus_notes` em `leader_tenants`, como no corporal.
