"use client";

import { useEffect, useState, useRef } from "react";
import { Images, Upload, Trash2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface GalleryImage {
  id: string;
  url: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(getApiUrl("/api/gallery"));
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (e) {
      console.error("Failed to fetch images", e);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large! Please upload images under 5MB.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;

      try {
        const res = await fetch(getApiUrl("/api/gallery"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: base64Url }),
        });

        if (res.ok) {
          const newImage = await res.json();
          setImages((prev) => [...prev, newImage]);
        } else {
          alert("Upload failed.");
        }
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    
    try {
      const res = await fetch(getApiUrl(`/api/gallery/${id}`), {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl pb-20">
      {/* Page header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">
            Image Gallery
          </h1>
          <p className="text-[#64748B] mt-2 text-[15px]">
            Upload and manage your wedding photos and memories.
          </p>
        </div>
        
        <div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-[#FA2B56] hover:bg-rose-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition shadow-md"
          >
            {isUploading ? "Uploading..." : (
              <>
                <Upload size={18} />
                Upload Photo
              </>
            )}
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 p-16 flex flex-col items-center justify-center text-center min-h-[420px]">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Images size={32} className="text-[#FA2B56]" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b] mb-3">
            Photo Gallery is Empty
          </h2>
          <p className="text-[#64748B] text-[15px] max-w-md leading-relaxed mb-6">
            Upload your wedding photography and videos to share with guests.
          </p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-rose-50 text-[#FA2B56] rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-rose-100 transition"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative bg-gray-100 rounded-[20px] overflow-hidden aspect-[4/5] shadow-sm">
              {/* Image */}
              <img 
                src={img.url} 
                alt="Gallery photo" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="bg-white text-red-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
