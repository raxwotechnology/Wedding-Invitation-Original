"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Edit2, Trash2, X, Loader2, AlertCircle, Link as LinkIcon } from "lucide-react";
import { useGuests } from "@/context/GuestContext";
import { useCouple } from "@/context/CoupleContext";
import type { Guest, GuestSide, NewGuestInput, RsvpStatus } from "@/types/guest";

// ─── Inner component (needs useSearchParams inside Suspense) ──────────────────

function GuestListInner() {
  const searchParams  = useSearchParams();
  const statusParam   = searchParams?.get("status") ?? "";
  const sideParam     = (searchParams?.get("side") ?? "") as GuestSide;

  // ── Shared store ────────────────────────────────────────────────────────────
  const { guests, tables, isLoading, error, addGuest, updateGuest, deleteGuest } = useGuests();
  const { couple } = useCouple();

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState<string>(() => statusParam || "All");
  const [searchTerm,   setSearchTerm]   = useState("");
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isSaving,     setIsSaving]     = useState(false);
  const [toast,        setToast]        = useState<string | null>(null);

  const [formData, setFormData] = useState<NewGuestInput>({
    name: "", title: "", phone: "", group: "Family", side: "", status: "Pending", table: "", partySize: 1,
  });

  // Sync tab with URL param
  useEffect(() => { setActiveTab(statusParam || "All"); }, [statusParam]);

  // Show context error as a toast
  useEffect(() => { if (error) showToast(error); }, [error]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // ── Derived counts (always computed from live data — never manually tracked) ─
  const getCounts = (list: typeof guests) => ({
    groups: list.length,
    people: list.reduce((sum, g) => sum + (g.partySize || 1), 0)
  });

  const counts = {
    All:       getCounts(guests),
    Confirmed: getCounts(guests.filter(g => g.status === "Confirmed")),
    Pending:   getCounts(guests.filter(g => g.status === "Pending")),
    Declined:  getCounts(guests.filter(g => g.status === "Declined")),
  };

  const tabs = [
    { label: "All",       ...counts.All },
    { label: "Confirmed", ...counts.Confirmed },
    { label: "Pending",   ...counts.Pending },
    { label: "Declined",  ...counts.Declined },
  ];

  // ── Filter pipeline ──────────────────────────────────────────────────────────
  const sideFiltered   = sideParam ? guests.filter(g => g.side === sideParam) : guests;
  const tabFiltered    = activeTab === "All" ? sideFiltered : sideFiltered.filter(g => g.status === activeTab);
  const filteredGuests = searchTerm
    ? tabFiltered.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : tabFiltered;

  // ── Style helpers ────────────────────────────────────────────────────────────
  const getStatusStyle = (status: RsvpStatus) => {
    switch (status) {
      case "Confirmed": return "text-[#10B981] border-[#10B981] bg-white";
      case "Pending":   return "text-[#F59E0B] border-[#F59E0B] bg-white";
      case "Declined":  return "text-[#F43F5E] border-[#F43F5E] bg-white";
    }
  };

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const handleOpenModal = (guest?: Guest) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({ name: guest.name, title: guest.title ?? "", phone: guest.phone, group: guest.group, side: guest.side ?? "", status: guest.status, table: guest.table || "", partySize: guest.partySize || 1 });
    } else {
      setEditingGuest(null);
      setFormData({ name: "", title: "", phone: "", group: "Family", side: sideParam, status: "Pending", table: "", partySize: 1 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setEditingGuest(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, formData);
      } else {
        await addGuest(formData);
      }
      handleCloseModal();
    } catch {
      showToast("Failed to save guest. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;
    await deleteGuest(id);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          <AlertCircle size={16} />
          {toast}
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">
            {sideParam === "A" ? `${couple.partnerA}'s Guests` : sideParam === "B" ? `${couple.partnerB}'s Guests` : "Guest List"}
          </h1>
          <p className="text-[#64748B] mt-2 text-[15px]">
            {sideParam === "A" ? `Manage ${couple.partnerA}'s guest list.` : sideParam === "B" ? `Manage ${couple.partnerB}'s guest list.` : "Manage all your wedding guests."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search guests..."
              className="w-64 pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-full text-[14px] text-gray-600 focus:outline-none focus:border-[#FA2B56] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#FA2B56] hover:bg-[#E02048] text-white px-6 py-3 rounded-full text-[14px] font-semibold tracking-wide flex items-center gap-2 shadow-[0_4px_14px_rgba(250,43,86,0.3)] transition-all"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Guest
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">

        {/* Tabs */}
        <div className="flex overflow-x-auto px-8 pt-4 gap-8">
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`pb-4 transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.label
                  ? "border-[#FA2B56] text-[#FA2B56]"
                  : "border-transparent text-[#64748B] hover:text-gray-700"
              }`}
            >
              <div className="text-[14px] font-medium">{tab.label} ({tab.groups})</div>
              <div className="text-[11px] opacity-70 mt-0.5">{tab.people} People</div>
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto pb-4 min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-t border-b border-gray-50">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">No. of Guests</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Group</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">RSVP Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Table</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[14px]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-2 text-[#FA2B56]" size={24} />
                    Loading guests...
                  </td>
                </tr>
              ) : filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-gray-400">
                    {guests.length === 0
                      ? "No guests yet — click \"Add Guest\" to get started!"
                      : "No guests match your search or filter."}
                  </td>
                </tr>
              ) : (
                filteredGuests.map(guest => (
                  <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 font-semibold text-[#1e293b]">{guest.title ? `${guest.title} ${guest.name}` : guest.name}</td>
                    <td className="px-8 py-6 text-[#64748B] font-medium">{guest.phone}</td>
                    <td className="px-8 py-6 text-[#64748B] font-medium font-mono bg-gray-50/30">{guest.partySize || 1}</td>
                    <td className="px-8 py-6 text-[#64748B] font-medium">{guest.group}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full border text-[12px] font-bold tracking-wide ${getStatusStyle(guest.status)}`}>
                        {guest.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[#64748B] font-medium">
                      {(() => {
                        if (!guest.table) return "—";
                        const t = tables.find(tb => tb.id === guest.table);
                        return t ? `Table ${t.number}${t.label ? ` — ${t.label}` : ""}` : "—";
                      })()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={async () => {
                            const nameWithTitle = guest.title ? `${guest.title} ${guest.name}` : guest.name;
                            const url = `${window.location.origin}/?to=${encodeURIComponent(nameWithTitle)}`;
                            try {
                              if (navigator.share) {
                                await navigator.share({
                                  title: "Wedding Invitation",
                                  text: `Here is your personalized wedding invitation!`,
                                  url: url
                                });
                                showToast("Shared successfully!");
                              } else if (navigator.clipboard && window.isSecureContext) {
                                await navigator.clipboard.writeText(url);
                                showToast("Invitation link copied!");
                              } else {
                                const textArea = document.createElement("textarea");
                                textArea.value = url;
                                textArea.style.position = "absolute";
                                textArea.style.left = "-999999px";
                                document.body.prepend(textArea);
                                textArea.select();
                                try {
                                  document.execCommand('copy');
                                  showToast("Invitation link copied!");
                                } catch (error) {
                                  console.error(error);
                                  showToast("Failed to copy link.");
                                } finally {
                                  textArea.remove();
                                }
                              }
                            } catch (e) {
                              if ((e as Error).name !== "AbortError") {
                                showToast("Failed to share link.");
                              }
                            }
                          }}
                          className="text-gray-400 hover:text-emerald-500 transition-colors p-1"
                          title="Copy personalized invitation link"
                        >
                          <LinkIcon size={18} />
                        </button>
                        <button onClick={() => handleOpenModal(guest)} className="text-gray-400 hover:text-[#FA2B56] transition-colors p-1" title="Edit Guest">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(guest.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete Guest">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border border-gray-100">

            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingGuest ? "Edit Guest" : "Add New Guest"}
              </h2>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-[#FA2B56] transition-colors border border-gray-100 shadow-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                  <select value={formData.title ?? ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors appearance-none">
                    <option value="">—</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Rev.">Rev.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Guest Name</label>
                  <input
                    type="text" required
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors"
                    placeholder="e.g. Amal Perera"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Number</label>
                  <input
                    type="text" required
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors"
                    placeholder="e.g. 077 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">No. of Guests</label>
                  <input
                    type="number" min="1" max="20" required
                    value={formData.partySize || 1} onChange={e => setFormData({ ...formData, partySize: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Group</label>
                  <select value={formData.group} onChange={e => setFormData({ ...formData, group: e.target.value })} className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors appearance-none">
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Side</label>
                  <select value={formData.side} onChange={e => setFormData({ ...formData, side: e.target.value as GuestSide })} className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors appearance-none">
                    <option value="">Both</option>
                    <option value="A">Partner A</option>
                    <option value="B">Partner B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as RsvpStatus })} className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors appearance-none">
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Assigned Table (Optional)</label>
                <select
                  value={formData.table}
                  onChange={e => setFormData({ ...formData, table: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors appearance-none"
                >
                  <option value="">— Unassigned —</option>
                  {tables.map(t => {
                    const occupied = guests
                      .filter(g => g.table === t.id && g.id !== (editingGuest?.id ?? "__none__"))
                      .reduce((sum, g) => sum + (g.partySize || 1), 0);
                    
                    const isFull   = occupied + (formData.partySize || 1) > t.capacity;
                    return (
                      <option key={t.id} value={t.id} disabled={isFull && formData.table !== t.id}>
                        {`Table ${t.number}${t.label ? ` — ${t.label}` : ""} (${occupied}/${t.capacity})${isFull && formData.table !== t.id ? " FULL" : ""}`}
                      </option>
                    );
                  })}
                </select>
                {tables.length === 0 && (
                  <p className="text-[11px] text-gray-400 mt-1.5">No tables yet — create tables on the Seating page first.</p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-3 rounded-xl text-gray-500 font-bold bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-sm" disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-3 rounded-xl text-white font-bold bg-[#FA2B56] hover:bg-[#E02048] shadow-md shadow-rose-200 transition-colors text-sm disabled:opacity-70 flex items-center justify-center gap-2">
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {editingGuest ? "Save Changes" : "Add Guest"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Public export wraps inner component in Suspense for useSearchParams ────────
export default function GuestList() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FA2B56]">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-400">Loading guests…</p>
        </div>
      }
    >
      <GuestListInner />
    </Suspense>
  );
}
