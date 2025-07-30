import { useState, useEffect, useRef } from 'react';

interface InteractiveLoadingPageProps {
  isVisible: boolean;
  onComplete: () => void;
}

interface Point {
  x: number;
  y: number;
}

export function InteractiveLoadingPage({ isVisible, onComplete }: InteractiveLoadingPageProps) {
  const [liquidLevel, setLiquidLevel] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update the ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isVisible) {
      setLiquidLevel(0);
      setIsCompleting(false);
      return;
    }

    // Start the liquid filling animation
    const liquidTimer = setInterval(() => {
      setLiquidLevel(prev => {
        if (prev >= 100) {
          clearInterval(liquidTimer);
          return 100;
        }
        return prev + 1.25; // Fill in 8 seconds (1.25% every 100ms)
      });
    }, 100);

    // Complete animation after 8 seconds
    const completionTimer = setTimeout(() => {

      setIsCompleting(true);
      // Call onComplete after a brief fade out
      setTimeout(() => {

        onCompleteRef.current();
      }, 300);
    }, 8000);

    return () => {
      clearInterval(liquidTimer);
      clearTimeout(completionTimer);
    };
  }, [isVisible]);

  // Canvas drawing functionality
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.strokeStyle = '#1ca19a';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      const point = getMousePos(e);
      lastPointRef.current = point;
      
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current || !lastPointRef.current) return;

      const currentPoint = getMousePos(e);
      
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
      
      lastPointRef.current = currentPoint;
    };

    const stopDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = false;
      lastPointRef.current = null;
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-white z-50 transition-opacity duration-500 ${
      isCompleting ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ touchAction: 'none' }}
      />

      {/* Flask Loader and Content */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ${
        isCompleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Chemical Flask SVG */}
        <div className="relative mb-8">
          <svg
            width="100"
            height="120"
            viewBox="0 0 120 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-lg"
          >
            {/* Flask Outline with Glow */}
            <defs>
              <filter id="loadingGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="loadingLiquidGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#1fb2aa" stopOpacity="0.9"/>
                <stop offset="50%" stopColor="#1fb2aa" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#1fb2aa" stopOpacity="0.5"/>
              </linearGradient>
              <clipPath id="loadingFlaskClip">
                <path d="M45 20 L45 45 L20 100 L20 120 L100 120 L100 100 L75 45 L75 20 Z"/>
              </clipPath>
            </defs>
            
            {/* Flask Body */}
            <path
              d="M45 20 L45 45 L20 100 L20 120 L100 120 L100 100 L75 45 L75 20 Z"
              fill="white"
              stroke="#00ffff"
              strokeWidth="2"
              filter="url(#loadingGlow)"
            />
            
            {/* Flask Neck */}
            <rect
              x="50"
              y="10"
              width="20"
              height="15"
              fill="white"
              stroke="#00ffff"
              strokeWidth="2"
              filter="url(#loadingGlow)"
            />
            
            {/* Liquid with wave animation */}
            <g clipPath="url(#loadingFlaskClip)">
              <path
                d={`M20 ${120 - (liquidLevel * 0.8)} 
                   Q35 ${118 - (liquidLevel * 0.8)} 50 ${120 - (liquidLevel * 0.8)}
                   T80 ${118 - (liquidLevel * 0.8)}
                   Q90 ${120 - (liquidLevel * 0.8)} 100 ${120 - (liquidLevel * 0.8)}
                   L100 120 L20 120 Z`}
                fill="url(#loadingLiquidGradient)"
                className="animate-pulse"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="translate"
                  values="0,0; 2,-1; 0,0; -2,1; 0,0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
              
              {/* Floating bubbles */}
              {liquidLevel > 20 && (
                <>
                  <circle
                    cx="40"
                    cy={115 - (liquidLevel * 0.6)}
                    r="2"
                    fill="#ffffff"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="cy"
                      values={`${115 - (liquidLevel * 0.6)};${105 - (liquidLevel * 0.6)};${115 - (liquidLevel * 0.6)}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0.3;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx="70"
                    cy={110 - (liquidLevel * 0.6)}
                    r="1.5"
                    fill="#ffffff"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="cy"
                      values={`${110 - (liquidLevel * 0.6)};${100 - (liquidLevel * 0.6)};${110 - (liquidLevel * 0.6)}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
            </g>
          </svg>
        </div>

        {/* Main Loading Message */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#111827] mb-3">
            Generating your score and feedback…
          </h2>
          
          {/* Instructional Message */}
          <p className="text-base text-gray-600 animate-pulse">
            While we analyze your writing, feel free to sketch or jot down ideas here.
          </p>
        </div>
      </div>
    </div>
  );
}