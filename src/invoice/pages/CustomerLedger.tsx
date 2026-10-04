import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, User, MapPin, Phone, Mail, Receipt, FileText, Download, Bell } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerLedger() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    
    // Fetch customer info
    const { data: custData } = await supabase.from('customers').select('*').eq('id', id).single();
    if (custData) setCustomer(custData);
    
    // Fetch quotes
    const { data: qData } = await supabase.from('quotations').select('*').eq('customer_id', id).order('created_at', { ascending: false });
    if (qData) setQuotes(qData);
    
    // Fetch invoices with payments and items
    const { data: iData } = await supabase.from('invoices').select(`
      *,
      payments ( amount ),
      invoice_items ( quantity, rate )
    `).eq('customer_id', id).order('created_at', { ascending: false });
    
    if (iData) {
      const enrichedInvoices = iData.map(inv => {
        const paidAmount = inv.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
        const subtotal = inv.invoice_items?.reduce((sum: number, i: any) => sum + ((i.quantity || 0) * (i.rate || 0)), 0) || 0;
        const discountAmt = inv.discount || 0;
        const taxable = subtotal - discountAmt;
        const tax = taxable * ((inv.tax_rate || 0) / 100);
        const grandTotal = taxable + tax;
        const balance = grandTotal - paidAmount;
        
        let status = 'DUE';
        if (grandTotal > 0 && balance <= 0) status = 'PAID';
        else if (inv.payments?.length > 0 && balance > 0) status = 'PARTIAL';
        else if (inv.due_date && new Date(inv.due_date) < new Date()) status = 'OVERDUE';
        
        return { ...inv, grandTotal, paidAmount, balance, computedStatus: status };
      });
      setInvoices(enrichedInvoices);
    }
    
    setLoading(false);
  };

  const handleSendReminder = (invoice: any) => {
    if (!customer?.phone) {
      alert("Customer phone number is missing!");
      return;
    }
    setSendingReminder(invoice.id);
    const text = `Hello ${customer.name},\n\nThis is a friendly reminder that Invoice ${invoice.number} for ₹${invoice.balance.toFixed(2)} is currently DUE.\n\nPlease arrange for payment at your earliest convenience. Thank you!`;
    window.open(`https://wa.me/91${customer.phone}?text=${encodeURIComponent(text)}`, '_blank');
    setSendingReminder(null);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading Ledger...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-red-500 font-bold">Customer not found</div>;
  }

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const totalReceived = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalPending = totalInvoiced - totalReceived;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 print:bg-white print:p-0">
      <div className="flex items-center gap-4 hide-on-print">
        <button onClick={() => navigate('/admin/customers')} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-3xl font-bold font-heading text-slate-800">Customer Ledger</h1>
        <button onClick={() => window.print()} className="ml-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
          <Download className="w-4 h-4" /> Print Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 print:border-none print:shadow-none print:p-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-50 text-[var(--blue)] rounded-2xl flex items-center justify-center">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{customer.name}</h2>
                <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Client Profile</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">{customer.phone || 'N/A'}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">{customer.email || 'N/A'}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-600 font-medium">{customer.address || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[var(--blue)] to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20 hide-on-print">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-6">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/90">Total Invoiced</span>
                <span className="font-bold tabular-nums">₹{totalInvoiced.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-300">Total Received</span>
                <span className="font-bold tabular-nums text-emerald-300">₹{totalReceived.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-white/20 flex justify-between items-end">
                <span className="text-sm font-medium text-white/90">Pending Balance</span>
                <span className="text-2xl font-black tabular-nums text-rose-200">₹{totalPending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quotes and Invoices */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:border-none print:shadow-none">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800">Invoices & Payments</h3>
              </div>
            </div>
            
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-sm font-medium text-slate-400">No invoices generated yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {invoices.map(inv => (
                  <div key={inv.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <button onClick={() => navigate(`/admin/invoice/${inv.id}`)} className="font-bold text-[var(--blue)] hover:underline">
                            {inv.number}
                          </button>
                          <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                            inv.computedStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                            inv.computedStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-700' :
                            inv.computedStatus === 'OVERDUE' ? 'bg-rose-100 text-rose-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {inv.computedStatus}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {format(new Date(inv.date), 'dd MMM yyyy')} {inv.due_date && ` • Due: ${format(new Date(inv.due_date), 'dd MMM yyyy')}`}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-800">₹{inv.grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                          {inv.balance > 0 && (
                            <div className="text-[11px] font-bold text-rose-500 uppercase tracking-wider mt-0.5">
                              Bal: ₹{inv.balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </div>
                          )}
                        </div>
                        
                        {(inv.computedStatus === 'DUE' || inv.computedStatus === 'OVERDUE' || inv.computedStatus === 'PARTIAL') && (
                          <button 
                            onClick={() => handleSendReminder(inv)}
                            className="hide-on-print flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Bell className="w-3.5 h-3.5" /> 
                            {sendingReminder === inv.id ? 'Sending...' : 'Remind'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hide-on-print">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800">Quotations History</h3>
              </div>
            </div>
            
            {quotes.length === 0 ? (
              <div className="p-8 text-center text-sm font-medium text-slate-400">No quotes generated yet.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {quotes.map(q => (
                  <div key={q.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex justify-between items-center">
                    <div>
                      <button onClick={() => navigate(`/admin/quotes/${q.id}`)} className="font-bold text-[var(--blue)] hover:underline block mb-1">
                        {q.number}
                      </button>
                      <div className="text-xs font-medium text-slate-500">
                        {format(new Date(q.date), 'dd MMM yyyy')}
                      </div>
                    </div>
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
