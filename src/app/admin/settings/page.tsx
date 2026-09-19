"use client";

import { useState, useRef } from "react";
import { Save, User, Palette, Lock, Camera, CheckCircle2 } from "lucide-react";
import { useCouple } from "@/context/CoupleContext";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Shared couple-names context — updating this live-syncs the sidebar
  const { setCouple } = useCouple();

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverPhotoName, setCoverPhotoName] = useState("");

  // Password State
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wedding_settings');
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return {
      partnerOne: "Rashmi",
      partnerTwo: "Rashin",
      date: "2026-09-21",
      venue: "Wasala Banquets & Nature Resort",
      email: "rashin.rashmi@wedding.com",
      bgUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
      bgBlur: 4,
      bgOpacity: 100,
      coverUrl: "/wedding-photos/photo-32.jpg",
      detailsBgUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
      detailsBgBlur: 5,
      detailsBgOpacity: 100,
      detailsHeroUrl: "/wedding-photos/photo-32.jpg",
      cardBgUrl: "",
      cardBgBlur: 0,
      cardBgOpacity: 40
    };
  });

  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wedding_theme_name') || "Blush Pink";
    }
    return "Blush Pink";
  });
  
  const [customColor, setCustomColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wedding_theme_color') || "#FA2B56";
    }
    return "#FA2B56";
  });

  const themes = [
    { name: "Blush Pink", color: "#FA2B56" },
    { name: "Elegant Gold", color: "#D4AF37" },
    { name: "Minimalist White", color: "#64748B" }, 
    { name: "Sage Green", color: "#8A9A5B" },
    { name: "Royal Blue", color: "#2563EB" },
    { name: "Lavender", color: "#8B5CF6" },
    { name: "Terracotta", color: "#E17055" },
    { name: "Custom Color", color: customColor },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Persist all settings to localStorage
    localStorage.setItem('wedding_settings', JSON.stringify(profile));
    localStorage.setItem('wedding_theme_name', activeTheme);
    
    const selectedTheme = themes.find(t => t.name === activeTheme);
    if (selectedTheme) {
      localStorage.setItem('wedding_theme_color', selectedTheme.color);
    }
    
    // Push updated names into shared context — immediately re-renders the
    // sidebar header and both guest menu labels with no page reload required.
    setCouple({
      partnerA: profile.partnerOne,
      partnerB: profile.partnerTwo,
    });

    // Dispatch events to update ThemeProvider and the live countdown.
    window.dispatchEvent(new Event('theme-updated'));
    window.dispatchEvent(new Event('settings-updated'));
    
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Smaller for cover photo
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setProfile({...profile, coverUrl: compressedBase64});
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = () => {
    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordUpdated(true);
      setTimeout(() => setPasswordUpdated(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">Settings</h1>
          <p className="text-[#64748B] mt-2 text-[15px]">Manage your wedding details and platform preferences.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving || isSaved}
            className={`px-6 py-3 rounded-full text-[14px] font-semibold tracking-wide flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(250,43,86,0.2)]
              ${isSaved ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-[#FA2B56] hover:bg-[#E02048] text-white'}
            `}
          >
            {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} strokeWidth={2.5} />}
            {isSaved ? "Saved!" : isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 p-4">
          <div className="space-y-1">
            {[
              { name: "Profile", icon: User },
              { name: "Theme", icon: Palette },
              { name: "Security", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-bold transition-all ${
                    activeTab === tab.name 
                      ? "bg-rose-50 text-[#FA2B56]" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content area */}
        <div className="flex-1 bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 p-8 min-h-[500px]">
          
          {activeTab === "Profile" && (
            <div className="animate-fade-in max-w-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Couple Profile</h2>
              
              <div className="flex flex-col sm:flex-row gap-8 mb-8">
                {/* Landing Page Cover */}
                <div className="flex items-center gap-6">
                  <input type="file" id="coverUpload" onChange={handleFileChange} className="hidden" accept="image/*" />
                  <div 
                    onClick={() => document.getElementById('coverUpload')?.click()}
                    className="w-24 h-24 rounded-full bg-rose-50 border-2 border-dashed border-rose-200 flex flex-col items-center justify-center text-rose-400 cursor-pointer hover:bg-rose-100 transition-colors shrink-0 overflow-hidden relative"
                  >
                    {profile.coverUrl ? (
                      <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera size={24} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-[15px]">Landing Page Cover</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-[180px]">Appears as a small circle above your names on the first page.</p>
                    {profile.coverUrl && (
                      <button onClick={() => setProfile({...profile, coverUrl: ""})} className="text-[11px] text-rose-500 font-bold uppercase tracking-wider mt-2 hover:underline">
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Page Hero */}
                <div className="flex items-center gap-6">
                  <input 
                    type="file" 
                    id="heroUpload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const img = new Image();
                          img.src = reader.result as string;
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 1000; // slightly larger for main photo
                            const scaleSize = MAX_WIDTH / img.width;
                            canvas.width = MAX_WIDTH;
                            canvas.height = img.height * scaleSize;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                            setProfile({...profile, detailsHeroUrl: compressedBase64});
                          };
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div 
                    onClick={() => document.getElementById('heroUpload')?.click()}
                    className="w-24 h-24 rounded-2xl bg-rose-50 border-2 border-dashed border-rose-200 flex flex-col items-center justify-center text-rose-400 cursor-pointer hover:bg-rose-100 transition-colors shrink-0 overflow-hidden relative"
                  >
                    {profile.detailsHeroUrl ? (
                      <img src={profile.detailsHeroUrl} alt="Hero" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera size={24} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-[15px]">Invitation Main Photo</p>
                    <p className="text-xs text-gray-500 mt-1 max-w-[180px]">The large rectangular photo inside the main invitation card.</p>
                    {profile.detailsHeroUrl && (
                      <button onClick={() => setProfile({...profile, detailsHeroUrl: ""})} className="text-[11px] text-rose-500 font-bold uppercase tracking-wider mt-2 hover:underline">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Partner 1</label>
                  <input type="text" value={profile.partnerOne} onChange={(e) => setProfile({...profile, partnerOne: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Partner 2</label>
                  <input type="text" value={profile.partnerTwo} onChange={(e) => setProfile({...profile, partnerTwo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Event Date</label>
                  <input type="date" value={profile.date} onChange={(e) => setProfile({...profile, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Main Venue</label>
                  <input type="text" value={profile.venue} onChange={(e) => setProfile({...profile, venue: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Theme" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Theme Customization</h2>
              <p className="text-[13px] text-gray-500 font-medium mb-8">Choose a color palette that matches your wedding theme.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {themes.map((theme) => (
                  <div 
                    key={theme.name}
                    onClick={() => setActiveTheme(theme.name)}
                    className={`cursor-pointer rounded-2xl p-2 transition-all duration-300 border-2 ${activeTheme === theme.name ? `border-[${theme.color}] scale-105 bg-gray-50 shadow-md` : 'border-transparent hover:bg-gray-50'}`}
                    style={activeTheme === theme.name ? { borderColor: theme.color } : {}}
                  >
                    <div className="w-full h-24 rounded-xl mb-3 shadow-inner relative overflow-hidden" style={{ backgroundColor: theme.color }}>
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
                    </div>
                    <p className="text-center font-bold text-[13px] text-gray-700">{theme.name}</p>
                    {theme.name === "Custom Color" && (
                      <p className="text-center text-[10px] text-gray-400 mt-1 uppercase">{customColor}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Landing Page Background</h2>
                <p className="text-[13px] text-gray-500 font-medium mb-6">Customize the background image and blur effect for your public invitation.</p>
                
                <div className="flex flex-col lg:flex-row gap-10 mt-6">
                  {/* Controls */}
                  <div className="space-y-6 flex-1">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Background Image</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          accept="image/*"
                          id="bgUpload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const img = new Image();
                                img.src = reader.result as string;
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_WIDTH = 1920;
                                  const scaleSize = MAX_WIDTH / img.width;
                                  canvas.width = MAX_WIDTH;
                                  canvas.height = img.height * scaleSize;
                                  const ctx = canvas.getContext('2d');
                                  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                                  setProfile({...profile, bgUrl: compressedBase64});
                                };
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                        />
                        <label 
                          htmlFor="bgUpload"
                          className="cursor-pointer px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                        >
                          <Camera size={16} /> Choose Image...
                        </label>
                        {profile.bgUrl && profile.bgUrl.startsWith('data:image') && (
                          <span className="text-[12px] font-semibold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Loaded
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">Max recommended size: 5MB.</p>
                      
                      {profile.bgUrl && (
                        <button 
                          onClick={() => setProfile({...profile, bgUrl: ""})}
                          className="text-[11px] text-rose-500 font-bold uppercase tracking-wider mt-3 hover:underline"
                        >
                          Remove Background Image
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Background Blur</label>
                          <span className="text-[12px] font-bold text-theme">{profile.bgBlur || 0}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="20" step="1"
                          value={profile.bgBlur || 0} 
                          onChange={(e) => setProfile({...profile, bgBlur: parseInt(e.target.value)})} 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-theme" 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Background Opacity</label>
                          <span className="text-[12px] font-bold text-theme">{profile.bgOpacity ?? 100}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="100" step="5"
                          value={profile.bgOpacity ?? 100} 
                          onChange={(e) => setProfile({...profile, bgOpacity: parseInt(e.target.value)})} 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-theme" 
                        />
                      </div>
                    </div>
                    
                    {/* Card Background Upload */}
                    <div className="pt-6 border-t border-gray-100">
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Inner Card Background</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          accept="image/*"
                          id="cardBgUpload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const img = new Image();
                                img.src = reader.result as string;
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_WIDTH = 800; // smaller since it's just the card
                                  const scaleSize = MAX_WIDTH / img.width;
                                  canvas.width = MAX_WIDTH;
                                  canvas.height = img.height * scaleSize;
                                  const ctx = canvas.getContext('2d');
                                  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                                  setProfile({...profile, cardBgUrl: compressedBase64});
                                };
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                        />
                        <label 
                          htmlFor="cardBgUpload"
                          className="cursor-pointer px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                        >
                          <Camera size={16} /> Choose Image...
                        </label>
                        {profile.cardBgUrl && profile.cardBgUrl.startsWith('data:image') && (
                          <span className="text-[12px] font-semibold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Loaded
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">Will appear as the background of the white invitation card.</p>
                      
                      {profile.cardBgUrl && (
                        <div className="space-y-4 mt-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Card Image Blur</label>
                              <span className="text-[12px] font-bold text-theme">{profile.cardBgBlur || 0}px</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" max="20" step="1"
                              value={profile.cardBgBlur || 0} 
                              onChange={(e) => setProfile({...profile, cardBgBlur: parseInt(e.target.value)})} 
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-theme" 
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-2">
                              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Card Image Opacity</label>
                              <span className="text-[12px] font-bold text-theme">{profile.cardBgOpacity ?? 40}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" max="100" step="5"
                              value={profile.cardBgOpacity ?? 40} 
                              onChange={(e) => setProfile({...profile, cardBgOpacity: parseInt(e.target.value)})} 
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-theme" 
                            />
                          </div>

                          <button 
                            onClick={() => setProfile({...profile, cardBgUrl: ""})}
                            className="text-[11px] text-rose-500 font-bold uppercase tracking-wider mt-3 hover:underline"
                          >
                            Remove Card Background
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Preview Box */}
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Live Preview</label>
                    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
                      <div className="absolute inset-0 z-0 bg-[#FFF5F7]"></div>
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-300 z-0"
                        style={{
                          backgroundImage: profile.bgUrl ? `url(${profile.bgUrl})` : 'none',
                          filter: `blur(${profile.bgBlur || 0}px)`,
                          opacity: (profile.bgOpacity ?? 100) / 100,
                          transform: 'scale(1.1)'
                        }}
                      ></div>
                      
                      <div 
                        className="relative z-10 p-4 rounded-2xl shadow-xl text-center w-[180px] transform scale-90 border border-white overflow-hidden bg-white/95"
                      >
                        {profile.cardBgUrl && (
                          <div 
                            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-300" 
                            style={{ 
                              backgroundImage: `url(${profile.cardBgUrl})`,
                              filter: `blur(${profile.cardBgBlur || 0}px)`,
                              opacity: (profile.cardBgOpacity ?? 40) / 100
                            }}
                          ></div>
                        )}
                        <div className="relative z-10">
                          {profile.coverUrl && (
                            <img src={profile.coverUrl} alt="Cover" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-white shadow-sm" />
                          )}
                          <h3 className="text-xl font-cursive text-gray-800 leading-none truncate">{profile.partnerOne}</h3>
                          <p className="text-xs text-theme my-1" style={{ color: customColor || '#FA2B56' }}>&</p>
                          <h3 className="text-xl font-cursive text-gray-800 leading-none truncate">{profile.partnerTwo}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Page Background */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Details Page Background</h2>
                <p className="text-[13px] text-gray-500 font-medium mb-6">Customize the background image and blur for the main invitation (details) page.</p>
                
                <div className="flex flex-col lg:flex-row gap-10 mt-6">
                  {/* Controls */}
                  <div className="space-y-6 flex-1">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Details Background</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          accept="image/*"
                          id="detailsBgUpload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const img = new Image();
                                img.src = reader.result as string;
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_WIDTH = 1920;
                                  const scaleSize = MAX_WIDTH / img.width;
                                  canvas.width = MAX_WIDTH;
                                  canvas.height = img.height * scaleSize;
                                  const ctx = canvas.getContext('2d');
                                  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                                  setProfile({...profile, detailsBgUrl: compressedBase64});
                                };
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                        />
                        <label 
                          htmlFor="detailsBgUpload"
                          className="cursor-pointer px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                        >
                          <Camera size={16} /> Choose Image...
                        </label>
                        {profile.detailsBgUrl && profile.detailsBgUrl.startsWith('data:image') && (
                          <span className="text-[12px] font-semibold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 size={14} /> Loaded
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">Max recommended size: 5MB.</p>
                      
                      {profile.detailsBgUrl && (
                        <button 
                          onClick={() => setProfile({...profile, detailsBgUrl: ""})}
                          className="text-[11px] text-rose-500 font-bold uppercase tracking-wider mt-3 hover:underline"
                        >
                          Remove Details Background Image
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4 mt-2">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Background Blur</label>
                          <span className="text-[12px] font-bold text-theme">{profile.detailsBgBlur || 0}px</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="20" step="1"
                          value={profile.detailsBgBlur || 0} 
                          onChange={(e) => setProfile({...profile, detailsBgBlur: parseInt(e.target.value)})} 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-theme" 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Background Opacity</label>
                          <span className="text-[12px] font-bold text-theme">{profile.detailsBgOpacity ?? 100}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="100" step="5"
                          value={profile.detailsBgOpacity ?? 100} 
                          onChange={(e) => setProfile({...profile, detailsBgOpacity: parseInt(e.target.value)})} 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-theme" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview Box */}
                  <div className="flex-1">
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Live Preview</label>
                    <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center">
                      <div className="absolute inset-0 z-0 bg-[#FFF5F7]"></div>
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-300 z-0"
                        style={{
                          backgroundImage: profile.detailsBgUrl ? `url(${profile.detailsBgUrl})` : 'none',
                          filter: `blur(${profile.detailsBgBlur || 0}px)`,
                          opacity: (profile.detailsBgOpacity ?? 100) / 100,
                          transform: 'scale(1.1)'
                        }}
                      ></div>
                      
                      <div className="relative z-10 bg-white/95 p-4 rounded-xl shadow-lg w-[180px] h-[140px] border border-gray-100 flex flex-col mt-4">
                        <div className="w-full h-16 bg-theme-light rounded-lg mb-2"></div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded-full mx-auto mb-1"></div>
                        <div className="w-1/2 h-2 bg-gray-200 rounded-full mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 rounded-2xl border-2 border-rose-100 bg-rose-50/30">
                 <h3 className="text-[14px] font-bold text-[#FA2B56] uppercase tracking-wider mb-2">Pro Tip</h3>
                 <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                   The <span className="font-bold">Blush Pink</span> theme is highly recommended to keep the UI perfectly aligned with your beautiful original design concept. Changing themes will instantly update the primary colors across all guest-facing pages.
                 </p>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="animate-fade-in max-w-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Account Security</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 text-[14px] mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <input type="password" placeholder="Current Password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                    <input type="password" placeholder="New Password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:bg-white focus:outline-none focus:border-[#FA2B56] transition-colors" />
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handleUpdatePassword}
                        disabled={isUpdatingPassword || passwordUpdated}
                        className={`px-6 py-2.5 rounded-full font-bold transition-colors text-[13px] ${
                          passwordUpdated 
                            ? "bg-emerald-50 text-emerald-600" 
                            : "text-[#FA2B56] bg-rose-50 hover:bg-rose-100"
                        }`}
                      >
                        {passwordUpdated ? "Password Updated!" : isUpdatingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
