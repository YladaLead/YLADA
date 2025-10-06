'use client'

import { useState } from 'react'
import { Calculator, Globe, ArrowRight, Users, TrendingUp, Star, CheckCircle } from 'lucide-react'

export default function UniversalLandingPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt')

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ]

  const content = {
    pt: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Gerador de Leads Profissionais para Nutrição e Bem-Estar',
      heroTitle: 'Transforme Visitantes em Clientes Qualificados',
      heroSubtitle: 'Ferramentas profissionais de nutrição que capturam leads automaticamente',
      ctaButton: 'Começar Agora',
      ctaLink: '/fitlead',
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
      socialProof: '+500 profissionais já usam',
      rating: '4.9/5 avaliação',
      guarantee: 'Garantia de 30 dias',
      footer: '© 2024 YLADA. Todos os direitos reservados.'
    },
    en: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Professional Lead Generator for Nutrition and Wellness',
      heroTitle: 'Transform Visitors into Qualified Clients',
      heroSubtitle: 'Professional nutrition tools that automatically capture leads',
      ctaButton: 'Get Started',
      ctaLink: '/fitlead',
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
      socialProof: '+500 professionals already use',
      rating: '4.9/5 rating',
      guarantee: '30-day guarantee',
      footer: '© 2024 YLADA. All rights reserved.'
    },
    es: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Generador de Leads Profesionales para Nutrición y Bienestar',
      heroTitle: 'Transforma Visitantes en Clientes Calificados',
      heroSubtitle: 'Herramientas profesionales de nutrición que capturan leads automáticamente',
      ctaButton: 'Comenzar Ahora',
      ctaLink: '/fitlead',
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
      socialProof: '+500 profesionales ya usan',
      rating: '4.9/5 calificación',
      guarantee: 'Garantía de 30 días',
      footer: '© 2024 YLADA. Todos los derechos reservados.'
    },
    fr: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Générateur de Leads Professionnels pour la Nutrition et le Bien-être',
      heroTitle: 'Transformez les Visiteurs en Clients Qualifiés',
      heroSubtitle: 'Outils professionnels de nutrition qui capturent automatiquement les leads',
      ctaButton: 'Commencer Maintenant',
      ctaLink: '/fitlead',
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
      socialProof: '+500 professionnels utilisent déjà',
      rating: '4.9/5 évaluation',
      guarantee: 'Garantie de 30 jours',
      footer: '© 2024 YLADA. Tous droits réservés.'
    },
    de: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Professioneller Lead-Generator für Ernährung und Wellness',
      heroTitle: 'Verwandeln Sie Besucher in Qualifizierte Kunden',
      heroSubtitle: 'Professionelle Ernährungstools, die automatisch Leads erfassen',
      ctaButton: 'Jetzt Starten',
      ctaLink: '/fitlead',
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
      socialProof: '+500 Fachkräfte nutzen bereits',
      rating: '4.9/5 Bewertung',
      guarantee: '30-Tage-Garantie',
      footer: '© 2024 YLADA. Alle Rechte vorbehalten.'
    },
    it: {
      title: 'YLADA',
      subtitle: 'Your Lead Accelerated Data App',
      description: 'Generatore di Lead Professionale per Nutrizione e Benessere',
      heroTitle: 'Trasforma i Visitatori in Clienti Qualificati',
      heroSubtitle: 'Strumenti professionali di nutrizione che catturano automaticamente i lead',
      ctaButton: 'Inizia Ora',
      ctaLink: '/fitlead',
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
      socialProof: '+500 professionisti già utilizzano',
      rating: '4.9/5 valutazione',
      guarantee: 'Garanzia di 30 giorni',
      footer: '© 2024 YLADA. Tutti i diritti riservati.'
    }
  }

  const currentContent = content[selectedLanguage as keyof typeof content]

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
                <h1 className="text-xl font-bold text-gray-900">{currentContent.title}</h1>
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={currentContent.ctaLink}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              {currentContent.ctaButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
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

      {/* Guarantee Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {currentContent.guarantee}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Teste o YLADA por 30 dias sem compromisso. Se não aumentar suas vendas, 
              devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Pronto para aumentar suas vendas?
          </h3>
          <p className="text-xl text-emerald-100 mb-8">
            Junte-se a mais de 500 profissionais que já transformaram seus negócios
          </p>
          <div className="flex justify-center">
            <a
              href={currentContent.ctaLink}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
            >
              {currentContent.ctaButton}
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

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