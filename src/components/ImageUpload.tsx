import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onClear: () => void;
  currentImage: string | null;
}

const ImageUpload = ({ onImageSelect, onClear, currentImage }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [exifData, setExifData] = useState<Record<string, string> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(file, result);
      
      // Mock EXIF data extraction
      setExifData({
        "File Name": file.name,
        "File Size": `${(file.size / 1024).toFixed(2)} KB`,
        "Type": file.type,
        "Last Modified": new Date(file.lastModified).toLocaleDateString(),
      });
      
      toast.success("Image uploaded successfully");
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleClear = () => {
    onClear();
    setExifData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 perspective-1000">
      {!currentImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded p-8 text-center
            transition-all duration-300 cursor-pointer upload-3d transform-3d
            ${isDragging 
              ? "border-foreground bg-accent scale-[1.02] translate-z-20" 
              : "border-border hover:border-foreground/50"
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4 transform-3d">
            <div className="w-16 h-16 bg-muted rounded flex items-center justify-center animate-float-3d">
              <Upload className="w-8 h-8 text-muted-foreground icon-3d" />
            </div>
            <div>
              <p className="font-medium">Drop artwork here or click to upload</p>
              <p className="text-sm text-muted-foreground font-mono mt-1">
                Supports JPG, PNG, WEBP (max 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 transform-3d">
          <div className="relative bg-card border border-border rounded overflow-hidden image-3d animate-enter-depth">
            <img
              src={currentImage}
              alt="Uploaded artwork"
              className="w-full h-auto max-h-[400px] object-contain mx-auto"
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={handleClear}
              className="absolute top-3 right-3 btn-3d"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {exifData && (
            <div className="bg-card border border-border rounded p-4 bento-card">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground icon-3d" />
                <span className="text-sm font-mono text-muted-foreground">FILE INFO</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(exifData).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
