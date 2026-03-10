# Archetypes de Diagnóstico (IA)

## Conceito

5 tipos de diagnóstico gerados **uma vez** por IA. O sistema escolhe qual entregar com base nas respostas (regras).

## Os 5 tipos

| Código | Quando usar |
|--------|-------------|
| `leve` | RISK baixo — sinais leves, tom educativo |
| `moderado` | RISK médio — sinais consistentes, direcionador |
| `urgente` | RISK alto — vale atenção imediata |
| `bloqueio_pratico` | BLOCKER rotina/processo/hábitos |
| `bloqueio_emocional` | BLOCKER emocional/expectativa |

## Fluxo

1. **Setup (uma vez)**  
   - Rodar migration 247  
   - Executar `npm run archetypes:gerar`  
   - IA gera conteúdo dos 5 tipos → salva em `ylada_diagnosis_archetypes`

2. **Uso (por diagnóstico)**  
   - Respostas → regras calculam level/blocker  
   - Mapeia para archetype_code  
   - Busca conteúdo no banco  
   - Se encontrado: preenche {THEME}, {NAME} e entrega  
   - Se não: fallback para templates atuais

## Arquivos

- `migrations/247-ylada-diagnosis-archetypes.sql` — tabela
- `scripts/gerar-archetypes-diagnostico.ts` — geração via IA
- `src/lib/ylada/diagnosis-archetypes.ts` — mapeamento e fill
- API diagnosis — usa archetypes quando disponível

## Regenerar

Para ajustar o conteúdo dos 5 tipos, rodar novamente:

```bash
npm run archetypes:gerar
```

O upsert sobrescreve o conteúdo existente.
