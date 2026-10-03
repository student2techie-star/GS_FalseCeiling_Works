import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, Phone, Mail, BookOpen } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Quick form for new customer
  const [showAdd, setShowAdd] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', address: '', gstin: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    let q = supabase.from('customers').select(`
      *,
      sites ( id, project_name, site_address )
    `).order('created_at', { ascending: false });
    
    if (search) {
      q = q.ilike('name', `%${search}%`);
    }
    
    const { data } = await q;
    if (data) setCustomers(data);
    setLoading(false);
  };

  const [addSiteToCust, setAddSiteToCust] = useState<string | null>(null);
  const [siteForm, setSiteForm] = useState({ name: '', address: '' });

  const addCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name) return;
    
    const { data } = await supabase.from('customers').insert([newCust]).select(`
      *,
      sites ( id, project_name, site_address )
    `).single();
    
    if (data) {
      setCustomers([data, ...customers]);
      setShowAdd(false);
      setNewCust({ name: '', phone: '', email: '', address: '', gstin: '' });
    }
  };

  const executeAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteForm.name || !addSiteToCust) return;
    
    const { data } = await supabase.from('sites').insert([{
      customer_id: addSiteToCust,
      project_name: siteForm.name,
      site_address: siteForm.address
    }]).select().single();
    
    if (data) {
      setCustomers(customers.map(c => 
        c.id === addSiteToCust ? { ...c, sites: [...(c.sites || []), data] } : c
      ));
    }
    setAddSiteToCust(null);
    setSiteForm({ name: '', address: '' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
          <input type="email" placeholder="Email" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})} className="border rounded-md px-3 py-2 text-sm" />
          <input type="text" placeholder="GSTIN" value={newCust.gstin} onChange={e => setNewCust({...newCust, gstin: e.target.value})} className="border rounded-md px-3 py-2 text-sm" />
          <div className="md:col-span-2">
            <textarea placeholder="Billing Address" value={newCust.address} onChange={e => setNewCust({...newCust, address: e.target.value})} className="border rounded-md px-3 py-2 text-sm w-full" rows={2} />
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
                    <Link to={`/invoice/customers/${cust.id}`} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
                      <BookOpen className="w-3.5 h-3.5" /> View Ledger
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-[var(--slate)]">
                    {cust.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {cust.phone}</span>}
                    {cust.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {cust.email}</span>}
                    {cust.gstin && <span>GSTIN: {cust.gstin}</span>}
                  </div>
                  {cust.address && (
                    <div className="flex items-start gap-1 mt-2 text-sm text-[var(--slate)]">
                      <MapPin className="w-3 h-3 mt-1 shrink-0"/> {cust.address}
                    </div>
                  )}
                </div>

                <div className="md:w-1/2 bg-[var(--plaster)] p-4 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-sm">Sites / Projects</h4>
                    <button onClick={() => setAddSiteToCust(cust.id)} className="text-[var(--blue)] text-xs font-medium hover:underline flex items-center gap-1">
                      <Plus className="w-3 h-3"/> Add Site
                    </button>
                  </div>
                  
                  {cust.sites && cust.sites.length > 0 ? (
                    <ul className="space-y-2">
                      {cust.sites.map((site: any) => (
                        <li key={site.id} className="text-sm border-b border-[var(--line)] last:border-0 pb-2 last:pb-0">
                          <span className="font-medium text-[var(--ink)] block">{site.project_name}</span>
                          {site.site_address && <span className="text-[var(--slate)] text-xs">{site.site_address}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[var(--slate)] italic">No sites added yet.</p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Site Modal */}
      {addSiteToCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setAddSiteToCust(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold font-heading text-[var(--ink)] mb-6">Add Site to Customer</h3>
            <form onSubmit={executeAddSite} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Project / Site Name *</label>
                <input 
                  type="text" required autoFocus
                  value={siteForm.name}
                  onChange={e => setSiteForm({...siteForm, name: e.target.value})}
                  className="w-full border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--blue)]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">Site Address</label>
                <input 
                  type="text" 
                  value={siteForm.address}
                  onChange={e => setSiteForm({...siteForm, address: e.target.value})}
                  className="w-full border border-[var(--line)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--blue)]"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setAddSiteToCust(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--line)] font-bold text-sm text-[var(--slate)] hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={!siteForm.name} className="flex-1 py-2.5 rounded-xl bg-[var(--blue)] text-white font-bold text-sm hover:bg-[var(--blue)]/90 disabled:opacity-50">
                  Add Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
