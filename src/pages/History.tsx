import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, RefreshCw, Calendar, Clock, Percent, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HistoryItem {
  label: string;
  confidence: number;
  description?: string;
  timestamp: string;
  imageData?: string;
}

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem("ikara_history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch {
        setHistory([]);
      }
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("ikara_history");
    setHistory([]);
    setSelectedItem(null);
    toast.success("History cleared");
  };

  const deleteItem = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    localStorage.setItem("ikara_history", JSON.stringify(newHistory));
    setHistory(newHistory);
    if (selectedItem === history[index]) {
      setSelectedItem(null);
    }
    toast.success("Item removed");
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const reAnalyze = (item: HistoryItem) => {
    if (item.imageData) {
      // Navigate back to home with the image data to re-analyze
      navigate("/", { state: { reanalyzeImage: item.imageData, styleName: item.label } });
    } else {
      toast.error("Image data not available for re-analysis");
    }
  };

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Analysis History</h1>
              <p className="text-xs text-muted-foreground font-mono">
                {history.length} {history.length === 1 ? 'record' : 'records'}
              </p>
            </div>
          </div>
          
          {history.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearHistory}
              className="font-mono"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-8">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Analysis History</h2>
            <p className="text-muted-foreground mb-6">
              Start analyzing artworks to build your history
            </p>
            <Button onClick={() => navigate("/")} className="font-mono">
              Analyze Artwork
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History List */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono text-muted-foreground">RECENT ANALYSES</span>
              </div>
              
              {history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedItem(item)}
                  className={`bento-card cursor-pointer transition-all duration-200 ${
                    selectedItem === item 
                      ? 'ring-2 ring-foreground' 
                      : 'hover:border-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {item.label.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold">{item.label}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(item.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Percent className="w-3 h-3" />
                              {Math.round(item.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          reAnalyze(item);
                        }}
                        title="Re-analyze"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(index);
                        }}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-muted-foreground">DETAILS</span>
                </div>
                
                {selectedItem ? (
                  <div className="bento-card animate-fade-in">
                    <div className="text-center mb-4 pb-4 border-b border-border">
                      <div className="w-20 h-20 bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl font-bold">
                          {selectedItem.label.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{selectedItem.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        Indian Traditional Art
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Confidence */}
                      <div>
                        <p className="text-xs font-mono text-muted-foreground mb-2">CONFIDENCE</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
                            <div 
                              className="h-full bg-foreground transition-all"
                              style={{ width: `${selectedItem.confidence * 100}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold">
                            {Math.round(selectedItem.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div>
                        <p className="text-xs font-mono text-muted-foreground mb-2">ANALYZED ON</p>
                        <p className="text-sm">
                          {formatDate(selectedItem.timestamp)} at {formatTime(selectedItem.timestamp)}
                        </p>
                      </div>

                      {/* Description */}
                      {selectedItem.description && (
                        <div>
                          <p className="text-xs font-mono text-muted-foreground mb-2">AI ANALYSIS</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedItem.description}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-4 border-t border-border space-y-2">
                        <Button
                          className="w-full font-mono"
                          onClick={() => reAnalyze(selectedItem)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Re-analyze
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full font-mono"
                          onClick={() => navigate("/")}
                        >
                          New Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bento-card text-center py-8">
                    <p className="text-muted-foreground text-sm">
                      Select an item to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;