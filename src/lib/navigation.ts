export interface NavItem {
  label: string;
  to: string;
  links: { label: string; to: string }[];
  featured: {
    title: string;
    subtitle: string;
    description: string;
    linkTo: string;
    linkText: string;
  };
  offer: {
    title: string;
    subtitle: string;
    description: string;
    linkTo: string;
    linkText: string;
  };
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Earrings",
    to: "/collections/earrings",
    links: [],
    featured: {
      title: "The Lotus",
      subtitle: "Stud Collection",
      description: "Elegant everyday studs",
      linkTo: "/collections/earrings",
      linkText: "Shop now",
    },
    offer: {
      title: "Buy 1 Get 1",
      subtitle: "on Select Studs",
      description: "Mix & match pairs",
      linkTo: "/collections/earrings",
      linkText: "View offers",
    },
  },
  {
    label: "Necklace",
    to: "/collections/necklace",
    links: [
      { label: "Statement Necklace", to: "/collections/necklace/statement-necklace" },
      { label: "Charm Necklace", to: "/collections/necklace/charm-necklace" },
      { label: "Everyday Necklace", to: "/collections/necklace/everyday-necklace" },
    ],
    featured: {
      title: "The Maharani",
      subtitle: "Statement Necklace",
      description: "Traditional heirloom piece",
      linkTo: "/collections/necklace/statement-necklace",
      linkText: "Shop now",
    },
    offer: {
      title: "Free Adjustments",
      subtitle: "on All Necklaces",
      description: "Lifetime resizing",
      linkTo: "/collections/necklace",
      linkText: "View offers",
    },
  },
  {
    label: "Rings",
    to: "/collections/rings",
    links: [],
    featured: {
      title: "The Celestial",
      subtitle: "Ring Collection",
      description: "0.5 ct certified diamond",
      linkTo: "/collections/rings",
      linkText: "Shop now",
    },
    offer: {
      title: "Free Engraving",
      subtitle: "on Rings",
      description: "Personalise your ring",
      linkTo: "/collections/rings",
      linkText: "View offers",
    },
  },
  {
    label: "Hoops",
    to: "/collections/hoops",
    links: [],
    featured: {
      title: "The Classic",
      subtitle: "Hoop Earrings",
      description: "Timeless hoop designs",
      linkTo: "/collections/hoops",
      linkText: "Shop now",
    },
    offer: {
      title: "Mini Hoops",
      subtitle: "Combo Deal",
      description: "Buy 2 get 5% off",
      linkTo: "/collections/hoops",
      linkText: "View offers",
    },
  },
  {
    label: "Earcuffs",
    to: "/collections/earcuffs",
    links: [],
    featured: {
      title: "The Edge",
      subtitle: "Earcuff Set",
      description: "Modern asymmetric cuffs",
      linkTo: "/collections/earcuffs",
      linkText: "Shop now",
    },
    offer: {
      title: "New Launch",
      subtitle: "Earcuff Edit",
      description: "Up to 20% off",
      linkTo: "/collections/earcuffs",
      linkText: "View offers",
    },
  },
  {
    label: "Kada",
    to: "/collections/kada",
    links: [
      { label: "Statement Kada", to: "/collections/kada/statement-kada" },
      { label: "Resin Kada", to: "/collections/kada/resin-kada" },
      { label: "Wooden Kada", to: "/collections/kada/wooden-kada" },
      { label: "Colorful Kada", to: "/collections/kada/colorful-kada" },
      { label: "Everyday Kada", to: "/collections/kada/everyday-kada" },
    ],
    featured: {
      title: "The Artisan",
      subtitle: "Resin Kada",
      description: "Handcrafted resin designs",
      linkTo: "/collections/kada/resin-kada",
      linkText: "Shop now",
    },
    offer: {
      title: "Flat 15% Off",
      subtitle: "on Kadas",
      description: "Limited time offer",
      linkTo: "/collections/kada",
      linkText: "View offers",
    },
  },
  {
    label: "Bracelets",
    to: "/collections/bracelets",
    links: [
      { label: "Gold Bracelet", to: "/collections/bracelets/gold-bracelet" },
      { label: "Charm Bracelet", to: "/collections/bracelets/charm-bracelet" },
      { label: "Tennis Bracelet", to: "/collections/bracelets/tennis-bracelet" },
      { label: "Everyday Bracelet", to: "/collections/bracelets/everyday-bracelet" },
    ],
    featured: {
      title: "The Eternity",
      subtitle: "Tennis Bracelet",
      description: "Certified diamond channel set",
      linkTo: "/collections/bracelets/tennis-bracelet",
      linkText: "Shop now",
    },
    offer: {
      title: "Gold Bracelet",
      subtitle: "Special Price",
      description: "Flat 10% off",
      linkTo: "/collections/bracelets/gold-bracelet",
      linkText: "View offers",
    },
  },
];
