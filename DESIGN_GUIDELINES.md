# 🎨 KLKAUTOCAR DESIGN CONSTANTS & GUIDELINES

## 📦 Imports Essentiels

Tous les fichiers de page et composants doivent avoir:

```tsx
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
```

---

## 🎨 GLASS-MORPHISM CLASSES

### Utilisation Standard

#### Pour les Cartes
```tsx
<Card className="glass-card">
  <CardContent className="p-6">
    {/* Contenu */}
  </CardContent>
</Card>
```

#### Pour les Sections
```tsx
<div className="glass-lg rounded-2xl p-8">
  {/* Section container */}
</div>
```

#### Pour les Inputs
```tsx
<Input className="glass-input" placeholder="..." />
```

#### Pour les Boutons
```tsx
<Button className="glass-button">Action</Button>
```

---

## ✨ ANIMATIONS FRAMER MOTION

### Pattern Fade Up (Standard)
```tsx
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

// Usage
<motion.div 
  initial="hidden" 
  whileInView="visible" 
  viewport={{ once: true }} 
  variants={fadeUp} 
  custom={0}
>
  Content
</motion.div>
```

### Pattern Scale Up (Cartes)
```tsx
const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};
```

---

## 🎯 PALETTE COULEURS

### Utilisation CSS Classes

```tsx
// Accent Red (CTA)
className="bg-accent text-accent-foreground"

// Text Gradient
className="text-gradient"

// Glow Effects
className="glow-accent"
className="glow-sm" | "glow-md" | "glow-lg"

// Glass Effects
className="glass glass-md glass-lg glass-xl"
```

---

## 📏 SPACING & SIZING

### Margins & Padding Standard
```tsx
// Sections
py-16 md:py-20 lg:py-24  // Vertical padding
px-4 md:px-6 lg:px-8     // Horizontal padding

// Container
max-w-5xl mx-auto         // Centré & limited width

// Cards
p-6 md:p-8                // Padding interne

// Gap between elements
gap-6 md:gap-8            // Grid/Flex gap
```

---

## 🔤 TYPOGRAPHIE

### Titres
```tsx
// H1 - Hero Titles
className="font-display text-4xl md:text-6xl lg:text-7xl font-bold"

// H2 - Section Titles
className="font-display text-3xl md:text-5xl font-bold"

// H3 - Subsections
className="font-display text-2xl font-bold"

// Label / Surtitles
className="font-medium tracking-[0.4em] uppercase text-xs sm:text-sm text-foreground/60"
```

### Corps Texte
```tsx
// Texte normal
className="text-base text-foreground"

// Texte faible
className="text-sm text-muted-foreground"

// Texte accents
className="text-sm text-accent"
```

---

## 🎭 COMPOSANTS RÉCURRENTS

### Hero Section avec Titre Animé
```tsx
<section className="relative py-24 md:py-32 overflow-hidden">
  <motion.div 
    initial="hidden" 
    animate="visible" 
    className="text-center"
  >
    <motion.p variants={fadeUp} custom={0} 
      className="text-foreground/60 font-medium tracking-[0.3em] uppercase text-sm mb-4">
      Subtitle
    </motion.p>
    <motion.h1 variants={fadeUp} custom={1} 
      className="font-display text-6xl font-bold mb-6 text-hover-glow cursor-default text-foreground">
      Main Title
    </motion.h1>
  </motion.div>
</section>
```

### Card Grid avec Glass
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map((item, i) => (
    <motion.div key={item.id} variants={scaleUp} custom={i}>
      <Card className="glass-card">
        <CardContent className="p-6">
          {/* Content */}
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

### Stats Counter
```tsx
<motion.div variants={fadeUp} custom={0}>
  <Card className="glass-card text-center p-8">
    <Icon className="h-8 w-8 text-accent mx-auto mb-4" />
    <span className="text-4xl font-bold text-accent font-display">
      {count}{suffix}
    </span>
    <p className="text-muted-foreground mt-2 font-medium">{label}</p>
  </Card>
</motion.div>
```

### Form Container
```tsx
<motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
  <Card className="glass-card">
    <CardContent className="p-6">
      <h3 className="font-display text-lg font-semibold mb-6 text-foreground">
        Title
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
      </form>
    </CardContent>
  </Card>
</motion.div>
```

---

## 🚀 CHECKLIST NOUVELLE PAGE

Lors de créer une nouvelle page, assurer:

- [ ] Import `motion` de framer-motion
- [ ] Import `Card, CardContent` du UI
- [ ] Layout wrapper avec `<Layout>`
- [ ] Hero section avec titre animé
- [ ] Fade-up animations sur scroll
- [ ] Glass-card sur toutes les cartes
- [ ] Glass-morphism sur les sections
- [ ] Glow-accent sur les CTA
- [ ] Responsive design (mobile-first)
- [ ] Parallax section optionnel
- [ ] Footer with Layout

---

## 🎨 EXEMPLE PAGE COMPLÈTE

```tsx
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function NewPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32">
        <div className="container px-4">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            className="text-center max-w-3xl mx-auto"
          >
            <motion.p 
              variants={fadeUp} 
              custom={0} 
              className="text-foreground/60 font-medium tracking-[0.3em] uppercase text-sm mb-4"
            >
              Subtitle
            </motion.p>
            <motion.h1 
              variants={fadeUp} 
              custom={1} 
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground"
            >
              Main Title
            </motion.h1>
            <motion.p 
              variants={fadeUp} 
              custom={2} 
              className="text-muted-foreground text-lg leading-relaxed"
            >
              Description content
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container px-4 max-w-5xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <motion.h2 
              variants={fadeUp} 
              custom={0} 
              className="font-display text-3xl md:text-5xl font-bold text-foreground"
            >
              Section Title
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeUp} 
                custom={i}
              >
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-bold mb-2 text-foreground">
                      Card Title
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Card description
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
```

---

## 📝 NOTES IMPORTANTES

1. **Toujours** utiliser `glass-card` pour les cartes principales
2. **Toujours** ajouter animations fade-up/scale-up au scroll
3. **Toujours** utiliser `glow-accent` sur les CTA
4. **Toujours** respecter les spacing (py-16-24, px-4-8)
5. **Toujours** centrer le contenu avec `max-w-5xl mx-auto`
6. **Jamais** utiliser `border-border` sur les cartes (utiliser glass-card)
7. **Jamais** oublier les labels de surtitres avec `uppercase text-xs`

---

**Dernière mise à jour:** 22/02/2026  
**Version:** 1.0 - Design System Stable
