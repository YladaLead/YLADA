/**
 * Questionário único dos presets HYPE no Pro Líderes (quizzes + calculadoras da biblioteca).
 * Base: quiz «Energia & Foco» (`pro-lideres-hype-quiz-preset-fluxos`, fluxo `energia-foco`).
 *
 * Cada `flow_id` mantém título, objetivo e outcomes; só o formulário é compartilhado.
 */
import type { FluxoCliente } from '@/types/wellness-system'

export const PRO_LIDERES_HYPE_UNIFIED_PERGUNTAS: FluxoCliente['perguntas'] = [
  {
    id: 'p1',
    texto: 'Em qual período do dia sua energia mais cai?',
    tipo: 'multipla_escolha',
    opcoes: ['Manhã', 'Meio da tarde', 'Noite', 'Varia o dia todo'],
  },
  {
    id: 'p2',
    texto: 'Como você costuma lidar com a queda de energia?',
    tipo: 'multipla_escolha',
    opcoes: ['Café', 'Energético', 'Aguento até acabar o dia', 'Não tenho estratégia'],
  },
  {
    id: 'p3',
    texto: 'Quantas xícaras de café você consome por dia?',
    tipo: 'multipla_escolha',
    opcoes: ['Nenhuma', '1-2', '3-4', '5 ou mais'],
  },
  {
    id: 'p4',
    texto: 'Como está seu foco mental ao longo do dia?',
    tipo: 'multipla_escolha',
    opcoes: ['Bom', 'Oscila', 'Cai rápido', 'Muito difícil manter'],
  },
  {
    id: 'p5',
    texto: 'Você pratica atividade física?',
    tipo: 'multipla_escolha',
    opcoes: ['Não', '1-2x/semana', '3-4x/semana', '5x ou mais'],
  },
]
