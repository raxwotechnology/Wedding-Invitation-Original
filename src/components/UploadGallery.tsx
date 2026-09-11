"use client";

export default function UploadGallery() {
  return (
    <section className="bg-white rounded-[40px] p-8 shadow-sm mb-6">
      <div className="flex items-center gap-4 mb-8">
        <button className="text-gray-400">{"<"}</button>
        <h3 className="text-lg font-medium text-gray-800 mx-auto">Upload Gallery</h3>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Image gallery</p>
        <div className="flex gap-2 mb-6">
          <div className="w-1/3 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden">
             <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover"/>
          </div>
          <div className="w-1/3 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover"/>
          </div>
          <div className="w-1/3 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover"/>
          </div>
        </div>

        <div className="bg-pink-50/50 border border-dashed border-pink-200 rounded-2xl p-8 text-center mb-4 flex flex-col items-center justify-center h-32">
          <span className="text-2xl mb-2">↑</span>
          <p className="text-sm font-medium text-gray-700">Drag and drop</p>
          <p className="text-xs text-gray-400">Event show chops</p>
        </div>

        <div className="bg-pink-50/50 border border-dashed border-pink-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-32">
          <span className="text-2xl mb-2">↑</span>
          <p className="text-sm font-medium text-gray-700">Drag and drop</p>
          <p className="text-xs text-gray-400">Event show chops</p>
        </div>
      </div>

      <button className="w-full bg-pink-300 text-white py-3 rounded-full text-sm font-medium tracking-wider shadow-md hover:bg-pink-400 transition mt-4">
        UPLOAD MANAGER
      </button>
    </section>
  );
}
