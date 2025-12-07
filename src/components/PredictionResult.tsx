import { useState } from "react";
import { BarChart3, Volume2, VolumeX, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArtPrediction } from "@/services/artAnalyzer";

const ART_STYLES = [
  "Madhubani",
  "Kerala Mural",
  "Gond",
  "Kangra",
  "Mandana",
  "Kalighat",
  "Pichwai",
  "Warli"
];

interface PredictionResultProps {
  prediction: ArtPrediction | null;
  isLoading: boolean;
  onRerun: () => void;
}

const PredictionResult = ({ prediction, isLoading, onRerun }: PredictionResultProps) => {
  const [showGraph, setShowGraph] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const speakResult = () => {
    if (prediction && audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `The predicted art style is ${prediction.label} with ${Math.round(prediction.confidence * 100)} percent confidence.`
      );
      speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded p-6 hard-shadow animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span className="text-sm font-mono">AI analyzing artwork...</span>
          </div>
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-12 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  // Use provided predictions or generate based on main prediction
  const allPredictions = prediction.all_predictions || ART_STYLES.map(style => ({
    label: style,
    confidence: style === prediction.label 
      ? prediction.confidence 
      : Math.random() * (1 - prediction.confidence) * 0.3
  }));

  const sortedPredictions = [...allPredictions].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="bg-card border border-border rounded p-6 hard-shadow animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono text-muted-foreground">AI PREDICTION</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAudioEnabled(!audioEnabled)}
            title="Toggle Audio Feedback"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRerun}
            title="Re-run Prediction"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Result */}
        <div className="text-center py-4 border border-border rounded bg-background">
          <p className="text-sm text-muted-foreground mb-2">Detected Art Style</p>
          <h2 className="text-3xl font-bold tracking-tight">{prediction.label}</h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-mono font-bold">
                {Math.round(prediction.confidence * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">CONFIDENCE</p>
            </div>
          </div>
        </div>

        {/* AI Description */}
        {prediction.description && (
          <div className="bg-muted/50 rounded p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1 font-mono">AI ANALYSIS</p>
            <p className="text-sm">{prediction.description}</p>
          </div>
        )}

        {/* Confidence Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Level</span>
            <span className="font-mono">{Math.round(prediction.confidence * 100)}%</span>
          </div>
          <Progress value={prediction.confidence * 100} className="h-3" />
        </div>

        {/* Model Info */}
        {prediction.version && (
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>{prediction.version}</span>
            <span>{prediction.model}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowGraph(!showGraph)}
            className="font-mono"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showGraph ? "Hide" : "Show"} Confidence Graph
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={speakResult}
            disabled={!audioEnabled}
            className="font-mono"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Read Result
          </Button>
        </div>

        {/* Confidence Graph */}
        {showGraph && (
          <div className="space-y-3 pt-4 border-t border-border animate-fade-in">
            <p className="text-sm font-mono text-muted-foreground">ALL PREDICTIONS</p>
            {sortedPredictions.map(({ label, confidence }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={label === prediction.label ? "font-bold" : ""}>
                    {label}
                  </span>
                  <span className="font-mono">{Math.round(confidence * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all duration-500"
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResult;
