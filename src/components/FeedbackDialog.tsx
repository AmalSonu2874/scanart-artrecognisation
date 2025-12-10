import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Loader2, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
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

// Art style characteristics for validation
const ART_STYLE_CHARACTERISTICS: Record<string, string[]> = {
  "Madhubani": ["geometric patterns", "double line border", "natural dyes", "fish", "peacock", "lotus", "hindu deities", "wedding scenes", "nature motifs"],
  "Kerala Mural": ["bold outlines", "red", "yellow", "green", "mythological themes", "temple art", "fresco", "krishna", "vishnu", "shiva"],
  "Gond": ["dots and dashes", "tribal", "nature spirits", "trees", "animals", "bright colors", "folk art", "madhya pradesh"],
  "Kangra": ["miniature painting", "delicate", "radha krishna", "love themes", "nature backgrounds", "soft colors", "pahari school"],
  "Mandana": ["floor art", "geometric", "white on red", "auspicious symbols", "rajasthani", "wall paintings"],
  "Kalighat": ["bold brushstrokes", "social themes", "bengal", "pattachitra influence", "satirical", "simple backgrounds"],
  "Pichwai": ["krishna", "shrinathji", "temple cloth", "lotus", "cows", "devotional", "nathdwara"],
  "Warli": ["white on mud", "triangles", "circles", "tribal", "stick figures", "dance", "harvest", "maharashtra"]
};

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  predictedStyle: string;
  imageData?: string;
  onCorrectionAccepted?: (correctedStyle: string, explanation: string) => void;
}

interface FeedbackResult {
  type: 'success' | 'info' | 'error' | null;
  message: string;
  correctedStyle?: string;
  explanation?: string;
}

