"use client";
import { useState } from "react";

export default function RSVP() {
  return (
    <section className="bg-white rounded-[40px] p-8 shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-8">
        <button className="text-gray-400">{"<"}</button>
        <h3 className="text-lg font-medium text-gray-800 mx-auto">RSVP Search</h3>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Family name</p>
        <input 
          type="text" 
          placeholder="Family Name" 
          className="w-full bg-pink-50/50 px-4 py-3 rounded-2xl border border-pink-100 text-sm focus:outline-none focus:border-pink-300"
        />
      </div>

      <div className="flex justify-center mb-6">
        <span className="text-pink-300">↓</span>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Guest List</p>
        
        {['I\'m Coming', 'Not Coming', 'I\'m Coming', 'I\'m Coming', 'Not Coming'].map((status, i) => (
          <div key={i} className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm text-gray-700">{status}</span>
            </div>
            {/* Toggle Switch */}
            <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${status === 'I\'m Coming' ? 'bg-pink-300' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${status === 'I\'m Coming' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-pink-300 text-white py-3 rounded-full text-sm font-medium tracking-wider shadow-md hover:bg-pink-400 transition">
        SEARCH
      </button>
    </section>
  );
}
