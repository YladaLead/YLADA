# 📋 Template de Configurações - Outras Áreas (Nutri, Coach, Nutra)

Este documento serve como template para as páginas de configurações das outras áreas (Nutri, Coach, Nutra) que precisam incluir **Notificações** e **Integrações**.

---

## 🎯 Estrutura da Página de Configurações

### 1. **📝 Informações do Perfil** (Igual ao Wellness)
- Nome Completo
- Email
- Telefone/WhatsApp (com bandeira do país integrada)
- Bio/Descrição
- Slug para URL (com normalização automática)

### 2. **🔔 Notificações** (Apenas para outras áreas)
- Email
- Leads
- WhatsApp
- SMS

### 3. **🔗 Integrações** (Apenas para outras áreas)
- WhatsApp Business
- Email Marketing (Mailchimp, SendGrid, RD Station, ActiveCampaign)
- CRM (HubSpot, Pipedrive, Salesforce) - Futuro

### 4. **🔒 Segurança**
- Alterar Senha

---

## 💻 Componentes Necessários

### 1. **PhoneInputWithCountry**
- Componente integrado de telefone com seletor de país
- Localização: `src/components/PhoneInputWithCountry.tsx`
- Já inclui bandeira e código do país

### 2. **APIs de Notificações**
- GET/PUT: `/api/[area]/notifications/preferences`
- Para salvar preferências de notificação

### 3. **APIs de Integrações**
- GET/POST/DELETE: `/api/[area]/integrations`
- Para gerenciar integrações externas

---

## 📝 Exemplo de Implementação

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

