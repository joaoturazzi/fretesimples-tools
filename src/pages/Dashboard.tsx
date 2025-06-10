
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main page since all tools are there
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecionando...</h1>
        <p>Você está sendo redirecionado para o painel principal.</p>
      </div>
    </div>
  );
};

export default Dashboard;
