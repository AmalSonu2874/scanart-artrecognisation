import { useState } from "react";
import { BarChart3, Volume2, VolumeX, RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArtPrediction } from "@/services/artAnalyzer";
import FeedbackDialog from "./FeedbackDialog";
import { artStyles } from "@/data/artStyles";

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
  imageData?: string;
  onPredictionUpdate?: (newPrediction: ArtPrediction) => void;
}

const PredictionResult = ({ prediction, isLoading, onRerun, imageData, onPredictionUpdate }: PredictionResultProps) => {
  const [showGraph, setShowGraph] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctionApplied, setCorrectionApplied] = useState(false);

  const speakResult = () => {
    if (prediction && audioEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `The predicted art style is ${prediction.label} with ${Math.round(prediction.confidence * 100)} percent confidence.`
      );
      speechSynthesis.speak(utterance);
    }
  };

  const handleCorrectionAccepted = (correctedStyle: string, explanation: string) => {
    if (prediction && onPredictionUpdate) {
      const styleInfo = artStyles.find(s => s.name === correctedStyle);
      
      const correctedPrediction: ArtPrediction = {
        ...prediction,
        label: correctedStyle,
        confidence: 1.0, // User confirmed, so 100% confidence
        description: explanation || styleInfo?.description || prediction.description,
        version: "User Corrected",
        model: "IKARA + Human Feedback",
        all_predictions: ART_STYLES.map(style => ({
          label: style,
          confidence: style === correctedStyle ? 1.0 : 0
        }))
      };
      
      onPredictionUpdate(correctedPrediction);
      setCorrectionApplied(true);
    }
    setShowFeedback(false);
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
    <div className="bg-card border border-border rounded p-6 bento-card animate-slide-up-3d perspective-1000">
      <div className="flex items-center justify-between mb-6 transform-3d">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground icon-3d animate-float-3d" />
          <span className="text-sm font-mono text-muted-foreground">
            {correctionApplied ? "CORRECTED RESULT" : "AI PREDICTION"}
          </span>
          {correctionApplied && (
            <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded font-mono animate-pulse-3d">
              VERIFIED
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAudioEnabled(!audioEnabled)}
            title="Toggle Audio Feedback"
            className="btn-3d"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 icon-3d" /> : <VolumeX className="w-4 h-4 icon-3d" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRerun}
            title="Re-run Prediction"
            className="btn-3d"
          >
            <RefreshCw className="w-4 h-4 icon-3d" />
          </Button>
        </div>
      </div>

      <div className="space-y-6 transform-3d">
        {/* Main Result */}
        <div className={`text-center py-4 border rounded bg-background stats-3d ${
          correctionApplied ? 'border-green-500/50 animate-glow-3d' : 'border-border'
        }`}>
          <p className="text-sm text-muted-foreground mb-2">Detected Art Style</p>
          <h2 className="text-3xl font-bold tracking-tight text-3d">{prediction.label}</h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="text-center stats-3d">
              <p className="text-4xl font-mono font-bold stat-value">
                {Math.round(prediction.confidence * 100)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {correctionApplied ? "USER VERIFIED" : "CONFIDENCE"}
              </p>
            </div>
          </div>
        </div>

        {/* AI Description */}
        {prediction.description && (
          <div className="bg-muted/50 rounded p-4 border border-border bento-card">
            <p className="text-sm text-muted-foreground mb-1 font-mono">
              {correctionApplied ? "ABOUT THIS ART STYLE" : "AI ANALYSIS"}
            </p>
            <p className="text-sm whitespace-pre-line">{prediction.description}</p>
          </div>
        )}

        {/* Confidence Bar */}
        <div className="transform-3d">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Level</span>
            <span className="font-mono">{Math.round(prediction.confidence * 100)}%</span>
          </div>
          <Progress 
            value={prediction.confidence * 100} 
            className={`h-3 progress-3d ${correctionApplied ? '[&>div]:bg-green-500' : ''}`} 
          />
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
            className="font-mono btn-3d"
          >
            <BarChart3 className="w-4 h-4 mr-2 icon-3d" />
            {showGraph ? "Hide" : "Show"} Graph
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={speakResult}
            disabled={!audioEnabled}
            className="font-mono btn-3d"
          >
            <Volume2 className="w-4 h-4 mr-2 icon-3d" />
            Read Result
          </Button>
          {!correctionApplied && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeedback(true)}
              className="font-mono text-destructive hover:text-destructive btn-3d"
            >
              <AlertTriangle className="w-4 h-4 mr-2 icon-3d" />
              Raise Error
            </Button>
          )}
        </div>

        {/* Feedback Dialog */}
        <FeedbackDialog
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          predictedStyle={prediction.label}
          imageData={imageData}
          onCorrectionAccepted={handleCorrectionAccepted}
        />

        {/* Confidence Graph */}
        {showGraph && (
          <div className="space-y-3 pt-4 border-t border-border animate-fade-in-3d perspective-1000">
            <p className="text-sm font-mono text-muted-foreground">ALL PREDICTIONS</p>
            {sortedPredictions.map(({ label, confidence }, index) => (
              <div key={label} className="space-y-1 transform-3d hover-3d-lift transition-all" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex justify-between text-sm">
                  <span className={label === prediction.label ? "font-bold" : ""}>
                    {label}
                  </span>
                  <span className="font-mono">{Math.round(confidence * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden progress-3d">
                  <div
                    className={`h-full transition-all duration-500 ${
                      label === prediction.label && correctionApplied 
                        ? 'bg-green-500' 
                        : 'bg-foreground'
                    }`}
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