import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { seoPages } from "@/data/seoPages";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const SEOPage = () => {
  const { slug } = useParams();
  const page = seoPages.find((p) => p.slug === slug);

  if (!page) {
    return (
      <Layout>
        <PageTransition>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Page non trouvée</h1>
              <Button asChild>
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  // Déterminer l'icône et la couleur selon la catégorie
  const getCategoryIcon = () => {
    if (page.category === "location") return MapPin;
    if (page.category === "category") return ChevronRight;
    return CheckCircle2;
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
          {/* Hero Section */}
          <div className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-30" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial="hidden"
                animate="visible"
                className="text-center max-w-3xl mx-auto"
              >
                <motion.div
                  variants={fadeUp}
                  custom={0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
                >
                  <CategoryIcon className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent capitalize">
                    {page.category === "location" && "Destination"}
                    {page.category === "category" && "Type de Véhicule"}
                    {page.category === "service" && "Service Premium"}
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="font-display text-5xl md:text-7xl font-bold leading-[1.1] text-foreground mb-6"
                >
                  {page.title}
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="text-xl text-muted-foreground mb-8 leading-relaxed"
                >
                  {page.description}
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to="/reservation">
                      Réserver maintenant
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/contact">
                      Nous contacter
                      <Phone className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-4 py-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
            >
              {/* Main content */}
              <div className="lg:col-span-2">
                <motion.div variants={fadeUp} custom={0} className="space-y-8">
                  {/* Content blocks */}
                  {page.content.split("\n\n").map((paragraph, i) => (
                    <motion.div
                      key={i}
                      variants={fadeUp}
                      custom={i}
                      className="glass-card p-6 md:p-8 rounded-xl border border-border/50"
                    >
                      <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {paragraph}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Sidebar - Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Highlight Card */}
                <Card className="glass-card border border-accent/20 overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold text-foreground mb-4">
                      Avantages KLK AUTO CAR
                    </h3>
                    <div className="space-y-3">
                      {page.benefits?.map((benefit, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Card */}
                <Card className="glass-card border border-accent/30 bg-gradient-to-br from-accent/10 via-accent/5 to-background overflow-hidden">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      Prêt à réserver?
                    </p>
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link to="/reservation">
                        Réserver maintenant
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="glass-card border border-border/50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-3">Besoin d'aide?</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Notre équipe est disponible 24/7 pour répondre à vos questions.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <a href="https://wa.me/212619700592" target="_blank" rel="noopener noreferrer">
                        Contacter via WhatsApp
                        <Phone className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="py-20 bg-accent/5 border-t border-b border-border/50"
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h2
                variants={fadeUp}
                custom={0}
                className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6"
              >
                Prêt à prendre la route?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Réservez maintenant et profitez de nos meilleurs tarifs. Assurance incluse, kilométrage illimité, support 24/7.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={2}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/reservation">
                    Réserver maintenant
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/vehicules">
                    Voir tous les véhicules
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation - Related Page */}
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center"
            >
              <motion.h3
                variants={fadeUp}
                custom={0}
                className="font-display text-2xl font-bold text-foreground mb-8"
              >
                Autres offres qui pourraient vous intéresser
              </motion.h3>
              <motion.div
                variants={fadeUp}
                custom={1}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {seoPages
                  .filter((p) => p.slug !== slug)
                  .slice(0, 3)
                  .map((relatedPage) => (
                    <Link
                      key={relatedPage.slug}
                      to={`/seo/${relatedPage.slug}`}
                      className="group"
                    >
                      <Card className="glass-card hover:border-accent/50 transition-all duration-300 h-full">
                        <CardContent className="p-6 text-left">
                          <p className="text-xs text-accent font-semibold uppercase mb-2">
                            {relatedPage.category === "location" && "Destination"}
                            {relatedPage.category === "category" && "Type de Véhicule"}
                            {relatedPage.category === "service" && "Service"}
                          </p>
                          <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                            {relatedPage.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {relatedPage.description}
                          </p>
                          <div className="mt-4 flex items-center text-accent text-sm font-medium">
                            En savoir plus
                            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default SEOPage;
