import { motion } from "framer-motion";
import { MenuItem } from "@/data/pizzaData";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface PizzaCardProps {
  item: MenuItem;
}

export default function PizzaCard({ item }: PizzaCardProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      name: item.name,
      config: { base: null, sauce: null, cheese: null, veggies: [], meat: null },
      quantity: 1,
      price: item.price,
      image: item.image,
      isCustom: false,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-gold"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {item.popular && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-1">{item.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-display text-2xl font-bold">₹{item.price}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:shadow-gold transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
