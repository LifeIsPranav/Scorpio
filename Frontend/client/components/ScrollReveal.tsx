import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  options?: UseScrollRevealOptions;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  options = {},
}) => {
  const ref = useScrollReveal(options);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
