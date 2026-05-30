# ⚡ Tarefas pendentes — 30/05/2026

## 1. Commits pendentes (rodar no terminal)

```bash
git add -A && git commit -m "fix: y-scripts named import + share certificate + blue checklist + 1-tap share mobile" && git push
git add -A && git commit -m "feat: renomear y-scripts → boards (URL + menu + redirects)" && git push
```

> Nota: pode juntar em um commit só se preferir.

---

## 2. Sincronizar tarefas diárias dos 4 líderes Pro Líderes

**O que fazer:**
```bash
cd ~/Desktop/Ylada-Workspace

# Primeiro: ver o estado atual (sem alterar nada)
node pro-lideres-sync.js

# Depois de confirmar: aplicar mudanças
node pro-lideres-sync.js --apply
```

**O que o script faz:**
- Verifica tarefas diárias de: Deise Faula, Carlota Batista, Liliane Alexandre, Valdete Marcelino
- Copia as tarefas da fonte (Deise ou Carlota) para Valdete Marcelino
- Adiciona "extra" na tarefa "R$500 extra trabalhando com bebidas funcionais" em todos os 4 líderes
- Copia o vídeo YouTube de apresentação de negócio para Valdete Marcelino

**Atenção:** O script ainda está identificando quem é cada líder pelo nome do tenant.
Os mapeamentos corretos são:
- Deise Faula → `6274f306`
- Carlota e José Batista → `583c31a0`
- Lilian e Alexandre → `b21e037a`
- Marcelino e Valdete → `533bb439`

---

## 3. SQL pendente no Supabase (abrir em supabase.com/dashboard)

```sql
-- Carol: campo nota_andre
ALTER TABLE carol_conversations ADD COLUMN IF NOT EXISTS nota_andre text;

-- Carol: pausar conversa
ALTER TABLE carol_conversations ADD COLUMN IF NOT EXISTS paused boolean DEFAULT false;

-- Pro Líderes: renomear tabelas de boards
ALTER TABLE yscripts_boards RENAME TO ylada_boards;
ALTER TABLE yscripts_cards RENAME TO ylada_board_cards;
```
