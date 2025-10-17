// Sistema de unidades por idioma
export type Language = 'pt' | 'en' | 'es'

export interface Units {
  weight: string
  height: string
  water: string
}

export interface UnitConfig {
  weight: {
    unit: string
    placeholder: string
    conversion: {
      toKg: (value: number) => number
      fromKg: (value: number) => number
    }
  }
  height: {
    unit: string
    placeholder: string
    conversion: {
      toCm: (value: number) => number
      fromCm: (value: number) => number
    }
  }
  water: {
    unit: string
    conversion: {
      toMl: (value: number) => number
      fromMl: (value: number) => number
    }
  }
}

export const unitConfigs: Record<Language, UnitConfig> = {
  pt: {
    weight: {
      unit: 'kg',
      placeholder: 'ex: 70',
      conversion: {
        toKg: (value: number) => value,
        fromKg: (value: number) => value
      }
    },
    height: {
      unit: 'cm',
      placeholder: 'ex: 165',
      conversion: {
        toCm: (value: number) => value,
        fromCm: (value: number) => value
      }
    },
    water: {
      unit: 'ml',
      conversion: {
        toMl: (value: number) => value,
        fromMl: (value: number) => value
      }
    }
  },
  en: {
    weight: {
      unit: 'lbs',
      placeholder: 'e.g., 154',
      conversion: {
        toKg: (value: number) => value * 0.453592,
        fromKg: (value: number) => value * 2.20462
      }
    },
    height: {
      unit: 'ft/in',
      placeholder: 'e.g., 5\'6"',
      conversion: {
        toCm: (value: number) => {
          // Assumindo que o valor vem como polegadas totais
          return value * 2.54
        },
        fromCm: (value: number) => {
          // Converter para polegadas
          return value / 2.54
        }
      }
    },
    water: {
      unit: 'fl oz',
      conversion: {
        toMl: (value: number) => value * 29.5735,
        fromMl: (value: number) => value / 29.5735
      }
    }
  },
  es: {
    weight: {
      unit: 'kg',
      placeholder: 'ej: 70',
      conversion: {
        toKg: (value: number) => value,
        fromKg: (value: number) => value
      }
    },
    height: {
      unit: 'cm',
      placeholder: 'ej: 165',
      conversion: {
        toCm: (value: number) => value,
        fromCm: (value: number) => value
      }
    },
    water: {
      unit: 'ml',
      conversion: {
        toMl: (value: number) => value,
        fromMl: (value: number) => value
      }
    }
  }
}

// Funções de conversão
export const convertWeight = (value: number, fromLang: Language, toLang: Language): number => {
  const fromConfig = unitConfigs[fromLang]
  const toConfig = unitConfigs[toLang]
  
  // Converter para kg primeiro
  const kgValue = fromConfig.weight.conversion.toKg(value)
  // Depois converter para a unidade de destino
  return toConfig.weight.conversion.fromKg(kgValue)
}

export const convertHeight = (value: number, fromLang: Language, toLang: Language): number => {
  const fromConfig = unitConfigs[fromLang]
  const toConfig = unitConfigs[toLang]
  
  // Converter para cm primeiro
  const cmValue = fromConfig.height.conversion.toCm(value)
  // Depois converter para a unidade de destino
  return toConfig.height.conversion.fromCm(cmValue)
}

export const convertWater = (value: number, fromLang: Language, toLang: Language): number => {
  const fromConfig = unitConfigs[fromLang]
  const toConfig = unitConfigs[toLang]
  
  // Converter para ml primeiro
  const mlValue = fromConfig.water.conversion.toMl(value)
  // Depois converter para a unidade de destino
  return toConfig.water.conversion.fromMl(mlValue)
}

// Função para formatar altura em inglês (pés e polegadas)
export const formatHeightInches = (inches: number): string => {
  const feet = Math.floor(inches / 12)
  const remainingInches = Math.round(inches % 12)
  return `${feet}'${remainingInches}"`
}

// Função para converter altura de pés/polegadas para polegadas totais
export const parseHeightInches = (heightStr: string): number => {
  // Formato esperado: "5'6" ou "5'6"
  const match = heightStr.match(/(\d+)'(\d+)/)
  if (match) {
    const feet = parseInt(match[1])
    const inches = parseInt(match[2])
    return feet * 12 + inches
  }
  return 0
}

