'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'

const treinamentos = [
  {
    id: 'como-recrutar',
    titulo: 'Como Recrutar',
    emoji: '👥',
    descricao: 'Aprenda estratégias eficazes para identificar e recrutar pessoas para o negócio',
    conteudo: `# Como Recrutar

## 1. Identifique o Perfil Ideal
- Pessoas que buscam renda extra
- Mães que querem trabalhar de casa
- Pessoas que já consomem produtos de bem-estar
- Jovens empreendedores

## 2. Use os Fluxos de Recrutamento
- Utilize os diagnósticos do sistema para identificar perfis
- Cada fluxo é desenhado para um tipo específico de pessoa
- Os resultados direcionam automaticamente para a apresentação

## 3. Abordagem Correta
- Seja consultivo, não vendedor
- Mostre o valor antes de falar de oportunidade
- Use os scripts da biblioteca como base
- Personalize conforme a pessoa

## 4. Follow-up Estratégico
- Não desista na primeira tentativa
- Use os templates de follow-up do sistema
- Seja consistente mas não invasivo
- Crie urgência positiva quando apropriado`
  },
  {
    id: 'como-convidar',
    titulo: 'Como Convidar para Apresentação',
    emoji: '📅',
    descricao: 'Técnicas para convidar pessoas para assistir à apresentação de negócio',
    conteudo: `# Como Convidar para Apresentação

## 1. Momento Certo
- Após a pessoa completar um diagnóstico de recrutamento
- Quando demonstra interesse em renda extra
- Após mostrar interesse nos produtos

## 2. Formato do Convite
- Seja direto mas não agressivo
- Destaque o benefício para ela
- Use linguagem simples e clara
- Crie curiosidade, não pressão

## 3. Exemplo de Convite
"Olá! Vi que você tem interesse em [TEMA]. Tenho uma apresentação rápida que mostra como funciona o modelo de negócio com bebidas funcionais. Quer ver? São só alguns minutos!"

## 4. Após o Convite
- Envie o link da apresentação
- Faça follow-up após 1h e 24h
- Esteja disponível para dúvidas
- Use os scripts de pós-link`
  },
  {
    id: 'como-vender-kits',
    titulo: 'Como Vender Kit Energia / Acelera',
    emoji: '💚',
    descricao: 'Estratégias para vender os kits de 5 dias e produtos fechados',
    conteudo: `# Como Vender Kit Energia / Acelera

## 1. Use os Fluxos de Cliente
- Cada fluxo identifica uma necessidade específica
- O diagnóstico direciona automaticamente para o kit ideal
- O resultado cria autoridade e confiança

## 2. Apresentação do Kit
- Destaque o custo por dose (R$ 1,00 a R$ 1,72)
- Compare com café, energéticos, suplementos
- Enfatize a praticidade (pronto para usar)
- Mencione resultados perceptíveis em poucos dias

## 3. Objeções Comuns
- Preço: Mostre o custo por dose, compare com alternativas
- Dúvida: Ofereça o kit de teste de 5 dias
- Tempo: Enfatize a praticidade (30 segundos por dia)

## 4. Fechamento
- Crie urgência positiva quando apropriado
- Facilite o processo de pagamento
- Confirme o envio e faça follow-up`
  },
  {
    id: 'como-usar-ferramenta',
    titulo: 'Como Usar a Ferramenta',
    emoji: '🛠️',
    descricao: 'Guia completo de como usar o Wellness System',
    conteudo: `# Como Usar a Ferramenta Wellness System

## 1. Fluxos de Cliente (Vendas)
1. Acesse "Vender Bebidas Funcionais" → "Fluxos de Cliente"
2. Escolha o fluxo mais adequado para seu público
3. Use o Gerador de Links para criar seu link personalizado
4. Compartilhe o link (WhatsApp, Instagram, etc.)
5. Acompanhe os diagnósticos no Histórico

## 2. Fluxos de Recrutamento
1. Acesse "Recrutar Pessoas" → "Fluxos de Recrutamento"
2. Escolha o fluxo baseado no perfil da pessoa
3. Compartilhe o link do diagnóstico
4. Após o resultado, envie o link da Apresentação de Negócio
5. Faça follow-up usando os scripts

## 3. Biblioteca de Scripts
1. Acesse "Scripts" → Escolha o tipo
2. Leia o contexto de cada script
3. Copie e personalize conforme necessário
4. Use nos momentos certos do processo

## 4. Follow-up
1. Use os templates de follow-up
2. Configure lembretes para você mesmo
3. Seja consistente mas não invasivo
4. Personalize as mensagens`
  },
  {
    id: 'guia-rapido',
    titulo: 'Guia Rápido do Novo Distribuidor',
    emoji: '🚀',
    descricao: 'Passo a passo para começar a trabalhar com o sistema',
    conteudo: `# Guia Rápido do Novo Distribuidor

## Primeiros Passos (24h)

### Dia 1 - Manhã
- [ ] Configure seu perfil (WhatsApp, nome, etc.)
- [ ] Explore o sistema e conheça os fluxos
- [ ] Escolha 3 fluxos de cliente para começar

### Dia 1 - Tarde
- [ ] Gere seus primeiros links usando o Gerador
- [ ] Compartilhe com 5 pessoas próximas
- [ ] Use os scripts de abertura da biblioteca

### Dia 1 - Noite
- [ ] Acompanhe os diagnósticos no Histórico
- [ ] Faça follow-up com quem completou
- [ ] Use os scripts de pós-diagnóstico

## Primeira Semana
- Compartilhe links diariamente
- Faça follow-up consistente
- Use os scripts como base
- Acompanhe suas estatísticas

## Primeiro Mês
- Identifique quais fluxos convertem mais
- Ajuste sua estratégia baseado nos dados
- Comece a usar fluxos de recrutamento
- Construa sua base de clientes`
  },
  {
    id: 'passo-7-dias',
    titulo: 'Passo a Passo 7 Dias',
    emoji: '📅',
    descricao: 'Plano de ação detalhado para os primeiros 7 dias',
    conteudo: `# Passo a Passo - 7 Dias

## Dia 1: Configuração
- Configure seu perfil completo
- Explore todos os módulos do sistema
- Escolha 5 fluxos para começar (3 cliente + 2 recrutamento)

## Dia 2: Primeiros Links
- Gere links para os 5 fluxos escolhidos
- Compartilhe com 10 pessoas (WhatsApp, Instagram)
- Use scripts de abertura personalizados

## Dia 3: Follow-up
- Faça follow-up com quem recebeu os links
- Use scripts de pós-link
- Compartilhe mais 5 links

## Dia 4: Análise
- Veja o Histórico de Diagnósticos
- Identifique quais fluxos geraram mais resultados
- Ajuste sua estratégia

## Dia 5: Aprofundamento
- Foque nos fluxos que mais convertem
- Use scripts de pós-diagnóstico
- Ofereça kits para quem completou diagnóstico

## Dia 6: Recrutamento
- Use fluxos de recrutamento
- Envie links de apresentação
- Use scripts específicos de recrutamento

## Dia 7: Consolidação
- Revise toda a semana
- Identifique padrões
- Planeje a próxima semana
- Continue o processo`
  },
  {
    id: 'videos',
    titulo: 'Vídeos Curtos',
    emoji: '🎥',
    descricao: 'Biblioteca de vídeos tutoriais rápidos',
    conteudo: `# Vídeos Curtos - Em Breve

## Vídeos Planejados

1. **Como usar o Gerador de Links** (2 min)
2. **Como escolher o fluxo certo** (3 min)
3. **Como fazer follow-up eficaz** (2 min)
4. **Como usar os scripts** (2 min)
5. **Como ler o Histórico de Diagnósticos** (2 min)

## Status
Os vídeos estão sendo produzidos e estarão disponíveis em breve!

Por enquanto, use os guias escritos e a documentação do sistema.`
  }
]

function TreinamentoPageContent() {
  const [treinamentoAberto, setTreinamentoAberto] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Treinamento do Consultor" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Sistema</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Treinamento do Consultor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Guias, tutoriais e estratégias para você dominar o sistema e ter resultados
          </p>
        </div>

        {/* Grid de Treinamentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {treinamentos.map((treinamento) => (
            <div
              key={treinamento.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setTreinamentoAberto(treinamentoAberto === treinamento.id ? null : treinamento.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{treinamento.emoji}</span>
                    <h3 className="text-lg font-bold text-gray-900">
                      {treinamento.titulo}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {treinamento.descricao}
                  </p>
                </div>
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    treinamentoAberto === treinamento.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Conteúdo Expandido */}
              {treinamentoAberto === treinamento.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                      {treinamento.conteudo}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function TreinamentoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <TreinamentoPageContent />
    </ProtectedRoute>
  )
}

