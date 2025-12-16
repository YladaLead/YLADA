'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NutriLandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  const openWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20tirar%20dúvidas%20sobre%20o%20YLADA%20Nutri', '_blank')
  }

  const handleCheckout = async (planType: 'annual' | 'monthly') => {
    const response = await fetch('/api/nutri/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        planType,
        productType: planType === 'annual' ? 'platform_annual' : 'platform_monthly',
        paymentMethod: 'auto'
      })
    })
    const data = await response.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={133}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>
        </div>
      </header>

      <main>
        {/* BLOCO 1 — HERO (DOBRA INICIAL | RUPTURA + IDENTIDADE) */}
        <section className="bg-gradient-to-br from-[#0B57FF] to-[#2572FF] text-white pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight">
                Você não precisa ser só Nutricionista.
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Você precisa se tornar uma Nutri-Empresária.
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 sm:mb-12 max-w-3xl mx-auto">
                O sistema que guia nutricionistas a construir uma carreira organizada, lucrativa e segura — sem depender de indicação, sorte ou tentativa e erro.
              </p>
              
              <Link
                href="#oferta"
                className="inline-block bg-white text-[#0B57FF] px-8 sm:px-12 py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Quero me tornar uma Nutri-Empresária
              </Link>
            </div>
          </div>
        </section>

        {/* BLOCO 2 — ESPELHO EMOCIONAL PROFUNDO (DOR REAL) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Você já se sentiu assim?
              </h2>
              
              <div className="space-y-6 text-lg sm:text-xl text-gray-700 leading-relaxed">
                <p>
                  Você olha para sua agenda e vê mais dias vazios do que preenchidos. Ou então, quando consegue uma consulta, fica na dúvida: <strong>"Quanto devo cobrar? Será que estou pedindo demais?"</strong>
                </p>
                
                <p>
                  Você passa horas criando conteúdo para Instagram, posta com frequência, mas parece que ninguém vê. Os likes até aparecem, mas as mensagens de <strong>"quanto custa uma consulta?"</strong> não chegam.
                </p>
                
                <p>
                  Você já perdeu a conta de quantas vezes começou a organizar seus processos. Comprou planilhas, baixou apps, tentou criar rotinas. Mas sempre volta ao mesmo lugar: <strong>desorganizada, sem clareza, sentindo que está "recomeçando" mais uma vez.</strong>
                </p>
                
                <p>
                  Você se sente sozinha. Não tem com quem dividir as dúvidas empresariais. As colegas da faculdade também estão tentando descobrir como fazer dar certo. Os grupos de WhatsApp são mais desabafos do que soluções.
                </p>
                
                <p>
                  Você sabe que é uma excelente profissional. Sabe que tem conhecimento técnico. Mas algo não encaixa quando o assunto é <strong>transformar esse conhecimento em um negócio que funcione de verdade.</strong>
                </p>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Se você se reconheceu em pelo menos uma dessas situações, continue lendo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 3 — QUEBRA DE CULPA (ALÍVIO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#1A1A1A]">
                O problema não é você. O problema é que ninguém te ensinou a ser empresária.
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-8">
                <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed">
                  Você passou anos estudando nutrição. Aprendeu bioquímica, fisiologia, patologia. Aprendeu a fazer anamnese, calcular dietas, interpretar exames.
                </p>
                
                <p className="text-lg sm:text-xl text-gray-700 mb-6 font-semibold">
                  Mas ninguém te ensinou como:
                </p>
                
                <ul className="space-y-3 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span>Captar clientes de forma previsível</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span>Organizar seu negócio para crescer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span>Cobrar o valor que você realmente vale</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span>Criar processos que funcionem sem você precisar estar presente o tempo todo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span>Transformar conhecimento técnico em um negócio lucrativo</span>
                  </li>
                </ul>
                
                <p className="text-lg sm:text-xl text-gray-700 font-semibold mb-6">
                  Isso não é culpa sua. Isso é uma lacuna do sistema.
                </p>
                
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                  Você não está sozinha nessa. Milhares de nutricionistas talentosas passam pela mesma frustração. A diferença entre quem consegue construir uma carreira sólida e quem fica presa no ciclo de "tentativa e erro" não é talento. <strong>É método.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 4 — O INIMIGO INVISÍVEL (FACULDADE + MERCADO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O que a faculdade te ensinou, e o que ela não te ensinou
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-[#E9F1FF] rounded-xl p-8 border-2 border-[#0B57FF]">
                  <h3 className="text-2xl font-bold mb-6 text-[#0B57FF]">O Que a Faculdade Ensinou</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    A faculdade te preparou para ser uma excelente nutricionista clínica. Você aprendeu:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Como avaliar um paciente</li>
                    <li>• Como calcular necessidades nutricionais</li>
                    <li>• Como prescrever dietas personalizadas</li>
                    <li>• Como interpretar exames laboratoriais</li>
                    <li>• Como acompanhar evolução clínica</li>
                  </ul>
                  <p className="text-lg font-semibold text-gray-700 mt-6">
                    Isso é fundamental. E você domina.
                  </p>
                </div>
                
                <div className="bg-[#FFF4E6] rounded-xl p-8 border-2 border-[#FF9800]">
                  <h3 className="text-2xl font-bold mb-6 text-[#FF9800]">O Que a Faculdade Não Ensinou</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Mas a faculdade não te preparou para:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Construir um negócio do zero</li>
                    <li>• Captar clientes de forma consistente</li>
                    <li>• Organizar processos empresariais</li>
                    <li>• Definir estratégias de precificação</li>
                    <li>• Criar sistemas que funcionem sem você</li>
                    <li>• Transformar conhecimento em receita recorrente</li>
                  </ul>
                  <p className="text-lg font-semibold text-gray-700 mt-6">
                    Isso não é culpa da faculdade. Ela cumpre seu papel: formar profissionais técnicos.
                  </p>
                </div>
              </div>
              
              <div className="bg-[#0B57FF] rounded-xl p-8 text-center text-white">
                <p className="text-xl sm:text-2xl font-bold mb-4">
                  O mercado exige que você seja duas coisas ao mesmo tempo:
                </p>
                <div className="space-y-2 text-lg">
                  <p>1. <strong>Nutricionista técnica</strong> (isso você já é)</p>
                  <p>2. <strong>Empresária estratégica</strong> (isso ninguém te ensinou)</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold mt-6">
                  É aqui que nasce a necessidade da Nutri-Empresária.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 5 — NASCE A NUTRI-EMPRESÁRIA (MOVIMENTO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Nasce a Nutri-Empresária
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-8">
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                  A Nutri-Empresária é a nutricionista que entende que seu negócio precisa de método, não apenas de talento.
                </p>
                
                <div className="space-y-4 text-lg text-gray-700 mb-8">
                  <p>Ela não depende de sorte, indicação ou "viralizar" no Instagram. <strong>Ela constrói sistemas que funcionam.</strong></p>
                  <p>Ela não trabalha na base da tentativa e erro. <strong>Ela segue um caminho claro, passo a passo.</strong></p>
                  <p>Ela não fica presa na rotina de "atender e esperar". <strong>Ela cria processos de captação, gestão e acompanhamento que funcionam de forma previsível.</strong></p>
                  <p>Ela não se sente sozinha. <strong>Ela tem clareza, método e suporte.</strong></p>
                </div>
              </div>
              
              {/* Tabela Comparativa */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 overflow-x-auto">
                <h3 className="text-2xl font-bold mb-6 text-center text-[#1A1A1A]">
                  Nutri Tradicional × Nutri-Empresária
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-[#FF4F4F]">Nutri Tradicional</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Depende de indicação</li>
                      <li>• Agenda inconsistente</li>
                      <li>• Insegurança para cobrar</li>
                      <li>• Trabalha na base do "improviso"</li>
                      <li>• Sensação de estar sempre "recomeçando"</li>
                      <li>• Solidão profissional</li>
                      <li>• Conhecimento técnico apenas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-4 text-[#29CC6A]">Nutri-Empresária</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Cria sistemas de captação</li>
                      <li>• Agenda organizada e previsível</li>
                      <li>• Clareza de valor e precificação</li>
                      <li>• Segue processos definidos</li>
                      <li>• Crescimento contínuo e organizado</li>
                      <li>• Suporte e mentoria estratégica</li>
                      <li>• Conhecimento técnico + mentalidade empresarial</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#0B57FF] to-[#2572FF] rounded-xl p-8 text-center text-white">
                <p className="text-xl sm:text-2xl font-bold mb-4">
                  A Nutri-Empresária não é um título que você ganha.
                </p>
                <p className="text-xl sm:text-2xl font-bold mb-4">
                  É uma identidade que você constrói.
                </p>
                <p className="text-lg mt-6">
                  É isso que você quer ser?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 6 — APRESENTAÇÃO DO YLADA NUTRI (SOLUÇÃO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O que é o YLADA Nutri?
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-8 border-2 border-[#0B57FF]">
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                  O YLADA Nutri não é apenas uma plataforma. É um sistema completo de transformação profissional.
                </p>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  É o método que guia nutricionistas a se tornarem Nutri-Empresárias organizadas, confiantes e lucrativas.
                </p>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Não é um curso que você assiste e esquece. Não é uma ferramenta que você usa e não sabe por quê. É um sistema integrado que conecta:
                </p>
                
                <ul className="space-y-3 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span><strong>Formação empresarial</strong> (método, mentalidade, estratégia)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span><strong>Ferramentas profissionais</strong> (captação, gestão, acompanhamento)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span><strong>Mentoria estratégica</strong> (LYA, sua mentora digital)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#0B57FF] mr-3 text-xl font-bold">•</span>
                    <span><strong>Comunidade e suporte</strong> (você não está sozinha)</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#E9F1FF] rounded-xl p-8 border-2 border-[#0B57FF]">
                  <h3 className="text-2xl font-bold mb-6 text-[#0B57FF]">Para Quem É</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Querem construir uma carreira organizada e lucrativa</li>
                    <li>• Estão cansadas de depender de sorte ou indicação</li>
                    <li>• Desejam ter clareza sobre como crescer profissionalmente</li>
                    <li>• Buscam um método, não apenas ferramentas</li>
                    <li>• Querem transformar conhecimento técnico em negócio que funciona</li>
                  </ul>
                </div>
                
                <div className="bg-[#FFF4E6] rounded-xl p-8 border-2 border-[#FF9800]">
                  <h3 className="text-2xl font-bold mb-6 text-[#FF9800]">Para Quem NÃO É</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Estão procurando apenas "ferramentas gratuitas"</li>
                    <li>• Não estão dispostas a investir em transformação profissional</li>
                    <li>• Esperam resultados sem seguir um método</li>
                    <li>• Querem soluções mágicas sem trabalho</li>
                    <li>• Não estão abertas a mudar mentalidade e processos</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Se você está pronta para se tornar uma Nutri-Empresária, o YLADA é para você.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 7 — O MÉTODO YLADA (COMO FUNCIONA) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O Método YLADA
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: '1. Captação Previsível',
                    desc: 'Você para de depender de indicação ou sorte. Aprende a criar sistemas de captação que funcionam de forma consistente. Ferramentas como quizzes, formulários e fluxos inteligentes que geram leads qualificados automaticamente.'
                  },
                  {
                    title: '2. Gestão Profissional da Cliente',
                    desc: 'Você organiza todo o ciclo da sua cliente, desde o primeiro contato até o acompanhamento contínuo. Não perde informações, não esquece follow-ups, não trabalha na base do improviso. Tudo fica organizado em um sistema que você controla.'
                  },
                  {
                    title: '3. Estratégia Empresarial Aplicada',
                    desc: 'Você para de "tentar" e começa a "executar com método". Aprende os 5 Pilares do Método YLADA, segue a Jornada de Transformação de 30 dias, aplica o sistema GSAL (Gerar, Servir, Acompanhar, Lucrar). Tudo com clareza e passo a passo.'
                  },
                  {
                    title: '4. Formação da Mentalidade Nutri-Empresária',
                    desc: 'Você muda não apenas o que faz, mas como pensa sobre seu negócio. Desenvolve mentalidade empresarial, clareza estratégica, confiança para tomar decisões. Para de se sentir "só uma nutricionista" e se torna uma profissional que constrói um negócio.'
                  },
                  {
                    title: '5. Mentoria, Suporte e Acompanhamento',
                    desc: 'Você não está sozinha. Tem a LYA como mentora estratégica digital, que guia suas decisões e te ajuda a focar no que realmente importa. Tem acesso a comunidade, materiais, suporte. Cresce com suporte, não na base da tentativa e erro.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-[#0B57FF]">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#1A1A1A]">{item.title}</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      <strong>O que isso muda na sua vida:</strong> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center bg-white rounded-xl shadow-lg p-8">
                <p className="text-lg sm:text-xl text-gray-700 mb-4">
                  Cada ponto responde à pergunta: <strong>"O que isso muda na minha vida?"</strong>
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#0B57FF]">
                  A resposta é sempre: clareza, organização, crescimento e segurança.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 8 — A LYA (MENTORA ESTRATÉGICA) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[#1A1A1A]">
                LYA: Sua Mentora Estratégica
              </h2>
              <p className="text-xl text-center text-gray-600 mb-12">
                Direcionamento diário, clareza de foco e execução prática
              </p>
              
              <div className="bg-gradient-to-br from-[#0B57FF] to-[#2572FF] rounded-xl shadow-lg p-8 sm:p-10 mb-8 text-white">
                <p className="text-xl sm:text-2xl font-bold mb-6">
                  LYA não é "uma IA". LYA é sua mentora estratégica digital.
                </p>
                
                <p className="text-lg mb-6 leading-relaxed">
                  Ela entende seu momento atual, seus objetivos, suas travas. Ela analisa seus dados reais (ferramentas criadas, leads captados, progresso na jornada) e te guia pelo próximo passo certo.
                </p>
                
                <p className="text-lg mb-6 leading-relaxed">
                  LYA não te dá uma lista infinita de opções. Ela te diz: <strong>"Agora, o foco é isso. A ação é essa. Onde aplicar é aqui."</strong>
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#E9F1FF] rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-[#0B57FF]">O Papel Dela na Jornada</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                      <span><strong>Tomar decisões estratégicas</strong> (não apenas operacionais)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                      <span><strong>Manter foco</strong> (não se perder em excesso de informação)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                      <span><strong>Seguir o método</strong> (não voltar para a tentativa e erro)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#0B57FF] mr-3 text-xl">✓</span>
                      <span><strong>Crescer de forma organizada</strong> (passo a passo, com clareza)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-[#0B57FF]">Como Ela Guia</h3>
                  <p className="text-gray-700 mb-4">
                    LYA analisa seu perfil estratégico, progresso real, objetivos e travas, e responde sempre com:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Foco prioritário</strong> (uma única coisa para focar agora)</li>
                    <li>• <strong>Ação recomendada</strong> (1 a 3 ações concretas)</li>
                    <li>• <strong>Onde aplicar</strong> (módulo, fluxo, ferramenta específica)</li>
                    <li>• <strong>Métrica de sucesso</strong> (como validar em 24-72h)</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center bg-white rounded-xl shadow-lg p-8 border-2 border-[#0B57FF]">
                <p className="text-xl sm:text-2xl font-bold text-[#0B57FF]">
                  LYA não é tecnologia. LYA é mentoria estratégica que funciona.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 9 — TRANSFORMAÇÃO (ANTES × DEPOIS) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Transformação Real
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#FF4F4F]/10 rounded-xl p-8 border-2 border-[#FF4F4F]">
                  <h3 className="text-2xl font-bold mb-6 text-[#FF4F4F]">Antes do YLADA, você:</h3>
                  <ul className="space-y-3 text-lg text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Dependia de indicação ou sorte para ter clientes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Tinha agenda inconsistente (muito vazia ou muito cheia, sem controle)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Sentia insegurança para cobrar (não sabia quanto valia seu trabalho)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Postava muito no Instagram, mas gerava pouco resultado real</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Tentava organizar processos, mas sempre voltava à desorganização</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Se sentia sozinha, sem clareza sobre como crescer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Trabalhava na base do improviso e tentativa e erro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Sabia que era boa profissional, mas não conseguia transformar isso em negócio que funciona</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#29CC6A]/10 rounded-xl p-8 border-2 border-[#29CC6A]">
                  <h3 className="text-2xl font-bold mb-6 text-[#29CC6A]">Com o YLADA, você:</h3>
                  <ul className="space-y-3 text-lg text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Cria sistemas de captação que funcionam de forma previsível</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Tem agenda organizada e controle sobre seu negócio</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Tem clareza sobre precificação e valor do seu trabalho</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Usa ferramentas estratégicas que geram leads qualificados</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Segue processos definidos que funcionam sem você precisar improvisar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Tem mentoria estratégica (LYA) e suporte para crescer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Trabalha com método, não na base da tentativa e erro</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Transforma conhecimento técnico em negócio organizado e lucrativo</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  A diferença não é sorte. É método.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 10 — PROVAS SOCIAIS (RESULTADOS REAIS) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Resultados reais de nutricionistas que se tornaram Nutri-Empresárias
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#E9F1FF] rounded-full flex items-center justify-center text-2xl font-bold text-[#0B57FF]">
                      M
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1A1A1A]">Maria Silva</h4>
                      <p className="text-sm text-gray-600">Nutricionista Clínica</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "Antes do YLADA, eu estava sempre desorganizada. Perdia informações de clientes, esquecia follow-ups, trabalhava na base do improviso. Hoje, tenho tudo organizado no sistema. Sei exatamente onde cada cliente está no processo. Minha mente ficou livre para focar no que realmente importa: atender bem."
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#E9F1FF] rounded-full flex items-center justify-center text-2xl font-bold text-[#0B57FF]">
                      A
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1A1A1A]">Ana Costa</h4>
                      <p className="text-sm text-gray-600">Nutricionista Esportiva</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "Minha agenda era um caos. Ou estava vazia demais ou cheia demais, sem controle. Com o YLADA, aprendi a criar sistemas de captação que funcionam. Hoje, tenho agenda organizada e previsível. Não dependo mais de indicação."
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#E9F1FF] rounded-full flex items-center justify-center text-2xl font-bold text-[#0B57FF]">
                      J
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1A1A1A]">Juliana Mendes</h4>
                      <p className="text-sm text-gray-600">Nutricionista Funcional</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "Eu tinha muita insegurança para cobrar. Não sabia quanto valia meu trabalho. Com a formação do YLADA, desenvolvi clareza sobre precificação e valor. Hoje, cobro o que realmente vale e me sinto confiante para isso."
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-[#E9F1FF] rounded-full flex items-center justify-center text-2xl font-bold text-[#0B57FF]">
                      C
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-[#1A1A1A]">Carla Santos</h4>
                      <p className="text-sm text-gray-600">Nutricionista Online</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "Eu estava presa no ciclo de 'tentar e não dar certo'. Comprava planilhas, baixava apps, tentava criar rotinas. Mas sempre voltava ao mesmo lugar. Com o YLADA, finalmente tenho um método que funciona. Estou crescendo de forma organizada, não mais na base da tentativa e erro."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 11 — POR QUE O YLADA ACELERA RESULTADOS */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Por que o YLADA acelera resultados?
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Captação Automática',
                    desc: 'Você para de depender de indicação. Crie quizzes, formulários e fluxos inteligentes que geram leads qualificados automaticamente. Não precisa postar e torcer. Cria sistemas que funcionam.'
                  },
                  {
                    title: 'Organização Total',
                    desc: 'Você para de trabalhar na base do improviso. Organize todo o ciclo da cliente em um sistema integrado. Desde o primeiro contato até o acompanhamento contínuo. Tudo organizado, tudo controlado.'
                  },
                  {
                    title: 'Clareza Empresarial',
                    desc: 'Você para de tentar e começa a executar com método. Siga os 5 Pilares do Método YLADA, complete a Jornada de Transformação de 30 dias, aplique o sistema GSAL. Tudo com clareza e passo a passo.'
                  },
                  {
                    title: 'Comunidade',
                    desc: 'Você para de se sentir sozinha. Faça parte de uma comunidade de Nutri-Empresárias que estão crescendo juntas. Compartilhe experiências, aprenda com outras, tenha suporte.'
                  },
                  {
                    title: 'Suporte Humano',
                    desc: 'Você não está sozinha nessa jornada. Além da LYA (mentora estratégica digital), você tem acesso a suporte humano quando precisar. Não é apenas tecnologia. É suporte real.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                    <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-lg sm:text-xl text-gray-700">
                  Cada benefício acelera seus resultados porque <strong>elimina uma trava que te impede de crescer.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 12 — ANCORAGEM DE VALOR (ANTES DO PREÇO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Quanto custa continuar tentando sozinha?
              </h2>
              
              <div className="space-y-8">
                <div className="bg-[#FFF4E6] rounded-xl p-8 border-2 border-[#FF9800]">
                  <h3 className="text-2xl font-bold mb-4 text-[#FF9800]">Custo de Errar</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Cada mês que você passa sem um método claro é um mês de:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Oportunidades perdidas (clientes que poderiam ter chegado até você)</li>
                    <li>• Frustração acumulada (tentativas que não dão certo)</li>
                    <li>• Tempo desperdiçado (criando processos que não funcionam)</li>
                    <li>• Receita que deixa de entrar (por falta de organização e captação)</li>
                  </ul>
                  <p className="text-lg font-semibold text-gray-700 mt-4">
                    O custo de errar não é apenas financeiro. É emocional também.
                  </p>
                </div>
                
                <div className="bg-[#FFE6E6] rounded-xl p-8 border-2 border-[#FF4F4F]">
                  <h3 className="text-2xl font-bold mb-4 text-[#FF4F4F]">Custo de Continuar Sozinha</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Você já tentou:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Organizar processos (e voltou à desorganização)</li>
                    <li>• Criar sistemas de captação (e não funcionou)</li>
                    <li>• Definir precificação (e ficou na dúvida)</li>
                    <li>• Seguir rotinas (e desistiu)</li>
                  </ul>
                  <p className="text-lg font-semibold text-gray-700 mt-4">
                    Cada tentativa custa tempo, energia e confiança.
                  </p>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-8 border-2 border-[#0B57FF]">
                  <h3 className="text-2xl font-bold mb-4 text-[#0B57FF]">Investir no YLADA não é um gasto. É uma decisão estratégica.</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    É escolher ter:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Método em vez de tentativa e erro</li>
                    <li>• Organização em vez de caos</li>
                    <li>• Clareza em vez de dúvida</li>
                    <li>• Suporte em vez de solidão</li>
                    <li>• Crescimento em vez de estagnação</li>
                  </ul>
                  <p className="text-lg font-semibold text-gray-700 mt-4">
                    O investimento se paga quando você para de perder oportunidades e começa a criar resultados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 13 — OFERTA (ESCOLHA SEU COMPROMISSO) */}
        <section id="oferta" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#0B57FF] to-[#2572FF] relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white">
                Escolha seu nível de compromisso com sua transformação
              </h2>
              
              <p className="text-xl text-center text-white/90 mb-12 max-w-3xl mx-auto">
                <strong>A entrega é a mesma. O que muda é o seu nível de compromisso.</strong>
                <br />
                <br />
                LYA é mentoria estratégica, não curso. É direcionamento diário, clareza de foco e execução prática. É transformar você em uma Nutri-Empresária organizada, confiante e lucrativa.
                <br />
                <br />
                <strong>Você não paga mais por menos recursos. Você paga menos quando se compromete mais.</strong>
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* PLANO ANUAL FIDELIDADE */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-400">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-yellow-400 text-[#1A1A1A] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      ⭐ Mais Escolhido
                    </span>
                    <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Plano Anual Fidelidade</h3>
                    <p className="text-gray-600 mb-4">Compromisso com a própria evolução profissional</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#0B57FF] to-[#2572FF] rounded-xl p-6 mb-6 text-center text-white">
                    <p className="text-3xl sm:text-4xl font-bold mb-2">
                      12× de R$ 197
                    </p>
                    <p className="text-sm opacity-90">Pagamento anual obrigatório</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Você se compromete com sua transformação</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Economia clara ao optar pelo compromisso anual</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Foco total na jornada, sem distrações</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Decisão que reflete seriedade com seu crescimento</span>
                    </li>
                  </ul>
                  
                  <div className="bg-[#E9F1FF] rounded-lg p-4 mb-6 text-sm text-gray-700">
                    <strong>Garantia Incondicional de 7 Dias</strong>
                    <br />
                    Cartão obrigatório na entrada. Se por qualquer motivo você não estiver satisfeita, devolvemos 100% do seu investimento.
                  </div>
                  
                  <button
                    onClick={() => handleCheckout('annual')}
                    className="w-full bg-gradient-to-r from-[#0B57FF] to-[#2572FF] text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-[#2572FF] hover:to-[#0B57FF] transition-all shadow-xl"
                  >
                    Escolher Plano Anual
                  </button>
                </div>
                
                {/* PLANO MENSAL FLEXÍVEL */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-gray-300">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Plano Mensal Flexível</h3>
                    <p className="text-gray-600 mb-4">Flexibilidade para quem prefere testar primeiro</p>
                  </div>
                  
                  <div className="bg-gray-100 rounded-xl p-6 mb-6 text-center">
                    <p className="text-3xl sm:text-4xl font-bold mb-2 text-[#1A1A1A]">
                      R$ 297/mês
                    </p>
                    <p className="text-sm text-gray-600">Sem fidelização — pode cancelar quando quiser</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Flexibilidade total</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Sem compromisso de longo prazo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Ideal para quem quer experimentar antes de se comprometer</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                      <span>Preço maior por optar por flexibilidade</span>
                    </li>
                  </ul>
                  
                  <div className="bg-[#E9F1FF] rounded-lg p-4 mb-6 text-sm text-gray-700">
                    <strong>Garantia Incondicional de 7 Dias</strong>
                    <br />
                    Cartão obrigatório na entrada. Se por qualquer motivo você não estiver satisfeita, devolvemos 100% do seu investimento.
                  </div>
                  
                  <button
                    onClick={() => handleCheckout('monthly')}
                    className="w-full bg-gray-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:bg-gray-700 transition-all shadow-xl"
                  >
                    Escolher Plano Mensal
                  </button>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center text-white">
                <p className="text-xl font-bold mb-4">
                  Mentoria estratégica, não curso.
                </p>
                <p className="text-lg mb-4">
                  LYA não é uma lista de vídeos para assistir. Não é uma plataforma para explorar sozinha. É mentoria estratégica contínua. É direcionamento diário. É clareza sobre o próximo passo certo.
                </p>
                <p className="text-lg font-bold">
                  A entrega é idêntica nos dois planos. A diferença está no seu nível de compromisso com sua própria transformação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 14 — GARANTIA */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#E9F1FF]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-6">🛡️</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#1A1A1A]">
                Garantia Incondicional de 7 Dias — Válida para ambos os planos
              </h2>
              <p className="text-xl mb-4 text-gray-700">
                Cartão obrigatório na entrada. Se por qualquer motivo você não estiver satisfeita com a LYA e a mentoria estratégica, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Por quê? Porque acreditamos no método. E porque queremos que você tenha certeza de que está fazendo a escolha certa.
              </p>
              <p className="text-lg text-gray-600">
                Como funciona: Entre em contato com nosso suporte dentro de 7 dias após a compra. Devolvemos todo o valor, sem questionamentos.
              </p>
              <p className="text-xl font-bold text-[#0B57FF] mt-6">
                Simples assim.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 15 — CTA FINAL (DECISÃO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#0B57FF] to-[#2572FF] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Você não precisa continuar tentando sozinha.
              </h2>
              <p className="text-xl mb-4 text-white/90">
                Você não precisa mais:
              </p>
              <ul className="text-lg mb-6 space-y-2 text-white/80">
                <li>• Depender de sorte ou indicação</li>
                <li>• Trabalhar na base do improviso</li>
                <li>• Se sentir sozinha nessa jornada</li>
                <li>• Perder tempo com tentativas que não funcionam</li>
              </ul>
              <p className="text-xl sm:text-2xl font-bold mb-8 text-white">
                Você pode escolher ter método, clareza e suporte.
              </p>
              <p className="text-xl mb-4 text-white/90">
                Junte-se a centenas de Nutricionistas que já se tornaram Nutri-Empresárias.
              </p>
              <p className="text-lg mb-8 text-white/80">
                Você não está sozinha. Existe um caminho. Existe um método. Existe suporte.
              </p>
              <p className="text-xl font-bold mb-8">
                A transformação começa quando você decide que chegou a hora.
              </p>
              <Link
                href="#oferta"
                className="inline-block bg-white text-[#0B57FF] px-10 py-5 rounded-xl text-xl sm:text-2xl font-bold hover:bg-gray-100 transition-all shadow-2xl"
              >
                Quero me tornar uma Nutri-Empresária agora
              </Link>
              <p className="text-lg mt-8 text-white/80">
                A decisão é sua. O método está pronto. Os resultados esperam por você.
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 16 — FAQ (OBJEÇÕES) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    pergunta: 'Posso cancelar a qualquer momento?',
                    resposta: 'Depende do plano escolhido. Plano Anual Fidelidade: É um compromisso anual. Você paga 12 parcelas de R$ 197, com pagamento anual obrigatório. Não há cancelamento durante o período anual. Plano Mensal Flexível: Sim, você pode cancelar a qualquer momento. Sem fidelização. Você mantém acesso até o final do período pago. A diferença de preço reflete a diferença de compromisso. O plano anual oferece economia para quem está pronta para se comprometer com a transformação completa.'
                  },
                  {
                    pergunta: 'Como funciona o suporte?',
                    resposta: 'Você tem acesso a: LYA (mentora estratégica digital) — disponível 24/7 para orientações estratégicas. Suporte técnico — para dúvidas sobre uso da plataforma. Comunidade — para trocar experiências com outras Nutri-Empresárias.'
                  },
                  {
                    pergunta: 'Qual a diferença entre os planos?',
                    resposta: 'A entrega é idêntica nos dois planos. Ambos incluem acesso completo à LYA e toda a mentoria estratégica. A diferença está no nível de compromisso: Plano Anual Fidelidade (12x R$ 197): Para quem está pronta para se comprometer com a transformação completa. Pagamento anual obrigatório. Economia clara. Plano Mensal Flexível (R$ 297/mês): Para quem prefere flexibilidade. Sem fidelização. Pode cancelar quando quiser. Preço maior por optar por flexibilidade. Você não paga mais por menos recursos. Você paga menos quando se compromete mais.'
                  },
                  {
                    pergunta: 'Para quem é o YLADA Nutri?',
                    resposta: 'O YLADA Nutri é para nutricionistas que: Querem construir uma carreira organizada e lucrativa. Estão cansadas de depender de sorte ou indicação. Desejam ter clareza sobre como crescer profissionalmente. Buscam um método, não apenas ferramentas. Estão prontas para investir em transformação profissional. Se você se identificou, o YLADA é para você.'
                  },
                  {
                    pergunta: 'Quanto tempo leva para ver resultados?',
                    resposta: 'Os primeiros resultados aparecem nas primeiras semanas, quando você começa a organizar seus processos e criar suas primeiras ferramentas de captação. A transformação completa acontece ao longo de 3 a 6 meses, quando você aplica o método com consistência e desenvolve a mentalidade de Nutri-Empresária. O importante não é velocidade. É consistência e método.'
                  },
                  {
                    pergunta: 'Preciso ter conhecimento técnico avançado?',
                    resposta: 'Não. O YLADA Nutri não ensina nutrição clínica (isso você já sabe). Ele ensina como transformar seu conhecimento técnico em um negócio que funciona. Você não precisa de conhecimento avançado em tecnologia, marketing ou gestão. O método te guia passo a passo.'
                  },
                  {
                    pergunta: 'E se eu não usar todas as ferramentas?',
                    resposta: 'Tudo bem. O YLADA não é sobre usar tudo. É sobre usar o que você precisa, quando precisa. A LYA te ajuda a focar no que é prioritário para o seu momento atual. Você não precisa usar todas as ferramentas. Precisa usar as ferramentas certas, no momento certo. O método te guia. Você não precisa descobrir sozinha.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-[#1A1A1A] pr-4">{item.pergunta}</span>
                      <span className="text-[#0B57FF] text-2xl flex-shrink-0">
                        {faqOpen === index ? '−' : '+'}
                      </span>
                    </button>
                    {faqOpen === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.resposta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Botão flutuante fixo - WhatsApp */}
      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#0B57FF] to-[#2572FF] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-2xl hover:from-[#2572FF] hover:to-[#0B57FF] transition-all flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base"
        style={{ bottom: '80px' }}
      >
        <span className="text-xl sm:text-2xl">💬</span>
        <span>Tirar dúvida com uma consultora</span>
      </button>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="YLADA Nutri"
                width={133}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              YLADA Nutricionista — Your Leading Advanced Data Assistant
            </p>
            <p className="text-gray-500 text-xs text-center mb-2">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-xs text-center">
              Portal Solutions Tech & Innovation LTDA
            </p>
            <p className="text-gray-400 text-xs text-center">
              CNPJ: 63.447.492/0001-88
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