const FeedbackDialog = ({ isOpen, onClose, predictedStyle, imageData, onCorrectionAccepted }: FeedbackDialogProps) => {
  const [correctStyle, setCorrectStyle] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<FeedbackResult>({ type: null, message: "" });

  const getStyleInfo = (styleName: string) => {
    return artStyles.find(s => s.name.toLowerCase() === styleName.toLowerCase());
  };

  const analyzeUserCorrection = (predicted: string, userCorrected: string, userDescription: string): FeedbackResult => {
    const predictedLower = predicted.toLowerCase();
    const correctedLower = userCorrected.toLowerCase();
    
    // If same style selected
    if (predictedLower === correctedLower) {
      const styleInfo = getStyleInfo(predicted);
      return {
        type: 'info',
        message: `The model's prediction "${predicted}" matches your selection. The AI correctly identified this artwork based on its visual characteristics.`,
        explanation: styleInfo 
          ? `Key identifying features: ${styleInfo.characteristics.slice(0, 3).join(", ")}. Origin: ${styleInfo.origin}.`
          : `The model analyzed patterns, colors, and motifs typical of ${predicted} art.`
      };
    }

    // Check if user's description contains keywords that match their selected style
    const correctedCharacteristics = ART_STYLE_CHARACTERISTICS[userCorrected] || [];
    const predictedCharacteristics = ART_STYLE_CHARACTERISTICS[predicted] || [];
    const descriptionLower = userDescription.toLowerCase();
    
    // Count matches with user's corrected style
    const correctedMatches = correctedCharacteristics.filter(char => 
      descriptionLower.includes(char.toLowerCase())
    );
    
    // Count matches with predicted style
    const predictedMatches = predictedCharacteristics.filter(char => 
      descriptionLower.includes(char.toLowerCase())
    );

    // If user provides strong evidence for their correction
    if (correctedMatches.length >= 2 || userDescription.length > 50) {
      const correctedInfo = getStyleInfo(userCorrected);
      return {
        type: 'success',
        message: `Correction accepted! The artwork has been re-classified as "${userCorrected}".`,
        correctedStyle: userCorrected,
        explanation: correctedInfo 
          ? `${userCorrected} is characterized by: ${correctedInfo.characteristics.slice(0, 4).join(", ")}. This art form originates from ${correctedInfo.origin}.`
          : `Your correction has been recorded for model improvement.`
      };
    }

    // If user just selects without strong evidence, still accept but explain the difference
    const predictedInfo = getStyleInfo(predicted);
    const correctedInfo = getStyleInfo(userCorrected);
    
    return {
      type: 'success',
      message: `Correction accepted! Updating result to "${userCorrected}".`,
      correctedStyle: userCorrected,
      explanation: `
**Why the model predicted ${predicted}:**
${predictedInfo ? predictedInfo.characteristics.slice(0, 3).join(", ") : "Pattern matching based on training data"}

**About ${userCorrected}:**
${correctedInfo ? correctedInfo.description : "Traditional Indian art form"}

Your feedback helps improve future predictions!`
    };
  };

  const handleSubmit = async () => {
    if (!correctStyle) {
      toast.error("Please select the correct art style");
      return;
    }

    setIsSubmitting(true);
    setResult({ type: null, message: "" });

    try {
      // Analyze the correction
      const analysisResult = analyzeUserCorrection(predictedStyle, correctStyle, description);
      
      // Store feedback in localStorage
      const feedback = {
        predicted: predictedStyle,
        correct: correctStyle,
        description,
        timestamp: new Date().toISOString(),
        imageHash: imageData ? imageData.substring(0, 50) : null,
        accepted: analysisResult.type === 'success'
      };

      const existingFeedback = JSON.parse(localStorage.getItem('ikara_feedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('ikara_feedback', JSON.stringify(existingFeedback));

      setResult(analysisResult);

      // If correction was accepted, notify parent
      if (analysisResult.type === 'success' && analysisResult.correctedStyle && onCorrectionAccepted) {
        toast.success(`Result updated to ${analysisResult.correctedStyle}!`);
      } else if (analysisResult.type === 'info') {
        toast.info("Model prediction confirmed!");
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: "Failed to process feedback. Please try again."
      });
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyCorrection = () => {
    if (result.correctedStyle && onCorrectionAccepted) {
      onCorrectionAccepted(result.correctedStyle, result.explanation || "");
      handleClose();
    }
  };

  const handleClose = () => {
    setCorrectStyle("");
    setDescription("");
    setResult({ type: null, message: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
        onClick={handleClose}
      />
      
      {/* Dialog - Perfectly Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-card border border-border rounded-lg hard-shadow w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="font-bold">Report Incorrect Prediction</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Current Prediction */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1 font-mono">MODEL PREDICTED</p>
              <p className="font-bold text-xl">{predictedStyle}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {getStyleInfo(predictedStyle)?.origin || "Traditional Indian Art"}
              </p>
            </div>

            {/* Correct Style Selection */}
            <div className="space-y-2">
              <Label htmlFor="correct-style" className="font-mono text-sm">
                WHAT IS THE CORRECT ART STYLE?
              </Label>
              <Select value={correctStyle} onValueChange={setCorrectStyle}>
                <SelectTrigger id="correct-style" className="h-12">
                  <SelectValue placeholder="Select the correct art style" />
                </SelectTrigger>
                <SelectContent>
                  {ART_STYLES.map((style) => (
                    <SelectItem key={style} value={style} className="py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{style}</span>
                        <span className="text-xs text-muted-foreground">
                          {getStyleInfo(style)?.origin || ""}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-mono text-sm">
                DESCRIBE WHY (OPTIONAL)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the visual elements that identify this art style... (e.g., geometric patterns, specific colors, motifs)"
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Mention specific patterns, colors, or motifs you see
              </p>
            </div>

            {/* Result Message */}
            {result.type && (
              <div className={`rounded-lg p-4 border animate-fade-in space-y-3 ${
                result.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : result.type === 'info'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-destructive/10 border-destructive/30'
              }`}>
                <div className="flex items-start gap-3">
                  {result.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                  ) : result.type === 'info' ? (
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-destructive" />
                  )}
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium">{result.message}</p>
                    {result.explanation && (
                      <p className="text-xs text-muted-foreground whitespace-pre-line">
                        {result.explanation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Apply Correction Button */}
                {result.type === 'success' && result.correctedStyle && onCorrectionAccepted && (
                  <Button
                    onClick={handleApplyCorrection}
                    className="w-full font-mono mt-2"
                    variant="default"
                  >
                    Apply Correction: {result.correctedStyle}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            )}

            {/* Actions */}
            {!result.type && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 font-mono"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !correctStyle}
                  className="flex-1 font-mono"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </Button>
              </div>
            )}

            {/* Close after result */}
            {result.type && (
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full font-mono"
              >
                Close
              </Button>
            )}

            {/* Info Text */}
            <p className="text-xs text-muted-foreground text-center">
              Your feedback helps improve the model's accuracy over time.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackDialog;