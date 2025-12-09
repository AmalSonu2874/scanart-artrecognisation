import { Moon, Sun, Terminal, Menu, Settings, Home, Upload, Palette, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  openConsole: () => void;
  openSettings: () => void;
  openMobileMenu: () => void;
  onNavigate: (section: string) => void;
}

const navLinks = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'styles', label: 'Art Styles', icon: Palette },
  { id: 'about', label: 'About', icon: Info },
];

const Navbar = ({
  isDark,
  toggleTheme,
  openConsole,
  openSettings,
  openMobileMenu,
  onNavigate,
}: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover-lift"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-foreground flex items-center justify-center">
            <span className="text-background font-bold font-mono text-lg">IK</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-mono">I.K.A.R.A</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Indian Art Recognition
            </p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(link.id)}
              className="font-mono text-sm hover:bg-muted"
            >
              <link.icon className="w-4 h-4 mr-2" />
              {link.label}
            </Button>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openConsole} 
            className="hover-lift hidden sm:flex" 
            title="Command Console (C)"
          >
            <Terminal className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openSettings} 
            className="hover-lift hidden sm:flex" 
            title="UI Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="hover-lift" 
            title="Toggle Theme (T)"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openMobileMenu} 
            className="md:hidden hover-lift" 
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
