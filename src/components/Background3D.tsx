import { useEffect, useRef } from 'react';

const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create floating shapes
    const shapes = containerRef.current.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
      const element = shape as HTMLElement;
      element.style.animationDelay = `${index * 0.5}s`;
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />
      
      {/* Floating geometric shapes */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`floating-shape absolute w-16 h-16 md:w-24 md:h-24 opacity-[0.03] ${
            i % 3 === 0 ? 'shape-triangle' : i % 3 === 1 ? 'shape-circle' : 'shape-square'
          }`}
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            animationDuration: `${15 + (i * 2)}s`,
          }}
        />
      ))}

      {/* Artistic gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-radial from-primary/5 to-transparent blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-radial from-accent/5 to-transparent blur-3xl animate-float-slow-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-muted/10 to-transparent blur-3xl" />

      {/* Grid pattern with 3D perspective */}
      <div className="absolute inset-0 perspective-1000">
        <div className="absolute inset-0 transform-3d rotate-x-60 scale-150 opacity-[0.02]">
          <div className="grid-pattern-3d" />
        </div>
      </div>

      {/* Subtle particle effect */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-foreground/10 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 20}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Background3D;
