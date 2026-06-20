export interface Product {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  origin: string;
  flavorNotes: string;
  ingredients: string;
  weight: string;
  price: string; // e.g. "₹395" or "On Demand"
  pairings: string;
  awards: string;
  story: string;
  cacaoPercentage: number | null;
  farmerSpotlight: {
    name: string;
    location: string;
    story: string;
  };
  nutritionalFacts: {
    fat: string;
    sugar: string;
    protein: string;
    calories: string;
  };
  category: string[];
  frequentlyBoughtWith: string[];
}

export const products: Product[] = [
  {
    id: "sig-dark-75",
    title: "Signature Dark 75%",
    subtitle: "WESTERN GHATS SINGLE ESTATE",
    image: "/images/product_dark.png",
    origin: "Western Ghats, Tamil Nadu",
    flavorNotes: "Wild cherry, molasses, and roasted espresso",
    ingredients: "Organic cacao beans, organic cane sugar, organic cocoa butter",
    weight: "80g",
    price: "₹395",
    pairings: "Single malt whisky, dark roast espresso, Cabernet Sauvignon",
    awards: "Great Taste Awards - 3 Gold Stars",
    story: "Sourced from the foothills of the Western Ghats, this single-origin bar is roasted at a precise convection temperature to unlock the deep, earthy cherry notes native to South Indian soil.",
    cacaoPercentage: 75,
    farmerSpotlight: {
      name: "Ranganathan Family",
      location: "Anaimalai Valley, TN",
      story: "The Ranganathans have practiced mixed agroforestry for three generations. They grow tall coconut trees and pepper vines to provide shade, creating a microclimate that prevents soil erosion and naturally balances the bean's acidity."
    },
    nutritionalFacts: {
      fat: "32g",
      sugar: "22g",
      protein: "7g",
      calories: "530 kcal"
    },
    category: ["Dark Chocolate", "Single Origin", "Best Sellers"],
    frequentlyBoughtWith: ["malabar-milk-55", "artisan-curations-box"]
  },
  {
    id: "malabar-milk-55",
    title: "Salted Caramel Milk 55%",
    subtitle: "CREAMY MALABAR COAST SOURCED",
    image: "/images/product_milk.png",
    origin: "Malabar Coast, Kerala",
    flavorNotes: "Caramelized wild honey, creamy vanilla, sea salt flakes",
    ingredients: "Organic cacao, grass-fed A2 milk solids, organic cane sugar, cocoa butter, hand-harvested sea salt",
    weight: "80g",
    price: "₹395",
    pairings: "Jasmine tea, light roast pour-over, fresh raspberries",
    awards: "International Chocolate Awards - Gold Medalist",
    story: "A luxurious reinterpretation of milk chocolate. High cacao content balances the rich sweetness of grass-fed A2 milk solids, finished with hand-harvested Malabar sea salt flakes.",
    cacaoPercentage: 55,
    farmerSpotlight: {
      name: "Joseph Philip",
      location: "Kottayam District, Kerala",
      story: "Joseph manages a 4-acre organic plot intercropped with A2 cows grazing nearby. The integration of livestock and spice crops creates rich organic compost, giving the cacao beans a distinct sweet malt flavor."
    },
    nutritionalFacts: {
      fat: "29g",
      sugar: "35g",
      protein: "8g",
      calories: "515 kcal"
    },
    category: ["Milk Chocolate", "Best Sellers"],
    frequentlyBoughtWith: ["sig-dark-75", "monsoon-harvest-spiced"]
  },
  {
    id: "anaimalai-85",
    title: "Anaimalai Estate 85%",
    subtitle: "ULTRA DARK SINGLE ESTATE",
    image: "/images/product_single_origin.png",
    origin: "Anaimalai Hills, Tamil Nadu",
    flavorNotes: "Citrus zest, jasmine blossom, black tea undertones",
    ingredients: "Single-estate organic cacao beans, organic cane sugar",
    weight: "80g",
    price: "₹425",
    pairings: "Aged rum, dark oolong tea, roasted almonds",
    awards: "Best Fine Cacao Origin 2025",
    story: "Sourced from a single agroforestry estate in the Anaimalai Hills. The cocoa trees grow in the shade of coconut palms and pepper vines, infusing the beans with a bright, floral complexity.",
    cacaoPercentage: 85,
    farmerSpotlight: {
      name: "Murugan Selvam",
      location: "Anaimalai Hills, TN",
      story: "Murugan runs a zero-pesticide, biodiversity-first farm. By farming organically alongside local forest ranges, his trees draw nutrients from leaf mulch, creating complex herbal highlights in the bean."
    },
    nutritionalFacts: {
      fat: "35g",
      sugar: "14g",
      protein: "9g",
      calories: "545 kcal"
    },
    category: ["Dark Chocolate", "Single Origin"],
    frequentlyBoughtWith: ["sig-dark-75", "seasonal-discovery-subscription"]
  },
  {
    id: "monsoon-harvest-spiced",
    title: "Monsoon Harvest Spiced",
    subtitle: "LIMITED SEASONAL INFUSION",
    image: "/images/product_seasonal.png",
    origin: "Western Ghats, India",
    flavorNotes: "Spiced orange blossom, warm gingerbread, cloves",
    ingredients: "Organic cacao beans, cane sugar, cocoa butter, dried orange peel, cardamom, cloves, cinnamon",
    weight: "80g",
    price: "₹450",
    pairings: "Spiced mulled wine, hot cocoa infusions, dark porter beer",
    awards: "Artisan Innovation Award Nominee 2026",
    story: "Crafted exclusively during the winter monsoon harvest. We infuse our limited-edition bars with hand-plucked botanicals and spices that thrive in the monsoon rain.",
    cacaoPercentage: 68,
    farmerSpotlight: {
      name: "Saraswathi Nair",
      location: "Wayanad, Kerala",
      story: "Saraswathi gathers seasonal spices from wild shrubs surrounding her forest cacao groves. The spices are solar-dried and ground on stone mortars before infusing into the warm chocolate."
    },
    nutritionalFacts: {
      fat: "30g",
      sugar: "28g",
      protein: "6g",
      calories: "510 kcal"
    },
    category: ["Limited Editions", "Festive Collections"],
    frequentlyBoughtWith: ["rose-pistachio-white", "artisan-curations-box"]
  },
  {
    id: "rose-pistachio-white",
    title: "Rose & Pistachio White Infusion",
    subtitle: "FESTIVE EDITION",
    image: "/images/product_seasonal.png",
    origin: "Malabar, India",
    flavorNotes: "Delicate rose water, toasted green pistachios, milk cream",
    ingredients: "Organic cocoa butter, organic cane sugar, whole milk powder, green pistachios, organic rose petals",
    weight: "80g",
    price: "₹450",
    pairings: "Cardamom chai, sweet champagne, Turkish delights",
    awards: "Best Festive Confection 2026",
    story: "A rich white chocolate base using cold-pressed cocoa butter, heavily studded with hand-shelled Iranian pistachios and organic damask rose petals. Light, floral, and deeply satisfying.",
    cacaoPercentage: 38,
    farmerSpotlight: {
      name: "Kamala Devi",
      location: "Madurai, Tamil Nadu",
      story: "Kamala operates a family rose garden. Her damask roses are harvested at dawn when their oil concentration is peak, and steam-distilled into pure hydrosol used to scent our sugar blends."
    },
    nutritionalFacts: {
      fat: "36g",
      sugar: "38g",
      protein: "7g",
      calories: "560 kcal"
    },
    category: ["Limited Editions", "Festive Collections"],
    frequentlyBoughtWith: ["monsoon-harvest-spiced", "festive-heritage-box"]
  },
  {
    id: "artisan-curations-box",
    title: "Artisan Curations Gift Box",
    subtitle: "GOLD EMBOSSED GIFT TRIO",
    image: "/images/product_gift_box.png",
    origin: "Multi-Estate Select",
    flavorNotes: "A curated assortment of three premier single origin bars",
    ingredients: "Varies per bar - selection includes 75% Signature, 55% Salted Caramel, and 85% Anaimalai",
    weight: "240g",
    price: "₹1,250",
    pairings: "Premium champagne, anniversary celebrations, fine cheeses",
    awards: "Luxury Packaging Design Winner 2025",
    story: "Housed in rigid matte-black boxes with embossed gold foil details. Each bar inside is wrapped by hand by local female artisans, making it the ultimate gesture of taste.",
    cacaoPercentage: null,
    farmerSpotlight: {
      name: "Mason Cooperative Artisans",
      location: "Auroville Atelier, India",
      story: "Our wrapping team comprises 12 local craftswomen who bind each box in custom handmade cotton paper and secure it with hand-stamped wax seals. Every box supports rural female entrepreneurship."
    },
    nutritionalFacts: {
      fat: "91g (Total Box)",
      sugar: "71g (Total Box)",
      protein: "24g (Total Box)",
      calories: "1,590 kcal"
    },
    category: ["Gift Boxes", "Best Sellers"],
    frequentlyBoughtWith: ["sig-dark-75", "malabar-milk-55"]
  },
  {
    id: "festive-heritage-box",
    title: "Festive Heritage Gift Box",
    subtitle: "LIMITED HOLIDAY HAMPER",
    image: "/images/product_gift_box.png",
    origin: "Multi-Estate Select",
    flavorNotes: "Includes Spice Infusions, Rose Pistachio, and Dark Sea Salt",
    ingredients: "Varies per selection. All items are certified organic.",
    weight: "480g",
    price: "₹2,450",
    pairings: "Celebratory dinners, family gatherings",
    awards: "Premium Gift curation of the Year",
    story: "Created for festive exchanges. This box includes two organic chocolate bars, four chocolate-coated almonds, and a brass oil lamp crafted by local artisans.",
    cacaoPercentage: null,
    farmerSpotlight: {
      name: "Atelier Gifting Team",
      location: "Auroville, India",
      story: "Curated with seasonal flowers and heritage copper tags. Designed to bring festive light and single origin luxury to homes across the nation."
    },
    nutritionalFacts: {
      fat: "180g (Total Box)",
      sugar: "145g (Total Box)",
      protein: "45g (Total Box)",
      calories: "3,180 kcal"
    },
    category: ["Gift Boxes", "Festive Collections"],
    frequentlyBoughtWith: ["monsoon-harvest-spiced", "rose-pistachio-white"]
  },
  {
    id: "single-origin-trio-bundle",
    title: "Single Origin Trio Bundle",
    subtitle: "TERROIR EXPEDITION SET",
    image: "/images/product_single_origin.png",
    origin: "Anaimalai Hills, Wayanad, and Malabar Coast",
    flavorNotes: "A progression from floral citrus to deep chocolate fudge",
    ingredients: "Organic cacao beans, organic cane sugar, cocoa butter",
    weight: "240g",
    price: "₹1,150",
    pairings: "Tasting journals, wine pairings",
    awards: "Cacao Terroir Champion 2026",
    story: "Explore how soil and microclimate dictate flavor. This bundle includes three distinct single origin bars, mapping a flavor journey across South India.",
    cacaoPercentage: null,
    farmerSpotlight: {
      name: "Cooperative Farmers",
      location: "Southern India Range",
      story: "A joint selection representing Murugan Selvam, Joseph Philip, and Saraswathi Nair. Three terroirs, three distinct stories, one unified bundle."
    },
    nutritionalFacts: {
      fat: "96g (Total Bundle)",
      sugar: "58g (Total Bundle)",
      protein: "24g (Total Bundle)",
      calories: "1,620 kcal"
    },
    category: ["Chocolate Bundles", "Best Sellers"],
    frequentlyBoughtWith: ["artisan-curations-box", "monthly-club-subscription"]
  },
  {
    id: "monthly-club-subscription",
    title: "Monthly Chocolate Club",
    subtitle: "RECURRING ATELIER CLUB",
    image: "/images/product_dark.png",
    origin: "Atelier Curations",
    flavorNotes: "Fresh micro-batches shipped immediately after stone grinding",
    ingredients: "Varies monthly. Includes test batches and unreleased products.",
    weight: "240g / Month",
    price: "₹999",
    pairings: "Exclusive membership benefits",
    awards: "Top Club Subscription 2025",
    story: "Join the inner circle. Every month, receive 3 bars of our freshest chocolates, including private micro-batches never sold in our catalog, directly from the refiner.",
    cacaoPercentage: null,
    farmerSpotlight: {
      name: "Head Chocolatier Team",
      location: "Mason Atelier, India",
      story: "Curated directly by our chocolate makers. Includes detailed sourcing notes, roasting parameters, and direct feedback channels to the farm team."
    },
    nutritionalFacts: {
      fat: "90g (Estimated)",
      sugar: "65g (Estimated)",
      protein: "22g (Estimated)",
      calories: "1,550 kcal"
    },
    category: ["Subscriptions"],
    frequentlyBoughtWith: ["seasonal-discovery-subscription"]
  },
  {
    id: "seasonal-discovery-subscription",
    title: "Seasonal Discovery Box",
    subtitle: "QUARTERLY TERROIR CRATE",
    image: "/images/product_seasonal.png",
    origin: "Estates Under Cloud Canopy",
    flavorNotes: "Infused seasonal harvests, dark collections, and truffles",
    ingredients: "Varies quarterly. Seasonal flora, organic cacao and honey.",
    weight: "500g / Quarter",
    price: "₹1,499",
    pairings: "Seasonal culinary pairings",
    awards: "Artisan Innovation Winner",
    story: "Shipped four times a year: Spring Equinox, Summer Solstice, Autumn Equinox, and Winter Monsoon. Celebrate the seasons through the lens of Indian fine cacao.",
    cacaoPercentage: null,
    farmerSpotlight: {
      name: "Atelier Curators",
      location: "Western Ghats, India",
      story: "Our quarterly box compiles small batch cacao with local artisan treats (like honey from wild Western Ghats hives or hand-roasted organic spices)."
    },
    nutritionalFacts: {
      fat: "190g (Estimated)",
      sugar: "135g (Estimated)",
      protein: "42g (Estimated)",
      calories: "2,980 kcal"
    },
    category: ["Subscriptions"],
    frequentlyBoughtWith: ["monthly-club-subscription"]
  },
  {
    id: "corporate-executive-set",
    title: "Corporate Executive Set",
    subtitle: "CUSTOM BRANDED COLLECTION",
    image: "/images/product_corporate.png",
    origin: "Custom Curations",
    flavorNotes: "Balanced, universally sophisticated, rich profiles",
    ingredients: "Highest grade single-estate chocolate and truffles",
    weight: "Custom Setup",
    price: "On Demand",
    pairings: "Professional boardrooms, client welcome packages",
    awards: "Corporate Luxury Icon 2026",
    story: "Designed for premium professional impressions. Customize with bespoke embossed bands, corporate logos, and customized greeting enclosures in pure executive elegance.",
    cacaoPercentage: null,
    farmerSpotlight: {
      name: "Bespoke Printing Partners",
      location: "Local Recycled Paper Mills",
      story: "We use organic ink and thick textured cotton fibers to emboss your company's insignia onto our packaging, creating a tactile identity that matches the chocolate's quality."
    },
    nutritionalFacts: {
      fat: "Variable",
      sugar: "Variable",
      protein: "Variable",
      calories: "Variable"
    },
    category: ["Corporate Gifting"],
    frequentlyBoughtWith: ["artisan-curations-box"]
  }
];
