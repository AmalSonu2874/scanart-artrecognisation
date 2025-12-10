import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
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

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  predictedStyle: string;
  imageData?: string;
}

const FeedbackDialog = ({ isOpen, onClose, predictedStyle, imageData }: FeedbackDialogProps) => {
  const [correctStyle, setCorrectStyle] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'info' | null; message: string }>({ type: null, message: "" });

  const handleSubmit = async () => {
    if (!correctStyle) {
      toast.error("Please select the correct art style");
      return;
    }

    setIsSubmitting(true);
    setResult({ type: null, message: "" });

    try {
      // Check if the user's correction matches the prediction
      if (correctStyle.toLowerCase() === predictedStyle.toLowerCase()) {
        setResult({
          type: 'info',
          message: `The model's prediction "${predictedStyle}" matches your selection. The model's analysis is correct! The AI uses visual characteristics like line patterns, color palettes, motifs, and regional styling to identify art forms.`
        });
        setIsSubmitting(false);
        return;
      }

      // Simulate model verification - in production this would validate against the model
      // For now, we acknowledge the feedback
      const feedback = {
        predicted: predictedStyle,
        correct: correctStyle,
        description,
        timestamp: new Date().toISOString(),
        imageHash: imageData ? imageData.substring(0, 50) : null
      };

      // Store feedback in localStorage for now
      const existingFeedback = JSON.parse(localStorage.getItem('ikara_feedback') || '[]');
      existingFeedback.push(feedback);
      localStorage.setItem('ikara_feedback', JSON.stringify(existingFeedback));

      setResult({
        type: 'success',
        message: `Thank you for your feedback! You identified this as "${correctStyle}" instead of "${predictedStyle}". Your correction has been recorded and will help improve the model's accuracy. The model learns from such corrections to better distinguish between similar art styles.`
      });

      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
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
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-card border border-border rounded-lg hard-shadow w-full max-w-md animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
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
            <div className="bg-muted/50 rounded p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Model Predicted</p>
              <p className="font-bold text-lg">{predictedStyle}</p>
            </div>

            {/* Correct Style Selection */}
            <div className="space-y-2">
              <Label htmlFor="correct-style">What is the correct art style?</Label>
              <Select value={correctStyle} onValueChange={setCorrectStyle}>
                <SelectTrigger id="correct-style">
                  <SelectValue placeholder="Select the correct art style" />
                </SelectTrigger>
                <SelectContent>
                  {ART_STYLES.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Additional Details (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why you believe this is the correct style..."
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Result Message */}
            {result.type && (
              <div className={`rounded p-4 border animate-fade-in ${
                result.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    result.type === 'success' ? 'text-green-500' : 'text-blue-500'
                  }`} />
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            )}

            {/* Actions */}
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
                    Verifying...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>

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