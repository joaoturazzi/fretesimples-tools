
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
                alt="CCI Logo" 
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">FreteDigital</span>
                <span className="text-xs text-orange-600 font-medium">BY CCI</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span className="max-w-32 truncate">{user.email}</span>
                </div>
                
                {user.email?.includes('@cci.com.br') && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin">
                      <Settings size={16} className="mr-2" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  </Button>
                )}
                
                <Button onClick={signOut} variant="ghost" size="sm">
                  <LogOut size={16} className="mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </>
            ) : (
              <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
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
