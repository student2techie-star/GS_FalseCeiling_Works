export type GalleryItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  alt: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Modern Living Room PVC Ceiling",
    category: "False Ceiling",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    alt: "Modern living room PVC false ceiling"
  },
  {
    id: 2,
    title: "Commercial Office Grid Ceiling",
    category: "Commercial Interiors",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    alt: "Commercial office grid ceiling installation"
  },
  {
    id: 3,
    title: "Elegant Gypsum Bedroom Ceiling",
    category: "Residential Interiors",
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&q=80&w=800",
    alt: "Elegant gypsum bedroom ceiling design"
  },
  {
    id: 4,
    title: "Restaurant Acoustic Ceiling",
    category: "Commercial Interiors",
    image: "https://images.unsplash.com/photo-1541889819617-104975765792?auto=format&fit=crop&q=80&w=800",
    alt: "Restaurant acoustic ceiling interior"
  },
  {
    id: 5,
    title: "Minimalist Wall Paneling",
    category: "Interior Materials",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    alt: "Minimalist interior wall paneling"
  },
  {
    id: 6,
    title: "Decorative Hallway Ceiling",
    category: "Residential Interiors",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800",
    alt: "Decorative hallway false ceiling"
  }
];

export const galleryCategories = [
  "All",
  "False Ceiling",
  "Commercial Interiors",
  "Residential Interiors",
  "Interior Materials"
];
