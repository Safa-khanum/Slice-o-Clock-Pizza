import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";
import DeliveryAddressForm, { type DeliveryAddress } from "@/components/DeliveryAddressForm";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "address">("cart");
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);

  const handleProceedToAddress = () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/login");
      return;
    }
    setStep("address");
  };

  const handleAddressContinue = (address: DeliveryAddress) => {
    setDeliveryAddress(address);
    setPaymentOpen(true);
  };

  const deductInventory = async () => {
    const ingredientNames: string[] = [];
    for (const item of items) {
      if (item.isCustom && item.config) {
        if (item.config.base) ingredientNames.push(item.config.base.name);
        if (item.config.sauce) ingredientNames.push(item.config.sauce.name);
        if (item.config.cheese) ingredientNames.push(item.config.cheese.name);
        item.config.veggies?.forEach((v) => ingredientNames.push(v.name));
        if (item.config.meat) ingredientNames.push(item.config.meat.name);
      }
    }
    if (ingredientNames.length === 0) return;

    const { data: invItems } = await supabase
      .from("inventory")
      .select("id, item_name, quantity")
      .in("item_name", ingredientNames);

    if (!invItems) return;

    for (const inv of invItems) {
      const count = ingredientNames.filter((n) => n === inv.item_name).length;
      await supabase
        .from("inventory")
        .update({ quantity: Math.max(0, inv.quantity - count) })
        .eq("id", inv.id);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setPaymentOpen(false);

    const orderItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      isCustom: item.isCustom,
      config: item.config,
    }));

    const addressStr = deliveryAddress
      ? `${deliveryAddress.name} | ${deliveryAddress.phone} | ${deliveryAddress.addressLine}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`
      : null;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user!.id,
          items: orderItems as any,
          total_price: totalPrice,
          payment_id: paymentId,
          status: "Order Received",
          delivery_address: addressStr,
        },
      ])
      .select("id")
      .single();

    if (error) {
      toast.error("Failed to place order: " + error.message);
      return;
    }

    deductInventory();

    toast.success("Payment successful! Order placed.");
    clearCart();
    navigate("/order-confirmation", {
      state: {
        orderId: data.id,
        paymentId,
        totalPrice,
        itemCount: items.length,
        deliveryAddress,
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="bg-dark-texture min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">Time to add some delicious pizza!</p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-gold transition-all"
          >
            Browse Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-dark-texture min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl font-bold text-foreground">
            Your <span className="text-gradient-gold">Cart</span>
          </h1>
        </motion.div>

        {/* Cart items */}
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card rounded-lg border border-border p-4 flex gap-4"
            >
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
                {item.isCustom && item.config.base && (
                  <p className="text-muted-foreground text-xs mt-1 truncate">
                    {[item.config.base?.name, item.config.sauce?.name, item.config.cheese?.name].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-primary font-display font-bold mt-1">₹{(item.price * item.quantity).toFixed(0)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-accent transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 bg-secondary rounded-lg">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-foreground hover:text-primary transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-medium text-foreground w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-foreground hover:text-primary transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total + action */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-muted-foreground">Total</span>
            <span className="font-display text-3xl font-bold text-primary">₹{totalPrice.toFixed(0)}</span>
          </div>

          {step === "cart" ? (
            <button
              onClick={handleProceedToAddress}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:shadow-gold-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {user ? "Proceed to Delivery" : "Sign In to Checkout"}
            </button>
          ) : (
            <button
              onClick={() => setStep("cart")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              ← Back to cart
            </button>
          )}
        </div>

        {/* Address form */}
        {step === "address" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <DeliveryAddressForm onContinue={handleAddressContinue} />
          </motion.div>
        )}
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={totalPrice}
      />
    </div>
  );
}
