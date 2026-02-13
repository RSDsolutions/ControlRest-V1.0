
import React, { useState } from 'react';
import { Ingredient } from '../types';

interface IngredientsViewProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const IngredientsView: React.FC<IngredientsViewProps> = ({ ingredients, setIngredients }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showNewIngModal, setShowNewIngModal] = useState(false);
  const [selectedIngId, setSelectedIngId] = useState<string | null>(null);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseUnit, setPurchaseUnit] = useState<'kg' | 'gr' | 'lb'>('kg');
  const [purchasePrice, setPurchasePrice] = useState(15.00);

  const [newIng, setNewIng] = useState({
    name: '',
    category: 'Vegetales',
    minQty: 1000,
    criticalQty: 500,
    icon: '📦'
  });

  const handleRegisterPurchase = () => {
    if (!selectedIngId) return;
    let addedGrams = purchaseQty;
    if (purchaseUnit === 'kg') addedGrams *= 1000;
    if (purchaseUnit === 'lb') addedGrams *= 453.592;
    const newUnitPrice = purchasePrice / addedGrams;
    setIngredients(prev => prev.map(ing => {
      if (ing.id === selectedIngId) {
        const updatedUnitPrice = (ing.unitPrice + newUnitPrice) / 2;
        return { ...ing, currentQty: ing.currentQty + addedGrams, unitPrice: updatedUnitPrice };
      }
      return ing;
    }));
    setShowPurchaseModal(false);
  };

  const handleCreateIngredient = () => {
    if (!newIng.name) return;
    const ingredient: Ingredient = {
      ...newIng,
      id: (ingredients.length + 1).toString(),
      currentQty: 0,
      unitPrice: 0.01,
    };
    setIngredients([...ingredients, ingredient]);
    setShowNewIngModal(false);
    setNewIng({ name: '', category: 'Vegetales', minQty: 1000, criticalQty: 500, icon: '📦' });
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Ingredientes</h1>
          <p className="text-slate-500 mt-1">Controla costos por gramo y niveles de stock con precisión financiera.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowNewIngModal(true)}
             className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm shadow-sm active:scale-95"
           >
             <span className="material-icons-round text-accent">add</span> Nuevo Ingrediente
           </button>
           <button 
             onClick={() => { setSelectedIngId(ingredients[0]?.id); setShowPurchaseModal(true); }}
             className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-light transition-all font-bold text-sm shadow-lg shadow-primary/20 active:scale-95"
           >
             <span className="material-icons-round">shopping_cart</span> Registrar Compra
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Ítems" value={ingredients.length} color="text-slate-900" />
        <StatCard label="Stock Bajo" value={ingredients.filter(i => i.currentQty <= i.minQty).length} color="text-amber-500" />
        <StatCard label="Críticos" value={ingredients.filter(i => i.currentQty <= i.criticalQty).length} color="text-red-500" />
        <StatCard label="Valor Est." value="$4.120" color="text-slate-900" />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative w-full md:w-80">
            <span className="material-icons-round absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
            <input type="text" placeholder="Buscar ingrediente..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 border-slate-100 rounded-xl focus:border-accent focus:ring-0 transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest sticky top-0 z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5">Ingrediente</th>
                <th className="px-6 py-5">Categoría</th>
                <th className="px-6 py-5 text-right">Stock (gr)</th>
                <th className="px-6 py-5 text-right">Costo / gr</th>
                <th className="px-6 py-5 text-center">Salud Stock</th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ingredients.map(ing => {
                let status = 'Normal';
                let statusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                if (ing.currentQty <= ing.criticalQty) {
                  status = 'Crítico';
                  statusColor = 'bg-red-100 text-red-700 border-red-200';
                } else if (ing.currentQty <= ing.minQty) {
                  status = 'Bajo';
                  statusColor = 'bg-amber-100 text-amber-700 border-amber-200';
                }
                return (
                  <tr key={ing.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner group-hover:bg-white group-hover:shadow-sm transition-all">{ing.icon}</div>
                          <div>
                             <p className="font-bold text-slate-900 text-sm uppercase tracking-tight">{ing.name}</p>
                             <p className="text-[10px] text-slate-400 font-mono tracking-widest">ID: #ING-{ing.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-black uppercase tracking-widest">{ing.category}</td>
                    <td className="px-6 py-4 text-right font-black text-slate-800 font-mono text-sm">{ing.currentQty.toLocaleString()} gr</td>
                    <td className="px-6 py-4 text-right text-xs font-mono text-slate-400 font-bold">${ing.unitPrice.toFixed(4)}</td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black border-2 tracking-widest ${statusColor}`}>{status.toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => { setSelectedIngId(ing.id); setShowPurchaseModal(true); }} className="p-2 text-slate-300 hover:text-primary hover:bg-white rounded-xl transition-all active:scale-95 shadow-none hover:shadow-sm">
                          <span className="material-icons-round text-xl">add_shopping_cart</span>
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showNewIngModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => setShowNewIngModal(false)}></div>
           <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
              <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-black text-xl text-primary">Nuevo Ingrediente</h3>
                 <button onClick={() => setShowNewIngModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons-round">close</span></button>
              </header>
              <div className="p-8 space-y-5">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nombre del Insumo</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-accent focus:bg-white rounded-2xl transition-all" placeholder="ej. Aguacate Hass" value={newIng.name} onChange={e => setNewIng({...newIng, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Punto Mínimo (gr)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-accent focus:bg-white rounded-2xl transition-all" value={newIng.minQty} onChange={e => setNewIng({...newIng, minQty: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Punto Crítico (gr)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-accent focus:bg-white rounded-2xl transition-all" value={newIng.criticalQty} onChange={e => setNewIng({...newIng, criticalQty: parseInt(e.target.value) || 0})} />
                    </div>
                 </div>
              </div>
              <footer className="px-8 py-6 bg-slate-50 border-t flex justify-end gap-4">
                 <button onClick={() => setShowNewIngModal(false)} className="px-6 py-2 font-black text-[10px] text-slate-400 uppercase tracking-widest">Cancelar</button>
                 <button onClick={handleCreateIngredient} className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-primary/20 active:scale-95 transition-all">Crear Ítem</button>
              </footer>
           </div>
        </div>
      )}

      {showPurchaseModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" onClick={() => setShowPurchaseModal(false)}></div>
           <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scaleUp">
              <header className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary flex items-center justify-center"><span className="material-icons-round text-2xl">shopping_bag</span></div>
                    <div>
                       <h3 className="font-black text-xl text-primary">Registrar Compra</h3>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Actualización de Almacén</p>
                    </div>
                 </div>
                 <button onClick={() => setShowPurchaseModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons-round">close</span></button>
              </header>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ingrediente a Reponer</label>
                    <select className="w-full px-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-accent font-black text-sm uppercase" value={selectedIngId || ''} onChange={e => setSelectedIngId(e.target.value)}>
                      {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.icon} {ing.name}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cantidad</label>
                       <input type="number" className="w-full px-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-accent focus:ring-0 font-black" value={purchaseQty} onChange={e => setPurchaseQty(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Unidad Medida</label>
                       <select className="w-full px-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-accent focus:ring-0 font-black uppercase text-xs" value={purchaseUnit} onChange={e => setPurchaseUnit(e.target.value as any)}>
                          <option value="kg">Kilogramos (kg)</option>
                          <option value="gr">Gramos (gr)</option>
                          <option value="lb">Libras (lb)</option>
                       </select>
                    </div>
                 </div>
                 <div className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-3xl flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg"><span className="material-icons-round">autorenew</span></div>
                    <div>
                       <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Resumen de Conversión</p>
                       <p className="text-sm font-bold text-primary">Ingresando <span className="text-emerald-700 font-black underline">{purchaseUnit === 'kg' ? purchaseQty * 1000 : purchaseUnit === 'lb' ? (purchaseQty * 453.5).toFixed(0) : purchaseQty} gr</span> al inventario</p>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precio de Compra Total (USD)</label>
                    <div className="relative">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">$</span>
                       <input type="number" className="w-full pl-12 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] focus:border-accent focus:ring-0 font-black text-3xl text-primary" value={purchasePrice} onChange={e => setPurchasePrice(parseFloat(e.target.value) || 0)} />
                    </div>
                 </div>
              </div>
              <footer className="px-8 py-8 bg-slate-50 border-t flex justify-end gap-4">
                 <button onClick={() => setShowPurchaseModal(false)} className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descartar</button>
                 <button onClick={handleRegisterPurchase} className="px-10 py-4 bg-primary text-white rounded-[20px] font-black text-sm uppercase shadow-xl shadow-primary/30 active:scale-95 transition-all">Confirmar y Actualizar</button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-4xl font-black font-mono ${color}`}>{value}</p>
  </div>
);

export default IngredientsView;
