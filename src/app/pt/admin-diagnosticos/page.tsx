'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'

// Lista das 60 ferramentas YLADA (Catálogo Completo)
const ferramentasYLADA = [
  { id: 'quiz-interativo', nome: 'Quiz Interativo', categoria: 'Atrair Leads', objetivo: 'Atrair leads frios', icon: '🎯' },
  { id: 'quiz-bem-estar', nome: 'Quiz de Bem-Estar', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '🧘‍♀️' },
  { id: 'quiz-perfil-nutricional', nome: 'Quiz de Perfil Nutricional', categoria: 'Diagnóstico', objetivo: 'Diagnóstico inicial', icon: '🥗' },
  { id: 'quiz-detox', nome: 'Quiz Detox', categoria: 'Captação', objetivo: 'Captação + curiosidade', icon: '🧽' },
  { id: 'quiz-energetico', nome: 'Quiz Energético', categoria: 'Segmentação', objetivo: 'Segmentação', icon: '⚡' },
  { id: 'calculadora-imc', nome: 'Calculadora de IMC', categoria: 'Avaliação', objetivo: 'Avaliação corporal', icon: '📊' },
  { id: 'calculadora-proteina', nome: 'Calculadora de Proteína', categoria: 'Nutrição', objetivo: 'Recomendação nutricional', icon: '🥩' },
  { id: 'calculadora-agua', nome: 'Calculadora de Água', categoria: 'Engajamento', objetivo: 'Engajamento leve', icon: '💧' },
  { id: 'calculadora-calorias', nome: 'Calculadora de Calorias', categoria: 'Diagnóstico', objetivo: 'Diagnóstico', icon: '🔥' },
  { id: 'checklist-detox', nome: 'Checklist Detox', categoria: 'Educação', objetivo: 'Educação rápida', icon: '📋' },
  { id: 'checklist-alimentar', nome: 'Checklist Alimentar', categoria: 'Avaliação', objetivo: 'Avaliação de hábitos', icon: '🍽️' },
  { id: 'mini-ebook', nome: 'Mini E-book Educativo', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '📚' },
  { id: 'guia-nutraceutico', nome: 'Guia Nutracêutico', categoria: 'Atração', objetivo: 'Atração de interesse', icon: '💊' },
  { id: 'guia-proteico', nome: 'Guia Proteico', categoria: 'Especialização', objetivo: 'Especialização', icon: '🥛' },
  { id: 'tabela-comparativa', nome: 'Tabela Comparativa', categoria: 'Conversão', objetivo: 'Conversão', icon: '📊' },
  { id: 'tabela-substituicoes', nome: 'Tabela de Substituições', categoria: 'Valor', objetivo: 'Valor agregado', icon: '🔄' },
  { id: 'tabela-sintomas', nome: 'Tabela de Sintomas', categoria: 'Diagnóstico', objetivo: 'Diagnóstico leve', icon: '🩺' },
  { id: 'plano-alimentar-base', nome: 'Plano Alimentar Base', categoria: 'Valor', objetivo: 'Valor prático', icon: '📅' },
  { id: 'planner-refeicoes', nome: 'Planner de Refeições', categoria: 'Organização', objetivo: 'Organização', icon: '🗓️' },
  { id: 'rastreador-alimentar', nome: 'Rastreador Alimentar', categoria: 'Acompanhamento', objetivo: 'Acompanhamento', icon: '📈' },
  { id: 'diario-alimentar', nome: 'Diário Alimentar', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '📝' },
  { id: 'tabela-metas-semanais', nome: 'Tabela de Metas Semanais', categoria: 'Motivação', objetivo: 'Motivação', icon: '🎯' },
  { id: 'template-desafio-7dias', nome: 'Template de Desafio 7 Dias', categoria: 'Gamificação', objetivo: 'Gamificação', icon: '🏆' },
  { id: 'template-desafio-21dias', nome: 'Template de Desafio 21 Dias', categoria: 'Comprometimento', objetivo: 'Comprometimento', icon: '📅' },
  { id: 'guia-hidratacao', nome: 'Guia de Hidratação', categoria: 'Educação', objetivo: 'Educação visual', icon: '💧' },
  { id: 'infografico-educativo', nome: 'Infográfico Educativo', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '📊' },
  { id: 'template-receitas', nome: 'Template de Receitas', categoria: 'Valor', objetivo: 'Valor prático', icon: '👨‍🍳' },
  { id: 'cardapio-detox', nome: 'Cardápio Detox', categoria: 'Conversão', objetivo: 'Conversão indireta', icon: '🥗' },
  { id: 'simulador-resultados', nome: 'Simulador de Resultados', categoria: 'Curiosidade', objetivo: 'Curiosidade', icon: '🔮' },
  { id: 'template-avaliacao-inicial', nome: 'Template de Avaliação Inicial', categoria: 'Captação', objetivo: 'Captação', icon: '📋' },
  { id: 'formulario-recomendacao', nome: 'Formulário de Recomendação', categoria: 'Diagnóstico', objetivo: 'Diagnóstico rápido', icon: '📝' },
  { id: 'template-acompanhamento-semanal', nome: 'Template de Acompanhamento Semanal', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📊' },
  { id: 'template-checkin-mensal', nome: 'Template de Check-in Mensal', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📅' },
  { id: 'ficha-cliente', nome: 'Ficha de Cliente', categoria: 'Profissionalização', objetivo: 'Profissionalização', icon: '📋' },
  { id: 'template-progresso-visual', nome: 'Template de Progresso Visual', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '📈' },
  { id: 'template-story-interativo', nome: 'Template de Story Interativo', categoria: 'Engajamento', objetivo: 'Engajamento nas redes', icon: '📱' },
  { id: 'post-curiosidades', nome: 'Post de Curiosidades', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '💡' },
  { id: 'template-post-dica', nome: 'Template de Post com Dica', categoria: 'Conteúdo', objetivo: 'Conteúdo recorrente', icon: '📝' },
  { id: 'template-reels-roteirizado', nome: 'Template de Reels Roteirizado', categoria: 'Atração', objetivo: 'Atração visual', icon: '🎬' },
  { id: 'template-artigo-curto', nome: 'Template de Artigo Curto', categoria: 'Autoridade', objetivo: 'Autoridade escrita', icon: '📄' },
  { id: 'template-catalogo-digital', nome: 'Template de Catálogo Digital', categoria: 'Conversão', objetivo: 'Conversão direta', icon: '📱' },
  { id: 'simulador-ganho', nome: 'Simulador de Ganho', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '💰' },
  { id: 'template-oportunidade', nome: 'Template de Oportunidade', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '🚀' },
  { id: 'template-apresentacao-negocio', nome: 'Template de Apresentação de Negócio', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '📊' },
  { id: 'template-script-convite', nome: 'Template de Script de Convite', categoria: 'Duplicação', objetivo: 'Duplicação', icon: '💬' },
  { id: 'template-onboarding-parceiro', nome: 'Template de Onboarding de Parceiro', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '👥' },
  { id: 'template-plano-acao-equipe', nome: 'Template de Plano de Ação da Equipe', categoria: 'Gestão', objetivo: 'Gestão', icon: '📋' },
  { id: 'template-feedback-cliente', nome: 'Template de Feedback de Cliente', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '⭐' },
  { id: 'template-mensagem-pos-compra', nome: 'Template de Mensagem Pós-Compra', categoria: 'Retenção', objetivo: 'Retenção', icon: '🎉' },
  { id: 'template-email-reposicao', nome: 'Template de E-mail de Reposição', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📧' },
  { id: 'template-aniversario', nome: 'Template de Aniversário', categoria: 'Relacionamento', objetivo: 'Relacionamento', icon: '🎂' },
  { id: 'template-recompensa-cashback', nome: 'Template de Recompensa / Cashback', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '🎁' },
  { id: 'template-agradecimento', nome: 'Template de Agradecimento', categoria: 'Relacionamento', objetivo: 'Relacionamento', icon: '🙏' },
  { id: 'template-plano-semanal-conteudo', nome: 'Template de Plano Semanal de Conteúdo', categoria: 'Organização', objetivo: 'Organização', icon: '📅' },
  { id: 'template-reels-educativo', nome: 'Template de Reels Educativo', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '🎓' },
  { id: 'template-conteudo-autoridade', nome: 'Template de Conteúdo de Autoridade', categoria: 'Branding', objetivo: 'Branding', icon: '👑' },
  { id: 'template-testemunho-visual', nome: 'Template de Testemunho Visual', categoria: 'Prova Social', objetivo: 'Prova social', icon: '💬' },
  { id: 'template-calendario-postagens', nome: 'Template de Calendário de Postagens', categoria: 'Organização', objetivo: 'Organização', icon: '📅' },
  { id: 'template-estrategia-lancamento', nome: 'Template de Estratégia de Lançamento', categoria: 'Negócio', objetivo: 'Negócio', icon: '🚀' },
  { id: 'template-jornada-cliente', nome: 'Template de Jornada do Cliente', categoria: 'Estratégico', objetivo: 'Estratégico', icon: '🗺️' }
]

// Sistema completo de diagnósticos por profissão e ferramenta
const diagnosticosCompletos = {
  // 1. CALCULADORA DE IMC
  'calculadora-imc': {
    nutri: {
      baixoPeso: [
        '📋 Avaliação nutricional completa para ganho de peso saudável',
        '🥗 Plano alimentar hipercalórico e nutritivo',
        '💊 Suplementação para aumento de massa muscular',
        '📅 Acompanhamento nutricional semanal'
      ],
      pesoNormal: [
        '📋 Manutenção do peso com alimentação equilibrada',
        '🥗 Plano alimentar para otimização da saúde',
        '💪 Estratégias para ganho de massa muscular',
        '📅 Consultas de manutenção mensais'
      ],
      sobrepeso: [
        '📋 Plano alimentar para redução de peso',
        '🥗 Reeducação alimentar e mudança de hábitos',
        '💊 Suplementação para controle do apetite',
        '📅 Acompanhamento nutricional quinzenal'
      ],
      obesidade: [
        '📋 Plano alimentar para redução de peso',
        '🥗 Reeducação alimentar completa',
        '💊 Suplementação para controle metabólico',
        '📅 Acompanhamento nutricional semanal intensivo'
      ]
    },
    sales: {
      baixoPeso: [
        '💊 Whey Protein para ganho de massa muscular',
        '🍯 Maltodextrina para aumento calórico',
        '🥛 Mass Gainer para ganho de peso',
        '📞 Consultoria personalizada de suplementação'
      ],
      pesoNormal: [
        '💊 Multivitamínicos para otimização da saúde',
        '🥗 Proteínas para manutenção muscular',
        '💪 Creatina para performance física',
        '📞 Consultoria de suplementação preventiva'
      ],
      sobrepeso: [
        '💊 Termogênicos para aceleração metabólica',
        '🥗 Proteínas para preservação muscular',
        '💪 L-Carnitina para queima de gordura',
        '📞 Consultoria de suplementação para emagrecimento'
      ],
      obesidade: [
        '💊 Suplementos para controle metabólico',
        '🥗 Proteínas para preservação muscular',
        '💪 Suplementos para redução de apetite',
        '📞 Consultoria especializada em suplementação'
      ]
    },
    coach: {
      baixoPeso: [
        '🧘‍♀️ Programa de ganho de peso saudável',
        '💪 Treinos para aumento de massa muscular',
        '🍎 Coaching nutricional para ganho de peso',
        '📅 Acompanhamento semanal de transformação'
      ],
      pesoNormal: [
        '🧘‍♀️ Programa de otimização da saúde',
        '💪 Treinos para manutenção e performance',
        '🍎 Coaching de hábitos saudáveis',
        '📅 Acompanhamento mensal de bem-estar'
      ],
      sobrepeso: [
        '🧘‍♀️ Programa de transformação corporal',
        '💪 Treinos para redução de peso',
        '🍎 Coaching de mudança de hábitos',
        '📅 Acompanhamento quinzenal de progresso'
      ],
      obesidade: [
        '🧘‍♀️ Programa intensivo de transformação',
        '💪 Treinos adaptados para início da jornada',
        '🍎 Coaching completo de mudança de vida',
        '📅 Acompanhamento semanal intensivo'
      ]
    }
  },

  // 2. QUIZ INTERATIVO (Metabolismo)
  'quiz-interativo': {
    nutri: {
      metabolismoLento: [
        '📋 Avaliação metabólica completa',
        '🥗 Plano alimentar para acelerar metabolismo',
        '💊 Suplementos termogênicos naturais',
        '📅 Acompanhamento metabólico semanal'
      ],
      metabolismoNormal: [
        '📋 Manutenção do metabolismo equilibrado',
        '🥗 Otimização nutricional para performance',
        '💊 Suplementos de apoio metabólico',
        '📅 Consultas de manutenção mensais'
      ],
      metabolismoRapido: [
        '📋 Controle metabólico para estabilização',
        '🥗 Plano alimentar para sustentação energética',
        '💊 Suplementos para equilíbrio metabólico',
        '📅 Acompanhamento nutricional especializado'
      ]
    },
    sales: {
      metabolismoLento: [
        '💊 Termogênicos para aceleração metabólica',
        '🥗 Proteínas para preservação muscular',
        '💪 Suplementos para queima de gordura',
        '📞 Consultoria de suplementação metabólica'
      ],
      metabolismoNormal: [
        '💊 Multivitamínicos para suporte metabólico',
        '🥗 Proteínas para manutenção muscular',
        '💪 Suplementos de performance',
        '📞 Consultoria preventiva de suplementação'
      ],
      metabolismoRapido: [
        '💊 Suplementos para estabilização metabólica',
        '🥗 Proteínas para sustentação muscular',
        '💪 Suplementos de recuperação',
        '📞 Consultoria especializada em metabolismo'
      ]
    },
    coach: {
      metabolismoLento: [
        '🧘‍♀️ Programa de aceleração metabólica',
        '💪 Treinos HIIT para metabolismo',
        '🍎 Coaching nutricional metabólico',
        '📅 Acompanhamento de transformação metabólica'
      ],
      metabolismoNormal: [
        '🧘‍♀️ Programa de otimização metabólica',
        '💪 Treinos para manutenção metabólica',
        '🍎 Coaching de hábitos metabólicos',
        '📅 Acompanhamento de performance metabólica'
      ],
      metabolismoRapido: [
        '🧘‍♀️ Programa de estabilização metabólica',
        '💪 Treinos para sustentação energética',
        '🍎 Coaching de equilíbrio metabólico',
        '📅 Acompanhamento especializado metabólico'
      ]
    }
  },

  // 3. QUIZ DE BEM-ESTAR
  'quiz-bem-estar': {
    nutri: {
      baixoBemEstar: [
        '📋 Avaliação completa de bem-estar nutricional',
        '🥗 Plano alimentar para melhoria do humor',
        '💊 Suplementos para equilíbrio emocional',
        '📅 Acompanhamento nutricional terapêutico'
      ],
      bemEstarModerado: [
        '📋 Otimização nutricional para bem-estar',
        '🥗 Plano alimentar para manutenção do humor',
        '💊 Suplementos de apoio emocional',
        '📅 Consultas de manutenção do bem-estar'
      ],
      altoBemEstar: [
        '📋 Manutenção nutricional do bem-estar',
        '🥗 Plano alimentar para sustentação energética',
        '💊 Suplementos preventivos de bem-estar',
        '📅 Acompanhamento preventivo nutricional'
      ]
    },
    sales: {
      baixoBemEstar: [
        '💊 Suplementos para equilíbrio emocional',
        '🥗 Proteínas para estabilização do humor',
        '💪 Suplementos para energia e disposição',
        '📞 Consultoria de suplementação para bem-estar'
      ],
      bemEstarModerado: [
        '💊 Multivitamínicos para suporte emocional',
        '🥗 Proteínas para manutenção energética',
        '💪 Suplementos de performance mental',
        '📞 Consultoria preventiva de bem-estar'
      ],
      altoBemEstar: [
        '💊 Suplementos para sustentação do bem-estar',
        '🥗 Proteínas para otimização energética',
        '💪 Suplementos de manutenção',
        '📞 Consultoria especializada em bem-estar'
      ]
    },
    coach: {
      baixoBemEstar: [
        '🧘‍♀️ Programa intensivo de bem-estar',
        '💪 Treinos para melhoria do humor',
        '🍎 Coaching nutricional terapêutico',
        '📅 Acompanhamento semanal de transformação'
      ],
      bemEstarModerado: [
        '🧘‍♀️ Programa de otimização do bem-estar',
        '💪 Treinos para manutenção energética',
        '🍎 Coaching de hábitos de bem-estar',
        '📅 Acompanhamento mensal de progresso'
      ],
      altoBemEstar: [
        '🧘‍♀️ Programa de sustentação do bem-estar',
        '💪 Treinos para manutenção da performance',
        '🍎 Coaching preventivo de bem-estar',
        '📅 Acompanhamento preventivo especializado'
      ]
    }
  },

  // 11. MINI E-BOOK EDUCATIVO
  'mini-ebook': {
    nutri: {
      baixoConhecimento: [
        '📋 E-book completo sobre nutrição básica',
        '🥗 Guia prático de alimentação saudável',
        '💊 Informações sobre suplementação',
        '📅 Consulta nutricional educativa'
      ],
      conhecimentoModerado: [
        '📋 E-book sobre nutrição avançada',
        '🥗 Guia de otimização nutricional',
        '💊 Suplementação específica por objetivo',
        '📅 Consulta nutricional especializada'
      ],
      altoConhecimento: [
        '📋 E-book sobre nutrição de alta performance',
        '🥗 Guia de nutrição esportiva',
        '💊 Suplementação de elite',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      baixoConhecimento: [
        '💊 E-book sobre suplementos básicos',
        '🥗 Guia de produtos nutricionais',
        '💪 Informações sobre suplementação',
        '📞 Consultoria educativa em suplementos'
      ],
      conhecimentoModerado: [
        '💊 E-book sobre suplementos avançados',
        '🥗 Guia de produtos especializados',
        '💪 Suplementação por objetivo',
        '📞 Consultoria especializada em produtos'
      ],
      altoConhecimento: [
        '💊 E-book sobre suplementos de elite',
        '🥗 Guia de produtos de alta performance',
        '💪 Suplementação profissional',
        '📞 Consultoria premium em suplementos'
      ]
    },
    coach: {
      baixoConhecimento: [
        '🧘‍♀️ E-book sobre bem-estar básico',
        '💪 Guia de exercícios fundamentais',
        '🍎 Coaching nutricional educativo',
        '📅 Programa de transformação inicial'
      ],
      conhecimentoModerado: [
        '🧘‍♀️ E-book sobre bem-estar avançado',
        '💪 Guia de treinos especializados',
        '🍎 Coaching nutricional específico',
        '📅 Programa de transformação intermediário'
      ],
      altoConhecimento: [
        '🧘‍♀️ E-book sobre bem-estar de elite',
        '💪 Guia de treinos de alta performance',
        '🍎 Coaching nutricional profissional',
        '📅 Programa de transformação avançado'
      ]
    }
  },

  // 12. GUIA NUTRACÊUTICO
  'guia-nutraceutico': {
    nutri: {
      baixoInteresse: [
        '📋 Guia básico de nutracêuticos',
        '🥗 Informações sobre alimentos funcionais',
        '💊 Suplementação preventiva',
        '📅 Consulta nutricional preventiva'
      ],
      interesseModerado: [
        '📋 Guia avançado de nutracêuticos',
        '🥗 Alimentos funcionais específicos',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      altoInteresse: [
        '📋 Guia especializado em nutracêuticos',
        '🥗 Alimentos funcionais de alta qualidade',
        '💊 Suplementação de precisão',
        '📅 Consulta nutricional de alta performance'
      ]
    },
    sales: {
      baixoInteresse: [
        '💊 Guia básico de produtos nutracêuticos',
        '🥗 Produtos funcionais essenciais',
        '💪 Suplementação preventiva',
        '📞 Consultoria básica em nutracêuticos'
      ],
      interesseModerado: [
        '💊 Guia avançado de nutracêuticos',
        '🥗 Produtos funcionais específicos',
        '💪 Suplementação direcionada',
        '📞 Consultoria especializada em produtos'
      ],
      altoInteresse: [
        '💊 Guia premium de nutracêuticos',
        '🥗 Produtos funcionais de elite',
        '💪 Suplementação de precisão',
        '📞 Consultoria premium em nutracêuticos'
      ]
    },
    coach: {
      baixoInteresse: [
        '🧘‍♀️ Guia básico de bem-estar natural',
        '💪 Exercícios com foco em saúde',
        '🍎 Coaching nutricional preventivo',
        '📅 Programa de bem-estar inicial'
      ],
      interesseModerado: [
        '🧘‍♀️ Guia avançado de bem-estar natural',
        '💪 Treinos com foco em performance',
        '🍎 Coaching nutricional específico',
        '📅 Programa de bem-estar intermediário'
      ],
      altoInteresse: [
        '🧘‍♀️ Guia especializado em bem-estar natural',
        '💪 Treinos de alta performance natural',
        '🍎 Coaching nutricional profissional',
        '📅 Programa de bem-estar avançado'
      ]
    }
  },

  // 13. GUIA PROTEICO
  'guia-proteico': {
    nutri: {
      baixaProteina: [
        '📋 Guia completo de proteínas',
        '🥗 Plano alimentar rico em proteínas',
        '💊 Suplementação proteica específica',
        '📅 Consulta nutricional proteica'
      ],
      proteinaModerada: [
        '📋 Guia de otimização proteica',
        '🥗 Plano alimentar balanceado',
        '💊 Suplementação proteica preventiva',
        '📅 Consulta nutricional especializada'
      ],
      altaProteina: [
        '📋 Guia de performance proteica',
        '🥗 Plano alimentar de alta qualidade',
        '💊 Suplementação proteica avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      baixaProteina: [
        '💊 Guia completo de suplementos proteicos',
        '🥗 Produtos proteicos essenciais',
        '💪 Suplementação proteica básica',
        '📞 Consultoria especializada em proteínas'
      ],
      proteinaModerada: [
        '💊 Guia de otimização proteica',
        '🥗 Produtos proteicos balanceados',
        '💪 Suplementação proteica moderada',
        '📞 Consultoria preventiva proteica'
      ],
      altaProteina: [
        '💊 Guia de performance proteica',
        '🥗 Produtos proteicos de alta qualidade',
        '💪 Suplementação proteica avançada',
        '📞 Consultoria premium em proteínas'
      ]
    },
    coach: {
      baixaProteina: [
        '🧘‍♀️ Guia de treinos para ganho muscular',
        '💪 Exercícios focados em massa muscular',
        '🍎 Coaching nutricional proteico',
        '📅 Programa de ganho muscular'
      ],
      proteinaModerada: [
        '🧘‍♀️ Guia de treinos balanceados',
        '💪 Exercícios para manutenção muscular',
        '🍎 Coaching nutricional equilibrado',
        '📅 Programa de manutenção muscular'
      ],
      altaProteina: [
        '🧘‍♀️ Guia de treinos de alta performance',
        '💪 Exercícios para performance muscular',
        '🍎 Coaching nutricional de elite',
        '📅 Programa de performance muscular'
      ]
    }
  },

  // 14. TABELA COMPARATIVA
  'tabela-comparativa': {
    nutri: [
      '📋 Análise comparativa de produtos',
      '🥗 Recomendações baseadas em evidências',
      '💊 Suplementação personalizada',
      '📅 Consulta nutricional comparativa'
    ],
    sales: [
      '💊 Comparativo detalhado de produtos',
      '🥗 Produtos recomendados por categoria',
      '💪 Suplementação direcionada',
      '📞 Consultoria comparativa em produtos'
    ],
    coach: [
      '🧘‍♀️ Comparativo de estratégias de treino',
      '💪 Exercícios recomendados por objetivo',
      '🍎 Coaching nutricional comparativo',
      '📅 Programa de treino personalizado'
    ]
  },

  // 15. TABELA DE SUBSTITUIÇÕES
  'tabela-substituicoes': {
    nutri: [
      '📋 Guia completo de substituições alimentares',
      '🥗 Alternativas nutritivas por categoria',
      '💊 Suplementação para substituições',
      '📅 Consulta nutricional de substituições'
    ],
    sales: [
      '💊 Guia de produtos substitutos',
      '🥗 Alternativas por categoria de produto',
      '💪 Suplementação para substituições',
      '📞 Consultoria em produtos substitutos'
    ],
    coach: [
      '🧘‍♀️ Guia de exercícios substitutos',
      '💪 Alternativas de treino por objetivo',
      '🍎 Coaching nutricional de substituições',
      '📅 Programa de treino adaptado'
    ]
  },

  // 16. TABELA DE SINTOMAS
  'tabela-sintomas': {
    nutri: [
      '📋 Análise nutricional de sintomas',
      '🥗 Plano alimentar para correção',
      '💊 Suplementação para sintomas específicos',
      '📅 Consulta nutricional terapêutica'
    ],
    sales: [
      '💊 Produtos para sintomas específicos',
      '🥗 Suplementação direcionada',
      '💪 Produtos de apoio terapêutico',
      '📞 Consultoria em produtos terapêuticos'
    ],
    coach: [
      '🧘‍♀️ Programa de bem-estar para sintomas',
      '💪 Exercícios adaptados para sintomas',
      '🍎 Coaching nutricional terapêutico',
      '📅 Programa de transformação terapêutica'
    ]
  },

  // 17. PLANO ALIMENTAR BASE
  'plano-alimentar-base': {
    nutri: [
      '📋 Plano alimentar personalizado',
      '🥗 Cardápio baseado em necessidades',
      '💊 Suplementação complementar',
      '📅 Acompanhamento nutricional semanal'
    ],
    sales: [
      '💊 Produtos complementares ao plano',
      '🥗 Suplementação para o plano alimentar',
      '💪 Produtos de apoio nutricional',
      '📞 Consultoria em produtos complementares'
    ],
    coach: [
      '🧘‍♀️ Programa de transformação alimentar',
      '💪 Exercícios complementares ao plano',
      '🍎 Coaching nutricional do plano',
      '📅 Acompanhamento do plano alimentar'
    ]
  },

  // 18. PLANNER DE REFEIÇÕES
  'planner-refeicoes': {
    nutri: [
      '📋 Planner personalizado de refeições',
      '🥗 Organização semanal de cardápio',
      '💊 Suplementação integrada ao planner',
      '📅 Acompanhamento do planner semanal'
    ],
    sales: [
      '💊 Produtos para o planner de refeições',
      '🥗 Suplementação integrada',
      '💪 Produtos de apoio ao planner',
      '📞 Consultoria em produtos do planner'
    ],
    coach: [
      '🧘‍♀️ Programa de organização alimentar',
      '💪 Exercícios integrados ao planner',
      '🍎 Coaching do planner alimentar',
      '📅 Acompanhamento do planner'
    ]
  },

  // 19. RASTREADOR ALIMENTAR
  'rastreador-alimentar': {
    nutri: [
      '📋 Análise do rastreamento alimentar',
      '🥗 Correções baseadas no rastreamento',
      '💊 Suplementação baseada no padrão',
      '📅 Consulta nutricional de análise'
    ],
    sales: [
      '💊 Produtos baseados no rastreamento',
      '🥗 Suplementação personalizada',
      '💪 Produtos para correção de padrões',
      '📞 Consultoria baseada no rastreamento'
    ],
    coach: [
      '🧘‍♀️ Programa baseado no rastreamento',
      '💪 Exercícios para correção de padrões',
      '🍎 Coaching nutricional de análise',
      '📅 Acompanhamento de correção'
    ]
  },

  // 20. DIÁRIO ALIMENTAR
  'diario-alimentar': {
    nutri: [
      '📋 Análise do diário alimentar',
      '🥗 Plano de correção alimentar',
      '💊 Suplementação baseada no diário',
      '📅 Consulta nutricional de análise'
    ],
    sales: [
      '💊 Produtos para correção alimentar',
      '🥗 Suplementação baseada no diário',
      '💪 Produtos de apoio alimentar',
      '📞 Consultoria baseada no diário'
    ],
    coach: [
      '🧘‍♀️ Programa de correção alimentar',
      '💪 Exercícios para mudança de hábitos',
      '🍎 Coaching nutricional de transformação',
      '📅 Acompanhamento de mudança'
    ]
  },

  // 4. QUIZ DE PERFIL NUTRICIONAL
  'quiz-perfil-nutricional': {
    nutri: {
      perfilDeficiente: [
        '📋 Avaliação nutricional completa para correção de deficiências',
        '🥗 Plano alimentar para reposição nutricional',
        '💊 Suplementação específica para deficiências',
        '📅 Acompanhamento nutricional intensivo semanal'
      ],
      perfilEquilibrado: [
        '📋 Manutenção do equilíbrio nutricional',
        '🥗 Plano alimentar para otimização nutricional',
        '💊 Suplementação preventiva',
        '📅 Consultas de manutenção mensais'
      ],
      perfilOtimizado: [
        '📋 Otimização avançada do perfil nutricional',
        '🥗 Plano alimentar para performance nutricional',
        '💊 Suplementação de alta performance',
        '📅 Acompanhamento especializado nutricional'
      ]
    },
    sales: {
      perfilDeficiente: [
        '💊 Multivitamínicos para correção de deficiências',
        '🥗 Proteínas para reposição nutricional',
        '💪 Suplementos específicos para deficiências',
        '📞 Consultoria especializada em deficiências nutricionais'
      ],
      perfilEquilibrado: [
        '💊 Multivitamínicos para manutenção',
        '🥗 Proteínas para equilíbrio nutricional',
        '💪 Suplementos preventivos',
        '📞 Consultoria preventiva de suplementação'
      ],
      perfilOtimizado: [
        '💊 Suplementos de alta performance nutricional',
        '🥗 Proteínas para otimização',
        '💪 Suplementos avançados',
        '📞 Consultoria especializada em performance nutricional'
      ]
    },
    coach: {
      perfilDeficiente: [
        '🧘‍♀️ Programa intensivo de correção nutricional',
        '💪 Treinos adaptados para deficiências',
        '🍎 Coaching nutricional terapêutico',
        '📅 Acompanhamento semanal de correção'
      ],
      perfilEquilibrado: [
        '🧘‍♀️ Programa de manutenção nutricional',
        '💪 Treinos para equilíbrio nutricional',
        '🍎 Coaching de hábitos nutricionais',
        '📅 Acompanhamento mensal de manutenção'
      ],
      perfilOtimizado: [
        '🧘‍♀️ Programa de otimização nutricional avançada',
        '💪 Treinos para performance nutricional',
        '🍎 Coaching nutricional de alta performance',
        '📅 Acompanhamento especializado nutricional'
      ]
    }
  },

  // 5. QUIZ DETOX
  'quiz-detox': {
    nutri: {
      baixaToxicidade: [
        '📋 Manutenção da saúde detox natural',
        '🥗 Plano alimentar para sustentação detox',
        '💊 Suplementos de apoio detox',
        '📅 Consultas de manutenção detox mensais'
      ],
      toxicidadeModerada: [
        '📋 Plano detox moderado para redução de toxinas',
        '🥗 Plano alimentar detox específico',
        '💊 Suplementos detox específicos',
        '📅 Acompanhamento detox quinzenal'
      ],
      altaToxicidade: [
        '📋 Plano detox intensivo para eliminação de toxinas',
        '🥗 Plano alimentar detox completo',
        '💊 Suplementos detox intensivos',
        '📅 Acompanhamento detox semanal intensivo'
      ]
    },
    sales: {
      baixaToxicidade: [
        '💊 Suplementos de manutenção detox',
        '🥗 Proteínas para sustentação detox',
        '💪 Suplementos de apoio detox',
        '📞 Consultoria preventiva detox'
      ],
      toxicidadeModerada: [
        '💊 Suplementos detox moderados',
        '🥗 Proteínas para apoio detox',
        '💪 Suplementos específicos detox',
        '📞 Consultoria detox moderada'
      ],
      altaToxicidade: [
        '💊 Suplementos detox intensivos',
        '🥗 Proteínas para suporte detox',
        '💪 Suplementos detox avançados',
        '📞 Consultoria especializada detox'
      ]
    },
    coach: {
      baixaToxicidade: [
        '🧘‍♀️ Programa de manutenção detox',
        '💪 Treinos para sustentação detox',
        '🍎 Coaching nutricional detox preventivo',
        '📅 Acompanhamento mensal detox'
      ],
      toxicidadeModerada: [
        '🧘‍♀️ Programa detox moderado',
        '💪 Treinos para apoio detox',
        '🍎 Coaching nutricional detox',
        '📅 Acompanhamento quinzenal detox'
      ],
      altaToxicidade: [
        '🧘‍♀️ Programa detox intensivo',
        '💪 Treinos para suporte detox',
        '🍎 Coaching nutricional detox intensivo',
        '📅 Acompanhamento semanal detox'
      ]
    }
  },

  // 6. QUIZ ENERGÉTICO
  'quiz-energetico': {
    nutri: {
      baixaEnergia: [
        '📋 Avaliação energética completa',
        '🥗 Plano alimentar para aumento de energia',
        '💊 Suplementos energéticos naturais',
        '📅 Acompanhamento energético semanal'
      ],
      energiaModerada: [
        '📋 Otimização energética nutricional',
        '🥗 Plano alimentar para manutenção energética',
        '💊 Suplementos de apoio energético',
        '📅 Consultas de manutenção energética'
      ],
      altaEnergia: [
        '📋 Manutenção da alta energia',
        '🥗 Plano alimentar para sustentação energética',
        '💊 Suplementos preventivos energéticos',
        '📅 Acompanhamento preventivo energético'
      ]
    },
    sales: {
      baixaEnergia: [
        '💊 Suplementos energéticos para aumento',
        '🥗 Proteínas para energia',
        '💪 Suplementos para disposição',
        '📞 Consultoria energética especializada'
      ],
      energiaModerada: [
        '💊 Suplementos energéticos moderados',
        '🥗 Proteínas para manutenção energética',
        '💪 Suplementos de apoio energético',
        '📞 Consultoria preventiva energética'
      ],
      altaEnergia: [
        '💊 Suplementos para sustentação energética',
        '🥗 Proteínas para otimização energética',
        '💪 Suplementos de manutenção energética',
        '📞 Consultoria especializada energética'
      ]
    },
    coach: {
      baixaEnergia: [
        '🧘‍♀️ Programa intensivo de aumento energético',
        '💪 Treinos para aumento de energia',
        '🍎 Coaching nutricional energético',
        '📅 Acompanhamento semanal energético'
      ],
      energiaModerada: [
        '🧘‍♀️ Programa de otimização energética',
        '💪 Treinos para manutenção energética',
        '🍎 Coaching de hábitos energéticos',
        '📅 Acompanhamento mensal energético'
      ],
      altaEnergia: [
        '🧘‍♀️ Programa de sustentação energética',
        '💪 Treinos para manutenção da energia',
        '🍎 Coaching preventivo energético',
        '📅 Acompanhamento preventivo energético'
      ]
    }
  },

  // 7. CALCULADORA DE PROTEÍNA
  'calculadora-proteina': {
    nutri: {
      baixaProteina: [
        '📋 Avaliação proteica completa para correção',
        '🥗 Plano alimentar rico em proteínas',
        '💊 Suplementação proteica específica',
        '📅 Acompanhamento proteico semanal'
      ],
      proteinaNormal: [
        '📋 Manutenção do equilíbrio proteico',
        '🥗 Plano alimentar para otimização proteica',
        '💊 Suplementação proteica preventiva',
        '📅 Consultas de manutenção proteica'
      ],
      altaProteina: [
        '📋 Otimização avançada da proteína',
        '🥗 Plano alimentar para performance proteica',
        '💊 Suplementação proteica de alta qualidade',
        '📅 Acompanhamento especializado proteico'
      ]
    },
    sales: {
      baixaProteina: [
        '💊 Whey Protein para correção proteica',
        '🥗 Proteínas vegetais para aumento',
        '💪 Suplementos proteicos específicos',
        '📞 Consultoria especializada em proteínas'
      ],
      proteinaNormal: [
        '💊 Proteínas para manutenção',
        '🥗 Proteínas para equilíbrio',
        '💪 Suplementos proteicos preventivos',
        '📞 Consultoria preventiva proteica'
      ],
      altaProteina: [
        '💊 Proteínas de alta qualidade',
        '🥗 Proteínas para otimização',
        '💪 Suplementos proteicos avançados',
        '📞 Consultoria especializada em performance proteica'
      ]
    },
    coach: {
      baixaProteina: [
        '🧘‍♀️ Programa intensivo de correção proteica',
        '💪 Treinos para aumento de massa muscular',
        '🍎 Coaching nutricional proteico',
        '📅 Acompanhamento semanal proteico'
      ],
      proteinaNormal: [
        '🧘‍♀️ Programa de manutenção proteica',
        '💪 Treinos para equilíbrio muscular',
        '🍎 Coaching de hábitos proteicos',
        '📅 Acompanhamento mensal proteico'
      ],
      altaProteina: [
        '🧘‍♀️ Programa de otimização proteica avançada',
        '💪 Treinos para performance muscular',
        '🍎 Coaching proteico de alta performance',
        '📅 Acompanhamento especializado proteico'
      ]
    }
  },

  // 8. CALCULADORA DE ÁGUA
  'calculadora-agua': {
    nutri: {
      baixaHidratacao: [
        '📋 Avaliação hidratacional completa',
        '🥗 Plano alimentar rico em líquidos',
        '💊 Suplementos eletrolíticos',
        '📅 Acompanhamento hidratacional semanal'
      ],
      hidratacaoModerada: [
        '📋 Otimização da hidratação',
        '🥗 Plano alimentar para manutenção hidratacional',
        '💊 Suplementos de apoio hidratacional',
        '📅 Consultas de manutenção hidratacional'
      ],
      altaHidratacao: [
        '📋 Manutenção da hidratação otimizada',
        '🥗 Plano alimentar para sustentação hidratacional',
        '💊 Suplementos preventivos hidratacionais',
        '📅 Acompanhamento preventivo hidratacional'
      ]
    },
    sales: {
      baixaHidratacao: [
        '💊 Eletrólitos para correção hidratacional',
        '🥗 Suplementos hidratacionais',
        '💪 Suplementos para reposição hídrica',
        '📞 Consultoria especializada em hidratação'
      ],
      hidratacaoModerada: [
        '💊 Eletrólitos para manutenção',
        '🥗 Suplementos hidratacionais moderados',
        '💪 Suplementos de apoio hidratacional',
        '📞 Consultoria preventiva hidratacional'
      ],
      altaHidratacao: [
        '💊 Eletrólitos para otimização',
        '🥗 Suplementos hidratacionais avançados',
        '💪 Suplementos de manutenção hidratacional',
        '📞 Consultoria especializada hidratacional'
      ]
    },
    coach: {
      baixaHidratacao: [
        '🧘‍♀️ Programa intensivo de hidratação',
        '💪 Treinos adaptados para hidratação',
        '🍎 Coaching nutricional hidratacional',
        '📅 Acompanhamento semanal hidratacional'
      ],
      hidratacaoModerada: [
        '🧘‍♀️ Programa de otimização hidratacional',
        '💪 Treinos para manutenção hidratacional',
        '🍎 Coaching de hábitos hidratacionais',
        '📅 Acompanhamento mensal hidratacional'
      ],
      altaHidratacao: [
        '🧘‍♀️ Programa de sustentação hidratacional',
        '💪 Treinos para manutenção da hidratação',
        '🍎 Coaching preventivo hidratacional',
        '📅 Acompanhamento preventivo hidratacional'
      ]
    }
  },

  // 9. CALCULADORA DE CALORIAS
  'calculadora-calorias': {
    nutri: {
      deficitCalorico: [
        '📋 Plano calórico para redução de peso',
        '🥗 Plano alimentar hipocalórico',
        '💊 Suplementos para controle do apetite',
        '📅 Acompanhamento calórico semanal'
      ],
      manutencaoCalorica: [
        '📋 Manutenção do equilíbrio calórico',
        '🥗 Plano alimentar para manutenção',
        '💊 Suplementos preventivos calóricos',
        '📅 Consultas de manutenção calórica'
      ],
      superavitCalorico: [
        '📋 Plano calórico para ganho de peso',
        '🥗 Plano alimentar hipercalórico',
        '💊 Suplementos para aumento calórico',
        '📅 Acompanhamento calórico especializado'
      ]
    },
    sales: {
      deficitCalorico: [
        '💊 Termogênicos para queima calórica',
        '🥗 Proteínas para preservação muscular',
        '💪 Suplementos para controle do apetite',
        '📞 Consultoria especializada em emagrecimento'
      ],
      manutencaoCalorica: [
        '💊 Multivitamínicos para manutenção',
        '🥗 Proteínas para equilíbrio calórico',
        '💪 Suplementos preventivos',
        '📞 Consultoria preventiva calórica'
      ],
      superavitCalorico: [
        '💊 Suplementos hipercalóricos',
        '🥗 Proteínas para ganho de peso',
        '💪 Suplementos para aumento calórico',
        '📞 Consultoria especializada em ganho de peso'
      ]
    },
    coach: {
      deficitCalorico: [
        '🧘‍♀️ Programa de redução calórica',
        '💪 Treinos para queima calórica',
        '🍎 Coaching nutricional para emagrecimento',
        '📅 Acompanhamento semanal de redução'
      ],
      manutencaoCalorica: [
        '🧘‍♀️ Programa de manutenção calórica',
        '💪 Treinos para equilíbrio calórico',
        '🍎 Coaching de hábitos calóricos',
        '📅 Acompanhamento mensal calórico'
      ],
      superavitCalorico: [
        '🧘‍♀️ Programa de ganho calórico',
        '💪 Treinos para ganho de peso',
        '🍎 Coaching nutricional para ganho',
        '📅 Acompanhamento especializado calórico'
      ]
    }
  },

  // 10. CHECKLIST DETOX
  'checklist-detox': {
    nutri: {
      baixaToxicidade: [
        '📋 Manutenção da saúde detox natural',
        '🥗 Plano alimentar para sustentação detox',
        '💊 Suplementos de apoio detox',
        '📅 Consultas de manutenção detox mensais'
      ],
      toxicidadeModerada: [
        '📋 Plano detox moderado para redução',
        '🥗 Plano alimentar detox específico',
        '💊 Suplementos detox específicos',
        '📅 Acompanhamento detox quinzenal'
      ],
      altaToxicidade: [
        '📋 Plano detox intensivo para eliminação',
        '🥗 Plano alimentar detox completo',
        '💊 Suplementos detox intensivos',
        '📅 Acompanhamento detox semanal intensivo'
      ]
    },
    sales: {
      baixaToxicidade: [
        '💊 Suplementos de manutenção detox',
        '🥗 Proteínas para sustentação detox',
        '💪 Suplementos de apoio detox',
        '📞 Consultoria preventiva detox'
      ],
      toxicidadeModerada: [
        '💊 Suplementos detox moderados',
        '🥗 Proteínas para apoio detox',
        '💪 Suplementos específicos detox',
        '📞 Consultoria detox moderada'
      ],
      altaToxicidade: [
        '💊 Suplementos detox intensivos',
        '🥗 Proteínas para suporte detox',
        '💪 Suplementos detox avançados',
        '📞 Consultoria especializada detox'
      ]
    },
    coach: {
      baixaToxicidade: [
        '🧘‍♀️ Programa de manutenção detox',
        '💪 Treinos para sustentação detox',
        '🍎 Coaching nutricional detox preventivo',
        '📅 Acompanhamento mensal detox'
      ],
      toxicidadeModerada: [
        '🧘‍♀️ Programa detox moderado',
        '💪 Treinos para apoio detox',
        '🍎 Coaching nutricional detox',
        '📅 Acompanhamento quinzenal detox'
      ],
      altaToxicidade: [
        '🧘‍♀️ Programa detox intensivo',
        '💪 Treinos para suporte detox',
        '🍎 Coaching nutricional detox intensivo',
        '📅 Acompanhamento semanal detox'
      ]
    }
  }
}

// Categorias dinâmicas baseadas na ferramenta escolhida
const getCategoriasPorFerramenta = (ferramentaId: string) => {
  const categoriasMap: { [key: string]: any[] } = {
    'calculadora-imc': [
      { id: 'baixoPeso', label: 'Baixo Peso', range: '< 18.5', color: 'blue' },
      { id: 'pesoNormal', label: 'Peso Normal', range: '18.5 - 24.9', color: 'green' },
      { id: 'sobrepeso', label: 'Sobrepeso', range: '25.0 - 29.9', color: 'yellow' },
      { id: 'obesidade', label: 'Obesidade', range: '≥ 30.0', color: 'red' }
    ],
    'quiz-interativo': [
      { id: 'metabolismo-lento', label: 'Metabolismo Lento', range: '0-30 pontos', color: 'blue' },
      { id: 'metabolismo-normal', label: 'Metabolismo Normal', range: '31-60 pontos', color: 'green' },
      { id: 'metabolismo-rapido', label: 'Metabolismo Rápido', range: '61-100 pontos', color: 'yellow' }
    ],
    'quiz-bem-estar': [
      { id: 'baixo-bem-estar', label: 'Baixo Bem-estar', range: '0-40 pontos', color: 'red' },
      { id: 'bem-estar-moderado', label: 'Bem-estar Moderado', range: '41-70 pontos', color: 'yellow' },
      { id: 'alto-bem-estar', label: 'Alto Bem-estar', range: '71-100 pontos', color: 'green' }
    ],
    'quiz-perfil-nutricional': [
      { id: 'perfil-deficiente', label: 'Perfil Deficiente', range: '0-30 pontos', color: 'red' },
      { id: 'perfil-equilibrado', label: 'Perfil Equilibrado', range: '31-70 pontos', color: 'green' },
      { id: 'perfil-otimizado', label: 'Perfil Otimizado', range: '71-100 pontos', color: 'blue' }
    ],
    'quiz-detox': [
      { id: 'baixa-toxicidade', label: 'Baixa Toxicidade', range: '0-3 sinais', color: 'green' },
      { id: 'toxicidade-moderada', label: 'Toxicidade Moderada', range: '4-6 sinais', color: 'yellow' },
      { id: 'alta-toxicidade', label: 'Alta Toxicidade', range: '7+ sinais', color: 'red' }
    ],
    'quiz-energetico': [
      { id: 'baixa-energia', label: 'Baixa Energia', range: '0-30 pontos', color: 'red' },
      { id: 'energia-moderada', label: 'Energia Moderada', range: '31-70 pontos', color: 'yellow' },
      { id: 'alta-energia', label: 'Alta Energia', range: '71-100 pontos', color: 'green' }
    ],
    'calculadora-proteina': [
      { id: 'baixa-proteina', label: 'Baixa Proteína', range: '< 0.8g/kg', color: 'blue' },
      { id: 'proteina-normal', label: 'Proteína Normal', range: '0.8-1.2g/kg', color: 'green' },
      { id: 'alta-proteina', label: 'Alta Proteína', range: '> 1.2g/kg', color: 'yellow' }
    ],
    'calculadora-agua': [
      { id: 'baixa-hidratacao', label: 'Baixa Hidratação', range: '< 2L/dia', color: 'red' },
      { id: 'hidratacao-moderada', label: 'Hidratação Moderada', range: '2-3L/dia', color: 'yellow' },
      { id: 'alta-hidratacao', label: 'Alta Hidratação', range: '> 3L/dia', color: 'green' }
    ],
    'calculadora-calorias': [
      { id: 'deficit-calorico', label: 'Déficit Calórico', range: 'Perda de peso', color: 'blue' },
      { id: 'manutencao-calorica', label: 'Manutenção', range: 'Peso estável', color: 'green' },
      { id: 'superavit-calorico', label: 'Superávit Calórico', range: 'Ganho de peso', color: 'yellow' }
    ],
    'checklist-detox': [
      { id: 'baixa-toxicidade', label: 'Baixa Toxicidade', range: '0-3 sinais', color: 'green' },
      { id: 'toxicidade-moderada', label: 'Toxicidade Moderada', range: '4-6 sinais', color: 'yellow' },
      { id: 'alta-toxicidade', label: 'Alta Toxicidade', range: '7+ sinais', color: 'red' }
    ],
    'mini-ebook': [
      { id: 'baixo-conhecimento', label: 'Baixo Conhecimento', range: '0-40 pontos', color: 'red' },
      { id: 'conhecimento-moderado', label: 'Conhecimento Moderado', range: '41-70 pontos', color: 'yellow' },
      { id: 'alto-conhecimento', label: 'Alto Conhecimento', range: '71-100 pontos', color: 'green' }
    ],
    'guia-nutraceutico': [
      { id: 'baixo-interesse', label: 'Baixo Interesse', range: '0-40 pontos', color: 'red' },
      { id: 'interesse-moderado', label: 'Interesse Moderado', range: '41-70 pontos', color: 'yellow' },
      { id: 'alto-interesse', label: 'Alto Interesse', range: '71-100 pontos', color: 'green' }
    ],
    'guia-proteico': [
      { id: 'baixa-proteina', label: 'Baixa Proteína', range: '< 0.8g/kg', color: 'blue' },
      { id: 'proteina-moderada', label: 'Proteína Moderada', range: '0.8-1.2g/kg', color: 'green' },
      { id: 'alta-proteina', label: 'Alta Proteína', range: '> 1.2g/kg', color: 'yellow' }
    ],
    'tabela-comparativa': [
      { id: 'comparacao-basica', label: 'Comparação Básica', range: 'Produtos essenciais', color: 'blue' },
      { id: 'comparacao-avancada', label: 'Comparação Avançada', range: 'Produtos especializados', color: 'green' },
      { id: 'comparacao-premium', label: 'Comparação Premium', range: 'Produtos de elite', color: 'yellow' }
    ],
    'tabela-substituicoes': [
      { id: 'substituicoes-basicas', label: 'Substituições Básicas', range: 'Alternativas simples', color: 'blue' },
      { id: 'substituicoes-avancadas', label: 'Substituições Avançadas', range: 'Alternativas especializadas', color: 'green' },
      { id: 'substituicoes-premium', label: 'Substituições Premium', range: 'Alternativas de elite', color: 'yellow' }
    ],
    'tabela-sintomas': [
      { id: 'sintomas-leves', label: 'Sintomas Leves', range: '1-3 sintomas', color: 'green' },
      { id: 'sintomas-moderados', label: 'Sintomas Moderados', range: '4-6 sintomas', color: 'yellow' },
      { id: 'sintomas-graves', label: 'Sintomas Graves', range: '7+ sintomas', color: 'red' }
    ],
    'plano-alimentar-base': [
      { id: 'plano-basico', label: 'Plano Básico', range: 'Alimentação equilibrada', color: 'blue' },
      { id: 'plano-avancado', label: 'Plano Avançado', range: 'Alimentação especializada', color: 'green' },
      { id: 'plano-premium', label: 'Plano Premium', range: 'Alimentação de elite', color: 'yellow' }
    ],
    'planner-refeicoes': [
      { id: 'planner-simples', label: 'Planner Simples', range: 'Organização básica', color: 'blue' },
      { id: 'planner-avancado', label: 'Planner Avançado', range: 'Organização especializada', color: 'green' },
      { id: 'planner-premium', label: 'Planner Premium', range: 'Organização de elite', color: 'yellow' }
    ],
    'rastreador-alimentar': [
      { id: 'rastreamento-basico', label: 'Rastreamento Básico', range: 'Padrões simples', color: 'blue' },
      { id: 'rastreamento-avancado', label: 'Rastreamento Avançado', range: 'Padrões complexos', color: 'green' },
      { id: 'rastreamento-premium', label: 'Rastreamento Premium', range: 'Padrões de elite', color: 'yellow' }
    ],
    'diario-alimentar': [
      { id: 'diario-basico', label: 'Diário Básico', range: 'Registro simples', color: 'blue' },
      { id: 'diario-avancado', label: 'Diário Avançado', range: 'Registro detalhado', color: 'green' },
      { id: 'diario-premium', label: 'Diário Premium', range: 'Registro profissional', color: 'yellow' }
    ]
  }
  
  return categoriasMap[ferramentaId] || categoriasMap['calculadora-imc']
}

const profissoes = [
  { id: 'nutri', label: 'Nutricionista', icon: '🥗', color: 'green' },
  { id: 'sales', label: 'Consultor Nutra', icon: '💊', color: 'blue' },
  { id: 'coach', label: 'Coach de Bem-estar', icon: '🧘‍♀️', color: 'purple' }
]

export default function AdminDiagnosticos() {
  const [profissaoSelecionada, setProfissaoSelecionada] = useState<'nutri' | 'sales' | 'coach'>('nutri')
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState<string>('calculadora-imc')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('baixoPeso')

  // Filtrar ferramentas por profissão
  const ferramentasFiltradas = ferramentasYLADA.filter(ferramenta => {
    if (profissaoSelecionada === 'nutri') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico'].includes(ferramenta.categoria)
    } else if (profissaoSelecionada === 'sales') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico', 'Recrutamento', 'Duplicação', 'Gestão', 'Fidelização', 'Retenção', 'Relacionamento'].includes(ferramenta.categoria)
    } else if (profissaoSelecionada === 'coach') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico'].includes(ferramenta.categoria)
    }
    return true
  })

  // Obter categorias dinâmicas baseadas na ferramenta
  const categoriasAtuais = getCategoriasPorFerramenta(ferramentaSelecionada)

  // Obter diagnósticos dinâmicos baseados na ferramenta e profissão
  const diagnosticosAtuais = (diagnosticosCompletos as any)[ferramentaSelecionada]?.[profissaoSelecionada]?.[categoriaSelecionada] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/pt/templates-environment">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <div className="text-sm text-gray-600">
            Área Administrativa - Diagnósticos
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              📊 Diagnósticos por Profissão
            </h1>
            <p className="text-gray-600">
              Visualize todas as respostas padrão da Calculadora de IMC por profissão e categoria
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Seleção de Profissão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                <select
                  value={profissaoSelecionada}
                  onChange={(e) => setProfissaoSelecionada(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {profissoes.map((profissao) => (
                    <option key={profissao.id} value={profissao.id}>
                      {profissao.icon} {profissao.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção de Ferramenta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ferramenta ({ferramentasFiltradas.length} disponíveis)
                </label>
                <select
                  value={ferramentaSelecionada}
                  onChange={(e) => setFerramentaSelecionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {ferramentasFiltradas.map((ferramenta) => (
                    <option key={ferramenta.id} value={ferramenta.id}>
                      {ferramenta.icon} {ferramenta.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção de Categoria/Resultado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultado/Categoria
                </label>
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {categoriasAtuais.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.label} ({categoria.range})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Informações dos Filtros */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">
                  <strong>Profissão:</strong> {profissoes.find(p => p.id === profissaoSelecionada)?.label}
                </span>
                <span className="text-blue-800">
                  <strong>Ferramenta:</strong> {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome}
                </span>
                <span className="text-blue-800">
                  <strong>Categoria:</strong> {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Diagnósticos para {profissoes.find(p => p.id === profissaoSelecionada)?.label} - {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome} - {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label}
              </h2>
              <div className="text-sm text-gray-500">
                {diagnosticosAtuais.length} recomendações
              </div>
            </div>

            {/* Lista de Diagnósticos */}
            <div className="space-y-3">
                {diagnosticosAtuais.map((diagnostico: string, index: number) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 mr-3 mt-1 font-bold">
                    {index + 1}.
                  </span>
                  <span className="text-gray-800 flex-1">
                    {diagnostico}
                  </span>
                </div>
              ))}
            </div>

            {/* Informações Adicionais */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Categoria</h3>
                <p className="text-blue-800 text-sm">
                  {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label} 
                  ({categoriasAtuais.find(c => c.id === categoriaSelecionada)?.range})
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">👨‍⚕️ Profissão</h3>
                <p className="text-green-800 text-sm">
                  {profissoes.find(p => p.id === profissaoSelecionada)?.label}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🛠️ Ferramenta</h3>
                <p className="text-purple-800 text-sm">
                  {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome}
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">📝 Total</h3>
                <p className="text-orange-800 text-sm">
                  {diagnosticosAtuais.length} recomendações específicas
                </p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="mt-8 flex justify-center">
            <Link 
              href="/calculadora-imc"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              🧪 Testar Calculadora de IMC
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Área Administrativa YLADA
            </p>
            <p className="text-gray-500 text-xs">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
