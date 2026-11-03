/* =========================================================
   M'AS-TU VU ? — Gestion des formulaires de réservation
   Chaque formulaire prépare un message et ouvre WhatsApp.
   IMPORTANT : configurez le numéro du vendeur avant publication.
   Format attendu : indicatif pays + numéro, chiffres uniquement.
   Exemple Côte d'Ivoire : 2250700000000
   ========================================================= */

"use strict";

// Remplacez cette valeur par le numéro WhatsApp qui reçoit les commandes.
// Ne mettez pas le signe +, les espaces ou les tirets.
const WHATSAPP_NUMBER = "225XXXXXXXXXX";

const toast = document.getElementById("toast");
let toastTimeout;

// Affiche un petit message d'information sur la page.
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 5000);
}

// Formate les montants avec un séparateur de milliers adapté au français.
function formatFCFA(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

// Traite les trois formulaires sans recharger la page.
document.querySelectorAll(".ticket-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // La validation native du navigateur est complétée par cette vérification.
    if (!form.reportValidity()) return;

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      showToast("Le site est prêt. Pour activer les réservations, remplacez WHATSAPP_NUMBER dans script.js par le numéro WhatsApp du vendeur, au format international.");
      return;
    }

    const ticket = form.dataset.ticket;
    const price = Number(form.dataset.price);
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const customerPhone = String(formData.get("phone") || "").trim();
    const quantity = Number(formData.get("quantity"));

    if (
      !name ||
      !customerPhone ||
      !Number.isFinite(price) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      showToast("Veuillez vérifier les informations saisies.");
      return;
    }

    // Mettre à jour le stock de démonstration après validation du formulaire.
    if (!retirerBillets(ticket, quantity)) return;

    const total = price * quantity;

    // Message récapitulatif envoyé au vendeur pour confirmer la commande.
    const message = [
      "Bonjour Art Spirit Studio, je souhaite réserver des pass pour l'avant-première du film M'AS-TU VU ?",
      "",
      "Pass : " + ticket,
      "Prix unitaire : " + formatFCFA(price),
      "Quantité : " + quantity,
      "Total estimé : " + formatFCFA(total),
      "Nom : " + name,
      "Mon numéro WhatsApp : " + customerPhone,
      "",
      "Date : samedi 12 décembre 2026 à 17H00",
      "Lieu : Jeckad Espace Événementiel",
      "Merci de me confirmer la disponibilité et les modalités de règlement."
    ].join("\n");

    const whatsappURL = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    const newWindow = window.open(whatsappURL, "_blank", "noopener,noreferrer");

    // Certains navigateurs bloquent les nouvelles fenêtres : proposer un lien direct.
    if (!newWindow) {
      showToast("WhatsApp n'a pas pu s'ouvrir automatiquement. Autorisez les fenêtres contextuelles puis réessayez.");
    }
  });
});

// Le bouton principal fait défiler vers les pass ; cette classe aide le retour visuel clavier.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) target.setAttribute("tabindex", "-1");
  });
});


/* ==========================================
   STOCK DEMONSTRATION ET CHRONOMETRE
   ========================================== */

// Quantités initiales fictives à remplacer par
// les quantités réellement mises en vente.
const stockInitial = {
  GP: 100,
  VIP: 50,
  VVIP: 20
};

const cleStock = "masTuVuStockDemo";

// Charger les compteurs enregistrés dans ce navigateur.
function chargerStock() {
  try {
    const donnees = JSON.parse(
      localStorage.getItem(cleStock)
    );

    if (
      donnees &&
      donnees.stock &&
      donnees.vendus
    ) {
      return donnees;
    }
  } catch (erreur) {
    console.warn("Stock local indisponible.");
  }

  return {
    stock: { ...stockInitial },
    vendus: {
      GP: 0,
      VIP: 0,
      VVIP: 0
    }
  };
}

let stockBillets = chargerStock();

// Afficher les quantités.
function afficherStock() {
  ["GP", "VIP", "VVIP"].forEach((type) => {
    const cle = type.toLowerCase();

    const restant = Math.max(
      0,
      stockBillets.stock[type]
    );

    const vendus = Math.max(
      0,
      stockBillets.vendus[type]
    );

    const stockElement = document.getElementById(
      cle + "-stock"
    );

    const vendusElement = document.getElementById(
      cle + "-sold"
    );

    const barreElement = document.getElementById(
      cle + "-stock-bar"
    );

    if (stockElement) {
      stockElement.textContent = restant;
    }

    if (vendusElement) {
      vendusElement.textContent = vendus;
    }

    if (barreElement) {
      const pourcentage =
        (restant / stockInitial[type]) * 100;

      barreElement.style.width =
        pourcentage + "%";
    }
  });
}

// Enregistrer le stock localement.
function enregistrerStock() {
  try {
    localStorage.setItem(
      cleStock,
      JSON.stringify(stockBillets)
    );
  } catch (erreur) {
    console.warn("Impossible d'enregistrer le stock.");
  }
}

afficherStock();

/* COMPTE A REBOURS DE 15 MINUTES */

let secondesRestantes = 15 * 60;

function actualiserChronometre() {
  const minutes = Math.floor(
    secondesRestantes / 60
  );

  const secondes = secondesRestantes % 60;

  const elementMinutes =
    document.getElementById("timer-minutes");

  const elementSecondes =
    document.getElementById("timer-seconds");

  if (elementMinutes) {
    elementMinutes.textContent =
      String(minutes).padStart(2, "0");
  }

  if (elementSecondes) {
    elementSecondes.textContent =
      String(secondes).padStart(2, "0");
  }
}

actualiserChronometre();

setInterval(() => {
  secondesRestantes =
    secondesRestantes > 0
      ? secondesRestantes - 1
      : 15 * 60;

  actualiserChronometre();
}, 1000);

/*
  Fonction de démonstration pour retirer des billets.
  Elle ne doit pas être utilisée comme validation
  réelle d'un paiement.
*/
function retirerBillets(type, quantite) {
  if (!stockInitial.hasOwnProperty(type)) {
    return false;
  }

  if (
    !Number.isInteger(quantite) ||
    quantite < 1
  ) {
    return false;
  }

  if (quantite > stockBillets.stock[type]) {
    alert("Stock insuffisant pour ce pass.");
    return false;
  }

  stockBillets.stock[type] -= quantite;
  stockBillets.vendus[type] += quantite;

  enregistrerStock();
  afficherStock();

  return true;
}
