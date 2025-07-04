
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthWrapperProps {
  children: React.ReactNode;
  message?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  message = "Para salvar seus cálculos e acessar o histórico, faça login ou cadastre-se." 
}) => {
  const { user } = useAuth();

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      {children}
      
      <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="https://i.postimg.cc/C5bzFpj8/Logo-CCI.png" 
              alt="CCI Logo" 
              className="h-8 w-auto object-contain"
            />
            <CardTitle className="text-lg text-center text-gray-800">
              💡 Quer salvar seus cálculos?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/auth">
                <LogIn size={16} className="mr-2" />
                Entrar
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
              <Link to="/auth">
                <UserPlus size={16} className="mr-2" />
                Cadastrar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthWrapper;
