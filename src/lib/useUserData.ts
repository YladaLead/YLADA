'use client'

import { useEffect, useState } from 'react'

interface UserData {
  userId?: string
  userName?: string
  userPhone?: string
  linkId?: string
  customMessage?: string
  pageTitle?: string // Título personalizado
  buttonText?: string // Texto do botão personalizado
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Obter dados do usuário da URL
      const urlParams = new URLSearchParams(window.location.search)
      const userParam = urlParams.get('user')
      
      console.log('🔍 DEBUG useUserData:')
      console.log('  - window.location.search:', window.location.search)
      console.log('  - userParam:', userParam)
      
      if (userParam) {
        const parsedUserData = JSON.parse(userParam)
        console.log('👤 Dados do usuário carregados:', parsedUserData)
        console.log('  - customMessage:', parsedUserData.customMessage)
        setUserData(parsedUserData)
      } else {
        console.log('⚠️ Nenhum dado de usuário encontrado na URL')
        console.log('⚠️ Usando fallback padrão')
        // Fallback para dados padrão - SEM TELEFONE FIXO
        console.log('⚠️ Usando fallback SEM telefone fixo')
        setUserData({
          userId: 'default',
          userName: 'Especialista',
          userPhone: '', // SEM telefone fixo - deve ser fornecido pela URL
          linkId: 'default',
          customMessage: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
        })
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error)
      console.log('❌ Usando fallback de erro')
      // Fallback para dados padrão - SEM TELEFONE FIXO
      setUserData({
        userId: 'default',
        userName: 'Especialista',
        userPhone: '', // SEM telefone fixo - deve ser fornecido pela URL
        linkId: 'default',
        customMessage: 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const getWhatsAppUrl = (message?: string) => {
    // Usar mensagem personalizada se disponível, senão usar a mensagem passada como parâmetro
    const finalMessage = userData?.customMessage || message || 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
    
    console.log('🔍 Debug getWhatsAppUrl:')
    console.log('  - userData:', userData)
    console.log('  - userPhone:', userData?.userPhone)
    console.log('  - customMessage:', userData?.customMessage)
    console.log('  - finalMessage:', finalMessage)
    
    if (!userData?.userPhone) {
      console.log('⚠️ SEM TELEFONE - não é possível gerar URL do WhatsApp')
      return '#'
    }
    
    // Usar o telefone exatamente como está no banco (já com código do país)
    const cleanPhone = userData.userPhone.replace(/\D/g, '')
    
    console.log('✅ Usando telefone do usuário:', cleanPhone)
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`
  }

  const getCustomMessage = () => {
    const message = userData?.customMessage || 'Quer receber orientações personalizadas? Clique abaixo e fale comigo!'
    console.log('🔍 Debug getCustomMessage:')
    console.log('  - userData:', userData)
    console.log('  - customMessage:', userData?.customMessage)
    console.log('  - final message:', message)
    return message
  }

  const getPageTitle = () => {
    return userData?.pageTitle || 'Quer uma análise mais completa?'
  }

  const getButtonText = () => {
    return userData?.buttonText || 'Consultar Especialista'
  }

  return {
    userData,
    loading,
    getWhatsAppUrl,
    getCustomMessage,
    getPageTitle,
    getButtonText
  }
}
