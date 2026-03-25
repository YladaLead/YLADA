import { redirect } from 'next/navigation'

/** Raiz → /pt (hero); segmentos só após “Comece agora”. */
export default function HomePage() {
  redirect('/pt')
}
