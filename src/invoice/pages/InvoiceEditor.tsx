import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, Download, ArrowLeft, Calculator, CreditCard } from 'lucide-react';
import { toWords } from 'number-to-words';

// Simple Indian number to words
function numberToWordsIndian(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  return 'Rupees ' + toWords(num).replace(/,/g, '') + ' Only';
}

export default function InvoiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  
  // Invoice State
  const [invoice, setInvoice] = useState<any>({
    number: 'Draft',
    customer_id: '',
    site_id: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '',
    discount: 0,
    tax_rate: 0,
    tax_type: 'IGST',
    notes: ''
  });

  // Room items State
  const [rooms, setRooms] = useState<{name: string, items: any[]}[]>([
    { name: 'Hall', items: [] }
  ]);

  // Payments State
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialData();
    if (!isNew) {
      fetchInvoiceData();
    }
  }, [id]);

  const fetchInitialData = async () => {
    const { data: cData } = await supabase.from('customers').select('*');
    if (cData) setCustomers(cData);

    const { data: tData } = await supabase.from('item_templates').select('*');
    if (tData) setTemplates(tData);

    const { data: pData } = await supabase.from('business_profile').select('default_tax_rate, terms').single();
    if (pData && isNew) {
      setInvoice((i: any) => ({ ...i, tax_rate: pData.default_tax_rate, notes: pData.terms }));
    }
  };

  const fetchInvoiceData = async () => {
    setLoading(true);
    // Fetch invoice
    const { data: invData } = await supabase.from('invoices').select('*').eq('id', id).single();
    if (invData) {
      setInvoice(invData);
      // Fetch sites for this customer
      const { data: sData } = await supabase.from('sites').select('*').eq('customer_id', invData.customer_id);
      if (sData) setSites(sData);
      
      // Fetch items
      const { data: iData } = await supabase.from('invoice_items').select('*').eq('invoice_id', id).order('sort_order');
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

      // Fetch payments
      const { data: pData } = await supabase.from('payments').select('*').eq('invoice_id', id);
      if (pData) setPayments(pData);
    }
    setLoading(false);
  };

  const handleCustomerChange = async (e: any) => {
    const cid = e.target.value;
    setInvoice({ ...invoice, customer_id: cid, site_id: '' });
    const { data } = await supabase.from('sites').select('*').eq('customer_id', cid);
    setSites(data || []);
  };

  // Measurement helper
  const calculateArea = (length: number, width: number) => length * width;

  // Add Item
  const addItem = (roomIndex: number, templateId?: string) => {
    let newItem = { description: '', unit: 'sq ft', quantity: 0, rate: 0, discount: 0, note: '' };
    if (templateId) {
      const tmpl = templates.find(t => t.id === templateId);
      if (tmpl) {
        newItem = { ...newItem, description: tmpl.name, unit: tmpl.unit, rate: tmpl.default_rate };
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
    if (name) setRooms([...rooms, { name, items: [] }]);
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

  const taxAmount = (subtotal - invoice.discount) * (invoice.tax_rate / 100);
  const grandTotal = subtotal - invoice.discount + taxAmount;

  const totalPaid = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
  const balanceDue = grandTotal - totalPaid;

  const saveInvoice = async () => {
    if (!invoice.customer_id) {
      alert("Please select a customer.");
      return;
    }

    setSaving(true);
    let invId = id;

    try {
      if (isNew) {
        const fy = '2026-27';
        const { data: numData, error: rpcErr } = await supabase.rpc('get_next_doc_number', { doc_kind: 'INVOICE', fy: fy });
        if (rpcErr) throw rpcErr;
        const formattedNum = `GSFC/INV/${fy}/${numData.toString().padStart(3, '0')}`;
        
        const { data: newInv, error: insErr } = await supabase.from('invoices').insert([{
          ...invoice,
          number: formattedNum,
        }]).select().single();
        
        if (insErr) throw insErr;
        invId = newInv.id;
      } else {
        await supabase.from('invoices').update({
          customer_id: invoice.customer_id,
          site_id: invoice.site_id,
          date: invoice.date,
          due_date: invoice.due_date,
          discount: invoice.discount,
          tax_rate: invoice.tax_rate,
          tax_type: invoice.tax_type,
          notes: invoice.notes
        }).eq('id', id);
      }

      // Sync items
      if (!isNew) {
        await supabase.from('invoice_items').delete().eq('invoice_id', invId);
      }

      let sortOrder = 0;
      const itemsToInsert = [];
      for (const room of rooms) {
        for (const item of room.items) {
          itemsToInsert.push({
            invoice_id: invId,
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
        await supabase.from('invoice_items').insert(itemsToInsert);
      }

      alert("Invoice saved successfully!");
      if (isNew) navigate(`/invoice/invoices/${invId}`, { replace: true });

    } catch (err: any) {
      console.error(err);
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const addPayment = async () => {
    const amountStr = prompt(`Payment Amount (₹). Max: ${balanceDue.toFixed(2)}:`, balanceDue.toFixed(2));
    const mode = prompt("Mode (UPI, Cash, Bank, Cheque):", "UPI");
    if (amountStr && mode) {
      const amount = parseFloat(amountStr);
      if (amount > 0) {
        const { data } = await supabase.from('payments').insert([{
          invoice_id: id,
          amount,
          mode,
          date: new Date().toISOString().split('T')[0]
        }]).select().single();
        if (data) setPayments([...payments, data]);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 pb-6">
      
      {/* LEFT: Editor Form */}
      <div className="flex-1 bg-[var(--paper)] rounded-md border border-[var(--line)] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[var(--line)] bg-[var(--plaster)] flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/invoice/invoices')} className="p-1 hover:bg-gray-200 rounded-md">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold font-heading text-lg">
              {isNew ? 'New Invoice' : invoice.number}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={saveInvoice} disabled={saving} className="bg-[var(--blue)] text-[var(--paper)] px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Header Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Customer</label>
              <select value={invoice.customer_id} onChange={handleCustomerChange} className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Site</label>
              <select value={invoice.site_id} onChange={(e) => setInvoice({...invoice, site_id: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-white" disabled={!invoice.customer_id}>
                <option value="">Select Site</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.project_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Date</label>
              <input type="date" value={invoice.date} onChange={(e) => setInvoice({...invoice, date: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Due Date</label>
              <input type="date" value={invoice.due_date || ''} onChange={(e) => setInvoice({...invoice, due_date: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>

          {/* Rooms and Items */}
          <div className="space-y-6 border-t border-[var(--line)] pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Room-wise Breakdown</h3>
              <button onClick={addRoom} className="text-[var(--blue)] text-sm font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Room
              </button>
            </div>

            {rooms.map((room, rIndex) => (
              <div key={rIndex} className="bg-[var(--plaster)] p-4 rounded-md border border-[var(--line)]">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-[var(--ink)]">{room.name}</h4>
                  <div className="flex gap-2">
                    <select onChange={(e) => addItem(rIndex, e.target.value)} value="" className="text-xs border rounded-md px-2 py-1 bg-white">
                      <option value="" disabled>+ from Template</option>
                      {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <button onClick={() => addItem(rIndex)} className="text-xs bg-white border border-[var(--line)] px-2 py-1 rounded-md hover:bg-gray-50 flex items-center gap-1">
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

          {/* Footer Totals */}
          <div className="border-t border-[var(--line)] pt-6 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Terms / Notes</label>
                <textarea value={invoice.notes || ''} onChange={(e) => setInvoice({...invoice, notes: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm bg-white" rows={4} />
              </div>
            </div>
            
            <div className="bg-[var(--plaster)] p-4 rounded-md border border-[var(--line)] space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--slate)]">Subtotal</span>
                <span className="tabular-nums">₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--slate)]">Discount Overall (₹)</span>
                <input type="number" value={invoice.discount || 0} onChange={(e) => setInvoice({...invoice, discount: parseFloat(e.target.value) || 0})} className="w-24 text-right border rounded-sm px-2 py-1 tabular-nums" />
              </div>
              <div className="flex justify-between items-center">
                <select value={invoice.tax_type} onChange={(e) => setInvoice({...invoice, tax_type: e.target.value})} className="bg-transparent text-[var(--slate)] focus:outline-none">
                  <option value="IGST">IGST (%)</option>
                  <option value="CGST_SGST">CGST/SGST (%)</option>
                </select>
                <input type="number" value={invoice.tax_rate || 0} onChange={(e) => setInvoice({...invoice, tax_rate: parseFloat(e.target.value) || 0})} className="w-24 text-right border rounded-sm px-2 py-1 tabular-nums" />
              </div>
              {invoice.tax_rate > 0 && (
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
          
          {/* Payments Tracker */}
          {!isNew && (
            <div className="mt-8 border-t border-[var(--line)] pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Payments Received
                </h3>
                {balanceDue > 0 ? (
                   <button onClick={addPayment} className="text-[var(--blue)] text-sm font-medium hover:underline flex items-center gap-1">
                     <Plus className="w-4 h-4" /> Record Payment
                   </button>
                ) : (
                   <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">PAID IN FULL</span>
                )}
              </div>

              <div className="space-y-3">
                {payments.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-[var(--plaster)] p-3 rounded-md border border-[var(--line)]">
                    <div>
                      <div className="font-medium">₹ {parseFloat(p.amount).toFixed(2)}</div>
                      <div className="text-xs text-[var(--slate)]">{p.date} &bull; {p.mode}</div>
                    </div>
                  </div>
                ))}
                {payments.length === 0 && <p className="text-sm text-[var(--slate)] italic">No payments recorded yet.</p>}
                
                {payments.length > 0 && (
                  <div className="pt-2 flex justify-between font-bold text-sm">
                    <span>Balance Due:</span>
                    <span className={balanceDue > 0 ? 'text-red-500' : 'text-green-600'}>₹ {balanceDue.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="hidden md:flex flex-col w-[400px] lg:w-[500px] bg-white border border-[var(--line)] shadow-sm rounded-md overflow-hidden">
        <div className="bg-[var(--ink)] text-[var(--paper)] py-2 px-4 flex justify-between items-center text-sm">
          <span className="font-medium">Live Preview</span>
          <button className="flex items-center gap-1 hover:text-[var(--blue)] transition-colors">
             <Download className="w-4 h-4" /> PDF
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-[11px] font-body bg-white text-black" style={{ zoom: 0.8 }}>
           {/* Mock PDF Document */}
           <div className="text-center border-b pb-4 mb-4">
             <h1 className="text-xl font-bold uppercase tracking-widest mb-1">Tax Invoice</h1>
             <p className="font-bold text-base">GS False Ceiling Works</p>
           </div>
           
           <div className="flex justify-between mb-6">
             <div>
               <p className="text-gray-500 uppercase text-[9px] font-bold">Bill To</p>
               <p className="font-bold">{customers.find(c => c.id === invoice.customer_id)?.name || 'Customer Name'}</p>
               <p>{sites.find(s => s.id === invoice.site_id)?.project_name || 'Project Site'}</p>
             </div>
             <div className="text-right">
               <p><span className="text-gray-500">Invoice No:</span> <span className="font-bold">{isNew ? 'DRAFT' : invoice.number}</span></p>
               <p><span className="text-gray-500">Date:</span> {invoice.date}</p>
               {invoice.due_date && <p><span className="text-gray-500">Due Date:</span> {invoice.due_date}</p>}
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
             {invoice.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount:</span> <span>- ₹ {invoice.discount}</span></div>}
             {invoice.tax_rate > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax ({invoice.tax_rate}%):</span> <span>+ ₹ {taxAmount.toFixed(2)}</span></div>}
             <div className="flex justify-between font-bold text-sm border-t pt-1 mt-1"><span>Total:</span> <span>₹ {grandTotal.toFixed(2)}</span></div>
           </div>

           {payments.length > 0 && (
             <div className="mt-8 pt-4 border-t">
                <h4 className="font-bold text-[10px] text-gray-500 uppercase mb-2">Payment History</h4>
                {payments.map(p => (
                  <div key={p.id} className="flex justify-between text-[10px]">
                     <span>{p.date} ({p.mode})</span>
                     <span className="font-bold">₹ {parseFloat(p.amount).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Balance Due:</span>
                  <span>₹ {balanceDue.toFixed(2)}</span>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
