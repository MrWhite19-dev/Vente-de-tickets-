# M'AS-TU VU ? — Site de réservation des pass

Site vitrine de réservation responsive en HTML5, CSS3 et JavaScript, style « Offre Digital Futuriste » noir, rouge et blanc.

## Contenu
- `index.html` : structure de la page et les trois formulaires GP, VIP et VVIP.
- `style.css` : design responsive mobile, tablette et ordinateur.
- `script.js` : validation des formulaires et création du message WhatsApp.
- `assets/affiche-mas-tu-vu.jpeg` : affiche fournie.

## Avant la mise en ligne : configurer WhatsApp
1. Ouvrez `script.js`.
2. Remplacez `225XXXXXXXXXX` dans `WHATSAPP_NUMBER` par le numéro WhatsApp du vendeur au format international, chiffres uniquement.
3. Pour un numéro ivoirien, utilisez le préfixe `225` suivi du numéro national sans le premier `0`. Exemple fictif : `2250700000000`.
4. Enregistrez le fichier puis testez les trois formulaires.

Le numéro n'a pas été renseigné automatiquement, car il faut confirmer quel numéro reçoit les réservations.

## Lancer le site
- Double-cliquez sur `index.html` pour tester dans un navigateur.
- Pour un test local plus fiable, ouvrez le dossier avec Visual Studio Code et utilisez Live Server.
- Pour publier le site, envoyez `index.html`, `style.css`, `script.js` et le dossier `assets` sur votre hébergement.

## À vérifier avant publication
- L'offre GP est affichée à 3 000 FCFA au lieu de 5 000 FCFA, avec la mention « fin le 7 » comme indiqué dans le brief. Le mois n'étant pas précisé, il n'a pas été inventé.
- Vérifiez les informations de l'événement, la date, le lieu, les tarifs et le numéro de réservation.
- Le site ne collecte pas de paiement et ne confirme pas automatiquement les billets : WhatsApp sert à transmettre la demande à l'organisateur.
- Les polices Google nécessitent une connexion Internet ; des polices de remplacement sont prévues.
