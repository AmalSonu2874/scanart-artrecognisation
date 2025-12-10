import { useState, useEffect } from "react";
import { X, Palette, Type, Sparkles, Grid, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UISettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  animationsEnabled: boolean;
  gridOpacity: number;
  fontSize: 'small' | 'medium' | 'large';
  accentColor: string;
  reducedMotion: boolean;
  compactMode: boolean;
}

const ACCENT_COLORS = [
  { name: 'Default', value: '200 8%' },
  { name: 'Warm', value: '30 60%' },
  { name: 'Cool', value: '220 60%' },
  { name: 'Forest', value: '150 40%' },
  { name: 'Rose', value: '350 60%' },
  { name: 'Amber', value: '45 80%' },
];

const UISettings = ({ isOpen, onClose }: UISettingsProps) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('ikara_ui_settings');
    return saved ? JSON.parse(saved) : {
      animationsEnabled: true,
      gridOpacity: 30,
      fontSize: 'medium',
      accentColor: '200 8%',
      reducedMotion: false,
      compactMode: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('ikara_ui_settings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const applySettings = (s: Settings) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = fontSizes[s.fontSize];
    
    // Grid opacity
    root.style.setProperty('--grid-opacity', `${s.gridOpacity / 100}`);
    
    // Animations
    if (s.reducedMotion || !s.animationsEnabled) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Compact mode
    if (s.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Dialog - Perfectly Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-card border border-border rounded-lg hard-shadow w-full max-w-md animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <h2 className="font-bold">UI Settings</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Animations */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="animations">Animations</Label>
              </div>
              <Switch
                id="animations"
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, animationsEnabled: checked }))}
              />
            </div>
            
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layout className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="reducedMotion">Reduced Motion</Label>
              </div>
              <Switch
                id="reducedMotion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, reducedMotion: checked }))}
              />
            </div>
            
            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layout className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="compact">Compact Mode</Label>
              </div>
              <Switch
                id="compact"
                checked={settings.compactMode}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, compactMode: checked }))}
              />
            </div>
            
            {/* Grid Opacity */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Grid className="w-4 h-4 text-muted-foreground" />
                <Label>Grid Background ({settings.gridOpacity}%)</Label>
              </div>
              <Slider
                value={[settings.gridOpacity]}
                onValueChange={([value]) => setSettings(s => ({ ...s, gridOpacity: value }))}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
            
            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-muted-foreground" />
                <Label>Font Size</Label>
              </div>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={settings.fontSize === size ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSettings(s => ({ ...s, fontSize: size }))}
                    className="flex-1 capitalize font-mono text-xs"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Accent Color */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <Label>Accent Theme</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_COLORS.map((color) => (
                  <Button
                    key={color.name}
                    variant={settings.accentColor === color.value ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSettings(s => ({ ...s, accentColor: color.value }))}
                    className="font-mono text-xs"
                  >
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Reset */}
            <Button
              variant="outline"
              className="w-full font-mono"
              onClick={() => {
                const defaults: Settings = {
                  animationsEnabled: true,
                  gridOpacity: 30,
                  fontSize: 'medium',
                  accentColor: '200 8%',
                  reducedMotion: false,
                  compactMode: false,
                };
                setSettings(defaults);
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UISettings;
