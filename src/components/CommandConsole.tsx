import { useState, useRef, useEffect } from "react";
import { X, Terminal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommandConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => string;
}

const AVAILABLE_COMMANDS = [
  { cmd: 'help', desc: 'Show available commands' },
  { cmd: 'about', desc: 'Show project description' },
  { cmd: 'reset', desc: 'Clear current upload' },
  { cmd: 'theme', desc: 'Toggle dark/light mode' },
  { cmd: 'version', desc: 'Show model version' },
  { cmd: 'credits', desc: 'Show developer info' },
  { cmd: 'modelinfo', desc: 'Show model details' },
  { cmd: 'history', desc: 'View prediction history' },
  { cmd: 'clear', desc: 'Clear console output' },
  { cmd: 'styles', desc: 'List all art styles' },
  { cmd: 'stats', desc: 'Show usage statistics' },
  { cmd: 'shortcuts', desc: 'Show keyboard shortcuts' },
  { cmd: 'export', desc: 'Export prediction history' },
  { cmd: 'time', desc: 'Show current time' },
  { cmd: 'echo', desc: 'Echo a message (echo <msg>)' },
];

const CommandConsole = ({ isOpen, onClose, onCommand }: CommandConsoleProps) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; response: string }[]>([
    { command: "", response: "Welcome to IKARA Command Console v2.0\nType 'help' for available commands." }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [history]);

  const handleInternalCommand = (cmd: string): string | null => {
    const parts = cmd.split(' ');
    const baseCmd = parts[0];
    const args = parts.slice(1).join(' ');

    switch (baseCmd) {
      case 'clear':
        setHistory([{ command: "", response: "Console cleared. Type 'help' for commands." }]);
        return null;
      case 'styles':
        return "Supported Art Styles:\n• Madhubani (Bihar)\n• Kerala Mural (Kerala)\n• Gond (Madhya Pradesh)\n• Kangra (Himachal Pradesh)\n• Mandana (Rajasthan)\n• Kalighat (West Bengal)\n• Pichwai (Rajasthan)\n• Warli (Maharashtra)";
      case 'stats':
        const historyData = JSON.parse(localStorage.getItem("ikara_history") || "[]");
        return `Usage Statistics:\n• Total Predictions: ${historyData.length}\n• Session Start: ${new Date().toLocaleTimeString()}\n• Storage Used: ${(JSON.stringify(historyData).length / 1024).toFixed(2)} KB`;
      case 'shortcuts':
        return "Keyboard Shortcuts:\n• T - Toggle theme\n• C - Open console\n• U - Upload image\n• Esc - Close dialogs\n• ↑/↓ - Command history";
      case 'export':
        const exportData = localStorage.getItem("ikara_history") || "[]";
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ikara_history.json';
        a.click();
        return "History exported to ikara_history.json";
      case 'time':
        return `Current Time: ${new Date().toLocaleString()}`;
      case 'echo':
        return args || "Usage: echo <message>";
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Try internal commands first
    const internalResult = handleInternalCommand(cmd);
    if (internalResult !== null) {
      setHistory(prev => [...prev, { command: input, response: internalResult }]);
    } else if (cmd !== 'clear') {
      // Fall back to external command handler
      const response = onCommand(cmd);
      setHistory(prev => [...prev, { command: input, response }]);
    }
    
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete
      const matches = AVAILABLE_COMMANDS.filter(c => c.cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0].cmd);
      }
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
      
      {/* Console */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl px-4 animate-fade-in">
        <div className="glass border border-border rounded-lg hard-shadow overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="font-mono text-sm">IKARA Console v2.0</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* History */}
          <div 
            ref={consoleRef}
            className="h-72 md:h-80 overflow-y-auto p-4 font-mono text-sm space-y-3 bg-background/80"
          >
            {history.map((entry, i) => (
              <div key={i} className="space-y-1">
                {entry.command && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ChevronRight className="w-3 h-3 text-primary" />
                    <span className="text-foreground">{entry.command}</span>
                  </div>
                )}
                <div className="pl-5 text-foreground/80 whitespace-pre-wrap">
                  {entry.response}
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Commands */}
          <div className="px-4 py-2 border-t border-border bg-muted/50 overflow-x-auto">
            <div className="flex gap-2 text-xs">
              {['help', 'styles', 'history', 'clear'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => {
                    setInput(cmd);
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-1 bg-background/50 border border-border rounded font-mono hover:bg-muted transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-3 bg-card/80">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter command... (Tab to autocomplete)"
                className="border-0 bg-transparent font-mono text-sm focus-visible:ring-0 px-0"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CommandConsole;
