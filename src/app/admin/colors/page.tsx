"use client";

import { useState, useEffect } from "react";
import { Palette, CheckCircle2, Save } from "lucide-react";

export default function ColorsPage() {
  const [activeTheme, setActiveTheme] = useState("Blush Pink");
  const [customColor, setCustomColor] = useState("#FA2B56");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('wedding_theme_name');
      if (storedTheme) setActiveTheme(storedTheme);
      
      const storedColor = localStorage.getItem('wedding_theme_color');
      if (storedColor) setCustomColor(storedColor);
      
      setIsLoaded(true);
    }
  }, []);

  const themes = [
    { name: "Blush Pink", color: "#FA2B56", desc: "Classic & Romantic" },
    { name: "Elegant Gold", color: "#D4AF37", desc: "Luxurious & Warm" },
    { name: "Minimalist White", color: "#64748B", desc: "Clean & Modern" }, 
    { name: "Sage Green", color: "#8A9A5B", desc: "Natural & Earthy" },
    { name: "Royal Blue", color: "#2563EB", desc: "Deep & Regal" },
    { name: "Lavender", color: "#8B5CF6", desc: "Soft & Dreamy" },
    { name: "Terracotta", color: "#E17055", desc: "Rustic & Vibrant" },
    { name: "Custom Color", color: customColor, desc: "Your unique shade" },
  ];

  const handleSave = () => {
    setIsSaving(true);
    
    localStorage.setItem('wedding_theme_name', activeTheme);
    
    const selectedTheme = themes.find(t => t.name === activeTheme);
    if (selectedTheme) {
      localStorage.setItem('wedding_theme_color', selectedTheme.color);
    }
    
    // Dispatch events to update ThemeProvider globally
    window.dispatchEvent(new Event('theme-updated'));
    
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 600);
  };

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-20">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">
            Site Colors
          </h1>
          <p className="text-[#64748B] mt-2 text-[15px]">
            Customise the colour palette for your public wedding website.
          </p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`px-8 py-3 rounded-full text-[14px] font-semibold tracking-wide flex items-center gap-2 transition-all shadow-md
            ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-[#FA2B56] hover:bg-[#E02048] text-white'}
          `}
        >
          {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} strokeWidth={2.5} />}
          {isSaved ? "Theme Applied!" : isSaving ? "Applying..." : "Apply Theme"}
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shadow-sm">
            <Palette size={24} className="text-[#FA2B56]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b]">
              Colour Palette Studio
            </h2>
            <p className="text-[#64748B] text-[14px] leading-relaxed">
              Fine-tune every accent colour across your invitation, RSVP, and seating pages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {themes.map((theme) => {
            const isActive = activeTheme === theme.name;
            return (
              <div 
                key={theme.name}
                onClick={() => setActiveTheme(theme.name)}
                className={`cursor-pointer rounded-3xl p-3 transition-all duration-300 border-2 ${isActive ? 'scale-[1.02] bg-gray-50 shadow-md' : 'border-transparent hover:bg-gray-50 hover:shadow-sm'}`}
                style={isActive ? { borderColor: theme.color } : {}}
              >
                <div 
                  className="w-full aspect-[4/3] rounded-2xl mb-4 shadow-inner relative overflow-hidden group flex flex-col justify-end p-4" 
                  style={{ backgroundColor: theme.color }}
                >
                  {/* Custom color picker hidden overlay */}
                  {theme.name === "Custom Color" && (
                    <input 
                      type="color" 
                      value={customColor} 
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setActiveTheme("Custom Color");
                      }}
                      className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] cursor-pointer opacity-0"
                    />
                  )}
                  
                  {isActive && (
                    <div className="absolute top-3 right-3 bg-white text-gray-900 rounded-full p-1 shadow-sm">
                      <CheckCircle2 size={16} style={{ color: theme.color }} />
                    </div>
                  )}

                  {theme.name === "Custom Color" && !isActive && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <span className="bg-white px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-800">Pick Color</span>
                    </div>
                  )}
                </div>

                <div className="px-1 text-center">
                  <p className="font-bold text-[15px] text-gray-800">{theme.name}</p>
                  <p className="text-[12px] text-gray-500 mt-1">{theme.desc}</p>
                  
                  {theme.name === "Custom Color" && (
                    <p className="text-[11px] text-gray-400 mt-2 uppercase font-mono bg-gray-100 rounded-md py-1 mx-4">
                      {customColor}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 p-6 rounded-2xl border-2 border-rose-100 bg-rose-50/30">
            <h3 className="text-[14px] font-bold text-[#FA2B56] uppercase tracking-wider mb-2">Pro Tip</h3>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              Applying a new theme will instantly update the primary colors across all guest-facing pages, including buttons, accents, and highlights. The <strong>Blush Pink</strong> theme is the default fallback.
            </p>
        </div>

      </div>
    </div>
  );
}
