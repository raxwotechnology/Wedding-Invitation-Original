"use client";

import { useState, useMemo } from "react";
import { Plus, Users, Edit2, X, Trash2, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useGuests } from "@/context/GuestContext";
import type { Table } from "@/types/guest";

export default function SeatingArrangement() {
  // ── Shared store ─────────────────────────────────────────────────────────────
  const {
    guests, tables, isLoading, error,
    addTable, updateTable, deleteTable, assignGuestToTable,
  } = useGuests();

  // ── Local UI state ────────────────────────────────────────────────────────────
  const [activeTableId,    setActiveTableId]    = useState<string | null>(null);
  const [isAddTableOpen,   setIsAddTableOpen]   = useState(false);
  const [isEditTableOpen,  setIsEditTableOpen]  = useState(false);
  const [isAssignOpen,     setIsAssignOpen]      = useState(false);

  const [formLabel,    setFormLabel]    = useState("");
  const [formCapacity, setFormCapacity] = useState(8);
  const [assignGuestId, setAssignGuestId] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // ── Derived data (always live — never stored separately) ───────────────────
  const activeTable = tables.find(t => t.id === activeTableId) ?? tables[0] ?? null;

  // Count of guests assigned to each table — computed from guests array
  const occupancy = useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of guests) {
      if (g.table) map[g.table] = (map[g.table] ?? 0) + (g.partySize || 1);
    }
    return map;
  }, [guests]);

  // Guests assigned to the active table
  const activeTableGuests = useMemo(
    () => activeTable ? guests.filter(g => g.table === activeTable.id) : [],
    [guests, activeTable]
  );

  // Unassigned guests — available to be added to a table
  // If a guest's table ID is no longer in the tables array (e.g. table deleted offline), consider them unassigned.
  const unassignedGuests = useMemo(
    () => guests.filter(g => !g.table || !tables.some(t => t.id === g.table)),
    [guests, tables]
  );

  // ── Show context error as toast ────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  // When error changes (e.g. capacity block), show it
  const prevError = useState<string | null>(null);
  if (error && error !== prevError[0]) {
    prevError[1](error);
    showToast(error);
  }

  // ── Table CRUD ────────────────────────────────────────────────────────────
  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    addTable({ number: tables.length + 1, label: formLabel, capacity: formCapacity });
    setIsAddTableOpen(false);
    setFormLabel("");
    setFormCapacity(8);
  };

  const openEdit = (table: Table) => {
    setFormLabel(table.label);
    setFormCapacity(table.capacity);
    setIsEditTableOpen(true);
  };

  const handleEditTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTable) return;
    const used = occupancy[activeTable.id] ?? 0;
    if (formCapacity < used) {
      showToast(`Capacity can't be less than current guests (${used}). Remove guests first.`);
      return;
    }
    updateTable(activeTable.id, { label: formLabel, capacity: formCapacity });
    setIsEditTableOpen(false);
  };

  const handleDeleteTable = async () => {
    if (!activeTable) return;
    const used = occupancy[activeTable.id] ?? 0;
    const msg = used > 0
      ? `Delete Table ${activeTable.number}? All ${used} assigned guest(s) will be unassigned.`
      : `Delete Table ${activeTable.number}?`;
    if (!confirm(msg)) return;
    setIsEditTableOpen(false);
    await deleteTable(activeTable.id);
    setActiveTableId(tables.find(t => t.id !== activeTable.id)?.id ?? null);
  };

  // ── Guest assignment ──────────────────────────────────────────────────────
  const openAssign = () => {
    setAssignGuestId(unassignedGuests[0]?.id ?? "");
    setIsAssignOpen(true);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTable || !assignGuestId) return;
    setIsAssignOpen(false);
    await assignGuestToTable(assignGuestId, activeTable.id);
  };

  const handleUnassign = async (guestId: string) => {
    await assignGuestToTable(guestId, "");
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in max-w-sm">
          <AlertCircle size={16} className="shrink-0" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">Seating Arrangement</h1>
          <p className="text-[#64748B] mt-2 text-[15px]">
            Select a table to manage its guests.
            {unassignedGuests.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-bold uppercase tracking-wider">
                {unassignedGuests.length} unassigned
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setIsAddTableOpen(true)}
          className="bg-[#FA2B56] hover:bg-[#E02048] text-white px-6 py-3 rounded-full text-[14px] font-semibold tracking-wide flex items-center gap-2 shadow-[0_4px_14px_rgba(250,43,86,0.3)] transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add Table
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px] text-gray-400">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-2 text-[#FA2B56]" size={28} />
            <p className="text-sm font-medium">Loading…</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Canvas ─────────────────────────────────────────────────────── */}
          <div className="flex-1 bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 p-10 min-h-[500px] flex items-center justify-center flex-wrap gap-12 relative overflow-hidden">

            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(#FA2B56 2px, transparent 2px)", backgroundSize: "30px 30px" }}
            />

            {tables.length === 0 ? (
              <div className="text-center text-gray-400 z-10">
                <p className="text-lg font-medium mb-1">No tables yet</p>
                <p className="text-sm">Click "Add Table" to create your first table.</p>
              </div>
            ) : tables.map(table => {
              const used     = occupancy[table.id] ?? 0;
              const isFull   = used >= table.capacity;
              const isActive = table.id === activeTableId || (activeTableId === null && table.id === tables[0]?.id);

              return (
                <div
                  key={table.id}
                  onClick={() => setActiveTableId(table.id)}
                  className={`relative z-10 w-48 h-48 rounded-full border-[6px] transition-all cursor-pointer shadow-xl flex flex-col items-center justify-center group
                    ${isActive
                      ? "border-rose-200 bg-rose-50/50 shadow-rose-200 scale-105"
                      : "border-[#FFF0F2] bg-white shadow-rose-100/50 hover:border-rose-100"
                    }`}
                >
                  <span className="text-3xl font-bold text-[#1E293B]">{table.number}</span>
                  {table.label && (
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{table.label}</span>
                  )}
                  <span className={`text-[11px] font-bold uppercase tracking-wider mt-1.5 ${isFull ? "text-emerald-500" : "text-[#FA2B56]"}`}>
                    {used}/{table.capacity}
                  </span>

                  {/* Seat dots */}
                  {Array.from({ length: table.capacity }).map((_, i) => {
                    const angle  = (i * 360) / table.capacity;
                    const radius = 106;
                    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
                    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
                    return (
                      <div
                        key={i}
                        className={`absolute w-4 h-4 rounded-full shadow-sm transition-colors ${i < used ? "bg-[#FA2B56]" : "bg-gray-200"}`}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* ── Detail Panel ────────────────────────────────────────────────── */}
          {activeTable && (
            <div className="w-full lg:w-[380px] bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 p-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[18px] font-bold text-[#1e293b]">Table {activeTable.number} Details</h3>
                  {activeTable.label && <p className="text-[13px] text-gray-500 font-medium">{activeTable.label}</p>}
                </div>
                <button
                  onClick={() => openEdit(activeTable)}
                  className="text-gray-400 hover:text-[#FA2B56] transition-colors p-2 bg-gray-50 rounded-full hover:bg-rose-50"
                >
                  <Edit2 size={16} />
                </button>
              </div>

              {/* Capacity bar */}
              <div className="flex items-center justify-between p-4 bg-[#FFF5F7] rounded-xl border border-rose-100 mb-6">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-[#FA2B56]" />
                  <span className="font-semibold text-rose-900">Capacity</span>
                </div>
                <span className={`font-bold ${(occupancy[activeTable.id] ?? 0) >= activeTable.capacity ? "text-emerald-500" : "text-[#FA2B56]"}`}>
                  {occupancy[activeTable.id] ?? 0} / {activeTable.capacity}
                </span>
              </div>

              {/* Assigned guests — derived live from guests array */}
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Assigned Guests</p>
                  {(occupancy[activeTable.id] ?? 0) < activeTable.capacity && unassignedGuests.length > 0 && (
                    <button
                      onClick={openAssign}
                      className="text-[11px] font-bold text-[#FA2B56] uppercase tracking-wider hover:underline"
                    >
                      + Assign Guest
                    </button>
                  )}
                </div>

                <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2">
                  {activeTableGuests.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4 border border-dashed rounded-xl border-gray-200">
                      {unassignedGuests.length === 0 && guests.length === 0
                        ? "No guests added yet."
                        : "No guests assigned to this table."}
                    </p>
                  ) : activeTableGuests.map(guest => (
                    <div key={guest.id} className="flex items-center justify-between p-3.5 border border-gray-100 rounded-xl hover:border-rose-100 hover:bg-rose-50/30 transition-colors group">
                      <div>
                        <span className="text-[14px] font-semibold text-gray-700">{guest.name}</span>
                        <span className="ml-2 text-[11px] text-gray-400 font-medium">{guest.group}</span>
                      </div>
                      <button
                        onClick={() => handleUnassign(guest.id)}
                        title="Unassign from table"
                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 bg-white rounded-md shadow-sm"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Unassigned guests section */}
                {unassignedGuests.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-2">
                      {unassignedGuests.length} Unassigned Guest{unassignedGuests.length !== 1 ? "s" : ""}
                    </p>
                    <div className="max-h-[160px] overflow-y-auto space-y-2">
                      {unassignedGuests.map(guest => (
                    <div key={guest.id} className="flex items-center justify-between p-3 border border-amber-100 bg-amber-50/30 rounded-xl">
                          <span className="text-[13px] font-semibold text-gray-700">
                            {guest.title ? `${guest.title} ${guest.name}` : guest.name}
                          </span>
                          {(occupancy[activeTable.id] ?? 0) < activeTable.capacity && (
                            <button
                              onClick={() => assignGuestToTable(guest.id, activeTable.id)}
                              title={`Assign to Table ${activeTable.number}`}
                              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors shrink-0 ml-2"
                            >
                              + Assign here
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Add Table Modal ──────────────────────────────────────────────────── */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-fade-in border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Add New Table</h2>
              <button onClick={() => setIsAddTableOpen(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-[#FA2B56] transition-colors border border-gray-100 shadow-sm"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddTable} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Label (Optional)</label>
                <input type="text" value={formLabel} onChange={e => setFormLabel(e.target.value)} placeholder="e.g. VIP Family" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Capacity</label>
                <input type="number" min={2} max={16} required value={formCapacity} onChange={e => setFormCapacity(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-[#FA2B56] hover:bg-[#E02048] shadow-md shadow-rose-200 transition-colors text-sm">Create Table</button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Table Modal ─────────────────────────────────────────────────── */}
      {isEditTableOpen && activeTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-fade-in border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Edit Table {activeTable.number}</h2>
              <button onClick={() => setIsEditTableOpen(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-[#FA2B56] transition-colors border border-gray-100 shadow-sm"><X size={16} /></button>
            </div>
            <form onSubmit={handleEditTable} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Label</label>
                <input type="text" value={formLabel} onChange={e => setFormLabel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Capacity</label>
                <input type="number" min={occupancy[activeTable.id] ?? 1} max={16} required value={formCapacity} onChange={e => setFormCapacity(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                <p className="text-[11px] text-gray-400 mt-1.5">Min {occupancy[activeTable.id] ?? 0} (currently assigned).</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleDeleteTable} className="flex-none px-4 py-3 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center">
                  <Trash2 size={18} />
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FA2B56] hover:bg-[#E02048] shadow-md shadow-rose-200 transition-colors text-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Guest Modal ───────────────────────────────────────────────── */}
      {isAssignOpen && activeTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-fade-in border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Assign to Table {activeTable.number}</h2>
              <button onClick={() => setIsAssignOpen(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-[#FA2B56] transition-colors border border-gray-100 shadow-sm"><X size={16} /></button>
            </div>
            <form onSubmit={handleAssign} className="p-6 space-y-5">
              {unassignedGuests.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">All guests are already assigned to tables.</p>
              ) : (
                <>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Guest</label>
                    <select
                      value={assignGuestId}
                      onChange={e => setAssignGuestId(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors appearance-none"
                    >
                      <option value="">— Choose a guest —</option>
                      {unassignedGuests.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({g.group})</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl font-bold text-white bg-[#FA2B56] hover:bg-[#E02048] shadow-md shadow-rose-200 transition-colors text-sm flex justify-center items-center gap-2">
                    <CheckCircle2 size={16} /> Assign to Table {activeTable.number}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
