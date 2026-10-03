import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Search, Pencil, Trash2, X, Check, Package, Ruler, IndianRupee,
} from 'lucide-react';
import toast from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  unit: string;
  default_rate: number;
  note: string | null;
  in_stock: boolean;
};

const UNIT_OPTIONS = [
  'sq ft', 'running ft', 'lump sum', 'nos', 'sq mt',
  'running mt', 'kg', 'box', 'bag', 'litre',
];

const EMPTY: Omit<Product, 'id'> = { name: '', unit: 'sq ft', default_rate: 0, note: '', in_stock: true };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmStockChange, setConfirmStockChange] = useState<Product | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q ? products.filter(p =>
        p.name.toLowerCase().includes(q) || p.unit.toLowerCase().includes(q)
      ) : products
    );
  }, [search, products]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('item_templates').select('*').order('name');
    if (error) toast.error('Failed to load products');
    else setProducts(data ?? []);
    setLoading(false);
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, unit: p.unit, default_rate: p.default_rate, note: p.note ?? '', in_stock: p.in_stock ?? true });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Product name is required');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        unit: form.unit,
        default_rate: form.default_rate,
        note: form.note || null,
        in_stock: form.in_stock,
      };
      if (editing) {
        const { error } = await supabase.from('item_templates').update(payload).eq('id', editing.id);
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...payload } : p));
        toast.success('Product updated!');
      } else {
        const { data, error } = await supabase.from('item_templates').insert([payload]).select().single();
        if (error) throw error;
        setProducts(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Product added!');
      }
      closeModal();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('item_templates').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
    toast.success('Product deleted');
  };

  const executeStockChange = async () => {
    if (!confirmStockChange) return;
    const newStatus = !(confirmStockChange.in_stock ?? true);
    const { error } = await supabase.from('item_templates').update({ in_stock: newStatus }).eq('id', confirmStockChange.id);
    if (error) {
      toast.error('Failed to update stock status');
    } else {
      setProducts(prev => prev.map(p => p.id === confirmStockChange.id ? { ...p, in_stock: newStatus } : p));
      toast.success(newStatus ? 'Marked as In Stock' : 'Marked as Out of Stock');
    }
    setConfirmStockChange(null);
  };

  const avgRate = products.length
    ? Math.round(products.reduce((s, p) => s + p.default_rate, 0) / products.length)
    : 0;
  const unitsUsed = new Set(products.map(p => p.unit)).size;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-[var(--line)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">Products &amp; Rates</h1>
          <p className="text-[var(--slate)] text-sm mt-1">
            Manage your service catalogue — names, measurements, and default rates.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[var(--blue)] text-white px-5 py-2.5 rounded-2xl font-medium text-sm flex items-center gap-2 hover:bg-[var(--blue)]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[var(--line)] shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0"><Package className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-[var(--slate)] font-semibold uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-bold font-heading text-[var(--ink)]">{products.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[var(--line)] shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0"><IndianRupee className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-[var(--slate)] font-semibold uppercase tracking-wider">Avg. Rate (&#8377;)</p>
            <p className="text-2xl font-bold font-heading text-[var(--ink)]">{avgRate.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[var(--line)] shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0"><Ruler className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-[var(--slate)] font-semibold uppercase tracking-wider">Units Used</p>
            <p className="text-2xl font-bold font-heading text-[var(--ink)]">{unitsUsed}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate)]" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by product name or unit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-white border border-[var(--line)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20 shadow-sm text-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--slate)] hover:text-[var(--ink)]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[var(--line)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--plaster)] text-[var(--slate)] text-xs uppercase tracking-wider border-b border-[var(--line)]">
                <th className="px-6 py-4 font-bold">#</th>
                <th className="px-6 py-4 font-bold">Product / Service Name</th>
                <th className="px-6 py-4 font-bold">Measurement Unit</th>
                <th className="px-6 py-4 font-bold">Default Rate (&#8377;)</th>
                <th className="px-6 py-4 font-bold">Stock Status</th>
                <th className="px-6 py-4 font-bold">Note</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-[var(--slate)]">Loading products...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-[var(--slate)]">
                      <Package className="w-10 h-10 opacity-30" />
                      <p>{search ? 'No products match your search.' : 'No products yet. Click "Add Product" to get started.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm text-[var(--slate)] font-mono">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold text-[var(--ink)]">{p.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-100">
                        <Ruler className="w-3 h-3" />{p.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-700 text-sm">
                        &#8377; {p.default_rate.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setConfirmStockChange(p)} className="hover:opacity-80 transition-opacity focus:outline-none" title="Click to change stock status">
                        {p.in_stock !== false ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100 uppercase tracking-wider">
                            Out of Stock
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--slate)] max-w-[180px] truncate">
                      {p.note || <span className="italic opacity-40">—</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {deleteId === p.id ? (
                        <div className="flex justify-end items-center gap-2">
                          <span className="text-xs text-rose-600 font-semibold">Confirm delete?</span>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteId(null)} className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(p)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--blue)] hover:bg-blue-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 bg-[var(--plaster)] border-t border-[var(--line)] text-xs text-[var(--slate)] font-medium">
            Showing {filtered.length} of {products.length} products
          </div>
        )}
      </div>

      {/* Stock Change Confirmation Modal */}
      {confirmStockChange && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmStockChange(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--ink)] mb-2">Change Stock Status?</h3>
            <p className="text-sm text-[var(--slate)] mb-6">
              Are you sure you want to mark <strong>{confirmStockChange.name}</strong> as 
              <span className={confirmStockChange.in_stock !== false ? 'text-rose-600 font-bold ml-1' : 'text-emerald-600 font-bold ml-1'}>
                {confirmStockChange.in_stock !== false ? 'Out of Stock' : 'In Stock'}
              </span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmStockChange(null)}
                className="flex-1 py-2.5 rounded-xl border border-[var(--line)] text-sm font-bold text-[var(--slate)] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeStockChange}
                className="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white text-sm font-bold hover:bg-[var(--blue)]/90 transition-all shadow-sm"
              >
                Yes, Change it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={closeModal}>
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-heading text-[var(--ink)]">
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-[var(--slate)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Product / Service Name *</label>
                <input
                  type="text" required autoFocus
                  placeholder="e.g. Gypsum Ceiling"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[var(--line)] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Measurement Unit *</label>
                <div className="flex gap-2">
                  <select
                    value={UNIT_OPTIONS.includes(form.unit) ? form.unit : '__custom__'}
                    onChange={e => { if (e.target.value !== '__custom__') setForm({ ...form, unit: e.target.value }); }}
                    className="flex-1 border border-[var(--line)] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20 bg-white"
                  >
                    {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                    {!UNIT_OPTIONS.includes(form.unit) && <option value="__custom__">{form.unit}</option>}
                  </select>
                  <input
                    type="text"
                    placeholder="Custom unit"
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-32 border border-[var(--line)] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Default Rate (&#8377;) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate)] font-bold text-sm">&#8377;</span>
                  <input
                    type="number" min="0" step="0.01" required
                    placeholder="0.00"
                    value={form.default_rate}
                    onChange={e => setForm({ ...form, default_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[var(--line)] rounded-2xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                  Note <span className="font-normal text-[var(--slate)]">(optional)</span>
                </label>
                <textarea
                  placeholder="e.g. includes material and labour"
                  value={form.note ?? ''}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  rows={2}
                  className="w-full border border-[var(--line)] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, in_stock: !form.in_stock })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form.in_stock ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form.in_stock ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--ink)]">In Stock</span>
                  <span className="text-[10px] text-[var(--slate)]">Is this product available for quotes?</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 py-3 rounded-2xl border border-[var(--line)] text-sm font-bold text-[var(--slate)] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-2xl bg-[var(--blue)] text-white text-sm font-bold hover:bg-[var(--blue)]/90 transition-all disabled:opacity-60 shadow-sm"
                >
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
