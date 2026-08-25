'use client';

import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { useSse } from '../../lib/hooks/useSse';
import { Clock, Play, CheckCircle2, ChevronRight, AlertTriangle, RefreshCw, Loader } from 'lucide-react';

interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions: string | null;
  name?: string; // resolved locally or from backend
}

interface Order {
  id: string;
  tableNumber: number | null;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'OUT_FOR_DELIVERY' | 'CANCELLED';
  notes: string | null;
  totalAmount: number;
  finalAmount: number;
  contactName: string;
  items: OrderItem[];
  createdAt: string;
}

interface MenuItem {
  id: string;
  name: string;
}

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Refresh clock for ticket duration timers
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function initKitchen() {
      try {
        setLoading(true);
        setError('');
        
        // Fetch items to resolve names in tickets
        const items = await apiRequest<MenuItem[]>('/menu/items');
        setMenuItems(items);

        // Fetch active orders
        const activeOrders = await apiRequest<Order[]>('/kitchen/orders');
        setOrders(activeOrders);
      } catch (err: any) {
        setError('Failed to connect to kitchen API. Ensure the backend is active.');
      } finally {
        setLoading(false);
      }
    }
    initKitchen();
  }, []);

  // Listen to real-time events via SSE
  useSse({
    onNewOrder: (newOrder: Order) => {
      // Append if not already in list
      setOrders(prev => {
        if (prev.some(o => o.id === newOrder.id)) return prev;
        return [...prev, newOrder];
      });
    },
    onStatusUpdate: (updatedOrder: Order) => {
      // If completed or cancelled, remove from kitchen active board
      if (updatedOrder.status === 'COMPLETED' || updatedOrder.status === 'CANCELLED') {
        setOrders(prev => prev.filter(o => o.id !== updatedOrder.id));
      } else {
        // Update status of matching order
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      }
    }
  });

  const getDishName = (menuItemId: string) => {
    return menuItems.find(i => i.id === menuItemId)?.name || 'Unknown Dish';
  };

  const getElapsedTime = (createdAtString: string) => {
    const elapsedMs = time - new Date(createdAtString).getTime();
    const minutes = Math.floor(elapsedMs / 60000);
    return minutes;
  };

  const handleAdvanceStatus = async (orderId: string, currentStatus: Order['status'], type: Order['orderType']) => {
    let nextStatus: Order['status'];

    switch (currentStatus) {
      case 'PLACED':
        nextStatus = 'CONFIRMED';
        break;
      case 'CONFIRMED':
        nextStatus = 'PREPARING';
        break;
      case 'PREPARING':
        nextStatus = 'READY';
        break;
      case 'READY':
        nextStatus = type === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'COMPLETED';
        break;
      case 'OUT_FOR_DELIVERY':
        nextStatus = 'COMPLETED';
        break;
      default:
        return;
    }

    try {
      await apiRequest<Order>(`/orders/${orderId}/status`, 'PATCH', { status: nextStatus });
      // The local state will be updated automatically via the SSE event handler!
    } catch (e) {
      // Error handling
    }
  };

  const getActionButtonText = (status: Order['status'], type: Order['orderType']) => {
    switch (status) {
      case 'PLACED': return 'Confirm Order';
      case 'CONFIRMED': return 'Start Prep';
      case 'PREPARING': return 'Mark Ready';
      case 'READY': return type === 'DELIVERY' ? 'Dispatch Delivery' : 'Mark Served';
      case 'OUT_FOR_DELIVERY': return 'Mark Delivered';
      default: return 'Done';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PLACED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'CONFIRMED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'PREPARING': return 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse';
      case 'READY': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-brand-charcoal text-brand-cream min-h-screen p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 border-b border-brand-charcoal-muted pb-6">
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-brand-gold">
            Kitchen Display System
          </h1>
          <p className="text-xs text-brand-cream/60 mt-1 uppercase tracking-wider">
            Real-Time Chef Ticket Dashboard • {orders.length} Active Orders
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>SSE Channel Connected</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 text-brand-gold space-y-3">
          <Loader className="w-10 h-10 animate-spin" />
          <span className="text-sm tracking-wider uppercase">Loading Kitchen Tickets...</span>
        </div>
      ) : error ? (
        <div className="text-center py-20 border border-brand-charcoal-muted rounded-sm bg-brand-charcoal-light">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-brand-charcoal-muted rounded-sm text-brand-cream/40">
          <Clock className="w-12 h-12 mx-auto mb-4 stroke-[1.5]" />
          <p className="font-serif text-2xl font-semibold">No Pending Tickets</p>
          <p className="text-xs mt-1">Orders placed by customers will stream here instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((ord) => {
            const elapsed = getElapsedTime(ord.createdAt);
            const isLate = elapsed >= 15; // Warn if prep takes > 15 mins

            return (
              <div 
                key={ord.id}
                className={`bg-brand-charcoal-light border rounded-sm flex flex-col justify-between shadow-lg overflow-hidden transition-all ${isLate ? 'border-red-500/50 ring-2 ring-red-500/10' : 'border-brand-charcoal-muted'}`}
              >
                {/* Ticket Top */}
                <div className="p-4 border-b border-brand-charcoal-muted space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-serif text-lg font-bold">
                      {ord.orderType === 'DINE_IN' ? `Table ${ord.tableNumber || 'Guest'}` : ord.orderType.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border uppercase ${getStatusColor(ord.status)}`}>
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-brand-cream/50">
                    <span>ID: {ord.id.substring(0, 8)}</span>
                    <span className={`flex items-center space-x-1 ${isLate ? 'text-red-400 font-bold' : ''}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{elapsed}m elapsed</span>
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 flex-grow space-y-4">
                  <ul className="space-y-3">
                    {ord.items && ord.items.map((item) => (
                      <li key={item.id} className="text-sm">
                        <div className="flex justify-between font-semibold">
                          <span>
                            <span className="text-brand-gold font-bold text-base mr-2">{item.quantity}x</span>
                            {getDishName(item.menuItemId)}
                          </span>
                        </div>
                        {item.specialInstructions && (
                          <div className="flex items-start space-x-1.5 text-xs text-amber-400 bg-amber-500/5 p-2 rounded-sm border border-amber-500/10 mt-1">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>Req: {item.specialInstructions}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {ord.notes && (
                    <div className="border-t border-brand-charcoal-muted pt-3 mt-3 text-xs text-brand-cream/60 italic">
                      Note: {ord.notes}
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="p-4 border-t border-brand-charcoal-muted bg-brand-charcoal-muted/30">
                  <button
                    onClick={() => handleAdvanceStatus(ord.id, ord.status, ord.orderType)}
                    className="w-full bg-brand-terracotta hover:bg-brand-terracotta-light text-white py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                  >
                    <span>{getActionButtonText(ord.status, ord.orderType)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
