import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { Phone, CheckCircle } from 'lucide-react';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (data) setEnquiries(data);
  };

  const toggleHandled = async (id: string, current: boolean) => {
    await supabase.from('enquiries').update({ handled: !current }).eq('id', id);
    setEnquiries(enquiries.map(e => e.id === id ? { ...e, handled: !current } : e));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold font-heading">Enquiries</h1>
      
      <div className="bg-[var(--paper)] rounded-md border border-[var(--line)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--plaster)] text-[var(--slate)] text-sm border-b border-[var(--line)]">
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Service / Message</th>
              <th className="px-6 py-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-[var(--slate)]">No enquiries yet.</td></tr>
            ) : enquiries.map(e => (
              <tr key={e.id} className={\`border-b border-[var(--line)] last:border-0 \${e.handled ? 'opacity-60 bg-gray-50' : 'bg-white'}\`}>
                <td className="px-6 py-4 text-sm text-[var(--slate)] whitespace-nowrap">
                  {format(new Date(e.created_at), 'dd MMM yyyy, HH:mm')}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold">{e.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <a href={\`tel:\${e.phone}\`} className="text-[var(--blue)] text-sm flex items-center gap-1 hover:underline"><Phone className="w-3 h-3"/> {e.phone}</a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{e.service || 'General Enquiry'}</div>
                  <p className="text-sm text-[var(--slate)] mt-1 max-w-md truncate">{e.message}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleHandled(e.id, e.handled)}
                    className={\`px-3 py-1 text-xs font-medium border rounded-full flex items-center justify-center gap-1 ml-auto \${e.handled ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'}\`}
                  >
                    {e.handled ? <CheckCircle className="w-3 h-3" /> : null}
                    {e.handled ? 'Handled' : 'Mark Handled'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
