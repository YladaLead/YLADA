import { redirect } from 'next/navigation'

/** Raiz: mesma entrada canónica que /pt (fluxo progressivo /pt/estetica). */
export default function HomePage() {
  redirect('/pt/estetica')
}
