import ArtStyleCard from "./ArtStyleCard";
import { artStyles } from "@/data/artStyles";

const ArtStylesGrid = () => {
  return (
    <div className="space-y-6 perspective-2000 transform-3d">
      <div className="text-center mb-8 animate-fade-in-3d">
        <h2 className="text-2xl font-bold mb-2 text-3d">Indian Art Styles</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the rich heritage of Indian traditional art forms. Each style carries centuries 
          of cultural significance and unique artistic techniques.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-2000">
        {artStyles.map((style, index) => (
          <ArtStyleCard
            key={style.name}
            name={style.name}
            origin={style.origin}
            description={style.description}
            characteristics={style.characteristics}
            colors={style.colors}
            imageUrl={style.imageUrl}
            galleryImage={style.galleryImage}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ArtStylesGrid;
