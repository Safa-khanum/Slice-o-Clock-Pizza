import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flame, Leaf } from "lucide-react";
import heroPizza from "@/assets/hero-pizza.jpg";
import PizzaCard from "@/components/PizzaCard";
import { MENU_ITEMS } from "@/data/pizzaData";

export default function HomePage() {
  const popularPizzas = MENU_ITEMS.filter(p => p.popular);

  return (
    <div className="bg-dark-texture min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroPizza} alt="Delicious artisan pizza" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <p className="text-primary font-body uppercase tracking-[0.3em] text-sm mb-4">
              Since 2026 · Artisan Pizza
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">Every Slice,</span>
              <br />
              <span className="text-gradient-gold">Right on Time</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
              Handcrafted pizzas baked in our stone oven, delivered hot to your door. Build your perfect pizza or choose from our chef's favorites.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:shadow-gold-lg transition-all hover:scale-105"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 border border-primary/50 text-primary px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-primary/10 transition-all"
              >
                Build Your Pizza
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "30 Min Delivery", desc: "Hot and fresh, always on time" },
              { icon: Flame, title: "Stone Oven Baked", desc: "Authentic wood-fired flavor" },
              { icon: Leaf, title: "Fresh Ingredients", desc: "Locally sourced, daily fresh" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Pizzas */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-3">Chef's Selection</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Most <span className="text-gradient-gold">Popular</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularPizzas.map(pizza => (
            <PizzaCard key={pizza.id} item={pizza} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wide hover:gap-4 transition-all"
          >
            View Full Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Build Your <span className="text-gradient-gold">Dream Pizza</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Choose your base, sauce, cheese, and toppings. Create a masterpiece that's uniquely yours.
            </p>
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-lg font-semibold uppercase tracking-wide hover:shadow-gold-lg transition-all hover:scale-105"
            >
              Start Building <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
