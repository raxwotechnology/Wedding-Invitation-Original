"use client";

export default function AdminDashboard() {
  return (
    <section className="bg-white rounded-[40px] p-8 shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-8">
        <button className="text-gray-400">{"<"}</button>
        <h3 className="text-lg font-medium text-gray-800 mx-auto">Admin Dashboard</h3>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 text-center mb-6">Guest Analytics</p>
        
        {/* Pie Chart Mock */}
        <div className="w-48 h-48 mx-auto rounded-full border-[20px] border-pink-400 relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[20px] border-green-300 rotate-45 border-l-transparent border-t-transparent border-r-transparent"></div>
          <div className="absolute inset-0 rounded-full border-[20px] border-yellow-200 -rotate-45 border-l-transparent border-b-transparent border-r-transparent"></div>
          <div className="w-full h-full bg-white rounded-full"></div>
        </div>

        <p className="text-sm font-medium text-gray-700 text-center mb-6">Guest Breakdown</p>
        
        <div className="flex justify-between px-4">
          <div>
            <h4 className="font-serif text-gray-800 mb-2">Bride</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <p><span className="inline-block w-2 h-2 rounded-full bg-yellow-200 mr-2"></span>Pending: 38</p>
              <p><span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-2"></span>Confirmed: 23</p>
              <p><span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-2"></span>Not Coming: 0</p>
            </div>
          </div>
          <div>
            <h4 className="font-serif text-gray-800 mb-2">Groom</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <p><span className="inline-block w-2 h-2 rounded-full bg-yellow-200 mr-2"></span>Pending: 24</p>
              <p><span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-2"></span>Confirmed: 17</p>
              <p><span className="inline-block w-2 h-2 rounded-full bg-green-300 mr-2"></span>Not Coming: 0</p>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full bg-pink-300 text-white py-3 rounded-full text-sm font-medium tracking-wider shadow-md hover:bg-pink-400 transition">
        DASHBOARD
      </button>
    </section>
  );
}
