const fs = require('fs');

const replaceInFile = (file, replacer) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
};

// 1. pdf.ts
replaceInFile('src/lib/pdf.ts', c => {
  let text = c;
  text = text.replace("let tableData =", "let tableData: any[] =");
  text = text.replace("profile.upi_id,", "profile.upi_id || '',");
  text = text.replace("`upi://pay?pa=${profile.upi_id}&pn=${encodeURIComponent(profile.name)}&am=${totalAmount}&cu=INR`,", "`upi://pay?pa=${profile.upi_id || ''}&pn=${encodeURIComponent(profile.name || '')}&am=${totalAmount}&cu=INR`,");
  return text;
});

// 2. QuoteEditor.tsx
replaceInFile('src/invoice/pages/QuoteEditor.tsx', c => {
  return c.replace("setQuote(q => ({ ...q, tax_rate:", "setQuote((q: any) => ({ ...q, tax_rate:");
});

// 3. InvoiceEditor.tsx
replaceInFile('src/invoice/pages/InvoiceEditor.tsx', c => {
  return c.replace("import { Plus, Trash2, Save, Download, ArrowLeft, Calculator, Receipt } from 'lucide-react';", "import { Plus, Download, ArrowLeft, Calculator } from 'lucide-react';");
});

// 4. Dashboard.tsx
replaceInFile('src/invoice/pages/Dashboard.tsx', c => {
  return c.replace("import { supabase } from '../../lib/supabase';\n", "");
});

// 5. InvoiceApp.tsx
replaceInFile('src/invoice/InvoiceApp.tsx', c => {
  return c.replace("import { Session }", "import type { Session }");
});
