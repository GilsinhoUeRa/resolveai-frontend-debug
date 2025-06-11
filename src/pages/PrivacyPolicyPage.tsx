
import React from 'react';
import Card from '@/components/Card';
import { APP_NAME } from '@/constants';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-grafite-profundo mb-2">Política de Privacidade do {APP_NAME}</h1>
          <p className="text-sm text-cinza-neutro">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </header>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">1. Introdução</h2>
          <p className="text-grafite-profundo leading-relaxed">
            A sua privacidade é importante para nós no {APP_NAME}. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nossa plataforma ("Plataforma"). Leia esta política com atenção. Se você não concorda com os termos desta política de privacidade, por favor, não acesse a Plataforma.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">2. Coleta de Informações</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Podemos coletar informações sobre você de várias maneiras. As informações que podemos coletar na Plataforma incluem:
          </p>
          <ul className="list-disc list-inside text-grafite-profundo space-y-1 pl-4">
            <li>
              <strong>Dados Pessoais:</strong> Informações de identificação pessoal, como seu nome, endereço de e-mail, número de telefone, cidade e informações demográficas, que você nos fornece voluntariamente ao se registrar na Plataforma ou ao participar de várias atividades relacionadas à Plataforma.
            </li>
            <li>
              <strong>Dados Derivados:</strong> Informações que nossos servidores coletam automaticamente quando você acessa a Plataforma, como seu endereço IP, tipo de navegador, sistema operacional, horários de acesso e as páginas que você visualizou diretamente antes e depois de acessar a Plataforma.
            </li>
            <li>
              <strong>Dados de Dispositivos Móveis:</strong> Informações do dispositivo, como ID do seu dispositivo móvel, modelo e fabricante, e informações sobre a localização do seu dispositivo, se você acessar a Plataforma a partir de um dispositivo móvel.
            </li>
            <li>
              <strong>Conteúdo Gerado pelo Usuário:</strong> Informações que você fornece ao interagir com a Plataforma, como avaliações, mensagens, informações de perfil de prestador (biografia, especialidades, etc.).
            </li>
          </ul>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">3. Uso de Suas Informações</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Ter informações precisas sobre você nos permite fornecer uma experiência tranquila, eficiente e personalizada. Especificamente, podemos usar as informações coletadas sobre você através da Plataforma para:
          </p>
          <ul className="list-disc list-inside text-grafite-profundo space-y-1 pl-4">
            <li>Criar e gerenciar sua conta.</li>
            <li>Processar suas transações e enviar informações relacionadas.</li>
            <li>Facilitar a comunicação entre usuários (Clientes e Prestadores).</li>
            <li>Enviar e-mails administrativos, de marketing e outros.</li>
            <li>Personalizar e melhorar sua experiência na Plataforma.</li>
            <li>Monitorar e analisar o uso e as tendências para melhorar a Plataforma.</li>
            <li>Resolver disputas e solucionar problemas.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">4. Divulgação de Suas Informações</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Podemos compartilhar informações que coletamos sobre você em certas situações. Suas informações podem ser divulgadas da seguinte forma:
          </p>
          <ul className="list-disc list-inside text-grafite-profundo space-y-1 pl-4">
            <li>
              <strong>Por Lei ou para Proteger Direitos:</strong> Se acreditarmos que a liberação de informações sobre você é necessária para responder a processos legais, investigar ou remediar potenciais violações de nossas políticas, ou proteger os direitos, propriedade e segurança de outros, podemos compartilhar suas informações conforme permitido ou exigido por qualquer lei, regra ou regulamento aplicável.
            </li>
            <li>
              <strong>Prestadores de Serviços Terceirizados:</strong> Podemos compartilhar suas informações com terceiros que realizam serviços para nós ou em nosso nome, incluindo processamento de pagamentos, análise de dados, entrega de e-mail, serviços de hospedagem, atendimento ao cliente e assistência de marketing.
            </li>
            <li>
              <strong>Comunicação entre Usuários:</strong> Se você é um Cliente, algumas de suas informações (como seu nome ao enviar uma mensagem ou avaliação) podem ser visíveis para os Prestadores. Se você é um Prestador, seu perfil, incluindo nome, foto, profissão, especialidades, cidade e biografia, será visível para outros usuários da Plataforma.
            </li>
            <li>
              <strong>Transferências de Negócios:</strong> Podemos compartilhar ou transferir suas informações em conexão com, ou durante negociações de, qualquer fusão, venda de ativos da empresa, financiamento ou aquisição de toda ou parte de nossos negócios para outra empresa.
            </li>
          </ul>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">5. Segurança de Suas Informações</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Usamos medidas de segurança administrativas, técnicas e físicas para ajudar a proteger suas informações pessoais. Embora tenhamos tomado medidas razoáveis para proteger as informações pessoais que você nos fornece, esteja ciente de que, apesar de nossos esforços, nenhuma medida de segurança é perfeita ou impenetrável, e nenhum método de transmissão de dados pode ser garantido contra qualquer interceptação ou outro tipo de uso indevido.
          </p>
        </section>
        
        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">6. Seus Direitos de Privacidade</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais. Isso pode incluir o direito de acessar, corrigir, excluir ou restringir o uso de suas informações pessoais. Para exercer esses direitos, entre em contato conosco usando as informações de contato fornecidas abaixo.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">7. Política para Crianças</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Não solicitamos intencionalmente informações de ou comercializamos para crianças menores de 13 anos. Se tomarmos conhecimento de que coletamos informações pessoais de uma criança menor de 13 anos sem verificação do consentimento dos pais, excluiremos essas informações o mais rápido possível.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">8. Contato</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Se você tiver alguma dúvida ou comentário sobre esta Política de Privacidade, entre em contato conosco em:
          </p>
          <p className="text-grafite-profundo leading-relaxed">
            {APP_NAME} - Departamento de Privacidade<br />
            Email: <a href="mailto:privacidade@resolveai.com" className="text-orange-energia hover:underline">privacidade@resolveai.com</a>
          </p>
        </section>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
