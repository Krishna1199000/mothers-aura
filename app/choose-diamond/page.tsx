"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DiamondStep } from "@/components/diamond/DiamondStep";
import { SettingStep } from "@/components/diamond/SettingStep";
import { RingStep } from "@/components/diamond/RingStep";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ProcessSteps } from "@/components/diamond/ProcessSteps";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/contexts/cart-context";
import { ArrowRight, Diamond, Gem } from "lucide-react";
import Link from "next/link";

type StepId = "diamond" | "setting" | "complete";
type FlowType = "diamond-first" | "setting-first";

export default function ChooseDiamondPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    const { items } = useCart();
    
    // Get flow from URL parameter, default to diamond-first
    const flowParam = searchParams.get("flow") as FlowType | null;
    const [flow, setFlow] = useState<FlowType>(flowParam === "setting-first" ? "setting-first" : "diamond-first");
    
    // Set initial step based on flow
    const getInitialStep = (): StepId => {
        if (flow === "setting-first") return "setting";
        return "diamond";
    };
    
    const [currentStep, setCurrentStep] = useState<StepId>(getInitialStep());

    // Check if user has items in cart
    const hasSelections = items.length > 0;

    // Update step when flow changes
    useEffect(() => {
        const newFlow = flowParam === "setting-first" ? "setting-first" : "diamond-first";
        setFlow(newFlow);
        setCurrentStep(newFlow === "setting-first" ? "setting" : "diamond");
    }, [flowParam]);

    // Get the next step based on current flow
    const getNextStep = (current: StepId): StepId => {
        if (flow === "diamond-first") {
            if (current === "diamond") return "setting";
            if (current === "setting") return "complete";
            return "complete";
        } else {
            // setting-first flow
            if (current === "setting") return "diamond";
            if (current === "diamond") return "complete";
            return "complete";
        }
    };

    // Get the previous step based on current flow
    const getPreviousStep = (current: StepId): StepId => {
        if (flow === "diamond-first") {
            if (current === "complete") return "setting";
            if (current === "setting") return "diamond";
            return "diamond";
        } else {
            // setting-first flow
            if (current === "complete") return "diamond";
            if (current === "diamond") return "setting";
            return "setting";
        }
    };

    const handleStepComplete = () => {
        const nextStep = getNextStep(currentStep);
        setCurrentStep(nextStep);
    };

    const handleStartWithDiamond = () => {
        router.push("/choose-diamond?flow=diamond-first");
    };

    const handleStartWithSetting = () => {
        router.push("/choose-diamond?flow=setting-first");
    };

    // Render the appropriate step content
    const renderStepContent = () => {
        if (currentStep === "diamond") {
            return <DiamondStep onNext={handleStepComplete} />;
        }
        
        if (currentStep === "setting") {
            return <SettingStep onNext={handleStepComplete} />;
        }
        
        if (currentStep === "complete") {
            if (hasSelections) {
                return (
                    <div className="space-y-4">
                        <RingStep onBack={() => setCurrentStep(getPreviousStep("complete"))} />
                    </div>
                );
            }
            
            // Empty state - show start options
            return (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 bg-gradient-to-br from-[#1B2A4A] to-[#2d4a7c] rounded-2xl text-white py-20 px-6 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
                    
                    <div className="space-y-3 relative z-10">
                        <h2 className="text-4xl font-serif font-bold">Your bag is empty</h2>
                        <p className="text-blue-100/80 text-lg max-w-md mx-auto">
                            Begin your journey to find the perfect diamond or setting
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg relative z-10">
                        <Button
                            onClick={handleStartWithDiamond}
                            className="flex-1 bg-white hover:bg-gray-100 text-[#1B2A4A] h-14 text-lg font-medium rounded-full shadow-lg gap-2"
                        >
                            <Diamond className="w-5 h-5" />
                            Start with a Diamond
                        </Button>
                        <Button
                            onClick={handleStartWithSetting}
                            variant="outline"
                            className="flex-1 bg-transparent border-2 border-white/50 hover:bg-white/10 hover:border-white text-white h-14 text-lg font-medium rounded-full shadow-lg gap-2"
                        >
                            <Gem className="w-5 h-5" />
                            Start with a Setting
                        </Button>
                    </div>

                    {/* Get Started / Sign Up Section */}
                    {!session ? (
                        <div className="pt-6 border-t border-white/20 w-full max-w-lg relative z-10">
                            <p className="text-white/70 mb-4">
                                Create an account to save your favorites and track orders
                            </p>
                            <Link href="/signup">
                                <Button 
                                    className="bg-[#4169E1] hover:bg-[#3157d0] text-white px-8 h-12 text-base font-medium rounded-full shadow-lg gap-2"
                                >
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <p className="text-white/50 text-sm mt-3">
                                Already have an account?{" "}
                                <Link href="/signin" className="text-blue-300 hover:text-blue-200 underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div className="pt-4 relative z-10">
                            <p className="text-white/70">
                                Need help?{" "}
                                <a href="#" className="text-blue-300 hover:text-blue-200 underline">
                                    Take the Quiz
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            );
        }
        
        return null;
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AnnouncementBar />
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <ProcessSteps 
                    currentStep={currentStep} 
                    onStepClick={setCurrentStep}
                    flow={flow}
                />

                <div className="mt-8">
                    {renderStepContent()}
                </div>
            </main>

            <Footer />
        </div>
    );
}
