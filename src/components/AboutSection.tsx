import { Info, Database, Cpu, Star } from "lucide-react";

const AboutSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bento-card col-span-1 md:col-span-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-foreground flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-background" />
          </div>
          <div>
            <h3 className="font-bold mb-2">About IKARA</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              IKARA is an AI-based classifier trained to recognize Indian art styles such as 
              Madhubani, Kerala Mural, Gond, Kangra, Mandana, Kalighat, Pichwai, and Warli. 
              Our deep learning model analyzes visual patterns to identify traditional art forms.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bento-card">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">MODEL</span>
        </div>
        <p className="text-2xl font-bold">VGG16</p>
        <p className="text-sm text-muted-foreground mt-1">Transfer Learning</p>
      </div>
      
      <div className="bento-card">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">STYLES</span>
        </div>
        <p className="text-2xl font-bold">8</p>
        <p className="text-sm text-muted-foreground mt-1">Art Categories</p>
      </div>
    </div>
  );
};

export default AboutSection;
