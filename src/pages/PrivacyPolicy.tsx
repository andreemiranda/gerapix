import LegalPage from '../components/LegalPage';

export default function PrivacyPolicy() {
  return (
    <LegalPage title="Política de Privacidade" lastUpdated="04 de Maio de 2026">
      <p>
        Esta Política de Privacidade descreve como o GeraPix coleta, utiliza e protege as informações em conformidade com a 
        <strong> Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong>.
      </p>

      <h2>1. Controlador dos Dados</h2>
      <p>
        O responsável pelo tratamento de dados (controlador) é <strong>André Miranda</strong>, desenvolvedor independente. 
        Contato pode ser estabelecido através do perfil oficial: <a href="https://github.com/andreemiranda" target="_blank" rel="noopener noreferrer">github.com/andreemiranda</a>.
      </p>

      <h2>2. Dados Coletados e Finalidade</h2>
      <p>
        Coletamos apenas o mínimo necessário para a prestação do serviço:
      </p>
      <table>
        <thead>
          <tr>
            <th>Dado</th>
            <th>Finalidade</th>
            <th>Base Legal (LGPD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dados de Configuração (Chave PIX, Nome da Loja)</td>
            <td>Gerar o QR Code para recebimento de valores.</td>
            <td>Execução de Contrato</td>
          </tr>
          <tr>
            <td>E-mail de Autenticação</td>
            <td>Acesso seguro ao painel administrativo.</td>
            <td>Execução de Contrato</td>
          </tr>
          <tr>
            <td>Registros de Transações (Anônimos)</td>
            <td>Relatório financeiro para o administrador (valor e data).</td>
            <td>Legítimo Interesse</td>
          </tr>
          <tr>
            <td>Cookies de Preferência</td>
            <td>Armazenar seu consentimento sobre o uso de cookies.</td>
            <td>Cumprimento de Obrigação Legal</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Compartilhamento de Dados</h2>
      <p>
        O GeraPix não vende ou compartilha seus dados para fins comerciais. Os dados são processados por parceiros de infraestrutura essenciais:
      </p>
      <ul>
        <li><strong>Google Firebase:</strong> Armazenamento de banco de dados (Firestore) e autenticação. Possui conformidade com a LGPD e GDPR.</li>
        <li><strong>Netlify:</strong> Provedor de hospedagem e entrega de conteúdo.</li>
      </ul>

      <h2>4. Seus Direitos (Art. 18 LGPD)</h2>
      <p>
        Como titular de dados, você possui direitos que garantimos através do nosso canal de contato:
      </p>
      <ul>
        <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e acessá-los.</li>
        <li><strong>Correção:</strong> Solicitar alteração de dados incompletos ou inexatos.</li>
        <li><strong>Eliminação:</strong> Pedir a exclusão de dados desnecessários ou tratados em desconformidade.</li>
        <li><strong>Revogação do Consentimento:</strong> Você pode mudar sua decisão sobre cookies a qualquer momento no rodapé do site.</li>
      </ul>

      <h2>5. Retenção e Segurança</h2>
      <p>
        Os registros de transações no dashboard são retidos por um período de <strong>60 dias</strong>, após o qual são automaticamente removidos de nossos registros ativos. 
        Dados de conta administrativa são mantidos enquanto o usuário mantiver seu cadastro ativo.
      </p>
      <p>
        Implementamos medidas técnicas como HTTPS, regras de segurança granulares no banco de dados e autenticação via provedores confiáveis.
      </p>

      <h2>6. Transferência Internacional</h2>
      <p>
        Os dados podem ser armazenados em servidores localizados fora do Brasil (EUA), operados pelo Google Cloud/Firebase, sob cláusulas contratuais padrão que garantem proteção equivalente à brasileira.
      </p>

      <h2>7. Encarregado e Autoridade Nacional</h2>
      <p>
        Para qualquer dúvida sobre seus dados, entre em contato com André Miranda via GitHub. Você também tem o direito de peticionar à <strong>ANPD (Autoridade Nacional de Proteção de Dados)</strong> em anpd.gov.br.
      </p>
    </LegalPage>
  );
}
