import { ReactNode } from "react";

interface HandDrawnCardProps {
  children: ReactNode;
  className?: string;
}

export function HandDrawnCard({ children, className = "" }: HandDrawnCardProps) {
  return (
    <div 
      className={`relative bg-[#FFF5F0] rounded-3xl ${className}`}
      style={{
        filter: 'blur(0px)',
      }}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
