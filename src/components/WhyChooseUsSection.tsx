import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Gauge, Truck } from "lucide-react";

const tabs = [
  {
    id: "vehicules",
    title: "Véhicules récents",
    icon: ShieldCheck,
    heading: "Une flotte moderne",
    subheading: "et fiable",
    description:
      "KLKAUTOCAR met à votre disposition des véhicules récents, propres et parfaitement entretenus. Profitez d'un confort optimal et d'une conduite sécurisée partout au Maroc.",
  },
  {
    id: "kilometrage",
    title: "Kilométrage illimité",
    icon: Gauge,
    heading: "Voyagez",
    subheading: "sans limite",
    description:
      "Partez à la découverte du Maroc sans vous soucier du nombre de kilomètres. Nos offres incluent le kilométrage illimité pour une liberté totale.",
  },
  {
    id: "livraison",
    title: "Livraison gratuite",
    icon: Truck,
    heading: "Livraison à domicile",
    subheading: "ou aéroport",
    description:
      "Recevez votre véhicule à l'endroit de votre choix au Maroc. Service rapide, ponctuel et sans frais supplémentaires.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function WhyChooseUsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="py-24 overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* Title Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div variants={fadeUp} custom={0} className="mb-2">
            <p className="text-foreground/60 font-medium tracking-[0.4em] uppercase text-xs sm:text-sm">
              Nos points forts
            </p>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground"
          >
            Pourquoi Choisir
            <br />
            <span className="text-gradient">KLKAUTOCAR</span>
          </motion.h2>
          <motion.div variants={fadeUp} custom={2} className="mt-4">
            <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto"></div>
          </motion.div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated Icon Block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="flex justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.6, rotateZ: -10 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotateZ: 10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center shadow-2xl backdrop-blur-sm"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <activeTab.icon className="w-20 h-20 sm:w-24 sm:h-24 text-accent" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Text Block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id + "text"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-foreground leading-[1.2]">
                  {activeTab.heading}
                  <br />
                  <span className="text-gradient">{activeTab.subheading}</span>
                </h3>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-6">
                  {activeTab.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-16"
        >
          {tabs.map((tab, index) => {
            const TabIcon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border backdrop-blur-sm group ${
                  activeTab.id === tab.id
                    ? "bg-accent/90 text-white border-accent shadow-lg shadow-accent/30 hover:bg-accent"
                    : "bg-white/5 border-border hover:border-accent/50 text-foreground hover:bg-white/10"
                }`}
              >
                <TabIcon
                  className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${
                    activeTab.id === tab.id ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="hidden sm:inline">{tab.title}</span>
                <span className="sm:hidden">{tab.title.split(" ")[0]}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
