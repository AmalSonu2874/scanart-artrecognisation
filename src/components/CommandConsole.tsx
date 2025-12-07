import { useState, useRef, useEffect } from "react";
import { X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommandConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => string;
}

const CommandConsole = ({ isOpen, onClose, onCommand }: CommandConsoleProps) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; response: string }[]>([
    { command: "", response: "Welcome to IKARA Command Console. Type 'help' for available commands." }
  ]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const response = onCommand(input.trim().toLowerCase());
    setHistory(prev => [...prev, { command: input, response }]);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/50 z-50"
        onClick={onClose}
      />
      
      {/* Console */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-fade-in">
        <div className="glass border border-border rounded hard-shadow overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span className="font-mono text-sm">IKARA Console</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* History */}
          <div 
            ref={consoleRef}
            className="h-64 overflow-y-auto p-4 font-mono text-sm space-y-2 bg-background/50"
          >
            {history.map((entry, i) => (
              <div key={i} className="space-y-1">
                {entry.command && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-foreground">›</span>
                    <span>{entry.command}</span>
                  </div>
                )}
                <div className="pl-4 text-foreground whitespace-pre-wrap">
                  {entry.response}
                </div>
              </div>
            ))}
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-3 bg-card/50">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-mono">›</span>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter command..."
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
