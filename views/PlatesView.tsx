
import React, { useState, useMemo } from 'react';
import { Plate, Ingredient, PlateIngredient } from '../types';

interface PlatesViewProps {
  plates: Plate[];
  ingredients: Ingredient[];
  setPlates: React.Dispatch<React.SetStateAction<Plate[]>>;
}

const PlatesView: React.FC<PlatesViewProps> = ({ plates, ingredients, setPlates }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newPlate, setNewPlate] = useState<Partial<Plate>>({
    name: '',
    category: 'Fuertes',
    sellingPrice: 0,
    ingredients: [],
    status: 'active',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'
  });

  const calculateCost = (plateIngredients: PlateIngredient[]) => plateIngredients.reduce((acc, curr) => {
    const ing = ingredients.find(i => i.id === curr.ingredientId);
    return acc + (curr.qty * (ing?.unitPrice || 0));
  }, 0);

  const handleAddIngredient = (ingId: string) => {
    if (newPlate.ingredients?.find(i => i.ingredientId === ingId)) return;
    setNewPlate(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { ingredientId: ingId, qty: 100 }]
    }));
  };

  const handleUpdateQty = (ingId: string, qty: number) => {
    setNewPlate(prev => ({
      ...prev,
      ingredients: prev.ingredients?.map(i => i.ingredientId === ingId ? { ...i, qty } : i)
    }));
  };

  const currentCost = useMemo(() => calculateCost(newPlate.ingredients || []), [newPlate.ingredients, ingredients]);
  const currentMargin = useMemo(() => {
    if (!newPlate.sellingPrice || newPlate.sellingPrice <= 0) return 0;
    return ((newPlate.sellingPrice - currentCost) / newPlate.sellingPrice) * 100;
  }, [newPlate.sellingPrice, currentCost]);

  const handleSave = () => {
    if (!newPlate.name || !newPlate.sellingPrice) return;
    const plate: Plate = { 
      ...newPlate, 
      id: `p${plates.length + 1}`,
      sellingPrice: Number(newPlate.sellingPrice)
    } as Plate;
    setPlates([...plates, plate]);
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Crear Nueva Receta</h1>
            <p className="text-slate-500">Define ingredientes y calcula márgenes óptimos.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={() => setIsCreating(false)} className="px-6 py-2 border border-slate-300 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancelar</button>
             <button onClick={handleSave} className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-light shadow-lg transition-all active:scale-95">Publicar al Menú</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
               <div className="aspect-video w-full bg-slate-100 rounded-xl overflow-hidden relative group cursor-pointer">
                  <img src={newPlate.image} alt="Dish" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="material-icons-round text-white text-4xl">add_a_photo</span>
                     <p className="text-white text-xs font-bold mt-2">Cambiar Imagen</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Plato</label>
                    <input type="text" className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-accent focus:bg-white rounded-xl transition-all" placeholder="ej. Risotto de Verano" value={newPlate.name} onChange={e => setNewPlate({...newPlate, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Categoría</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-accent focus:bg-white rounded-xl" value={newPlate.category} onChange={e => setNewPlate({...newPlate, category: e.target.value})}>
                        <option>Entradas</option>
                        <option>Fuertes</option>
                        <option>Pizza</option>
                        <option>Postres</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Precio Menú</label>
                      <input type="number" className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-accent focus:bg-white rounded-xl font-bold" value={newPlate.sellingPrice} onChange={e => setNewPlate({...newPlate, sellingPrice: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>
               </div>
            </div>
            <div className="bg-primary p-6 rounded-2xl shadow-xl text-white space-y-4">
               <h3 className="font-bold flex items-center gap-2"><span className="material-icons-round text-emerald-400">insights</span>Análisis de Rentabilidad</h3>
               <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase">Costo Alimento</p>
                    <p className="text-3xl font-extrabold">${currentCost.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white/50 uppercase">Margen Calculado</p>
                    <p className={`text-3xl font-extrabold ${currentMargin > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{currentMargin.toFixed(0)}%</p>
                  </div>
               </div>
               <p className="text-xs text-white/60 italic">{currentMargin > 70 ? "✅ Margen Saludable: Superior al estándar de la industria." : "⚠️ Margen Bajo: Considera ajustar el precio o cantidades."}</p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-20rem)] flex flex-col">
               <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold">Ingredientes de la Receta</h3></div>
               <div className="flex-1 overflow-y-auto p-0">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 sticky top-0 z-10">
                      <tr><th className="px-6 py-3">Ingrediente</th><th className="px-6 py-3">Cant. (gr)</th><th className="px-6 py-3 text-right">Costo</th><th className="px-6 py-3"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newPlate.ingredients?.map((item) => {
                        const ing = ingredients.find(i => i.id === item.ingredientId);
                        return (
                          <tr key={item.ingredientId} className="hover:bg-slate-50">
                            <td className="px-6 py-4"><div className="flex items-center gap-3"><span>{ing?.icon}</span><span className="text-sm font-bold text-slate-800">{ing?.name}</span></div></td>
                            <td className="px-6 py-4"><input type="number" className="w-20 px-2 py-1 text-sm bg-slate-100 rounded font-bold border-none focus:ring-accent" value={item.qty} onChange={e => handleUpdateQty(item.ingredientId, parseInt(e.target.value) || 0)}/></td>
                            <td className="px-6 py-4 text-right text-sm font-bold text-slate-800 font-mono">${(item.qty * (ing?.unitPrice || 0)).toFixed(2)}</td>
                            <td className="px-6 py-4 text-right"><button onClick={() => setNewPlate(prev => ({ ...prev, ingredients: prev.ingredients?.filter(i => i.ingredientId !== item.ingredientId) }))} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-icons-round">delete</span></button></td>
                          </tr>
                        );
                      })}
                      {(newPlate.ingredients?.length || 0) === 0 && (
                        <tr>
                          <td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm">Añada ingredientes desde la sección inferior</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
               </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ingredientes Disponibles</h4>
               <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {ingredients.map(ing => (
                    <button key={ing.id} onClick={() => handleAddIngredient(ing.id)} className="flex flex-col items-center gap-2 p-3 bg-slate-50 border-2 border-transparent hover:border-accent rounded-xl transition-all group">
                       <span className="text-2xl group-hover:scale-125 transition-transform">{ing.icon}</span>
                       <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center uppercase">{ing.name}</span>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
       <header className="flex justify-between items-center">
        <div><h1 className="text-3xl font-bold text-slate-900">Ingeniería de Menú</h1><p className="text-slate-500 mt-1">Gestiona tus platos y maximiza la rentabilidad.</p></div>
        <button onClick={() => setIsCreating(true)} className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"><span className="material-icons-round">add</span>Crear Nuevo Plato</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {plates.map(plate => {
           const cost = calculateCost(plate.ingredients);
           const margin = ((plate.sellingPrice - cost) / plate.sellingPrice) * 100;
           return (
             <div key={plate.id} className="bg-white rounded-2xl border-2 border-transparent hover:border-accent shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-40 relative overflow-hidden">
                  <img src={plate.image} alt={plate.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="p-5">
                   <h3 className="font-bold text-slate-900 text-lg mb-4 line-clamp-1">{plate.name}</h3>
                   <div className="flex justify-between items-end">
                      <div className="space-y-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Margen</p><p className={`text-xl font-black ${margin > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>{margin.toFixed(0)}%</p></div>
                      <div className="text-right space-y-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Precio</p><p className="text-xl font-black text-slate-900 font-mono">${plate.sellingPrice.toFixed(2)}</p></div>
                   </div>
                   <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <p className="text-xs text-slate-500">Costo: <span className="font-bold font-mono">${cost.toFixed(2)}</span></p>
                      <button className="text-primary hover:text-accent font-black text-[10px] uppercase flex items-center gap-1 transition-colors">
                        GESTIONAR <span className="material-icons-round text-sm">chevron_right</span>
                      </button>
                   </div>
                </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default PlatesView;
