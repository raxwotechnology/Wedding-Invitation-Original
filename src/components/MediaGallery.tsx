export default function MediaGallery() {
  const photos = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <section className="py-24 px-4 bg-stone-50">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-4xl font-serif mb-4 text-stone-900">Moments of Love</h3>
        <p className="text-stone-600 font-light mb-16 max-w-2xl mx-auto">
          A glimpse into our beautiful journey together.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {photos.map((url, i) => (
            <div key={i} className="aspect-square relative overflow-hidden rounded-xl group cursor-pointer shadow-sm">
              <img 
                src={url} 
                alt={`Couple photo ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        <div className="mt-24 max-w-3xl mx-auto p-12 bg-white border border-stone-100 shadow-sm rounded-3xl relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 shadow-sm">
            ♥
          </div>
          <p className="text-xl md:text-2xl font-serif italic text-stone-700 leading-relaxed">
            "Thank you to all our friends and family for your endless love and support. We are incredibly excited to share this new chapter of our lives with you."
          </p>
          <p className="mt-6 text-stone-500 uppercase tracking-widest text-sm">— Sanjana & Vishmi</p>
        </div>
      </div>
    </section>
  );
}
