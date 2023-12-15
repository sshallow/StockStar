// SelectorButton.tsx
import * as React from "react";
import { cn } from "@/lib/utils"; // 确保这是客户端可用的

interface SelectorButtonProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
}

const SelectorButton: React.FC<SelectorButtonProps> = ({ label, value, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(value)}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {label}
    </button>
  );
};

export default SelectorButton;
