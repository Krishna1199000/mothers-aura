"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MAIN_DIAMOND_SHAPES } from "@/lib/constants/diamond-shapes";
import Image from "next/image";
import { Info, RotateCcw, Truck, Gift } from "lucide-react";

interface DiamondFiltersProps {
    filters: any;
    setFilters: (filters: any) => void;
    mode?: "top" | "side";
}

// Certification options
const CERTIFICATIONS = ["GIA", "GCAL", "IGI"];

// Girdle thickness options
const GIRDLE_OPTIONS = ["Ext. Thin", "Very Thin", "Thin", "Med.", "Sli. Thick", "Thick", "Very Thick", "Ext. Thick"];

// Brand options
const BRANDS = ["James Allen", "Blue Nile", "Brilliant Earth", "Ritani", "Whiteflash", "Adiamor", "Brian Gavin"];

// Color labels
const COLOR_LABELS = ["K", "J", "I", "H", "G", "F", "E", "D"];

// Clarity labels
const CLARITY_LABELS = ["SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];

// Cut labels
const CUT_LABELS = ["Good", "Very Good", "Excellent", "Ideal", "Rare Carat Ideal"];

export function DiamondFilters({ filters, setFilters, mode = "side" }: DiamondFiltersProps) {
    // Local state for advanced filters
    const [advancedFilters, setAdvancedFilters] = useState({
        certification: [] as string[],
        fluorescence: [0, 4],
        table: [0, 90],
        depth: [0, 100],
        polish: [0, 2],
        symmetry: [0, 2],
        lwRatio: [1, 2.75],
        length: [3, 20],
        width: [3, 20],
        height: [2, 12],
        crownAngle: [23, 40],
        pavilionAngle: [38, 43],
        girdleThickness: [0, 7],
        pricePerCarat: [0, 50000],
        brands: [] as string[],
    });

    // Quick filters state
    const [quickShip, setQuickShip] = useState(false);
    const [valentinesDay, setValentinesDay] = useState(false);

    const handleShapeToggle = (shapeId: string) => {
        const currentShapes = filters.shape || [];
        const newShapes = currentShapes.includes(shapeId)
            ? currentShapes.filter((s: string) => s !== shapeId)
            : [...currentShapes, shapeId];
        setFilters({ ...filters, shape: newShapes });
    };

    const handleRangeChange = (key: string, value: number[]) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleAdvancedRangeChange = (key: string, value: number[]) => {
        setAdvancedFilters({ ...advancedFilters, [key]: value });
    };

    const handleCertificationToggle = (cert: string) => {
        const current = advancedFilters.certification;
        const newCerts = current.includes(cert)
            ? current.filter(c => c !== cert)
            : [...current, cert];
        setAdvancedFilters({ ...advancedFilters, certification: newCerts });
    };

    const handleBrandToggle = (brand: string) => {
        const current = advancedFilters.brands;
        const newBrands = current.includes(brand)
            ? current.filter(b => b !== brand)
            : [...current, brand];
        setAdvancedFilters({ ...advancedFilters, brands: newBrands });
    };

    const handleReset = () => {
        setFilters({
            ...filters,
            shape: [],
            carat: [0.15, 35],
            color: [0, 7],
            cut: [0, 4],
            clarity: [0, 7],
            price: [350, 4000000],
        });
        setQuickShip(false);
        setValentinesDay(false);
    };

    // Top Mode: Two-column layout matching the screenshot
    if (mode === "top") {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 pb-4 rounded-xl shadow-sm border dark:border-gray-700 space-y-6">
                {/* Two Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Shape */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-left font-semibold text-sm flex items-center gap-1 text-[#1B2A4A] dark:text-gray-200">
                                SHAPE <Info className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <div className="flex-1 flex flex-wrap gap-2">
                                {MAIN_DIAMOND_SHAPES.slice(0, 10).map(shape => (
                                    <button
                                        key={shape.id}
                                        onClick={() => handleShapeToggle(shape.id)}
                                        className={`group relative flex flex-col items-center justify-center p-1.5 rounded-full transition-all border-2
                                            ${filters.shape.includes(shape.id) 
                                                ? 'border-[#1B2A4A] dark:border-blue-400' 
                                                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}
                                        `}
                                    >
                                        <div className={`w-7 h-7 relative transition-transform ${filters.shape.includes(shape.id) ? 'scale-105' : 'group-hover:scale-105'}`}>
                                            <Image src={shape.image} alt={shape.name} fill className="object-contain dark:invert" unoptimized />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-left font-semibold text-sm flex items-center gap-1 text-[#1B2A4A] dark:text-gray-200">
                                COLOR <Info className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <div className="flex-1 relative">
                                <Slider
                                    defaultValue={[0, 7]}
                                    max={7}
                                    step={1}
                                    min={0}
                                    value={filters.color || [0, 7]}
                                    onValueChange={(val) => handleRangeChange('color', val)}
                                    className="py-3"
                                />
                                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                    {COLOR_LABELS.map((label, idx) => (
                                        <span key={idx}>{label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Clarity */}
                        <div className="flex items-center gap-4">
                            <div className="w-20 text-left font-semibold text-sm flex items-center gap-1 text-[#1B2A4A] dark:text-gray-200">
                                CLARITY <Info className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <div className="flex-1 relative">
                                <Slider
                                    defaultValue={[0, 7]}
                                    max={7}
                                    step={1}
                                    min={0}
                                    value={filters.clarity || [0, 7]}
                                    onValueChange={(val) => handleRangeChange('clarity', val)}
                                    className="py-3"
                                />
                                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                    {CLARITY_LABELS.map((label, idx) => (
                                        <span key={idx}>{label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Carat */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 text-left font-semibold text-sm flex items-center gap-1 text-[#1B2A4A] dark:text-gray-200">
                                CARAT <Info className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <Slider
                                    min={0.15}
                                    max={35}
                                    step={0.01}
                                    value={filters.carat || [0.15, 35]}
                                    onValueChange={(val) => handleRangeChange('carat', val)}
                                    className="py-3"
                                />
                                <div className="flex justify-between mt-1">
                                    <input
                                        className="w-20 p-1.5 text-center border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                        value={filters.carat?.[0] || 0.15}
                                        readOnly
                                    />
                                    <input
                                        className="w-20 p-1.5 text-center border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                        value={filters.carat?.[1] || 35}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cut */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 text-left font-semibold text-sm flex items-center gap-1 text-[#1B2A4A] dark:text-gray-200">
                                CUT <Info className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <div className="flex-1 relative">
                                <Slider
                                    defaultValue={[0, 4]}
                                    max={4}
                                    step={1}
                                    value={filters.cut || [0, 4]}
                                    onValueChange={(val) => handleRangeChange('cut', val)}
                                    className="py-3"
                                />
                                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                    {CUT_LABELS.map((label, idx) => (
                                        <span 
                                            key={idx} 
                                            className={idx === CUT_LABELS.length - 1 ? 'font-bold text-[#1B2A4A] dark:text-blue-400 flex items-center gap-0.5' : ''}
                                        >
                                            {label}
                                            {idx === CUT_LABELS.length - 1 && <Info className="w-3 h-3 text-gray-400" />}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 text-left font-semibold text-sm flex items-center gap-1 text-[#1B2A4A] dark:text-gray-200">
                                PRICE <Info className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <Slider
                                    min={350}
                                    max={4000000}
                                    step={50}
                                    value={filters.price || [350, 4000000]}
                                    onValueChange={(val) => handleRangeChange('price', val)}
                                    className="py-3"
                                />
                                <div className="flex justify-between mt-1">
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span>
                                        <input
                                            className="w-24 pl-5 p-1.5 text-left border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            value={(filters.price?.[0] || 350).toLocaleString()}
                                            readOnly
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span>
                                        <input
                                            className="w-28 pl-5 p-1.5 text-left border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            value={(filters.price?.[1] || 4000000).toLocaleString()}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Quick Filters & Reset */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="quick-ship-top" 
                                checked={quickShip}
                                onCheckedChange={(checked) => setQuickShip(checked as boolean)}
                                className="rounded-sm border-gray-300"
                            />
                            <label htmlFor="quick-ship-top" className="text-sm font-medium cursor-pointer flex items-center gap-1.5 dark:text-gray-300">
                                Quick ship <Truck className="w-4 h-4 text-gray-500" />
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                id="valentines-top" 
                                checked={valentinesDay}
                                onCheckedChange={(checked) => setValentinesDay(checked as boolean)}
                                className="rounded-sm border-gray-300"
                            />
                            <label htmlFor="valentines-top" className="text-sm font-medium cursor-pointer flex items-center gap-1.5 dark:text-gray-300">
                                Ships by Valentine&apos;s Day <Gift className="w-4 h-4 text-red-500" />
                            </label>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleReset}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 gap-1.5"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                </div>
            </div>
        );
    }

    // Side Mode: Advanced & Popular
    return (
        <div className="space-y-6 pr-4">

            {/* Popular Filters */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-sm dark:text-gray-200">Popular filters</h3>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger className="p-0 h-4 w-4"></AccordionTrigger>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <Checkbox id="images" className="rounded-[2px]" />
                        <label htmlFor="images" className="text-sm font-medium leading-none cursor-pointer dark:text-gray-300">
                            Image or Video Available
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="pairs" className="rounded-[2px]" />
                        <label htmlFor="pairs" className="text-sm font-medium leading-none cursor-pointer dark:text-gray-300">
                            Search Earring Pairs
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="rings" className="rounded-[2px]" />
                        <label htmlFor="rings" className="text-sm font-medium leading-none cursor-pointer dark:text-gray-300">
                            Search for Rings
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox id="pendants" className="rounded-[2px]" />
                        <label htmlFor="pendants" className="text-sm font-medium leading-none cursor-pointer dark:text-gray-300">
                            Search for Pendants
                        </label>
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                        <Info className="w-4 h-4 text-primary" />
                        <a href="#" className="text-sm font-medium text-primary hover:underline">Take the Quiz</a>
                    </div>
                </div>
            </div>

            {/* Dark Mode - just visual */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-700 shadow-sm flex justify-between items-center">
                <span className="text-sm font-medium dark:text-gray-200">Dark Mode</span>
                <Switch />
            </div>

            {/* Rare Carat Scores */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-sm dark:text-gray-200">Rare Carat Scores</h3>
                    <Info className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                    <div>
                        <Label className="text-xs text-muted-foreground mb-2 block">Price Score</Label>
                        <div className="space-y-2">
                            {['Great Price', 'Good Price', 'Fair Price'].map(p => (
                                <div key={p} className="flex items-center space-x-3">
                                    <Checkbox id={p} className="rounded-[2px]" />
                                    <label htmlFor={p} className="text-sm cursor-pointer dark:text-gray-300">{p}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Certification Filter */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 shadow-sm">
                <Accordion type="single" collapsible className="w-full" defaultValue="certification">
                    <AccordionItem value="certification" className="border-none">
                        <AccordionTrigger className="py-0 pb-4 text-sm font-semibold hover:no-underline dark:text-gray-200">
                            Certification <Info className="inline w-3 h-3 text-muted-foreground ml-1" />
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            <div className="flex flex-wrap gap-2">
                                {CERTIFICATIONS.map(cert => (
                                    <button
                                        key={cert}
                                        onClick={() => handleCertificationToggle(cert)}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all
                                            ${advancedFilters.certification.includes(cert)
                                                ? 'bg-[#1B2A4A] text-white border-[#1B2A4A] dark:bg-blue-600 dark:border-blue-600'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-[#1B2A4A] dark:hover:border-blue-400'
                                            }`}
                                    >
                                        {cert}
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Advanced Filters Accordion */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 shadow-sm">
                <Accordion type="single" collapsible className="w-full" defaultValue="advanced">
                    <AccordionItem value="advanced" className="border-none">
                        <AccordionTrigger className="py-0 pb-4 text-sm font-semibold hover:no-underline dark:text-gray-200">Advanced Diamond Filters</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-2">
                            
                            {/* Fluorescence */}
                            <div>
                                <Label className="mb-3 block text-sm dark:text-gray-200">Fluorescence <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.fluorescence} 
                                    onValueChange={(val) => handleAdvancedRangeChange('fluorescence', val)}
                                    max={4} 
                                    step={1} 
                                    className="mb-2" 
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                    <span>Very Strong</span><span>Strong</span><span>Medium</span><span>Faint</span><span>None</span>
                                </div>
                            </div>

                            {/* Table */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Table <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.table} 
                                    onValueChange={(val) => handleAdvancedRangeChange('table', val)}
                                    max={90} 
                                    step={1} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.table[0]}%`}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.table[1]}%`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Depth */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Depth <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.depth} 
                                    onValueChange={(val) => handleAdvancedRangeChange('depth', val)}
                                    max={100} 
                                    step={1} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.depth[0]}%`}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.depth[1]}%`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Polish */}
                            <div>
                                <Label className="mb-3 block text-sm dark:text-gray-200">Polish <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.polish} 
                                    onValueChange={(val) => handleAdvancedRangeChange('polish', val)}
                                    max={2} 
                                    step={1} 
                                    className="mb-2" 
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                    <span>Good</span><span>Very Good</span><span>Excellent</span>
                                </div>
                            </div>

                            {/* Symmetry */}
                            <div>
                                <Label className="mb-3 block text-sm dark:text-gray-200">Symmetry <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.symmetry} 
                                    onValueChange={(val) => handleAdvancedRangeChange('symmetry', val)}
                                    max={2} 
                                    step={1} 
                                    className="mb-2" 
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                    <span>Good</span><span>Very Good</span><span>Excellent</span>
                                </div>
                            </div>

                            {/* L/W Ratio */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">L/W Ratio <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.lwRatio} 
                                    onValueChange={(val) => handleAdvancedRangeChange('lwRatio', val)}
                                    min={1}
                                    max={2.75} 
                                    step={0.01} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={advancedFilters.lwRatio[0]}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={advancedFilters.lwRatio[1]}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Length */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Length <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.length} 
                                    onValueChange={(val) => handleAdvancedRangeChange('length', val)}
                                    min={3}
                                    max={20} 
                                    step={0.1} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.length[0]}mm`}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.length[1]}mm`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Width */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Width <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.width} 
                                    onValueChange={(val) => handleAdvancedRangeChange('width', val)}
                                    min={3}
                                    max={20} 
                                    step={0.1} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.width[0]}mm`}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.width[1]}mm`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Height */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Height <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.height} 
                                    onValueChange={(val) => handleAdvancedRangeChange('height', val)}
                                    min={2}
                                    max={12} 
                                    step={0.1} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.height[0]}mm`}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.height[1]}mm`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Crown Angle */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Crown Angle <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.crownAngle} 
                                    onValueChange={(val) => handleAdvancedRangeChange('crownAngle', val)}
                                    min={23}
                                    max={40} 
                                    step={0.1} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.crownAngle[0]}°`}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.crownAngle[1]}°`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Pavilion Angle */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Pavilion Angle <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.pavilionAngle} 
                                    onValueChange={(val) => handleAdvancedRangeChange('pavilionAngle', val)}
                                    min={38}
                                    max={43} 
                                    step={0.1} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.pavilionAngle[0]}°`}
                                        readOnly
                                    />
                                    <input 
                                        className="w-1/2 text-xs border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                        value={`${advancedFilters.pavilionAngle[1]}°`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Girdle Thickness */}
                            <div>
                                <Label className="mb-3 block text-sm dark:text-gray-200">Girdle Thickness <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.girdleThickness} 
                                    onValueChange={(val) => handleAdvancedRangeChange('girdleThickness', val)}
                                    max={7} 
                                    step={1} 
                                    className="mb-2" 
                                />
                                <div className="flex justify-between text-[9px] text-muted-foreground px-1">
                                    {GIRDLE_OPTIONS.map((option, idx) => (
                                        <span key={idx} className="text-center" style={{ width: `${100/8}%` }}>{option}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Price Per Carat */}
                            <div>
                                <Label className="mb-2 block text-sm dark:text-gray-200">Price Per Carat <Info className="inline w-3 h-3 text-muted-foreground" /></Label>
                                <Slider 
                                    value={advancedFilters.pricePerCarat} 
                                    onValueChange={(val) => handleAdvancedRangeChange('pricePerCarat', val)}
                                    min={0}
                                    max={50000} 
                                    step={100} 
                                    className="mb-2" 
                                />
                                <div className="flex gap-2">
                                    <div className="relative w-1/2">
                                        <span className="absolute left-2 top-1 text-xs text-gray-500 dark:text-gray-400">$</span>
                                        <input 
                                            className="w-full text-xs border rounded pl-4 pr-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                            value={advancedFilters.pricePerCarat[0].toLocaleString()}
                                            readOnly
                                        />
                                    </div>
                                    <div className="relative w-1/2">
                                        <span className="absolute left-2 top-1 text-xs text-gray-500 dark:text-gray-400">$</span>
                                        <input 
                                            className="w-full text-xs border rounded pl-4 pr-2 py-1 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" 
                                            value={advancedFilters.pricePerCarat[1].toLocaleString()}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Search by Brand */}
            <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 shadow-sm">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="brand" className="border-none">
                        <AccordionTrigger className="py-0 pb-4 text-sm font-semibold hover:no-underline dark:text-gray-200">Search by Brand</AccordionTrigger>
                        <AccordionContent className="pt-2">
                            <div className="space-y-2">
                                {BRANDS.map(brand => (
                                    <div key={brand} className="flex items-center space-x-3">
                                        <Checkbox 
                                            id={brand} 
                                            className="rounded-[2px]"
                                            checked={advancedFilters.brands.includes(brand)}
                                            onCheckedChange={() => handleBrandToggle(brand)}
                                        />
                                        <label htmlFor={brand} className="text-sm cursor-pointer dark:text-gray-300">{brand}</label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

        </div>
    );
}
