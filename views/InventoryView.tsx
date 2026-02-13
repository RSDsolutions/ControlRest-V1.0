
import React from 'react';
import { Ingredient } from '../types';

interface InventoryViewProps {
  ingredients: Ingredient[];
}

const KPIItem = ({ label, value, sub, icon, color }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-20 h-20 ${color} opacity-10 rounded-full blur-xl transition-all group-hover:scale-150`}></div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    </div>
    <p className="text-[10px] font-bold text-slate-500">{sub}</p>
  </div>
);

const InventoryCard: React.FC<{ ingredient: Ingredient }> = ({ ingredient }) => {
  const percentage = (ingredient.currentQty / (ingredient.minQty * 2)) * 100;
  const isCritical = ingredient.currentQty <= ingredient.criticalQty;
  const isLow = ingredient.currentQty <= ingredient.minQty;
  
  let statusText = 'NORMAL';
  let colorClass = 'text-primary';
  let iconName = 'check_circle';

  if (isCritical) { 
    statusText = 'CRÍTICO'; 
    colorClass = 'text-red-500'; 
    iconName = 'error';
  } else if (isLow) { 
    statusText = 'STOCK BAJO'; 
    colorClass = 'text-amber-500'; 
    iconName = 'warning';
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 mb-2">{ingredient.category}</span>
          <h3 className="font-bold text-lg text-slate-900 leading-tight">{ingredient.name}</h3>
        </div>
        <span className="text-2xl">{ingredient.icon}</span>
      </div>
      <div className="flex items-center gap-4 py-2">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
            <path className={colorClass} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${Math.min(percentage, 100)}, 100`} strokeLinecap="round" strokeWidth="3"></path>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[10px] font-bold ${colorClass}`}>{Math.round(percentage)}%</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xl font-black text-slate-900">{ingredient.currentQty.toLocaleString()}<span className="text-[10px] font-bold text-slate-400 ml-1">gr</span></span>
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-bold ${colorClass}`}>
            <span className="material-icons-round text-[16px]">{iconName}</span>
            {statusText}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t text-[10px] font-bold text-slate-400 uppercase flex justify-between items-center">
        <span>Mín: {ingredient.minQty} gr</span>
        <button className="text-primary hover:text-accent transition-colors font-black flex items-center gap-1">
          VER DETALLES <span className="material-icons-round text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

const InventoryView: React.FC<InventoryViewProps> = ({ ingredients }) => {
  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vista de Inventario</h1>
          <p className="text-slate-500 mt-1">Seguimiento en tiempo real de todos tus suministros.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
          <span className="material-icons-round">file_download</span> Exportar Reporte
        </button>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPIItem label="Valor de Stock" value="$12.450" sub="+2.4% vs semana pasada" icon="monetization_on" color="bg-emerald-50 text-emerald-600" />
        <KPIItem label="Pedidos Pendientes" value="5 Ítems" sub="3 Alertas Críticas" icon="priority_high" color="bg-red-50 text-red-600" />
        <KPIItem label="Alertas de Stock" value="12 Ítems" sub="Agotamiento < 3 días" icon="warning" color="bg-amber-50 text-amber-600" />
        <KPIItem label="Categorías Activas" value="8 Activas" sub="En todas las bodegas" icon="inventory_2" color="bg-primary/5 text-primary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ingredients.map(ing => <InventoryCard key={ing.id} ingredient={ing} />)}
      </div>
    </div>
  );
};

export default InventoryView;
