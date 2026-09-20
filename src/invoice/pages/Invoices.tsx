import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Receipt } from 'lucide-react';
import { format } from 'date-fns';

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    // Include payments to compute status
    let q = supabase.from('invoices').select(`
      *,
      customers ( name ),
      sites ( project_name ),
      payments ( amount )
    `).order('created_at', { ascending: false });
    
    const { data } = await q;
    if (data) {
      if (search) {
        setInvoices(data.filter(inv => 
          inv.number.toLowerCase().includes(search.toLowerCase()) || 
          inv.customers?.name?.toLowerCase().includes(search.toLowerCase())
        ));
      } else {
        setInvoices(data);
      }
    }
    setLoading(false);
  };

  const getComputedStatus = (invoice: any) => {
    const paidAmount = invoice.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    
    if (paidAmount > 0) return { label: 'PARTIAL', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    
    const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date();
    if (isOverdue) return { label: 'OVERDUE', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    
    return { label: 'DUE', color: 'bg-blue-50 text-blue-700 border-blue-200' };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl border border-[var(--line)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">Tax Invoices</h1>
          <p className="text-[var(--slate)] text-sm mt-1">Track billing, payment receipts, and outstanding balances.</p>
        </div>
        <button 
          onClick={() => navigate('/invoice/invoices/new')}
          className="bg-[var(--blue)] text-[var(--paper)] px-5 py-2.5 rounded-2xl font-medium text-sm flex items-center gap-2 hover:bg-[var(--blue)]/90 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--slate)]" />
          <input 
            type="text" 
            placeholder="Search by invoice number or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInvoices()}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[var(--line)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/20 shadow-sm text-sm"
          />
        </div>
        <button onClick={fetchInvoices} className="px-6 py-3 bg-white border border-[var(--line)] rounded-2xl text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
          Search
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[var(--line)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--plaster)] text-[var(--slate)] text-xs uppercase tracking-wider border-b border-[var(--line)]">
                <th className="px-6 py-4 font-bold">Invoice #</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer & Site</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-[var(--slate)]">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-[var(--slate)]">No invoices found. Click "New Invoice" to create one.</td></tr>
              ) : (
                invoices.map(inv => {
                  const status = getComputedStatus(inv);
                  return (
                    <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-[var(--ink)]">
                        <Link to={`/invoice/invoices/${inv.id}`} className="hover:text-[var(--blue)] transition-colors">
                          {inv.number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--slate)]">
                        {format(new Date(inv.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-[var(--ink)]">{inv.customers?.name || 'Unassigned'}</div>
                        <div className="text-xs text-[var(--slate)]">{inv.sites?.project_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/invoice/invoices/${inv.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--blue)] hover:bg-blue-50 transition-colors">
                          <Receipt className="w-3.5 h-3.5" /> Edit / View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
