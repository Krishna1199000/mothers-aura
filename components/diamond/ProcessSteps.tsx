"use client";

import { Check } from "lucide-react";

type StepId = "diamond" | "setting" | "complete";
type FlowType = "diamond-first" | "setting-first";

interface ProcessStepsProps {
    currentStep: StepId;
    onStepClick: (step: StepId) => void;
    flow?: FlowType;
}

export function ProcessSteps({ currentStep, onStepClick, flow = "diamond-first" }: ProcessStepsProps) {
    // Define steps based on flow
    const diamondFirstSteps = [
        { id: "diamond" as StepId, number: 1, label: "Choose a", title: "Diamond", icon: "💎" },
        { id: "setting" as StepId, number: 2, label: "Choose a", title: "Setting", icon: "💍" },
        { id: "complete" as StepId, number: 3, label: "Complete", title: "Diamond", icon: "✓" },
    ];

    const settingFirstSteps = [
        { id: "setting" as StepId, number: 1, label: "Choose a", title: "Setting", icon: "💍" },
        { id: "diamond" as StepId, number: 2, label: "Choose a", title: "Diamond", icon: "💎" },
        { id: "complete" as StepId, number: 3, label: "Complete", title: "Diamond", icon: "✓" },
    ];

    const steps = flow === "setting-first" ? settingFirstSteps : diamondFirstSteps;

    // Determine completion based on flow and current step
    const getIsCompleted = (stepId: StepId) => {
        const currentIndex = steps.findIndex(s => s.id === currentStep);
        const stepIndex = steps.findIndex(s => s.id === stepId);
        return stepIndex < currentIndex;
    };

    return (
        <div className="w-full max-w-6xl mx-auto mb-8">
            <div className="flex rounded-lg overflow-hidden border bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = getIsCompleted(step.id);

                    return (
                        <div
                            key={`${step.id}-${index}`}
                            onClick={() => onStepClick(step.id)}
                            className={`
                                flex-1 flex items-center justify-between px-6 py-4 cursor-pointer transition-colors relative
                                ${isActive 
                                    ? "bg-white dark:bg-gray-800 text-foreground" 
                                    : "bg-gray-50 dark:bg-gray-900 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"}
                                ${index !== steps.length - 1 ? "border-r dark:border-gray-700" : ""}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                    w-8 h-8 flex items-center justify-center text-lg font-serif
                                    ${isActive ? "text-foreground" : "text-muted-foreground"}
                                    ${isCompleted ? "text-green-600" : ""}
                                `}>
                                    {isCompleted ? <Check className="w-6 h-6 text-green-600" /> : step.number}
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-xs uppercase tracking-wider">{step.label}</span>
                                    <span className="text-xl font-serif">{step.title}</span>
                                </div>
                            </div>
                            <div className="text-3xl opacity-20">
                                {step.icon}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
