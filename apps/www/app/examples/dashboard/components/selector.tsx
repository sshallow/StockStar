"use client"
import React, { useState } from 'react';

// 假设你已经有 cn 函数和相应的样式
import { cn } from "@/lib/utils";

interface SelectorOption {
  value: string;
  label: string;
}

interface SelectorProps {
  options: SelectorOption[];
  onSelect?: (value: string) => void;
  className?: string;
}

export function Selector({ options, className }: SelectorProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={(e) => {
            console.log("选中的值:", option.value)
          }}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            selectedValue === option.value ? "bg-background text-foreground shadow" : ""
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
