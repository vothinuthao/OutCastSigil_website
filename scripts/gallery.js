// gallery.js - JavaScript for the cards gallery functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery
    initGallery();
});

// Initialize the gallery
async function initGallery() {
    try {
        // Add particle styles to document
        addParticleStyles();
        
        // Fetch the cards data from JSON file
        const response = await fetch('data/cards.json');
        if (!response.ok) {
            console.log("Could not fetch cards data, falling back to HTML elements");
            setupBasicGallery();
            return;
        }
        
        const data = await response.json();
        
        // Render all cards
        renderAllCards(data.cards);
        
        // Setup filtering
        setupFilters();
        
        // Filter by default to Metal (Kim) on page load
        filterCards('metal');
    } catch (error) {
        console.error('Error loading cards data:', error);
        setupBasicGallery();
    }
}

// Add CSS for particle effects
function addParticleStyles() {
    const particleStyles = document.createElement('style');
    particleStyles.innerHTML = `
        .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0.3;
            pointer-events: none;
            animation: gentleParticleFloat 8s ease-in-out infinite;
        }
        
        @keyframes gentleParticleFloat {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0.2;
            }
            50% {
                opacity: 0.4;
                transform: translateY(-20px) translateX(5px);
            }
            100% {
                transform: translateY(0) translateX(0);
                opacity: 0.2;
            }
        }
        
        .metal-particle {
            background-color: var(--color-metal);
            box-shadow: 0 0 5px var(--color-metal-glow);
        }
        
        .wood-particle {
            background-color: var(--color-wood);
            box-shadow: 0 0 5px var(--color-wood-glow);
        }
        
        .water-particle {
            background-color: var(--color-water);
            box-shadow: 0 0 5px var(--color-water-glow);
        }
        
        .earth-particle {
            background-color: var(--color-earth);
            box-shadow: 0 0 5px var(--color-earth-glow);
        }
        
        .fire-particle {
            background-color: var(--color-fire);
            box-shadow: 0 0 5px var(--color-fire-glow);
        }
    `;
    
    document.head.appendChild(particleStyles);
}

// Render all cards from JSON data
function renderAllCards(cards) {
    const galleryContainer = document.querySelector('.cards-gallery');
    
    // Clear existing cards
    galleryContainer.innerHTML = '';
    
    // Group cards by element
    const cardsByElement = {
        metal: [],
        wood: [],
        water: [],
        earth: [],
        fire: []
    };
    
    // Group the cards
    cards.forEach(card => {
        if (cardsByElement[card.element]) {
            cardsByElement[card.element].push(card);
        }
    });
    
    // Create new cards from JSON data
    cards.forEach(card => {
        // Create card element
        const cardElement = document.createElement('div');
        cardElement.className = 'gallery-card';
        cardElement.setAttribute('data-element', card.element);
        cardElement.setAttribute('data-rarity', card.rarity);
        cardElement.setAttribute('data-id', card.id);
        
        // Generate image path based on element and image name
        const imagePath = `/api/placeholder/240/336`; // Fallback placeholder
        
        // Create card HTML structure 
        cardElement.innerHTML = `
            <div class="card-image">
                <img src="${imagePath}" alt="${card.element} - ${card.name}" onload="this.className='loaded'">
                <div class="card-glow ${card.element}-glow"></div>
            </div>
            <h4>${card.name}</h4>
        `;
        
        // Try to load the actual image
        const img = cardElement.querySelector('img');
        img.onerror = function() {
            // If image fails to load, use placeholder
            this.src = `/api/placeholder/240/336`;
            this.alt = card.name;
        };
        img.src = `images/arts/${card.element}/${card.image}`;
        
        // Add card to gallery
        galleryContainer.appendChild(cardElement);
        
        // Add particle effects
        addCardParticles(cardElement, card.element);
    });
}

// Add particles to cards - more gentle
function addCardParticles(cardElement, elementType) {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'card-particles';
    
    // Create particles - fewer particles for a lighter effect
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = `particle ${elementType}-particle`;
        
        // Random size and position
        const size = Math.random() * 3 + 2; // 2-5px (smaller size)
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`; // longer delay for smoother
        
        particlesContainer.appendChild(particle);
    }
    
    // Add particles to card
    const cardImage = cardElement.querySelector('.card-image');
    if (cardImage) {
        cardImage.appendChild(particlesContainer);
    }
}

// Setup filter tabs
function setupFilters() {
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    
    galleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            galleryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get element filter value
            const element = this.getAttribute('data-element');
            
            // Apply filter
            filterCards(element);
        });
    });
}

// Filter function - show/hide cards based on element WITHOUT ANY FADE
function filterCards(element) {
    const cards = document.querySelectorAll('.gallery-card');
    
    cards.forEach(card => {
        // Reset any animation styles for a clean state
        const delay = Math.random() * 3; // Longer delay for a more natural, varied movement
        card.style.animation = `gentleFloat 8s ease-in-out infinite ${delay}s`;
        
        // Show only cards of the selected element WITHOUT TRANSITIONS
        const cardElement = card.getAttribute('data-element');
        
        if (cardElement === element) {
            // Show immediately without animation
            card.classList.remove('hidden');
            
            // Gently enhance glow effect for matching cards
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0.4'; // Less intense glow
            }
        } else {
            // Hide immediately without animation
            card.classList.add('hidden');
        }
    });
}

// Setup basic gallery if JSON loading fails
function setupBasicGallery() {
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    // Add basic element attribute if missing
    galleryCards.forEach(card => {
        if (!card.hasAttribute('data-element')) {
            // Try to determine element from class names
            const classes = card.className.split(' ');
            const elementClasses = ['metal', 'wood', 'water', 'earth', 'fire'];
            
            elementClasses.forEach(elementClass => {
                if (classes.includes(elementClass)) {
                    card.setAttribute('data-element', elementClass);
                }
            });
        }
        
        // Add error handler for images
        const img = card.querySelector('img');
        if (img) {
            img.onerror = function() {
                this.src = '/api/placeholder/240/336';
                this.alt = 'Card placeholder';
            };
        }
    });
    
    // Setup filter clicks
    galleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            galleryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get element filter value
            const element = this.getAttribute('data-element');
            
            // Apply filter immediately without animations
            filterCards(element);
        });
    });
    
    // Filter by default to Metal (Kim) on page load
    // Find the metal button and simulate a click or directly filter
    const metalButton = document.querySelector('.gallery-btn[data-element="metal"]');
    if (metalButton) {
        metalButton.classList.add('active');
    }
    
    filterCards('metal');
}