import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, MapPin, Clock, Star, ChevronRight, Fuel, Users, Settings2, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import ParallaxSection from "@/components/ParallaxSection";
import VehicleCarousel3D from "@/components/VehicleCarousel3D";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

interface Vehicle {
  id: string;
  model: string;
  color: string;
  price_per_day: number;
  fuel: string;
  transmission: string;
  seats: number;
  available: boolean;
  image_url: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// Reviews Carousel Component
const ReviewsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviews = [
    {
      id: 1,
      name: "Ahmed B.",
      initials: "AB",
      badge: "Voyageur vérifié",
      text: "Service excellent ! Voiture propre et en parfait état. Je recommande vivement pour tous vos trajets au Maroc.",
      rating: 5,
      vehicle: "Dacia Logan",
    },
    {
      id: 2,
      name: "Sarah M.",
      initials: "SM",
      badge: "Client premium",
      text: "Livraison à l'aéroport impeccable. Prix très compétitif par rapport à la concurrence. Équipe professionnelle.",
      rating: 5,
      vehicle: "Peugeot 208",
    },
    {
      id: 3,
      name: "Youssef K.",
      initials: "YK",
      badge: "Voyage d'affaires",
      text: "Très professionnel. La Clio 5 était parfaite pour mon séjour à Marrakech. Je reviendrai sans hésiter.",
      rating: 5,
      vehicle: "Renault Clio 5",
    },
    {
      id: 4,
      name: "Fatima T.",
      initials: "FT",
      badge: "Touriste international",
      text: "Excellent service de location ! Véhicule impeccable et assistance 24/7 impeccable. Merci beaucoup !",
      rating: 5,
      vehicle: "Renault Scenic",
    },
    {
      id: 5,
      name: "Hassan R.",
      initials: "HR",
      badge: "Client régulier",
      text: "Septième fois que je loue chez KLKAUTOCAR. Confiance totale, qualité garantie et tarifs imbattables.",
      rating: 5,
      vehicle: "Dacia Sandero",
    },
    {
      id: 6,
      name: "Leila M.",
      initials: "LM",
      badge: "Famille",
      text: "Voiture spacieuse et confortable pour nos vacances en famille. Très satisfaite du service complet.",
      rating: 5,
      vehicle: "Toyota RAV4",
    },
    {
      id: 7,
      name: "Karim S.",
      initials: "KS",
      badge: "Client VIP",
      text: "Livraison express, assurance tous risques incluse, kilométrage illimité. L'offre parfaite pour un roadtrip !",
      rating: 5,
      vehicle: "Skoda Octavia",
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isPaused, reviews.length]);

