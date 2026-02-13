
export enum UserRole {
  ADMIN = 'ADMIN',
  WAITER = 'WAITER',
  CASHIER = 'CASHIER'
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  currentQty: number; // in grams
  unitPrice: number; // per gram
  minQty: number;
  criticalQty: number;
  icon: string;
}

export interface PlateIngredient {
  ingredientId: string;
  qty: number; // grams
}

export interface Plate {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  ingredients: PlateIngredient[];
  status: 'active' | 'inactive';
  image: string;
}

export interface OrderItem {
  plateId: string;
  qty: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'open' | 'preparing' | 'delivered' | 'paid';
  total: number;
  timestamp: Date;
}

export interface Table {
  id: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'billing';
  currentOrderId?: string;
}
