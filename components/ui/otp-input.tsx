"use client";

import * as React from "react";
import { OTPInput } from "input-otp";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

export function OtpInput({
  value,
  onChange,
  maxLength = 6,
  disabled = false,
}: OTPInputProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      disabled={disabled}
      containerClassName="group flex items-center gap-2 has-[:disabled]:opacity-50"
      render={({ slots }) => (
        <>
          {slots.map((slot, idx) => (
            <div key={idx}>
              <input
                {...slot}
                className={cn(
                  "h-12 w-12 border rounded-md text-center text-2xl font-semibold",
                  "focus:border-primary focus:ring-1 focus:ring-primary",
                  "transition-all duration-200",
                  slot.isActive && "border-primary"
                )}
              />
            </div>
          ))}
        </>
      )}
    />
  );
}


