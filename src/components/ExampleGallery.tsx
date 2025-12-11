import { useState } from "react";
import { Image, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { artStyles } from "@/data/artStyles";

interface ExampleGalleryProps {
  onSelectImage: (imageUrl: string, styleName: string) => void;
}

const EXAMPLE_IMAGES = [
  {
    name: "Madhubani",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Madhubani_art.jpg/800px-Madhubani_art.jpg",
    description: "Traditional Madhubani featuring geometric patterns and natural dyes"
  },
  {
    name: "Kerala Mural",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kerala_Mural_-_Krishna.jpg/800px-Kerala_Mural_-_Krishna.jpg",
    description: "Temple mural art depicting divine figures with bold outlines"
  },
  {
    name: "Gond",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A_Gond_painting.JPG/800px-A_Gond_painting.JPG",
    description: "Tribal art with intricate dot patterns and nature motifs"
  },
  {
    name: "Kangra",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Kangra_Painting.jpg/800px-Kangra_Painting.jpg",
    description: "Miniature painting with delicate brushwork and soft colors"
  },
  {
    name: "Mandana",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mandana_art.jpg/800px-Mandana_art.jpg",
    description: "Floor art with geometric designs using chalk and red ochre"
  },
  {
    name: "Kalighat",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Kalighat_Painting_Calcutta_19th_Century_-_Fish.jpg/800px-Kalighat_Painting_Calcutta_19th_Century_-_Fish.jpg",
    description: "Bold, simplified forms with satirical social commentary"
  },
  {
    name: "Pichwai",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pichwai_Painting.jpg/800px-Pichwai_Painting.jpg",
    description: "Devotional paintings of Lord Krishna with rich details"
  },
  {
    name: "Warli",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Warli_painting.jpg/800px-Warli_painting.jpg",
    description: "Tribal art using white geometric shapes on brown background"
  }
];

const ExampleGallery = ({ onSelectImage }: ExampleGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectExample = (index: number) => {
    setSelectedIndex(index);
    const example = EXAMPLE_IMAGES[index];
    onSelectImage(example.url, example.name);
  };

  return (
    <div className="bento-card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-foreground/10 flex items-center justify-center rounded">
          <Image className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold">Example Gallery</h3>
          <p className="text-xs text-muted-foreground">Click to analyze sample artworks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {EXAMPLE_IMAGES.map((example, index) => {
          const styleInfo = artStyles.find(s => s.name === example.name);
          return (
            <button
              key={example.name}
              onClick={() => handleSelectExample(index)}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedIndex === index 
                  ? 'border-foreground ring-2 ring-foreground/20' 
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${styleInfo?.imageUrl || example.url})`,
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-2">
                <p className="text-xs font-bold text-foreground truncate">{example.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{styleInfo?.origin}</p>
              </div>

              {/* Hover Play Icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5 text-background ml-0.5" />
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedIndex === index && (
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-4 h-4 text-foreground animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center font-mono">
        Click any sample to see AI analysis in action
      </p>
    </div>
  );
};

export default ExampleGallery;