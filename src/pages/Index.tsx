import { useState, useEffect, useRef } from "react";
import { Scan, Share2, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import PredictionResult from "@/components/PredictionResult";
import AboutSection from "@/components/AboutSection";
import ArtStylesGrid from "@/components/ArtStylesGrid";
import CommandConsole from "@/components/CommandConsole";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import UISettings from "@/components/UISettings";
import MobileMenu from "@/components/MobileMenu";
import ExampleGallery from "@/components/ExampleGallery";
import ComparisonTool from "@/components/ComparisonTool";
import { analyzeArtwork, ArtPrediction } from "@/services/artAnalyzer";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<ArtPrediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  const uploadRef = useRef<HTMLDivElement>(null);
  const stylesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case "t": setIsDark(prev => !prev); break;
        case "c": setIsConsoleOpen(true); break;
        case "u": document.querySelector<HTMLInputElement>('input[type="file"]')?.click(); break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleNavigate = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      upload: uploadRef, styles: stylesRef, about: aboutRef,
    };
    if (section === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (file: File, preview: string) => {
    setCurrentFile(file);
    setCurrentImage(preview);
    setPrediction(null);
  };

  const handleExampleSelect = async (imageUrl: string, styleName: string) => {
    setCurrentImage(imageUrl);
    setCurrentFile(null);
    setPrediction(null);
    toast.info(`Loading ${styleName} example...`);
    // Auto-analyze example images
    setIsAnalyzing(true);
    try {
      const result = await analyzeArtwork(imageUrl);
      setPrediction(result);
      toast.success(`Detected: ${result.label}`);
    } catch (error) {
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearImage = () => {
    setCurrentFile(null);
    setCurrentImage(null);
    setPrediction(null);
  };

  const runAnalysis = async () => {
    if (!currentImage) { toast.error("Please upload an image first"); return; }
    setIsAnalyzing(true);
    try {
      const result = await analyzeArtwork(currentImage);
      setPrediction(result);
      toast.success(`Detected: ${result.label}`);
      const history = JSON.parse(localStorage.getItem("ikara_history") || "[]");
      history.unshift({ label: result.label, confidence: result.confidence, description: result.description, timestamp: new Date().toISOString() });
      localStorage.setItem("ikara_history", JSON.stringify(history.slice(0, 20)));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Analysis failed";
      toast.error(errorMessage.includes('Rate limit') ? "Too many requests. Please wait." : errorMessage);
    } finally { setIsAnalyzing(false); }
  };

  const shareResult = async () => {
    if (!prediction) return;
    const shareText = `I discovered this artwork is "${prediction.label}" style with ${Math.round(prediction.confidence * 100)}% confidence using IKARA!`;
    if (navigator.share) { try { await navigator.share({ text: shareText }); } catch {} }
    else { await navigator.clipboard.writeText(shareText); toast.success("Copied to clipboard!"); }
  };

  const handleCommand = (command: string): string => {
    const commands: Record<string, string | (() => string)> = {
      help: "Commands: about, help, reset, theme, version, credits, modelinfo, history, clear, styles, stats, shortcuts, export, time, echo",
      about: "IKARA - Indian Knowledge & Artistry Recognition Algorithm. AI-powered classifier for 8 Indian art styles.",
      reset: () => { handleClearImage(); return "Cleared."; },
      theme: () => { toggleTheme(); return `Theme: ${!isDark ? "dark" : "light"}`; },
      version: "Lovable AI Vision v1.0 | google/gemini-2.5-flash",
      credits: "Created by Cresvero\nhttps://amalsonu2874.github.io/cresvero.tech/",
      modelinfo: "Model: Lovable AI Vision\nClasses: 8 Indian Art Styles",
      history: () => {
        const h = JSON.parse(localStorage.getItem("ikara_history") || "[]");
        return h.length ? h.slice(0, 5).map((x: any) => `${x.label} (${Math.round(x.confidence * 100)}%)`).join("\n") : "No history.";
      }
    };
    const result = commands[command];
    return typeof result === 'function' ? result() : result || `Unknown: ${command}`;
  };

  if (showLoading) return <LoadingScreen onComplete={() => setShowLoading(false)} />;

  return (
    <div className="min-h-screen grid-bg">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} openConsole={() => setIsConsoleOpen(true)} openSettings={() => setIsSettingsOpen(true)} openMobileMenu={() => setIsMobileMenuOpen(true)} onNavigate={handleNavigate} />
      
      <main className="container mx-auto px-4 pt-28 pb-8">
        <section ref={uploadRef} className="max-w-2xl mx-auto mb-16 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Analyze Artwork</h2>
            <p className="text-muted-foreground">Upload Indian traditional art to identify its style</p>
          </div>
          <ImageUpload onImageSelect={handleImageSelect} onClear={handleClearImage} currentImage={currentImage} />
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {currentImage && (
              <>
                <Button onClick={runAnalysis} disabled={isAnalyzing} className="hard-shadow font-mono">
                  <Scan className="w-4 h-4 mr-2" />{isAnalyzing ? "Analyzing..." : "Analyze"}
                </Button>
                {prediction && <Button variant="secondary" onClick={shareResult} className="hard-shadow-sm font-mono"><Share2 className="w-4 h-4 mr-2" />Share</Button>}
              </>
            )}
            <Button 
              variant="outline" 
              onClick={() => setIsComparisonOpen(true)} 
              className="font-mono"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare Artworks
            </Button>
          </div>

          {/* Prediction Result */}
          <div className="mt-6">
            <PredictionResult prediction={prediction} isLoading={isAnalyzing} onRerun={runAnalysis} imageData={currentImage || undefined} onPredictionUpdate={setPrediction} />
          </div>

          {/* Example Gallery */}
          <div className="mt-8">
            <ExampleGallery onSelectImage={handleExampleSelect} />
          </div>
        </section>

        <section ref={aboutRef} className="mb-16"><AboutSection /></section>
        <section ref={stylesRef}><ArtStylesGrid /></section>
      </main>

      <Footer />
      <CommandConsole isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} onCommand={handleCommand} />
      <UISettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onNavigate={handleNavigate} openConsole={() => setIsConsoleOpen(true)} openSettings={() => setIsSettingsOpen(true)} />
      <ComparisonTool isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} />
      
      <div className="fixed bottom-4 left-4 text-xs text-muted-foreground font-mono hidden md:block opacity-50">
        U=Upload, T=Theme, C=Console
      </div>
    </div>
  );
};

export default Index;
