import React from "react";

interface ShimmerLoaderProps {
  lines?: number;
  className?: string;
}

export function ShimmerLoader({ lines = 3, className = "" }: ShimmerLoaderProps) {
  // Generate random widths for each line to simulate text better
  const getRandomWidth = (index: number) => {
    const widths = [100, 80, 60, 90, 70];
    return widths[index % widths.length];
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `
      }} />
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            style={{ 
              width: `${getRandomWidth(index)}%`,
              height: '16px',
              margin: '8px 0',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #0001 33%, #0005 50%, #0001 66%) #f2f2f2',
              backgroundSize: '300% 100%',
              animation: 'shimmer 1s infinite linear'
            }}
          />
        ))}
      </div>
    </>
  );
}

// Component for different content types
export function ShimmerCard({ className = "" }: { className?: string }) {
  return (
    <div className={`p-3 bg-white rounded-md border ${className}`}>
      <ShimmerLoader lines={2} />
    </div>
  );
}

export function ShimmerList({ items = 3, className = "" }: { items?: number; className?: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `
      }} />
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="flex items-start gap-2">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                marginTop: '4px',
                background: 'linear-gradient(90deg, #0001 33%, #0005 50%, #0001 66%) #f2f2f2',
                backgroundSize: '300% 100%',
                animation: 'shimmer 1s infinite linear'
              }}
            />
            <ShimmerLoader lines={1} className="flex-1" />
          </div>
        ))}
      </div>
    </>
  );
}

export function ShimmerText({ 
  lines = 1, 
  className = "",
  variant = "default" 
}: { 
  lines?: number; 
  className?: string;
  variant?: "default" | "title" | "subtitle";
}) {
  const getHeight = () => {
    switch (variant) {
      case "title": return "20px";
      case "subtitle": return "18px";
      default: return "16px";
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: 0 0; }
          }
        `
      }} />
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            style={{
              width: index === lines - 1 ? "75%" : "100%",
              height: getHeight(),
              margin: '4px 0',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #0001 33%, #0005 50%, #0001 66%) #f2f2f2',
              backgroundSize: '300% 100%',
              animation: 'shimmer 1s infinite linear'
            }}
          />
        ))}
      </div>
    </>
  );
}