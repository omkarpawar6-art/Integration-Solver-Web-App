import { useEffect, useRef } from "react";
import katex from "katex";

interface MathRendererProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export function MathRenderer({ latex, block = false, className = "" }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          throwOnError: false,
          displayMode: block,
          strict: false,
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
        containerRef.current.innerText = latex;
      }
    }
  }, [latex, block]);

  return <div ref={containerRef} className={className} />;
}
