const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');

const galleryFolders = [
  '2x2_PVC_Gypsum_ceiling_tiles_output',
  'CeilingPanels_Output',
  'False_ceiling_outputs'
];

const productFolders = [
  'WallPanels',
  'CeilingPanels',
  'Ceiling channels',
  'Dual_Wall_ceiling_Panel',
  'Interior Ceiling flowers & Cornice models'
];

function getFiles(folder) {
  const dirPath = path.join(assetsDir, folder);
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
}

let galleryItems = [];
let gId = 1;

for (const folder of galleryFolders) {
  const files = getFiles(folder);
  for (const file of files) {
    galleryItems.push({
      id: gId++,
      title: `${folder.replace(/_/g, ' ')} ${gId}`,
      category: folder.replace(/_/g, ' '),
      image: `new URL('../../assets/${folder}/${file}', import.meta.url).href`,
      alt: `${folder} image`
    });
  }
}

let galleryCategories = ["All", ...galleryFolders.map(f => f.replace(/_/g, ' '))];

let galleryContent = `export type GalleryItem = {
  id: number;
  title: string;
  category: string;
  image: string;
  alt: string;
};

export const galleryItems: GalleryItem[] = [
${galleryItems.map(item => `  {
    id: ${item.id},
    title: "${item.title}",
    category: "${item.category}",
    image: ${item.image},
    alt: "${item.alt}"
  }`).join(',\n')}
];

export const galleryCategories = ${JSON.stringify(galleryCategories, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'site', 'data', 'gallery.ts'), galleryContent);


let productItems = [];
let pId = 1;

for (const folder of productFolders) {
  const files = getFiles(folder);
  for (const file of files) {
    productItems.push({
      id: `prod-${pId++}`,
      name: `${folder.replace(/_/g, ' ')} ${pId}`,
      category: folder.replace(/_/g, ' '),
      description: "High quality materials for your interior needs.",
      image: `new URL('../../assets/${folder}/${file}', import.meta.url).href`
    });
  }
}

let productCategories = ["All", ...productFolders.map(f => f.replace(/_/g, ' '))];

let productContent = `export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

export const products: Product[] = [
${productItems.map(item => `  {
    id: "${item.id}",
    name: "${item.name}",
    category: "${item.category}",
    description: "${item.description}",
    image: ${item.image}
  }`).join(',\n')}
];

export const productCategories = ${JSON.stringify(productCategories, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'site', 'data', 'products.ts'), productContent);
