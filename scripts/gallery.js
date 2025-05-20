// gallery.js - JavaScript for the cards gallery functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cards gallery functionality
    initCardsGallery();
    
    // Add elemental particles effects
    addElementalParticles();
});

// Initialize the cards gallery with filtering and animation
function initCardsGallery() {
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    // Add click event for filtering
    galleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            galleryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-element');
            
            // Filter cards
            filterGalleryCards(filterValue, galleryCards);
        });
    });
    
    // Initial animation for cards
    galleryCards.forEach(card => {
        card.classList.add('visible');
    });
}

// Filter gallery cards based on selected element
function filterGalleryCards(filter, cards) {
    cards.forEach(card => {
        // Reset animation to allow it to replay
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        
        if (filter === 'all' || card.getAttribute('data-element') === filter) {
            card.classList.remove('hidden');
            card.classList.add('visible');
            
            // Restore animation with proper delay
            const index = Array.from(cards).indexOf(card);
            const delay = (index % 5) * 0.2;
            card.style.animation = `float 8s ease-in-out infinite ${delay}s`;
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
}

// Add elemental particles effects to cards
function addElementalParticles() {
    const cards = document.querySelectorAll('.gallery-card');
    
    cards.forEach(card => {
        // Create particle container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'card-particles';
        
        // Get element type
        const elementType = card.getAttribute('data-element');
        
        // Add particles to container
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${elementType}-particle`;
            
            // Random positioning
            const size = Math.random() * 4 + 2; // 2-6px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random starting position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Set animation delay
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
        }
        
        // Add particles container to card
        const cardImage = card.querySelector('.card-image');
        cardImage.appendChild(particlesContainer);
    });
    
    // Add CSS for particles
    const particleStyles = document.createElement('style');
    particleStyles.innerHTML = `
        .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0;
            pointer-events: none;
            animation: particleFloat 5s ease-in-out infinite;
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            25% {
                opacity: 0.8;
            }
            75% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(-50px) translateX(20px);
                opacity: 0;
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

// Add hover effects for cards
function enhanceCardHoverEffects() {
    const cards = document.querySelectorAll('.gallery-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Get element type
            const elementType = this.getAttribute('data-element');
            
            // Create ambient glow effect around cursor
            const glowEffect = document.createElement('div');
            glowEffect.className = `ambient-glow ${elementType}-glow`;
            
            // Position the glow effect
            const updateGlowPosition = (e) => {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                glowEffect.style.left = `${x}px`;
                glowEffect.style.top = `${y}px`;
            };
            
            // Track mouse movement
            this.addEventListener('mousemove', updateGlowPosition);
            
            // Add the glow to the card
            this.querySelector('.card-image').appendChild(glowEffect);
            
            // Clean up when mouse leaves
            this.addEventListener('mouseleave', function() {
                this.removeEventListener('mousemove', updateGlowPosition);
                if (glowEffect.parentNode) {
                    glowEffect.parentNode.removeChild(glowEffect);
                }
            });
        });
    });
    
    // Add CSS for ambient glow
    const ambientGlowStyles = document.createElement('style');
    ambientGlowStyles.innerHTML = `
        .ambient-glow {
            position: absolute;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 1;
            opacity: 0.4;
            filter: blur(15px);
            transition: all 0.1s ease;
        }
        
        .metal-glow.ambient-glow {
            background-color: var(--color-metal);
        }
        
        .wood-glow.ambient-glow {
            background-color: var(--color-wood);
        }
        
        .water-glow.ambient-glow {
            background-color: var(--color-water);
        }
        
        .earth-glow.ambient-glow {
            background-color: var(--color-earth);
        }
        
        .fire-glow.ambient-glow {
            background-color: var(--color-fire);
        }
    `;
    
    document.head.appendChild(ambientGlowStyles);
}