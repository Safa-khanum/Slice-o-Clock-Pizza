import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ShoppingCart, Check } from "lucide-react";
import {
  PIZZA_BASES, SAUCES, CHEESES, VEGGIES, MEATS,
  PizzaConfig, PizzaOption, calculatePizzaPrice,
} from "@/data/pizzaData";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { key: "base", title: "Choose Your Base", options: PIZZA_BASES },
  { key: "sauce", title: "Pick Your Sauce", options: SAUCES },
  { key: "cheese", title: "Select Cheese", options: CHEESES },
  { key: "veggies", title: "Add Veggies", options: VEGGIES },
  { key: "meat", title: "Add Meat", options: MEATS },
] as const;

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<PizzaConfig>({
    base: null, sauce: null, cheese: null, veggies: [], meat: null,
  });
  const { addItem } = useCart();
  const navigate = useNavigate();
  const currentStep = STEPS[step];
  const price = calculatePizzaPrice(config);

  const isSelected = (option: PizzaOption) => {
    if (currentStep.key === "veggies") return config.veggies.some(v => v.id === option.id);
    const val = config[currentStep.key as keyof Omit<PizzaConfig, "veggies">];
    return val?.id === option.id;
  };

  const select = (option: PizzaOption) => {
    if (currentStep.key === "veggies") {
      setConfig(prev => ({
        ...prev,
        veggies: prev.veggies.some(v => v.id === option.id)
          ? prev.veggies.filter(v => v.id !== option.id)
          : [...prev.veggies, option],
      }));
    } else {
      setConfig(prev => ({ ...prev, [currentStep.key]: option }));
    }
  };

  const canProceed = () => {
    if (step === 3) return true; // veggies optional
    if (step === 4) return true; // meat optional
    const val = config[currentStep.key as keyof Omit<PizzaConfig, "veggies">];
    return !!val;
  };

  const handleAddToCart = () => {
    addItem({
      name: "Custom Pizza",
      config,
      quantity: 1,
      price,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
      isCustom: true,
    });
    toast.success("Custom pizza added to cart!");
    navigate("/cart");
  };

  return (
    <div className="bg-dark-texture min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-primary uppercase tracking-[0.3em] text-sm mb-3">Customize</p>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Build Your <span className="text-gradient-gold">Pizza</span>
          </h1>
        </motion.div>

        {/* Step indicator */}
        <div className="flex justify-center mb-10 gap-1">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step ? "bg-primary text-primary-foreground"
                  : i === step ? "bg-primary/20 text-primary border-2 border-primary"
                  : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-secondary"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Price display */}
        <div className="text-center mb-8">
          <span className="text-muted-foreground text-sm">Current Price: </span>
          <span className="font-display text-3xl font-bold text-primary">₹{price}</span>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-display text-2xl font-semibold text-foreground text-center mb-6">
              {currentStep.title}
            </h2>
            {currentStep.key === "veggies" && (
              <p className="text-muted-foreground text-center text-sm mb-4">Select multiple toppings</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {currentStep.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => select(option)}
                  className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected(option)
                      ? "border-primary bg-primary/10 shadow-gold"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {isSelected(option) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <p className="font-medium text-foreground text-sm">{option.name}</p>
                  <p className="text-primary text-xs mt-1">
                    {option.price > 0 ? `+₹${option.price}` : "Free"}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground disabled:opacity-30 hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium disabled:opacity-30 hover:shadow-gold transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-gold-lg transition-all hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart — ₹{price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
