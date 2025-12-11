import { useState, useRef } from "react";
import { X, Upload, Scan, AlertTriangle, Sparkles, Image, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { analyzeArtwork, ArtPrediction } from "@/services/artAnalyzer";
import { artStyles } from "@/data/artStyles";
import FeedbackDialog from "./FeedbackDialog";

interface ComparisonImage {
  id: string;
  file: File | null;
  preview: string | null;
  prediction: ArtPrediction | null;
  isAnalyzing: boolean;
}

interface ComparisonToolProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonTool = ({ isOpen, onClose }: ComparisonToolProps) => {
  const [images, setImages] = useState<ComparisonImage[]>([
    { id: '1', file: null, preview: null, prediction: null, isAnalyzing: false }
  ]);
  const [comparison, setComparison] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addImageSlot = () => {
    if (images.length >= 3) {
      toast.error("Maximum 3 images allowed for comparison");
      return;
    }
    setImages([...images, { 
      id: Date.now().toString(), 
      file: null, 
      preview: null, 
      prediction: null, 
      isAnalyzing: false 
    }]);
  };

  const removeImageSlot = (id: string) => {
    if (images.length <= 1) return;
    setImages(images.filter(img => img.id !== id));
    setComparison(null);
  };

  const handleFileSelect = async (id: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setImages(images.map(img => 
        img.id === id 
          ? { ...img, file, preview, prediction: null }
          : img
      ));
      setComparison(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image?.preview) return;

    setImages(images.map(img => 
      img.id === id ? { ...img, isAnalyzing: true } : img
    ));

    try {
      const result = await analyzeArtwork(image.preview);
      setImages(images.map(img => 
        img.id === id ? { ...img, prediction: result, isAnalyzing: false } : img
      ));
      toast.success(`Detected: ${result.label}`);
    } catch (error) {
      setImages(images.map(img => 
        img.id === id ? { ...img, isAnalyzing: false } : img
      ));
      toast.error("Analysis failed");
    }
  };

  const runComparison = async () => {
    const analyzedImages = images.filter(img => img.prediction);
    if (analyzedImages.length < 2) {
      toast.error("Please analyze at least 2 images to compare");
      return;
    }

    setIsComparing(true);

    try {
      const comparisonText = generateComparison(analyzedImages);
      setComparison(comparisonText);
      toast.success("Comparison complete!");
    } catch (error) {
      toast.error("Comparison failed");
    } finally {
      setIsComparing(false);
    }
  };

  const generateComparison = (analyzedImages: ComparisonImage[]) => {
    const predictions = analyzedImages.map(img => img.prediction!);
    const styles = predictions.map(p => p.label);
    const uniqueStyles = [...new Set(styles)];

    let text = "📊 COMPARISON ANALYSIS\n\n";

    // Same style detection
    if (uniqueStyles.length === 1) {
      text += `✓ All artworks belong to the ${uniqueStyles[0]} style.\n\n`;
      const styleInfo = artStyles.find(s => s.name === uniqueStyles[0]);
      if (styleInfo) {
        text += `Common Characteristics:\n`;
        styleInfo.characteristics.forEach(c => {
          text += `• ${c}\n`;
        });
      }
    } else {
      text += `Detected ${uniqueStyles.length} different art styles:\n\n`;
      
      uniqueStyles.forEach(style => {
        const styleInfo = artStyles.find(s => s.name === style);
        const count = styles.filter(s => s === style).length;
        text += `【${style}】 (${count} artwork${count > 1 ? 's' : ''})\n`;
        text += `  Origin: ${styleInfo?.origin || 'Unknown'}\n`;
        text += `  Key features: ${styleInfo?.characteristics.slice(0, 2).join(', ')}\n\n`;
      });

      text += "━━━━━━━━━━━━━━━━━━━━━\n\n";
      text += "KEY DIFFERENCES:\n\n";

      // Compare characteristics
      const allChars: Record<string, string[]> = {};
      uniqueStyles.forEach(style => {
        const styleInfo = artStyles.find(s => s.name === style);
        if (styleInfo) {
          allChars[style] = styleInfo.characteristics;
        }
      });

      text += "• Style Origin: " + uniqueStyles.map(s => {
        const info = artStyles.find(a => a.name === s);
        return `${s} (${info?.origin})`;
      }).join(" vs ") + "\n\n";

      text += "• Technique: ";
      text += uniqueStyles.map(s => {
        const info = artStyles.find(a => a.name === s);
        return `${s} uses ${info?.characteristics[0]?.toLowerCase()}`;
      }).join(", while ") + "\n\n";

      text += "• Cultural Significance:\n";
      uniqueStyles.forEach(style => {
        const info = artStyles.find(s => s.name === style);
        if (info) {
          text += `  - ${style}: ${info.significance.substring(0, 80)}...\n`;
        }
      });
    }

    return text;
  };

  const handleCorrectionAccepted = (imageId: string, correctedStyle: string, explanation: string) => {
    const styleInfo = artStyles.find(s => s.name === correctedStyle);
    
    setImages(images.map(img => {
      if (img.id !== imageId || !img.prediction) return img;
      
      return {
        ...img,
        prediction: {
          ...img.prediction,
          label: correctedStyle,
          confidence: 1.0,
          description: explanation || styleInfo?.description || img.prediction.description,
          version: "User Corrected",
          model: "IKARA + Human Feedback"
        }
      };
    }));
    
    setFeedbackFor(null);
    setComparison(null);
    toast.success("Correction applied!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-card border border-border rounded-lg hard-shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-foreground flex items-center justify-center rounded">
              <Image className="w-5 h-5 text-background" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Art Comparison Tool</h2>
              <p className="text-xs text-muted-foreground">Compare up to 3 artworks</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Image Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className="relative border border-border rounded-lg overflow-hidden bg-muted/30"
              >
                {/* Image Upload Area */}
                <div className="aspect-square relative">
                  {image.preview ? (
                    <>
                      <img 
                        src={image.preview} 
                        alt={`Artwork ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setImages(images.map(img => 
                          img.id === image.id 
                            ? { ...img, file: null, preview: null, prediction: null }
                            : img
                        ))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRefs.current[image.id]?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Image {index + 1}</p>
                    </div>
                  )}
                  <input
                    ref={el => fileInputRefs.current[image.id] = el}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(image.id, file);
                    }}
                  />
                </div>

                {/* Prediction Result */}
                <div className="p-3 border-t border-border">
                  {image.isAnalyzing ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </div>
                  ) : image.prediction ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{image.prediction.label}</span>
                        <span className="text-xs font-mono">{Math.round(image.prediction.confidence * 100)}%</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => setFeedbackFor(image.id)}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Raise Error
                      </Button>
                    </div>
                  ) : image.preview ? (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => analyzeImage(image.id)}
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center">No image</p>
                  )}
                </div>

                {/* Remove Button */}
                {images.length > 1 && !image.preview && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImageSlot(image.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}

            {/* Add More Button */}
            {images.length < 3 && (
              <button
                onClick={addImageSlot}
                className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center hover:border-foreground/50 hover:bg-muted/30 transition-colors"
              >
                <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Add Image</p>
              </button>
            )}
          </div>

          {/* Compare Button */}
          <div className="flex justify-center">
            <Button
              onClick={runComparison}
              disabled={isComparing || images.filter(img => img.prediction).length < 2}
              className="font-mono"
            >
              {isComparing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Comparing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Compare Artworks
                </>
              )}
            </Button>
          </div>

          {/* Comparison Result */}
          {comparison && (
            <div className="bg-muted/50 rounded-lg p-4 border border-border animate-fade-in">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Comparison Result
              </h3>
              <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {comparison}
              </pre>
            </div>
          )}
        </div>

        {/* Feedback Dialog for each image */}
        {feedbackFor && (() => {
          const image = images.find(img => img.id === feedbackFor);
          if (!image?.prediction) return null;
          return (
            <FeedbackDialog
              isOpen={true}
              onClose={() => setFeedbackFor(null)}
              predictedStyle={image.prediction.label}
              imageData={image.preview || undefined}
              onCorrectionAccepted={(style, explanation) => handleCorrectionAccepted(feedbackFor, style, explanation)}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default ComparisonTool;