  const visibleReviews = [
    reviews[(activeIndex - 1 + reviews.length) % reviews.length],
    reviews[activeIndex],
    reviews[(activeIndex + 1) % reviews.length],
  ];

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleReviews.map((review, index) => {
          const isCenter = index === 1;
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isCenter ? 1 : 0.6, scale: isCenter ? 1 : 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={isCenter ? "md:scale-105" : ""}
            >
              <div
                className={`relative h-full rounded-2xl border transition-all duration-300 ${
                  isCenter
                    ? "border-accent/50 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-accent/20"
                    : "border-border/50 bg-gradient-to-br from-white/8 via-white/5 to-white/2 backdrop-blur-md"
                } p-6 sm:p-8`}
              >
                {/* Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-display font-bold text-sm shadow-lg">
                    {review.initials}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-foreground text-sm sm:text-base">
                      {review.name}
                    </h4>
                    <p className="text-xs text-accent font-medium">{review.badge}</p>
                  </div>
                </div>

                {/* Stars - Golden Metallic */}
                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: j * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-300 drop-shadow-lg" />
                    </motion.div>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 italic">
                  "{review.text}"
                </p>

                {/* Vehicle Badge */}
                <div className="inline-block">
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/30 backdrop-blur-sm">
                    {review.vehicle}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8 flex-wrap">
        {reviews.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setActiveIndex(i);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 3000);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-8 bg-accent shadow-lg shadow-accent/50"
                : "w-2 bg-accent/30 hover:bg-accent/60"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
};

const Index = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.1]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase.from("vehicles").select("*").order("model").limit(6);
      if (data) setVehicles(data as Vehicle[]);
    };
    fetchVehicles();
  }, []);

  return (
    <Layout transparentNav>
      {/* Hero with Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/placeholder.svg"
          >
            <source src="/videos/klkautocarherovideo1.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background" />
        
        <motion.div 
          className="container relative z-10 px-4 text-center flex flex-col items-start justify-center min-h-screen"
          style={{ opacity: heroOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-foreground/70 font-medium tracking-[0.3em] uppercase text-sm mb-6"
          >
            Location de voitures au Maroc
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-12 text-hover-glow cursor-default text-foreground"
          >
            Réservez votre voiture
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-gradient"
            >
              à partir de 20€/jour
            </motion.span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <Link 
              to="/reservation"
              className="group relative inline-flex items-center px-8 py-3 backdrop-blur-md bg-white/10 text-white font-semibold uppercase tracking-wider text-xs border border-white/30 hover:bg-white/20 active:bg-accent active:text-black active:border-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>réserver maintenant</span>
              <ChevronRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/vehicules"
              className="group relative inline-flex items-center px-8 py-3 backdrop-blur-md bg-accent/20 border-2 border-white/30 text-white font-semibold uppercase tracking-wider text-xs hover:bg-accent/30 active:bg-accent active:text-black active:border-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>parcourir notre flotte</span>
              <ChevronRight className="h-4 w-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-accent"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Véhicules from DB - 3D Carousel */}
      <ParallaxSection speed={12} className="py-24">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-2">
              <p className="text-foreground/60 font-medium tracking-[0.4em] uppercase text-xs sm:text-sm">
                Notre collection
              </p>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground"
            >
              Nos Véhicules
              <br />
              <span className="text-gradient">Exceptionnels</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="mt-4">
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto"></div>
            </motion.div>
          </motion.div>

          <VehicleCarousel3D vehicles={vehicles} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Button asChild variant="outline" size="lg" className="border-accent/50 hover:border-accent">
              <Link to="/vehicules">Voir tous les véhicules <ChevronRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Pourquoi nous */}
      <ParallaxSection speed={10} className="py-24 bg-secondary/30">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-2">
              <p className="text-foreground/60 font-medium tracking-[0.4em] uppercase text-xs sm:text-sm">
                Nos forces
              </p>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground"
            >
              Pourquoi Nous
              <br />
              <span className="text-gradient">Choisir</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="mt-4">
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto"></div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: "Livraison aéroport", desc: "Récupérez votre voiture directement à l'aéroport" },
              { icon: Shield, title: "Assurance incluse", desc: "Tous nos véhicules sont assurés tous risques" },
              { icon: Clock, title: "Réservation rapide", desc: "Réservez en ligne en moins de 2 minutes" },
              { icon: Star, title: "Prix compétitifs", desc: "À partir de 20€/jour, sans frais cachés" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={scaleUp}
                whileHover={{ y: -6 }}
              >
                <Card className="text-center p-6 border-border hover:border-accent/30 transition-all duration-300 group">
                  <motion.div
                    className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="h-6 w-6 text-accent" />
                  </motion.div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Why Choose Us - Interactive Tabs Section */}
      <ParallaxSection speed={12} className="py-24 bg-secondary/20">
        <WhyChooseUsSection />
      </ParallaxSection>

      {/* Avis clients - Carousel */}
      <ParallaxSection speed={8} className="py-24">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-2">
              <p className="text-foreground/60 font-medium tracking-[0.4em] uppercase text-xs sm:text-sm">
                Témoignages
              </p>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground"
            >
              Ce que Disent
              <br />
              <span className="text-gradient">Nos Clients</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="mt-4">
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto"></div>
            </motion.div>
          </motion.div>

          <ReviewsCarousel />
        </div>
      </ParallaxSection>

      {/* FAQ */}
      <ParallaxSection speed={12} className="py-24">
        <div className="container px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-2">
              <p className="text-foreground/60 font-medium tracking-[0.4em] uppercase text-xs sm:text-sm">
                Questions fréquentes
              </p>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground"
            >
              FAQ -
              <br />
              <span className="text-gradient">Vos Questions</span>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="mt-4">
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto"></div>
            </motion.div>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-4">
            {[
              {
                question: "Quels documents sont nécessaires pour louer une voiture ?",
                answer: "Pour louer une voiture, vous devez fournir : votre permis de conduire valide, une pièce d'identité (CIN ou passeport), une preuve de domicile et une carte de crédit pour la caution. Assurez-vous que votre permis a at least 2 ans d'ancienneté et est valide.",
              },
              {
                question: "Quel est l'âge minimum pour louer une voiture ?",
                answer: "L'âge minimum pour louer une voiture chez KLK AUTO CAR est de 25 ans. Certains véhicules peuvent avoir des exigences d'âge supérieur en fonction de la politique de location spécifique.",
              },
              {
                question: "L'assurance est-elle incluse dans le prix ?",
                answer: "Oui, l'assurance tous risques est incluse dans tous nos tarifs de location. Cela signifie que vous bénéficiez d'une couverture d'endommagement, de vol et de tiers sans frais supplémentaires.",
              },
              {
                question: "Puis-je annuler ou modifier ma réservation ?",
                answer: "Vous pouvez modifier ou annuler votre réservation jusqu'à 24 heures avant la date de prise en charge sans frais. Pour les annulations effectuées moins de 24 heures avant, des frais peuvent s'appliquer.",
              },
              {
                question: "Livrez-vous à l'aéroport ?",
                answer: "Oui, nous proposons un service de livraison et de récupération directement à l'aéroport. Des frais de livraison peuvent s'appliquer selon la location. Réservez ce service lors de votre réservation.",
              },
              {
                question: "Le kilométrage est-il limité ?",
                answer: "Non, la plupart de nos véhicules offrent un kilométrage illimité. Cependant, veuillez vérifier les conditions spécifiques de votre réservation ou nous contacter directement pour les détails.",
              },
              {
                question: "Que se passe-t-il en cas d'accident ?",
                answer: "En cas d'accident, contactez-nous immédiatement. L'assurance tous risques couvrira les dégâts. Vous devrez nous fournir un rapport d'accident ou une déclaration de sinistre.",
              },
              {
                question: "Puis-je louer une voiture pour un long terme (1 mois ou plus) ?",
                answer: "Oui, nous offrons des tarifs de location à long terme avec réductions. Contactez-nous directement via WhatsApp +212619700592 ou par email pour discuter des tarifs adaptés à votre durée.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
              >
                <Collapsible className="group">
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between rounded-lg bg-secondary/50 px-6 py-4 hover:bg-secondary transition-colors border border-border hover:border-accent/30">
                      <span className="text-left font-semibold text-foreground">{item.question}</span>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:collapse data-[state=open]:expand">
                    <div className="px-6 py-4 text-sm text-muted-foreground border border-border border-t-0 rounded-b-lg bg-background/40">
                      {item.answer}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">Vous avez d'autres questions ?</p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact">Contactez-nous</Link>
            </Button>
          </motion.div>

          {/* JSON-LD Schema for FAQ SEO */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Quels documents sont nécessaires pour louer une voiture ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pour louer une voiture, vous devez fournir : votre permis de conduire valide, une pièce d'identité (CIN ou passeport), une preuve de domicile et une carte de crédit pour la caution."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Quel est l'âge minimum pour louer une voiture ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "L'âge minimum pour louer une voiture chez KLK AUTO CAR est de 25 ans."
                  }
                },
                {
                  "@type": "Question",
                  "name": "L'assurance est-elle incluse dans le prix ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Oui, l'assurance tous risques est incluse dans tous nos tarifs de location."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Puis-je annuler ou modifier ma réservation ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vous pouvez modifier ou annuler votre réservation jusqu'à 24 heures avant la date de prise en charge sans frais."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Livrez-vous à l'aéroport ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Oui, nous proposons un service de livraison et de récupération directement à l'aéroport."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Le kilométrage est-il limité ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Non, la plupart de nos véhicules offrent un kilométrage illimité."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Que se passe-t-il en cas d'accident ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "En cas d'accident, contactez-nous immédiatement. L'assurance tous risques couvrira les dégâts."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Puis-je louer une voiture pour un long terme ?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Oui, nous offrons des tarifs de location à long terme avec réductions."
                  }
                }
              ]
            })}
          </script>
        </div>
      </ParallaxSection>

      {/* CTA */}
      <ParallaxSection speed={6} className="py-24 bg-secondary/30">
        <div className="container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 text-hover-glow cursor-default text-foreground">
              Prêt à prendre la route ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Réservez votre véhicule dès maintenant et profitez de nos tarifs exceptionnels.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent pulse-glow text-lg px-12">
              <Link to="/reservation">Réserver maintenant</Link>
            </Button>
          </motion.div>
        </div>
      </ParallaxSection>
    </Layout>
  );
};

export default Index;
