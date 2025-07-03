
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_SLOGAN, COLORS, APP_ROUTES } from '@/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-grafite-profundo text-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xl font-semibold">{APP_NAME}</p>
        <p className="text-sm text-cinza-neutro mb-4">{APP_SLOGAN}</p>
        <p className="text-xs">&copy; {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.</p>
        <div className="mt-4 flex justify-center space-x-4">
          {/* Placeholder for social media icons */}
          <a href="https://www.instagram.com/gilsinhojointech/" className="text-cinza-neutro hover:text-orange-energia transition-colors">Facebook</a>
          <a href="https://www.instagram.com/jointechsistemas" className="text-cinza-neutro hover:text-orange-energia transition-colors">Instagram</a>
          <a href="https://www.instagram.com/gilsinhojointech/" className="text-cinza-neutro hover:text-orange-energia transition-colors">LinkedIn</a>
        </div>
        <div className="mt-4 text-xs">
          <Link to={APP_ROUTES.TERMS_OF_SERVICE} className="text-cinza-neutro hover:text-orange-energia transition-colors px-2">
            Termos de Serviço
          </Link>
          <span className="text-cinza-neutro">|</span>
          <Link to={APP_ROUTES.PRIVACY_POLICY} className="text-cinza-neutro hover:text-orange-energia transition-colors px-2">
            Política de Privacidade
          </Link>
           <span className="text-cinza-neutro">|</span>
          <Link to={APP_ROUTES.CONTACT} className="text-cinza-neutro hover:text-orange-energia transition-colors px-2">
            Fale Conosco
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;