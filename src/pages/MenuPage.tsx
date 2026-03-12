import { useState } from "react";
import { motion } from "framer-motion";
import PizzaCard from "@/components/PizzaCard";
import { MENU_ITEMS } from "@/data/pizzaData";

const categories = [
  { id: "all", label: "All" },
  { id: "classic", label: "Classic" },
  { id: "specialty", label: "Specialty" },
  { id: "vegetarian", label: "Vegetarian" },
];

export default function MenuPage() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? MENU_ITEMS : MENU_ITEMS.filter(p => p.category === active);

  return (
    <div className="bg-dark-texture min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-3">Explore</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Our <span className="text-gradient-gold">Menu</span>
          </h1>
        </motion.div>

        {/* Category filters */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                active === cat.id
                  ? "bg-primary text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(pizza => (
            <PizzaCard key={pizza.id} item={pizza} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
