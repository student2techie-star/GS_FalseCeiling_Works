import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [metrics] = useState({ invoiced: 450000, received: 300000, pending: 150000, overdue: 2 });

  useEffect(() => {
    // In production, fetch from Supabase
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
