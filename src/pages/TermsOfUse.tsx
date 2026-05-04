import LegalPage from '../components/LegalPage';

export default function TermsOfUse() {
  return (
    <LegalPage title="Termos de Uso" lastUpdated="04 de Maio de 2026">
      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao acessar e utilizar a plataforma GeraPix, você declara ter lido, compreendido e concordado em estar vinculado a estes Termos de Uso. 
        Se você não concordar com qualquer parte destes termos, não deverá utilizar o serviço.
      </p>

      <h2>2. Descrição do Serviço</h2>
      <p>
        O GeraPix é uma ferramenta tecnológica gratuita desenvolvida de forma independente para facilitar a geração de QR Codes e payloads no padrão PIX, 
        seguindo as especificações do Banco Central do Brasil.
      </p>
      <p>
        <strong>Importante:</strong> O GeraPix não é uma instituição financeira, não processa pagamentos, não armazena saldo e não intermedia transações. 
        Toda e qualquer transação financeira ocorre diretamente entre as instituições bancárias dos usuários envolvidos.
      </p>

      <h2>3. Responsabilidades do Usuário</h2>
      <ul>
        <li><strong>Precisão dos Dados:</strong> É de total responsabilidade do usuário (administrador) fornecer uma chave PIX válida e correta. O GeraPix não verifica a titularidade da chave junto ao Banco Central.</li>
        <li><strong>Uso Lícito:</strong> O usuário compromete-se a não utilizar a ferramenta para fins ilícitos, fraudulentos ou que violem normas do sistema financeiro nacional.</li>
        <li><strong>Segurança:</strong> O administrador é responsável por manter a segurança de seu acesso (e-mail/senha) ao painel de configurações.</li>
      </ul>

      <h2>4. Limitação de Responsabilidade</h2>
      <p>
        O GeraPix é fornecido "como está" e "conforme disponível". O desenvolvedor não garante que a ferramenta estará sempre livre de erros ou interrupções.
      </p>
      <p>
        O desenvolvedor não se responsabiliza por:
      </p>
      <ul>
        <li>Erros de transferência causados pelo fornecimento de chaves PIX incorretas pelo usuário;</li>
        <li>Indisponibilidade do Sistema PIX do Banco Central ou das APIs bancárias;</li>
        <li>Prejuízos financeiros decorrentes de falhas de rede ou hardware do usuário.</li>
      </ul>

      <h2>5. Propriedade Intelectual</h2>
      <p>
        O GeraPix é um projeto de código aberto (open-source). O código-fonte está disponível no repositório GitHub de André Miranda sob a licença MIT (ou conforme indicado no repositório).
      </p>
      <p>
        As marcas "PIX" e o logotipo do PIX são de titularidade do Banco Central do Brasil.
      </p>

      <h2>6. Dados e Privacidade</h2>
      <p>
        O tratamento de dados pessoais no GeraPix é realizado em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD). 
        Para mais detalhes, consulte nossa <a href="/politica-de-privacidade">Política de Privacidade</a>.
      </p>

      <h2>7. Alterações nos Termos</h2>
      <p>
        Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações entrarão em vigor imediatamente após sua publicação no site. 
        O uso continuado da ferramenta após tais alterações constitui sua aceitação dos novos termos.
      </p>

      <h2>8. Legislação Aplicável</h2>
      <p>
        Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de residência do desenvolvedor para dirimir quaisquer controvérsias.
      </p>

      <h2>9. Contato</h2>
      <p>
        Dúvidas ou sugestões podem ser encaminhadas através do canal de e-mail de suporte ou via Issues no repositório GitHub do projeto.
      </p>
    </LegalPage>
  );
}
