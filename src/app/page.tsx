'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, Globe, ArrowRight, Users, TrendingUp, Star, Mail, MessageSquare, Shield } from 'lucide-react'

export default function UniversalLandingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt')
  const [showContactForm, setShowContactForm] = useState(false)
  const [projectDomain, setProjectDomain] = useState('')
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    message: ''
  })

  useEffect(() => {
    // Detectar projeto pelo subdomínio
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      
      // Se não é localhost e tem subdomínio válido
      if (!hostname.includes('localhost') && subdomain !== 'www' && subdomain.length > 2) {
        setProjectDomain(subdomain)
      }
    }
  }, [])

  const getProjectName = () => {
    switch (projectDomain) {
      case 'fitlead': return 'FitLead'
      case 'nutri': return 'Nutri'
      case 'beauty': return 'Beauty'
      default: return 'YLADA'
    }
  }

  const handleMainAction = () => {
    if (projectDomain) {
      // Se há um projeto detectado, redirecionar para login
      router.push('/login')
    } else {
      // Se não há projeto, mostrar formulário de contato
      setShowContactForm(true)
    }
  }

  const content = {
    pt: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Gerador de Leads Profissionais',
      heroTitle: 'Transforme Visitantes em Clientes Qualificados',
      heroSubtitle: 'Ferramenta profissional que captura leads automaticamente para qualquer área de atuação',
      ctaButton: 'Saiba Mais',
      benefits: [
        {
          icon: Users,
          title: 'Capture Leads Qualificados',
          description: 'Seus clientes preenchem formulários e você recebe os dados automaticamente'
        },
        {
          icon: TrendingUp,
          title: 'Aumente Suas Vendas',
          description: 'Ferramentas que demonstram sua expertise profissional'
        },
        {
          icon: Star,
          title: 'Diferencial Competitivo',
          description: 'Seja o profissional que oferece avaliações modernas'
        }
      ],
      howItWorks: {
        title: 'Como Funciona',
        steps: [
          {
            step: '1',
            title: 'Configure Suas Ferramentas',
            description: 'Personalize com sua marca e área de atuação'
          },
          {
            step: '2',
            title: 'Compartilhe com Seus Clientes',
            description: 'Envie links das ferramentas para seus prospects'
          },
          {
            step: '3',
            title: 'Receba os Dados Automaticamente',
            description: 'Todos os formulários preenchidos chegam no seu dashboard'
          }
        ]
      },
      whyChoose: {
        title: 'Por que Escolher o YLADA?',
        subtitle: 'Aumente sua credibilidade e gere mais leads com ferramentas profissionais',
        benefits: [
          {
            icon: 'users',
      title: 'Geração de Leads Qualificados',
            description: 'Capture dados de clientes interessados em melhorar sua saúde e bem-estar'
    },
    {
            icon: 'trending',
      title: 'Aumento de Conversões',
            description: 'Ferramentas profissionais aumentam a confiança e conversão de leads'
    },
    {
            icon: 'star',
      title: 'Credibilidade Profissional',
            description: 'Demonstre expertise com ferramentas baseadas em diretrizes da OMS'
    },
    {
            icon: 'shield',
      title: 'Dados Seguros',
            description: 'Sistema seguro para captura e armazenamento de informações dos clientes'
          }
        ]
      },
      socialProof: '+500 profissionais já usam',
      rating: '4.9/5 avaliação',
      footer: '© 2024 YLADA. Todos os direitos reservados.',
      contactForm: {
        title: 'Entre em Contato',
        name: 'Nome Completo',
        email: 'E-mail',
        profession: 'Área de Atuação',
        professionPlaceholder: 'Ex: Nutricionista, Personal Trainer, Coach...',
        message: 'Sua Dúvida ou Interesse',
        messagePlaceholder: 'Conte-nos como podemos ajudar você a gerar mais leads...',
        cancel: 'Cancelar',
        send: 'Enviar',
        contactInfo: 'Entraremos em contato através do e-mail:',
        emailAddress: 'YLADA.LEAD@gmail.com'
      }
    },
    en: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Professional Lead Generator',
      heroTitle: 'Transform Visitors into Qualified Clients',
      heroSubtitle: 'Professional tool that automatically captures leads for any field of work',
      ctaButton: 'Learn More',
      benefits: [
        {
          icon: Users,
          title: 'Capture Qualified Leads',
          description: 'Your clients fill out forms and you receive data automatically'
        },
        {
          icon: TrendingUp,
          title: 'Increase Your Sales',
          description: 'Tools that demonstrate your professional expertise'
        },
        {
          icon: Star,
          title: 'Competitive Advantage',
          description: 'Be the professional who offers modern assessments'
        }
      ],
      howItWorks: {
        title: 'How It Works',
        steps: [
          {
            step: '1',
            title: 'Configure Your Tools',
            description: 'Customize with your brand and field of work'
          },
          {
            step: '2',
            title: 'Share with Your Clients',
            description: 'Send tool links to your prospects'
          },
          {
            step: '3',
            title: 'Receive Data Automatically',
            description: 'All filled forms arrive in your dashboard'
          }
        ]
      },
      whyChoose: {
        title: 'Why Choose YLADA?',
        subtitle: 'Increase your credibility and generate more leads with professional tools',
        benefits: [
          {
            icon: 'users',
            title: 'Qualified Lead Generation',
            description: 'Capture data from clients interested in improving their health and well-being'
          },
          {
            icon: 'trending',
            title: 'Increased Conversions',
            description: 'Professional tools increase confidence and lead conversion'
          },
          {
            icon: 'star',
            title: 'Professional Credibility',
            description: 'Demonstrate expertise with tools based on WHO guidelines'
          },
          {
            icon: 'shield',
            title: 'Secure Data',
            description: 'Secure system for capturing and storing client information'
          }
        ]
      },
      socialProof: '+500 professionals already use',
      rating: '4.9/5 rating',
      footer: '© 2024 YLADA. All rights reserved.',
      contactForm: {
        title: 'Get in Touch',
        name: 'Full Name',
        email: 'Email',
        profession: 'Field of Work',
        professionPlaceholder: 'Ex: Nutritionist, Personal Trainer, Coach...',
        message: 'Your Question or Interest',
        messagePlaceholder: 'Tell us how we can help you generate more leads...',
        cancel: 'Cancel',
        send: 'Send',
        contactInfo: 'We will contact you via email:',
        emailAddress: 'YLADA.LEAD@gmail.com'
      }
    },
    es: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Generador de Leads Profesionales',
      heroTitle: 'Transforma Visitantes en Clientes Calificados',
      heroSubtitle: 'Herramienta profesional que captura leads automáticamente para cualquier área de trabajo',
      ctaButton: 'Saber Más',
      benefits: [
        {
          icon: Users,
          title: 'Captura Leads Calificados',
          description: 'Tus clientes llenan formularios y recibes los datos automáticamente'
        },
        {
          icon: TrendingUp,
          title: 'Aumenta Tus Ventas',
          description: 'Herramientas que demuestran tu experiencia profesional'
        },
        {
          icon: Star,
          title: 'Ventaja Competitiva',
          description: 'Sé el profesional que ofrece evaluaciones modernas'
        }
      ],
      howItWorks: {
        title: 'Cómo Funciona',
        steps: [
          {
            step: '1',
            title: 'Configura Tus Herramientas',
            description: 'Personaliza con tu marca y área de trabajo'
          },
          {
            step: '2',
            title: 'Comparte con Tus Clientes',
            description: 'Envía enlaces de herramientas a tus prospectos'
          },
          {
            step: '3',
            title: 'Recibe Datos Automáticamente',
            description: 'Todos los formularios llenos llegan a tu dashboard'
          }
        ]
      },
      whyChoose: {
        title: '¿Por qué Elegir YLADA?',
        subtitle: 'Aumenta tu credibilidad y genera más leads con herramientas profesionales',
        benefits: [
          {
            icon: 'users',
            title: 'Generación de Leads Calificados',
            description: 'Captura datos de clientes interesados en mejorar su salud y bienestar'
          },
          {
            icon: 'trending',
            title: 'Aumento de Conversiones',
            description: 'Las herramientas profesionales aumentan la confianza y conversión de leads'
          },
          {
            icon: 'star',
            title: 'Credibilidad Profesional',
            description: 'Demuestra experiencia con herramientas basadas en directrices de la OMS'
          },
          {
            icon: 'shield',
            title: 'Datos Seguros',
            description: 'Sistema seguro para capturar y almacenar información de clientes'
          }
        ]
      },
      socialProof: '+500 profesionales ya usan',
      rating: '4.9/5 calificación',
      footer: '© 2024 YLADA. Todos los derechos reservados.',
      contactForm: {
        title: 'Ponte en Contacto',
        name: 'Nombre Completo',
        email: 'Correo Electrónico',
        profession: 'Área de Trabajo',
        professionPlaceholder: 'Ej: Nutricionista, Entrenador Personal, Coach...',
        message: 'Tu Pregunta o Interés',
        messagePlaceholder: 'Cuéntanos cómo podemos ayudarte a generar más leads...',
        cancel: 'Cancelar',
        send: 'Enviar',
        contactInfo: 'Te contactaremos por correo electrónico:',
        emailAddress: 'YLADA.LEAD@gmail.com'
      }
    },
    fr: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Générateur de Leads Professionnels',
      heroTitle: 'Transformez les Visiteurs en Clients Qualifiés',
      heroSubtitle: 'Outil professionnel qui capture automatiquement les leads pour tout domaine de travail',
      ctaButton: 'En Savoir Plus',
      benefits: [
        {
          icon: Users,
          title: 'Capturez des Leads Qualifiés',
          description: 'Vos clients remplissent des formulaires et vous recevez les données automatiquement'
        },
        {
          icon: TrendingUp,
          title: 'Augmentez Vos Ventes',
          description: 'Outils qui démontrent votre expertise professionnelle'
        },
        {
          icon: Star,
          title: 'Avantage Concurrentiel',
          description: 'Soyez le professionnel qui offre des évaluations modernes'
        }
      ],
      howItWorks: {
        title: 'Comment Ça Marche',
        steps: [
          {
            step: '1',
            title: 'Configurez Vos Outils',
            description: 'Personnalisez avec votre marque et domaine de travail'
          },
          {
            step: '2',
            title: 'Partagez avec Vos Clients',
            description: 'Envoyez des liens d\'outils à vos prospects'
          },
          {
            step: '3',
            title: 'Recevez les Données Automatiquement',
            description: 'Tous les formulaires remplis arrivent dans votre tableau de bord'
          }
        ]
      },
      whyChoose: {
        title: 'Pourquoi Choisir YLADA?',
        subtitle: 'Augmentez votre crédibilité et générez plus de leads avec des outils professionnels',
        benefits: [
          {
            icon: 'users',
            title: 'Génération de Leads Qualifiés',
            description: 'Capturez des données de clients intéressés par l\'amélioration de leur santé et bien-être'
          },
          {
            icon: 'trending',
            title: 'Augmentation des Conversions',
            description: 'Les outils professionnels augmentent la confiance et la conversion des leads'
          },
          {
            icon: 'star',
            title: 'Crédibilité Professionnelle',
            description: 'Démontrez votre expertise avec des outils basés sur les directives de l\'OMS'
          },
          {
            icon: 'shield',
            title: 'Données Sécurisées',
            description: 'Système sécurisé pour capturer et stocker les informations des clients'
          }
        ]
      },
      socialProof: '+500 professionnels utilisent déjà',
      rating: '4.9/5 évaluation',
      footer: '© 2024 YLADA. Tous droits réservés.',
      contactForm: {
        title: 'Entrer en Contact',
        name: 'Nom Complet',
        email: 'E-mail',
        profession: 'Domaine de Travail',
        professionPlaceholder: 'Ex: Nutritionniste, Coach Sportif, Coach...',
        message: 'Votre Question ou Intérêt',
        messagePlaceholder: 'Dites-nous comment nous pouvons vous aider à générer plus de leads...',
        cancel: 'Annuler',
        send: 'Envoyer',
        contactInfo: 'Nous vous contacterons par e-mail:',
        emailAddress: 'YLADA.LEAD@gmail.com'
      }
    },
    de: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Professioneller Lead-Generator',
      heroTitle: 'Verwandeln Sie Besucher in Qualifizierte Kunden',
      heroSubtitle: 'Professionelles Tool, das automatisch Leads für jedes Arbeitsfeld erfasst',
      ctaButton: 'Mehr Erfahren',
      benefits: [
        {
          icon: Users,
          title: 'Qualifizierte Leads Erfassen',
          description: 'Ihre Kunden füllen Formulare aus und Sie erhalten die Daten automatisch'
        },
        {
          icon: TrendingUp,
          title: 'Steigern Sie Ihre Verkäufe',
          description: 'Tools, die Ihre professionelle Expertise demonstrieren'
        },
        {
          icon: Star,
          title: 'Wettbewerbsvorteil',
          description: 'Seien Sie der Profi, der moderne Bewertungen anbietet'
        }
      ],
      howItWorks: {
        title: 'Wie Es Funktioniert',
        steps: [
          {
            step: '1',
            title: 'Konfigurieren Sie Ihre Tools',
            description: 'Personalisieren Sie mit Ihrer Marke und Arbeitsbereich'
          },
          {
            step: '2',
            title: 'Teilen Sie mit Ihren Kunden',
            description: 'Senden Sie Tool-Links an Ihre Interessenten'
          },
          {
            step: '3',
            title: 'Erhalten Sie Daten Automatisch',
            description: 'Alle ausgefüllten Formulare kommen in Ihr Dashboard'
          }
        ]
      },
      whyChoose: {
        title: 'Warum YLADA Wählen?',
        subtitle: 'Erhöhen Sie Ihre Glaubwürdigkeit und generieren Sie mehr Leads mit professionellen Tools',
        benefits: [
          {
            icon: 'users',
            title: 'Qualifizierte Lead-Generierung',
            description: 'Erfassen Sie Daten von Kunden, die an der Verbesserung ihrer Gesundheit und ihres Wohlbefindens interessiert sind'
          },
          {
            icon: 'trending',
            title: 'Erhöhte Konversionen',
            description: 'Professionelle Tools erhöhen das Vertrauen und die Lead-Konversion'
          },
          {
            icon: 'star',
            title: 'Professionelle Glaubwürdigkeit',
            description: 'Demonstrieren Sie Expertise mit Tools basierend auf WHO-Richtlinien'
          },
          {
            icon: 'shield',
            title: 'Sichere Daten',
            description: 'Sicheres System zur Erfassung und Speicherung von Kundeninformationen'
          }
        ]
      },
      socialProof: '+500 Fachkräfte nutzen bereits',
      rating: '4.9/5 Bewertung',
      footer: '© 2024 YLADA. Alle Rechte vorbehalten.',
      contactForm: {
        title: 'Kontakt aufnehmen',
        name: 'Vollständiger Name',
        email: 'E-Mail',
        profession: 'Arbeitsbereich',
        professionPlaceholder: 'Z.B: Ernährungsberater, Personal Trainer, Coach...',
        message: 'Ihre Frage oder Ihr Interesse',
        messagePlaceholder: 'Erzählen Sie uns, wie wir Ihnen helfen können, mehr Leads zu generieren...',
        cancel: 'Abbrechen',
        send: 'Senden',
        contactInfo: 'Wir werden Sie per E-Mail kontaktieren:',
        emailAddress: 'YLADA.LEAD@gmail.com'
      }
    },
    it: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Generatore di Lead Professionale',
      heroTitle: 'Trasforma i Visitatori in Clienti Qualificati',
      heroSubtitle: 'Strumento professionale che cattura automaticamente i lead per qualsiasi campo di lavoro',
      ctaButton: 'Scopri di Più',
      benefits: [
        {
          icon: Users,
          title: 'Cattura Lead Qualificati',
          description: 'I tuoi clienti compilano moduli e ricevi i dati automaticamente'
        },
        {
          icon: TrendingUp,
          title: 'Aumenta le Tue Vendite',
          description: 'Strumenti che dimostrano la tua esperienza professionale'
        },
        {
          icon: Star,
          title: 'Vantaggio Competitivo',
          description: 'Sii il professionista che offre valutazioni moderne'
        }
      ],
      howItWorks: {
        title: 'Come Funziona',
        steps: [
          {
            step: '1',
            title: 'Configura i Tuoi Strumenti',
            description: 'Personalizza con il tuo brand e campo di lavoro'
          },
          {
            step: '2',
            title: 'Condividi con i Tuoi Clienti',
            description: 'Invia link degli strumenti ai tuoi prospect'
          },
          {
            step: '3',
            title: 'Ricevi Dati Automaticamente',
            description: 'Tutti i moduli compilati arrivano nella tua dashboard'
          }
        ]
      },
      whyChoose: {
        title: 'Perché Scegliere YLADA?',
        subtitle: 'Aumenta la tua credibilità e genera più lead con strumenti professionali',
        benefits: [
          {
            icon: 'users',
            title: 'Generazione di Lead Qualificati',
            description: 'Cattura dati da clienti interessati a migliorare la loro salute e benessere'
          },
          {
            icon: 'trending',
            title: 'Aumento delle Conversioni',
            description: 'Gli strumenti professionali aumentano la fiducia e la conversione dei lead'
          },
          {
            icon: 'star',
            title: 'Credibilità Professionale',
            description: 'Dimostra competenza con strumenti basati sulle linee guida dell\'OMS'
          },
          {
            icon: 'shield',
            title: 'Dati Sicuri',
            description: 'Sistema sicuro per catturare e memorizzare le informazioni dei clienti'
          }
        ]
      },
      socialProof: '+500 professionisti già utilizzano',
      rating: '4.9/5 valutazione',
      footer: '© 2024 YLADA. Tutti i diritti riservati.',
      contactForm: {
        title: 'Mettiti in Contatto',
        name: 'Nome Completo',
        email: 'E-mail',
        profession: 'Campo di Lavoro',
        professionPlaceholder: 'Es: Nutrizionista, Personal Trainer, Coach...',
        message: 'La Tua Domanda o Interesse',
        messagePlaceholder: 'Raccontaci come possiamo aiutarti a generare più lead...',
        cancel: 'Annulla',
        send: 'Invia',
        contactInfo: 'Ti contatteremo via e-mail:',
        emailAddress: 'YLADA.LEAD@gmail.com'
      }
    }
  }

  const currentContent = content[selectedLanguage as keyof typeof content]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Aqui você pode implementar o envio do e-mail
    // Por enquanto, vamos apenas mostrar um alerta
    alert(`Mensagem enviada! Entraremos em contato em breve através do e-mail: ${formData.email}`)
    
    // Reset do formulário
    setFormData({
      name: '',
      email: '',
      profession: '',
      message: ''
    })
    setShowContactForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Language Selector Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {projectDomain ? getProjectName() : currentContent.title}
                </h1>
                <p className="text-xs text-gray-600">{currentContent.subtitle}</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
              {currentContent.description}
            </span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {currentContent.heroTitle}
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {currentContent.heroSubtitle}
          </p>

          {/* Social Proof */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="ml-3">{currentContent.socialProof}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>{currentContent.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleMainAction}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              {projectDomain ? (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Acessar {getProjectName()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {currentContent.ctaButton}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentContent.benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.howItWorks.title}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentContent.howItWorks.steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h4>
                <p className="text-gray-600">
                  {step.description}
                </p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.whyChoose.title}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {currentContent.whyChoose.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.whyChoose.benefits.map((benefit, index) => {
              const getIcon = (iconName: string) => {
                switch (iconName) {
                  case 'users':
                    return <Users className="w-8 h-8 text-emerald-600" />
                  case 'trending':
                    return <TrendingUp className="w-8 h-8 text-emerald-600" />
                  case 'star':
                    return <Star className="w-8 h-8 text-yellow-600" />
                  case 'shield':
                    return <Shield className="w-8 h-8 text-purple-600" />
                  default:
                    return <Users className="w-8 h-8 text-emerald-600" />
                }
              }

              const getIconBg = (iconName: string) => {
                switch (iconName) {
                  case 'users':
                    return 'bg-emerald-100'
                  case 'trending':
                    return 'bg-emerald-100'
                  case 'star':
                    return 'bg-yellow-100'
                  case 'shield':
                    return 'bg-purple-100'
                  default:
                    return 'bg-emerald-100'
                }
              }

              return (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 ${getIconBg(benefit.icon)} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    {getIcon(benefit.icon)}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{currentContent.contactForm.title}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.contactForm.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.contactForm.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.contactForm.profession}
                </label>
                <input
                  type="text"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  placeholder={currentContent.contactForm.professionPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.contactForm.message}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={currentContent.contactForm.messagePlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {currentContent.contactForm.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {currentContent.contactForm.send}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>{currentContent.contactForm.contactInfo}</p>
              <p className="font-semibold text-emerald-600">{currentContent.contactForm.emailAddress}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold">{currentContent.title}</h4>
            </div>
            <p className="text-gray-400 mb-4">
              {currentContent.subtitle}
            </p>
            <p className="text-sm text-gray-500">
              {currentContent.footer}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}