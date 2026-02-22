import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Target, Car, Users, Calendar } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Layout from "@/components/Layout";
import ParallaxSection from "@/components/ParallaxSection";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const AnimatedCounter = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-accent font-display">
      {count}{suffix}
    </span>
  );
};

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%/0.04),transparent_60%)]" />
        <div className="container px-4 max-w-5xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" className="text-center">
            <motion.p variants={fadeUp} custom={0} className="text-foreground/60 font-medium tracking-[0.3em] uppercase text-sm mb-4">
              Notre histoire
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-hover-glow cursor-default text-foreground">
              KLK AUTO CAR
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Née d'une passion pour l'automobile et d'un engagement envers l'excellence,
              KLK AUTO CAR redéfinit la location de voitures au Maroc.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Notre histoire */}
      <ParallaxSection speed={12} className="py-20">
        <div className="container px-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-foreground/60 font-medium tracking-[0.3em] uppercase text-sm mb-3">Les origines</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-foreground">Une vision, un homme</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Tout a commencé avec <span className="text-foreground font-medium">Mokhtar Rajji</span>,
                  un passionné d'automobiles qui rêvait de rendre la mobilité accessible à tous au Maroc.
                  Fort de son expérience dans le secteur automobile, il a fondé KLK AUTO CAR avec une ambition simple
                  mais puissante : offrir un service de location premium sans le prix premium.
                </p>
                <p>
                  Chaque véhicule de notre flotte est choisi avec soin, entretenu méticuleusement et préparé
                  pour que chaque client vive une expérience de conduite exceptionnelle. De Casablanca à
                  Marrakech, d'Agadir à Tanger, nous accompagnons des milliers de voyageurs chaque année.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <Car className="h-16 w-16 text-accent mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold mb-2 text-foreground">Notre passion</h3>
              <p className="text-muted-foreground leading-relaxed">
                L'automobile n'est pas qu'un moyen de transport — c'est une liberté.
                Nous mettons notre passion au service de votre confort, pour que chaque
                trajet soit un plaisir et chaque voyage, une aventure inoubliable.
              </p>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* Nos chiffres */}
      <ParallaxSection speed={10} className="py-20 bg-secondary/30">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-foreground/60 font-medium tracking-[0.3em] uppercase text-sm mb-3">En chiffres</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold text-hover-glow cursor-default text-foreground">Notre impact</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Car, value: 25, suffix: "+", label: "Véhicules en flotte" },
              { icon: Users, value: 1500, suffix: "+", label: "Clients satisfaits" },
              { icon: Calendar, value: 5, suffix: "", label: "Années d'expérience" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} whileHover={{ y: -6 }}>
                <Card className="glass-card border-0 text-center p-8">
                  <stat.icon className="h-8 w-8 text-accent mx-auto mb-4" />
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <p className="text-muted-foreground mt-2 font-medium">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Mission / Valeurs / Engagement */}
      <ParallaxSection speed={8} className="py-20">
        <div className="container px-4 max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <motion.p variants={fadeUp} custom={0} className="text-foreground/60 font-medium tracking-[0.3em] uppercase text-sm mb-3">Ce qui nous définit</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-5xl font-bold text-hover-glow cursor-default text-foreground">Nos engagements</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Notre Mission", desc: "Rendre la location de voiture accessible à tous avec un service premium à prix juste. Chaque client mérite le meilleur." },
              { icon: Heart, title: "Nos Valeurs", desc: "Transparence, fiabilité et satisfaction client sont au cœur de notre engagement. Pas de frais cachés, pas de mauvaises surprises." },
              { icon: Shield, title: "Notre Engagement", desc: "Véhicules assurés tous risques, entretenus régulièrement et livrés dans un état impeccable. Votre sécurité est notre priorité." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} whileHover={{ y: -8 }}>
                <Card className="glass-card border-0 h-full">
                  <CardContent className="p-8 text-center">
                    <motion.div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5" whileHover={{ scale: 1.2, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <item.icon className="h-7 w-7 text-accent" />
                    </motion.div>
                    <h3 className="font-display text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>
    </Layout>
  );
};

export default About;
