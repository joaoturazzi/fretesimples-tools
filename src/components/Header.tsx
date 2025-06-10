
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              FreteDigital
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  {user.email}
                </div>
                
                {user.email?.includes('@cci.com.br') && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin">
                      <Settings size={16} className="mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                
                <Button onClick={signOut} variant="ghost" size="sm">
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
