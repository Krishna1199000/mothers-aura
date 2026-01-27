"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Truck, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/contexts/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RingStepProps {
    onBack: () => void;
}

export function RingStep({ onBack }: RingStepProps) {
    const { items, removeItem, subtotal: cartSubtotal, clearCart } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const router = useRouter();

    const handleCheckout = () => {
        router.push("/checkout");
    };

    const handleRemoveItem = (productId: string) => {
        removeItem(productId);
    };

    // Calculate totals
    const subtotal = cartSubtotal;
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Left Column: Bag Items */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <h2 className="text-2xl font-serif">My Bag ({items.length} {items.length === 1 ? 'item' : 'items'})</h2>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 p-12 rounded-xl border dark:border-gray-700 shadow-sm text-center">
                        <p className="text-muted-foreground mb-4">Your bag is empty</p>
                        <Button onClick={onBack} className="bg-[#4169E1] hover:bg-[#3157d0]">
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {items.map((item) => (
                            <div key={item.productId} className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-6">
                                <div className="w-32 h-32 relative bg-gray-50 dark:bg-gray-800 rounded-lg flex-shrink-0">
                                    {item.image ? (
                                        <Image 
                                            src={item.image} 
                                            alt={item.name} 
                                            fill 
                                            className="object-contain p-2" 
                                            unoptimized 
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold">${(item.price * item.quantity).toLocaleString()}</div>
                                    </div>

                                    <div className="flex gap-4 text-xs font-medium text-gray-500">
                                        <button 
                                            onClick={() => handleRemoveItem(item.productId)}
                                            className="hover:text-red-500 flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Right Column: Summary */}
            <div className="w-full lg:w-[380px] space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
                    <h3 className="font-serif text-xl mb-4">Order summary</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                                Shipping <Truck className="w-3 h-3" />
                            </span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center gap-2 mb-4">
                        <Input 
                            placeholder="Enter coupon code" 
                            className="h-9 text-sm" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button variant="outline" size="sm" disabled={!couponCode}>
                            Apply
                        </Button>
                    </div>

                    <div className="flex justify-between items-end mb-1">
                        <span className="font-semibold">Estimated Total</span>
                        <span className="text-2xl font-bold font-serif">${total.toLocaleString()}</span>
                    </div>
                    
                    <Link href="/checkout" className="text-xs text-blue-600 hover:underline block mb-6">
                        Financing options
                    </Link>

                    <Button 
                        size="lg" 
                        className="w-full bg-[#4169E1] hover:bg-[#3157d0] text-white font-bold h-12"
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                    >
                        Proceed to Checkout
                    </Button>

                    {items.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2 text-muted-foreground"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                    )}
                </div>
            </div>

        </div>
    );
}
