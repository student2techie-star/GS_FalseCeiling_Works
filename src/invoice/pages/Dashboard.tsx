import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ invoiced: 0, received: 0, pending: 0, overdue: 0 });

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data: invoices } = await supabase.from('invoices').select('id, discount, tax_rate, due_date');
      const { data: items } = await supabase.from('invoice_items').select('invoice_id, quantity, rate');
      const { data: payments } = await supabase.from('payments').select('invoice_id, amount');

      let invoiced = 0;
      let received = 0;
      let overdue = 0;

      if (payments) {
        received = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      }

      if (invoices && items) {
        const today = new Date();
        today.setHours(0,0,0,0);

        invoices.forEach(inv => {
          const invItems = items.filter(i => i.invoice_id === inv.id);
          const subtotal = invItems.reduce((sum, i) => sum + (Number(i.quantity) * Number(i.rate)), 0);
          const discount = Number(inv.discount) || 0;
          const taxRate = Number(inv.tax_rate) || 0;
          
          const discounted = Math.max(0, subtotal - discount);
          const taxAmt = discounted * (taxRate / 100);
          const invTotal = discounted + taxAmt;
          
          invoiced += invTotal;

          if (inv.due_date) {
            const dueDate = new Date(inv.due_date);
            if (dueDate < today) {
              const invPayments = payments?.filter(p => p.invoice_id === inv.id) || [];
              const invPaid = invPayments.reduce((sum, p) => sum + Number(p.amount), 0);
              if (invPaid < invTotal - 0.01) {
                overdue++;
              }
            }
          }
        });
      }

      const pending = invoiced - received;
      setMetrics({ invoiced, received, pending, overdue });
    };

    fetchMetrics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">Overview & Metrics</h1>
          <p className="text-[var(--slate)] text-sm mt-1">Welcome back. Here is your financial snapshot for the current financial year.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/invoice/quotes/new" className="bg-[var(--ink)] text-white px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-[var(--ink)]/90 transition-all shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Quote
          </Link>
          <Link to="/invoice/invoices/new" className="bg-[var(--blue)] text-white px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-[var(--blue)]/90 transition-all shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Invoice
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--slate)] text-xs font-bold uppercase tracking-wider">Total Invoiced</span>
            <div className="p-2.5 bg-blue-50 text-[var(--blue)] rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[var(--ink)] tabular-nums font-heading">₹ {metrics.invoiced.toLocaleString('en-IN')}</p>
          <p className="text-xs text-[var(--slate)] mt-2">FY 2026-27 total billed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Total Received</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-700 tabular-nums font-heading">₹ {metrics.received.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-600/80 mt-2">Payments collected</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">Pending Balance</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-700 tabular-nums font-heading">₹ {metrics.pending.toLocaleString('en-IN')}</p>
          <p className="text-xs text-amber-600/80 mt-2">Awaiting payment</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-rose-600 text-xs font-bold uppercase tracking-wider">Overdue</span>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-700 tabular-nums font-heading">{metrics.overdue} Invoices</p>
          <p className="text-xs text-rose-600/80 mt-2">Action required</p>
        </div>
      </div>

      {/* Analytics Placeholder Card */}
      <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm min-h-[320px] flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-[var(--plaster)] text-[var(--slate)] rounded-full mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold font-heading mb-1 text-[var(--ink)]">Monthly Revenue Analytics</h3>
        <p className="text-sm text-[var(--slate)] max-w-sm">Detailed charts and revenue breakdown will populate automatically as quotes and invoices are created.</p>
      </div>
    </div>
  );
}
