
// constants/mockData.ts
// ATENÇÃO: Estes dados mock são para fins de desenvolvimento e teste.
// Em uma aplicação de produção, todos esses dados seriam gerenciados
// e fornecidos por um backend e um banco de dados.

import { ProviderDetails, Review, UserType } from '../types';

// Dados mock para detalhes de provedores, anteriormente em ProviderProfilePage.tsx
export const MOCK_PROVIDERS_DETAILS_DATA: ProviderDetails[] = [
   {
    id: 'provider1_static_fallback', name: 'Ana Silva (Fallback)', email: 'ana-fallback@example.com', userType: UserType.PROVIDER, city: 'São Paulo',
    whatsApp: '11999998888', 
    profession: { id: '1', name: 'Encanador', description: 'Serviços de encanamento.' },
    specialties: [{id: 'sp1', name: 'Reparos de Vazamento'}, {id: 'sp2', name: 'Instalação de Torneiras'}, {id: 'sp1a', name: 'Caça Vazamentos'}, {id: 'sp1b', name: 'Desentupimento'}],
    workingHours: 'Segunda a Sexta, das 9h às 18h. Sábados, das 9h às 13h.', 
    paymentMethods: [{id: 'cash', name: 'Dinheiro'}, {id: 'pix', name: 'PIX'}, {id: 'card', name: 'Cartão de Crédito/Débito'}],
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60',
    bio: 'Encanadora experiente com mais de 10 anos no mercado, especializada em reparos rápidos e eficientes para residências e comércios. Ofereço garantia em todos os serviços e orçamento sem compromisso. Atendo toda a região metropolitana de São Paulo.',
    isVerified: true, isNew: false, isTopRated: true, averageRating: 4.8, reviewCount: 125,
  },
  {
    id: 'provider2_static_fallback', name: 'Carlos Pereira (Fallback)', email: 'carlos-fallback@example.com', userType: UserType.PROVIDER, city: 'Rio de Janeiro',
    whatsApp: '21988887777', 
    profession: { id: '2', name: 'Eletricista', description: 'Serviços elétricos.' },
    specialties: [{id: 'sp3', name: 'Instalação Elétrica Residencial'}, {id: 'sp4', name: 'Reparo de Curto-circuito'}, {id: 'sp3a', name: 'Manutenção Preventiva'}, {id: 'sp3b', name: 'Instalação de Luminárias'}],
    workingHours: 'Segunda a Sábado, das 8h às 20h. Atendimento emergencial 24h.', 
    paymentMethods: [{id: 'card', name: 'Cartão'}, {id: 'bank_transfer', name: 'Transferência Bancária'}, {id: 'pix', name: 'PIX'}],
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60',
    bio: 'Eletricista qualificado e certificado, com vasta experiência em todos os tipos de serviços elétricos para residências e comércios. Segurança e qualidade são minhas prioridades. Disponível para emergências na cidade do Rio de Janeiro.',
    isVerified: true, isNew: false, isTopRated: false, averageRating: 4.5, reviewCount: 88,
  },
   {
    id: 'provider3_static_fallback', name: 'Mariana Costa (Fallback)', email: 'mariana-fallback@example.com', userType: UserType.PROVIDER, city: 'São Paulo',
    whatsApp: '11977776666', 
    profession: { id: '7', name: 'Desenvolvedor Web', description: 'Criação de sites e sistemas.' },
    specialties: [{id: 'sp5', name: 'React'}, {id: 'sp6', name: 'Node.js'}],
    workingHours: 'Horário comercial', 
    paymentMethods: [{id: 'pix', name: 'PIX'}],
    photoUrl: '', 
    bio: 'Dev Full-Stack apaixonada por criar soluções web inovadoras e responsivas. Especialista em React, Node.js e bancos de dados SQL e NoSQL. Sempre em busca de novos desafios e aprendizados.',
    averageRating: 5.0, reviewCount: 42, isNew: true, isVerified: true,
  },
];

// Dados mock para avaliações, anteriormente em ProviderProfilePage.tsx e MyReviewsPage.tsx
// Um mock global para reviews pode ser armazenado no localStorage para simular persistência entre sessões de desenvolvimento.
// MOCK_REVIEWS agora pode ser apenas um conjunto inicial ou ser gerenciado de forma mais dinâmica para testes.
export const MOCK_REVIEWS: Review[] = [
  { id: 'review1', clientId: 'client1', clientName: 'João Fulano', providerId: 'provider1_static_fallback', rating: 5, comment: 'Excelente profissional! Resolveu meu problema rapidamente.', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'review2', clientId: 'client2', clientName: 'Maria Ciclana', providerId: 'provider1_static_fallback', rating: 4, comment: 'Bom serviço, mas demorou um pouco para agendar.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'review3', clientId: 'client3', clientName: 'Pedro Beltrano', providerId: 'provider2_static_fallback', rating: 5, comment: 'Muito atencioso e competente. Recomendo!', date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'review_dynamic_1', clientId: 'client_abc', clientName: 'Cliente Dinâmico X', providerId: 'user_1721843715139_e2af5650b', rating: 5, comment: 'Ótimo serviço do prestador dinâmico!', date: new Date().toISOString() },
  { id: 'review1_user1', clientId: 'currentUserClient1', clientName: 'João Fulano Logado', providerId: 'provider1_static_fallback', rating: 5, comment: 'Serviço de encanamento da Ana foi impecável! Rápida e eficiente.', date: new Date(Date.now() - 86400000 * 3).toISOString(), clientPhotoUrl:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: 'review4_user1', clientId: 'currentUserClient1', clientName: 'João Fulano Logado', providerId: 'provider2_static_fallback', rating: 4, comment: 'Carlos resolveu a fiação da minha casa. Profissional e atencioso.', date: new Date(Date.now() - 86400000 * 10).toISOString(), clientPhotoUrl:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: 'review5_user2', clientId: 'anotherUser', clientName: 'Sofia Oliveira', providerId: 'provider3_static_fallback', rating: 3, comment: 'O site ficou bom, mas o prazo estourou um pouco.', date: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: 'review_last_week_user1', clientId: 'currentUserClient1', clientName: 'João Fulano Logado', providerId: 'provider3_static_fallback', rating: 5, comment: 'Mariana desenvolveu meu e-commerce com maestria! Entregou antes do prazo e com qualidade excepcional. Recomendo demais!', date: new Date(Date.now() - 86400000 * 7).toISOString(), clientPhotoUrl:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
];
// Para inicializar o localStorage com os mocks de reviews (opcional, apenas para desenvolvimento):
// }
