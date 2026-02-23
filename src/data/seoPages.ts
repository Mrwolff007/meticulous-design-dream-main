export interface SEOPage {
  id: string;
  slug: string;
  title: string;
  category: "location" | "category" | "service";
  description: string;
  content: string;
  benefits?: string[];
}

export const seoPages: SEOPage[] = [
  // Location pages
  {
    id: "loc-marrakech",
    slug: "location-marrakech",
    title: "Location de voitures à Marrakech",
    category: "location",
    description: "Louez une voiture à Marrakech avec KLK AUTO CAR. Tarifs compétitifs, flotte moderne, livraison aéroport.",
    content: `Marrakech est l'une des destinations touristiques les plus prisées du Maroc. Pour explorer cette ville fascinante et ses alentours, rien de mieux qu'une location de voiture.

KLK AUTO CAR vous propose un service de location premium à Marrakech avec une flotte de véhicules récents et bien entretenus. Que vous voyagiez en couple, en famille ou en groupe, nous avons le véhicule idéal pour vous.

Notre service de livraison à l'aéroport de Marrakech Menara vous permet de commencer votre voyage sans stress. Récupérez simplement votre voiture à votre arrivée et explorez la ville à votre rythme.

Les tarifs de location à Marrakech commencent à partir de 20€/jour pour les voitures économiques. Tous nos véhicules incluent l'assurance tous risques, le kilométrage illimité et un support client 24/7.`,
    benefits: ["Livraison aéroport", "Kilométrage illimité", "Assurance incluse", "Support 24/7", "Tarifs à partir de 20€/jour"]
  },
  {
    id: "loc-casablanca",
    slug: "location-casablanca",
    title: "Location de voitures à Casablanca",
    category: "location",
    description: "Location de voitures à Casablanca - Aéroport, tarifs compétitifs. Réservez en ligne avec KLK AUTO CAR.",
    content: `Casablanca est la plus grande ville du Maroc et le premier port d'Afrique du Nord. Louez une voiture à Casablanca pour découvrir sa médina historique, son port impressionnant et ses plages magnifiques.

KLK AUTO CAR offre un service de location de qualité supérieure à Casablanca avec une large gamme de voitures adaptées à tous les besoins et tous les budgets.

Notre bureau principal est situé près de l'aéroport international de Casablanca – Aéroport Mohammed V, ce qui facilite votre récupération de voiture à votre arrivée. Nous proposons également des services de navette et de transfer adaptés à vos horaires.

Avec nos options de location longue durée, vous pouvez explorer la région à un prix encore plus avantageux. L'assurance tous risques, le GPS et le support client 24/7 sont inclus dans tous nos forfaits.`,
    benefits: ["Aéroport Mohammed V", "Location longue durée", "Navette incluse", "GPS fourni", "Assistance routière 24/7"]
  },
  {
    id: "loc-fes",
    slug: "location-fes",
    title: "Location de voitures à Fès",
    category: "location",
    description: "Louez une voiture à Fès pour explorer la médina la plus ancienne d'Afrique. Service professionnel KLK AUTO CAR.",
    content: `Fès est une ville ancestrale réputée pour sa médina labyrinthique, ses souks colorés et son artisanat traditionnel. Pour exploiter au maximum votre visite, la location d'une voiture est la solution idéale.

KLK AUTO CAR vous propose une large sélection de véhicules à Fès, parfaits pour naviguer dans les ruelles étroites de la médina et explorer les sites touristiques plus éloignés.

De la visite du Palais Royal aux randonnées dans les montagnes du Moyen Atlas, votre voiture de location vous accompagnera dans toutes vos aventures. Nos équipes expérimentées connaissent bien la région et peuvent vous conseiller sur les meilleures routes et attractions à découvrir.

Profitez de nos tarifs spéciaux pour les locations multi-jours et explorez librement la ville antique tout en bénéficiant du confort d'un service de qualité premium.`,
    benefits: ["Médina historique", "Montagnes du Moyen Atlas", "Tarifs groupes", "Conseils touristiques", "Voitures climatisées"]
  },
  
  // Category pages
  {
    id: "cat-economique",
    slug: "voitures-economiques",
    title: "Voitures économiques à louer au Maroc",
    category: "category",
    description: "Location de voitures économiques à partir de 20€/jour. Parfait pour explorer le Maroc avec un petit budget.",
    content: `Les voitures économiques sont le choix idéal pour les voyageurs en quête de budget. Elles sont parfaites pour naviguer dans les villes, parcourir les routes du Maroc et offrir un excellent rapport qualité-prix.

Chez KLK AUTO CAR, nos voitures économiques incluent des modèles fiables et récents comme la Peugeot 208, la Renault Clio et la Citroën C1. Ces véhicules consomment très peu de carburant, ce qui vous permet d'économiser sur l'essence tout au long de votre voyage.

Parfaites pour les trajets en ville ou les périples à travers le Maroc, ces voitures offrent une excellente manoeuvrable et sont faciles à garer. Malgré leur taille compacte, elles offrent un confort surprenant et une bonne climatisation.

Nos voitures économiques incluent l'assurance tous risques, le kilométrage illimité et le support client 24/7. Vous pouvez réserver en ligne en quelques clics et bénéficier de nos tarifs spéciaux pour les locations longue durée.`,
    benefits: ["À partir de 20€/jour", "Petite consommation carburant", "Faciles à garer", "Modernes et propres", "Réservation flexible"]
  },
  {
    id: "cat-luxe",
    slug: "voitures-luxe",
    title: "Location de voitures de luxe au Maroc",
    category: "category",
    description: "Voitures de luxe pour une expérience premium. BMW, Mercedes, Audi à louer pour vos événements.",
    content: `Pour une expérience de voyage exceptionnelle au Maroc, optez pour nos voitures de luxe. KLK AUTO CAR vous propose une sélection exclusive de véhicules haut de gamme pour vous assurer un confort maximal.

Nos voitures de luxe incluent les derniers modèles BMW, Mercedes-Benz, Audi et Range Rover. Chaque véhicule est impeccablement entretenu, climatisé et équipé des dernières technologies de confort et de sécurité.

Parfaites pour les événements spéciaux, les mariages, les anniversaires ou simplement pour profiter d'une expérience de conduite premium, nos voitures de luxe vous garantissent un voyage inoubliable. Laissez-vous séduire par l'élégance, la puissance et le raffinement de ces véhicules prestigieux.

Que vous voyagiez seul ou en groupe, nos voitures de luxe offrent un espace intérieur généreux, une isolation acoustique exceptionnelle et des performances routières incomparables. Tous les services additionnels comme le chauffeur privé ou les services de concierge peuvent être arrangés.`,
    benefits: ["Modèles BMW, Mercedes, Audi", "Intérieur cuir premium", "Technologie de pointe", "Chauffeur disponible", "Services VIP"]
  },
  {
    id: "cat-suv",
    slug: "suv-location",
    title: "Location de SUV - Explorez le Maroc sans limites",
    category: "category",
    description: "SUV 4x4 pour adventure au Maroc. Parfait pour les routes de montagne et les terrains accidentés.",
    content: `Les SUV sont les véhicules idéaux pour explorer les paysages variés du Maroc, des montagnes du Rif aux déserts du Sahara. Avec leur traction intégrale et leur garde au sol élevée, les SUV offrent sécurité et polyvalence.

KLK AUTO CAR propose une gamme complète de SUV modernes, incluant le Toyota RAV4, le Renault Koleos et le Dacia Duster. Ces véhicules spacieux offrent suffisamment de place pour la famille et les bagages, tout en garantissant une conduite confortable et sécurisée.

Idéaux pour les familles en vacances, les aventuriers et ceux qui veulent explorer les routes moins fréquentées, nos SUV combinent confort urbain et capacité tout-terrain. Avec la climatisation, le GPS intégré et l'assurance tous risques, vous pouvez partir l'esprit tranquille.

Nos SUV sont particulièrement recommandés pour les routes de montagne comme l'Atlas, les randonnées vers les vallées isolées, et les expéditions dans le Sahara. Profitez de tarifs spéciaux pour les locations de plusieurs jours et explorez le Maroc de manière authentique.`,
    benefits: ["Traction intégrale", "Spacieux et confortable", "Montagne et désert", "GPS intégré", "Pack familial"]
  },
  
  // Service pages
  {
    id: "srv-assurance",
    slug: "assurance-location",
    title: "Assurance voiture de location - Protection complète",
    category: "service",
    description: "Assurance automobile complète. Tous risques, couverture casse, franchise réduite à 0€.",
    content: `L'assurance lors d'une location de voiture est essentielle pour voyager l'esprit tranquille. KLK AUTO CAR propose une couverture d'assurance automobile complète et flexible pour tous nos clients.

Notre assurance tous risques inclut:
- Responsabilité civile illimitée
- Dommages collatéraux (casse, détérioration)
- Vol et tentative de vol
- Incendie
- Franchise minimale ou réduite selon l'option choisie
- Assistance routière 24/7

Vous pouvez choisir entre plusieurs niveaux de protection en fonction de vos besoins et de votre budget. Notre assurance sans franchise premium est particulièrement populaire auprès des clients souhaitant une protection maximale.

En cas d'accident, notre équipe est disponible rapidement pour vous assister. Nous gérons directement les dossiers d'assurance et les démarches administratives, ce qui signifie moins de stress pour vous. Votre sécurité et votre tranquillité d'esprit sont notre priorité absolue.

Avec KLK AUTO CAR, vous bénéficiez également d'une couverture d'assistance juridique et de conseils en cas d'incident routier. Tous nos contrats d'assurance sont conformes aux normes marocaines et internationales.`,
    benefits: ["Tous risques inclus", "Assistance 24/7", "Franchise flexible", "Couverture juridique", "Sinistres simplifiés"]
  },
  {
    id: "srv-conducteur",
    slug: "location-chauffeur",
    title: "Location avec chauffeur professionnel au Maroc",
    category: "service",
    description: "Louez une voiture avec chauffeur expérimenté. Service VIP pour business ou tourisme.",
    content: `Voyager avec un chauffeur professionnel vous permet de profiter pleinement de votre séjour au Maroc sans les tracas de la conduite. KLK AUTO CAR propose un service de location de voiture avec chauffeur, idéal pour les clients d'affaires et les touristes recherchant le service VIP.

Nos chauffeurs sont:
- Expérimentés et connaisseurs des routes marocaines
- Bilingues (français/anglais)
- Courtois et professionnels
- Formés à la sécurité routière
- Disponibles 24/7

Le service avec chauffeur est parfait pour:
- Les transferts aéroport vers hôtel
- Les circuits touristiques organisés
- Les déplacements professionnels
- Les événements spéciaux (mariage, séminaire)
- Les explorations du Maroc en toute tranquillité

Vous pouvez vous détendre, admirer les paysages, travailler ou faire des appels sans vous préoccuper de la route. Nos chauffeurs connaissent les meilleurs restaurants, les sites touristiques cachés et peuvent vous recommander les meilleures expériences locales.

Tarifs transparents, sans frais cachés. Le carburant, le péage et l'assurance sont inclus. Personnalisez votre itinéraire selon vos préférences et votre emploi du temps.`,
    benefits: ["Chauffeurs expérimentés", "Multilingues", "Flexibilité horaire", "Véhicules premium", "Itinéraires personnalisés"]
  },
  {
    id: "srv-transfer",
    slug: "transfer-aeroport",
    title: "Transfer aéroport Maroc - Service rapide et fiable",
    category: "service",
    description: "Transfer aéroport Marrakech, Casablanca, Agadir. Accueil personnalisé, tarifs fixes.",
    content: `Commencez ou terminez votre voyage au Maroc de manière sereine avec notre service de transfer aéroport. KLK AUTO CAR propose un transfer rapide, fiable et abordable de tous les aéroports principaux du Maroc vers votre destination.

Nos services de transfer:
- Transfert depuis l'aéroport de Marrakech Menara
- Transfert depuis l'aéroport Mohammed V de Casablanca
- Transfert depuis l'aéroport de Fès-Saïss
- Transfert depuis l'aéroport d'Agadir-Al Massira
- Transfert vers/depuis votre hôtel ou riad

Comment ça marche:
1. Réservez votre transfer en ligne avec votre numéro de vol
2. Notre chauffeur vous accueille à la sortie de l'aéroport avec un panneau à votre nom
3. Trajet confortable jusqu'à votre destination
4. Tarif fixe - pas de surcharge pour le trafic

Nos véhicules sont climatisés, propres et confortables. Nos chauffeurs connaissent les routes à perfection et les itinéraires les plus rapides. Nous proposons également des services d'attente en cas de retard de vol - pas d'inquiétude, nous serons toujours là.

Réservez dès maintenant et bénéficiez de 10% de réduction si vous combinez votre transfer avec une location de voiture.`,
    benefits: ["Tarif fixe garanti", "Accueil personnalisé", "Tous les aéroports", "Ponctualité assurée", "Véhicules confortables"]
  },
];
