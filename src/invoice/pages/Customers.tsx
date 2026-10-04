import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Phone, BookOpen } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Quick form for new customer
  const [showAdd, setShowAdd] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    let q = supabase.from('customers').select('*').order('created_at', { ascending: false });
    
    if (search) {
      q = q.ilike('name', `%${search}%`);
    }
    
    const { data } = await q;
    if (data) setCustomers(data);
    setLoading(false);
  };

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name) return;
    
    const { data } = await supabase.from('customers').insert([newCust]).select('*').single();
    
    if (data) {
      setCustomers([data, ...customers]);
      setShowAdd(false);
      setNewCust({ name: '', phone: '', address: '' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-heading">Customers</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-[var(--blue)] text-[var(--paper)] px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--slate)]" />
          <input 
            type="text" 
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
            className="w-full pl-10 pr-4 py-2 border border-[var(--line)] rounded-md focus:outline-none focus:border-[var(--blue)]"
          />
        </div>
        <button onClick={fetchCustomers} className="px-4 py-2 bg-[var(--plaster)] border border-[var(--line)] rounded-md text-sm font-medium hover:bg-gray-100">
          Search
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addCustomer} className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)] grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required type="text" placeholder="Name *" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})} className="border rounded-md px-3 py-2 text-sm" />
          <input type="text" placeholder="Phone" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})} className="border rounded-md px-3 py-2 text-sm" />
          <div className="md:col-span-2">
            <textarea placeholder="Site Location" value={newCust.address} onChange={e => setNewCust({...newCust, address: e.target.value})} className="border rounded-md px-3 py-2 text-sm w-full" rows={2} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] rounded-md text-sm hover:bg-opacity-90">Save Customer</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-[var(--slate)]">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-[var(--line)] rounded-md bg-[var(--paper)]">
          <p className="text-[var(--slate)] mb-4">No customers found.</p>
          <button onClick={() => setShowAdd(true)} className="text-[var(--blue)] font-medium underline">Add your first customer</button>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map(cust => (
            <div key={cust.id} className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)]">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className="font-bold text-lg">{cust.name}</h3>
                    <Link to={`/admin/customers/${cust.id}`} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
                      <BookOpen className="w-3.5 h-3.5" /> View Ledger
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-[var(--slate)]">
                    {cust.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {cust.phone}</span>}
                  </div>
                  {cust.address && (
                    <div className="flex items-start gap-1 mt-2 text-sm text-[var(--slate)]">
                      <MapPin className="w-3 h-3 mt-1 shrink-0"/> {cust.address}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
