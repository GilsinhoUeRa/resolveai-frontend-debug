import { ProfessionCategory, Profession, Specialty, SubscriptionPlan } from '@/types'; 

export const APP_NAME = "ResolveAi";
export const APP_SLOGAN = "Conectando quem precisa com quem resolve";

export const COLORS = {
  ORANGE_ENERGIA: '#f57c00',
  GRAFITE_PROFUNDO: '#212121',
  CINZA_NEUTRO: '#9e9e9e',
  LIGHT_BG: '#f4f4f5',
  WHITE: '#ffffff',
  SUCCESS: '#4caf50', 
  ERROR: '#f44336',   
  INFO: '#2196f3',    
  WARNING: '#ff9800' 
};

export const APP_ROUTES = {
  WELCOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/home',
  PROVIDERS: '/providers',
  PROVIDER_PROFILE: '/provider', 
  PROVIDER_REGISTER: '/provider-registration',
  CONTACT: '/contact',
  USER_PROFILE: '/profile',
  MY_REVIEWS: '/my-reviews', 
  CHAT_LIST: '/chat', 
  CHAT_CONVERSATION: '/chat', 
  TERMS_OF_SERVICE: '/terms-of-service',
  PRIVACY_POLICY: '/privacy-policy',
  NOTIFICATIONS_HISTORY: '/notifications',
  MY_FAVORITES: '/my-favorites', 
  PRICING_PLANS: '/pricing-plans', // Nova rota para planos
  
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROFESSIONS: '/admin/professions',
  ADMIN_SPECIALTIES: '/admin/specialties',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users', 
  ADMIN_SETTINGS: '/admin/settings', 
};

// Dados Mock que serão gerenciados pelo Admin
export const MANAGED_PROFESSIONS_STORAGE_KEY = 'resolveai_managed_professions';
export const MANAGED_SPECIALTIES_STORAGE_KEY = 'resolveai_managed_specialties';
export const MANAGED_CATEGORIES_STORAGE_KEY = 'resolveai_managed_categories'; 

export const MOCK_PROFESSIONS: Profession[] = [ 
  { id: '1', name: 'Encanador', description: 'Serviços de encanamento em geral, reparos e instalações.' },
  { id: '2', name: 'Eletricista', description: 'Serviços elétricos residenciais e comerciais.' },
  { id: '3', name: 'Marceneiro', description: 'Fabricação e reparo de móveis planejados e sob medida.' },
  { id: '4', name: 'Pintor', description: 'Serviços de pintura residencial e comercial.' },
  { id: '5', name: 'Jardineiro', description: 'Manutenção de jardins, podas e paisagismo.' },
  { id: '6', name: 'Babá', description: 'Cuidados infantis para diversas idades.' },
  { id: '7', name: 'Desenvolvedor Web', description: 'Criação de sites, sistemas e aplicativos web.' },
  { id: '8', name: 'Designer Gráfico', description: 'Criação de identidades visuais, logos e materiais gráficos.' },
  { id: '9', name: 'Mecânico de Automóveis', description: 'Manutenção e reparo de veículos automotores.' },
  { id: '10', name: 'Eletricista Automotivo', description: 'Serviços elétricos para veículos.' },
  { id: '11', name: 'Veterinário', description: 'Cuidados de saúde para animais de estimação.' },
  { id: '12', name: 'Passeador de Cães', description: 'Serviços de passeio e exercícios para cães.' },
  { id: '13', name: 'Tosador de Animais', description: 'Serviços de banho, tosa e estética animal.' },
  { id: '14', name: 'Técnico de Informática', description: 'Manutenção de computadores, notebooks e redes.' },
  { id: '15', name: 'Suporte Técnico de TI', description: 'Assistência técnica para hardware e software.' },
  { id: '16', name: 'Professor de Idiomas', description: 'Aulas particulares ou em grupo de diversos idiomas.' },
  { id: '17', name: 'Professor Particular', description: 'Aulas de reforço para diversas matérias escolares.' },
  { id: '18', name: 'Consultor de Marketing', description: 'Consultoria para estratégias de marketing digital e offline.' },
  { id: '19', name: 'Consultor Financeiro', description: 'Planejamento financeiro pessoal e empresarial.' },
  { id: '20', name: 'Pedreiro', description: 'Serviços de alvenaria, construção e reformas.' },
  { id: '21', name: 'Gesseiro', description: 'Serviços de instalação e reparo de gesso.' },
  { id: '22', name: 'Azulejista', description: 'Colocação de pisos, azulejos e revestimentos.' },
  { id: '23', name: 'Diarista/Faxineiro(a)', description: 'Serviços de limpeza residencial e comercial.' },
  { id: '24', name: 'Organizador(a) Profissional', description: 'Organização de ambientes residenciais e comerciais.' },
  { id: '25', name: 'Motorista Particular', description: 'Transporte de passageiros para diversas finalidades.' },
  { id: '26', name: 'Entregador', description: 'Serviços de entrega de mercadorias e documentos.' },
  { id: '27', name: 'Advogado', description: 'Consultoria e representação jurídica em diversas áreas.' },
  { id: '28', name: 'Contador', description: 'Serviços contábeis para pessoas físicas e jurídicas.' },
  { id: '29', name: 'Fotógrafo', description: 'Cobertura de eventos, ensaios fotográficos e fotos de produtos.' },
  { id: '30', name: 'Chaveiro', description: 'Serviços de abertura de portas, cópias de chaves e reparos.' },
  { id: '31', name: 'Personal Trainer', description: 'Treinamento físico personalizado.' },
  { id: '32', name: 'Nutricionista', description: 'Orientação alimentar e dietas personalizadas.' },
  { id: '33', name: 'Fisioterapeuta', description: 'Tratamento e reabilitação de lesões e disfunções.' },
  { id: '34', name: 'Montador de Móveis', description: 'Montagem de móveis convencionais e planejados.'},
  { id: '35', name: 'Técnico de Ar Condicionado', description: 'Instalação e manutenção de sistemas de ar condicionado.'},
  { id: '36', name: 'Cozinheiro(a) Particular', description: 'Preparo de refeições personalizadas em domicílio.'},
];

