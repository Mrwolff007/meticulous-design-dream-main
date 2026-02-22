# TEST COMPLET - TUNNEL DE RÉSERVATION KLK AUTO CAR

## Étapes de vérification

### **ÉTAPE 1 : Sélection du véhicule**
**URL**: `http://localhost:8081/reservation`

Checklist:
- [ ] La page se charge avec la liste des véhicules
- [ ] 3 véhicules visibles: Dacia Logan, Peugeot 208, Renault Clio 5
- [ ] Cliquer sur un véhicule le sélectionne (border accent, badge "Sélectionné")
- [ ] Le bouton flottant "Réservez !" apparaît sur le véhicule sélectionné
- [ ] Cliquer sur "Réservez !" avance à l'étape 2

---

### **ÉTAPE 2 : Dates et lieux**
- [ ] La progression affiche maintenant "Dates"

**Boutons lieux (ToggleGroup)**:
- [ ] 3 options visibles (Airports, Bureau Direct)
- [ ] Cliquer sur un lieu le sélectionne (fond accent, texte blanc)
- [ ] Le lieu de retour se synchronise AUTOMATIQUEMENT si "Retour au même lieu" est coché
- [ ] Cochez la case → champ "Lieu de retour" devient grisé (disabled)
- [ ] Le lieu de retour affiche la même valeur que le lieu de récupération
- [ ] Changez le lieu de récupération → le retour se met à jour automatiquement
- [ ] Décochez la case → champ "Lieu de retour" redevient actif et modifiable

- [ ] Sélectionner une date la remplit dans le champ (format dd/MM/yyyy)
- [ ] Les dates passées sont désactivées (grises)
- [ ] La date de fin ne peut pas être avant la date de début


**Bouton Suivant**:
- [ ] Désactivé tant que tous les champs ne sont pas remplis
- [ ] Cliquer "Suivant" tarif quotidienl'étape 3

---

### **ÉTAPE 3 : Informations personnelles + Documents**
**Attendus**:
- [ ] Progression affiche maintenant "Infos"
Attendusaire avec champs:
  - Prénom, Nom, Email, Téléphone, Adresse
  - CIN, Permis
  - Expiration du permis (calendrier)

- [ ] 3 zones de dépôt:
  - CIN Recto
  - CIN Verso
**Validation**:
- [ ] Téléphone doit être au format +212 ou 0 suivi de 6-7 ou 600000000
- [ ] CIN doit être au format marocain (A-Z + chiffres)
**Bouton Suivant**:
- [ ] Désactivé jusqu'à ce que tous les documents soient uploadés + formulaire valide
- [ ] Cliquer "Suivant" → avance à l'étape 4

---

### **ÉTAPE 4 : Confirmation et conditions**
Attendus:
- [ ] Résumé des conditions:
  - Informations exactes
  - Conditions de location acceptées
  - Caution remboursable après inspection
  - Assurance incluse

**Case à cocher**:
**Bouton Confirmer**:
- [ ] Visible et actif une fois la case cochée
- [ ] Cliquer "Confirmer" déclenche:
  1. Loading spinner + message d'envoi
  2. Création du client en DB (Supabase)
  3. Upload des 3 documents en Supabase Storage
  4. Création de la réservation
  5. Ouverture WhatsApp Direct avec le message

---

## MESSAGE WHATSAPP ATTENDU

**Format**: 
```
*RÉSERVATION KLK AUTO CAR*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*INFORMATIONS CLIENT*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Nom Complet:* [Prénom Nom]
*Téléphone:* [Téléphone]
*Email:* [Email]
*Adresse:* [Adresse]
*CIN:* [CIN]
*Permis:* [Permis]
*Expiration Permis:* [JJ/MM/YYYY]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*DÉTAILS VÉHICULE*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Modèle: [Modèle]
Couleur: [Couleur]
Carburant: [Carburant]
Transmission: [Transmission]
Places: [Nombre]
Tarif journalier: [X]€

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*DATES & LIEUX*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Prise en charge:*
   Lieu: [Lieu]
   Date: [JJ/MM/YYYY]
   Heure: [HH:MM]

*Restitution:*
   Lieu: [Lieu]
   Date: [JJ/MM/YYYY]
   Heure: [HH:MM]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*TARIFICATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Durée: X jour(s)
Montant location: XXX€
Caution: XXX€ (remboursable)
*Total à payer: XXX€*

[Si notes]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*DOCUMENTS FOURNIS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CIN Recto: [URL publique]
CIN Verso: [URL publique]
Permis de conduire: [URL publique]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Conditions acceptées:* Oui
*Assurance:* Incluse/À confirmer

Merci d'avoir choisi KLK AUTO CAR!
Nos équipes vous contactent sous peu.
```

**Vérifications critiques**:
- [ ] Message s'ouvre dans WhatsApp
- [ ] Destinataire: `+212619700592`
- [ ] Tous les champs sont remplis avec les données saisies
- [ ] Les URLs des documents sont cliquables

---

## PAGE DE CONFIRMATION

Après l'envoi WhatsApp:
- [ ] Message: "Nous vous contacterons rapidement."
- [ ] Bouton "Retour" vers `/`

---

## 🔧 POINTS TECHNIQUES À VALIDER

**Base de données** (Supabase):
- [ ] Client créé dans la table `clients`
- [ ] 3 documents uploadés dans le bucket `client-documents/`
- [ ] Réservation créée dans la table `reservations` avec réfs image

**Erreurs & Edge Cases**:
- [ ] Valider un formulaire incomplète → affiche erreur "Complétez tous les champs"
- [ ] Uploader un mauvais format de fichier → toast d'erreur
- [ ] Réduire la fenêtre → layout responsive fonctionne (mobile-first)

**Stockage**:
- [ ] Documents sont publiquement accessibles (vérifier URLs)
- [ ] `getPublicUrl()` retourne les bonnes URLs

---

## 📊 RÉSUMÉ DU TEST

**Résultat final**: TUNNEL COMPLET OPÉRATIONNEL
- [ ] Etape 1: Sélection → Validée
- [ ] Etape 2: Dates/Lieux sync → Validée
- [ ] Etape 3: Infos + Docs → Validée
- [ ] Etape 4: Confirmation + WhatsApp → Validée
- [ ] Page success → Validée

**Numéro WhatsApp cible**: `+212619700592` - Validée
