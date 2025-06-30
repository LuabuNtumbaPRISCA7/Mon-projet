/**
 * @file script.js
 * @description Contient les classes JavaScript pour ajouter de l'interactivité au site "Gagner en Finance".
 * Inclut un bouton "Retour en haut", une gestion des liens de navigation actifs,
 * une animation de texte au chargement de la page, et un écran de chargement initial.
 */

// ==========================================================
// CLASSE 0 : Gestionnaire de l'écran de chargement (NOUVELLE CLASSE)
// ==========================================================

/**
 * Gère l'affichage et la disparition d'un écran de chargement au début du site.
 */
class LoadingScreenManager {
    /**
     * Crée une instance de LoadingScreenManager.
     * @param {string} loadingScreenSelector Le sélecteur CSS de l'écran de chargement (ex: '#loading-screen').
     * @param {string} mainContentSelector Le sélecteur CSS du conteneur du contenu principal (ex: '#main-content').
     * @param {number} initialDelay Le délai en ms avant que l'écran de chargement ne commence à disparaître.
     * @param {number} fadeOutDuration Le temps en ms que prendra l'animation de fondu de l'écran de chargement (doit correspondre au CSS).
     */
    constructor(loadingScreenSelector, mainContentSelector, initialDelay = 500, fadeOutDuration = 1000) {
        this.loadingScreen = document.getElementById(loadingScreenSelector.replace('#', ''));
        this.mainContent = document.getElementById(mainContentSelector.replace('#', ''));
        this.initialDelay = initialDelay;
        this.fadeOutDuration = fadeOutDuration;

        if (!this.loadingScreen || !this.mainContent) {
            console.error("Erreur: Éléments de l'écran de chargement ou du contenu principal introuvables.");
            return;
        }

        this.init();
    }

    /**
     * Initialise l'écran de chargement.
     * Attend le chargement complet de la page (y compris les ressources) avant de le masquer.
     */
    init() {
        // Cache le contenu principal immédiatement au chargement du script
        // Note: Le display: none; est déjà dans le CSS, mais c'est une sécurité.
        this.mainContent.style.display = 'none';

        // window.onload s'assure que TOUTES les ressources (images, CSS, etc.) sont chargées.
        // C'est essentiel pour ne pas afficher le site avant qu'il ne soit prêt.
        window.onload = () => {
            // Un léger délai pour permettre à l'utilisateur de voir l'écran de chargement
            setTimeout(() => {
                // Déclenche l'animation de fondu via CSS (opacité de 1 à 0)
                this.loadingScreen.style.opacity = "0";

                // Après la durée de l'animation de fondu, masquer complètement l'écran et afficher le contenu principal
                setTimeout(() => {
                    this.loadingScreen.style.display = "none";
                    this.mainContent.style.display = "block"; // Utilise "block" car c'est une div
                }, this.fadeOutDuration);

            }, this.initialDelay);
        };
    }
}


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

        // Gestion du toggle avec la checkbox
        this.menuCheckbox.addEventListener('change', () => {
            if (this.menuCheckbox.checked) {
                this.menu.classList.add('active');
            } else {
                this.menu.classList.remove('active');
            }
        });
    }
}


// ==========================================================
// INITIALISATION DE NOS CLASSES QUAND LE DOM EST PRÊT
// ==========================================================

// Attendre que le DOM (Document Object Model) soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du gestionnaire de l'écran de chargement EN PREMIER
    // Il gérera l'affichage du contenu principal après le chargement complet.
    const loadingManager = new LoadingScreenManager('loading-screen', 'main-content', 500, 1000); // 0.5s délai, 1s fondu

    // Initialisation du gestionnaire de liens de navigation actifs
    // (Le selecteur .main-nav ul n'existe pas dans le HTML fourni, j'ai utilisé .navbar .menu)
    const navManager = new ActiveNavLinkManager('.navbar .menu');

    // Ajout dynamique du bouton "Retour en haut"
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scrollToTopBtn';
    scrollToTopBtn.textContent = '↑';
    document.body.appendChild(scrollToTopBtn);
    const scrollButton = new ScrollToTopButton('#scrollToTopBtn', 400);

    // Initialisation de l'animateur de texte pour le titre principal
    // Cible le H1 dans le top-header
    const mainTitleAnimator = new TextAnimator('.top-header h1', 80); // 80ms de délai entre chaque lettre

    // Initialisation du gestionnaire de menu responsive
    const responsiveMenu = new ResponsiveMenuToggle('menu-toggle', '.menu');
});