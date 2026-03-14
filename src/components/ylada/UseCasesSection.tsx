/**
 * Seção "Casos de Uso" para landing pages de profissionais.
 * Mostra 3 situações reais onde o profissional usaria o YLADA.
 * Aumenta conversão ao fazer o visitante pensar: "Eu usaria assim no meu dia."
 */

import type { Language } from '@/lib/i18n'

export type UseCasesArea =
  | 'med'
  | 'psi'
  | 'odonto'
  | 'nutri'
  | 'estetica'
  | 'fitness'
  | 'coach'
  | 'seller'
  | 'nutra'
  | 'perfumaria'

const CONFIG: Record<
  UseCasesArea,
  {
    title: string
    subtitle: string
    card1Title: string
    card1Text: string
    card2Text: string
    card3Text: string
  }
> = {
  med: {
    title: 'Como médicos usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com pacientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O médico compartilha uma avaliação rápida. O paciente responde antes do contato. Quando a conversa começa, o médico já entende sintomas e preocupações iniciais.',
    card2Text: 'O médico publica o link da avaliação. Pacientes curiosos respondem. Quem realmente precisa de orientação acaba iniciando uma conversa.',
    card3Text: 'Quando alguém pede orientação, o médico envia a avaliação. Isso ajuda o paciente a refletir e iniciar uma conversa mais organizada.',
  },
  psi: {
    title: 'Como psicólogos usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O psicólogo compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende sintomas, interesses ou preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o profissional envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  odonto: {
    title: 'Como dentistas usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com pacientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O dentista compartilha uma avaliação rápida. O paciente responde antes do contato. Quando a conversa começa, o profissional já entende sintomas e preocupações iniciais.',
    card2Text: 'O dentista publica o link da avaliação. Pacientes curiosos respondem. Quem realmente precisa de orientação acaba iniciando uma conversa.',
    card3Text: 'Quando alguém pede orientação, o dentista envia a avaliação. Isso ajuda o paciente a refletir e iniciar uma conversa mais organizada.',
  },
  nutri: {
    title: 'Como nutricionistas usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com pacientes.',
    card1Title: 'Antes da primeira consulta',
    card1Text: 'O nutricionista compartilha uma avaliação rápida. O paciente responde antes do contato. Quando a conversa começa, o profissional já entende sintomas, interesses ou preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o nutricionista envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  estetica: {
    title: 'Como profissionais de estética usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes do primeiro atendimento',
    card1Text: 'O profissional compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende interesses e preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o profissional envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  fitness: {
    title: 'Como profissionais de fitness usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com alunos.',
    card1Title: 'Antes da primeira aula',
    card1Text: 'O profissional compartilha uma avaliação rápida. O aluno responde antes do contato. Quando a conversa começa, o profissional já entende objetivos e preocupações.',
    card2Text: 'O profissional publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o profissional envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  coach: {
    title: 'Como coaches usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes da primeira sessão',
    card1Text: 'O coach compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende interesses e preocupações.',
    card2Text: 'O coach publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o coach envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  seller: {
    title: 'Como vendedores usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes do primeiro contato',
    card1Text: 'O vendedor compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende necessidades e interesses.',
    card2Text: 'O vendedor publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o vendedor envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
  nutra: {
    title: 'Como consultores de suplementos e nutraceuticos usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes do primeiro contato',
    card1Text: 'Você compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, você já entende necessidades, objetivos e pode indicar as melhores opções.',
    card2Text: 'Você publica o link da avaliação. Clientes curiosos respondem. Quem realmente tem interesse acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, você envia a avaliação. Isso ajuda o cliente a refletir e iniciar uma conversa mais qualificada.',
  },
  perfumaria: {
    title: 'Como consultores de perfumaria usam o YLADA no dia a dia',
    subtitle: 'Avaliações simples que ajudam a iniciar conversas mais claras com clientes.',
    card1Title: 'Antes do primeiro atendimento',
    card1Text: 'O consultor compartilha uma avaliação rápida. O cliente responde antes do contato. Quando a conversa começa, o profissional já entende preferências e necessidades.',
    card2Text: 'O consultor publica o link da avaliação. Pessoas curiosas respondem. Quem realmente precisa de ajuda acaba iniciando conversa.',
    card3Text: 'Quando alguém pede orientação, o consultor envia a avaliação. Isso ajuda a organizar a conversa desde o início.',
  },
}

const CONFIG_EN: Record<UseCasesArea, { title: string; subtitle: string; card1Title: string; card1Text: string; card2Text: string; card3Text: string }> = {
  med: { title: 'How doctors use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with patients.', card1Title: 'Before the first consultation', card1Text: 'The doctor shares a quick assessment. The patient responds before contact. When the conversation starts, the doctor already understands symptoms and initial concerns.', card2Text: 'The doctor publishes the assessment link. Curious patients respond. Those who really need guidance end up starting a conversation.', card3Text: 'When someone asks for guidance, the doctor sends the assessment. This helps the patient reflect and start a more organized conversation.' },
  psi: { title: 'How psychologists use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with clients.', card1Title: 'Before the first consultation', card1Text: 'The psychologist shares a quick assessment. The client responds before contact. When the conversation starts, the professional already understands symptoms, interests or concerns.', card2Text: 'The professional publishes the assessment link. Curious people respond. Those who really need help end up starting a conversation.', card3Text: 'When someone asks for guidance, the professional sends the assessment. This helps organize the conversation from the start.' },
  odonto: { title: 'How dentists use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with patients.', card1Title: 'Before the first consultation', card1Text: 'The dentist shares a quick assessment. The patient responds before contact. When the conversation starts, the professional already understands symptoms and initial concerns.', card2Text: 'The dentist publishes the assessment link. Curious patients respond. Those who really need guidance end up starting a conversation.', card3Text: 'When someone asks for guidance, the dentist sends the assessment. This helps the patient reflect and start a more organized conversation.' },
  nutri: { title: 'How nutritionists use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with patients.', card1Title: 'Before the first consultation', card1Text: 'The nutritionist shares a quick assessment. The patient responds before contact. When the conversation starts, the professional already understands symptoms, interests or concerns.', card2Text: 'The professional publishes the assessment link. Curious people respond. Those who really need help end up starting a conversation.', card3Text: 'When someone asks for guidance, the nutritionist sends the assessment. This helps organize the conversation from the start.' },
  estetica: { title: 'How aesthetics professionals use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with clients.', card1Title: 'Before the first appointment', card1Text: 'The professional shares a quick assessment. The client responds before contact. When the conversation starts, the professional already understands interests and concerns.', card2Text: 'The professional publishes the assessment link. Curious people respond. Those who really need help end up starting a conversation.', card3Text: 'When someone asks for guidance, the professional sends the assessment. This helps organize the conversation from the start.' },
  fitness: { title: 'How fitness professionals use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with students.', card1Title: 'Before the first class', card1Text: 'The professional shares a quick assessment. The student responds before contact. When the conversation starts, the professional already understands goals and concerns.', card2Text: 'The professional publishes the assessment link. Curious people respond. Those who really need help end up starting a conversation.', card3Text: 'When someone asks for guidance, the professional sends the assessment. This helps organize the conversation from the start.' },
  coach: { title: 'How coaches use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with clients.', card1Title: 'Before the first session', card1Text: 'The coach shares a quick assessment. The client responds before contact. When the conversation starts, the professional already understands interests and concerns.', card2Text: 'The coach publishes the assessment link. Curious people respond. Those who really need help end up starting a conversation.', card3Text: 'When someone asks for guidance, the coach sends the assessment. This helps organize the conversation from the start.' },
  seller: { title: 'How salespeople use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with clients.', card1Title: 'Before the first contact', card1Text: 'The salesperson shares a quick assessment. The client responds before contact. When the conversation starts, the professional already understands needs and interests.', card2Text: 'The salesperson publishes the assessment link. Curious people respond. Those who really need help end up starting a conversation.', card3Text: 'When someone asks for guidance, the salesperson sends the assessment. This helps organize the conversation from the start.' },
  nutra: { title: 'How supplement and nutraceutical consultants use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with clients.', card1Title: 'Before the first contact', card1Text: 'You share a quick assessment. The client responds before contact. When the conversation starts, you already understand needs, goals and can recommend the best options.', card2Text: 'You publish the assessment link. Curious clients respond. Those who really have interest end up starting a conversation.', card3Text: 'When someone asks for guidance, you send the assessment. This helps the client reflect and start a more qualified conversation.' },
  perfumaria: { title: 'How perfumery consultants use YLADA in their daily practice', subtitle: 'Simple assessments that help start clearer conversations with clients.', card1Title: 'Before the first appointment', card1Text: 'The consultant shares a quick assessment. The client responds before contact. When the conversation starts, the professional already understands preferences and needs.', card2Text: 'The consultant publishes the assessment link. Curious people respond. Those who really need help end up starting a conversation.', card3Text: 'When someone asks for guidance, the consultant sends the assessment. This helps organize the conversation from the start.' },
}

const CONFIG_ES: Record<UseCasesArea, { title: string; subtitle: string; card1Title: string; card1Text: string; card2Text: string; card3Text: string }> = {
  med: { title: 'Cómo los médicos usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con pacientes.', card1Title: 'Antes de la primera consulta', card1Text: 'El médico comparte una evaluación rápida. El paciente responde antes del contacto. Cuando la conversación comienza, el médico ya entiende síntomas y preocupaciones iniciales.', card2Text: 'El médico publica el enlace de la evaluación. Pacientes curiosos responden. Quien realmente necesita orientación termina iniciando una conversación.', card3Text: 'Cuando alguien pide orientación, el médico envía la evaluación. Esto ayuda al paciente a reflexionar e iniciar una conversación más organizada.' },
  psi: { title: 'Cómo los psicólogos usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con clientes.', card1Title: 'Antes de la primera consulta', card1Text: 'El psicólogo comparte una evaluación rápida. El cliente responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende síntomas, intereses o preocupaciones.', card2Text: 'El profesional publica el enlace de la evaluación. Personas curiosas responden. Quien realmente necesita ayuda termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, el profesional envía la evaluación. Esto ayuda a organizar la conversación desde el inicio.' },
  odonto: { title: 'Cómo los dentistas usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con pacientes.', card1Title: 'Antes de la primera consulta', card1Text: 'El dentista comparte una evaluación rápida. El paciente responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende síntomas y preocupaciones iniciales.', card2Text: 'El dentista publica el enlace de la evaluación. Pacientes curiosos responden. Quien realmente necesita orientación termina iniciando una conversación.', card3Text: 'Cuando alguien pide orientación, el dentista envía la evaluación. Esto ayuda al paciente a reflexionar e iniciar una conversación más organizada.' },
  nutri: { title: 'Cómo los nutricionistas usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con pacientes.', card1Title: 'Antes de la primera consulta', card1Text: 'El nutricionista comparte una evaluación rápida. El paciente responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende síntomas, intereses o preocupaciones.', card2Text: 'El profesional publica el enlace de la evaluación. Personas curiosas responden. Quien realmente necesita ayuda termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, el nutricionista envía la evaluación. Esto ayuda a organizar la conversación desde el inicio.' },
  estetica: { title: 'Cómo los profesionales de estética usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con clientes.', card1Title: 'Antes de la primera atención', card1Text: 'El profesional comparte una evaluación rápida. El cliente responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende intereses y preocupaciones.', card2Text: 'El profesional publica el enlace de la evaluación. Personas curiosas responden. Quien realmente necesita ayuda termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, el profesional envía la evaluación. Esto ayuda a organizar la conversación desde el inicio.' },
  fitness: { title: 'Cómo los profesionales de fitness usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con alumnos.', card1Title: 'Antes de la primera clase', card1Text: 'El profesional comparte una evaluación rápida. El alumno responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende objetivos y preocupaciones.', card2Text: 'El profesional publica el enlace de la evaluación. Personas curiosas responden. Quien realmente necesita ayuda termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, el profesional envía la evaluación. Esto ayuda a organizar la conversación desde el inicio.' },
  coach: { title: 'Cómo los coaches usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con clientes.', card1Title: 'Antes de la primera sesión', card1Text: 'El coach comparte una evaluación rápida. El cliente responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende intereses y preocupaciones.', card2Text: 'El coach publica el enlace de la evaluación. Personas curiosas responden. Quien realmente necesita ayuda termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, el coach envía la evaluación. Esto ayuda a organizar la conversación desde el inicio.' },
  seller: { title: 'Cómo los vendedores usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con clientes.', card1Title: 'Antes del primer contacto', card1Text: 'El vendedor comparte una evaluación rápida. El cliente responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende necesidades e intereses.', card2Text: 'El vendedor publica el enlace de la evaluación. Personas curiosas responden. Quien realmente necesita ayuda termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, el vendedor envía la evaluación. Esto ayuda a organizar la conversación desde el inicio.' },
  nutra: { title: 'Cómo los consultores de suplementos y nutracéuticos usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con clientes.', card1Title: 'Antes del primer contacto', card1Text: 'Tú compartes una evaluación rápida. El cliente responde antes del contacto. Cuando la conversación comienza, ya entiendes necesidades, objetivos y puedes recomendar las mejores opciones.', card2Text: 'Tú publicas el enlace de la evaluación. Clientes curiosos responden. Quien realmente tiene interés termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, envías la evaluación. Esto ayuda al cliente a reflexionar e iniciar una conversación más cualificada.' },
  perfumaria: { title: 'Cómo los consultores de perfumería usan YLADA en el día a día', subtitle: 'Evaluaciones simples que ayudan a iniciar conversaciones más claras con clientes.', card1Title: 'Antes de la primera atención', card1Text: 'El consultor comparte una evaluación rápida. El cliente responde antes del contacto. Cuando la conversación comienza, el profesional ya entiende preferencias y necesidades.', card2Text: 'El consultor publica el enlace de la evaluación. Personas curiosas responden. Quien realmente necesita ayuda termina iniciando conversación.', card3Text: 'Cuando alguien pide orientación, el consultor envía la evaluación. Esto ayuda a organizar la conversación desde el inicio.' },
}

const SOCIAL_LABELS = { pt: 'Nas redes sociais', en: 'On social media', es: 'En redes sociales' }
const WHATSAPP_LABELS = { pt: 'No WhatsApp', en: 'On WhatsApp', es: 'En WhatsApp' }

function getConfig(area: UseCasesArea, locale: Language) {
  if (locale === 'en') return CONFIG_EN[area]
  if (locale === 'es') return CONFIG_ES[area]
  return CONFIG[area]
}

type Props = {
  area: UseCasesArea
  locale?: Language
}

export function UseCasesSection({ area, locale = 'pt' }: Props) {
  const c = getConfig(area, locale)
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            {c.title}
          </h2>
          <p className="text-gray-700 text-center mb-10">
            {c.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                {c.card1Title}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {c.card1Text}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                {SOCIAL_LABELS[locale]}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {c.card2Text}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-3">
                {WHATSAPP_LABELS[locale]}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {c.card3Text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
