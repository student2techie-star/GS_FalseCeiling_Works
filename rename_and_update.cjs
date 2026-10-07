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

// Map actual folder names to good SEO categories and keywords
const seoMapping = {
  '2x2_PVC_Gypsum_ceiling_tiles_output': {
    category: 'PVC Gypsum Ceiling Tiles',
    slug: 'pvc-gypsum-ceiling-tiles',
    title: 'PVC Gypsum Ceiling Tile Design'
  },
  'CeilingPanels_Output': {
    category: 'Modern Ceiling Panels',
    slug: 'modern-ceiling-panels',
    title: 'Modern Ceiling Panel Design'
  },
  'False_ceiling_outputs': {
    category: 'Designer False Ceilings',
    slug: 'designer-false-ceilings',
    title: 'Designer False Ceiling'
  },
  'WallPanels': {
    category: 'Decorative Wall Panels',
    slug: 'decorative-wall-panels',
    title: 'Decorative Wall Panel Design'
  },
  'CeilingPanels': {
    category: 'Premium Ceiling Panels',
    slug: 'premium-ceiling-panels',
    title: 'Premium Ceiling Panel Design'
  },
  'Ceiling channels': {
    category: 'Ceiling Channels & Accessories',
    slug: 'ceiling-channels-accessories',
    title: 'Ceiling Channel Accessory'
  },
  'Dual_Wall_ceiling_Panel': {
    category: 'Dual Wall & Ceiling Panels',
    slug: 'dual-wall-ceiling-panels',
    title: 'Dual Wall and Ceiling Panel Design'
  },
  'Interior Ceiling flowers & Cornice models': {
    category: 'Ceiling Flowers & Cornices',
    slug: 'ceiling-flowers-and-cornices',
    title: 'Interior Ceiling Flower and Cornice Design'
  }
};


function toSeoName(folder, index, ext) {
  const slug = seoMapping[folder]?.slug || folder.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${slug}-ideas-${index}${ext}`;
}

function toSeoTitle(folder, index) {
  const title = seoMapping[folder]?.title || folder.replace(/_/g, ' ');
  return `${title} ${index}`;
}

function toSeoCategory(folder) {
  return seoMapping[folder]?.category || folder.replace(/_/g, ' ');
}

function processFolder(folder, prefixId) {
  const dirPath = path.join(assetsDir, folder);
  if (!fs.existsSync(dirPath)) return [];
  
  const files = fs.readdirSync(dirPath).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
  const renamedFiles = [];
  
  // Sort files to have consistent indexing
  files.sort();
  
  let i = 1;
  for (const file of files) {
    const ext = path.extname(file);
    const slug = seoMapping[folder]?.slug || folder.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // We want to force a rename to the newest SEO format if it's not already exactly matching our new format
    let newFileName = file;
    const expectedPrefix = `${slug}-ideas-`;
    
    if (!file.startsWith(expectedPrefix)) {
       newFileName = toSeoName(folder, i, ext);
       
       // Handle collisions if any (e.g. if we are renaming multiple things and one happens to match)
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
      category: toSeoCategory(folder),
      image: `new URL('../../assets/${folder}/${fileInfo.new}', import.meta.url).href`,
      alt: toSeoTitle(folder, gId)
    });
    gId++;
  }
}

let galleryCategories = ["All", ...galleryFolders.map(f => toSeoCategory(f))];

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
      category: toSeoCategory(folder),
      description: `Premium quality ${toSeoCategory(folder).toLowerCase()} for residential and commercial spaces. Upgrade your interior with our modern designs.`,
      image: `new URL('../../assets/${folder}/${fileInfo.new}', import.meta.url).href`
    });
    pId++;
  }
}

let productCategories = ["All", ...productFolders.map(f => toSeoCategory(f))];

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
