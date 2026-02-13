
import React from 'react';
import { Order, Ingredient } from '../types';

interface FinanceViewProps {
  orders: Order[];
  ingredients: Ingredient[];
}

const FinanceView: React.FC<FinanceViewProps> = ({ orders, ingredients }) => {
  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rendimiento Financiero</h1><p className="text-slate-500 mt-1">Análisis profundo de costos, ventas y utilidad neta.</p></div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-primary/20 active:scale-95 transition-all"><span className="material-icons-round">file_download</span> Descargar Reporte Fiscal</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceKPI label="Ventas Totales" value="$124.500" trend="+12.5%" color="bg-blue-500" />
        <FinanceKPI label="Costo Alimentos (COGS)" value="$42.000" trend="-2.1%" color="bg-orange-500" />
        <FinanceKPI label="Utilidad Bruta" value="$82.500" trend="+8.3%" color="bg-purple-500" />
        <FinanceKPI label="Utilidad Neta" value="$52.500" trend="+15% Anual" color="bg-accent" highlight />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">
           <div className="flex items-center justify-between mb-10">
              <div><h3 className="font-black text-2xl text-slate-900">Tendencias de Ingresos</h3><p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Desglose mensual 2023</p></div>
           </div>
           <div className="h-72 w-full flex items-end gap-2 px-2">
              {[30, 45, 25, 60, 80, 55, 90, 75, 40, 85, 95, 100].map((val, i) => (
                <div key={i} className="flex-1 group relative">
                   <div className="w-full bg-slate-50 rounded-full h-72 flex items-end overflow-hidden border border-slate-100">
                      <div className="w-full bg-primary/20 group-hover:bg-primary/40 transition-all rounded-full" style={{ height: `${val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(m => <span key={m}>{m}</span>)}
           </div>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10 flex flex-col">
           <h3 className="font-black text-2xl text-slate-900 mb-1">Mezcla de Gastos</h3>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Distribución Operativa</p>
           <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-52 h-52 rounded-full flex items-center justify-center shadow-inner" style={{ background: 'conic-gradient(#0F3D2E 0% 35%, #1FAA59 35% 60%, #4b7c69 60% 85%, #e2e8f0 85% 100%)' }}>
                 <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Gastos</p><p className="text-3xl font-black text-slate-900 font-mono">$72k</p>
                 </div>
              </div>
              <div className="w-full mt-10 space-y-4">
                 <LegendItem color="bg-primary" label="Costo de Venta (COGS)" percent="35%" />
                 <LegendItem color="bg-accent" label="Costos Laborales" percent="25%" />
                 <LegendItem color="bg-[#4b7c69]" label="Servicios Públicos" percent="25%" />
                 <LegendItem color="bg-slate-200" label="Otros Gastos" percent="15%" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const FinanceKPI = ({ label, value, trend, highlight }: any) => (
  <div className={`${highlight ? 'bg-primary text-white shadow-2xl shadow-primary/30 border-none' : 'bg-white text-slate-900 border-2 border-slate-100 shadow-sm'} p-8 rounded-[32px] flex flex-col justify-between transition-all hover:scale-105`}>
     <p className={`text-[10px] font-black uppercase tracking-widest ${highlight ? 'text-white/50' : 'text-slate-400'} mb-2`}>{label}</p>
     <h4 className="text-4xl font-black font-mono tracking-tighter">{value}</h4>
     <div className="mt-6 flex items-center justify-between"><span className={`text-[10px] font-black px-3 py-1 rounded-full ${highlight ? 'bg-white/10 text-white' : 'bg-emerald-50 text-emerald-600'}`}>{trend}</span></div>
  </div>
);

const LegendItem = ({ color, label, percent }: any) => (
  <div className="flex items-center justify-between">
     <div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${color} shadow-sm`}></div><span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{label}</span></div>
     <span className="text-xs font-black text-slate-900 font-mono">{percent}</span>
  </div>
);

export default FinanceView;
