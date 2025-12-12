import { useState } from "react";
import { Image, Sparkles } from "lucide-react";
import { artStyles } from "@/data/artStyles";

// Import gallery images
import warliImg from "@/assets/gallery/warli.png";
import pichwaiImg from "@/assets/gallery/pichwai.png";
import kalighatImg from "@/assets/gallery/kalighat.png";
import mandanaImg from "@/assets/gallery/mandana.png";
import kangraImg from "@/assets/gallery/kangra.png";
import gondImg from "@/assets/gallery/gond.png";
import keralaMuralImg from "@/assets/gallery/kerala_mural.png";
import madhubaniImg from "@/assets/gallery/madhubani.png";

interface ExampleGalleryProps {
  onSelectImage: (imageUrl: string, styleName: string) => void;
}

// Order: Warli, Pichwai, Kalighat, Mandana, Kangra, Gond, Kerala Mural, Madhubani
const EXAMPLE_IMAGES = [
  {
    name: "Warli",
    image: warliImg,
    description: "Traditional Warli art depicting a wedding couple dance scene with geometric shapes and stick figures, showcasing the tribal art form's characteristic white-on-brown aesthetic from Maharashtra."
  },
  {
    name: "Pichwai",
    image: pichwaiImg,
    description: "Sacred Pichwai painting featuring Shrinathji's divine cow (Gau Seva) surrounded by lotus flowers, representing the devotional art tradition from Nathdwara, Rajasthan."
  },
  {
    name: "Kalighat",
    image: kalighatImg,
    description: "Vibrant Kalighat pat painting of Goddess Durga with bold brushstrokes and vivid colors, exemplifying the 19th century Bengali folk art tradition from near the Kalighat temple."
  },
  {
    name: "Mandana",
    image: mandanaImg,
    description: "Intricate Mandana floor art featuring an elephant motif with decorative geometric borders, created using white chalk on red ochre base - a traditional Rajasthani folk art."
  },
  {
    name: "Kangra",
    image: kangraImg,
    description: "Delicate Kangra miniature painting depicting a woman playing music for deer in a lush landscape, showcasing the refined Pahari school's soft colors and romantic themes."
  },
  {
    name: "Gond",
    image: gondImg,
    description: "Colorful Gond tribal art featuring peacocks with intricate dot-and-line patterns, representing the ancient artistic traditions of Madhya Pradesh's Gond community."
  },
  {
    name: "Kerala Mural",
    image: keralaMuralImg,
    description: "Stunning Kerala Mural depicting a divine feminine figure with elaborate detailing, characteristic bold outlines, and the distinctive five-color palette of traditional temple murals."
  },
  {
    name: "Madhubani",
    image: madhubaniImg,
    description: "Classic Madhubani painting with four-panel composition showing birds, faces, fish, and Krishna-Radha, featuring the signature double-line borders and natural motifs from Bihar."
  }
];

const ExampleGallery = ({ onSelectImage }: ExampleGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tiltStyles, setTiltStyles] = useState<{ [key: number]: React.CSSProperties }>({});

  const handleSelectExample = (index: number) => {
    setSelectedIndex(index);
    const example = EXAMPLE_IMAGES[index];
    onSelectImage(example.image, example.name);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setTiltStyles(prev => ({
      ...prev,
      [index]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`,
        transition: 'transform 0.1s ease-out'
      }
    }));
  };

  const handleMouseLeave = (index: number) => {
    setTiltStyles(prev => ({
      ...prev,
      [index]: {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.3s ease-out'
      }
    }));
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ perspective: '1000px' }}>
        {EXAMPLE_IMAGES.map((example, index) => {
          const styleInfo = artStyles.find(s => s.name === example.name);
          return (
            <button
              key={example.name}
              onClick={() => handleSelectExample(index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={tiltStyles[index] || { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)' }}
              className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-shadow duration-300 ${
                selectedIndex === index 
                  ? 'border-foreground ring-2 ring-foreground/20 shadow-lg shadow-foreground/20' 
                  : 'border-border hover:border-foreground/50 hover:shadow-xl hover:shadow-foreground/10'
              }`}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ 
                  backgroundImage: `url(${example.image})`,
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-2">
                <p className="text-xs font-bold text-foreground truncate">{example.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{styleInfo?.origin}</p>
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

      {/* Description of selected image */}
      {selectedIndex !== null && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border animate-fade-in">
          <p className="text-xs font-mono text-muted-foreground mb-1">ABOUT THIS ARTWORK</p>
          <p className="text-sm text-foreground leading-relaxed">
            {EXAMPLE_IMAGES[selectedIndex].description}
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4 text-center font-mono">
        Click any sample to see AI analysis in action
      </p>
    </div>
  );
};

export default ExampleGallery;