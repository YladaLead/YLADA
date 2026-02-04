'use client'

import { useState } from 'react'
import YLADALogo from '../../components/YLADALogo'
import LanguageSelector from '../../components/LanguageSelector'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

export default function HomePageES() {
  const [formData, setFormData] = useState({
    nome: '',
    profissao: '',
    pais: '',
    email: '',
    telefone: '',
    countryCode: 'BR'
  })
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al enviar el formulario')
      setFormData({ nome: '', profissao: '', pais: '', email: '', telefone: '', countryCode: 'BR' })
      setShowSuccessModal(true)
    } catch (err: unknown) {
      console.error('Error al enviar:', err)
      alert('Error al enviar el formulario. Por favor, inténtelo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-20 sm:h-24 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/es">
            <YLADALogo size="md" responsive={true} className="bg-transparent" />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main>
        <section className="container mx-auto px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              Transformamos conversación en contactos cualificados.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              YLADA es un motor de diagnóstico, enlaces inteligentes e inteligencia artificial que crea, provoca y dirige conversaciones estratégicas, aumentando la autoridad, la credibilidad y el rendimiento de profesionales y equipos de campo.
            </p>
            <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Antes de la venta. Durante la conversación. Después del contacto.
            </p>
            <Link href="#soluciones" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
              Explorar soluciones
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Quiénes somos</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                YLADA nació de la idea de que toda conversación puede generar resultado cuando hay dirección, diagnóstico e inteligencia detrás.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Creamos un sistema inteligente que ayuda a profesionales y equipos de campo a atraer, cualificar y conectar con personas realmente interesadas, transformando interacciones en oportunidades concretas.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Más que tecnología, YLADA organiza la conversación, orienta la rutina, fortalece la autoridad de quien está en el campo y aumenta la confianza en cada interacción.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Cómo funciona</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Atracción y Diagnóstico</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cree enlaces, quizzes y evaluaciones inteligentes que provocan la conversación correcta, entregan valor inmediato y filtran curiosos de personas realmente interesadas — antes del primer contacto.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Conversación Guiada e Inteligente</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Conduzca el diálogo con claridad y estrategia. La inteligencia artificial de YLADA orienta qué decir, cuándo decir y cómo conducir, ajustando el enfoque al contexto real de cada interacción.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rendimiento y Autoridad de Campo</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acompañe decisiones, interacciones y resultados para aumentar conversión, previsibilidad y credibilidad profesional, fortaleciendo la confianza individual y del equipo en el campo.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Escala Multimercado</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use el mismo motor de generación de contactos y conversaciones en diferentes áreas, países y modelos de negocio — sin perder personalización ni control.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">El diferencial de la inteligencia YLADA</h2>
              <p className="text-xl text-gray-800 font-semibold mb-6 leading-relaxed">
                Inteligencia artificial que provoca conversación, no bloquea relación.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed text-left">
                La inteligencia artificial de YLADA no fue creada para sustituir al profesional ni endurecer la atención con respuestas automáticas. Actúa como un copiloto estratégico, ajustando rutina, enfoque y próximos pasos según el contexto real de cada interacción.
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-3 mb-10">
              <p className="text-gray-700 leading-relaxed">Mediante diagnósticos inteligentes y direccionamiento continuo, YLADA:</p>
              <ul className="text-gray-600 space-y-2 list-none">
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> provoca el inicio de la conversación correcta</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> dirige el foco hacia personas realmente interesadas</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> orienta qué decir, cuándo decir y cómo conducir</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> fortalece la autoridad y la credibilidad del profesional</li>
                <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">•</span> eleva el rendimiento y la confianza del equipo de campo</li>
              </ul>
              <p className="text-gray-600 leading-relaxed pt-2">
                El resultado es menos curiosos, más calidad de contacto y conversaciones que evolucionan de forma natural hacia relación y decisión.
              </p>
            </div>
            <p className="text-center text-lg font-semibold text-gray-800 max-w-xl mx-auto">
              No se trata de responder mensajes.<br />Se trata de provocar las conversaciones correctas.
            </p>
          </div>
        </section>

        <section id="soluciones" className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Para quién es YLADA</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">👤</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Profesionales que dependen de la conversación para generar clientes</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">Nutricionistas, consultores, coaches, especialistas y profesionales liberales.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/nutri" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explorar →</Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">👥</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Equipos de campo y ventas descentralizadas</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">Equipos que necesitan generar contactos más cualificados y aumentar rendimiento sin presión excesiva.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explorar →</Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">🤝</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Negocios basados en relación</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">Proyectos y empresas que crecen a partir de confianza, diálogo y autoridad.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/c" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explorar →</Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-4xl mb-4 text-center">📈</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">Organizaciones que desean escalar generación de contactos</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">Con inteligencia, claridad de datos y procesos bien definidos.</p>
                <div className="mt-4 text-center">
                  <Link href="/pt/wellness" className="text-blue-600 text-sm font-medium hover:text-blue-700">Explorar →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 lg:mb-10">Filosofía YLADA</h2>
              <div className="space-y-6 lg:space-y-7">
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  YLADA significa <span className="font-semibold text-gray-900 whitespace-nowrap">Your Leading Advanced Data Assistant</span>.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Creemos que la tecnología solo tiene sentido cuando mejora la conversación, fortalece la relación y orienta mejores decisiones en el campo.
                </p>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  Por eso creamos soluciones que transforman datos en claridad, interacciones en oportunidades y conversaciones en resultados reales — con inteligencia, humanidad y propósito.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">Hable con nosotros</h2>
              <p className="text-lg text-gray-600 text-center mb-8">
                ¿Quiere entender cómo YLADA puede ayudar a usted o a su equipo a generar contactos más cualificados, más autoridad y más previsibilidad?
              </p>
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nombre-es" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input type="text" id="nombre-es" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="profesion-es" className="block text-sm font-medium text-gray-700 mb-2">Profesión</label>
                    <input type="text" id="profesion-es" value={formData.profissao} onChange={(e) => setFormData({ ...formData, profissao: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="pais-es" className="block text-sm font-medium text-gray-700 mb-2">País</label>
                    <input type="text" id="pais-es" value={formData.pais} onChange={(e) => setFormData({ ...formData, pais: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="email-es" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                    <input type="email" id="email-es" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label htmlFor="telefone-es" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <PhoneInputWithCountry value={formData.telefone} onChange={(phone, countryCode) => setFormData({ ...formData, telefone: phone, countryCode })} defaultCountryCode={formData.countryCode} className="w-full" placeholder="11 99999-9999" />
                    <p className="text-xs text-gray-500 mt-1">Seleccione el país por la bandera e ingrese solo el número (sin código de área)</p>
                  </div>
                  <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowSuccessModal(false)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Gracias por su interés!</h3>
                <p className="text-gray-600 mb-6">Nos pondremos en contacto pronto.</p>
                <button onClick={() => setShowSuccessModal(false)} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">OK</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4"><YLADALogo size="lg" className="bg-transparent" /></div>
            <p className="text-gray-600 text-sm mb-4 text-center">YLADA: Your Leading Advanced Data Assistant</p>
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
            <p className="text-gray-500 text-xs text-center">© {new Date().getFullYear()} YLADA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
