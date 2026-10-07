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

function toSeoName(folder, index, ext) {
  const baseName = folder.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${baseName}-design-ideas-${index}${ext}`;
}

function toSeoTitle(folder, index) {
  const baseName = folder.replace(/_/g, ' ')
    .replace(/&/g, 'and');
  return `${baseName} Design ${index}`;
}

function processFolder(folder, prefixId) {
  const dirPath = path.join(assetsDir, folder);
  if (!fs.existsSync(dirPath)) return [];
  
  const files = fs.readdirSync(dirPath).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
  const renamedFiles = [];
  
  let i = 1;
  for (const file of files) {
    const ext = path.extname(file);
    // Only rename if it's not already SEO optimized (simple heuristic: has WhatsApp or spaces)
    let newFileName = file;
    if (file.includes('WhatsApp') || file.includes(' ') || file.includes('(')) {
       newFileName = toSeoName(folder, i, ext);
       
       // Handle collisions if any
       while (fs.existsSync(path.join(dirPath, newFileName)) && newFileName !== file) {
         i++;
         newFileName = toSeoName(folder, i, ext);
       }
       
       fs.renameSync(path.join(dirPath, file), path.join(dirPath, newFileName));
    }
    renamedFiles.push({
      original: file,
      new: newFileName,
      index: i
    });
    i++;
  }
  return renamedFiles;
}

let galleryItems = [];
let gId = 1;

for (const folder of galleryFolders) {
  const filesInfo = processFolder(folder, 'gallery');
  for (const fileInfo of filesInfo) {
    galleryItems.push({
      id: gId,
      title: toSeoTitle(folder, gId),
      category: folder.replace(/_/g, ' '),
      image: `new URL('../../assets/${folder}/${fileInfo.new}', import.meta.url).href`,
      alt: toSeoTitle(folder, gId)
    });
    gId++;
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
  const filesInfo = processFolder(folder, 'product');
  for (const fileInfo of filesInfo) {
    productItems.push({
      id: `prod-${pId}`,
      name: toSeoTitle(folder, pId),
      category: folder.replace(/_/g, ' '),
      description: `Premium quality ${folder.replace(/_/g, ' ')} for residential and commercial spaces. Upgrade your interior with our modern designs.`,
      image: `new URL('../../assets/${folder}/${fileInfo.new}', import.meta.url).href`
    });
    pId++;
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
