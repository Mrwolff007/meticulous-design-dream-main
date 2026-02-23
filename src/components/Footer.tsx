import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { seoPages } from "@/data/seoPages";

const Footer = () => {
  // Group pages by category
  const locationPages = seoPages.filter((p) => p.category === "location");
  const categoryPages = seoPages.filter((p) => p.category === "category");
  const servicePages = seoPages.filter((p) => p.category === "service");

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logoklkautocar.png" 
                alt="KLK AUTO CAR Logo" 
                className="h-14 w-14 rounded-lg"
              />
              <span className="font-display text-lg font-bold text-foreground">
                KLK <span className="text-accent">AUTO</span> CAR
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Location de voitures au Maroc. Service premium, prix compétitifs.
            </p>
            <div className="flex gap-3 pt-4">
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
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Accueil
              </Link>
              <Link to="/vehicules" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Véhicules
              </Link>
              <Link to="/reservation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Réservation
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/a-propos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                À propos
              </Link>
            </div>
          </div>

          {/* Location au Maroc */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Location voiture au Maroc</h4>
            <div className="flex flex-col gap-2">
              {locationPages.map((page) => (
                <Link
                  key={page.slug}
                  to={`/seo/${page.slug}`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Types de Véhicules */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Types de véhicules</h4>
            <div className="flex flex-col gap-2">
              {categoryPages.map((page) => (
                <Link
                  key={page.slug}
                  to={`/seo/${page.slug}`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Nos services</h4>
            <div className="flex flex-col gap-2">
              {servicePages.map((page) => (
                <Link
                  key={page.slug}
                  to={`/seo/${page.slug}`}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} KLK AUTO CAR. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

