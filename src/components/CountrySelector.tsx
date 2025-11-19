import React from 'react'

interface Country {
  code: string
  name: string
  flag: string
  phoneCode: string
  timezone: string
}

export const COUNTRIES: Country[] = [
  // North America
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', phoneCode: '55', timezone: 'America/Sao_Paulo' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', phoneCode: '1', timezone: 'America/New_York' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦', phoneCode: '1', timezone: 'America/Toronto' },
  { code: 'MX', name: 'México', flag: '🇲🇽', phoneCode: '52', timezone: 'America/Mexico_City' },
  // Central America
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', phoneCode: '506', timezone: 'America/Costa_Rica' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦', phoneCode: '507', timezone: 'America/Panama' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', phoneCode: '502', timezone: 'America/Guatemala' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', phoneCode: '504', timezone: 'America/Tegucigalpa' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', phoneCode: '503', timezone: 'America/El_Salvador' },
  { code: 'NI', name: 'Nicarágua', flag: '🇳🇮', phoneCode: '505', timezone: 'America/Managua' },
  // South America
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', phoneCode: '54', timezone: 'America/Argentina/Buenos_Aires' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', phoneCode: '56', timezone: 'America/Santiago' },
  { code: 'CO', name: 'Colômbia', flag: '🇨🇴', phoneCode: '57', timezone: 'America/Bogota' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', phoneCode: '51', timezone: 'America/Lima' },
  { code: 'EC', name: 'Equador', flag: '🇪🇨', phoneCode: '593', timezone: 'America/Guayaquil' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', phoneCode: '58', timezone: 'America/Caracas' },
  { code: 'UY', name: 'Uruguai', flag: '🇺🇾', phoneCode: '598', timezone: 'America/Montevideo' },
  { code: 'PY', name: 'Paraguai', flag: '🇵🇾', phoneCode: '595', timezone: 'America/Asuncion' },
  { code: 'BO', name: 'Bolívia', flag: '🇧🇴', phoneCode: '591', timezone: 'America/La_Paz' },
  // Caribbean
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', phoneCode: '1', timezone: 'America/Santo_Domingo' },
  { code: 'PR', name: 'Porto Rico', flag: '🇵🇷', phoneCode: '1', timezone: 'America/Puerto_Rico' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', phoneCode: '53', timezone: 'America/Havana' },
  // Europe
  { code: 'ES', name: 'Espanha', flag: '🇪🇸', phoneCode: '34', timezone: 'Europe/Madrid' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', phoneCode: '351', timezone: 'Europe/Lisbon' },
  { code: 'FR', name: 'França', flag: '🇫🇷', phoneCode: '33', timezone: 'Europe/Paris' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹', phoneCode: '39', timezone: 'Europe/Rome' },
  { code: 'DE', name: 'Alemanha', flag: '🇩🇪', phoneCode: '49', timezone: 'Europe/Berlin' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧', phoneCode: '44', timezone: 'Europe/London' },
  { code: 'NL', name: 'Holanda', flag: '🇳🇱', phoneCode: '31', timezone: 'Europe/Amsterdam' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪', phoneCode: '32', timezone: 'Europe/Brussels' },
  { code: 'CH', name: 'Suíça', flag: '🇨🇭', phoneCode: '41', timezone: 'Europe/Zurich' },
  { code: 'AT', name: 'Áustria', flag: '🇦🇹', phoneCode: '43', timezone: 'Europe/Vienna' },
  // Outros países importantes
  { code: 'AU', name: 'Austrália', flag: '🇦🇺', phoneCode: '61', timezone: 'Australia/Sydney' },
  { code: 'NZ', name: 'Nova Zelândia', flag: '🇳🇿', phoneCode: '64', timezone: 'Pacific/Auckland' },
  { code: 'JP', name: 'Japão', flag: '🇯🇵', phoneCode: '81', timezone: 'Asia/Tokyo' },
  { code: 'CN', name: 'China', flag: '🇨🇳', phoneCode: '86', timezone: 'Asia/Shanghai' },
  { code: 'IN', name: 'Índia', flag: '🇮🇳', phoneCode: '91', timezone: 'Asia/Kolkata' },
  { code: 'ZA', name: 'África do Sul', flag: '🇿🇦', phoneCode: '27', timezone: 'Africa/Johannesburg' },
  // Opção genérica para outros países
  { code: 'OTHER', name: 'Outro País', flag: '🌍', phoneCode: '', timezone: 'UTC' },
]

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code)
}

export default function CountrySelector({ value, onChange, className = '' }: {
  value?: string
  onChange: (countryCode: string) => void
  className?: string
}) {
  const selectedCountry = COUNTRIES.find(c => c.code === value)
  
  return (
    <div className={`relative ${className}`}>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white cursor-pointer"
      >
        <option value="">Selecione seu país</option>
        {COUNTRIES.map(country => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
      
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <span className="text-2xl">{selectedCountry?.flag || '🌍'}</span>
      </div>
    </div>
  )
}

