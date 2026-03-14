import EditarLinkPage from '@/app/pt/(matrix)/links/editar/[id]/page'

export default function NutraEditarLinkPage(props: { params: Promise<{ id: string }> }) {
  return <EditarLinkPage params={props.params} />
}
