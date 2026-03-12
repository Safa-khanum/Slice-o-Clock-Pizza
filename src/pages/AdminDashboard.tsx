import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle, ChefHat, Truck, CheckCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Order {
  id: string;
  user_id: string;
  items: any;
  total_price: number;
  status: string;
  created_at: string;
  delivery_address: string | null;
}

interface InventoryItem {
  id: string;
  category: string;
  item_name: string;
  quantity: number;
  threshold: number;
}

const STATUS_OPTIONS = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "inventory">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  async function fetchData() {
    setLoading(true);
    const [{ data: ordersData }, { data: invData }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("inventory").select("*").order("category, item_name"),
    ]);
    setOrders(ordersData ?? []);
    setInventory(invData ?? []);
    setLoading(false);
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error("Failed to update status");
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order updated to: ${newStatus}`);
    }
  }

  async function updateInventoryQuantity(id: string, quantity: number) {
    const { error } = await supabase.from("inventory").update({ quantity }).eq("id", id);
    if (error) {
      toast.error("Failed to update inventory");
    } else {
      setInventory(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  }

  if (authLoading || loading) {
    return <div className="bg-dark-texture min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!isAdmin) return null;

  const lowStockItems = inventory.filter(i => i.quantity <= i.threshold);

  return (
    <div className="bg-dark-texture min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground">
            Admin <span className="text-gradient-gold">Dashboard</span>
          </h1>
        </motion.div>

        {/* Low stock alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <h3 className="font-display font-semibold text-accent">Low Stock Alert</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(i => (
                <span key={i.id} className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                  {i.item_name}: {i.quantity} left
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["orders", "inventory"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
          <button onClick={fetchData} className="ml-auto text-muted-foreground hover:text-primary transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center">No orders yet</p>
            ) : orders.map(order => (
              <div key={order.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    <p className="font-display font-bold text-primary mt-1">₹{Number(order.total_price).toFixed(0)}</p>
                    {order.delivery_address && (
                      <div className="mt-2 text-xs text-muted-foreground bg-secondary rounded p-2">
                        <span className="font-semibold text-foreground">📍 </span>
                        {order.delivery_address}
                      </div>
                    )}
                    <div className="mt-2">
                      {(order.items as any[]).map((item: any, i: number) => (
                        <p key={i} className="text-sm text-muted-foreground">{item.quantity}x {item.name}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Status</label>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inventory tab */}
        {tab === "inventory" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["base", "sauce", "cheese", "veggie", "meat"].map(category => (
              <div key={category} className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-display font-semibold text-foreground capitalize mb-3">{category}</h3>
                <div className="space-y-2">
                  {inventory.filter(i => i.category === category).map(item => (
                    <div key={item.id} className={`flex items-center justify-between p-2 rounded ${item.quantity <= item.threshold ? "bg-accent/10 border border-accent/30" : "bg-secondary"}`}>
                      <span className="text-sm text-foreground">{item.item_name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateInventoryQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-6 h-6 rounded bg-muted text-foreground text-xs flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        >−</button>
                        <span className={`text-sm font-medium w-8 text-center ${item.quantity <= item.threshold ? "text-accent" : "text-foreground"}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateInventoryQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-muted text-foreground text-xs flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        >+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
