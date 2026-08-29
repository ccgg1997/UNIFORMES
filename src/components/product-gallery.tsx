"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="grid gap-3 lg:grid-cols-[84px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={cn(
              "relative aspect-square w-18 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-full",
              selectedImage === image ? "border-primary" : "border-transparent hover:border-border",
            )}
            aria-label={`Ver imagen ${index + 1} de ${productName}`}
            aria-pressed={selectedImage === image}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="84px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-3xl bg-muted lg:order-2">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
