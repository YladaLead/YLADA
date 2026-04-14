import { redirect } from 'next/navigation'

export default function NutriCheckoutRedirect({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const params = new URLSearchParams()
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else if (typeof value === 'string') {
        params.set(key, value)
      }
    })
  }
  const query = params.toString()
  redirect(`/pt/precos/checkout${query ? `?${query}` : ''}`)
}



