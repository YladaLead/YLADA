# WELLNESS SYSTEM - Documentação Completa

## 📚 Índice de Documentos

1. **[Visão Geral](./01-visao-geral.md)** - Objetivo, pilares e estrutura geral do sistema
2. **[Produtos e Referências](./02-produtos-referencia.md)** - Tabela de PV, preços, doses e kits
3. **[Fluxos de Recrutamento](./03-fluxos-recrutamento.md)** - Grupos de interesse e diagnósticos para recrutamento
4. **[Fluxos de Clientes](./04-fluxos-clientes.md)** - 20 fluxos completos para vendas de bebidas funcionais

## 🎯 Objetivo do Sistema

Sistema completo para distribuidores Herbalife utilizarem a ferramenta Wellness de forma profissional, duplicável e orientada a resultados, focando em:

- **Recrutamento** para apresentações de negócio
- **Vendas** de bebidas funcionais (NRG Energia e Acelera)
- **Onboarding** de novos distribuidores
- **Capacitação** contínua
- **Duplicação** do modelo

## 🚀 Próximos Passos de Implementação

### Fase 1: Estrutura Base ✅
- [x] Criar página inicial do sistema
- [x] Organizar documentação de referência
- [ ] Criar estrutura de dados para fluxos

### Fase 2: Fluxos de Clientes
- [ ] Implementar os 20 fluxos de clientes
- [ ] Criar sistema de minidiagnóstico
- [ ] Sistema de recomendação automática de kits

### Fase 3: Fluxos de Recrutamento
- [ ] Implementar diagnósticos de recrutamento
- [ ] Criar links de atração
- [ ] Sistema de apresentação de negócio

### Fase 4: Ferramentas
- [ ] Gerador de links
- [ ] Área de scripts
- [ ] Painel de conversões
- [ ] Sistema de follow-up

### Fase 5: Treinamento
- [ ] Guias de uso
- [ ] Vídeos tutoriais
- [ ] Kit de início para novos distribuidores

## 📊 Estrutura de Dados

### Fluxo de Cliente
```typescript
interface FluxoCliente {
  id: string
  nome: string
  objetivo: string
  perguntas: Pergunta[]
  diagnostico: {
    titulo: string
    descricao: string
    beneficios: string[]
  }
  kitRecomendado: 'energia' | 'acelera' | 'ambos'
  cta: string
}
```

### Produto
```typescript
interface Produto {
  nome: string
  peso: string
  pv: number
  precoSugerido: number
  custo50: number
  doses: number
  custoPorDose: number
}
```

## 🔗 Links Úteis

- Página do Sistema: `/pt/wellness/system`
- Documentação de Produtos: `docs/wellness-system/02-produtos-referencia.md`
- Fluxos de Clientes: `docs/wellness-system/04-fluxos-clientes.md`

## 📝 Notas de Desenvolvimento

- Todos os fluxos seguem estrutura padronizada
- Sistema de recomendação automática baseado em respostas
- Integração com WhatsApp para follow-up
- Preparado para automações futuras

