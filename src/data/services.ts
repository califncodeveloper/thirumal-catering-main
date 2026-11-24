import type { LucideIcon } from "lucide-react";
import { Heart, Building2, Cake, Home, Flame, Sparkles } from "lucide-react";

export type Service = {
  id: string;
  title: string;
  desc: string;
  image: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    id: "weddings",
    title: "Weddings",
    desc: "Grand traditional South Indian wedding feasts served on banana leaves with authentic flavors that honor your special day.",
    image: "/images/wedding-event-hall.jpg",
    icon: Heart,
  },
  {
    id: "corporate",
    title: "Corporate Events",
    desc: "Professional catering for conferences, launches, and office gatherings with punctual service and refined presentation.",
    image: "/images/corporate-south-indian.jpg",
    icon: Building2,
  },
  {
    id: "birthdays",
    title: "Birthdays",
    desc: "Joyful spreads for milestone birthdays with signature sweets, savouries, and crowd-pleasing tiffin varieties.",
    image: "/images/birthday-south-indian.jpg",
    icon: Cake,
  },
  {
    id: "housewarming",
    title: "Housewarming",
    desc: "Auspicious Grihapravesh catering with traditional prasadam-style meals to bless your new home.",
    image: "/images/housewarming-ceremony.jpg",
    icon: Home,
  },
  {
    id: "temple",
    title: "Temple Functions",
    desc: "Sattvik, pure vegetarian offerings prepared with devotion for temple utsavams and religious ceremonies.",
    image: "/images/about-hero-feast.jpg",
    icon: Flame,
  },
  {
    id: "custom",
    title: "Custom Events",
    desc: "Tailored menus for baby showers, reunions, retirements, and any occasion that calls for exceptional food.",
    image: "/images/custom-event-catering.jpg",
    icon: Sparkles,
  },
];
