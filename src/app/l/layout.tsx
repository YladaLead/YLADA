/**
 * Layout da página pública de links inteligentes (/l/[slug]).
 * Tons azuis predominantes (Ylada azulzinho claro).
 */
export default function PublicLinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50/95 to-blue-50">
      {children}
    </div>
  )
}
