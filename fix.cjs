const fs = require('fs');
const files = [
  'src/invoice/pages/Enquiries.tsx', 
  'src/invoice/pages/InvoiceEditor.tsx', 
  'src/invoice/pages/QuoteEditor.tsx', 
  'src/lib/pdf.ts',
  'src/invoice/pages/Invoices.tsx',
  'src/invoice/pages/Quotations.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Replace literal backslash followed by backtick
    content = content.replace(/\\`/g, '`');
    // Replace literal backslash followed by dollar sign
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  }
});
