import React, { useState } from "react";
import {
  CustomerContactEntity,
  CrmLeadEntity,
} from "../../../types/crm";
import { CrmService } from "../../../services/crmService";
import {
  Users,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  MapPin,
  Building,
  Star,
  Search,
  ExternalLink,
} from "lucide-react";

interface CustomerContactsViewProps {
  contacts: CustomerContactEntity[];
  leads: CrmLeadEntity[];
  onRefresh: () => void;
}

export const CustomerContactsView: React.FC<CustomerContactsViewProps> = ({
  contacts,
  leads,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("all");
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    customer_id: string;
    full_name: string;
    phone: string;
    email: string;
    designation_or_relation: string;
    channel_preference: CustomerContactEntity["channel_preference"];
    is_primary: boolean;
    city: string;
    state: string;
    verified: boolean;
  }>({
    customer_id: leads[0]?.customer_id || "CUST-5001",
    full_name: "",
    phone: "+91 ",
    email: "",
    designation_or_relation: "Co-traveler",
    channel_preference: "WhatsApp",
    is_primary: false,
    city: "Mumbai",
    state: "Maharashtra",
    verified: true,
  });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      alert("Name and phone are required.");
      return;
    }

    CrmService.addContact(formData);
    setIsAddContactModalOpen(false);
    onRefresh();
    setFormData({
      customer_id: leads[0]?.customer_id || "CUST-5001",
      full_name: "",
      phone: "+91 ",
      email: "",
      designation_or_relation: "Co-traveler",
      channel_preference: "WhatsApp",
      is_primary: false,
      city: "Mumbai",
      state: "Maharashtra",
      verified: true,
    });
  };

  const handleDeleteContact = (contact_id: string) => {
    if (window.confirm("Remove this contact from customer address book?")) {
      CrmService.deleteContact(contact_id);
      onRefresh();
    }
  };

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.designation_or_relation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCust = selectedCustomerId === "all" || c.customer_id === selectedCustomerId;

    return matchSearch && matchCust;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Entity Hierarchy Breadcrumb */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1">
            <span>CRM</span>
            <span>&gt;</span>
            <span className="text-white font-bold">customer_contacts</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Customer Contact Directory &amp; Travel Co-passengers</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30">
              {contacts.length} Registered Contacts
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Primary travelers, co-passengers, corporate travel desk coordinators, and billing POCs
          </p>
        </div>

        <button
          onClick={() => setIsAddContactModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Contact</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            placeholder="Search by full_name, phone, email, contact_id, customer_id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All customer_ids</option>
            {Array.from(new Set(contacts.map((c) => c.customer_id))).map((cid) => (
              <option key={cid} value={cid}>
                {cid}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((contact) => {
          const leadMatch = leads.find((l) => l.customer_id === contact.customer_id);

          return (
            <div
              key={contact.contact_id}
              className={`p-4 rounded-2xl bg-slate-950 border transition-all flex flex-col justify-between ${
                contact.is_primary
                  ? "border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-950 shadow-md shadow-cyan-950/20"
                  : "border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{contact.full_name}</span>
                      {contact.is_primary && (
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-[9px] font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-cyan-400" />
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {contact.designation_or_relation}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteContact(contact.contact_id)}
                    className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 font-mono text-cyan-300">
                    {contact.customer_id}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-400">
                    {contact.contact_id}
                  </span>
                  {leadMatch && (
                    <span className="text-slate-400 truncate max-w-[120px]">
                      {leadMatch.destination}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>
                      {contact.city}
                      {contact.state ? `, ${contact.state}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-500">
                  Pref: <strong className="text-slate-300">{contact.channel_preference}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all"
                    title="Open WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-all"
                    title="Dial Phone"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 transition-all"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Contact Modal */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span>Add Customer Contact</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Register co-passengers and emergency contacts
                </p>
              </div>
              <button
                onClick={() => setIsAddContactModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Associate with Customer *</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.customer_id} value={l.customer_id}>
                      {l.customer_id} — {l.customer_name} ({l.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Contact Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Relation / Role *</label>
                  <input
                    type="text"
                    required
                    value={formData.designation_or_relation}
                    onChange={(e) => setFormData({ ...formData, designation_or_relation: e.target.value })}
                    placeholder="e.g. Spouse / Emergency POC"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Preferred Channel</label>
                  <select
                    value={formData.channel_preference}
                    onChange={(e) => setFormData({ ...formData, channel_preference: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">Set as Primary Contact</div>
                  <div className="text-[10px] text-slate-400">Default recipient for booking tickets &amp; notifications</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_primary}
                  onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/30"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