export const MOCK_SPECIALTIES_FALLBACK: Specialty[] = [
  { id: 'sp1', name: 'Reparos de Vazamento' }, { id: 'sp2', name: 'Instalação de Torneiras' },
  { id: 'sp1a', name: 'Caça Vazamentos' }, { id: 'sp1b', name: 'Desentupimento' },
  { id: 'sp3', name: 'Instalação Elétrica Residencial' }, { id: 'sp4', name: 'Reparo de Curto-circuito' },
  { id: 'sp3a', name: 'Manutenção Preventiva Elétrica' }, { id: 'sp3b', name: 'Instalação de Luminárias' },
  { id: 'sp5', name: 'Desenvolvimento Frontend (React, Vue, Angular)' }, { id: 'sp6', name: 'Desenvolvimento Backend (Node.js, Python, Java)'}, 
  { id: 'sp5a', name: 'Criação de Landing Pages' }, { id: 'sp6a', name: 'Desenvolvimento de APIs REST' },
  { id: 'sp7', name: 'Manutenção de Computadores Desktop' }, { id: 'sp7a', name: 'Manutenção de Notebooks' },
  { id: 'sp8', name: 'Configuração de Redes Wi-Fi' }, { id: 'sp8a', name: 'Segurança de Redes' },
  { id: 'sp9', name: 'Design de Interiores Residenciais'}, { id: 'sp9a', name: 'Design de Interiores Comerciais'},
  { id: 'sp10', name: 'Consultoria de Imagem e Estilo Pessoal'}, { id: 'sp10a', name: 'Personal Shopper'},
  { id: 'sp11', name: 'Maquiagem para Eventos Sociais'}, { id: 'sp11a', name: 'Maquiagem para Noivas'},
  { id: 'sp12', name: 'Penteados para Festas'}, { id: 'sp12a', name: 'Corte e Coloração'},
  { id: 'sp13', name: 'Limpeza Pós-obra'}, { id: 'sp13a', name: 'Limpeza de Vidros'},
  { id: 'sp14', name: 'Organização de Closets e Armários'}, { id: 'sp14a', name: 'Organização de Cozinhas'},
  { id: 'sp15', name: 'Aulas de Inglês Conversação'}, { id: 'sp15a', name: 'Aulas de Espanhol Básico'},
  { id: 'sp16', name: 'Reforço Escolar (Matemática)'}, { id: 'sp16a', name: 'Reforço Escolar (Português)'},
  { id: 'sp_mec1', name: 'Troca de Óleo e Filtros' }, { id: 'sp_mec2', name: 'Alinhamento e Balanceamento' }, { id: 'sp_mec3', name: 'Reparos de Motor' }, { id: 'sp_mec4', name: 'Sistema de Freios' },
  { id: 'sp_vet1', name: 'Consultas Veterinárias' }, { id: 'sp_vet2', name: 'Vacinação Animal' }, { id: 'sp_vet3', name: 'Pequenas Cirurgias Veterinárias' },
  { id: 'sp_pet1', name: 'Passeios Individuais' }, { id: 'sp_pet2', name: 'Tosa Higiênica' }, { id: 'sp_pet3', name: 'Banho e Tosa Completa' },
  { id: 'sp_ti1', name: 'Formatação de PCs/Notebooks' }, { id: 'sp_ti2', name: 'Remoção de Vírus e Malware' },
  { id: 'sp_consult1', name: 'SEO (Otimização para Buscadores)' }, { id: 'sp_consult2', name: 'Gestão de Mídias Sociais' }, { id: 'sp_consult3', name: 'Planejamento Estratégico de Negócios' },
  { id: 'sp_const1', name: 'Alvenaria Estrutural' }, { id: 'sp_const2', name: 'Reboco e Acabamentos' }, { id: 'sp_const3', name: 'Instalação de Porcelanato' },
  { id: 'sp_limp1', name: 'Limpeza Residencial Profunda' }, { id: 'sp_limp2', name: 'Limpeza Comercial (Escritórios)' },
  { id: 'sp_trans1', name: 'Transporte Executivo' }, { id: 'sp_trans2', name: 'Pequenas Mudanças e Carretos' },
  { id: 'sp_legal1', name: 'Direito Cível' }, { id: 'sp_legal2', name: 'Direito Trabalhista' }, { id: 'sp_cont1', name: 'Declaração de Imposto de Renda (IRPF)' }, { id: 'sp_cont2', name: 'Abertura e Encerramento de MEI' },
  { id: 'sp_foto1', name: 'Ensaios Fotográficos Externos' }, { id: 'sp_foto2', name: 'Cobertura Fotográfica de Eventos' },
  { id: 'sp_chave1', name: 'Abertura de Portas Residenciais' }, { id: 'sp_chave2', name: 'Chaves Codificadas Automotivas' },
  { id: 'sp_train1', name: 'Treinamento Funcional' }, { id: 'sp_train2', name: 'Musculação e Hipertrofia' },
  { id: 'sp_nutri1', name: 'Reeducação Alimentar' }, { id: 'sp_nutri2', name: 'Nutrição Esportiva' },
  { id: 'sp_fisio1', name: 'Fisioterapia Ortopédica' }, { id: 'sp_fisio2', name: 'Fisioterapia Respiratória' },
  { id: 'sp_mont1', name: 'Montagem de Guarda-Roupas' }, { id: 'sp_mont2', name: 'Montagem de Cozinhas Planejadas' },
  { id: 'sp_ar1', name: 'Instalação de Ar Split' }, { id: 'sp_ar2', name: 'Limpeza e Higienização de Ar' },
  { id: 'sp_coz1', name: 'Culinária Brasileira' }, { id: 'sp_coz2', name: 'Culinária Vegana/Vegetariana' },
];


