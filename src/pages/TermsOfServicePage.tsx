
import React from 'react';
import Card from '@/components/Card';
import { APP_NAME } from '@/constants';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-grafite-profundo mb-2">Termos de Serviço do {APP_NAME}</h1>
          <p className="text-sm text-cinza-neutro">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </header>
        
        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">1. Aceitação dos Termos</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Bem-vindo ao {APP_NAME}! Ao acessar ou usar nossa plataforma ("Plataforma"), você concorda em cumprir e estar vinculado a estes Termos de Serviço ("Termos"). Estes Termos regem seu acesso e uso da Plataforma e de todos os serviços, recursos, conteúdo ou aplicativos oferecidos pelo {APP_NAME}. Se você não concorda com alguma parte destes Termos, você não está autorizado a acessar ou usar a Plataforma.
          </p>
          <p className="text-grafite-profundo leading-relaxed">
            Reservamo-nos o direito de modificar estes Termos a qualquer momento. Todas as alterações entrarão em vigor imediatamente após a publicação na Plataforma. Seu uso continuado da Plataforma após tais alterações constitui sua aceitação dos novos Termos.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">2. Uso da Plataforma</h2>
          <p className="text-grafite-profundo leading-relaxed">
            <strong>2.1 Elegibilidade:</strong> Você deve ter pelo menos 18 anos de idade para usar a Plataforma. Ao usar a Plataforma, você declara e garante que tem idade legal para formar um contrato vinculativo.
          </p>
          <p className="text-grafite-profundo leading-relaxed">
            <strong>2.2 Conta do Usuário:</strong> Para acessar certos recursos da Plataforma, você pode ser obrigado a criar uma conta. Você é responsável por manter a confidencialidade das informações da sua conta, incluindo sua senha, e por todas as atividades que ocorrem sob sua conta. Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.
          </p>
          <p className="text-grafite-profundo leading-relaxed">
            <strong>2.3 Conduta do Usuário:</strong> Você concorda em não usar a Plataforma para qualquer finalidade ilegal ou proibida por estes Termos. Você não pode usar a Plataforma de qualquer maneira que possa danificar, desabilitar, sobrecarregar ou prejudicar a Plataforma, ou interferir no uso e gozo da Plataforma por qualquer outra parte.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">3. Conteúdo do Usuário</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Você é o único responsável por todo o conteúdo que postar, carregar, vincular ou de outra forma disponibilizar através da Plataforma ("Conteúdo do Usuário"). Você retém todos os direitos sobre seu Conteúdo do Usuário, mas nos concede uma licença mundial, não exclusiva, isenta de royalties, transferível e sublicenciável para usar, reproduzir, modificar, adaptar, publicar, traduzir, criar trabalhos derivados, distribuir e exibir tal Conteúdo do Usuário em conexão com a operação da Plataforma.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">4. Interações entre Usuários</h2>
          <p className="text-grafite-profundo leading-relaxed">
            A Plataforma {APP_NAME} facilita a conexão entre Clientes que buscam serviços e Prestadores de Serviços que os oferecem. Não somos parte de nenhum acordo ou transação entre Clientes e Prestadores. Não garantimos a qualidade, segurança ou legalidade dos serviços prestados, nem a veracidade ou precisão das listagens dos Prestadores.
          </p>
          <p className="text-grafite-profundo leading-relaxed">
            Recomendamos que os Clientes exerçam devida diligência ao selecionar um Prestador de Serviços, incluindo a verificação de credenciais, referências e avaliações. {APP_NAME} não é responsável por quaisquer disputas, danos ou perdas decorrentes de interações entre Clientes e Prestadores.
          </p>
        </section>
        
        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">5. Propriedade Intelectual</h2>
          <p className="text-grafite-profundo leading-relaxed">
            A Plataforma e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva do {APP_NAME} e seus licenciadores. A Plataforma é protegida por direitos autorais, marcas registradas e outras leis do Brasil e de países estrangeiros.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">6. Limitação de Responsabilidade</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Em nenhuma circunstância o {APP_NAME}, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, ágio ou outras perdas intangíveis, resultantes de (i) seu acesso ou uso ou incapacidade de acessar ou usar a Plataforma; (ii) qualquer conduta ou conteúdo de terceiros na Plataforma; (iii) qualquer conteúdo obtido da Plataforma; e (iv) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo, seja com base em garantia, contrato, ato ilícito (incluindo negligência) ou qualquer outra teoria legal, tenhamos ou não sido informados da possibilidade de tais danos.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">7. Rescisão</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Podemos rescindir ou suspender seu acesso à Plataforma imediatamente, sem aviso prévio ou responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os Termos.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">8. Lei Aplicável</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem consideração a seus conflitos de disposições legais.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-orange-energia mb-2">9. Contato</h2>
          <p className="text-grafite-profundo leading-relaxed">
            Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em <a href="mailto:termos@resolveai.com" className="text-orange-energia hover:underline">termos@resolveai.com</a>.
          </p>
        </section>
      </Card>
    </div>
  );
};

export default TermsOfServicePage;
