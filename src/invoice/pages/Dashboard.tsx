import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ invoiced: 0, received: 0, pending: 0, overdue: 0 });

  useEffect(() => {
    // Scaffold fetch metrics
    // In production, we'd query Invoices and Payments for the current financial year.
    setMetrics({
      invoiced: 450000,
      received: 300000,
      pending: 150000,
      overdue: 2
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)]">
          <p className="text-[var(--slate)] text-sm mb-1">Total Invoiced (FY)</p>
          <p className="text-2xl font-bold tabular-nums">₹ {metrics.invoiced.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[var(--paper)] p-6 rounded-md border border-green-200">
          <p className="text-green-700 text-sm mb-1">Total Received</p>
          <p className="text-2xl font-bold tabular-nums text-green-700">₹ {metrics.received.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[var(--paper)] p-6 rounded-md border border-orange-200">
          <p className="text-orange-700 text-sm mb-1">Total Pending</p>
          <p className="text-2xl font-bold tabular-nums text-orange-700">₹ {metrics.pending.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[var(--paper)] p-6 rounded-md border border-red-200">
          <p className="text-red-700 text-sm mb-1">Overdue Invoices</p>
          <p className="text-2xl font-bold tabular-nums text-red-700">{metrics.overdue}</p>
        </div>
      </div>

      <div className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)] min-h-[300px] flex items-center justify-center">
        <p className="text-[var(--slate)]">Monthly Revenue Chart will render here.</p>
      </div>
    </div>
  );
}
