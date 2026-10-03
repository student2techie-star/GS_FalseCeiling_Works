import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, IndianRupee, Trash2, Calendar, MapPin, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Material',
    description: '',
    amount: '',
    site_id: ''
  });

  const categories = ['Material', 'Labor', 'Transport', 'Food', 'Miscellaneous'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    
    // First check if table exists
    const { error: testError } = await supabase.from('expenses').select('id').limit(1);
    
    if (testError && testError.code === '42P01') {
      setTableExists(false);
      setLoading(false);
      return;
    }

    const { data: eData } = await supabase.from('expenses').select(`
      *,
      sites ( project_name )
    `).order('date', { ascending: false });
    
    if (eData) setExpenses(eData);

    const { data: sData } = await supabase.from('sites').select('*').order('project_name');
    if (sData) setSites(sData);

    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description) return;
    
    const payload = {
      date: form.date,
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      site_id: form.site_id || null
    };

    const { data, error } = await supabase.from('expenses').insert([payload]).select(`
      *,
      sites ( project_name )
    `).single();

    if (error) {
      toast.error('Failed to add expense');
    } else if (data) {
      setExpenses([data, ...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setShowAdd(false);
      setForm({ ...form, description: '', amount: '' });
      toast.success('Expense added successfully!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) {
      setExpenses(expenses.filter(e => e.id !== id));
      toast.success('Expense deleted');
    }
  };

  if (!tableExists) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <IndianRupee className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-800 mb-4">Enable Expense Tracking</h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            To use this feature, you need to create the <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">expenses</code> table in your Supabase database. Please copy the SQL below and run it in your Supabase SQL Editor.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 text-left overflow-x-auto">
            <pre className="text-emerald-400 text-sm font-mono leading-relaxed">
{`CREATE TABLE expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  date date NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  site_id uuid REFERENCES sites(id) ON DELETE SET NULL
);`}
            </pre>
          </div>
          <button onClick={fetchExpenses} className="mt-8 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            I have run the SQL, reload page
          </button>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading">Expenses</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-primary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg shadow-rose-500/20 md:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/80 mb-2">Total Expenses</h3>
          <div className="text-3xl font-black tabular-nums">
            ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:col-span-2 text-slate-500 flex flex-col justify-center">
          <p className="text-sm">Track all your material, labor, and transport expenses here. You will soon see Profit/Loss margins directly on your dashboard!</p>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
            <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description (e.g. Gypsum Boards)</label>
            <input type="text" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
            <input type="number" required min="0" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Project / Site (Optional)</label>
            <select value={form.site_id} onChange={e => setForm({...form, site_id: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500">
              <option value="">-- None --</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.project_name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-sm">Save Expense</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No expenses recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expenses.map(exp => (
              <div key={exp.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    exp.category === 'Material' ? 'bg-indigo-50 text-indigo-500' :
                    exp.category === 'Labor' ? 'bg-amber-50 text-amber-500' :
                    exp.category === 'Transport' ? 'bg-cyan-50 text-cyan-500' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{exp.description}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {format(new Date(exp.date), 'dd MMM yyyy')}</span>
                      <span className="flex items-center gap-1 uppercase tracking-wider text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">{exp.category}</span>
                      {exp.sites?.project_name && (
                        <span className="flex items-center gap-1 text-indigo-500"><MapPin className="w-3.5 h-3.5"/> {exp.sites.project_name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Amount</span>
                    <span className="text-lg font-black text-rose-500">₹{Number(exp.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
