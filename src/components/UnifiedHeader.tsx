
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import CciLogo from '@/components/ui/CciLogo';

interface UnifiedHeaderProps {
  onMenuToggle?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ onMenuToggle }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAdmin = location.pathname.includes('/admin');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Menu Button (Mobile) + Logo */}
        <div className="flex items-center gap-3">
          {isMobile && onMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="h-10 w-10 touch-friendly hover:bg-orange-50"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
          )}
          
          <div 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            <CciLogo size="md" />
          </div>
        </div>

        {/* Navegação Central - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {user?.email?.includes('@cci.com.br') && (
            <Button
              variant={isAdmin ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          )}
        </nav>

        {/* Área do Usuário */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg">
                <User className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                  {user.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 touch-friendly"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2 touch-friendly"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Navegação Mobile - Admin (apenas quando não há menu lateral) */}
      {user?.email?.includes('@cci.com.br') && (
        <div className="md:hidden border-t border-orange-100 bg-white px-4 py-2">
          <div className="flex items-center justify-center">
            <Button
              variant={isAdmin ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 touch-friendly"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default UnifiedHeader;
