
import React from 'react';
import { Ingredient, Plate, Order } from '../types';

interface AdminDashboardProps {
  ingredients: Ingredient[];
  plates: Plate[];
  orders: Order[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ ingredients, plates, orders }) => {
  const lowStockCount = ingredients.filter(i => i.currentQty <= i.minQty).length;
  const criticalStockCount = ingredients.filter(i => i.currentQty <= i.criticalQty).length;
  const paidOrders = orders.filter(o => o.status === 'paid');
  const dailySales = paidOrders.reduce((acc, curr) => acc + curr.total, 0);
  
  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Panel Administrativo</h1>
          <p className="text-slate-500 mt-1">Inteligencia financiera basada en operaciones reales.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-accent/10 rounded-full text-accent font-black text-[10px] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span> Sincronizado
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard title="Ventas Hoy" value={`$${dailySales.toLocaleString()}`} trend="+12%" icon="payments" color="text-blue-600" bg="bg-blue-50" />
        <KPICard title="Utilidad Bruta" value={`$${(dailySales * 0.72).toFixed(0)}`} trend="+8%" icon="insights" color="text-emerald-600" bg="bg-emerald-50" />
        <KPICard title="Margen Real" value="72.4%" trend="+1.2%" icon="donut_large" color="text-indigo-600" bg="bg-indigo-50" />
        <KPICard title="Alerta Stock" value={lowStockCount} trend="Acción Req." icon="warning" color="text-amber-600" bg="bg-amber-50" />
        <KPICard title="Transacciones" value={paidOrders.length} trend="Lunch" icon="receipt" color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl text-primary">Operativa Financiera</h3>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><span className="w-2 h-2 rounded-full bg-accent"></span> Ventas</span>
               <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><span className="w-2 h-2 rounded-full bg-red-400"></span> Costos</span>
            </div>
          </div>
          <div className="h-64 bg-slate-50/50 rounded-3xl flex items-end justify-between p-6 gap-4">
            {[45, 65, 50, 85, 75, 98, 70].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                <div className="w-full relative h-48 flex items-end">
                   <div className="absolute bottom-0 w-full bg-primary/5 rounded-2xl h-full"></div>
                   <div className="absolute bottom-0 w-full bg-accent rounded-2xl transition-all duration-700 group-hover:bg-accent-hover shadow-lg" style={{ height: `${val}%` }}></div>
                   <div className="absolute bottom-0 w-full bg-red-400 rounded-2xl opacity-40 h-10" style={{ height: `${val * 0.3}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">Lu-Do</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
          <h3 className="font-black text-xl text-primary mb-6">Salud del Inventario</h3>
          <div className="space-y-4 flex-1">
            <InventoryAlert title="Ítems Críticos" count={criticalStockCount} color="red" />
            <InventoryAlert title="En Punto de Reorden" count={lowStockCount} color="amber" />
            <div className="mt-8 p-6 bg-primary text-white rounded-3xl shadow-xl">
               <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Inversión Actual</p>
               <p className="text-3xl font-black font-mono">$45.2k</p>
               <button className="w-full mt-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase transition-all">Reporte Auditoría</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, trend, icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 ${bg} rounded-2xl ${color} shadow-sm`}><span className="material-icons-round">{icon}</span></div>
      <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">{trend}</span>
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    <h4 className="text-3xl font-black text-slate-900 mt-2 font-mono tracking-tighter">{value}</h4>
  </div>
);

const InventoryAlert = ({ title, count, color }: any) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border-2 ${color === 'red' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
     <div className="flex items-center gap-3">
        <span className="material-icons-round">{color === 'red' ? 'report' : 'warning'}</span>
        <p className="text-sm font-black">{count} {title}</p>
     </div>
     <span className="material-icons-round text-sm">chevron_right</span>
  </div>
);

export default AdminDashboard;
