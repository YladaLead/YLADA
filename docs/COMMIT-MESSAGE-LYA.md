# 📝 Mensagem de Commit - Implementação LYA

**Use esta mensagem ao fazer commit:**

```
feat: Implementar LYA - Mentora Estratégica para Nutricionistas

- Adicionar formulário de diagnóstico obrigatório
- Implementar geração automática de perfil estratégico
- Criar sistema de análise diária da LYA com RAG
- Adicionar tabelas de memória e aprendizado (Fase 1)
- Integrar busca de estado, memória e conhecimento antes de chamar OpenAI (Fase 2)
- Criar componente LyaAnaliseHoje para exibir análise na home
- Adicionar bloqueio de acesso até completar diagnóstico
- Preparar integração com Prompt Object da OpenAI (Responses API)

Fases implementadas:
- ✅ Fase 1: Fundação de memória (tabelas e APIs)
- ✅ Fase 2: RAG + Prompt Object (preparado para Responses API)

Arquivos principais:
- src/components/nutri/LyaAnaliseHoje.tsx
- src/app/api/nutri/lya/analise/route.ts
- src/app/api/nutri/diagnostico/route.ts
- src/app/api/nutri/ai/* (APIs de memória)
- migrations/151-criar-tabelas-diagnostico-lya-nutri.sql
- migrations/152-criar-tabelas-memoria-lya.sql
```



