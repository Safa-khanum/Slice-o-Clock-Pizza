import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Package, MapPin } from "lucide-react";
import type { DeliveryAddress } from "@/components/DeliveryAddressForm";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state as {
    orderId: string;
    paymentId: string;
    totalPrice: number;
    itemCount: number;
    deliveryAddress?: DeliveryAddress;
  } | null;

  return (
    <div className="bg-dark-texture min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Order <span className="text-gradient-gold">Confirmed!</span>
        </h1>
        <p className="text-muted-foreground mb-6">
          Your pizza is being prepared with love 🍕
        </p>

        {order && (
          <>
            <div className="bg-secondary rounded-lg p-4 mb-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="text-foreground font-mono text-xs">{order.orderId.slice(0, 8)}…</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="text-foreground font-mono text-xs">{order.paymentId.slice(0, 18)}…</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="text-foreground">{order.itemCount}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-foreground font-semibold">Total Paid</span>
                <span className="text-primary font-display font-bold text-lg">₹{order.totalPrice.toFixed(0)}</span>
              </div>
            </div>

            {order.deliveryAddress && (
              <div className="bg-secondary rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Delivering to</span>
                </div>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress.name}</p>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {order.deliveryAddress.addressLine}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-gold transition-all"
          >
            <Package className="w-4 h-4" /> Track Order
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Order More <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
