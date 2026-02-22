import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Fuel, Users, Settings2, ChevronRight, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

interface Vehicle {
  id: string;
  model: string;
  color: string;
  price_per_day: number;
  deposit: number;
  mileage: string;
  fuel: string;
  transmission: string;
  seats: number;
  available: boolean;
  image_url: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const Vehicules = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data } = await supabase.from("vehicles").select("*").order("model");
      if (data) setVehicles(data as Vehicle[]);
    };
    fetchVehicles();
  }, []);

  const models = ["all", ...new Set(vehicles.map((v) => v.model))];
  const filtered = filter === "all" ? vehicles : vehicles.filter((v) => v.model === filter);

  return (
    <Layout>
      <section className="py-16">
        <div className="container px-4">
<motion.div className="text-center mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <div className="mb-2">
            <p className="text-foreground/60 font-medium tracking-[0.4em] uppercase text-xs sm:text-sm">Notre collection</p>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground">
            Notre Flotte
            <br />
            <span className="text-gradient">Exceptionnelle</span>
          </h1>
          <motion.div variants={fadeUp} custom={1} className="mt-4">
            <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto"></div>
          </motion.div>
          </motion.div>

          {/* Value Proposition Section */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div className="text-center" variants={fadeUp} custom={0}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <div className="w-6 h-6 bg-accent rounded-full"></div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Flotte moderne</h3>
              <p className="text-sm text-muted-foreground">Véhicules 2025 récents et régulièrement entretenus pour votre sécurité.</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeUp} custom={1}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <div className="w-6 h-6 bg-accent rounded-full"></div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Support 24/7</h3>
              <p className="text-sm text-muted-foreground">Assistance disponible jour et nuit, partout au Maroc.</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeUp} custom={2}>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4">
                <div className="w-6 h-6 bg-accent rounded-full"></div>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Tarifs clairs</h3>
              <p className="text-sm text-muted-foreground">Prix transparents et compétitifs, sans frais cachés.</p>
            </motion.div>
          </motion.div>

          {/* Filters */}
          <motion.div className="container mx-auto px-4 py-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Button
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 h-9 px-4 py-2 has-[>svg]:px-3"
              onClick={() => setFilter("all")}
            >
              <Filter className="h-4 w-4" />
              Filtres ({filtered.length} Résultats)
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((vehicle, i) => (
              <motion.div
                key={vehicle.id}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={scaleUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="group overflow-hidden glass-card hover:border-accent/50 transition-all duration-300 hover:glow-accent">
                  <div className="aspect-video bg-secondary relative overflow-hidden">
                    <img
                      src={vehicle.image_url || "/placeholder.svg"}
                      alt={`${vehicle.model} ${vehicle.color}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        vehicle.available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {vehicle.available ? "Disponible" : "Loué"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display text-lg font-semibold text-foreground">{vehicle.model}</h3>
                      <span className="text-sm text-muted-foreground">{vehicle.color}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{vehicle.fuel}</span>
                      <span className="flex items-center gap-1"><Settings2 className="h-3 w-3" />{vehicle.transmission}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{vehicle.seats} places</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">Kilométrage: {vehicle.mileage}</div>
                    <div className="text-sm text-muted-foreground mb-4">Caution: {vehicle.deposit}€</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-foreground">{vehicle.price_per_day}€</span>
                        <span className="text-sm text-muted-foreground">/jour</span>
                      </div>
                      <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link to={`/reservation?vehicle=${vehicle.id}`}>
                          Réserver <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Vehicules;
