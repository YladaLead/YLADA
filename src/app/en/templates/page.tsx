'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function TemplatesPageEN() {
  const { t } = useTranslations('en')
  const [selectedProfession, setSelectedProfession] = useState('all')
  const [selectedObjective, setSelectedObjective] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - shared templates
  const templates = [
    {
      id: 1,
      title: 'Smart BMI Calculator',
      description: 'Calculate and interpret BMI with personalized recommendations',
      objective: 'capture-leads',
      profession: 'nutri',
      icon: '📊',
      color: 'green',
      uses: '8,000+',
      rating: 4.9
    },
    {
      id: 2,
      title: 'Metabolic Profile Quiz',
      description: 'Discover your client\'s metabolic type in minutes',
      objective: 'increase-sales',
      profession: 'nutri',
      icon: '🧬',
      color: 'green',
      uses: '15,000+',
      rating: 4.8
    },
    {
      id: 3,
      title: 'ROI Calculator',
      description: 'Calculate return on marketing investments',
      objective: 'capture-leads',
      profession: 'sales',
      icon: '💰',
      color: 'blue',
      uses: '3,000+',
      rating: 4.7
    },
    {
      id: 4,
      title: 'Product Quiz',
      description: 'Discover the ideal product for each client',
      objective: 'increase-sales',
      profession: 'sales',
      icon: '💊',
      color: 'blue',
      uses: '8,000+',
      rating: 4.9
    },
    {
      id: 5,
      title: 'Wellness Quiz',
      description: 'Discover your client\'s wellness level',
      objective: 'increase-sales',
      profession: 'coach',
      icon: '🧘‍♀️',
      color: 'purple',
      uses: '12,000+',
      rating: 4.8
    },
    {
      id: 6,
      title: 'Growth Checklist',
      description: 'Assess your growth potential and create strategies',
      category: 'checklist',
      profession: 'all',
      icon: '📈',
      color: 'yellow',
      uses: '5,000+',
      rating: 4.6
    }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesProfession = selectedProfession === 'all' || template.profession === selectedProfession || template.profession === 'all'
    const matchesObjective = selectedObjective === 'all' || template.objective === selectedObjective
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesProfession && matchesObjective && matchesSearch
  })

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 text-green-700 border-green-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
    return colors[color as keyof typeof colors] || colors.green
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/en">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-6xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t.templates.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.templates.subtitle}
          </p>

          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/en"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to main page
            </Link>
          </div>
        </div>

        {/* Smart Filters */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Smart Filters
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Profession Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.templates.filters.profession}
              </label>
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.templates.professions.all}</option>
                <option value="nutri">{t.templates.professions.nutri}</option>
                <option value="sales">{t.templates.professions.sales}</option>
                <option value="coach">{t.templates.professions.coach}</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.templates.filters.objective}
              </label>
              <select
                value={selectedObjective}
                onChange={(e) => setSelectedObjective(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t.templates.objectives.all}</option>
                <option value="attract-contacts">{t.templates.objectives.attractContacts}</option>
                <option value="convert-sales">{t.templates.objectives.convertSales}</option>
                <option value="engage-clients">{t.templates.objectives.engageClients}</option>
                <option value="generate-authority">{t.templates.objectives.generateAuthority}</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder={t.templates.filters.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Results */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              <span className="font-semibold text-blue-600">{filteredTemplates.length}</span> templates found
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{template.icon}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorClasses(template.color)}`}>
                    {template.category}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {template.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {template.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⭐ {template.rating}</span>
                  <span>{template.uses} uses</span>
                </div>

                <Link
                  href={`/en/template/${template.id}`}
                  className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors block"
                >
                  Use Template
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t.templates.noResults}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.templates.noResultsDescription}
            </p>
            <button
              onClick={() => {
                setSelectedProfession('all')
                setSelectedObjective('all')
                setSearchTerm('')
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Final CTA */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Didn't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your own custom template in minutes. Our AI helps you build unique tools for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/en/create"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              {t.templates.cta}
            </Link>
            <Link
              href="/en/profile-selection"
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Choose by Profession
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
              {t.footer.tagline}
            </p>
            <p className="text-gray-500 text-xs">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
