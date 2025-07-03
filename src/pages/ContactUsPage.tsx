import React, { useState, FormEvent } from 'react';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast'; // Import useToast

const ContactUsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast(); // Get addToast function
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // Inline error for validation, success will be via toast
  const [validationError, setValidationError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setIsLoading(true);

    if (!name || !email || !subject || !message) {
      setValidationError('Por favor, preencha todos os campos.');
      addToast('Por favor, preencha todos os campos.', 'error');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    console.log('Contact form submitted:', { name, email, subject, message });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success response
    addToast('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.', 'success');
    setName(user?.name || '');
    setEmail(user?.email || '');
    setSubject('');
    setMessage('');
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-grafite-profundo">Fale Conosco</h1>
          <p className="text-lg text-cinza-neutro mt-2">
            Tem alguma dúvida, sugestão ou precisa de suporte? Entre em contato!
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Seu Nome"
            name="name"
            type="text"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={!!user?.name} 
            error={validationError && !name ? 'Nome é obrigatório' : undefined}
          />
          <Input
            label="Seu E-mail"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!user?.email}
            error={validationError && !email ? 'E-mail é obrigatório' : undefined}
          />
          <Input
            label="Assunto"
            name="subject"
            type="text"
            placeholder="Sobre o que você gostaria de falar?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            error={validationError && !subject ? 'Assunto é obrigatório' : undefined}
          />
          <Textarea
            label="Sua Mensagem"
            name="message"
            rows={6}
            placeholder="Escreva sua mensagem detalhadamente aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            error={validationError && !message ? 'Mensagem é obrigatória' : undefined}
          />

          {/* General form error can be shown here if needed, but toast handles most cases */}
          {validationError && (name && email && subject && message) && 
            <p className="text-sm text-red-600 text-center p-3 bg-red-100 rounded-md">{validationError}</p>
          }

          <Button type="submit" isLoading={isLoading} fullWidth variant="primary" size="lg">
            {isLoading ? 'Enviando Mensagem...' : 'Enviar Mensagem'}
          </Button>
        </form>

        <div className="mt-12 text-center border-t pt-8">
            <h2 className="text-xl font-semibold text-grafite-profundo mb-3">Outras Formas de Contato</h2>
            <p className="text-cinza-neutro">
                <strong>E-mail:</strong> <a href="mailto:contato@resolveai.com" className="text-orange-energia hover:underline">contato@resolveai.com</a>
            </p>
            <p className="text-cinza-neutro">
                <strong>Telefone (Suporte):</strong> (77) 99999-9999 (Seg-Sex, 9h-18h)
            </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;