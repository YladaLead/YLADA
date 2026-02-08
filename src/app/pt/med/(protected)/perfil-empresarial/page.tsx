import YladaAreaShell from '@/components/ylada/YladaAreaShell'

export default function MedPerfilEmpresarialPage() {
  return (
    <YladaAreaShell areaCodigo="med" areaLabel="Medicina">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Perfil empresarial</h1>
        <p className="text-gray-600 mb-4">
          Suas características, metas, objetivos e especialidades. O Noel usa essas informações para
          personalizar as orientações. Você pode entrar aqui a qualquer momento para preencher ou editar.
        </p>
        <p className="text-sm text-gray-500">
          Formulário de perfil em construção — em breve você poderá salvar e editar tudo aqui.
        </p>
      </div>
    </YladaAreaShell>
  )
}
