export interface SEOPage {
  id: string;
  slug: string;
  title: string;
  category: "location" | "category" | "service";
}

export const seoPages: SEOPage[] = [
  // Location pages
  {
    id: "loc-marrakech",
    slug: "location-marrakech",
    title: "Location de voitures à Marrakech",
    category: "location",
  },
  {
    id: "loc-casablanca",
    slug: "location-casablanca",
    title: "Location de voitures à Casablanca",
    category: "location",
  },
  {
    id: "loc-fes",
    slug: "location-fes",
    title: "Location de voitures à Fès",
    category: "location",
  },
  
  // Category pages
  {
    id: "cat-economique",
    slug: "voitures-economiques",
    title: "Voitures économiques à louer",
    category: "category",
  },
  {
    id: "cat-luxe",
    slug: "voitures-luxe",
    title: "Voitures de luxe",
    category: "category",
  },
  {
    id: "cat-suv",
    slug: "suv-location",
    title: "Location de SUV",
    category: "category",
  },
  
  // Service pages
  {
    id: "srv-assurance",
    slug: "assurance-location",
    title: "Assurance voiture de location",
    category: "service",
  },
  {
    id: "srv-conducteur",
    slug: "location-chauffeur",
    title: "Location avec chauffeur",
    category: "service",
  },
  {
    id: "srv-transfer",
    slug: "transfer-aeroport",
    title: "Transfer aéroport",
    category: "service",
  },
];
