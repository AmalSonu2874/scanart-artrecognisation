import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  
  const letters = ["I", ".", "K", ".", "A", ".", "R", ".", "A"];

  useEffect(() => {
    if (currentLetter < letters.length) {
      const timer = setTimeout(() => {
        setCurrentLetter(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowSubtitle(true), 300);
      setTimeout(() => setFadeOut(true), 1800);
      setTimeout(() => onComplete(), 2300);
    }
  }, [currentLetter, letters.length, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="relative w-full max-w-lg px-4 flex flex-col items-center">
        {/* Animated grid background */}
        <div className="absolute inset-0 -m-32 grid-bg opacity-30" />
        
        {/* Main title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider font-mono relative text-center">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-300 ${
                index < currentLetter 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              } ${letter === '.' ? 'text-muted-foreground mx-0.5' : ''}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {letter}
            </span>
          ))}
        </h1>
        
        {/* Subtitle */}
        <p 
          className={`text-center mt-4 sm:mt-6 text-muted-foreground font-mono text-xs sm:text-sm tracking-widest transition-all duration-500 px-4 ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Indian Knowledge & Artistry Recognition Algorithm
        </p>
        
        {/* Loading bar */}
        <div className="mt-6 sm:mt-8 w-48 sm:w-64 h-0.5 bg-muted overflow-hidden">
          <div 
            className="h-full bg-foreground transition-all duration-[1500ms] ease-out"
            style={{ width: showSubtitle ? '100%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
