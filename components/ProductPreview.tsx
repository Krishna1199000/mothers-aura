"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProductPreviewProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    shape?: string;
    carat?: number;
    color?: string;
    clarity?: string;
  };
  onClose?: () => void;
}

export function ProductPreview({ product, onClose }: ProductPreviewProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden"
    >
      <div className="grid md:grid-cols-2 gap-8 p-6">
        {/* Image */}
        <div className="relative aspect-square">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xl font-semibold">
              ${product.price.toLocaleString()}
            </span>
            <Badge>Only One Made</Badge>
          </div>

          {/* Diamond Details */}
          {(product.shape || product.carat || product.color || product.clarity) && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.shape && (
                <div>
                  <dt className="text-sm text-muted-foreground">Shape</dt>
                  <dd className="font-medium">{product.shape}</dd>
                </div>
              )}
              {product.carat && (
                <div>
                  <dt className="text-sm text-muted-foreground">Carat</dt>
                  <dd className="font-medium">{product.carat}</dd>
                </div>
              )}
              {product.color && (
                <div>
                  <dt className="text-sm text-muted-foreground">Color</dt>
                  <dd className="font-medium">{product.color}</dd>
                </div>
              )}
              {product.clarity && (
                <div>
                  <dt className="text-sm text-muted-foreground">Clarity</dt>
                  <dd className="font-medium">{product.clarity}</dd>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto space-y-3">
            <Button onClick={handleViewDetails} className="w-full">
              View Details
            </Button>
            <Button variant="outline" className="w-full">
              Contact to Customize
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
