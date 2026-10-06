export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

export const products: Product[] = [
  ...Array.from({ length: 34 }, (_, i) => ({
    id: `wall-panel-${i + 1}`,
    name: `Wall Panel ${i + 1}`,
    category: "Wall Panels",
    description: "Stylish wall panel for a modern look. Easy to install and long lasting. Good for homes, offices and shops.",
    image: new URL(`../../assets/WallPanels/panels${i + 1}.jpg`, import.meta.url).href
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `ceiling-panel-${i + 1}`,
    name: `Ceiling Panel ${i + 1}`,
    category: "Ceiling Panels",
    description: "Modern ceiling panel for a clean and stylish look. Easy to install and long lasting. Good for homes, offices and shops.",
    image: new URL(`../../assets/CeilingPanels/ceilingpanels${i + 1}.jpg`, import.meta.url).href
  }))
];

export const productCategories = [
  "All",
  "Wall Panels",
  "Ceiling Panels"
];
