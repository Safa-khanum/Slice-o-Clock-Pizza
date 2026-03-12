import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, ChefHat, Truck, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: string;
  items: any;
  total_price: number;
  status: string;
  created_at: string;
}

const STATUS_STEPS = ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered"];
const STATUS_ICONS = [Package, ChefHat, Truck, CheckCircle];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchOrders();

    // Real-time subscription for order updates
    const channel = supabase
      .channel("order-updates")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, payload => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } as Order : o));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  async function fetchOrders() {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }

  const getStatusIndex = (status: string) => STATUS_STEPS.indexOf(status);

  if (loading) {
    return <div className="bg-dark-texture min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading orders...</p></div>;
  }

  return (
    <div className="bg-dark-texture min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground">
            Your <span className="text-gradient-gold">Orders</span>
          </h1>
        </motion.div>

        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground">No orders yet. Start ordering!</p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const statusIdx = getStatusIndex(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="font-display font-bold text-primary text-lg">₹{Number(order.total_price).toFixed(0)}</p>
                  </div>

                  {/* Status tracker */}
                  <div className="flex items-center justify-between mt-4">
                    {STATUS_STEPS.map((step, i) => {
                      const Icon = STATUS_ICONS[i];
                      const active = i <= statusIdx;
                      return (
                        <div key={step} className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className={`text-[10px] mt-1 text-center ${active ? "text-primary" : "text-muted-foreground"}`}>{step}</p>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`hidden`} /> // connector handled by flex gap
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Items summary */}
                  <div className="mt-4 pt-4 border-t border-border">
                    {(order.items as any[]).map((item: any, i: number) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