export const MOCK_PROFESSION_CATEGORIES: ProfessionCategory[] = [
  { 
    id: 'cat_reparos', 
    name: 'Reparos e Manutenção Doméstica', 
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFpbnRlbmFuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Encanadores, eletricistas, chaveiros, montadores, técnicos de ar condicionado.' 
  },
  { 
    id: 'cat_beleza', 
    name: 'Beleza e Bem-Estar', 
    imageUrl: 'https://images.unsplash.com/photo-1596009289329-cEF0254b9147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVhdXR5JTIwc2Fsb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Cabeleireiros, maquiadores, massoterapeutas, manicures.' 
  },
  { 
    id: 'cat_aulas', 
    name: 'Educação e Idiomas', 
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlYWNoZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Professores particulares, aulas de idiomas, reforço escolar, música.' 
  },
  { 
    id: 'cat_digital', 
    name: 'Tecnologia e Informática', 
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Desenvolvedores, designers, técnicos de informática, suporte de TI.' 
  },
  { 
    id: 'cat_eventos', 
    name: 'Eventos', 
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZXZlbnQlMjBwbGFubmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Fotógrafos, DJs, buffet, decoração, organizadores de eventos.' 
  },
  { 
    id: 'cat_saude', 
    name: 'Cuidados Pessoais e Saúde', 
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoY2FyZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Cuidadores de idosos, personal trainers, nutricionistas, fisioterapeutas, babás.' 
  },
  { 
    id: 'cat_reformas', 
    name: 'Reformas e Construção', 
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29uc3RydWN0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', 
    description: 'Pedreiros, pintores, marceneiros, gesseiros, azulejistas.' 
  },
  { 
    id: 'cat_automotivo', 
    name: 'Serviços Automotivos', 
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', 
    description: 'Mecânicos, eletricistas automotivos, lava-rápido.' 
  },
  { 
    id: 'cat_pets', 
    name: 'Cuidados com Animais', 
    imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBldCUyMGNhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Veterinários, passeadores de cães, tosadores, pet sitters.' 
  },
  { 
    id: 'cat_consultoria', 
    name: 'Consultoria e Negócios', 
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29uc3VsdGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Consultores de marketing, financeiros, empresariais.' 
  },
  { 
    id: 'cat_limpeza', 
    name: 'Limpeza e Organização', 
    imageUrl: 'https://images.unsplash.com/photo-1585421703635-8027653702f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2xlYW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Diaristas, faxineiros, organizadores profissionais.' 
  },
  { 
    id: 'cat_transporte', 
    name: 'Transporte e Logística', 
    imageUrl: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYW5zcG9ydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Motoristas particulares, entregadores, carretos e mudanças.' 
  },
  { 
    id: 'cat_juridico', 
    name: 'Serviços Jurídicos e Contábeis', 
    imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGVnYWwlMjBzZXJ2aWNlc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', 
    description: 'Advogados, contadores, consultoria tributária.' 
  },
  {
    id: 'cat_cozinha',
    name: 'Culinária e Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    description: 'Cozinheiros particulares, buffet, confeiteiros, personal chefs.'
  }
];

