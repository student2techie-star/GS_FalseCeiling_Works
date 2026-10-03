import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ invoiced: 0, received: 0, pending: 0, overdue: 0, expenses: 0 });
  const [monthlyData, setMonthlyData] = useState<{month: string, amount: number}[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data: invoices } = await supabase.from('invoices').select('id, discount, tax_rate, due_date');
      const { data: items } = await supabase.from('invoice_items').select('invoice_id, quantity, rate');
      const { data: payments } = await supabase.from('payments').select('invoice_id, amount, date, created_at');

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

      let expensesTotal = 0;
      const { data: expData, error: expErr } = await supabase.from('expenses').select('amount');
      if (!expErr && expData) {
        expensesTotal = expData.reduce((sum, e) => sum + Number(e.amount), 0);
      }

      const pending = invoiced - received;
      setMetrics({ invoiced, received, pending, overdue, expenses: expensesTotal });

      // Generate last 6 months data for chart
      const months: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months[d.toLocaleString('default', { month: 'short' })] = 0;
      }

      if (payments) {
        payments.forEach(p => {
          const pDate = new Date(p.date || p.created_at);
          const m = pDate.toLocaleString('default', { month: 'short' });
          if (months[m] !== undefined) {
            months[m] += Number(p.amount);
          }
        });
      }
      setMonthlyData(Object.keys(months).map(k => ({ month: k, amount: months[k] })));
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
        <div className="flex flex-wrap gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Link to="/invoice/quotes/new" className="flex-1 md:flex-none justify-center bg-[var(--ink)] text-white px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-[var(--ink)]/90 transition-all shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Quote
          </Link>
          <Link to="/invoice/invoices/new" className="flex-1 md:flex-none justify-center bg-[var(--blue)] text-white px-5 py-2.5 rounded-2xl text-sm font-medium hover:bg-[var(--blue)]/90 transition-all shadow-sm flex items-center gap-2">
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

        <div 
          onClick={() => navigate('/invoice/invoices?filter=paid')}
          className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-emerald-200"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Total Received</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-700 tabular-nums font-heading">₹ {metrics.received.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-600/80 mt-2">Payments collected</p>
        </div>

        <div 
          onClick={() => navigate('/invoice/invoices?filter=pending')}
          className="bg-white p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-amber-200"
        >
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

      {/* Profit Margin Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <p className="text-slate-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">Total Expenses</p>
             <p className="text-3xl sm:text-4xl font-black tabular-nums">₹ {metrics.expenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
           </div>
           <Link to="/invoice/expenses" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors whitespace-nowrap text-center">View Ledger</Link>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 sm:p-8 rounded-3xl text-white shadow-lg shadow-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <p className="text-blue-200 text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">Net Profit (Received - Expenses)</p>
             <p className="text-3xl sm:text-4xl font-black tabular-nums">₹ {(metrics.received - metrics.expenses).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
           </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-8 rounded-3xl border border-[var(--line)] shadow-sm">
        <h3 className="text-lg font-bold font-heading mb-8 text-[var(--ink)]">Revenue (Last 6 Months)</h3>
        <div className="flex items-end justify-between h-48 gap-4 px-2">
          {monthlyData.map(d => {
            const max = Math.max(...monthlyData.map(m => m.amount), 1);
            const heightPct = (d.amount / max) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative flex-1 flex items-end justify-center">
                  <div 
                    className="w-full max-w-[48px] bg-blue-100 rounded-t-xl relative group-hover:bg-[var(--blue)] transition-colors"
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--ink)] text-white text-[11px] py-1.5 px-3 rounded-lg font-bold whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      ₹ {d.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{d.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
