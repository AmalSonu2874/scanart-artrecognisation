import { X, Home, Upload, Palette, Info, Settings, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  openConsole: () => void;
  openSettings: () => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'styles', label: 'Art Styles', icon: Palette },
  { id: 'about', label: 'About', icon: Info },
];

const MobileMenu = ({ isOpen, onClose, onNavigate, openConsole, openSettings }: MobileMenuProps) => {
  if (!isOpen) return null;

  const handleNavigate = (section: string) => {
    onNavigate(section);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-72 bg-card border-l border-border z-50 animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-bold font-mono">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <div className="h-px bg-border my-4" />
          
          <button
            onClick={() => {
              openConsole();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
          >
            <Terminal className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Console</span>
            <span className="ml-auto text-xs font-mono text-muted-foreground">C</span>
          </button>
          
          <button
            onClick={() => {
              openSettings();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">UI Settings</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono text-center">
            I.K.A.R.A v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
