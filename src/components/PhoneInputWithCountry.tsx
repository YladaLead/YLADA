'use client'

import { useState, useEffect } from 'react'
import { COUNTRIES, getCountryByCode, Country } from '@/components/CountrySelector'

interface PhoneInputWithCountryProps {
  value: string // Full phone number including country code, e.g., "5511999999999"
  onChange: (phone: string, countryCode: string) => void
  defaultCountryCode?: string
  className?: string
  placeholder?: string
  disabled?: boolean
}

export default function PhoneInputWithCountry({
  value,
  onChange,
  defaultCountryCode = 'BR',
  className = '',
  placeholder = 'Ex: 5511999999999',
  disabled = false,
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
          disabled={disabled}
          className="absolute inset-0 h-full w-full rounded-l-lg opacity-0 z-10 disabled:cursor-not-allowed cursor-pointer"
          title={selectedCountry?.name || 'Selecione o país'}
        >
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        {/* Bandeira visível - área clicável */}
        <div className="w-12 h-full flex min-h-[42px] items-center justify-center rounded-l-lg border-r border-gray-300 bg-white transition-colors hover:bg-gray-50">
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
            disabled={disabled}
            className="w-12 border-none bg-transparent px-1 text-center text-sm font-medium text-gray-600 outline-none disabled:cursor-not-allowed"
            maxLength={4}
          />
        </div>
      )}
      
      {/* Input do Telefone */}
      <input
        type="tel"
        disabled={disabled}
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        className="min-h-[42px] flex-1 bg-transparent px-3 py-2 text-base outline-none disabled:cursor-not-allowed"
        placeholder={isOtherCountry ? "Número completo" : "11 99999-9999"}
      />
    </div>
  )
}

