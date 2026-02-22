import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé ! Nous vous répondrons rapidement.");
  };

  return (
    <Layout>
      <section className="py-16">
        <div className="container px-4">
          <motion.div className="text-center mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="mb-2">
              <p className="text-foreground/60 font-medium tracking-[0.4em] uppercase text-xs sm:text-sm">Nous parler</p>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground">
              Contactez-
              <br />
              <span className="text-gradient">Nous</span>
            </h1>
            <motion.div variants={fadeUp} custom={1} className="mt-4">
              <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent mx-auto"></div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
              <motion.div variants={fadeUp} custom={0}>
                <Card className="border-border">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1 text-foreground">Téléphone / WhatsApp</h3>
                        <p className="text-sm text-muted-foreground">+212 6XX XXX XXX</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1 text-foreground">Email</h3>
                        <p className="text-sm text-muted-foreground">contact@klkautocar.ma</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1 text-foreground">Adresse</h3>
                        <p className="text-sm text-muted-foreground">Maroc</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp} custom={1}>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="font-display font-semibold mb-4 text-foreground">Suivez-nous</h3>
                    <div className="flex gap-3">
                      <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                        <Facebook className="h-4 w-4" />
                      </a>
                      <a href="#" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
                        <Youtube className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold mb-6 text-foreground">Envoyez-nous un message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Votre nom" required />
                      <Input placeholder="Votre email" type="email" required />
                    </div>
                    <Input placeholder="Sujet" required />
                    <Textarea placeholder="Votre message..." rows={5} required />
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 glow-accent">Envoyer</Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <Card className="border-border overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217752.05295093498!2d-8.08368325!3d31.63461155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma"
                  width="100%"
                  height="400"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation KLK Autocar"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
