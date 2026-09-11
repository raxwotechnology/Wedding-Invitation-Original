"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Clock, Check, X, Sparkles } from "lucide-react";

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  desc: string;
}

const DEFAULT_AGENDA: AgendaItem[] = [
  { id: "1", time: "10:00 AM", title: "Guest Arrival & Welcome", desc: "Welcome drinks & greetings at Tranquil Banquet Hall" },
  { id: "2", time: "10:30 AM", title: "Poruwa Ceremony", desc: "Traditional auspicious customs & exchange of rings" },
  { id: "3", time: "12:00 PM", title: "Cake Cutting & Champagne Toast", desc: "Celebratory toast with family & friends" },
  { id: "4", time: "12:30 PM", title: "Grand Wedding Banquet", desc: "Exquisite lunch buffet, refreshments & speeches" },
  { id: "5", time: "02:00 PM", title: "Music & Photo Session", desc: "Live music, dancing & creating everlasting memories" },
  { id: "6", time: "03:30 PM", title: "Going Away & Farewell", desc: "Sending off the newlyweds with blessings and love" },
];

export default function AdminAgendaPage() {
  const [agenda, setAgenda] = useState<AgendaItem[]>(DEFAULT_AGENDA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ time: "", title: "", desc: "" });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_custom_agenda");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAgenda(parsed);
        }
      }
    } catch (_) {}
  }, []);

  const saveToStorage = (items: AgendaItem[]) => {
    setAgenda(items);
    try {
      localStorage.setItem("wedding_custom_agenda", JSON.stringify(items));
    } catch (_) {}
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (item?: AgendaItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ time: item.time, title: item.title, desc: item.desc });
    } else {
      setEditingId(null);
      setFormData({ time: "", title: "", desc: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time.trim() || !formData.title.trim()) return;

    if (editingId) {
      const updated = agenda.map(item => item.id === editingId ? { ...item, ...formData } : item);
      saveToStorage(updated);
      showToast("Agenda item updated successfully!");
    } else {
      const newItem: AgendaItem = {
        id: Date.now().toString(),
        time: formData.time,
        title: formData.title,
        desc: formData.desc,
      };
      saveToStorage([...agenda, newItem]);
      showToast("New agenda item added!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const filtered = agenda.filter(i => i.id !== id);
    saveToStorage(filtered);
    showToast("Event removed from agenda");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium animate-fade-in border border-gray-700">
          <Sparkles size={16} className="text-[#C9A060]" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1e293b] font-medium tracking-tight">
            Wedding Day Agenda &amp; Timeline
          </h1>
          <p className="text-[#64748B] mt-1.5 text-[15px]">
            Manage schedule of events displayed on the public Agenda page.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-bold shadow-md transition-all self-start sm:self-auto"
          style={{
            background: "linear-gradient(135deg, #9A7540, #C9A060)",
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Event
        </button>
      </div>

      {/* Timeline items list */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-gray-100">
        <div className="divide-y divide-gray-100">
          {agenda.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Clock size={36} className="mx-auto mb-3 opacity-40 text-[#C9A060]" />
              <p className="font-semibold text-gray-600">No agenda events added yet</p>
              <p className="text-sm mt-1">Click &quot;Add Event&quot; above to create the timeline.</p>
            </div>
          ) : (
            agenda.map((item, idx) => (
              <div
                key={item.id}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5"
                    style={{
                      background: "linear-gradient(135deg, rgba(201,160,96,0.15), rgba(232,200,122,0.1))",
                      color: "#9A7540",
                      border: "1px solid rgba(201,160,96,0.25)",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-[#1e293b] text-base">{item.title}</h3>
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(201,160,96,0.12)",
                          color: "#9A7540",
                          border: "1px solid rgba(201,160,96,0.2)",
                        }}
                      >
                        {item.time}
                      </span>
                    </div>
                    {item.desc && (
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 rounded-xl text-gray-400 hover:text-[#9A7540] hover:bg-amber-50 transition-colors"
                    title="Edit event"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? "Edit Event" : "Add New Event"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Time (e.g. 10:30 AM)
                </label>
                <input
                  type="text"
                  required
                  placeholder="10:30 AM"
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C9A060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Poruwa Ceremony"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C9A060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description / Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Traditional customs & blessings..."
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C9A060]"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-md"
                  style={{ background: "linear-gradient(135deg, #9A7540, #C9A060)" }}
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
