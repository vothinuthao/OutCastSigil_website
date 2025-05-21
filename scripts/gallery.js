// gallery.js - JavaScript for the cards gallery functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cards gallery by loading JSON data
    initCardsGalleryWithJSON();
    
    // Add elemental particles effects
    addElementalParticles();
});

// Initialize the cards gallery with JSON data
async function initCardsGalleryWithJSON() {
    try {
        // Add particle styles to document
        addParticleStyles();
        
        // Fetch the cards data from JSON file
        const response = await fetch('data/cards.json');
        if (!response.ok) {
            console.log("Could not fetch cards data, falling back to HTML elements");
            // Fallback to legacy initialization if JSON fails to load
            initLegacyGallery();
            return;
        }
        
        const data = await response.json();
        
        // Render the cards
        renderGalleryCards(data.cards);
        
        // Setup gallery filtering buttons
        setupGalleryFilters();
    } catch (error) {
        console.error('Error loading cards data:', error);
        // Fallback to legacy initialization if JSON fails to load
        initLegacyGallery();
    }
}

// Add CSS for particle effects
function addParticleStyles() {
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

// Create elementals particle effects for the gallery
function addElementalParticles() {
    // This function will be called after the cards are rendered
    // to add particle effects to the gallery cards
    const cards = document.querySelectorAll('.gallery-card');
    
    cards.forEach(card => {
        const elementType = card.getAttribute('data-element');
        if (elementType) {
            createCardParticles(card, elementType);
        }
    });
}

// Render gallery cards from JSON data
function renderGalleryCards(cards) {
    const galleryContainer = document.querySelector('.cards-gallery');
    
    // Clear existing cards
    galleryContainer.innerHTML = '';
    
    // Create new cards from JSON data
    cards.forEach(card => {
        // Create card element
        const cardElement = document.createElement('div');
        cardElement.className = 'gallery-card';
        cardElement.setAttribute('data-element', getElementClass(card.element));
        cardElement.setAttribute('data-rarity', card.rarity);
        cardElement.setAttribute('data-id', card.id);
        
        // Generate image path according to the file structure
        // images/arts/[element]/[image name].png
        const imagePath = `images/arts/${card.element}/${card.image}`;
        
        // Create card HTML structure 
        cardElement.innerHTML = `
            <div class="card-image">
                <img src="${imagePath}" alt="${card.element} - ${card.name}">
                <div class="card-glow ${getElementClass(card.element)}-glow"></div>
            </div>
            <h4>${card.name}</h4>
        `;
        
        // Add card to gallery
        galleryContainer.appendChild(cardElement);
        
        // Create and add particle effects to each card
        createCardParticles(cardElement, getElementClass(card.element));
    });
    
    // Setup pagination after rendering all cards
    setupGalleryPagination(cards.length);
}

// Create particle effects for a single card
function createCardParticles(cardElement, elementType) {
    // Create particle container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'card-particles';
    
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
    const cardImage = cardElement.querySelector('.card-image');
    if (cardImage) {
        cardImage.appendChild(particlesContainer);
    }
}

// Helper function to get proper element class name
function getElementClass(element) {
    const elementMap = {
        'metal': 'metal',
        'wood': 'wood',
        'water': 'water',
        'earth': 'earth',
        'fire': 'fire'
    };
    
    return elementMap[element] || element;
}

// Setup gallery filter buttons
function setupGalleryFilters() {
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    
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
            filterGalleryCards(filterValue);
        });
    });
    
    // Set 'all' as active by default and trigger initial animation
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.classList.add('visible');
    });
}

// Improved filter gallery cards function with proper sorting
function filterGalleryCards(filter) {
    const cards = document.querySelectorAll('.gallery-card');
    const cardsArray = Array.from(cards);
    const galleryContainer = document.querySelector('.cards-gallery');
    
    // First pass: mark each card as visible or hidden based on filter
    cardsArray.forEach(card => {
        // Reset animation to allow it to replay
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        
        if (filter === 'all' || card.getAttribute('data-element') === filter) {
            card.classList.remove('hidden');
            card.classList.add('visible');
        } else {
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
    
    // Sort cards - visible ones first, then by element
    cardsArray.sort((a, b) => {
        const aVisible = !a.classList.contains('hidden');
        const bVisible = !b.classList.contains('hidden');
        
        // Visible cards come first
        if (aVisible && !bVisible) return -1;
        if (!aVisible && bVisible) return 1;
        
        // If both are visible or both are hidden, sort by element
        return 0;
    });
    
    // Remove all cards from DOM
    cards.forEach(card => card.remove());
    
    // Add sorted cards back to DOM
    cardsArray.forEach((card, index) => {
        galleryContainer.appendChild(card);
        
        // Re-apply animation with staggered delay
        if (!card.classList.contains('hidden')) {
            const delay = (index % 5) * 0.2;
            card.style.animation = `float 8s ease-in-out infinite ${delay}s`;
        }
    });
}

// Fallback to legacy gallery initialization if JSON fails
function initLegacyGallery() {
    console.log("Falling back to legacy gallery initialization");
    
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    // Ensure existing cards have proper error handling for images
    galleryCards.forEach(card => {
        const img = card.querySelector('img');
        if (img) {
            // Remove any previous error handlers
            img.removeAttribute('onerror');
        }
    });
    
    // Add click event for filtering
    galleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            galleryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-element');
            
            // Filter cards using the new filter function
            filterGalleryCards(filterValue);
        });
    });
    
    // Initial animation for cards
    galleryCards.forEach(card => {
        card.classList.add('visible');
    });
    
    // Create particles for existing cards
    addElementalParticles();
    
    // Setup basic pagination for legacy mode
    setupGalleryPagination(galleryCards.length);
}

