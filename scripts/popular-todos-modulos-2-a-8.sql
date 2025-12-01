-- Script Master: Popular todos os módulos 2 a 8 de uma vez
-- Executar após a migration criar-tabelas-trilha-aprendizado-wellness.sql
-- E após executar o script do Módulo 1

-- Este script executa todos os scripts de popular módulos em sequência

\i scripts/popular-modulo-2-configuracao.sql
\i scripts/popular-modulo-3-ferramentas-atracao.sql
\i scripts/popular-modulo-4-diagnostico-wow.sql
\i scripts/popular-modulo-5-ofertas-fechamentos.sql
\i scripts/popular-modulo-6-gerar-clientes.sql
\i scripts/popular-modulo-7-atendimento-profissional.sql
\i scripts/popular-modulo-8-escala.sql

-- Nota: Se o \i não funcionar no Supabase, execute cada script individualmente na ordem:
-- 1. popular-modulo-2-configuracao.sql
-- 2. popular-modulo-3-ferramentas-atracao.sql
-- 3. popular-modulo-4-diagnostico-wow.sql
-- 4. popular-modulo-5-ofertas-fechamentos.sql
-- 5. popular-modulo-6-gerar-clientes.sql
-- 6. popular-modulo-7-atendimento-profissional.sql
-- 7. popular-modulo-8-escala.sql