export const MOCK_PAYMENT_METHODS: { id: string; name: string }[] = [
  { id: 'cash', name: 'Dinheiro' },
  { id: 'card', name: 'Cartão de Crédito/Débito' },
  { id: 'pix', name: 'PIX' },
  { id: 'bank_transfer', name: 'Transferência Bancária' },
];

export const TOAST_DEFAULT_DURATION = 5000; 
export const CHAT_MESSAGES_STORAGE_KEY_PREFIX = 'resolveai_chat_messages_';
export const CHAT_SESSIONS_STORAGE_KEY = 'resolveai_chat_sessions';

// Detalhes dos Planos de Assinatura
export const PRICING_PLANS_DETAILS: {
  id: Exclude<SubscriptionPlan, 'trial' | 'free'>;
  name: string;
  priceMonthly: number;
  features: string[];
  highlight?: boolean; // Para destacar um plano, e.g., o "Pro"
  discounts: {
    quarterly: number; // 10% = 0.10
    semi_annually: number; // 15% = 0.15
    annually: number; // 25% = 0.25
  }
}[] = [
  {
    id: 'basic',
    name: 'Plano Básico',
    priceMonthly: 29.90,
    features: [
      'Perfil Visível na Plataforma',
      'Até 4 Especialidades',
      'Chat Básico com Clientes',
      'Suporte por E-mail',
    ],
    discounts: { quarterly: 0.10, semi_annually: 0.15, annually: 0.20 } 
  },
  {
    id: 'pro',
    name: 'Plano Pro',
    priceMonthly: 49.90,
    features: [
      'Tudo do Plano Básico',
      'Selo "Prestador Verificado"',
      'Destaque Moderado nas Buscas',
      'Até 6 Especialidades',
      'Analytics Básicos do Perfil',
      'Suporte Prioritário por Chat',
    ],
    highlight: true,
    discounts: { quarterly: 0.10, semi_annually: 0.15, annually: 0.25 }
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    priceMonthly: 79.90,
    features: [
      'Tudo do Plano Pro',
      'Selo "Prestador Premium"',
      'Destaque Máximo nas Buscas',
      'Até 8 Especialidades',
      'Analytics Avançados do Perfil',
      'Portfólio Completo (Fotos/Vídeos)',
      'Respostas Rápidas no Chat (Templates)',
      'Suporte VIP Dedicado',
    ],
    discounts: { quarterly: 0.12, semi_annually: 0.18, annually: 0.30 }
  }
];

export const TRIAL_DURATION_DAYS = 7;