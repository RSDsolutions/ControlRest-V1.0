
import React, { useState } from 'react';
import { Table, Plate, Order, OrderItem } from '../types';

interface WaiterViewProps {
  tables: Table[];
  plates: Plate[];
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
}

const WaiterView: React.FC<WaiterViewProps> = ({ tables, plates, orders, setOrders, setTables }) => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);

  const selectedTable = tables.find(t => t.id === selectedTableId);
  const existingOrder = orders.find(o => o.id === selectedTable?.currentOrderId && o.status !== 'paid');

  const handleTableClick = (t: Table) => {
    if (t.status === 'reserved') return;
    setSelectedTableId(t.id);
    
    // Si la mesa ya tiene un pedido, cargarlo (en un sistema real se cargaría del server)
    if (t.currentOrderId) {
      const order = orders.find(o => o.id === t.currentOrderId);
      if (order) setCart(order.items);
    } else {
      setCart([]);
    }
  };

  const addToCart = (plate: Plate) => {
    if (!selectedTableId) return;
    setCart(prev => {
      const existing = prev.find(i => i.plateId === plate.id);
      if (existing) {
        return prev.map(i => i.plateId === plate.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { plateId: plate.id, qty: 1 }];
    });
  };

  const removeFromCart = (plateId: string) => {
    setCart(prev => prev.map(i => i.plateId === plateId ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
  };

  const calculateTotal = () => cart.reduce((acc, curr) => {
    const plate = plates.find(p => p.id === curr.plateId);
    return acc + ((plate?.sellingPrice || 0) * curr.qty);
  }, 0);

  const handleSendToKitchen = () => {
    if (!selectedTableId || cart.length === 0) return;
    
    const orderId = selectedTable?.currentOrderId || `ped-${Math.random().toString(36).substr(2, 5)}`;
    const total = calculateTotal();
    
    if (selectedTable?.currentOrderId) {
      // Actualizar pedido existente
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, items: cart, total, status: 'preparing' } : o));
    } else {
      // Crear nuevo pedido
      const newOrder: Order = {
        id: orderId,
        tableId: selectedTableId,
        items: cart,
        status: 'preparing',
        total,
        timestamp: new Date()
      };
      setOrders(prev => [...prev, newOrder]);
      setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, status: 'occupied', currentOrderId: orderId } : t));
    }
    
    setSelectedTableId(null);
    setCart([]);
  };

  return (
    <div className="flex h-full flex-col lg:flex-row animate-fadeIn overflow-hidden">
      {/* Selector de Mesas */}
      <section className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
         <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="material-icons-round">table_restaurant</span> Mapa de Mesas
            </h2>
         </div>
         <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 bg-slate-50/50">
            {tables.map(table => (
              <button 
                key={table.id} 
                onClick={() => handleTableClick(table)} 
                className={`relative h-24 rounded-2xl border-2 flex flex-col justify-between p-3 transition-all transform active:scale-95 ${selectedTableId === table.id ? 'border-primary bg-primary text-white scale-105 shadow-xl z-10' : ''} ${selectedTableId !== table.id && table.status === 'available' ? 'bg-white border-slate-100 hover:border-accent shadow-sm' : ''} ${selectedTableId !== table.id && table.status === 'occupied' ? 'bg-white border-primary border-dashed shadow-sm' : ''} ${selectedTableId !== table.id && table.status === 'billing' ? 'bg-amber-50 border-amber-500 opacity-80' : ''} ${selectedTableId !== table.id && table.status === 'reserved' ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed' : ''}`}
              >
                 <div className="flex justify-between items-start w-full">
                    <span className="font-bold text-lg">{table.id}</span>
                    {table.status === 'occupied' && <span className={`material-icons-round text-sm ${selectedTableId === table.id ? 'text-emerald-300' : 'text-primary'}`}>restaurant</span>}
                 </div>
                 <div className="text-left">
                    <p className={`text-[10px] font-bold uppercase ${selectedTableId === table.id ? 'text-white/60' : 'text-slate-400'}`}>{table.seats} Pers.</p>
                    {table.status === 'available' && <p className="text-[10px] font-bold text-emerald-600">Libre</p>}
                    {table.status === 'occupied' && <p className={`text-[10px] font-bold ${selectedTableId === table.id ? 'text-white' : 'text-primary'}`}>Consumo</p>}
                    {table.status === 'billing' && <p className="text-[10px] font-bold text-amber-600">Cobro</p>}
                 </div>
              </button>
            ))}
         </div>
      </section>

      {/* Menú de Platos */}
      <section className="flex-1 bg-bg-light flex flex-col overflow-hidden">
         <header className="bg-white p-4 shadow-sm border-b flex flex-col gap-4">
            <div className="relative">
               <span className="material-icons-round absolute left-3 top-2.5 text-slate-400">search</span>
               <input type="text" placeholder="Buscar plato por nombre..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-accent" />
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
               {['Populares', 'Entradas', 'Fuertes', 'Pizza', 'Tragos', 'Postres'].map((cat, i) => (
                 <button key={cat} className="flex flex-col items-center gap-1 min-w-[70px] group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${i===0 ? 'bg-primary text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 group-hover:bg-primary/5'}`}>
                       <span className="material-icons-round text-lg">{['star', 'tapas', 'dinner_dining', 'local_pizza', 'local_bar', 'icecream'][i]}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${i===0 ? 'text-primary' : 'text-slate-400'}`}>{cat}</span>
                 </button>
               ))}
            </div>
         </header>
         <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {plates.map(plate => (
              <div 
                key={plate.id} 
                onClick={() => addToCart(plate)} 
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border-2 border-transparent hover:border-accent group cursor-pointer transform active:scale-95 ${!selectedTableId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                 <div className="h-32 relative">
                    <img src={plate.image} alt={plate.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm">$ {plate.sellingPrice.toFixed(2)}</div>
                 </div>
                 <div className="p-3">
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{plate.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{plate.category}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Carrito de Pedido */}
      <section className="w-full lg:w-85 bg-white border-l border-slate-200 flex flex-col shadow-2xl z-20 shrink-0">
         <header className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-colors ${selectedTableId ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {selectedTableId || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">Mesa Seleccionada</h3>
                    <p className="text-xs text-slate-400">{selectedTableId ? 'Editando pedido...' : 'Seleccione mesa'}</p>
                  </div>
               </div>
               <button onClick={() => setCart([])} className="text-slate-300 hover:text-red-500 p-2 transition-colors"><span className="material-icons-round">delete_outline</span></button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.map(item => {
              const plate = plates.find(p => p.id === item.plateId);
              return (
                <div key={item.plateId} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                   <div className="flex gap-4 items-center">
                      <div className="flex flex-col items-center gap-1">
                         <button onClick={() => addToCart(plate!)} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition shadow-sm"><span className="material-icons-round text-sm">add</span></button>
                         <span className="font-bold text-xs text-slate-900">{item.qty}</span>
                         <button onClick={() => removeFromCart(item.plateId)} className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition shadow-sm"><span className="material-icons-round text-sm">remove</span></button>
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-800 text-sm">{plate?.name}</h4>
                         <p className="text-[10px] text-slate-400 font-mono tracking-tighter">${plate?.sellingPrice.toFixed(2)} c/u</p>
                      </div>
                   </div>
                   <span className="font-bold text-sm text-slate-900 font-mono">${((plate?.sellingPrice || 0) * item.qty).toFixed(2)}</span>
                </div>
              );
            })}
            {cart.length === 0 && (
              <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                 <span className="material-icons-round text-6xl">shopping_basket</span>
                 <p className="font-bold text-sm">Carrito vacío</p>
              </div>
            )}
         </div>

         <footer className="p-6 border-t border-slate-100 bg-white">
            <div className="space-y-3 mb-6">
               <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider"><span>Subtotal</span><span>${calculateTotal().toFixed(2)}</span></div>
               <div className="flex justify-between items-end pt-3 mt-3 border-t-2 border-dashed border-slate-100">
                  <span className="font-bold text-slate-800">Total Sugerido</span>
                  <span className="font-black text-3xl text-primary font-mono">${(calculateTotal() * 1.1).toFixed(2)}</span>
               </div>
            </div>
            <button 
              disabled={!selectedTableId || cart.length === 0} 
              onClick={handleSendToKitchen} 
              className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${!selectedTableId || cart.length === 0 ? 'bg-slate-100 text-slate-300' : 'bg-primary text-white shadow-2xl shadow-primary/40 hover:bg-primary-light'}`}
            >
               Comandar Pedido <span className="material-icons-round">restaurant</span>
            </button>
         </footer>
      </section>
    </div>
  );
};

export default WaiterView;
