import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save, Download, ArrowLeft, Calculator, CreditCard, Search, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { toWords } from 'number-to-words';

function numberToWordsIndian(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  return 'Rupees ' + toWords(Math.round(num)).replace(/,/g, '') + ' Only';
}

// Number input that avoids the leading-zero (01) bug
function NumInput({ value, onChange, className = '', placeholder = '0' }: {
  value: number; onChange: (v: number) => void; className?: string; placeholder?: string;
}) {
  const [raw, setRaw] = useState(value === 0 ? '' : String(value));
  useEffect(() => { setRaw(value === 0 ? '' : String(value)); }, [value]);
  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={raw}
      onFocus={e => e.target.select()}
      onChange={e => {
        const v = e.target.value;
        if (/^(\d*\.?\d*)$/.test(v)) { setRaw(v); onChange(parseFloat(v) || 0); }
      }}
      onBlur={() => setRaw(value === 0 ? '' : String(value))}
      className={className}
    />
  );
}

// Searchable template picker combobox
function TemplateSearch({ templates, onSelect, onAddCustom }: {
  templates: any[];
  onSelect: (t: any) => void;
  onAddCustom: (name: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number; width: number }>({ top: 0, left: 0, width: 320 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const filtered = query
    ? templates.filter(t => t.name.toLowerCase().includes(query.toLowerCase()))
    : templates;

  const openDropdown = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const showAbove = spaceBelow < 300;
      setPos({
        top: showAbove ? undefined : r.bottom + 6,
        bottom: showAbove ? window.innerHeight - r.top + 6 : undefined,
        left: r.left,
        width: Math.max(320, r.width)
      });
    }
    setOpen(true);
  };

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        className="flex items-center gap-1.5 border border-[var(--blue)]/30 bg-blue-50 rounded-lg px-2.5 py-1.5 hover:bg-blue-100 transition-colors cursor-text"
      >
        <Search className="w-3 h-3 text-[var(--blue)] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); if (!open) openDropdown(); }}
          onFocus={openDropdown}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          placeholder="Search or add item..."
          className="text-xs font-bold text-[var(--blue)] bg-transparent focus:outline-none w-36 placeholder:text-[var(--blue)]/60"
        />
      </div>

      {open && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-white border border-[var(--line)] rounded-xl shadow-2xl max-h-72 overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <button
              type="button"
              onMouseDown={() => { if (query.trim()) { onAddCustom(query.trim()); setQuery(''); setOpen(false); } }}
              className="w-full text-left px-3 py-3 text-xs hover:bg-blue-50 flex items-center gap-2 text-[var(--blue)] font-semibold"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              Add &ldquo;{query.trim()}&rdquo; as custom item
            </button>
          ) : (
            <>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[var(--line)] bg-slate-50 sticky top-0">
                {query ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"` : `All Products (${templates.length})`}
              </div>
              {filtered.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onMouseDown={() => { onSelect(t); setQuery(''); setOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 flex justify-between items-center gap-2 border-b border-[var(--line)] last:border-0"
                >
                  <span className="font-semibold text-[var(--ink)] truncate">{t.name}</span>
                  <span className="text-slate-400 shrink-0 tabular-nums">{t.unit} &middot; &#8377;{t.default_rate}</span>
                </button>
              ))}
              {query.trim() && (
                <button
                  type="button"
                  onMouseDown={() => { onAddCustom(query.trim()); setQuery(''); setOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-xs hover:bg-blue-50 flex items-center gap-2 text-[var(--blue)] font-semibold border-t border-[var(--line)] bg-blue-50/50 sticky bottom-0"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  Add &ldquo;{query.trim()}&rdquo; as new custom item
                </button>
              )}
            </>
          )}
        </div>
      , document.body)}
    </div>
  );
}

