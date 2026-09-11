"use client";

import Link from "next/link";
import { ArrowLeft, Search, MapPin } from "lucide-react";
import FallingHearts from "@/components/FallingHearts";

export default function PublicSeating() {
  return (
    <main className="min-h-screen bg-[#FFF5F7] flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
      <FallingHearts />
      
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(250,43,86,0.15)] relative z-10 border border-white min-h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/details"
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-serif text-[#1e293b] font-medium tracking-tight">Find Your Seat</h1>
        </div>

        <p className="text-[13px] text-gray-500 font-medium mb-6">
          Search for your name to find your table number for the reception.
        </p>

        {/* Search Input */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Enter your full name..." 
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-full text-[14px] text-gray-700 focus:outline-none focus:border-[#FA2B56] focus:bg-white transition-all shadow-sm"
          />
        </div>

        {/* Mock Results */}
        <div className="flex-1 flex flex-col items-center justify-center">
          
          {/* Result Card */}
          <div className="w-full p-6 border-2 border-rose-100 rounded-[24px] bg-rose-50/30 flex flex-col items-center text-center">
             <div className="w-16 h-16 rounded-full bg-white shadow-md shadow-rose-200 flex items-center justify-center text-[#FA2B56] mb-4">
               <MapPin size={24} />
             </div>
             
             <p className="text-[12px] font-bold text-rose-400 uppercase tracking-widest mb-1">Assigned Table</p>
             <h2 className="text-4xl font-serif text-[#1e293b] font-medium mb-6">Table 5</h2>
             
             <div className="w-full pt-4 border-t border-rose-100">
                <p className="text-[13px] font-semibold text-gray-700">Mr. Amal Perera</p>
                <p className="text-[12px] text-gray-500 mt-1">Please show this at the entrance.</p>
             </div>
          </div>

        </div>
        
      </div>
    </main>
  );
}
