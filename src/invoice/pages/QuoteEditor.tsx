import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, Download, ArrowLeft, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import { toWords } from 'number-to-words'; // We would need a custom Indian system converter, but let's mock it for now.

// Simple Indian number to words (mock implementation for brevity)
function numberToWordsIndian(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  return 'Rupees ' + toWords(num).replace(/,/g, '') + ' Only'; // Naive fallback
}

export default function QuoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  
  // Quote State
  const [quote, setQuote] = useState<any>({
    number: 'Draft',
    customer_id: '',
    site_id: '',
    date: new Date().toISOString().split('T')[0],
    valid_until: '',
    status: 'Draft',
    discount: 0,
    tax_rate: 0,
    tax_type: 'IGST',
    notes: ''
  });

  // Room items State (Array of rooms, each with an array of items)
  const [rooms, setRooms] = useState<{name: string, items: any[]}[]>([
    { name: 'Hall', items: [] }
  ]);

  useEffect(() => {
    fetchInitialData();
    if (!isNew) {
      fetchQuoteData();
    }
  }, [id]);

  const fetchInitialData = async () => {
    const { data: cData } = await supabase.from('customers').select('*');
    if (cData) setCustomers(cData);

    const { data: tData } = await supabase.from('item_templates').select('*');
    if (tData) setTemplates(tData);

    const { data: pData } = await supabase.from('business_profile').select('default_tax_rate, terms').single();
    if (pData && isNew) {
      setQuote((q: any) => ({ ...q, tax_rate: pData.default_tax_rate, notes: pData.terms }));
    }
  };

  const fetchQuoteData = async () => {
    setLoading(true);
    // Fetch quote
    const { data: qData } = await supabase.from('quotations').select('*').eq('id', id).single();
    if (qData) {
      setQuote(qData);
      // Fetch sites for this customer
      const { data: sData } = await supabase.from('sites').select('*').eq('customer_id', qData.customer_id);
      if (sData) setSites(sData);
      
      // Fetch items
      const { data: iData } = await supabase.from('quotation_items').select('*').eq('quotation_id', id).order('sort_order');
      if (iData) {
        // Group by room
        const grouped = iData.reduce((acc: any, item: any) => {
          if (!acc[item.room]) acc[item.room] = [];
          acc[item.room].push(item);
          return acc;
        }, {});
        
        const roomArray = Object.keys(grouped).map(roomName => ({
          name: roomName,
          items: grouped[roomName]
        }));
        setRooms(roomArray.length ? roomArray : [{ name: 'Hall', items: [] }]);
      }
    }
    setLoading(false);
  };

  const handleCustomerChange = async (e: any) => {
    const cid = e.target.value;
    setQuote({ ...quote, customer_id: cid, site_id: '' });
    const { data } = await supabase.from('sites').select('*').eq('customer_id', cid);
    setSites(data || []);
  };

  // Measurement helper
  const calculateArea = (length: number, width: number) => {
    return length * width;
  };

  // Add Item to a specific room
  const addItem = (roomIndex: number, templateId?: string) => {
    let newItem = { description: '', unit: 'sq ft', quantity: 0, rate: 0, discount: 0, note: '' };
    if (templateId) {
      const tmpl = templates.find(t => t.id === templateId);
      if (tmpl) {
        newItem = { ...newItem, description: tmpl.name, unit: tmpl.unit, rate: tmpl.default_rate, quantity: 1 };
      }
    }
    const newRooms = [...rooms];
    newRooms[roomIndex].items.push(newItem);
    setRooms(newRooms);
  };

  const updateItem = (roomIndex: number, itemIndex: number, field: string, value: any) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].items[itemIndex][field] = value;
    setRooms(newRooms);
  };

  const removeItem = (roomIndex: number, itemIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].items.splice(itemIndex, 1);
    setRooms(newRooms);
  };

  const addRoom = () => {
    const name = prompt('Room name (e.g. Master Bedroom):');
    if (name) {
      setRooms([...rooms, { name, items: [] }]);
    }
  };

  // Calculations
  const subtotal = useMemo(() => {
    return rooms.reduce((acc, room) => {
      const roomTotal = room.items.reduce((rAcc, item) => {
        return rAcc + ((item.quantity * item.rate) - (item.discount || 0));
      }, 0);
      return acc + roomTotal;
    }, 0);
  }, [rooms]);

  const taxAmount = (subtotal - quote.discount) * (quote.tax_rate / 100);
  const grandTotal = subtotal - quote.discount + taxAmount;

  const saveQuote = async () => {
    if (!quote.customer_id) {
      toast.error("Please select a customer.");
      return;
    }

    setSaving(true);
    let qId = id;

    try {
      if (isNew) {
        // Generate number
        const fy = '2026-27'; // Hardcoded for this mockup
        const { data: numData, error: rpcErr } = await supabase.rpc('get_next_doc_number', { doc_kind: 'QUOTATION', fy: fy });
        if (rpcErr) throw rpcErr;
        const formattedNum = `GSFC/QT/${fy}/${numData.toString().padStart(3, '0')}`;
        
        // Insert quote
        const { data: newQ, error: insErr } = await supabase.from('quotations').insert([{
          ...quote,
          number: formattedNum,
        }]).select().single();
        
        if (insErr) throw insErr;
        qId = newQ.id;
      } else {
        await supabase.from('quotations').update({
          customer_id: quote.customer_id,
          site_id: quote.site_id,
          date: quote.date,
          valid_until: quote.valid_until,
          status: quote.status,
          discount: quote.discount,
          tax_rate: quote.tax_rate,
          tax_type: quote.tax_type,
          notes: quote.notes
        }).eq('id', id);
      }

      // Delete existing items
      if (!isNew) {
        await supabase.from('quotation_items').delete().eq('quotation_id', qId);
      }

      // Insert new items
      let sortOrder = 0;
      const itemsToInsert = [];
      for (const room of rooms) {
        for (const item of room.items) {
          itemsToInsert.push({
            quotation_id: qId,
            room: room.name,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
            note: item.note,
            sort_order: sortOrder++
          });
        }
      }
      
      if (itemsToInsert.length > 0) {
        await supabase.from('quotation_items').insert(itemsToInsert);
      }

      toast.success("Quotation saved successfully!");
      if (isNew) navigate(`/invoice/quotes/${qId}`, { replace: true });

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 pb-6">
      
      {/* LEFT: Editor Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="glass rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-4 mb-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/invoice/quotes')} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold font-heading text-xl text-primary">
              {isNew ? 'New Quotation' : quote.number}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1 text-xs font-bold uppercase tracking-wider border border-white/50 rounded-full bg-white shadow-sm text-primary`}>
              {quote.status}
            </span>
            <button onClick={saveQuote} disabled={saving} className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pb-20 pr-2">
          
          {/* Customer Card */}
          <div className="glass p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium mb-1">Customer</label>
              <select value={quote.customer_id} onChange={handleCustomerChange} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Date</label>
              <input type="date" value={quote.date} onChange={(e) => setQuote({...quote, date: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Valid Until</label>
              <input type="date" value={quote.valid_until || ''} onChange={(e) => setQuote({...quote, valid_until: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            {isNew || (
              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select value={quote.status} onChange={(e) => setQuote({...quote, status: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
            </div>
          </div>

          {/* Rooms and Items Card */}
          <div className="glass p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Room-wise Breakdown</h3>
              <button onClick={addRoom} className="text-accent text-sm font-bold hover:text-primary transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">
                <Plus className="w-4 h-4" /> Add Room
              </button>
            </div>

            {rooms.map((room, rIndex) => (
              <div key={rIndex} className="bg-white/50 p-4 rounded-xl border border-white mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-primary text-lg">{room.name}</h4>
                  <div className="flex gap-2">
                    <select onChange={(e) => addItem(rIndex, e.target.value)} value="" className="text-xs font-bold text-slate-600 border border-slate-200 rounded-lg px-2 py-1.5 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent">
                      <option value="" disabled>+ from Template</option>
                      {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <button onClick={() => addItem(rIndex)} className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm flex items-center gap-1 transition-colors">
                      <Plus className="w-3 h-3" /> Custom Row
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {room.items.map((item, iIndex) => (
                    <div key={iIndex} className="bg-white p-3 rounded-md border border-[var(--line)] flex flex-wrap gap-3 items-end relative">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[10px] uppercase font-bold text-[var(--slate)] mb-1">Description</label>
                        <input type="text" value={item.description} onChange={(e) => updateItem(rIndex, iIndex, 'description', e.target.value)} className="w-full text-sm border-b px-1 py-1 focus:outline-none focus:border-[var(--blue)]" />
                      </div>
                      <div className="w-20">
                        <label className="block text-[10px] uppercase font-bold text-[var(--slate)] mb-1">Qty</label>
                        <div className="relative">
                          <input type="number" value={item.quantity} onChange={(e) => updateItem(rIndex, iIndex, 'quantity', parseFloat(e.target.value) || 0)} className="w-full text-sm border-b px-1 py-1 focus:outline-none focus:border-[var(--blue)] pr-6" />
                          <button 
                            className="absolute right-0 bottom-1 text-gray-400 hover:text-[var(--blue)]"
                            title="Calculator (L x W)"
                            onClick={() => {
                              const l = prompt("Length (ft):");
                              const w = prompt("Width (ft):");
                              if(l && w) updateItem(rIndex, iIndex, 'quantity', calculateArea(parseFloat(l), parseFloat(w)));
                            }}
                          >
                            <Calculator className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="w-16">
                        <label className="block text-[10px] uppercase font-bold text-[var(--slate)] mb-1">Unit</label>
                        <input type="text" value={item.unit} onChange={(e) => updateItem(rIndex, iIndex, 'unit', e.target.value)} className="w-full text-sm border-b px-1 py-1 focus:outline-none focus:border-[var(--blue)]" />
                      </div>
                      <div className="w-24">
                        <label className="block text-[10px] uppercase font-bold text-[var(--slate)] mb-1">Rate (₹)</label>
                        <input type="number" value={item.rate} onChange={(e) => updateItem(rIndex, iIndex, 'rate', parseFloat(e.target.value) || 0)} className="w-full text-sm border-b px-1 py-1 focus:outline-none focus:border-[var(--blue)] tabular-nums" />
                      </div>
                      <div className="w-28 text-right bg-[var(--plaster)] p-2 rounded-sm border border-[var(--line)]">
                        <label className="block text-[10px] uppercase font-bold text-[var(--slate)] mb-0">Amount</label>
                        <span className="font-bold tabular-nums text-sm">₹ {((item.quantity * item.rate) - (item.discount || 0)).toFixed(2)}</span>
                      </div>
                      <button onClick={() => removeItem(rIndex, iIndex)} className="text-red-400 hover:text-red-600 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="w-full pt-2 flex gap-4">
                        <input type="text" placeholder="Note (e.g. brand name)..." value={item.note || ''} onChange={(e) => updateItem(rIndex, iIndex, 'note', e.target.value)} className="flex-1 text-xs text-[var(--slate)] bg-transparent border-b border-dashed focus:outline-none focus:border-solid focus:border-[var(--blue)]" />
                        <div className="flex items-center gap-1 text-xs">
                           <span className="text-[var(--slate)]">Discount ₹:</span>
                           <input type="number" value={item.discount || ''} onChange={(e) => updateItem(rIndex, iIndex, 'discount', parseFloat(e.target.value) || 0)} className="w-16 border-b text-right tabular-nums focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {room.items.length === 0 && <p className="text-xs text-center text-[var(--slate)] italic py-2">No items in this room.</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Totals Card */}
          <div className="glass p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Terms / Notes</label>
                <textarea value={quote.notes || ''} onChange={(e) => setQuote({...quote, notes: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-white" rows={4} />
              </div>
            </div>
            
            <div className="bg-white/80 p-5 rounded-xl border border-white shadow-sm space-y-3 text-sm font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Subtotal</span>
                <span className="tabular-nums font-bold text-base">₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--slate)]">Discount Overall (₹)</span>
                <input type="number" value={quote.discount || 0} onChange={(e) => setQuote({...quote, discount: parseFloat(e.target.value) || 0})} className="w-24 text-right border rounded-sm px-2 py-1 tabular-nums" />
              </div>
              <div className="flex justify-between items-center">
                <select value={quote.tax_type} onChange={(e) => setQuote({...quote, tax_type: e.target.value})} className="bg-transparent text-[var(--slate)] focus:outline-none">
                  <option value="IGST">IGST (%)</option>
                  <option value="CGST_SGST">CGST/SGST (%)</option>
                </select>
                <input type="number" value={quote.tax_rate || 0} onChange={(e) => setQuote({...quote, tax_rate: parseFloat(e.target.value) || 0})} className="w-24 text-right border rounded-sm px-2 py-1 tabular-nums" />
              </div>
              {quote.tax_rate > 0 && (
                <div className="flex justify-between text-xs text-[var(--slate)]">
                  <span>Tax Amount</span>
                  <span className="tabular-nums">+ ₹ {taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[var(--line)] my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total</span>
                <span className="tabular-nums">₹ {grandTotal.toFixed(2)}</span>
              </div>
              <div className="text-right text-xs italic text-[var(--slate)] mt-1 capitalize">
                {numberToWordsIndian(Math.round(grandTotal))}
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* RIGHT: Live Preview (Simplified HTML mockup of what the PDF will look like) */}
      <div className="hidden md:flex flex-col w-[400px] lg:w-[500px] bg-white border border-[var(--line)] shadow-sm rounded-2xl overflow-hidden shrink-0">
        <div className="bg-[var(--ink)] text-[var(--paper)] py-3 px-5 flex justify-between items-center text-sm">
          <span className="font-medium">Live Preview</span>
          <button className="flex items-center gap-1 hover:text-[var(--blue)] transition-colors">
             <Download className="w-4 h-4" /> PDF
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-[11px] font-body bg-white text-black" style={{ zoom: 0.8 }}>
           {/* Mock PDF Document */}
           <div className="text-center border-b pb-4 mb-4">
             <h1 className="text-xl font-bold uppercase tracking-widest mb-1">Quotation</h1>
             <p className="font-bold text-base">GS False Ceiling Works</p>
           </div>
           
           <div className="flex justify-between mb-6">
             <div>
               <p className="text-gray-500 uppercase text-[9px] font-bold">To</p>
               <p className="font-bold">{customers.find(c => c.id === quote.customer_id)?.name || 'Customer Name'}</p>
               <p>{sites.find(s => s.id === quote.site_id)?.project_name || 'Project Site'}</p>
             </div>
             <div className="text-right">
               <p><span className="text-gray-500">Quote No:</span> <span className="font-bold">{isNew ? 'DRAFT' : quote.number}</span></p>
               <p><span className="text-gray-500">Date:</span> {quote.date}</p>
             </div>
           </div>

           {rooms.map((room, rIndex) => (
             <div key={rIndex} className="mb-4">
               {room.items.length > 0 && <h3 className="font-bold bg-gray-100 p-1 mb-1">{room.name}</h3>}
               <table className="w-full text-left border-collapse">
                 <tbody>
                   {room.items.map((item, iIndex) => (
                     <tr key={iIndex} className="border-b border-gray-100 last:border-0">
                       <td className="py-1 w-1/2">{item.description} {item.note && <span className="text-gray-400 italic">({item.note})</span>}</td>
                       <td className="py-1 w-[15%]">{item.quantity} {item.unit}</td>
                       <td className="py-1 w-[15%]">₹{item.rate}</td>
                       <td className="py-1 w-[20%] text-right font-medium">₹{((item.quantity * item.rate) - (item.discount || 0)).toFixed(2)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ))}

           <div className="border-t-2 border-black pt-2 mt-4 ml-auto w-64 space-y-1 text-[12px]">
             <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span> <span>₹ {subtotal.toFixed(2)}</span></div>
             {quote.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount:</span> <span>- ₹ {quote.discount}</span></div>}
             {quote.tax_rate > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax ({quote.tax_rate}%):</span> <span>+ ₹ {taxAmount.toFixed(2)}</span></div>}
             <div className="flex justify-between font-bold text-sm border-t pt-1 mt-1"><span>Total:</span> <span>₹ {grandTotal.toFixed(2)}</span></div>
           </div>

        </div>
      </div>
    </div>
  );
}