function CustomerSelector({
  customers,
  value,
  onChange,
  onCustomerAdded
}: {
  customers: any[],
  value: string,
  onChange: (id: string) => void,
  onCustomerAdded: (c: any) => void
}) {
  const [phoneSearch, setPhoneSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlace, setNewPlace] = useState('');
  const [loading, setLoading] = useState(false);

  // When value changes from outside (initial load)
  useEffect(() => {
    const c = customers.find(x => x.id === value);
    if (c && c.phone) {
      setPhoneSearch(c.phone);
      setShowNew(false);
    } else if (c && !c.phone) {
      setPhoneSearch(c.name); // fallback if they didn't have phone
    }
  }, [value, customers]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneSearch(val);
    
    // Check if exists
    const existing = customers.find(c => c.phone === val);
    if (existing) {
      onChange(existing.id);
      setShowNew(false);
    } else {
      onChange(''); // clear selection
      if (val.length >= 10) {
        setShowNew(true);
      } else {
        setShowNew(false);
      }
    }
  };

  const handleAddNew = async () => {
    if (!newName.trim() || !phoneSearch.trim()) return;
    setLoading(true);
    
    if (value) {
      // UPDATE existing customer
      const { data: custData } = await supabase.from('customers').update({
        name: newName,
        address: newPlace
      }).eq('id', value).select().single();
      
      if (custData) {
        let finalData = { ...custData, sites: customers.find(c => c.id === value)?.sites || [] };
        if (newPlace.trim() && !finalData.sites.find((s: any) => s.site_address === newPlace.trim())) {
          const { data: siteData } = await supabase.from('sites').insert([{
            customer_id: custData.id,
            project_name: newPlace.trim(),
            site_address: newPlace.trim()
          }]).select().single();
          if (siteData) finalData.sites = [...finalData.sites, siteData];
        }
        onCustomerAdded(finalData);
        setShowNew(false);
      }
    } else {
      // INSERT new customer
      const { data: custData } = await supabase.from('customers').insert([{
        phone: phoneSearch,
        name: newName,
        address: newPlace
      }]).select().single();
      
      if (custData) {
        let finalData = { ...custData, sites: [] };
        if (newPlace.trim()) {
          const { data: siteData } = await supabase.from('sites').insert([{
            customer_id: custData.id,
            project_name: newPlace.trim(),
            site_address: newPlace.trim()
          }]).select().single();
          if (siteData) finalData.sites = [siteData];
        }
        onCustomerAdded(finalData);
        setShowNew(false);
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={phoneSearch}
        onChange={handlePhoneChange}
        className="w-full border border-[var(--line)] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20"
      />
      {value && !showNew && (
        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {customers.find(c => c.id === value)?.name}
          </div>
          <button onClick={() => {
            const c = customers.find(x => x.id === value);
            if (c) {
              setNewName(c.name || '');
              setNewPlace(c.address || '');
              setShowNew(true);
            }
          }} className="text-emerald-700 underline hover:text-emerald-800 px-2 py-1 rounded-md hover:bg-emerald-100">Edit</button>
        </div>
      )}
      {showNew && (
        <div className="bg-blue-50/50 p-3 rounded-lg border border-[var(--blue)]/20 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-wider">{value ? 'Edit Customer Details' : 'New Customer Details'}</p>
            {value && <button onClick={() => setShowNew(false)} className="text-[10px] text-slate-500 underline hover:text-slate-700">Cancel</button>}
          </div>
          <input
            type="text" placeholder="Customer Name *" value={newName} onChange={e => setNewName(e.target.value)}
            className="w-full border border-blue-100 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[var(--blue)]"
          />
          <input
            type="text" placeholder="Site Location" value={newPlace} onChange={e => setNewPlace(e.target.value)}
            className="w-full border border-blue-100 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[var(--blue)]"
          />
          <button
            onClick={handleAddNew}
            disabled={loading || !newName.trim()}
            className="bg-[var(--blue)] text-white text-xs font-bold px-3 py-1.5 rounded-lg w-full hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (value ? 'Update Customer' : 'Add & Select Customer')}
          </button>
        </div>
      )}
    </div>
  );
}

const PREDEFINED_ROOMS = ['Hall', 'Kitchen', 'Room 1', 'Room 2', 'Room 3', 'Corridor', 'Master Bedroom'];

function AddRoomMenu({ onAdd }: { onAdd: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number }>({ top: 0, left: 0 });

  const toggleOpen = () => {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const showAbove = spaceBelow < 250;
      setPos({
        top: showAbove ? undefined : r.bottom + 8,
        bottom: showAbove ? window.innerHeight - r.top + 8 : undefined,
        left: r.left + r.width / 2
      });
    }
    setOpen(!open);
  };

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={toggleOpen}
        className="text-[var(--blue)] text-sm font-bold hover:text-blue-700 flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl shadow-sm border border-[var(--line)] hover:border-blue-200 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Room
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            style={{ position: 'fixed', top: pos.top, bottom: pos.bottom, left: pos.left, transform: 'translateX(-50%)', zIndex: 9999 }}
            className="bg-white border border-[var(--line)] rounded-xl shadow-2xl w-64 p-2 flex flex-col gap-1"
          >
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Room
            </div>
            <div className="grid grid-cols-2 gap-1 mb-2">
              {PREDEFINED_ROOMS.map(r => (
                <button
                  key={r}
                  onClick={() => { onAdd(r); setOpen(false); }}
                  className="text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[var(--blue)] rounded-lg transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-[var(--line)] pt-2">
              Or Custom Name
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Balcony"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customName.trim()) {
                    onAdd(customName);
                    setCustomName('');
                    setOpen(false);
                  }
                }}
                className="flex-1 text-xs border border-[var(--line)] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--blue)]"
              />
              <button
                onClick={() => {
                  if (customName.trim()) {
                    onAdd(customName);
                    setCustomName('');
                    setOpen(false);
                  }
                }}
                className="bg-[var(--blue)] text-white p-1.5 rounded-lg hover:bg-blue-600 transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

export default function InvoiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [calcModal, setCalcModal] = useState<{rIndex: number, iIndex: number, l: string, w: string} | null>(null);
  const [paymentModal, setPaymentModal] = useState<{amount: string, mode: string} | null>(null);
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  const [invoice, setInvoice] = useState<any>({
    number: 'Draft', customer_id: '', site_id: '',
    date: new Date().toISOString().split('T')[0],
    due_date: '', discount: 0, tax_rate: 0, tax_type: 'IGST', notes: ''
  });

  const [rooms, setRooms] = useState<{ name: string; items: any[] }[]>([]);

  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialData();
    if (!isNew) fetchInvoiceData();
  }, [id]);

  const fetchInitialData = async () => {
    const { data: cData } = await supabase.from('customers').select('*').order('name');
    if (cData) setCustomers(cData);
    const { data: tData } = await supabase.from('item_templates').select('*').order('name');
    if (tData) setTemplates(tData);
    const { data: pData } = await supabase.from('business_profile').select('default_tax_rate, terms').single();
    if (pData && isNew) setInvoice((i: any) => ({ ...i, tax_rate: pData.default_tax_rate, notes: pData.terms }));
  };

  const fetchInvoiceData = async () => {
    setLoading(true);
    const { data: invData } = await supabase.from('invoices').select('*').eq('id', id).single();
    if (invData) {
      setInvoice(invData);
      const { data: sData } = await supabase.from('sites').select('*').eq('customer_id', invData.customer_id);
      if (sData) setSites(sData);
      const { data: iData } = await supabase.from('invoice_items').select('*').eq('invoice_id', id).order('sort_order');
      if (iData) {
        const grouped = iData.reduce((acc: any, item: any) => {
          if (!acc[item.room]) acc[item.room] = [];
          acc[item.room].push(item);
          return acc;
        }, {});
        const roomArray = Object.keys(grouped).map(n => ({ name: n, items: grouped[n] }));
        setRooms(roomArray.length ? roomArray : [{ name: 'Hall', items: [] }]);
      }
      const { data: paymentsData } = await supabase.from('payments').select('*').eq('invoice_id', id).order('date');
      if (paymentsData) setPayments(paymentsData);
    }
    setLoading(false);
  };

  const handleCustomerChange = async (e: any) => {
    const cid = e.target.value;
    setInvoice({ ...invoice, customer_id: cid, site_id: '' });
    const { data } = await supabase.from('sites').select('*').eq('customer_id', cid);
    setSites(data || []);
  };

  const addItem = (roomIndex: number, templateId?: string) => {
    let newItem = { description: '', unit: 'sq ft', quantity: 0, rate: 0, note: '' };
    if (templateId) {
      const tmpl = templates.find(t => String(t.id) === String(templateId));
      if (tmpl) newItem = { ...newItem, description: tmpl.name, unit: tmpl.unit, rate: tmpl.default_rate, quantity: 1 };
    }
    setRooms(rooms.map((r, ri) => ri === roomIndex ? { ...r, items: [...r.items, newItem] } : r));
  };

  const updateItem = (roomIndex: number, itemIndex: number, field: string, value: any) => {
    setRooms(rooms.map((r, ri) =>
      ri === roomIndex
        ? { ...r, items: r.items.map((it, ii) => ii === itemIndex ? { ...it, [field]: value } : it) }
        : r
    ));
  };

  const removeItem = (roomIndex: number, itemIndex: number) => {
    setRooms(rooms.map((r, ri) =>
      ri === roomIndex ? { ...r, items: r.items.filter((_, ii) => ii !== itemIndex) } : r
    ));
  };

  const addRoom = (name: string) => {
    if (name.trim()) {
      setRooms([...rooms, { name: name.trim(), items: [] }]);
    }
  };

  // Calculation: item amount = qty * rate only (no per-item discount)
  const subtotal = useMemo(() =>
    rooms.reduce((acc, room) =>
      acc + room.items.reduce((s, item) => s + (item.quantity * item.rate), 0), 0)
  , [rooms]);

  const discountAmt = invoice.discount || 0;
  const taxableAmount = subtotal - discountAmt;
  const taxAmount = taxableAmount * ((invoice.tax_rate || 0) / 100);
  const grandTotal = taxableAmount + taxAmount;
  const totalPaid = payments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
  const balanceDue = grandTotal - totalPaid;

  const saveInvoice = async () => {
    if (!invoice.customer_id) { toast.error('Please select a customer.'); return; }
    setSaving(true);
    let invId = id;
    try {
      if (isNew) {
        const fy = '2026-27';
        const { data: numData, error: rpcErr } = await supabase.rpc('get_next_doc_number', { doc_kind: 'INVOICE', fy });
        if (rpcErr) throw rpcErr;
        const formattedNum = `GSFC/INV/${fy}/${numData.toString().padStart(3, '0')}`;
        const { data: newInv, error: insErr } = await supabase.from('invoices').insert([{ ...invoice, number: formattedNum }]).select().single();
        if (insErr) throw insErr;
        invId = newInv.id;
      } else {
        await supabase.from('invoices').update({
          customer_id: invoice.customer_id, site_id: invoice.site_id, date: invoice.date,
          due_date: invoice.due_date, discount: invoice.discount,
          tax_rate: invoice.tax_rate, tax_type: invoice.tax_type, notes: invoice.notes
        }).eq('id', id);
      }
      if (!isNew) await supabase.from('invoice_items').delete().eq('invoice_id', invId);
      let sortOrder = 0;
      const itemsToInsert: any[] = [];
      for (const room of rooms) {
        for (const item of room.items) {
          itemsToInsert.push({
            invoice_id: invId, room: room.name, description: item.description,
            unit: item.unit, quantity: item.quantity, rate: item.rate,
            discount: 0, note: item.note, sort_order: sortOrder++
          });
        }
      }
      if (itemsToInsert.length > 0) await supabase.from('invoice_items').insert(itemsToInsert);
      toast.success('Invoice saved successfully!');
      if (isNew) navigate(`/invoice/invoices/${invId}`, { replace: true });
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const executePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModal) return;
    const amount = parseFloat(paymentModal.amount);
    if (amount > 0) {
      const { data } = await supabase.from('payments').insert([{
        invoice_id: id, amount, mode: paymentModal.mode, date: new Date().toISOString().split('T')[0]
      }]).select().single();
      if (data) setPayments([...payments, data]);
      toast.success('Payment recorded!');
    }
    setPaymentModal(null);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 pb-6">

      {/* LEFT: Editor Form */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="glass rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-4 mb-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/invoice/invoices')} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold font-heading text-xl text-primary">
              {isNew ? 'New Invoice' : invoice.number}
            </h2>
          </div>
          <button onClick={saveInvoice} disabled={saving} className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-20 pr-2">



          {/* Rooms & Items */}
          <div className="glass p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Room-wise Breakdown</h3>
            </div>

            {rooms.map((room, rIndex) => (
              <div key={rIndex} className="bg-white/60 rounded-xl border border-white mb-4 shadow-sm overflow-hidden">
                {/* Room header */}
                <div className="flex justify-between items-center px-4 py-3 bg-white/80 border-b border-[var(--line)]">
                  <h4 className="font-bold text-primary">{room.name}</h4>
                  <span className="text-xs text-[var(--slate)] font-medium">{room.items.length} item{room.items.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Column headers */}
                {room.items.length > 0 && (
                  <div className="px-3 pt-2 grid grid-cols-[1fr_64px_88px_84px_76px_32px] gap-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    <span>Description</span><span>Qty</span><span>Unit</span><span>Rate (&#8377;)</span><span className="text-right">Amount</span><span></span>
                  </div>
                )}

                <div className="p-3 space-y-2">
                  {room.items.map((item, iIndex) => (
                    <div key={iIndex} className="grid grid-cols-[1fr_64px_88px_84px_76px_32px] gap-2 items-center bg-white rounded-lg px-2 py-2 border border-[var(--line)]">
                      <input
                        type="text" value={item.description} placeholder="Description"
                        onChange={e => updateItem(rIndex, iIndex, 'description', e.target.value)}
                        className="text-sm border-b border-transparent hover:border-[var(--line)] focus:border-[var(--blue)] focus:outline-none px-1 py-0.5 w-full"
                      />
                      <div className="relative">
                        <NumInput
                          value={item.quantity}
                          onChange={v => updateItem(rIndex, iIndex, 'quantity', v)}
                          className="w-full text-sm border-b border-transparent hover:border-[var(--line)] focus:border-[var(--blue)] focus:outline-none px-1 py-0.5 pr-5 tabular-nums"
                        />
                        <button
                          title="L x W calculator"
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[var(--blue)] transition-colors"
                          onClick={() => setCalcModal({rIndex, iIndex, l: '', w: ''})}
                        >
                          <Calculator className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text" value={item.unit}
                        onChange={e => updateItem(rIndex, iIndex, 'unit', e.target.value)}
                        className="text-sm border-b border-transparent hover:border-[var(--line)] focus:border-[var(--blue)] focus:outline-none px-1 py-0.5 w-full"
                      />
                      <NumInput
                        value={item.rate}
                        onChange={v => updateItem(rIndex, iIndex, 'rate', v)}
                        className="w-full text-sm border-b border-transparent hover:border-[var(--line)] focus:border-[var(--blue)] focus:outline-none px-1 py-0.5 tabular-nums"
                      />
                      <span className="text-right font-bold text-sm tabular-nums text-[var(--ink)]">
                        &#8377;{(item.quantity * item.rate).toFixed(2)}
                      </span>
                      <button onClick={() => removeItem(rIndex, iIndex)} className="text-rose-300 hover:text-rose-500 transition-colors flex justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {room.items.length === 0 && (
                    <p className="text-xs text-center text-slate-400 italic py-2">No items yet — add below</p>
                  )}
                </div>

                {/* Add row controls — BELOW each room */}
                <div className="px-3 pb-3 flex items-center gap-2 flex-wrap">
                  <TemplateSearch
                    templates={templates}
                    onSelect={t => addItem(rIndex, t.id)}
                    onAddCustom={name => {
                      setRooms(prev => prev.map((r, ri) =>
                        ri === rIndex
                          ? { ...r, items: [...r.items, { description: name, unit: 'sq ft', quantity: 0, rate: 0, note: '' }] }
                          : r
                      ));
                    }}
                  />
                  <button
                    onClick={() => addItem(rIndex)}
                    className="text-xs font-bold border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Custom Row
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-2 flex justify-center">
              <AddRoomMenu onAdd={addRoom} />
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="glass p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Terms / Notes</label>
              <textarea
                value={invoice.notes || ''}
                onChange={e => setInvoice({ ...invoice, notes: e.target.value })}
                className="w-full border border-[var(--line)] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20"
                rows={5}
              />
            </div>
            <div className="bg-white/80 p-5 rounded-xl border border-white shadow-sm space-y-3 text-sm font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Subtotal</span>
                <span className="tabular-nums font-bold text-base">&#8377; {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Discount (&#8377;)</span>
                <NumInput
                  value={discountAmt}
                  onChange={v => setInvoice({ ...invoice, discount: v })}
                  className="w-28 text-right border border-[var(--line)] rounded-lg px-2 py-1 tabular-nums text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center gap-2">
                <select value={invoice.tax_type} onChange={e => setInvoice({ ...invoice, tax_type: e.target.value })} className="bg-transparent text-slate-500 focus:outline-none text-sm">
                  <option value="IGST">IGST (%)</option>
                  <option value="CGST_SGST">CGST/SGST (%)</option>
                </select>
                <NumInput
                  value={invoice.tax_rate || 0}
                  onChange={v => setInvoice({ ...invoice, tax_rate: v })}
                  className="w-28 text-right border border-[var(--line)] rounded-lg px-2 py-1 tabular-nums text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20"
                  placeholder="0"
                />
              </div>
              {(invoice.tax_rate > 0) && (
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tax Amount</span><span className="tabular-nums">+ &#8377; {taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[var(--line)] my-1" />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total</span>
                <span className="tabular-nums">&#8377; {grandTotal.toFixed(2)}</span>
              </div>
              <div className="text-right text-xs italic text-slate-400 mt-1 capitalize">
                {numberToWordsIndian(Math.round(grandTotal))}
              </div>
            </div>
          </div>

          {/* Payments Section */}
          {!isNew && (
            <div className="glass p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-extrabold text-lg text-primary flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent" /> Payments Received
                </h3>
                {balanceDue > 0 ? (
                  <button onClick={() => setPaymentModal({ amount: balanceDue.toFixed(2), mode: 'UPI' })} className="text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Record Payment
                  </button>
                ) : (
                  <span className="text-emerald-700 font-extrabold text-sm bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-200">PAID IN FULL</span>
                )}
              </div>
              <div className="space-y-2">
                {payments.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-[var(--plaster)] p-3 rounded-xl border border-[var(--line)]">
                    <div>
                      <div className="font-semibold text-sm">&#8377; {parseFloat(p.amount).toFixed(2)}</div>
                      <div className="text-xs text-[var(--slate)]">{p.date} &bull; {p.mode}</div>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">Received</span>
                  </div>
                ))}
                {payments.length === 0 && <p className="text-sm text-slate-400 italic">No payments recorded yet.</p>}
                {payments.length > 0 && (
                  <div className="pt-2 flex justify-between font-bold text-sm border-t border-[var(--line)] mt-2">
                    <span>Balance Due:</span>
                    <span className={balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}>&#8377; {balanceDue.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Customer Card */}
          <div className="glass p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 mt-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Customer Mobile *</label>
                <CustomerSelector
                  customers={customers}
                  value={invoice.customer_id}
                  onChange={id => {
                    const c = customers.find(x => x.id === id);
                    const cSites = c ? (c.sites || []) : [];
                    setSites(cSites);
                    setInvoice(prev => ({ ...prev, customer_id: id, site_id: cSites.length > 0 ? cSites[0].id : '' }));
                  }}
                  onCustomerAdded={c => {
                    setCustomers(prev => {
                      const exists = prev.find(x => x.id === c.id);
                      if (exists) return prev.map(x => x.id === c.id ? c : x);
                      return [c, ...prev];
                    });
                    const cSites = c.sites || [];
                    setSites(cSites);
                    setInvoice(prev => ({ 
                      ...prev, 
                      customer_id: c.id,
                      site_id: cSites.length > 0 ? cSites[0].id : prev.site_id 
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Site</label>
                <select value={invoice.site_id || ''} onChange={e => setInvoice({ ...invoice, site_id: e.target.value })} className="w-full border border-[var(--line)] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none">
                  <option value="">No site</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.project_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Invoice Date</label>
                <input type="date" value={invoice.date} onChange={e => setInvoice({ ...invoice, date: e.target.value })} className="w-full border border-[var(--line)] rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Due Date</label>
                <input type="date" value={invoice.due_date || ''} onChange={e => setInvoice({ ...invoice, due_date: e.target.value })} className="w-full border border-[var(--line)] rounded-xl px-3 py-2 text-sm focus:outline-none" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="hidden md:flex flex-col w-[400px] lg:w-[480px] bg-white border border-[var(--line)] shadow-sm rounded-2xl overflow-hidden shrink-0">
        <div className="bg-[var(--ink)] text-[var(--paper)] py-3 px-5 flex justify-between items-center text-sm">
          <span className="font-medium">Live Preview</span>
          <button onClick={() => window.print()} className="flex items-center gap-1 hover:text-[var(--blue)] transition-colors">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-[11px] font-body bg-white text-black relative pdf-preview-container" style={{ zoom: 0.8 }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0">
            <img src="/GS_FalseCeiling_Works/logo.png" alt="Watermark" className="w-[80%] max-w-md grayscale" />
          </div>
          <div className="relative z-10">
            <div className="text-center border-b border-gray-200 pb-4 mb-4 flex flex-col items-center">
              <img src="/GS_FalseCeiling_Works/logo.png" alt="GS Decors" className="h-10 w-auto mb-2" />
              <h1 className="text-xl font-bold uppercase tracking-widest">Tax Invoice</h1>
            </div>
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-gray-500 uppercase text-[9px] font-bold">Bill To</p>
                <p className="font-bold">{customers.find(c => c.id === invoice.customer_id)?.name || 'Customer Name'}</p>
                <p>{sites.find(s => s.id === invoice.site_id)?.project_name || ''}</p>
              </div>
              <div className="text-right">
                <p><span className="text-gray-500">Invoice No:</span> <span className="font-bold">{isNew ? 'DRAFT' : invoice.number}</span></p>
                <p><span className="text-gray-500">Date:</span> {invoice.date}</p>
                {invoice.due_date && <p><span className="text-gray-500">Due:</span> {invoice.due_date}</p>}
              </div>
            </div>

            {rooms.map((room, rIndex) => (
              <div key={rIndex} className="mb-4">
                {room.items.length > 0 && <h3 className="font-bold bg-gray-100 p-1 mb-1">{room.name}</h3>}
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {room.items.map((item, iIndex) => (
                      <tr key={iIndex} className="border-b border-gray-100 last:border-0">
                        <td className="py-1 w-1/2">{item.description}</td>
                        <td className="py-1 w-[15%]">{item.quantity} {item.unit}</td>
                        <td className="py-1 w-[15%]">&#8377;{item.rate}</td>
                        <td className="py-1 w-[20%] text-right font-medium">&#8377;{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            <div className="border-t-2 border-black pt-2 mt-4 ml-auto w-64 space-y-1 text-[12px]">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>&#8377; {subtotal.toFixed(2)}</span></div>
              {discountAmt > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount:</span><span>- &#8377; {discountAmt.toFixed(2)}</span></div>}
              {(invoice.tax_rate > 0) && <div className="flex justify-between"><span className="text-gray-500">{invoice.tax_type} ({invoice.tax_rate}%):</span><span>+ &#8377; {taxAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-sm border-t pt-1 mt-1"><span>Total:</span><span>&#8377; {grandTotal.toFixed(2)}</span></div>
            </div>

            {payments.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-bold text-[10px] text-gray-500 uppercase mb-2">Payment History</h4>
                {payments.map(p => (
                  <div key={p.id} className="flex justify-between text-[10px]">
                    <span>{p.date} ({p.mode})</span>
                    <span className="font-bold">&#8377; {parseFloat(p.amount).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Balance Due:</span><span>&#8377; {balanceDue.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="mt-8 text-center text-gray-500 text-[9px] border-t border-gray-200 pt-4">
              Thank you for your business!<br />G S Decors &amp; Enterprises &bull; Koranad, Mayiladuthurai
            </div>
          </div>
        </div>
      </div>

      {/* Area Calculator Modal */}
      {calcModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setCalcModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6 text-[var(--ink)]">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-heading">Area Calculator</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Length (ft)</label>
                <input type="number" step="0.01" autoFocus value={calcModal.l} onChange={e => setCalcModal({...calcModal, l: e.target.value})} className="w-full border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--blue)]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Width (ft)</label>
                <input type="number" step="0.01" value={calcModal.w} onChange={e => setCalcModal({...calcModal, w: e.target.value})} className="w-full border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--blue)]" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCalcModal(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] font-bold text-sm text-[var(--slate)] hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => {
                const l = parseFloat(calcModal.l);
                const w = parseFloat(calcModal.w);
                if (!isNaN(l) && !isNaN(w)) {
                  updateItem(calcModal.rIndex, calcModal.iIndex, 'quantity', l * w);
                }
                setCalcModal(null);
              }} className="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white font-bold text-sm hover:bg-[var(--blue)]/90 transition-all shadow-sm">Calculate</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setPaymentModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold font-heading text-[var(--ink)] mb-6">Record Payment</h3>
            <form onSubmit={executePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Amount (&#8377;)</label>
                <input 
                  type="number" step="0.01" required autoFocus
                  value={paymentModal.amount}
                  onChange={e => setPaymentModal({...paymentModal, amount: e.target.value})}
                  className="w-full border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--blue)]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Mode of Payment</label>
                <select 
                  value={paymentModal.mode}
                  onChange={e => setPaymentModal({...paymentModal, mode: e.target.value})}
                  className="w-full border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--blue)] bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setPaymentModal(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] font-bold text-sm text-[var(--slate)] hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white font-bold text-sm hover:bg-[var(--blue)]/90 transition-all shadow-sm">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
