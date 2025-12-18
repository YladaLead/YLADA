'use client'

import Image from 'next/image'

interface PublicBrandingHeaderProps {
  logoUrl?: string
  brandColor?: string
  brandName?: string
  professionalCredential?: string
  title?: string
  showYladaLogo?: boolean
}

export default function PublicBrandingHeader({
  logoUrl,
  brandColor = '#3B82F6',
  brandName,
  professionalCredential,
  title,
  showYladaLogo = true
}: PublicBrandingHeaderProps) {
  return (
    <div 
      className="text-white border-b"
      style={{ backgroundColor: brandColor }}
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          {/* Logo do nutricionista ou logo padrão YLADA */}
          {logoUrl ? (
            <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={logoUrl}
                alt={brandName || 'Logo'}
                fill
                className="object-contain p-2"
              />
            </div>
          ) : showYladaLogo ? (
            <div className="relative w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="Nutri by YLADA"
                width={48}
                height={48}
                className="w-12 h-12 object-contain opacity-90"
              />
            </div>
          ) : null}
          
          {/* Nome da marca e credencial */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {brandName || title || 'Nutricionista'}
            </h2>
            {professionalCredential && (
              <p className="text-sm opacity-90 mt-1">
                {professionalCredential}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
