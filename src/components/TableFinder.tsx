"use client";
import { useState } from "react";

import { Search } from "lucide-react";

export default function TableFinder() {
  const [search, setSearch] = useState("");

  return (
    <section className="bg-white rounded-[40px] p-8 shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-8">
        <button className="text-gray-400">{"<"}</button>
        <h3 className="text-lg font-medium text-gray-800 mx-auto">Find Your Table</h3>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Search name</p>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-pink-50/50 pl-10 pr-4 py-3 rounded-2xl border border-pink-100 text-sm focus:outline-none focus:border-pink-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3.5 top-3.5 text-gray-400"><Search size={16} /></span>
        </div>
      </div>

      <div className="bg-white border border-pink-100 p-4 rounded-2xl mb-6 shadow-sm">
        <h4 className="font-medium text-gray-800">Table 1</h4>
        <p className="text-xs text-gray-500">The Kingsbury, Table</p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Search result</p>
        
        <div className="bg-pink-100 p-4 rounded-2xl mb-3 shadow-sm border border-pink-200">
          <h4 className="font-medium text-gray-800">Table 1</h4>
          <p className="text-xs text-gray-600">Guest, Table 1</p>
        </div>

        <div className="bg-white border border-pink-100 p-4 rounded-2xl mb-3 shadow-sm">
          <h4 className="font-medium text-gray-800">Table 2</h4>
          <p className="text-xs text-gray-500">The Kingsbury, Table</p>
        </div>
        
        <div className="bg-white border border-pink-100 p-4 rounded-2xl shadow-sm text-center">
          <p className="text-sm text-gray-400">Add a assigned Table</p>
        </div>
      </div>

      <button className="w-full bg-pink-300 text-white py-3 rounded-full text-sm font-medium tracking-wider shadow-md hover:bg-pink-400 transition mt-2">
        SEARCH
      </button>
    </section>
  );
}
