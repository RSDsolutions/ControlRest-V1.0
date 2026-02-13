
import React, { useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, Ingredient, Plate, Order, Table } from './types';
import { INITIAL_INGREDIENTS, INITIAL_PLATES, INITIAL_TABLES } from './constants';

// Views
import LoginView from './views/LoginView';
import AdminDashboard from './views/AdminDashboard';
import IngredientsView from './views/IngredientsView';
import InventoryView from './views/InventoryView';
import PlatesView from './views/PlatesView';
import WaiterView from './views/WaiterView';
import CashierView from './views/CashierView';
import FinanceView from './views/FinanceView';

// Components
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [plates, setPlates] = useState<Plate[]>(INITIAL_PLATES);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleLogin = (role: UserRole) => {
    const names = {
      [UserRole.ADMIN]: 'Thomas Chef',
      [UserRole.WAITER]: 'James Harper',
      [UserRole.CASHIER]: 'Sarah M.'
    };
    setUser({ name: names[role], role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-bg-light">
        <Sidebar user={user} onLogout={handleLogout} />
        
        <main className="flex-1 overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<Navigate to={user.role === UserRole.ADMIN ? "/admin" : user.role === UserRole.WAITER ? "/waiter" : "/cashier"} />} />
            
            {/* Rutas de Administrador */}
            <Route path="/admin" element={<AdminDashboard ingredients={ingredients} plates={plates} orders={orders} />} />
            <Route path="/ingredients" element={<IngredientsView ingredients={ingredients} setIngredients={setIngredients} />} />
            <Route path="/inventory" element={<InventoryView ingredients={ingredients} />} />
            <Route path="/plates" element={<PlatesView plates={plates} ingredients={ingredients} setPlates={setPlates} />} />
            <Route path="/finance" element={<FinanceView orders={orders} ingredients={ingredients} />} />

            {/* Rutas de Mesero */}
            <Route path="/waiter" element={<WaiterView tables={tables} plates={plates} setOrders={setOrders} setTables={setTables} orders={orders} />} />

            {/* Rutas de Cajero */}
            <Route path="/cashier" element={<CashierView tables={tables} orders={orders} setTables={setTables} setOrders={setOrders} />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
