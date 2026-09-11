export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-pink-100 to-pink-50">
      
      {/* 3D Floating Elements around the card */}
      <div className="absolute top-1/4 left-10 w-16 h-16 bg-white rounded-full shadow-lg shadow-pink-200/50 blur-[1px]"></div>
      <div className="absolute top-1/4 left-24 w-8 h-4 bg-[#B57C8A] rounded-full shadow-md shadow-pink-200/50 rotate-45 skew-x-12 opacity-80"></div>
      
      <div className="absolute top-1/4 right-8 w-20 h-20 bg-white rounded-full shadow-xl shadow-pink-200/50 blur-[1px]"></div>
      <div className="absolute top-1/3 right-24 w-10 h-5 bg-[#C99BA6] rounded-full shadow-md shadow-pink-200/50 -rotate-12 skew-x-12 opacity-80"></div>

      <div className="absolute bottom-1/4 left-16 w-12 h-12 bg-white rounded-full shadow-lg shadow-pink-200/50 blur-[1px]"></div>
      <div className="absolute bottom-1/4 left-28 w-8 h-4 bg-[#C99BA6] rounded-full shadow-md shadow-pink-200/50 rotate-[60deg] skew-x-12 opacity-80"></div>

      <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-white rounded-full shadow-lg shadow-pink-200/50 blur-[1px]"></div>
      <div className="absolute bottom-1/4 right-20 w-8 h-4 bg-[#B57C8A] rounded-full shadow-md shadow-pink-200/50 -rotate-[30deg] skew-x-12 opacity-80"></div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(236,72,153,0.2)] text-center max-w-[320px] w-full mx-4 border border-white">
        
        {/* Title Section */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#B57C8A]"></div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#5A5A5A] uppercase">
            WEDDING INVITATION
          </p>
        </div>

        <p className="text-[9px] font-bold text-[#A0A0A0] tracking-[0.2em] uppercase mb-4">
          YOU ARE INVITED
        </p>
        
        {/* Couple Names */}
        <h1 className="text-6xl font-cursive text-[#3A3A3A] mb-2 leading-none">Vishmi</h1>
        <p className="text-3xl font-cursive text-[#A0A0A0] mb-2">&</p>
        <h1 className="text-6xl font-cursive text-[#3A3A3A] mb-6 leading-none">Sanjana</h1>
        
        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B57C8A]"></div>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B57C8A]/50 to-transparent"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#B57C8A]"></div>
        </div>
        
        {/* Description */}
        <p className="text-[11px] text-[#5A5A5A] font-medium leading-relaxed mb-8 px-2">
          Join us as we celebrate love, joy, and unforgettable moments together
        </p>
        
        {/* Button */}
        <button className="bg-gradient-to-r from-[#B57C8A] to-[#D5A5B1] text-white px-8 py-3.5 rounded-full text-[10px] font-bold tracking-[0.2em] shadow-lg shadow-pink-200/50 hover:shadow-pink-300 transition-all uppercase w-full">
          OPEN INVITATION →
        </button>
      </div>
    </section>
  );
}