export default function ConfiguracoesPage() {
  const [perfil, setPerfil] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    countryCode: 'BR',
    bio: '',
    userSlug: ''
  })

  const [notificacoes, setNotificacoes] = useState({
    email: true,
    leads: true,
    whatsapp: false,
    sms: false
  })

  const [integrations, setIntegrations] = useState<any[]>([])

  // Função para tratar slug
  const tratarSlug = (texto: string): string => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Carregar preferências e integrações
  useEffect(() => {
    carregarPreferencias()
    carregarIntegracoes()
  }, [])

  const carregarPreferencias = async () => {
    try {
      const response = await fetch('/api/[area]/notifications/preferences', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.preferences) {
          setNotificacoes({
            email: data.preferences.email_enabled ?? true,
            leads: data.preferences.leads_enabled ?? true,
            whatsapp: data.preferences.whatsapp_enabled ?? false,
            sms: data.preferences.sms_enabled ?? false
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
    }
  }

  const salvarPreferencias = async () => {
    try {
      const response = await fetch('/api/[area]/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email_enabled: notificacoes.email,
          leads_enabled: notificacoes.leads,
          whatsapp_enabled: notificacoes.whatsapp,
          sms_enabled: notificacoes.sms
        })
      })
      if (response.ok) {
        console.log('Preferências salvas com sucesso')
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error)
    }
  }

  const carregarIntegracoes = async () => {
    try {
      const response = await fetch('/api/[area]/integrations', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setIntegrations(data.integrations || [])
      }
    } catch (error) {
      console.error('Erro ao carregar integrações:', error)
    }
  }

  // Debounce para salvar preferências automaticamente
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      salvarPreferencias()
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [notificacoes.email, notificacoes.leads, notificacoes.whatsapp, notificacoes.sms])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        {/* ... header code ... */}
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📝 Informações do Perfil</h2>
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
                value={perfil.nome}
                onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Telefone/WhatsApp com Bandeira */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone / WhatsApp *
              </label>
              <PhoneInputWithCountry
                value={perfil.whatsapp || perfil.telefone.replace(/\D/g, '')}
                onChange={(phone, countryCode) => {
                  setPerfil({
                    ...perfil, 
                    telefone: phone,
                    whatsapp: phone.replace(/\D/g, ''),
                    countryCode
                  })
                }}
                countryCode={perfil.countryCode}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 O número será usado tanto para telefone quanto WhatsApp. Selecione o país pela bandeira para formatação automática.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio/Descrição</label>
              <textarea
                value={perfil.bio}
                onChange={(e) => setPerfil({...perfil, bio: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Slug para URL (obrigatório)
              </label>
              <input
                type="text"
                value={perfil.userSlug}
                onChange={(e) => {
                  const slugTratado = tratarSlug(e.target.value)
                  setPerfil({...perfil, userSlug: slugTratado})
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu-slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                Este slug será usado nas suas URLs: ylada.app/[area]/<strong>{perfil.userSlug || 'seu-slug'}</strong>/[nome-ferramenta]
              </p>
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all">
              Salvar Alterações
            </button>
          </div>
        </div>

        {/* Notificações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">🔔 Notificações</h2>
            <Link 
              href="/docs/NOTIFICACOES-INTEGRACOES.md" 
              target="_blank"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              📖 Saiba mais
            </Link>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Para que servem?</strong> As notificações alertam você sobre novos leads, atualizações importantes e eventos na plataforma. 
              Configure conforme sua preferência para não perder nenhuma oportunidade.
            </p>
          </div>
          <div className="space-y-4">
            {Object.entries(notificacoes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 capitalize">{key}</p>
                  <p className="text-sm text-gray-600">
                    {key === 'email' && 'Receba atualizações por email'}
                    {key === 'leads' && 'Avisos quando houver novos leads'}
                    {key === 'whatsapp' && 'Notificações via WhatsApp'}
                    {key === 'sms' && 'Alertas por SMS'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNotificacoes({...notificacoes, [key]: !value})
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Integrações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">🔗 Integrações</h2>
            <Link 
              href="/docs/NOTIFICACOES-INTEGRACOES.md" 
              target="_blank"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              📖 Saiba mais
            </Link>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-purple-800">
              <strong>💡 Para que servem?</strong> As integrações conectam a plataforma com ferramentas externas (WhatsApp Business, Email Marketing, CRM) 
              para automatizar processos e aumentar sua produtividade. Configure conforme suas necessidades.
            </p>
          </div>
          <div className="space-y-4">
            {/* WhatsApp Business */}
            {(() => {
              const whatsappIntegration = integrations.find(i => i.provider === 'whatsapp_business')
              return (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Business</p>
                      <p className={`text-sm ${whatsappIntegration?.status === 'connected' ? 'text-green-600' : 'text-gray-600'}`}>
                        {whatsappIntegration?.status === 'connected' ? 'Conectado' : 'Não conectado'}
                        {whatsappIntegration?.provider_account_name && ` • ${whatsappIntegration.provider_account_name}`}
                      </p>
                    </div>
                  </div>
                  {whatsappIntegration?.status === 'connected' ? (
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Desconectar
                    </button>
                  ) : (
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Conectar
                    </button>
                  )}
                </div>
              )
            })()}

            {/* Email Marketing */}
            {(() => {
              const emailIntegration = integrations.find(i => i.provider === 'email_marketing')
              return (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-medium text-gray-900">Email Marketing</p>
                      <p className={`text-sm ${emailIntegration?.status === 'connected' ? 'text-green-600' : 'text-gray-600'}`}>
                        {emailIntegration?.status === 'connected' ? 'Conectado' : 'Não conectado'}
                        {emailIntegration?.provider_account_name && ` • ${emailIntegration.provider_account_name}`}
                      </p>
                    </div>
                  </div>
                  {emailIntegration?.status === 'connected' ? (
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Desconectar
                    </button>
                  ) : (
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                      Conectar
                    </button>
                  )}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🔒 Segurança</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all">
              Atualizar Senha
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

## 🎨 Diferenças por Área

### **Cores**
- **Wellness**: Verde (`green-600`, `emerald-600`)
- **Nutri**: Azul (`blue-600`, `blue-700`)
- **Coach**: Laranja (`orange-600`, `orange-700`)
- **Nutra**: Roxo (`purple-600`, `purple-700`)

### **Logo**
- **Wellness**: `/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png`
- **Nutri**: `/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png`
- **Coach**: `/images/logo/ylada/horizontal/laranja/...`
- **Nutra**: `/images/logo/ylada/horizontal/roxo/...`

---

## 📋 Checklist de Implementação

- [ ] Criar componente `PhoneInputWithCountry` (já existe)
- [ ] Criar componente `CountrySelector` (já existe)
- [ ] Criar API `/api/[area]/notifications/preferences`
- [ ] Criar API `/api/[area]/integrations`
- [ ] Criar página de configurações seguindo o template
- [ ] Ajustar cores conforme área
- [ ] Ajustar logo conforme área
- [ ] Testar salvamento de preferências
- [ ] Testar salvamento de integrações

---

## 📚 Documentação Relacionada

- Ver `docs/NOTIFICACOES-INTEGRACOES.md` para detalhes completos sobre notificações e integrações

