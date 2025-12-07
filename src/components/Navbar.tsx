import { Moon, Sun, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  openConsole: () => void;
}

const Navbar = ({ isDark, toggleTheme, openConsole }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground flex items-center justify-center">
            <span className="text-background font-mono font-bold text-lg">I</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">IKARA</h1>
            <p className="text-xs text-muted-foreground font-mono">
              AI-Powered Indian Traditional Art Classification
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={openConsole}
            className="hover-lift"
            title="Command Console (C)"
          >
            <Terminal className="h-5 w-5" />
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
