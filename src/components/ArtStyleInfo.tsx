import { ChevronDown, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const artStyles = [
  {
    name: "Madhubani",
    origin: "Bihar",
    description: "Characterized by complex geometrical patterns, natural elements, and scenes from mythology. Uses natural dyes and pigments.",
  },
  {
    name: "Kerala Mural",
    origin: "Kerala",
    description: "Temple art featuring Hindu deities with bold outlines, vivid colors, and intricate detailing. Known for its distinctive eye styling.",
  },
  {
    name: "Gond",
    origin: "Madhya Pradesh",
    description: "Tribal art using dots and lines to create images of nature, animals, and folklore. Features vibrant colors and intricate patterns.",
  },
  {
    name: "Kangra",
    origin: "Himachal Pradesh",
    description: "Miniature paintings depicting love, devotion, and nature. Known for delicate brushwork and soft, lyrical colors.",
  },
  {
    name: "Mandana",
    origin: "Rajasthan",
    description: "Floor and wall paintings using geometric and figurative patterns. Traditionally created using chalk and red ochre.",
  },
  {
    name: "Kalighat",
    origin: "West Bengal",
    description: "Bold, simplified paintings originally created as souvenirs near the Kalighat temple. Known for its satirical social commentary.",
  },
  {
    name: "Pichwai",
    origin: "Rajasthan",
    description: "Large devotional paintings depicting Lord Krishna. Features intricate details, rich colors, and textile-like patterns.",
  },
  {
    name: "Warli",
    origin: "Maharashtra",
    description: "Tribal art using basic geometric shapes to depict daily life, nature, and celebrations. Uses white pigment on mud walls.",
  },
];

const ArtStyleInfo = () => {
  const searchOnGoogle = (styleName: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(styleName + " Indian art style")}`, "_blank");
  };

  return (
    <div className="bento-card">
      <h3 className="text-lg font-bold mb-4">About Indian Folk Arts</h3>
      <Accordion type="single" collapsible className="w-full">
        {artStyles.map((style, index) => (
          <AccordionItem key={style.name} value={`item-${index}`}>
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground w-6">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-medium">{style.name}</span>
                <span className="text-xs text-muted-foreground">({style.origin})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-9 space-y-3">
                <p className="text-muted-foreground">{style.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => searchOnGoogle(style.name)}
                  className="font-mono text-xs"
                >
                  View More <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ArtStyleInfo;
