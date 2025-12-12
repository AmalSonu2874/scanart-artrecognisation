import { useEffect, useRef, useState } from 'react';

const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const shapes = containerRef.current.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
      const element = shape as HTMLElement;
      element.style.animationDelay = `${index * 0.3}s`;
    });
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic gradient that follows mouse */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            hsl(var(--artistic-warm) / 0.08) 0%, 
            transparent 40%)`
        }}
      />

      {/* 3D Rotating geometric wireframes */}
      <div className="absolute inset-0 perspective-2000">
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 wireframe-cube"
          style={{
            transform: `rotateX(${mousePosition.y * 30}deg) rotateY(${mousePosition.x * 30}deg)`
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 wireframe-octahedron"
          style={{
            transform: `rotateX(${-mousePosition.y * 20}deg) rotateY(${-mousePosition.x * 20}deg)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 wireframe-icosahedron"
          style={{
            transform: `translate(-50%, -50%) rotateX(${mousePosition.y * 15}deg) rotateY(${mousePosition.x * 15}deg)`
          }}
        />
      </div>
      
      {/* Floating 3D geometric shapes with depth */}
      {[...Array(16)].map((_, i) => {
        const depth = (i % 3) + 1;
        const size = 40 + (i % 5) * 20;
        return (
          <div
            key={i}
            className={`floating-shape absolute opacity-[0.04] transform-gpu`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${(i * 13 + 5) % 95}%`,
              top: `${(i * 19 + 10) % 90}%`,
              animationDuration: `${12 + (i * 1.5)}s`,
              transform: `translateZ(${depth * 50}px) rotate3d(1, 1, 1, ${i * 30}deg)`,
            }}
          >
            <div className={`w-full h-full ${
              i % 4 === 0 ? 'shape-3d-cube' : 
              i % 4 === 1 ? 'shape-3d-pyramid' : 
              i % 4 === 2 ? 'shape-3d-ring' : 
              'shape-3d-diamond'
            }`} />
          </div>
        );
      })}

      {/* Animated gradient orbs with 3D depth */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full animate-orb-float-1"
        style={{
          background: 'radial-gradient(circle, hsl(var(--artistic-warm) / 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '10%',
          left: '20%',
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full animate-orb-float-2"
        style={{
          background: 'radial-gradient(circle, hsl(var(--artistic-cool) / 0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
          bottom: '15%',
          right: '15%',
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full animate-orb-float-3"
        style={{
          background: 'radial-gradient(circle, hsl(var(--artistic-accent) / 0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 3D Grid floor with perspective */}
      <div className="absolute inset-0 perspective-2000 overflow-hidden">
        <div 
          className="absolute w-[200%] h-[200%] -left-1/2 top-1/2 grid-floor"
          style={{
            transform: `rotateX(75deg) translateZ(-100px)`,
          }}
        />
      </div>

      {/* Floating particles with 3D depth */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full animate-particle-3d"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: `hsl(var(--foreground) / ${0.05 + (i % 5) * 0.02})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: `0 0 ${4 + i % 6}px hsl(var(--foreground) / 0.1)`,
          }}
        />
      ))}

      {/* Light rays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="light-ray light-ray-1" />
        <div className="light-ray light-ray-2" />
        <div className="light-ray light-ray-3" />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay opacity-[0.015]" />
    </div>
  );
};

export default Background3D;
