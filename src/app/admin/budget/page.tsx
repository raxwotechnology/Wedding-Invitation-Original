"use client";

import { useState, useEffect } from "react";
import { Calculator, Plus, Trash2, DollarSign, PieChart, CheckCircle2, Circle, Pencil, Save, X } from "lucide-react";

type Expense = {
  id: string;
  name: string;
  category: string;
  amount: number;
  isPaid: boolean;
};

export default function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState<number>(1000000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // New expense form
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Catering");
  const [newAmount, setNewAmount] = useState<string>("");

  // Edit expense state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedBudget = localStorage.getItem("wedding_total_budget");
        if (storedBudget) setTotalBudget(Number(storedBudget));

        const storedExpenses = localStorage.getItem("wedding_expenses");
        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      } catch (e) {}
      setIsLoaded(true);
    }
  }, []);

  const saveBudget = (val: number) => {
    setTotalBudget(val);
    localStorage.setItem("wedding_total_budget", val.toString());
  };

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem("wedding_expenses", JSON.stringify(newExpenses));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      category: newCategory,
      amount: Number(newAmount),
      isPaid: false,
    };

    saveExpenses([...expenses, newExpense]);
    setNewName("");
    setNewAmount("");
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditCategory(expense.category);
    setEditAmount(expense.amount.toString());
  };

  const saveEdit = (id: string) => {
    const updated = expenses.map(e => 
      e.id === id ? { ...e, name: editName, category: editCategory, amount: Number(editAmount) } : e
    );
    saveExpenses(updated);
    setEditingId(null);
  };

  const togglePaid = (id: string) => {
    const updated = expenses.map(e => e.id === id ? { ...e, isPaid: !e.isPaid } : e);
    saveExpenses(updated);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    saveExpenses(updated);
  };

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = expenses.filter(e => e.isPaid).reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(amount);
  };

  const categories = ["Catering", "Venue", "Attire", "Photography", "Decoration", "Entertainment", "Other"];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-20">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">
          Budget Tracker
        </h1>
        <p className="text-[#64748B] mt-2 text-[15px]">
          Manage your wedding expenses, track payments, and stay on budget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Summary & Add Expense */}
        <div className="space-y-6">
          
          {/* Summary Card */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Total Estimated Budget</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold text-lg">LKR</span>
                <input 
                  type="number" 
                  value={totalBudget} 
                  onChange={(e) => saveBudget(Number(e.target.value))}
                  className="text-3xl font-bold text-gray-900 bg-transparent outline-none border-b border-dashed border-gray-300 focus:border-[#FA2B56] w-full transition-colors pb-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-gray-500 font-medium">Budget Used</span>
                  <span className="font-bold text-gray-900">{percentSpent.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${percentSpent > 90 ? 'bg-red-500' : 'bg-[#FA2B56]'}`}
                    style={{ width: `${percentSpent}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Spent</p>
                  <p className="font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Remaining</p>
                  <p className={`font-bold ${remaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>
              <div className="pt-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid So Far</p>
                  <p className="font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>

          {/* Add Expense Form */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-[#FA2B56]" /> Add New Expense
            </h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-gray-500 mb-1">Expense Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Floral Decorations"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 mb-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-500 mb-1">Estimated Amount (LKR)</label>
                <input 
                  type="number" 
                  required
                  placeholder="25000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-[#FA2B56] hover:bg-[#E02048] text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                Add to Budget
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Expense List */}
        <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <PieChart size={20} className="text-[#FA2B56]" /> Expense Breakdown
            </h2>
            <span className="bg-rose-50 text-[#FA2B56] text-[12px] font-bold px-3 py-1 rounded-full">
              {expenses.length} Items
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <DollarSign size={24} className="text-gray-300" />
              </div>
              <h3 className="text-gray-500 font-medium">No expenses added yet</h3>
              <p className="text-sm text-gray-400 mt-1">Add your first expense using the form to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => {
                const isEditing = editingId === expense.id;

                if (isEditing) {
                  return (
                    <div key={expense.id} className="p-4 rounded-2xl border border-[#FA2B56] bg-rose-50 shadow-sm space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Expense Name</label>
                          <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-sm focus:outline-none focus:border-[#FA2B56]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Category</label>
                          <select 
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-sm focus:outline-none focus:border-[#FA2B56]"
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Amount (LKR)</label>
                          <input 
                            type="number" 
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-sm focus:outline-none focus:border-[#FA2B56]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-xl flex items-center gap-1"
                        >
                          <X size={14} /> Cancel
                        </button>
                        <button 
                          onClick={() => saveEdit(expense.id)}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#FA2B56] hover:bg-[#E02048] rounded-xl flex items-center gap-1 shadow-sm"
                        >
                          <Save size={14} /> Save Changes
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-rose-100 hover:shadow-sm transition-all group bg-white">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button 
                        onClick={() => togglePaid(expense.id)}
                        className={`shrink-0 transition-colors ${expense.isPaid ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-400'}`}
                        title={expense.isPaid ? "Mark as unpaid" : "Mark as paid"}
                      >
                        {expense.isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                      <div className="truncate">
                        <p className={`font-bold text-[15px] truncate ${expense.isPaid ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {expense.name}
                        </p>
                        <p className="text-[12px] text-gray-400 font-medium mt-0.5">{expense.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 pl-4">
                      <div className="text-right">
                        <p className={`font-bold ${expense.isPaid ? 'text-gray-400' : 'text-gray-900'}`}>
                          {formatCurrency(expense.amount)}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                          {expense.isPaid ? <span className="text-emerald-500">Paid</span> : <span className="text-amber-500">Pending</span>}
                        </p>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(expense)}
                          className="p-2 text-gray-400 hover:text-[#FA2B56] hover:bg-rose-50 rounded-xl transition-colors"
                          title="Edit expense"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
