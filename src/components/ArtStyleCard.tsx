import { ExternalLink, MapPin, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtStyleCardProps {
  name: string;
  origin: string;
  description: string;
  characteristics: string[];
  colors: string[];
  imageUrl: string;
  index: number;
}

const ArtStyleCard = ({ 
  name, 
  origin, 
  description, 
  characteristics, 
  colors,
  imageUrl,
  index 
}: ArtStyleCardProps) => {
  const searchOnGoogle = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(name + " Indian art style")}`, "_blank");
  };

  return (
    <div 
      className="group relative bento-card overflow-hidden p-0 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background Image with painting visible */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Artistic gradient overlay with color influence */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            ${colors[0]}15 0%, 
            transparent 30%, 
            ${colors[1] || colors[0]}10 70%, 
            ${colors[2] || colors[0]}20 100%)`
        }}
      />
      
      {/* Main gradient overlay for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/60" />
      
      {/* Decorative corner accent */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-30"
        style={{
          background: `radial-gradient(circle at top right, ${colors[0]}40, transparent 70%)`
        }}
      />
      
      {/* Content */}
      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-mono text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-xl font-bold mt-1">{name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              <span>{origin}</span>
            </div>
          </div>
          
          {/* Color Palette */}
          <div className="flex gap-1">
            {colors.map((color, i) => (
              <div 
                key={i}
                className="w-4 h-4 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {description}
        </p>
        
        {/* Characteristics */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">CHARACTERISTICS</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {characteristics.map((char, i) => (
              <span 
                key={i}
                className="text-xs px-2 py-1 bg-muted/70 backdrop-blur-sm rounded font-mono border border-border/50"
                style={{
                  borderColor: `${colors[i % colors.length]}30`
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
        
        {/* Learn More Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={searchOnGoogle}
          className="w-full font-mono text-xs group-hover:bg-foreground group-hover:text-background transition-colors"
        >
          Learn More <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ArtStyleCard;
