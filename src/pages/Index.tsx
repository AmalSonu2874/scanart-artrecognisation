import { useState, useEffect } from "react";
import { Scan, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import PredictionResult from "@/components/PredictionResult";
import AboutSection from "@/components/AboutSection";
import ArtStyleInfo from "@/components/ArtStyleInfo";
import CommandConsole from "@/components/CommandConsole";
import Footer from "@/components/Footer";
import { analyzeArtwork, ArtPrediction } from "@/services/artAnalyzer";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<ArtPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case "t":
          setIsDark(prev => !prev);
          break;
        case "c":
          setIsConsoleOpen(true);
          break;
        case "u":
          document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleImageSelect = (file: File, preview: string) => {
    setCurrentFile(file);
    setCurrentImage(preview);
    setPrediction(null);
  };

  const handleClearImage = () => {
    setCurrentFile(null);
    setCurrentImage(null);
    setPrediction(null);
  };

  const runAnalysis = async () => {
    if (!currentImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeArtwork(currentImage);
      setPrediction(result);
      toast.success(`Detected: ${result.label}`);
      
      // Save to history
      const history = JSON.parse(localStorage.getItem("ikara_history") || "[]");
      history.unshift({
        label: result.label,
        confidence: result.confidence,
        description: result.description,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("ikara_history", JSON.stringify(history.slice(0, 20)));
      
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : "Analysis failed";
      
      if (errorMessage.includes('Rate limit')) {
        toast.error("Too many requests. Please wait a moment and try again.");
      } else if (errorMessage.includes('credits')) {
        toast.error("AI credits exhausted. Please add funds to continue.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const shareResult = async () => {
    if (!prediction) return;
    
    const shareText = `I just discovered that this artwork is "${prediction.label}" style with ${Math.round(prediction.confidence * 100)}% confidence using IKARA - Indian Art Classifier!`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (e) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Result copied to clipboard!");
    }
  };

  const handleCommand = (command: string): string => {
    const commands: Record<string, string | (() => string)> = {
      help: "Available commands:\n• about - Show website description\n• help - List commands\n• reset - Clear upload & prediction\n• theme - Toggle theme\n• version - Show model version\n• credits - Show developer credit\n• modelinfo - Show model metadata\n• history - Show prediction history",
      about: "IKARA is an AI-powered Indian Traditional Art Classification system that recognizes 8 distinct art styles using Lovable AI vision capabilities.",
      reset: () => { handleClearImage(); return "Upload and prediction cleared."; },
      theme: () => { toggleTheme(); return `Theme switched to ${!isDark ? "dark" : "light"} mode.`; },
      version: "Model: Lovable AI Vision v1.0\nPowered by: google/gemini-2.5-flash",
      credits: "Created by Cresvero\nhttps://amalsonu2874.github.io/cresvero.tech/",
      modelinfo: "Model: Lovable AI Vision\nBackend: google/gemini-2.5-flash\nClasses: 8 Indian Art Styles\nCapabilities: Vision + Text Analysis",
      history: () => {
        const history = JSON.parse(localStorage.getItem("ikara_history") || "[]");
        if (history.length === 0) return "No prediction history yet.";
        return history.slice(0, 5).map((h: { label: string; confidence: number }) => 
          `${h.label} (${Math.round(h.confidence * 100)}%)`
        ).join("\n");
      },
    };
    
    const result = commands[command];
    if (typeof result === 'function') {
      return result();
    }
    return result || `Unknown command: ${command}. Type 'help' for available commands.`;
  };

  return (
    <div className="min-h-screen grid-bg">
      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        openConsole={() => setIsConsoleOpen(true)} 
      />
      
      <main className="container mx-auto px-4 pt-28 pb-8">
        {/* Upload Section */}
        <section className="max-w-2xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Analyze Artwork</h2>
            <p className="text-muted-foreground">
              Upload an image of Indian traditional art to identify its style
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-2">
              Powered by Lovable AI Vision
            </p>
          </div>
          
          <ImageUpload
            onImageSelect={handleImageSelect}
            onClear={handleClearImage}
            currentImage={currentImage}
          />
          
          {currentImage && (
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="hard-shadow font-mono"
              >
                <Scan className="w-4 h-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Analyze Artwork"}
              </Button>
              
              {prediction && (
                <Button
                  variant="secondary"
                  onClick={shareResult}
                  className="hard-shadow-sm font-mono"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Result
                </Button>
              )}
            </div>
          )}
          
          <div className="mt-6">
            <PredictionResult
              prediction={prediction}
              isLoading={isAnalyzing}
              onRerun={runAnalysis}
            />
          </div>
        </section>

        {/* About Section */}
        <section className="mb-12">
          <AboutSection />
        </section>

        {/* Art Styles Info */}
        <section className="max-w-2xl mx-auto">
          <ArtStyleInfo />
        </section>
      </main>

      <Footer />
      
      <CommandConsole
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        onCommand={handleCommand}
      />
      
      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 text-xs text-muted-foreground font-mono hidden md:block">
        <span className="opacity-50">Shortcuts: U=Upload, T=Theme, C=Console</span>
      </div>
    </div>
  );
};

export default Index;
