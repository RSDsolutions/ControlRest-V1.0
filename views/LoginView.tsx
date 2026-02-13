
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(role);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="hidden lg:flex flex-col space-y-8 pr-8 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-white text-2xl font-bold">C</div>
            <span className="text-2xl font-bold">ControlRest</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight">Gestión Inteligente para Restaurantes Modernos</h1>
          <p className="text-lg text-white/60">La única solución SaaS que conecta las operaciones de cocina con el crecimiento financiero real.</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="material-icons-round text-accent text-3xl mb-2">trending_up</span>
              <p className="text-sm font-bold">Enfoque en Rentabilidad</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
              <span className="material-icons-round text-accent text-3xl mb-2">analytics</span>
              <p className="text-sm font-bold">Datos en Tiempo Real</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10 w-full max-w-md mx-auto">
          <div className="p-10 text-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">C</div>
            <h2 className="text-3xl font-bold text-slate-900">Bienvenido</h2>
            <p className="text-slate-500 mt-2">Selecciona tu perfil para ingresar al sistema.</p>
          </div>

          <div className="px-10 pb-12 space-y-4">
            <button
              onClick={() => handleRoleSelection(UserRole.ADMIN)}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-icons-round">admin_panel_settings</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Administrador</p>
                  <p className="text-xs text-slate-500">Control Financiero y Staff</p>
                </div>
              </div>
              <span className="material-icons-round text-slate-300 group-hover:text-accent transition-colors">chevron_right</span>
            </button>

            <button
              onClick={() => handleRoleSelection(UserRole.WAITER)}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-icons-round">restaurant</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Mesero / Staff</p>
                  <p className="text-xs text-slate-500">Pedidos y Mesas POS</p>
                </div>
              </div>
              <span className="material-icons-round text-slate-300 group-hover:text-accent transition-colors">chevron_right</span>
            </button>

            <button
              onClick={() => handleRoleSelection(UserRole.CASHIER)}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                  <span className="material-icons-round">point_of_sale</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900">Cajero / Caja</p>
                  <p className="text-xs text-slate-500">Pagos y Facturación</p>
                </div>
              </div>
              <span className="material-icons-round text-slate-300 group-hover:text-accent transition-colors">chevron_right</span>
            </button>

            {isLoading && (
              <div className="pt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
              </div>
            )}
          </div>
          <div className="h-1.5 w-full bg-accent"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
