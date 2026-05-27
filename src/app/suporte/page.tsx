export const metadata = {
  title: 'Support / Suporte | Ylada',
  description: 'Ylada support center — contact us and find answers. Central de suporte Ylada.',
}

export default function Suporte() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">Support / Central de Suporte</h1>
      <p className="text-sm text-gray-500 mb-6">We are here to help. / Estamos aqui para ajudar você.</p>

      {/* English section for international users / App Review */}
      <section className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-gray-700">
        <p className="font-semibold mb-2">🇺🇸 English Support</p>
        <p className="mb-1">For support in English, please contact us:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Email: <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a></li>
          <li>WhatsApp: <a href="https://wa.me/5519997230912" className="text-blue-600 underline">+55 19 99723-0912</a></li>
          <li>Business hours: Monday–Friday, 9 AM–6 PM (Brasília time, UTC-3)</li>
          <li>Response time: within 1 business day</li>
        </ul>
      </section>

      {/* Contato */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Fale conosco</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-700">E-mail de suporte</p>
            <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">
              suporte@ylada.com
            </a>
          </div>
          <div>
            <p className="font-medium text-gray-700">WhatsApp</p>
            <a
              href="https://wa.me/5519997230912"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              (19) 99723-0912
            </a>
          </div>
          <div>
            <p className="font-medium text-gray-700">Horário de atendimento</p>
            <p className="text-gray-600">Segunda a sexta, das 9h às 18h (horário de Brasília)</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          <details className="border border-gray-200 rounded-lg p-4 cursor-pointer">
            <summary className="font-medium text-gray-800">Como criar minha conta no Ylada?</summary>
            <p className="mt-3 text-sm text-gray-600">
              Acesse <a href="https://ylada.com" className="text-blue-600 underline">ylada.com</a>, clique em &quot;Criar conta&quot; e preencha seus dados. Você receberá um e-mail de confirmação.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4 cursor-pointer">
            <summary className="font-medium text-gray-800">Esqueci minha senha. O que faço?</summary>
            <p className="mt-3 text-sm text-gray-600">
              Na tela de login, clique em &quot;Esqueci minha senha&quot; e informe seu e-mail. Você receberá um link para redefinir a senha em até 5 minutos.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4 cursor-pointer">
            <summary className="font-medium text-gray-800">Como cancelo minha assinatura?</summary>
            <p className="mt-3 text-sm text-gray-600">
              Entre em contato pelo e-mail <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a> ou via WhatsApp. Nossa equipe processará o cancelamento em até 2 dias úteis.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4 cursor-pointer">
            <summary className="font-medium text-gray-800">O app está disponível para iOS e Android?</summary>
            <p className="mt-3 text-sm text-gray-600">
              Sim! O app Ylada está disponível na App Store (iPhone e iPad) e na Google Play Store. Você também pode acessar pelo navegador em <a href="https://ylada.com" className="text-blue-600 underline">ylada.com</a>.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4 cursor-pointer">
            <summary className="font-medium text-gray-800">Meus dados estão seguros?</summary>
            <p className="mt-3 text-sm text-gray-600">
              Sim. Todos os dados são protegidos com criptografia e armazenados com segurança. Consulte nossa{' '}
              <a href="/privacidade" className="text-blue-600 underline">Política de Privacidade</a> para mais detalhes.
            </p>
          </details>
        </div>
      </section>

      {/* Empresa */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sobre a empresa</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-1">
          <p><strong>Razão Social:</strong> Portal Solutions Tech &amp; Innovation Ltda</p>
          <p><strong>Nome Fantasia:</strong> YLADA</p>
          <p><strong>CNPJ:</strong> 63.447.492/0001-88</p>
          <p><strong>Endereço:</strong> R. Dona Eugênia, 345, Apto 92 — Piracicaba/SP — CEP 13.416-401</p>
          <p>
            <strong>E-mail:</strong>{' '}
            <a href="mailto:suporte@ylada.com" className="text-blue-600 underline">suporte@ylada.com</a>
          </p>
          <p>
            <strong>Política de Privacidade:</strong>{' '}
            <a href="/privacidade" className="text-blue-600 underline">ylada.com/privacidade</a>
          </p>
        </div>
      </section>
    </main>
  )
}
