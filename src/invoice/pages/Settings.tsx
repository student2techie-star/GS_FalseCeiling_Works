import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, Download, Upload } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState<any>({});
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch profile
    const { data: profData } = await supabase.from('business_profile').select('*').eq('id', 1).single();
    if (profData) {
      setProfile(profData);
    } else {
      // Create default if not exists
      const { data: newProf } = await supabase.from('business_profile').insert([{ id: 1 }]).select().single();
      if (newProf) setProfile(newProf);
    }

    // Fetch templates
    const { data: tmplData } = await supabase.from('item_templates').select('*').order('name');
    if (tmplData) setTemplates(tmplData);
    
    setLoading(false);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      bank_details: {
        ...(profile.bank_details || {}),
        [name]: value
      }
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from('business_profile').update(profile).eq('id', 1);
    setSaving(false);
    alert('Profile saved!');
  };

  const addTemplate = async () => {
    const newTmpl = { name: 'New Item', unit: 'sq ft', default_rate: 0 };
    const { data } = await supabase.from('item_templates').insert([newTmpl]).select().single();
    if (data) setTemplates([...templates, data]);
  };

  const updateTemplate = async (id: string, field: string, value: any) => {
    const updated = templates.map(t => t.id === id ? { ...t, [field]: value } : t);
    setTemplates(updated);
    await supabase.from('item_templates').update({ [field]: value }).eq('id', id);
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    setTemplates(templates.filter(t => t.id !== id));
    await supabase.from('item_templates').delete().eq('id', id);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <h1 className="text-3xl font-bold font-heading">Settings</h1>
      
      {/* Business Profile */}
      <div className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Business Profile</h2>
          <button onClick={saveProfile} disabled={saving} className="bg-[var(--blue)] text-[var(--paper)] px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input type="text" name="name" value={profile.name || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea name="address" value={profile.address || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" name="contact" value={profile.contact || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" value={profile.email || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GSTIN</label>
              <input type="text" name="gstin" value={profile.gstin || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">UPI ID</label>
              <input type="text" name="upi_id" value={profile.upi_id || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2" />
            </div>
            
            <div className="p-4 bg-[var(--plaster)] rounded-md space-y-3">
              <h3 className="font-medium">Bank Details</h3>
              <input type="text" name="account_name" value={profile.bank_details?.account_name || ''} onChange={handleBankChange} placeholder="Account Name" className="w-full border rounded-md px-3 py-2 text-sm" />
              <input type="text" name="account_number" value={profile.bank_details?.account_number || ''} onChange={handleBankChange} placeholder="Account Number" className="w-full border rounded-md px-3 py-2 text-sm" />
              <input type="text" name="ifsc" value={profile.bank_details?.ifsc || ''} onChange={handleBankChange} placeholder="IFSC Code" className="w-full border rounded-md px-3 py-2 text-sm" />
              <input type="text" name="bank_name" value={profile.bank_details?.bank_name || ''} onChange={handleBankChange} placeholder="Bank Name" className="w-full border rounded-md px-3 py-2 text-sm" />
              <input type="text" name="branch" value={profile.bank_details?.branch || ''} onChange={handleBankChange} placeholder="Branch" className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Default Terms</label>
              <textarea name="terms" value={profile.terms || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2 text-sm" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Warranty Text</label>
              <textarea name="warranty" value={profile.warranty || ''} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2 text-sm" rows={2} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Tax Rate (%)</label>
              <input type="number" name="default_tax_rate" value={profile.default_tax_rate || 0} onChange={handleProfileChange} className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Item Templates */}
      <div className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Item Templates</h2>
          <button onClick={addTemplate} className="bg-[var(--plaster)] text-[var(--ink)] border border-[var(--line)] px-3 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-100">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
        
        <div className="space-y-3">
          {templates.map(tmpl => (
            <div key={tmpl.id} className="flex gap-3 items-center">
              <input 
                type="text" 
                value={tmpl.name} 
                onChange={(e) => updateTemplate(tmpl.id, 'name', e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                placeholder="Item name"
              />
              <input 
                type="text" 
                value={tmpl.unit} 
                onChange={(e) => updateTemplate(tmpl.id, 'unit', e.target.value)}
                className="w-24 border rounded-md px-3 py-2 text-sm"
                placeholder="Unit"
              />
              <input 
                type="number" 
                value={tmpl.default_rate} 
                onChange={(e) => updateTemplate(tmpl.id, 'default_rate', parseFloat(e.target.value) || 0)}
                className="w-32 border rounded-md px-3 py-2 text-sm"
                placeholder="Rate"
              />
              <button onClick={() => deleteTemplate(tmpl.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Backup and Restore */}
      <div className="bg-[var(--paper)] p-6 rounded-md border border-[var(--line)]">
        <h2 className="text-xl font-bold mb-4">Backup & Restore</h2>
        <p className="text-[var(--slate)] text-sm mb-6">
          Export your entire database to a JSON file. Keep this safe as Supabase free tier does not have automatic backups.
        </p>
        <div className="flex gap-4">
          <button onClick={() => alert('Export functionality to be connected to Supabase edge function or bulk fetch script.')} className="bg-[var(--ink)] text-[var(--paper)] px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export All Data
          </button>
          <button onClick={() => alert('Restore functionality to be implemented.')} className="bg-[var(--plaster)] border border-[var(--line)] text-[var(--ink)] px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-100">
            <Upload className="w-4 h-4" /> Restore from File
          </button>
        </div>
      </div>

    </div>
  );
}
