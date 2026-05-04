import LegalPage from '../components/LegalPage';

export default function CookiePolicy() {
  return (
    <LegalPage title="Política de Cookies" lastUpdated="04 de Maio de 2026">
      <p>
        Esta política explica como utilizamos cookies e tecnologias semelhantes para reconhecê-lo quando você visita nosso site. 
        Ela detalha o que são essas tecnologias, por que as utilizamos e seus direitos de controlá-las.
      </p>

      <h2>1. O que são Cookies?</h2>
      <p>
        Cookies são pequenos arquivos de dados colocados no seu computador ou dispositivo móvel quando você visita um site. 
        Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente, além de fornecer informações de relatório.
      </p>

      <h2>2. Por que usamos cookies?</h2>
      <p>
        Usamos cookies de "primeira parte" por razões técnicas, para que nosso site funcione corretamente. 
        Estes são chamados de cookies "estritamente necessários".
      </p>

      <h2>3. Cookies utilizados no GeraPix</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Finalidade</th>
            <th>Duração</th>
            <th>Obrigatório</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>gerapix_cookie_consent</td>
            <td>Preferência</td>
            <td>Armazena sua decisão sobre o consentimento LGPD.</td>
            <td>1 ano</td>
            <td>Sim</td>
          </tr>
          <tr>
            <td>firebase-auth-token</td>
            <td>Sessão</td>
            <td>Mantém o administrador conectado ao painel.</td>
            <td>Sessão</td>
            <td>Sim (Funcional)</td>
          </tr>
          <tr>
            <td>_ga, _gid</td>
            <td>Analítico</td>
            <td>Google Analytics (se habilitado) - estatísticas anônimas.</td>
            <td>2 anos</td>
            <td>Não</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Como gerenciar seus cookies?</h2>
      <p>
        Você tem o direito de decidir se aceita ou rejeita cookies.
      </p>
      <ul>
        <li><strong>Pelo Site:</strong> Você pode revogar seu consentimento a qualquer momento clicando no link "Gerenciar Consentimento" localizado no rodapé do nosso site.</li>
        <li><strong>Pelo Navegador:</strong> Você pode configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado.</li>
      </ul>

      <h2>5. Alterações nesta Política</h2>
      <p>
        Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças nos cookies que utilizamos ou por outras razões operacionais, legais ou regulamentares.
      </p>

      <h2>6. Contato</h2>
      <p>
        Se você tiver dúvidas sobre o uso de cookies no GeraPix, entre em contato via repositório GitHub do projeto.
      </p>
    </LegalPage>
  );
}
