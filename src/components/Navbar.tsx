import { Moon, Sun, Terminal, Menu, Settings, Home, Upload, Palette, Info, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  openConsole: () => void;
  openSettings: () => void;
  openMobileMenu: () => void;
  onNavigate: (section: string) => void;
}

const navLinks = [{
  id: 'home',
  label: 'Home',
  icon: Home
}, {
  id: 'upload',
  label: 'Upload',
  icon: Upload
}, {
  id: 'styles',
  label: 'Art Styles',
  icon: Palette
}, {
  id: 'about',
  label: 'About',
  icon: Info
}];
const Navbar = ({
  isDark,
  toggleTheme,
  openConsole,
  openSettings,
  openMobileMenu,
  onNavigate
}: NavbarProps) => {
  const navigate = useNavigate();
  
  return <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border navbar-3d perspective-1000">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between transform-3d">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer hover-lift group" onClick={() => onNavigate('home')}>
          
          <div className="transform-3d transition-all duration-300 group-hover:translate-z-10">
            <h1 className="text-xl font-bold tracking-tight font-mono text-3d">I.K.A.R.A</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Indian Art Recognition
            </p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 transform-3d">
          {navLinks.map(link => <Button key={link.id} variant="ghost" size="sm" onClick={() => onNavigate(link.id)} className="font-mono text-sm hover:bg-muted btn-3d">
              <link.icon className="w-4 h-4 mr-2 icon-3d" />
              {link.label}
            </Button>)}
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="font-mono text-sm hover:bg-muted btn-3d">
            <History className="w-4 h-4 mr-2 icon-3d" />
            History
          </Button>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 transform-3d">
          <Button variant="ghost" size="icon" onClick={openConsole} className="btn-3d hidden sm:flex" title="Command Console (C)">
            <Terminal className="h-5 w-5 icon-3d" />
          </Button>
          <Button variant="ghost" size="icon" onClick={openSettings} className="btn-3d hidden sm:flex" title="UI Settings">
            <Settings className="h-5 w-5 icon-3d" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="btn-3d" title="Toggle Theme (T)">
            {isDark ? <Sun className="h-5 w-5 icon-3d" /> : <Moon className="h-5 w-5 icon-3d" />}
          </Button>
          
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" onClick={openMobileMenu} className="md:hidden btn-3d" title="Menu">
            <Menu className="h-5 w-5 icon-3d" />
          </Button>
        </div>
      </div>
    </nav>;
};
export default Navbar;