// Add CSS for pagination to our gallery
function addGalleryPaginationCSS() {
    const paginationStyles = document.createElement('style');
    paginationStyles.innerHTML = `
        .gallery-pagination {
            text-align: center;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .show-more-btn {
            background-color: var(--color-highlight);
            color: var(--color-text-dark);
            border: none;
            padding: 12px 24px;
            font-size: 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: var(--font-heading);
            letter-spacing: 1px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        
        .show-more-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
            background-color: var(--color-accent);
        }
        
        .gallery-card.hidden-card {
            display: none;
        }
        
        .card-count {
            display: block;
            margin-top: 0.5rem;
            color: var(--color-text-secondary);
            font-size: 0.9rem;
            font-style: italic;
        }
        
        .view-all-btn {
            margin-top: 1rem;
            display: inline-block;
            padding: 10px 15px;
            background-color: var(--color-accent);
            color: var(--color-text);
            text-decoration: none;
            border-radius: 4px;
            font-family: var(--font-heading);
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .view-all-btn:hover {
            background-color: var(--color-highlight);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
    `;
    
    document.head.appendChild(paginationStyles);
}

// Setup gallery pagination with "View All" option
function setupGalleryPagination(totalCards) {
    // Add CSS for pagination
    addGalleryPaginationCSS();
    
    const galleryContainer = document.querySelector('.cards-gallery');
    const cards = galleryContainer.querySelectorAll('.gallery-card');
    
    // Set initial cards to show
    const initialCardsToShow = 6;
    let currentlyShown = Math.min(initialCardsToShow, cards.length);
    
    // Create pagination container if it doesn't exist
    let paginationContainer = document.querySelector('.gallery-pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'gallery-pagination';
        galleryContainer.parentNode.insertBefore(paginationContainer, galleryContainer.nextSibling);
    } else {
        // Clear existing content
        paginationContainer.innerHTML = '';
    }
    
    // Hide cards beyond initial count
    cards.forEach((card, index) => {
        if (index >= initialCardsToShow) {
            card.classList.add('hidden-card');
        }
    });
    
    // Create show more button if there are more cards to show
    if (totalCards > initialCardsToShow) {
        // const showMoreBtn = document.createElement('button');
        // showMoreBtn.className = 'show-more-btn';
        // showMoreBtn.textContent = 'Hiển thị thêm';
        
        // Add card count info
        const cardCount = document.createElement('span');
        cardCount.className = 'card-count';
        cardCount.textContent = `Đang hiển thị ${currentlyShown} / ${totalCards} thẻ bài`;
        
        // Create "View All Cards" link
        const viewAllLink = document.createElement('a');
        viewAllLink.href = 'gallery.html'; // Link to the dedicated gallery page
        viewAllLink.className = 'view-all-btn';
        viewAllLink.textContent = 'Xem toàn bộ bộ sưu tập';
        viewAllLink.target = '_blank'; // Open in new tab
        
        // Add button click event
        showMoreBtn.addEventListener('click', function() {
            const hiddenCards = galleryContainer.querySelectorAll('.gallery-card.hidden-card');
            const cardsToShow = Math.min(hiddenCards.length, 6); // Show 6 more cards at a time
            
            // Show next batch of cards
            for (let i = 0; i < cardsToShow; i++) {
                hiddenCards[i].classList.remove('hidden-card');
                // Add entrance animation
                hiddenCards[i].style.animation = 'cardAppear 0.5s ease forwards';
            }
            
            // Update shown count
            currentlyShown += cardsToShow;
            cardCount.textContent = `Đang hiển thị ${currentlyShown} / ${totalCards} thẻ bài`;
            
            // Change button text if all cards are shown
            // if (currentlyShown >= totalCards) {
            //     showMoreBtn.textContent = 'Hiển thị ít hơn';
            //     showMoreBtn.classList.add('show-less');
            // } else if (showMoreBtn.classList.contains('show-less')) {
            //     showMoreBtn.textContent = 'Hiển thị thêm';
            //     showMoreBtn.classList.remove('show-less');
            // }
            
            // If button is in "show less" mode and clicked
            // if (showMoreBtn.classList.contains('show-less')) {
            //     showMoreBtn.addEventListener('click', function resetGallery() {
            //         // Hide cards beyond initial display
            //         cards.forEach((card, index) => {
            //             if (index >= initialCardsToShow) {
            //                 card.classList.add('hidden-card');
            //             }
            //         });
                    
            //         // Reset counts and button
            //         currentlyShown = initialCardsToShow;
            //         cardCount.textContent = `Đang hiển thị ${currentlyShown} / ${totalCards} thẻ bài`;
            //         showMoreBtn.textContent = 'Hiển thị thêm';
            //         showMoreBtn.classList.remove('show-less');
                    
            //         // Remove this specific event listener to avoid duplicates
            //         showMoreBtn.removeEventListener('click', resetGallery);
            //     });
            // }
        });
        
        // Add elements to pagination container
        paginationContainer.appendChild(showMoreBtn);
        paginationContainer.appendChild(cardCount);
        paginationContainer.appendChild(document.createElement('br'));
        paginationContainer.appendChild(viewAllLink);
    }
    
    // Add CSS for card appearance animation
    const cardAppearStyle = document.createElement('style');
    cardAppearStyle.innerHTML = `
        @keyframes cardAppear {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(cardAppearStyle);
}