import { Info, Database, Cpu, Star, Zap, Globe, Shield, BarChart } from "lucide-react";

const AboutSection = () => {
  return (
    <div className="space-y-6">
      {/* Main About Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card col-span-1 md:col-span-2 animate-fade-in relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/20 to-transparent" />
          </div>
          
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 bg-foreground flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-background" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">About I.K.A.R.A</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Indian Knowledge & Artistry Recognition Algorithm</strong> - An AI-powered classifier 
                trained to recognize 8 distinct Indian art styles including Madhubani, Kerala Mural, Gond, 
                Kangra, Mandana, Kalighat, Pichwai, and Warli. Our deep learning model analyzes visual 
                patterns, colors, and compositions to accurately identify traditional art forms that have 
                been practiced for centuries.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bento-card animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">ARCHITECTURE</span>
          </div>
          <p className="text-2xl font-bold">VGG16</p>
          <p className="text-sm text-muted-foreground mt-1">Transfer Learning CNN</p>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Pre-trained on ImageNet</p>
          </div>
        </div>
        
        <div className="bento-card animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">CATEGORIES</span>
          </div>
          <p className="text-2xl font-bold">8</p>
          <p className="text-sm text-muted-foreground mt-1">Art Styles Supported</p>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Traditional Indian Arts</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bento-card animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="w-10 h-10 bg-muted flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold mb-2">Fast Analysis</h4>
          <p className="text-sm text-muted-foreground">
            AI-powered instant recognition with results in seconds
          </p>
        </div>
        
        <div className="bento-card animate-fade-in" style={{ animationDelay: '250ms' }}>
          <div className="w-10 h-10 bg-muted flex items-center justify-center mb-4">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold mb-2">Cloud Based</h4>
          <p className="text-sm text-muted-foreground">
            Runs entirely in the cloud - no local installation needed
          </p>
        </div>
        
        <div className="bento-card animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="w-10 h-10 bg-muted flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h4 className="font-bold mb-2">Privacy First</h4>
          <p className="text-sm text-muted-foreground">
            Images are processed securely and never stored permanently
          </p>
        </div>
        
        <div className="bento-card animate-fade-in" style={{ animationDelay: '350ms' }}>
          <div className="w-10 h-10 bg-muted flex items-center justify-center mb-4">
            <BarChart className="w-5 h-5" />
          </div>
          <h4 className="font-bold mb-2">Confidence Scores</h4>
          <p className="text-sm text-muted-foreground">
            Get detailed confidence percentages for each prediction
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bento-card animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">TECH STACK</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Frontend</span>
              <span className="font-mono">React + Vite</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">AI Backend</span>
              <span className="font-mono">Gemini Vision</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Styling</span>
              <span className="font-mono">Tailwind CSS</span>
            </li>
          </ul>
        </div>
        
        <div className="bento-card animate-fade-in" style={{ animationDelay: '450ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">MODEL INFO</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Base Model</span>
              <span className="font-mono">VGG16</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Classes</span>
              <span className="font-mono">8 Styles</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Input Size</span>
              <span className="font-mono">224×224</span>
            </li>
          </ul>
        </div>
        
        <div className="bento-card animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">CAPABILITIES</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Multi-class</span>
              <span className="font-mono">✓ Yes</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Descriptions</span>
              <span className="font-mono">✓ AI Generated</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">History</span>
              <span className="font-mono">✓ Local</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
