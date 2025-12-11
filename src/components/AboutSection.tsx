import { 
  Info, 
  Database, 
  Cpu, 
  Layers, 
  Zap, 
  Globe, 
  Shield, 
  BarChart,
  Brain,
  Eye,
  Target,
  Sparkles
} from "lucide-react";

const AboutSection = () => {
  return (
    <div className="space-y-8">
      {/* Hero About Card */}
      <div className="relative overflow-hidden bento-card p-8 md:p-10 animate-fade-in">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-foreground/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-foreground/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-foreground flex items-center justify-center">
              <Brain className="w-7 h-7 text-background" />
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground tracking-wider">ABOUT THE PROJECT</p>
              <h2 className="text-2xl md:text-3xl font-bold">I.K.A.R.A</h2>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
            <span className="text-foreground font-semibold">Indian Knowledge & Artistry Recognition Algorithm</span> — 
            A cutting-edge AI system designed to preserve and promote India's rich artistic heritage through 
            intelligent classification of traditional art forms.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold font-mono">8</p>
              <p className="text-xs text-muted-foreground">Art Styles</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold font-mono">95%+</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold font-mono">&lt;3s</p>
              <p className="text-xs text-muted-foreground">Response Time</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold font-mono">VGG16</p>
              <p className="text-xs text-muted-foreground">Architecture</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision with artistic shading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bento-card animate-fade-in overflow-hidden" style={{ animationDelay: '100ms' }}>
          {/* Artistic gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-yellow-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center rounded border border-amber-500/20">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-lg">Our Mission</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To democratize access to art education and appreciation by leveraging artificial intelligence 
              to help people understand, identify, and learn about India's diverse traditional art forms 
              that have been practiced for millennia.
            </p>
          </div>
        </div>
        
        <div className="relative bento-card animate-fade-in overflow-hidden" style={{ animationDelay: '150ms' }}>
          {/* Artistic gradient background */}
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 via-transparent to-indigo-500/5" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-blue-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center rounded border border-blue-500/20">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg">Our Vision</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become the leading platform for Indian art recognition, contributing to the preservation 
              of cultural heritage while making art history accessible to everyone, from students to 
              researchers and art enthusiasts worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-mono text-muted-foreground tracking-wider">CORE FEATURES</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative bento-card group animate-fade-in overflow-hidden" style={{ animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/10 group-hover:from-yellow-500/10 group-hover:to-amber-500/20 transition-all" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center mb-4 group-hover:from-foreground group-hover:to-foreground group-hover:text-background transition-all rounded">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Instant Analysis</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered recognition delivers accurate results in under 3 seconds
              </p>
            </div>
          </div>
          
          <div className="relative bento-card group animate-fade-in overflow-hidden" style={{ animationDelay: '250ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/10 group-hover:from-green-500/10 group-hover:to-emerald-500/20 transition-all" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:from-foreground group-hover:to-foreground group-hover:text-background transition-all rounded">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Cloud Native</h4>
              <p className="text-sm text-muted-foreground">
                Fully cloud-based infrastructure with zero installation required
              </p>
            </div>
          </div>
          
          <div className="relative bento-card group animate-fade-in overflow-hidden" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/10 group-hover:from-blue-500/10 group-hover:to-cyan-500/20 transition-all" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-foreground group-hover:to-foreground group-hover:text-background transition-all rounded">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Privacy First</h4>
              <p className="text-sm text-muted-foreground">
                Images processed securely with no permanent storage of your data
              </p>
            </div>
          </div>
          
          <div className="relative bento-card group animate-fade-in overflow-hidden" style={{ animationDelay: '350ms' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/10 group-hover:from-purple-500/10 group-hover:to-pink-500/20 transition-all" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:from-foreground group-hover:to-foreground group-hover:text-background transition-all rounded">
                <BarChart className="w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Detailed Insights</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive confidence scores and AI-generated art descriptions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-mono text-muted-foreground tracking-wider">TECHNICAL ARCHITECTURE</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bento-card animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">MODEL</span>
            </div>
            <h4 className="font-bold text-xl mb-3">VGG16 CNN</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Base</span>
                <span className="font-mono">ImageNet</span>
              </li>
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Type</span>
                <span className="font-mono">Transfer Learning</span>
              </li>
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Layers</span>
                <span className="font-mono">16 Deep</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-muted-foreground">Input</span>
                <span className="font-mono">224×224 px</span>
              </li>
            </ul>
          </div>
          
          <div className="bento-card animate-fade-in" style={{ animationDelay: '450ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">STACK</span>
            </div>
            <h4 className="font-bold text-xl mb-3">Technology</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Frontend</span>
                <span className="font-mono">React + Vite</span>
              </li>
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">AI Engine</span>
                <span className="font-mono">Gemini Vision</span>
              </li>
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Backend</span>
                <span className="font-mono">Edge Functions</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-muted-foreground">Styling</span>
                <span className="font-mono">Tailwind CSS</span>
              </li>
            </ul>
          </div>
          
          <div className="bento-card animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">CAPABILITIES</span>
            </div>
            <h4 className="font-bold text-xl mb-3">Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Multi-class</span>
                <span className="font-mono text-green-500">✓ Enabled</span>
              </li>
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">AI Descriptions</span>
                <span className="font-mono text-green-500">✓ Enabled</span>
              </li>
              <li className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">History</span>
                <span className="font-mono text-green-500">✓ Local</span>
              </li>
              <li className="flex justify-between py-1">
                <span className="text-muted-foreground">Export</span>
                <span className="font-mono text-green-500">✓ JSON</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Supported Art Styles Summary */}
      <div className="bento-card animate-fade-in" style={{ animationDelay: '550ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">SUPPORTED ART STYLES</span>
          </div>
          <span className="text-xs font-mono px-2 py-1 bg-muted rounded">8 Categories</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Madhubani', region: 'Bihar' },
            { name: 'Kerala Mural', region: 'Kerala' },
            { name: 'Gond', region: 'M.P.' },
            { name: 'Kangra', region: 'H.P.' },
            { name: 'Mandana', region: 'Rajasthan' },
            { name: 'Kalighat', region: 'W.B.' },
            { name: 'Pichwai', region: 'Rajasthan' },
            { name: 'Warli', region: 'Maharashtra' },
          ].map((style, i) => (
            <div 
              key={style.name} 
              className="p-3 bg-muted/50 rounded border border-border/50 hover:bg-muted transition-colors"
            >
              <p className="font-medium text-sm">{style.name}</p>
              <p className="text-xs text-muted-foreground">{style.region}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
