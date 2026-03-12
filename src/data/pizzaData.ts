export interface PizzaOption {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface PizzaConfig {
  base: PizzaOption | null;
  sauce: PizzaOption | null;
  cheese: PizzaOption | null;
  veggies: PizzaOption[];
  meat: PizzaOption | null;
}

export interface CartItem {
  id: string;
  name: string;
  config: PizzaConfig;
  quantity: number;
  price: number;
  image: string;
  isCustom: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

export const PIZZA_BASES: PizzaOption[] = [
  { id: "thin", name: "Thin Crust", price: 99 },
  { id: "thick", name: "Thick Crust", price: 119 },
  { id: "cheese-burst", name: "Cheese Burst", price: 149 },
  { id: "whole-wheat", name: "Whole Wheat", price: 119 },
  { id: "gluten-free", name: "Gluten Free", price: 139 },
];

export const SAUCES: PizzaOption[] = [
  { id: "tomato-basil", name: "Tomato Basil", price: 29 },
  { id: "bbq", name: "BBQ Sauce", price: 39 },
  { id: "garlic-parmesan", name: "Garlic Parmesan", price: 39 },
  { id: "pesto", name: "Pesto Sauce", price: 49 },
  { id: "spicy-marinara", name: "Spicy Marinara", price: 39 },
];

export const CHEESES: PizzaOption[] = [
  { id: "mozzarella", name: "Mozzarella", price: 49 },
  { id: "cheddar", name: "Cheddar", price: 49 },
  { id: "parmesan", name: "Parmesan", price: 59 },
  { id: "vegan", name: "Vegan Cheese", price: 69 },
  { id: "mix", name: "Mix Cheese", price: 79 },
];

export const VEGGIES: PizzaOption[] = [
  { id: "onion", name: "Onion", price: 19 },
  { id: "capsicum", name: "Capsicum", price: 19 },
  { id: "tomato", name: "Tomato", price: 19 },
  { id: "mushroom", name: "Mushroom", price: 29 },
  { id: "olives", name: "Olives", price: 29 },
  { id: "jalapenos", name: "Jalapeños", price: 25 },
  { id: "corn", name: "Corn", price: 19 },
  { id: "spinach", name: "Spinach", price: 25 },
];

export const MEATS: PizzaOption[] = [
  { id: "none", name: "No Meat", price: 0 },
  { id: "chicken", name: "Chicken", price: 79 },
  { id: "pepperoni", name: "Pepperoni", price: 99 },
  { id: "sausage", name: "Sausage", price: 79 },
  { id: "bacon", name: "Bacon", price: 99 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "margherita",
    name: "Margherita",
    description: "Fresh mozzarella, tomato sauce, and aromatic basil on a crispy thin crust",
    price: 199,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop",
    category: "classic",
    popular: true,
  },
  {
    id: "pepperoni",
    name: "Pepperoni Feast",
    description: "Loaded with spicy pepperoni, mozzarella cheese, and our signature tomato sauce",
    price: 349,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop",
    category: "classic",
    popular: true,
  },
  {
    id: "bbq-chicken",
    name: "BBQ Chicken",
    description: "Smoky BBQ sauce, grilled chicken, red onions, and cilantro",
    price: 399,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop",
    category: "specialty",
  },
  {
    id: "veggie-supreme",
    name: "Veggie Supreme",
    description: "Bell peppers, mushrooms, olives, onions, tomatoes on a whole wheat crust",
    price: 249,
    image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=500&h=500&fit=crop",
    category: "vegetarian",
    popular: true,
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    description: "Pepperoni, sausage, bacon, and chicken on a thick crust with extra cheese",
    price: 449,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop",
    category: "specialty",
  },
  {
    id: "hawaiian",
    name: "Hawaiian Paradise",
    description: "Ham, pineapple, and mozzarella with our signature tomato sauce",
    price: 329,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=500&h=500&fit=crop",
    category: "classic",
  },
  {
    id: "four-cheese",
    name: "Four Cheese",
    description: "Mozzarella, parmesan, cheddar, and gorgonzola on a cheese burst crust",
    price: 379,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&h=500&fit=crop",
    category: "vegetarian",
  },
  {
    id: "pesto-chicken",
    name: "Pesto Chicken",
    description: "Basil pesto, grilled chicken, sun-dried tomatoes, and fresh mozzarella",
    price: 419,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&h=500&fit=crop",
    category: "specialty",
  },
];

export function calculatePizzaPrice(config: PizzaConfig): number {
  let total = 0;
  if (config.base) total += config.base.price;
  if (config.sauce) total += config.sauce.price;
  if (config.cheese) total += config.cheese.price;
  config.veggies.forEach(v => total += v.price);
  if (config.meat) total += config.meat.price;
  return total;
}
