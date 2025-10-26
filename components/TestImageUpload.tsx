"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function TestImageUpload() {
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Test Image Upload</h2>
      
      <ImageUpload
        onUpload={setImageUrl}
        currentImageUrl={imageUrl}
      />
      
      {imageUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Image URL:</p>
          <p className="text-xs text-gray-600 break-all">{imageUrl}</p>
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <Image
              src={imageUrl} 
              alt="Test upload" 
              className="w-full h-40 object-cover rounded-lg border"
              onError={(e) => {
                console.error('Preview image failed to load:', imageUrl);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Preview image loaded successfully:', imageUrl);
              }}
            />
          </div>
        </div>
      )}
      
      <Button 
        onClick={() => {
          console.log('Current image URL:', imageUrl);
          console.log('Image URL length:', imageUrl.length);
        }}
        variant="outline"
      >
        Log Image URL
      </Button>
    </div>
  );
}


