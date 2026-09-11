"use client";

export default function SiteColors() {
  const themes = [
    { name: "Blush", classes: "bg-pink-100 text-pink-900 border-pink-200" },
    { name: "Classic Gold", classes: "bg-[#D4AF37] text-white border-[#C5A017]" },
    { name: "Sage", classes: "bg-[#9CB39E] text-white border-[#8CA38E]" },
    { name: "Navy", classes: "bg-[#1B2B4C] text-white border-[#12203B]" },
    { name: "Lavender", classes: "bg-[#D8CBE3] text-[#4A3B56] border-[#C8BBD3]" }
  ];

  return (
    <section className="bg-white rounded-[40px] p-8 shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-8">
        <button className="text-gray-400">{"<"}</button>
        <h3 className="text-lg font-medium text-gray-800 mx-auto">Site Colors</h3>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-6">Theme presets</p>
        
        <div className="space-y-4">
          {themes.map((theme) => (
            <button 
              key={theme.name}
              className={`w-full py-4 rounded-full text-sm font-medium shadow-sm transition transform hover:-translate-y-0.5 border ${theme.classes}`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
