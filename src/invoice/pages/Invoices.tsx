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
    // This is a naive computation. We'd need actual totals to compute PAID/OVERDUE accurately.
    const paidAmount = invoice.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    
    if (paidAmount > 0) return { label: 'PARTIAL', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    
    const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date();
    if (isOverdue) return { label: 'OVERDUE', color: 'bg-red-100 text-red-800 border-red-200' };
    
    return { label: 'DUE', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading">Invoices</h1>
        <button 
          onClick={() => navigate('/invoice/invoices/new')}
          className="bg-[var(--blue)] text-[var(--paper)] px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate)]" />
          <input 
            type="text" 
            placeholder="Search by invoice number or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchInvoices()}
            className="w-full pl-10 pr-4 py-2 border border-[var(--line)] rounded-md focus:outline-none focus:border-[var(--blue)]"
          />
        </div>
        <button onClick={fetchInvoices} className="px-4 py-2 bg-[var(--plaster)] border border-[var(--line)] rounded-md text-sm font-medium hover:bg-gray-100">
          Search
        </button>
      </div>

      <div className="bg-[var(--paper)] rounded-md border border-[var(--line)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--plaster)] text-[var(--slate)] text-sm border-b border-[var(--line)]">
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer & Site</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-[var(--slate)]">Loading...</td></tr>
              ) : invoices.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-[var(--slate)]">No invoices found.</td></tr>
              ) : (
                invoices.map(inv => {
                  const status = getComputedStatus(inv);
                  return (
                    <tr key={inv.id} className="border-b border-[var(--line)] hover:bg-gray-50 last:border-0 transition-colors">
                      <td className="px-6 py-4 font-medium text-[var(--ink)]">
                        <Link to={`/invoice/invoices/${inv.id}`} className="hover:text-[var(--blue)] hover:underline">
                          {inv.number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--slate)]">
                        {format(new Date(inv.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-[var(--ink)]">{inv.customers?.name}</div>
                        <div className="text-xs text-[var(--slate)]">{inv.sites?.project_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium border rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums font-medium text-[var(--ink)]">
                        -
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/invoice/invoices/${inv.id}`} className="text-[var(--blue)] text-sm font-medium hover:underline flex items-center justify-end gap-1">
                          <Receipt className="w-4 h-4" /> View/Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
