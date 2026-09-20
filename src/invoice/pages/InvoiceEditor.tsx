import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Download, ArrowLeft, Calculator, CreditCard } from 'lucide-react';

export default function InvoiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [invoice, setInvoice] = useState<any>({ number: 'Draft' });
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!isNew) fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    setLoading(true);
    const { data: invData } = await supabase.from('invoices').select('*').eq('id', id).single();
    if (invData) setInvoice(invData);
    
    const { data: pData } = await supabase.from('payments').select('*').eq('invoice_id', id);
    if (pData) setPayments(pData);
    
    setLoading(false);
  };

  const addPayment = async () => {
    const amountStr = prompt("Payment Amount (₹):");
    const mode = prompt("Mode (UPI, Cash, Bank, Cheque):", "UPI");
    if (amountStr && mode) {
      const amount = parseFloat(amountStr);
      if (amount > 0) {
        const { data } = await supabase.from('payments').insert([{
          invoice_id: id,
          amount,
          mode,
          date: new Date().toISOString().split('T')[0]
        }]).select().single();
        if (data) setPayments([...payments, data]);
      }
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/invoice/invoices')} className="p-1 hover:bg-gray-200 rounded-md">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold font-heading text-2xl">
          {isNew ? 'New Invoice' : `Invoice ${invoice.number}`}
        </h2>
      </div>

      <div className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)]">
        <p className="text-[var(--slate)] mb-6">
          Full invoice editor (similar to Quotes) to be implemented in full production.
          This scaffold demonstrates the payments tracking feature.
        </p>

        {!isNew && (
          <div className="mt-8 border-t border-[var(--line)] pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Payments Received
              </h3>
              <button onClick={addPayment} className="text-[var(--blue)] text-sm font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Record Payment
              </button>
            </div>

            <div className="space-y-3">
              {payments.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-[var(--plaster)] p-3 rounded-md border border-[var(--line)]">
                  <div>
                    <div className="font-medium">₹ {p.amount.toFixed(2)}</div>
                    <div className="text-xs text-[var(--slate)]">{p.date} &bull; {p.mode}</div>
                  </div>
                  <button className="text-[var(--blue)] text-sm hover:underline flex items-center gap-1">
                    <Download className="w-4 h-4" /> Receipt
                  </button>
                </div>
              ))}
              {payments.length === 0 && <p className="text-sm text-[var(--slate)] italic">No payments recorded yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
