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
    label: "New In",
    to: "/shop",
    links: [
      { label: "Latest Arrivals", to: "/shop" },
      { label: "Best Sellers", to: "/shop" },
      { label: "Trending", to: "/shop" },
      { label: "Limited Edition", to: "/collections" },
      { label: "Everyday Jewellery", to: "/collections" },
      { label: "Bridal New Arrivals", to: "/shop" },
    ],
    featured: {
      title: "The Aarav",
      subtitle: "Solitaire",
      description: "Best-seller this month",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Flat 22% Off",
      subtitle: "on Diamonds",
      description: "This week only",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Monthly Plans",
    to: "/shop",
    links: [
      { label: "Gold Savings Plan", to: "/shop" },
      { label: "Diamond Savings Plan", to: "/shop" },
      { label: "Monthly Jewellery Plan", to: "/shop" },
      { label: "Wedding Savings Plan", to: "/shop" },
      { label: "Plan Benefits", to: "/shop" },
      { label: "How It Works", to: "/faq" },
    ],
    featured: {
      title: "Gold Savings",
      subtitle: "Plan",
      description: "Start from ₹5,000/month",
      linkTo: "/shop",
      linkText: "Learn more",
    },
    offer: {
      title: "0% EMI",
      subtitle: "on All Plans",
      description: "No cost EMI available",
      linkTo: "/shop",
      linkText: "View plans",
    },
  },
  {
    label: "Rings",
    to: "/shop",
    links: [
      { label: "Solitaire Rings", to: "/shop" },
      { label: "Engagement Rings", to: "/shop" },
      { label: "Diamond Rings", to: "/shop" },
      { label: "Gold Rings", to: "/shop" },
      { label: "Couple Rings", to: "/shop" },
      { label: "Everyday Rings", to: "/shop" },
    ],
    featured: {
      title: "The Celestial",
      subtitle: "Diamond Ring",
      description: "0.5 ct certified diamond",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Free Engraving",
      subtitle: "on Rings",
      description: "Personalise your ring",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Earrings",
    to: "/shop",
    links: [
      { label: "Stud Earrings", to: "/shop" },
      { label: "Drop Earrings", to: "/shop" },
      { label: "Jhumkas", to: "/shop" },
      { label: "Hoop Earrings", to: "/shop" },
      { label: "Pearl Earrings", to: "/shop" },
      { label: "Bridal Earrings", to: "/shop" },
    ],
    featured: {
      title: "The Lotus",
      subtitle: "Jhumka Set",
      description: "22K gold with pearl drops",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Buy 1 Get 1",
      subtitle: "on Studs",
      description: "Mix & match pairs",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Necklaces",
    to: "/shop",
    links: [
      { label: "Gold Necklaces", to: "/shop" },
      { label: "Diamond Necklaces", to: "/shop" },
      { label: "Kundan Necklaces", to: "/shop" },
      { label: "Chokers", to: "/shop" },
      { label: "Layered Necklaces", to: "/shop" },
      { label: "Bridal Necklaces", to: "/shop" },
    ],
    featured: {
      title: "The Maharani",
      subtitle: "Kundan Necklace",
      description: "Traditional heirloom piece",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Free Adjustments",
      subtitle: "on All Necklaces",
      description: "Lifetime resizing",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Pendants",
    to: "/shop",
    links: [
      { label: "Gold Pendants", to: "/shop" },
      { label: "Diamond Pendants", to: "/shop" },
      { label: "Initial Pendants", to: "/shop" },
      { label: "Religious Pendants", to: "/shop" },
      { label: "Heart Pendants", to: "/shop" },
      { label: "Pendant Sets", to: "/shop" },
    ],
    featured: {
      title: "The Serenity",
      subtitle: "Gold Pendant",
      description: "Intricate filigree work",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Free Chain",
      subtitle: "with All Pendants",
      description: "Includes matching chain",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Bracelets",
    to: "/shop",
    links: [
      { label: "Diamond Bracelets", to: "/shop" },
      { label: "Gold Bracelets", to: "/shop" },
      { label: "Tennis Bracelets", to: "/shop" },
      { label: "Charm Bracelets", to: "/shop" },
      { label: "Couple Bracelets", to: "/shop" },
      { label: "Everyday Bracelets", to: "/shop" },
    ],
    featured: {
      title: "The Eternity",
      subtitle: "Tennis Bracelet",
      description: "Certified diamond channel set",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Flat 15% Off",
      subtitle: "on Bracelets",
      description: "Limited time offer",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Solitaires",
    to: "/shop",
    links: [
      { label: "Solitaire Rings", to: "/shop" },
      { label: "Solitaire Earrings", to: "/shop" },
      { label: "Solitaire Pendants", to: "/shop" },
      { label: "Solitaire Necklaces", to: "/shop" },
      { label: "Certified Diamonds", to: "/shop" },
      { label: "Engagement Collection", to: "/collections" },
    ],
    featured: {
      title: "The Royal",
      subtitle: "Solitaire Ring",
      description: "1 ct GIA certified",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Certificate Free",
      subtitle: "with Every Solitaire",
      description: "GIA/IGI certification",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "All Jewellery",
    to: "/shop",
    links: [
      { label: "Rings", to: "/shop" },
      { label: "Earrings", to: "/shop" },
      { label: "Necklaces", to: "/shop" },
      { label: "Pendants", to: "/shop" },
      { label: "Bracelets", to: "/shop" },
      { label: "Bangles", to: "/shop" },
      { label: "Mangalsutra", to: "/shop" },
      { label: "Wedding Sets", to: "/shop" },
    ],
    featured: {
      title: "The Grand",
      subtitle: "Wedding Set",
      description: "Complete bridal ensemble",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Complimentary Gift",
      subtitle: "on Orders Above ₹50,000",
      description: "Free jewellery box",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Gifts",
    to: "/shop",
    links: [
      { label: "Gifts for Her", to: "/shop" },
      { label: "Gifts for Mother", to: "/shop" },
      { label: "Anniversary Gifts", to: "/shop" },
      { label: "Birthday Gifts", to: "/shop" },
      { label: "Wedding Gifts", to: "/shop" },
      { label: "Gifts Under ₹25,000", to: "/shop" },
    ],
    featured: {
      title: "The Gift Box",
      subtitle: "Curated Set",
      description: "Handpicked jewellery in a keepsake box",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Free Gift Wrap",
      subtitle: "on All Gifts",
      description: "Luxury packaging included",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Gold Coins",
    to: "/shop",
    links: [
      { label: "1 Gram", to: "/shop" },
      { label: "2 Gram", to: "/shop" },
      { label: "5 Gram", to: "/shop" },
      { label: "10 Gram", to: "/shop" },
      { label: "Religious Coins", to: "/shop" },
      { label: "Custom Coins", to: "/shop" },
    ],
    featured: {
      title: "24K Pure Gold",
      subtitle: "Lakshmi Coin",
      description: "Certified 999.9 purity",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Lowest Making",
      subtitle: "Charge Guarantee",
      description: "Only 2% on coins",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
  {
    label: "Offers",
    to: "/shop",
    links: [
      { label: "Diamond Offers", to: "/shop" },
      { label: "Wedding Offers", to: "/shop" },
      { label: "New Customer Offer", to: "/shop" },
      { label: "Bundle Offers", to: "/shop" },
      { label: "Bank Offers", to: "/shop" },
      { label: "Limited-Time Deals", to: "/shop" },
    ],
    featured: {
      title: "Wedding Season",
      subtitle: "Mega Sale",
      description: "Up to 40% off selected items",
      linkTo: "/shop",
      linkText: "Shop now",
    },
    offer: {
      title: "Extra 5% Off",
      subtitle: "on Bank Cards",
      description: "ICICI, HDFC, SBI",
      linkTo: "/shop",
      linkText: "View offers",
    },
  },
];
