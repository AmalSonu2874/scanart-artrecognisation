// Import gallery images for backgrounds
import warliImg from "@/assets/gallery/warli.png";
import pichwaiImg from "@/assets/gallery/pichwai.png";
import kalighatImg from "@/assets/gallery/kalighat.png";
import mandanaImg from "@/assets/gallery/mandana.png";
import kangraImg from "@/assets/gallery/kangra.png";
import gondImg from "@/assets/gallery/gond.png";
import keralaMuralImg from "@/assets/gallery/kerala_mural.png";
import madhubaniImg from "@/assets/gallery/madhubani.png";

export interface ArtStyle {
  name: string;
  origin: string;
  description: string;
  characteristics: string[];
  colors: string[];
  imageUrl: string;
  galleryImage: string;
  history: string;
  materials: string[];
  significance: string;
}

export const artStyles: ArtStyle[] = [
  {
    name: "Warli",
    origin: "Maharashtra, India",
    description: "Tribal art using basic geometric shapes to depict daily life, nature, and celebrations. Uses white pigment on mud walls creating a striking contrast.",
    characteristics: ["Geometric shapes", "White on brown", "Daily life scenes", "Circular motifs"],
    colors: ["#FFFFFF", "#8B4513", "#D2691E", "#F5DEB3", "#A0522D"],
    imageUrl: "https://images.unsplash.com/photo-1577083552792-a0d461cb1dd6?w=800&auto=format&fit=crop&q=60",
    galleryImage: warliImg,
    history: "Practiced by the Warli tribe for over 2,500 years, making it one of the oldest art forms in India.",
    materials: ["Rice paste", "Mud walls", "Bamboo sticks", "Cloth base"],
    significance: "UNESCO has recognized Warli art as an important intangible cultural heritage of humanity."
  },
  {
    name: "Pichwai",
    origin: "Nathdwara, Rajasthan, India",
    description: "Large devotional paintings depicting Lord Krishna in various moods and seasons. Features intricate details, rich colors, and textile-like patterns.",
    characteristics: ["Krishna themes", "Large scale", "Rich details", "Seasonal motifs"],
    colors: ["#000080", "#FFD700", "#FF0000", "#228B22", "#FFFFFF"],
    imageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&auto=format&fit=crop&q=60",
    galleryImage: pichwaiImg,
    history: "Originated in the temple town of Nathdwara, these paintings serve as backdrops for the deity Shrinathji.",
    materials: ["Starched cloth", "Natural dyes", "Gold and silver leaf", "Stone colors"],
    significance: "Each Pichwai is changed according to festivals and seasons, making them an essential part of worship rituals."
  },
  {
    name: "Kalighat",
    origin: "West Bengal, India",
    description: "Bold, simplified paintings originally created as souvenirs near the Kalighat temple. Known for its satirical social commentary and distinctive visual style.",
    characteristics: ["Bold strokes", "Social satire", "Simplified forms", "Temple souvenirs"],
    colors: ["#DC143C", "#000000", "#FFFFE0", "#4682B4", "#32CD32"],
    imageUrl: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=800&auto=format&fit=crop&q=60",
    galleryImage: kalighatImg,
    history: "Emerged in the 19th century near Kolkata's Kalighat temple, evolving from religious themes to sharp social commentary.",
    materials: ["Mill paper", "Watercolors", "Brushes", "Squirrel hair brushes"],
    significance: "Pioneered modern Indian art movement and influenced artists like Jamini Roy."
  },
  {
    name: "Mandana",
    origin: "Rajasthan, India",
    description: "Floor and wall paintings using geometric and figurative patterns. Traditionally created using chalk and red ochre for auspicious occasions and festivals.",
    characteristics: ["Floor art", "Geometric designs", "Festive themes", "Sacred symbols"],
    colors: ["#CD5C5C", "#F5F5DC", "#8B4513", "#FFFAF0", "#A0522D"],
    imageUrl: "https://images.unsplash.com/photo-1596397249129-c7a8f8e34e25?w=800&auto=format&fit=crop&q=60",
    galleryImage: mandanaImg,
    history: "Practiced by the Meena and Mina tribes for centuries, these paintings are created during festivals, weddings, and harvest celebrations.",
    materials: ["White chalk", "Red ochre", "Cow dung base", "Natural brushes"],
    significance: "Believed to bring good luck and ward off evil spirits, making it an integral part of rural Rajasthani culture."
  },
  {
    name: "Kangra",
    origin: "Himachal Pradesh, India",
    description: "Miniature paintings depicting love, devotion, and nature. Known for delicate brushwork, soft lyrical colors, and romantic themes from Indian poetry.",
    characteristics: ["Miniature style", "Delicate brushwork", "Romantic themes", "Soft colors"],
    colors: ["#87CEEB", "#98FB98", "#FFB6C1", "#F5DEB3", "#DDA0DD"],
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60",
    galleryImage: kangraImg,
    history: "Flourished under the patronage of Raja Sansar Chand in the 18th century, becoming the most refined school of Pahari miniature painting.",
    materials: ["Handmade paper", "Natural pigments", "Fine brushes", "Gold leaf"],
    significance: "Considered the peak of Indian miniature painting tradition, celebrated for its lyrical beauty."
  },
  {
    name: "Gond",
    origin: "Madhya Pradesh, India",
    description: "Tribal art using dots and lines to create images of nature, animals, and folklore. Features vibrant colors and intricate patterns inspired by the natural world.",
    characteristics: ["Dot patterns", "Nature motifs", "Tribal folklore", "Vibrant colors"],
    colors: ["#FF4500", "#32CD32", "#1E90FF", "#FFD700", "#FF69B4"],
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=60",
    galleryImage: gondImg,
    history: "Created by the Gond tribe, one of the largest tribal communities in India, this art has been practiced for over 1,400 years.",
    materials: ["Natural colors", "Charcoal", "Plant sap", "Colored soil"],
    significance: "Reflects the Gond philosophy that each natural element holds a spirit, making art a form of worship."
  },
  {
    name: "Kerala Mural",
    origin: "Kerala, India",
    description: "Temple art featuring Hindu deities with bold outlines, vivid colors, and intricate detailing. Known for its distinctive eye styling and divine expressions.",
    characteristics: ["Temple art", "Bold outlines", "Divine themes", "Distinctive eyes"],
    colors: ["#FF6B35", "#004E89", "#F8F8F8", "#1A1A2E", "#E8C547"],
    imageUrl: "https://images.unsplash.com/photo-1584806749948-697891c67821?w=800&auto=format&fit=crop&q=60",
    galleryImage: keralaMuralImg,
    history: "These murals flourished from the 9th to 12th centuries, adorning temple walls across Kerala with stories from Hindu epics.",
    materials: ["Natural pigments", "Lime base", "Plant extracts", "Stone colors"],
    significance: "Represents one of the finest examples of Indian classical art with strict adherence to ancient treatises."
  },
  {
    name: "Madhubani",
    origin: "Bihar, India",
    description: "Characterized by complex geometrical patterns, natural elements, and scenes from mythology. Uses natural dyes and pigments with eye-catching double line borders.",
    characteristics: ["Geometric patterns", "Double line borders", "Mythological themes", "Natural dyes"],
    colors: ["#D2691E", "#228B22", "#DC143C", "#FFD700", "#4169E1"],
    imageUrl: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&auto=format&fit=crop&q=60",
    galleryImage: madhubaniImg,
    history: "Originated in the Mithila region of Bihar, this art form dates back to the time of Ramayana when King Janaka commissioned artists to create paintings for his daughter Sita's wedding.",
    materials: ["Natural dyes", "Bamboo sticks", "Cotton cloth", "Handmade paper"],
    significance: "UNESCO has recognized Madhubani paintings as a significant contribution to world heritage."
  }
];
