import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Search, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function Quotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    let q = supabase.from('quotations').select(`
      *,
      customers ( name ),
      sites ( project_name )
    `).order('created_at', { ascending: false });
    
    // Simple client-side filtering for now since ilike on joined tables requires different syntax
    const { data } = await q;
    if (data) {
      if (search) {
        setQuotes(data.filter(qt => 
          qt.number.toLowerCase().includes(search.toLowerCase()) || 
          qt.customers?.name?.toLowerCase().includes(search.toLowerCase())
        ));
      } else {
        setQuotes(data);
      }
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading">Quotations</h1>
        <button 
          onClick={() => navigate('/invoice/quotes/new')}
          className="bg-[var(--blue)] text-[var(--paper)] px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Quotation
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate)]" />
          <input 
            type="text" 
            placeholder="Search by quote number or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchQuotes()}
            className="w-full pl-10 pr-4 py-2 border border-[var(--line)] rounded-md focus:outline-none focus:border-[var(--blue)]"
          />
        </div>
        <button onClick={fetchQuotes} className="px-4 py-2 bg-[var(--plaster)] border border-[var(--line)] rounded-md text-sm font-medium hover:bg-gray-100">
          Search
        </button>
      </div>

      <div className="bg-[var(--paper)] rounded-md border border-[var(--line)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--plaster)] text-[var(--slate)] text-sm border-b border-[var(--line)]">
                <th className="px-6 py-4 font-medium">Quote #</th>
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
              ) : quotes.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-[var(--slate)]">No quotations found.</td></tr>
              ) : (
                quotes.map(qt => (
                  <tr key={qt.id} className="border-b border-[var(--line)] hover:bg-gray-50 last:border-0 transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--ink)]">
                      <Link to={`/invoice/quotes/${qt.id}`} className="hover:text-[var(--blue)] hover:underline">
                        {qt.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--slate)]">
                      {format(new Date(qt.date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm text-[var(--ink)]">{qt.customers?.name}</div>
                      <div className="text-xs text-[var(--slate)]">{qt.sites?.project_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium border rounded-full ${getStatusColor(qt.status)}`}>
                        {qt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums font-medium text-[var(--ink)]">
                      {/* Computed amount placeholder - typically computed server side or saved on write */}
                      -
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/invoice/quotes/${qt.id}`} className="text-[var(--blue)] text-sm font-medium hover:underline flex items-center justify-end gap-1">
                        <FileText className="w-4 h-4" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
