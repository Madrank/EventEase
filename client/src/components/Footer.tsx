import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Logo />
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mt-4">
              Solution professionnelle pour l'organisation d'événements. Gérez vos invités, 
              réservez des prestataires, trouvez des hébergements et collectez des fonds 
              en toute simplicité.
            </p>
            <div className="flex space-x-3 mt-6">
              <span className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </span>
              <span className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </span>
              <span className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              <li><Link to="/events" className="text-gray-400 hover:text-white text-sm transition-colors">Événements</Link></li>
              <li><Link to="/providers" className="text-gray-400 hover:text-white text-sm transition-colors">Prestataires</Link></li>
              <li><Link to="/accommodations" className="text-gray-400 hover:text-white text-sm transition-colors">Hébergements</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Connexion</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Devenir partenaire</h3>
            <ul className="space-y-2.5">
              <li><Link to="/providers/register" className="text-gray-400 hover:text-white text-sm transition-colors">Inscription prestataire</Link></li>
              <li><Link to="/accommodations/register" className="text-gray-400 hover:text-white text-sm transition-colors">Ajouter un hébergement</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} EventEase. Développé par <span className="text-gray-300">JBxDev</span>.
          </p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Mentions légales</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Politique de confidentialité</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">CGU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
