/**
 * @file script.js
 * @description Contient les classes JavaScript pour ajouter de l'interactivité au site "Gagner en Finance".
 * Inclut un bouton "Retour en haut", une gestion des liens de navigation actifs,
 * et une animation de texte au chargement de la page.
 */

// ==========================================================
// CLASSE 1 : Gestionnaire du bouton "Retour en haut"
// ==========================================================

/**
 * Gère l'affichage et le comportement d'un bouton "Retour en haut de page".
 * Le bouton apparaît lorsque l'utilisateur fait défiler la page vers le bas.
 */
class ScrollToTopButton {
    /**
     * Crée une instance de ScrollToTopButton.
     * @param {string} selector Le sélecteur CSS du bouton (ex: '#myScrollButton').
     * @param {number} scrollThreshold Le seuil de défilement en pixels après lequel le bouton apparaît.
     */
    constructor(selector, scrollThreshold = 300) {
        this.button = document.querySelector(selector);
        this.scrollThreshold = scrollThreshold;

        if (!this.button) {
            console.error(`Erreur: Le bouton avec le sélecteur "${selector}" n'a pas été trouvé.`);
            return;
        }

        this.init();
    }

    /**
     * Initialise les écouteurs d'événements pour le défilement et le clic sur le bouton.
     */
    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.button.addEventListener('click', this.scrollToTop.bind(this));
        this.handleScroll(); // Vérifie la position initiale au chargement
    }

    /**
     * Gère l'événement de défilement, affichant ou masquant le bouton.
     */
    handleScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.showButton();
        } else {
            this.hideButton();
        }
    }

    /**
     * Affiche le bouton en lui ajoutant la classe 'show'.
     */
    showButton() {
        if (this.button) {
            this.button.classList.add('show');
        }
    }

    /**
     * Masque le bouton en lui retirant la classe 'show'.
     */
    hideButton() {
        if (this.button) {
            this.button.classList.remove('show');
        }
    }

    /**
     * Fait défiler la page en douceur jusqu'en haut.
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ==========================================================
// CLASSE 2 : Gestionnaire des liens de navigation actifs
// ==========================================================

/**
 * Gère l'ajout d'une classe 'active' au lien de navigation correspondant
 * à la page actuellement affichée.
 */
class ActiveNavLinkManager {
    /**
     * Crée une instance de ActiveNavLinkManager.
     * @param {string} navSelector Le sélecteur CSS du conteneur de navigation (ex: '.main-nav ul').
     * @param {string} activeClass La classe CSS à ajouter au lien actif (par défaut 'active').
     */
    constructor(navSelector, activeClass = 'active') {
        this.navContainer = document.querySelector(navSelector);
        this.activeClass = activeClass;

        if (!this.navContainer) {
            console.warn(`Avertissement: Le conteneur de navigation avec le sélecteur "${navSelector}" n'a pas été trouvé.`);
            return;
        }

        this.init();
    }

    /**
     * Initialise la logique pour définir le lien de navigation actif.
     */
    init() {
        this.setActiveLink();
    }

    /**
     * Détermine le lien de navigation actif basé sur l'URL actuelle
     * et lui applique la classe 'active'.
     */
    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = this.navContainer.querySelectorAll('a');

        navLinks.forEach(link => {
            let linkPath = link.getAttribute('href');

            // Gère les différents formats du chemin de la page d'accueil
            if (linkPath === 'index.html' || linkPath === '/' || linkPath === '') {
                if (currentPath === '/' || currentPath.endsWith('/index.html') || currentPath === '') {
                    link.classList.add(this.activeClass);
                }
            } else if (currentPath.endsWith(linkPath)) {
                link.classList.add(this.activeClass);
            } else {
                link.classList.remove(this.activeClass);
            }
        });
    }
}

// ==========================================================
// CLASSE 3 : Animateur de texte lettre par lettre
// ==========================================================

/**
 * Anime un bloc de texte en faisant apparaître chaque lettre individuellement.
 */
class TextAnimator {
    /**
     * Crée une instance de TextAnimator.
     * @param {string} selector Le sélecteur CSS de l'élément texte à animer (ex: '.top-header h1').
     * @param {number} delayPerChar Le délai en millisecondes entre l'animation de chaque caractère.
     */
    constructor(selector, delayPerChar = 75) {
        this.element = document.querySelector(selector);
        this.delayPerChar = delayPerChar;

        if (!this.element) {
            console.error(`Erreur: L'élément texte avec le sélecteur "${selector}" n'a pas été trouvé pour l'animation.`);
            return;
        }

        this.originalText = this.element.textContent; // Stocke le texte original
        this.init();
    }

    /**
     * Initialise la préparation du texte et lance l'animation.
     */
    init() {
        this.prepareTextForAnimation();
        // Un léger délai avant de lancer les animations pour s'assurer que le DOM est rendu
        setTimeout(() => {
            this.startAnimation();
        }, 100);
    }

    /**
     * Enveloppe chaque caractère du texte dans un <span> pour une animation individuelle.
     * Les espaces sont gérés comme des entités non-cassables (&nbsp;).
     */
    prepareTextForAnimation() {
        const chars = this.originalText.split('');
        this.element.innerHTML = ''; // Vide le contenu original

        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Utilise un espace insécable pour les espaces
            span.classList.add('animated-char'); // Ajoute une classe pour le stylisme CSS
            this.element.appendChild(span);
        });
    }

    /**
     * Lance l'animation en ajoutant une classe avec un délai à chaque caractère.
     */
    startAnimation() {
        const animatedChars = this.element.querySelectorAll('.animated-char');
        animatedChars.forEach((charSpan, index) => {
            setTimeout(() => {
                charSpan.classList.add('animate'); // Déclenche l'animation via CSS
            }, index * this.delayPerChar); // Délai progressif pour chaque lettre
        });
    }
}


// ==========================================================
// INITIALISATION DE NOS CLASSES QUAND LE DOM EST PRÊT
// ==========================================================

// Attendre que le DOM (Document Object Model) soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du gestionnaire de liens de navigation actifs
    const navManager = new ActiveNavLinkManager('.main-nav ul');

    // Ajout dynamique du bouton "Retour en haut"
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.textContent = '↑';
    document.body.appendChild(scrollToTopBtn);
    const scrollButton = new ScrollToTopButton('#scrollToTopBtn', 400);

    // Initialisation de l'animateur de texte pour le titre principal
    // Cible le H1 dans le top-header
    const mainTitleAnimator = new TextAnimator('.top-header h1', 80); // 80ms de délai entre chaque lettre
});
// ==========================================================
// CLASSE 4 : Gestion du menu responsive mobile
// ==========================================================

/**
 * Gère l'ouverture/fermeture du menu responsive via un bouton "burger".
 */
class ResponsiveMenuToggle {
    /**
     * @param {string} checkboxId ID de l'input checkbox qui contrôle le menu (ex: #menu-toggle).
     * @param {string} menuSelector Sélecteur du menu (ex: .menu).
     */
    constructor(checkboxId, menuSelector) {
        this.menuCheckbox = document.getElementById(checkboxId);
        this.menu = document.querySelector(menuSelector);

        if (!this.menuCheckbox || !this.menu) {
            console.warn("Menu responsive : éléments non trouvés.");
            return;
        }

        this.init();
    }

    init() {
        // Fermer le menu quand on clique sur un lien du menu
        this.menu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                this.menuCheckbox.checked = false;
            });
        });
    }
}