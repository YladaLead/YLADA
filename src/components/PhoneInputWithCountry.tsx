'use client'

import { useState, useEffect } from 'react'
import { COUNTRIES, getCountryByCode, Country } from '@/components/CountrySelector'

interface PhoneInputWithCountryProps {
  value: string // Full phone number including country code, e.g., "5511999999999"
  onChange: (phone: string, countryCode: string) => void
  defaultCountryCode?: string
  className?: string
  placeholder?: string
}

export default function PhoneInputWithCountry({
  value,
  onChange,
  defaultCountryCode = 'BR',
  className = '',
  placeholder = 'Ex: 5511999999999'
}: PhoneInputWithCountryProps) {
  const [countryCode, setCountryCode] = useState(defaultCountryCode)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otherCountryCode, setOtherCountryCode] = useState('')

  useEffect(() => {
    // Se o valor estiver vazio, resetar para o país padrão
    if (!value || value.trim() === '') {
      setCountryCode(defaultCountryCode)
      setPhoneNumber('')
      return
    }

    // Try to infer country code from the value if it starts with a known country code
    let inferredCountryCode = defaultCountryCode
    let remainingPhoneNumber = value

    for (const country of COUNTRIES) {
      if (value.startsWith(country.phoneCode)) {
        inferredCountryCode = country.code
        remainingPhoneNumber = value.substring(country.phoneCode.length)
        break
      }
    }
    setCountryCode(inferredCountryCode)
    setPhoneNumber(remainingPhoneNumber)
  }, [value, defaultCountryCode])

  const handleCountryChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode)
    const selectedCountry = getCountryByCode(newCountryCode)
    if (selectedCountry && selectedCountry.phoneCode) {
      onChange(selectedCountry.phoneCode + phoneNumber, newCountryCode)
    } else {
      // Para "OTHER", manter apenas o número
      onChange(phoneNumber, newCountryCode)
    }
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^0-9]/g, '') // Only numbers
    setPhoneNumber(newNumber)
    const selectedCountry = getCountryByCode(countryCode)
    if (selectedCountry && selectedCountry.phoneCode && countryCode !== 'OTHER') {
      onChange(selectedCountry.phoneCode + newNumber, countryCode)
    } else {
      // Para "OTHER" ou sem código, apenas o número
      onChange(newNumber, countryCode)
    }
  }

  const handleOtherCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.replace(/[^0-9]/g, '')
    setOtherCountryCode(newCode)
    onChange(newCode + phoneNumber, countryCode)
  }

  const selectedCountry = getCountryByCode(countryCode)
  const isOtherCountry = countryCode === 'OTHER'

  return (
    <div className={`flex items-stretch border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white ${className}`}>
      {/* Seletor de País Compacto - Apenas Bandeira Visível */}
      <div className="relative flex-shrink-0">
        {/* Select invisível mas clicável */}
        <select
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 rounded-l-lg"
          title={selectedCountry?.name || 'Selecione o país'}
        >
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        {/* Bandeira visível - área clicável */}
        <div className="w-12 h-full flex items-center justify-center border-r border-gray-300 rounded-l-lg bg-white hover:bg-gray-50 transition-colors min-h-[42px]">
          <span className="text-xl">{selectedCountry?.flag || '🌍'}</span>
        </div>
      </div>
      
      {/* Código do País */}
      {!isOtherCountry ? (
        <span className="text-gray-600 px-2 border-r border-gray-300 text-sm font-medium min-w-[42px] text-center flex items-center">+{selectedCountry?.phoneCode || '--'}</span>
      ) : (
        <div className="flex items-center border-r border-gray-300 px-2">
          <span className="text-gray-400 text-sm">+</span>
          <input
            type="text"
            placeholder="DDI"
            value={otherCountryCode}
            onChange={handleOtherCountryCodeChange}
            className="text-gray-600 px-1 w-12 text-sm font-medium text-center outline-none bg-transparent border-none"
            maxLength={4}
          />
        </div>
      )}
      
      {/* Input do Telefone */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        className="flex-1 px-3 py-2 outline-none bg-transparent text-base min-h-[42px]"
        placeholder={isOtherCountry ? "Número completo" : "11 99999-9999"}
      />
    </div>
  )
}

