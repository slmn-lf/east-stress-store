"use client";

import Image from "next/image";
import React, { useState } from "react";

interface Props {
  images: string[];
  alt?: string;
  status?: string;
}

export default function ImageCarousel({ images, alt = "", status }: Props) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
        No image
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="pt-12">
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100">
        <Image src={images[index]} alt={alt} fill className="object-cover" />

        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition"
        >
          ›
        </button>

        {status && status === "active" && (
          <div className="absolute bottom-3 right-3 bg-white/90 text-sm text-gray-800 px-3 py-1 rounded-full shadow">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
      </div>

      {status !== "active" && (
        <div className="mt-2 bg-red-100 border-2 border-red-500 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-700">Sold Out</div>
          <div className="text-sm text-red-600">
            Produk tidak tersedia untuk pemesanan
          </div>
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === index
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
