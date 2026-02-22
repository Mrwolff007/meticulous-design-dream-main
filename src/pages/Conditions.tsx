import Layout from "@/components/Layout";

const Conditions = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container px-4 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-widest uppercase text-sm mb-2">Légal</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold">Conditions Générales</h1>
          </div>

          <div className="space-y-8 text-muted-foreground">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Conditions de location</h2>
              <p>Le locataire doit être âgé de 21 ans minimum et être titulaire d'un permis de conduire valide depuis au moins 2 ans. Une pièce d'identité (CIN ou passeport) sera demandée lors de la prise en charge du véhicule.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Caution</h2>
              <p>Une caution sera demandée au début de chaque location. Le montant varie selon le véhicule choisi. La caution sera restituée intégralement à la restitution du véhicule si celui-ci est rendu dans l'état initial.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Assurance</h2>
              <p>Tous nos véhicules sont couverts par une assurance tous risques. En cas d'accident, le locataire devra immédiatement informer KLK AUTO CAR et les autorités compétentes.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Carburant</h2>
              <p>Le véhicule est remis avec un niveau de carburant déterminé. Le locataire s'engage à restituer le véhicule avec le même niveau de carburant.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Kilométrage</h2>
              <p>Le kilométrage est illimité sur tous nos véhicules, sauf mention contraire lors de la réservation.</p>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Annulation</h2>
              <p>Toute annulation effectuée 48h avant la date de prise en charge est gratuite. En deçà de ce délai, des frais d'annulation pourront être appliqués.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Conditions;
