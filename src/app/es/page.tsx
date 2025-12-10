'use client'

import { useState } from 'react'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  const [formData, setFormData] = useState({
    nombre: '',
    profesion: '',
    pais: '',
    email: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar envio del formulario
    console.log('Formulario enviado:', formData)
    alert('¡Gracias por tu interés! Nos pondremos en contacto pronto.')
    setFormData({ nombre: '', profesion: '', pais: '', email: '' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-20 sm:h-24 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/es">
            <YLADALogo size="sm" responsive={true} className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* (1) Hero Section - Apertura elegante */}
        <section className="container mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              <span className="whitespace-nowrap">Conectando personas con</span>{' '}
              <span className="whitespace-nowrap">el bienestar, a través de</span>{' '}
              <span className="whitespace-nowrap">inteligencia digital.</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ylada ayuda a profesionales de la salud, bienestar y rendimiento a crear experiencias inteligentes, generar conexiones reales y transformar servicios en relaciones.
            </p>
            <Link 
              href="#soluciones"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Explorar soluciones
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* (2) Sección "Quiénes somos" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Quiénes somos
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ylada nació de la idea de que cada profesional puede tener su propio sistema inteligente de relacionamiento.
                Reunimos herramientas y automatizaciones para que nutricionistas, coaches, consultores y distribuidores puedan conectarse con clientes y equipos de forma simple, rápida y personalizada.
              </p>
            </div>
          </div>
        </section>

        {/* (3) Sección "Cómo funciona" */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Cómo funciona
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inteligencia de Leads</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Crea herramientas y cuestionarios inteligentes que atraen a personas interesadas.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comunicación Integrada</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Automatiza el relacionamiento y mantén el contacto activo.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Seguimiento y Resultados</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ve en tiempo real quién está interactuando con tus enlaces y evaluaciones.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expansión Global</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Soporte en 3 idiomas: español, portugués e inglés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (4) Sección "Para quién es Ylada" */}
        <section id="soluciones" className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              Para quién es Ylada
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🥗</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Nutricionistas</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que desean generar evaluaciones inteligentes y captar pacientes adecuados.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/es/nutri" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">💊</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Consultores Nutracéuticos</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que quieren mostrar productos basados en diagnósticos y resultados.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/es/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Coaches de Bienestar</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que buscan inspirar a las personas con herramientas y desafíos interactivos.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/es/coach" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🧘</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Distribuidores de Bienestar</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">
                  Que desean expandir su red de forma organizada y digital.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/es/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Explorar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* (5) Sección "Filosofía Ylada" */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-10">
                Filosofía Ylada
              </h2>
              <div className="space-y-6 lg:space-y-7">
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed">
                  YLADA significa <span className="font-semibold text-gray-900 whitespace-nowrap">Your Leading Advanced Data Assistant</span> — tu asistente avanzado para <span className="whitespace-nowrap">generar conexiones significativas.</span>
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed lg:leading-relaxed max-w-3xl mx-auto">
                  Nuestra misión es acercar tecnología y propósito humano.
                  Cada herramienta de Ylada está diseñada para apoyar al profesional que cree en el poder del <span className="whitespace-nowrap">bienestar compartido.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* (6) Sección "Contáctanos" */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
                Contáctanos
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                ¿Quieres conocer más sobre Ylada?
                Completa el formulario y nos pondremos en contacto cuando se lancen nuevas funcionalidades.
              </p>
              
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profesion" className="block text-sm font-medium text-gray-700 mb-2">
                      Profesión
                    </label>
                    <input
                      type="text"
                      id="profesion"
                      value={formData.profesion}
                      onChange={(e) => setFormData({ ...formData, profesion: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      id="pais"
                      value={formData.pais}
                      onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* (7) Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="md" className="bg-transparent" />
            </div>
            <p className="text-gray-600 text-sm mb-4 text-center">
              YLADA — Your Leading Advanced Data Assistant
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4 text-sm text-gray-500">
              <Link href="/pt/politica-de-privacidade" className="hover:text-gray-700">Política de Privacidad</Link>
              <span>•</span>
              <Link href="/pt/termos-de-uso" className="hover:text-gray-700">Términos de Uso</Link>
              <span>•</span>
              <Link href="/pt/politica-de-cookies" className="hover:text-gray-700">Cookies</Link>
              <span>•</span>
              <Link href="/pt/politica-de-reembolso" className="hover:text-gray-700">Reembolso</Link>
              <span>•</span>
              <span className="text-gray-400">Idiomas: ES / PT / EN</span>
            </div>
            <p className="text-gray-500 text-xs text-center">
              © {new Date().getFullYear()} YLADA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
