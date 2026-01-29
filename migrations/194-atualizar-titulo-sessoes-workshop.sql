-- Atualiza o título padrão das sessões do workshop (Nutri).
-- Motivo: não usar "(Agenda Instável)" no título exibido nas mensagens com datas.

-- 1) Atualizar título em sessões existentes que ainda usam o padrão antigo
UPDATE whatsapp_workshop_sessions
SET title = 'Aula prática exclusiva para nutricionistas'
WHERE area = 'nutri'
  AND title = 'Aula Prática ao Vivo (Agenda Instável)';

-- 2) Atualizar default da coluna para novas inserções sem título explícito
ALTER TABLE whatsapp_workshop_sessions
  ALTER COLUMN title SET DEFAULT 'Aula prática exclusiva para nutricionistas';

