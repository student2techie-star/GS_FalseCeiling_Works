export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "pvc-false-ceiling",
    name: "PVC False Ceiling",
    category: "PVC Ceiling",
    description: "Practical and durable ceiling solution suitable for a variety of interior applications. Water-resistant and easy to maintain.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gypsum-ceiling",
    name: "Gypsum Ceiling Boards",
    category: "Gypsum",
    description: "High-quality gypsum boards for seamless, elegant interior ceilings. Ideal for residential and commercial spaces.",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "armstrong-ceiling",
    name: "Armstrong Ceiling Systems",
    category: "Armstrong",
    description: "Premium modular ceiling systems offering superior acoustics and a professional finish for offices and commercial spaces.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "mineral-fibre-ceiling",
    name: "Mineral Fibre Ceiling",
    category: "Mineral Fibre",
    description: "Acoustical mineral fibre ceiling tiles designed for sound absorption and fire resistance.",
    image: "https://images.unsplash.com/photo-1541889819617-104975765792?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "interior-wall-panels",
    name: "Interior Wall Panels",
    category: "Interior Materials",
    description: "Decorative and functional wall panels to enhance your interior aesthetics.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "ceiling-grids",
    name: "Ceiling Grids & Accessories",
    category: "Interior Materials",
    description: "Complete range of grid systems and structural accessories for false ceiling installation.",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800"
  }
];

export const productCategories = [
  "All",
  "PVC Ceiling",
  "Gypsum",
  "Armstrong",
  "Mineral Fibre",
  "Interior Materials"
];
