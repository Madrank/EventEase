import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition, Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BellIcon, CalendarDaysIcon, BuildingOfficeIcon, HomeModernIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import api from 'services/api';

const navigation = [
  { name: 'Accueil', href: '/', icon: HomeModernIcon },
  { name: 'Événements', href: '/events', icon: CalendarDaysIcon },
  { name: 'Prestataires', href: '/providers', icon: BuildingOfficeIcon },
  { name: 'Hébergements', href: '/accommodations', icon: HomeModernIcon },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications').then((r) => setNotifCount(r.data.unreadCount)).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Logo />
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1 mr-2">
            <Link to="/providers/register" className="text-xs font-medium text-gray-400 hover:text-primary-600 px-2 py-1 transition-colors">
              + Prestataire
            </Link>
            <Link to="/accommodations/register" className="text-xs font-medium text-gray-400 hover:text-primary-600 px-2 py-1 transition-colors">
              + Hébergement
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <button className="relative p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all">
                  <BellIcon className="w-5 h-5" />
                  {notifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                      {notifCount > 9 ? '9+' : notifCount}
                    </span>
                  )}
                </button>

                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-50 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
                      {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.firstName}</span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Menu.Item>{({ active }) => (
                        <Link to="/dashboard" className={`flex items-center space-x-2 px-4 py-2.5 text-sm ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                          <span>Tableau de bord</span>
                        </Link>
                      )}</Menu.Item>
                      <Menu.Item>{({ active }) => (
                        <Link to="/events/new" className={`flex items-center space-x-2 px-4 py-2.5 text-sm ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          <span>Créer un événement</span>
                        </Link>
                      )}</Menu.Item>
                      <Menu.Item>{({ active }) => (
                        <Link to="/providers/register" className={`flex items-center space-x-2 px-4 py-2.5 text-sm ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>Devenir prestataire</span>
                        </Link>
                      )}</Menu.Item>
                      <Menu.Item>{({ active }) => (
                        <Link to="/accommodations/register" className={`flex items-center space-x-2 px-4 py-2.5 text-sm ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          <span>Proposer un hébergement</span>
                        </Link>
                      )}</Menu.Item>
                      <Menu.Item>{({ active }) => (
                        <button onClick={handleLogout} className={`flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm ${active ? 'bg-red-50 text-red-600' : 'text-red-500'}`}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          <span>Déconnexion</span>
                        </button>
                      )}</Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                  {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm hidden sm:inline-flex">Connexion</Link>
                <Link to="/register" className="btn-primary text-sm">S'inscrire</Link>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                  {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>

        <Disclosure>
          <Transition
            show={mobileOpen}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 -translate-y-2"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 -translate-y-2"
          >
            <Disclosure.Panel className="lg:hidden pb-4 border-t border-gray-100 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all duration-200 ${
                    isActive(item.href) ? 'bg-primary-50 text-primary-700' : 'text-surface-600 hover:bg-surface-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 px-4">
                  <Link to="/providers/register" onClick={() => setMobileOpen(false)} className="block text-center btn-ghost w-full text-sm border border-gray-200 rounded-lg">+ Devenir prestataire</Link>
                  <Link to="/accommodations/register" onClick={() => setMobileOpen(false)} className="block text-center btn-ghost w-full text-sm border border-gray-200 rounded-lg">+ Proposer un hébergement</Link>
                  <div className="h-2" />
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center btn-secondary w-full text-sm">Connexion</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-center btn-primary w-full text-sm">S'inscrire</Link>
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      </div>
    </nav>
  );
}
