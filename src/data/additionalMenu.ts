export interface PricedMenuItem {
  id: string;
  name: string;
  price: number;
}

export interface PricedMenuCategory {
  id: string;
  title: string;
  tamil?: string;
  description?: string;
  items: PricedMenuItem[];
}

export const friedRiceNoodles: PricedMenuCategory = {
  id: "fried-rice-noodles",
  title: "Fried Rice & Noodles",
  tamil: "ப்ரைட் ரைஸ் & நூடுல்ஸ்",
  description:
    "Freshly prepared aromatic fried rice and noodles tossed with crisp vegetables and savory seasonings.",
  items: [
    { id: "frn-1", name: "Veg Fried Rice or Noodles", price: 129 },
    { id: "frn-2", name: "Paneer Fried Rice or Noodles", price: 149 },
    { id: "frn-3", name: "Mushroom Fried Rice or Noodles", price: 149 },
    { id: "frn-4", name: "Gobi Fried Rice or Noodles", price: 149 },
    { id: "frn-5", name: "Egg Fried Rice or Noodles", price: 159 },
    { id: "frn-6", name: "Chicken Fried Rice or Noodles", price: 179 },
    { id: "frn-7", name: "Veg Mix Fried Rice or Noodles", price: 169 },
  ],
};

export const indianBreads: PricedMenuCategory = {
  id: "indian-breads",
  title: "Indian Breads",
  tamil: "இந்தியன் பிரெட்ஸ்",
  description:
    "Traditional tandoor-baked Indian breads prepared fresh and brushed with rich butter.",
  items: [
    { id: "ib-1", name: "Tandoori Roti", price: 30 },
    { id: "ib-2", name: "Butter Roti", price: 35 },
    { id: "ib-3", name: "Plain Naan", price: 45 },
    { id: "ib-4", name: "Butter Naan", price: 55 },
    { id: "ib-5", name: "Garlic Naan", price: 65 },
    { id: "ib-6", name: "Cheese Garlic Naan", price: 89 },
    { id: "ib-7", name: "Kulcha", price: 55 },
    { id: "ib-8", name: "Butter Kulcha", price: 89 },
    { id: "ib-9", name: "Paneer Kulcha", price: 99 },
  ],
};

export const northIndianGravy: PricedMenuCategory = {
  id: "north-indian-gravy",
  title: "North Indian Gravy",
  tamil: "வட இந்திய கிரேவி",
  description:
    "Rich, slow-cooked North Indian curries and gravies spiced with authentic aromatic masalas.",
  items: [
    { id: "nig-1", name: "Paneer Butter Masala", price: 199 },
    { id: "nig-2", name: "Shahi Paneer", price: 209 },
    { id: "nig-3", name: "Palak Paneer", price: 209 },
    { id: "nig-4", name: "Paneer Tikka Masala", price: 219 },
    { id: "nig-5", name: "Kadai Paneer", price: 219 },
    { id: "nig-6", name: "Mushroom Masala", price: 199 },
    { id: "nig-7", name: "Butter Chicken Masala", price: 229 },
    { id: "nig-8", name: "Chicken Tikka Masala", price: 249 },
    { id: "nig-9", name: "Kadai Chicken", price: 269 },
    { id: "nig-10", name: "Chicken Masala", price: 229 },
    { id: "nig-11", name: "Prawn Masala", price: 299 },
    { id: "nig-12", name: "Fish Masala", price: 299 },
    { id: "nig-13", name: "Kadai Prawn", price: 299 },
    { id: "nig-14", name: "Kadai Fish", price: 299 },
  ],
};

export const grillTandooriBBQ: PricedMenuCategory = {
  id: "grill-tandoori-bbq",
  title: "Grill, Tandoori & BBQ",
  tamil: "கிரில், தந்தூரி & BBQ",
  description:
    "Succulent chicken marinated in fragrant spices and charred to perfection in tandoor and grill.",
  items: [
    { id: "gtb-1", name: "Grill Full", price: 500 },
    { id: "gtb-2", name: "Grill Half", price: 250 },
    { id: "gtb-3", name: "Tandoori Full", price: 500 },
    { id: "gtb-4", name: "Tandoori Half", price: 250 },
    { id: "gtb-5", name: "Tandoori Quarter", price: 130 },
    { id: "gtb-6", name: "BBQ Full", price: 560 },
    { id: "gtb-7", name: "BBQ Half", price: 280 },
    { id: "gtb-8", name: "BBQ Quarter", price: 140 },
  ],
};
