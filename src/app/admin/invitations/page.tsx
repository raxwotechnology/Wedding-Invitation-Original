"use client";

import { useState } from "react";
import { Plus, Eye, Send, X, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";

interface Template {
  id: number;
  name: string;
  category: string;
  image: string;
}

export default function InvitationTemplates() {
  const [templates, setTemplates] = useState<Template[]>([
    { id: 1, name: "Elegant Rose", category: "Classic", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Pink Blossom", category: "Floral", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Royal Gold", category: "Luxury", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80" },
  ]);

  // Modals state
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [sendTemplate, setSendTemplate] = useState<Template | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Fake state for "Send"
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Fake state for "Create"
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateCategory, setNewTemplateCategory] = useState("Modern");

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setSendTemplate(null);
      }, 2000);
    }, 1500);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTemplateName) {
      setTemplates([...templates, {
        id: Date.now(),
        name: newTemplateName,
        category: newTemplateCategory,
        image: "https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=400&q=80" // Placeholder beautiful image
      }]);
      setIsCreateModalOpen(false);
      setNewTemplateName("");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl relative">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">Invitations</h1>
          <p className="text-[#64748B] mt-2 text-[15px]">Manage and send your wedding invitations.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#FA2B56] hover:bg-[#E02048] text-white px-6 py-3 rounded-full text-[14px] font-semibold tracking-wide flex items-center gap-2 shadow-[0_4px_14px_rgba(250,43,86,0.3)] transition-all"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create New
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden group flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-gray-700 uppercase shadow-sm">
                  {template.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-[#1e293b] mb-6 flex-1">{template.name}</h3>
              <div className="flex items-center gap-3 mt-auto">
                <button 
                  onClick={() => setPreviewTemplate(template)}
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> Preview
                </button>
                <button 
                  onClick={() => setSendTemplate(template)}
                  className="flex-1 bg-[#FA2B56] hover:bg-[#E02048] text-white py-2.5 rounded-xl text-[13px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-200 hover:shadow-rose-300"
                >
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[24px] w-full max-w-4xl h-[80vh] shadow-2xl overflow-hidden animate-fade-in border border-gray-100 flex flex-col relative">
            <button 
              onClick={() => setPreviewTemplate(null)} 
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-white transition-all shadow-md z-10"
            >
              <X size={20} />
            </button>
            <div className="flex-1 w-full bg-gray-100 relative">
               {/* We simulate showing the actual invitation landing page inside an iframe */}
               <iframe src="/" className="w-full h-full border-none" title="Preview" />
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center px-8">
              <div>
                <p className="text-sm font-bold text-gray-800">Previewing: {previewTemplate.name}</p>
                <p className="text-xs text-gray-500">This is how guests will see your invitation on mobile.</p>
              </div>
              <button onClick={() => { setPreviewTemplate(null); setSendTemplate(previewTemplate); }} className="bg-[#FA2B56] hover:bg-[#E02048] text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-md">
                Looks Good, Send It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {sendTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Send Invitation</h2>
              <button onClick={() => setSendTemplate(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {isSent ? (
               <div className="p-10 flex flex-col items-center justify-center text-center animate-fade-in h-64">
                 <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                   <CheckCircle2 size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800 mb-2">Invitations Sent!</h3>
                 <p className="text-gray-500 text-sm">Successfully emailed to all selected guests.</p>
               </div>
            ) : (
              <div className="p-6">
                <div className="flex gap-4 mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 items-center">
                  <img src={sendTemplate.image} alt="template" className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-gray-800">{sendTemplate.name}</p>
                    <p className="text-xs text-gray-500">{sendTemplate.category} Template</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-[#FA2B56] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">All Pending Guests</p>
                        <p className="text-xs text-gray-500">Send to 42 guests</p>
                      </div>
                    </div>
                    <input type="radio" name="sendTo" className="w-5 h-5 accent-[#FA2B56]" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-[#FA2B56] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">All Guests</p>
                        <p className="text-xs text-gray-500">Send to 250 guests</p>
                      </div>
                    </div>
                    <input type="radio" name="sendTo" className="w-5 h-5 accent-[#FA2B56]" />
                  </label>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setSendTemplate(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSend} disabled={isSending} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FA2B56] hover:bg-[#E02048] shadow-md shadow-rose-200 transition-colors flex justify-center items-center">
                    {isSending ? "Sending..." : "Send Now"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Create New Template</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Template Name</label>
                <input 
                  type="text" required
                  value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors"
                  placeholder="e.g. Minimalist White"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={newTemplateCategory} onChange={(e) => setNewTemplateCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors appearance-none"
                >
                  <option value="Modern">Modern</option>
                  <option value="Classic">Classic</option>
                  <option value="Floral">Floral</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-[#FA2B56] hover:bg-[#E02048] shadow-md shadow-rose-200 transition-colors text-sm">
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
