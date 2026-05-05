/** Path público /l/… ou /en|es/l/… — devolve o segmento de membro (segundo após o slug). */
export function parseProLideresMemberPathSegment(pathname: string): string | null {
  const m =
    pathname.match(/^\/(?:en|es)\/l\/[^/]+\/([^/]+)\/?$/) ?? pathname.match(/^\/l\/[^/]+\/([^/]+)\/?$/)
  return m ? decodeURIComponent(m[1]) : null
}
