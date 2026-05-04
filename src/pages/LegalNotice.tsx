import LegalPage from '../components/LegalPage';

export default function LegalNotice() {
  return (
    <LegalPage title="Aviso Legal" lastUpdated="04 de Maio de 2026">
      <p>
        Este Aviso Legal estabelece diretrizes importantes sobre o uso e a natureza da plataforma GeraPix.
      </p>

      <h2>1. Independência do Projeto</h2>
      <p>
        O GeraPix é um projeto de código aberto e gratuito, desenvolvido de forma independente por <strong>André Miranda</strong>. 
        Este software não possui qualquer vínculo oficial, patrocínio ou autorização direta do <strong>Banco Central do Brasil</strong> ou de qualquer instituição financeira.
      </p>

      <h2>2. Marcas e Direitos</h2>
      <p>
        A marca <strong>PIX</strong> e todos os logotipos associados ao sistema de pagamentos instantâneos são de propriedade exclusiva do Banco Central do Brasil. 
        O GeraPix apenas utiliza o padrão tecnológico aberto disponibilizado pelo órgão para fins de interoperabilidade.
      </p>

      <h2>3. Isenção de Responsabilidade Financeira</h2>
      <p>
        Como o serviço apenas gera o código de pagamento (payload/QR Code) com base em dados inseridos pelo próprio usuário administrador, 
        o desenvolvedor exime-se de qualquer responsabilidade sobre:
      </p>
      <ul>
        <li>Erros de digitação ou chaves incorretas que levem a transferências errôneas;</li>
        <li>Fraudes cometidas por terceiros usando a ferramenta;</li>
        <li>Bloqueios de contas ou falhas operacionais em bancos ou fintechs.</li>
      </ul>

      <h2>4. Uso de Código Aberto</h2>
      <p>
        A natureza <em>open-source</em> do projeto permite que qualquer pessoa audite a forma como os dados são tratados. 
        Recomendamos que usuários técnicos verifiquem o código disponível no GitHub oficial caso tenham dúvidas sobre segurança.
      </p>

      <h2>5. Contato Técnico</h2>
      <p>
        Para questões técnicas ou notificações legais, utilize o sistema de Issues do GitHub no endereço: 
        <a href="https://github.com/andreemiranda" target="_blank" rel="noopener noreferrer">github.com/andreemiranda</a>.
      </p>
    </LegalPage>
  );
}
