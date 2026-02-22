import { Link } from "react-router-dom";
import { Car, Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-accent" />
              <span className="font-display text-lg font-bold text-foreground">
                KLK <span className="text-accent">AUTO</span> CAR
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Location de voitures au Maroc. Service premium, prix compétitifs.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Navigation</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
              <Link to="/vehicules" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Véhicules</Link>
              <Link to="/reservation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Réservation</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Légal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/a-propos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">À propos</Link>
              <Link to="/conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Conditions générales</Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Suivez-nous</h4>
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
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} KLK AUTO CAR. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
