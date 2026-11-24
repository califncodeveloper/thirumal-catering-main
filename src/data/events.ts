export type EventProject = {
  id: string;
  title: string;
  category: string;
  desc: string;
  image: string;
  stat: string;
};

export const events: EventProject[] = [
  {
    id: "wedding-tambaram",
    title: "Grand Tambaram Wedding",
    category: "Wedding",
    stat: "800 guests",
    desc: "A 5-course traditional wedding meal served on banana leaves across three sittings, complete with signature Mysore Pak and Kalyana Payasam.",
    image: "/images/wedding-event-hall.jpg",
  },
  {
    id: "reception-adyar",
    title: "Adyar Reception Evening",
    category: "Reception",
    stat: "500 guests",
    desc: "Elegant live-counter reception with 21-item dinner spread, Chettinad chaat station, and continental-inspired accents.",
    image: "/images/custom-event-catering.jpg",
  },
  {
    id: "corporate-omr",
    title: "OMR Corporate Launch",
    category: "Corporate",
    stat: "300 guests",
    desc: "Punctual multi-cuisine buffet across morning tiffin, lunch, and evening high-tea for a product launch on OMR.",
    image: "/images/corporate-south-indian.jpg",
  },
  {
    id: "temple-mylapore",
    title: "Mylapore Temple Utsavam",
    category: "Temple",
    stat: "1200 devotees",
    desc: "Sattvik annadhanam prepared and served with devotion during a 3-day temple festival, honoring every tradition.",
    image: "/images/about-hero-feast.jpg",
  },
  {
    id: "birthday-velachery",
    title: "60th Birthday Celebration",
    category: "Birthday",
    stat: "150 guests",
    desc: "A joyful shashtiabdapoorthi feast blending grandmother's recipes with a modern live-dosa counter.",
    image: "/images/birthday-south-indian.jpg",
  },
  {
    id: "housewarming-porur",
    title: "Porur Grihapravesh",
    category: "Housewarming",
    stat: "200 guests",
    desc: "Traditional Grihapravesh lunch on banana leaves with 17 items, ending with paan and sweet betel service.",
    image: "/images/housewarming-ceremony.jpg",
  },
];

export const galleryImages = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-8.jpg",
];
