
# Plan : Video hero, Navbar glassmorphism, textes animes et storytelling About

## 1. Video Hero avec voiture qui roule

### Fichier : `src/pages/Index.tsx`
- Remplacer la video actuelle par une video de voiture en mouvement sur route (URL Pexels/Coverr libre de droits montrant une voiture qui roule)
- Reduire l'opacite de l'overlay pour mieux voir la video
- Ajouter des animations de texte plus marquees : chaque mot/ligne apparait avec un fade-in degrade et un leger glissement

## 2. Navbar transparente avec effet glace au scroll

### Fichier : `src/components/Navbar.tsx`
- Au chargement : la navbar est completement transparente (pas de fond, pas de bordure)
- Au scroll (apres ~50px) : transition fluide vers un fond noir semi-transparent avec backdrop-blur (effet glace/verre depoli)
- Utiliser `useScroll` et `useMotionValueEvent` de Framer Motion pour detecter le scroll
- Les liens de navigation restent en blanc avec la police raffinee Playfair Display
- Le lien actif reste en rouge (primary)

## 3. Textes avec hover motion et fade-in/fade-out

### Fichier : `src/pages/Index.tsx`
- Ajouter un effet de hover sur les titres : leger scale-up et glow subtil au survol
- Enrichir les fade-in existants avec des durees plus longues et des easings plus doux
- Ajouter un underline anime au hover sur les sous-titres de section
- Les boutons CTA auront un effet de pulsation subtile au repos

## 4. Storytelling enrichi pour la page A propos

### Fichier : `src/pages/About.tsx`
- Restructurer la page avec une narration en sections chronologiques :
  - Section hero avec titre anime et phrase d'accroche immersive
  - "Notre histoire" : paragraphe narratif sur la creation de KLK AUTO CAR par Mokhtar Rajji, son parcours et sa vision
  - "Notre passion" : section sur l'amour des voitures et du service client
  - "Nos chiffres" : compteurs animes (nombre de vehicules, clients satisfaits, annees d'experience)
  - Les 3 cartes Mission/Valeurs/Engagement existantes avec animations enrichies
- Chaque section apparait en fade-in au scroll avec stagger
- Cartes avec effet glassmorphism (fond transparent + backdrop-blur)
- Animations Framer Motion sur chaque bloc

## 5. Styles CSS mis a jour

### Fichier : `src/index.css`
- Ajouter une classe `.glass-navbar` pour l'etat transparent et l'etat scroll de la navbar
- Ajouter `.text-hover-glow` pour l'effet de glow au survol des titres
- Ajouter `.glass-card` pour les cartes avec fond transparent et flou

---

## Details techniques

| Fichier | Changements |
|---|---|
| `src/components/Navbar.tsx` | Ajout useScroll, etat transparent par defaut, transition vers noir glace au scroll, liens blancs police raffinee |
| `src/pages/Index.tsx` | Nouvelle URL video (voiture roulant), animations texte hover + fade-in enrichis |
| `src/pages/About.tsx` | Restructuration storytelling, sections narratives, compteurs animes, glassmorphism cards |
| `src/index.css` | Classes glass-navbar, text-hover-glow, glass-card |
| `src/components/Layout.tsx` | Retirer le padding-top fixe quand la navbar est transparente (ajuster si necessaire) |
