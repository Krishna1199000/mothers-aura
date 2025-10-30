"use client";

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({ 
  value, 
  onChange, 
  length = 6,
  className = ""
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits
    if (inputValue && !/^\d$/.test(inputValue)) {
      return;
    }

    // Update value
    const newValue = value.split('');
    newValue[index] = inputValue;
    onChange(newValue.join(''));

    // Auto focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      // Focus the last input or next empty one
      const focusIndex = Math.min(pastedData.length - 1, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
        />
      ))}
    </div>
  );
};
