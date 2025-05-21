// card-detail.js - JavaScript for card detail modal functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize card detail modal functionality
    initCardDetailModal();
});

// Initialize the card detail modal
async function initCardDetailModal() {
    try {
        // Create modal structure if it doesn't exist
        createModalStructure();
        
        // Fetch the cards data
        const response = await fetch('data/cards.json');
        if (!response.ok) {
            console.log("Could not fetch cards data for modal, setting up basic card click handlers");
            setupBasicCardClickHandlers();
            return;
        }
        
        const data = await response.json();
        
        // Add click event to all gallery cards
        setupCardClickHandlers(data.cards);
        
    } catch (error) {
        console.error('Error initializing card detail modal:', error);
        // Fallback to basic card click handlers
        setupBasicCardClickHandlers();
    }
}

// Create modal HTML structure
function createModalStructure() {
    // Check if modal already exists
    if (document.getElementById('card-detail-modal')) {
        return;
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'card-detail-modal';
    modal.className = 'card-modal';
    
    // Modal HTML structure
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <div class="card-preview">
                    <h3 id="modal-card-name">Card Name</h3>
                    <!-- Card image will be inserted here by JavaScript -->
                    <div class="element-symbol" id="modal-element-symbol">
                        <i class="fas fa-circle"></i>
                    </div>
                </div>
                <div class="card-details">
                    <div class="card-header">
                        <h2 id="modal-name">Card Name</h2>
                        <span class="card-subtitle" id="modal-name-en">English Name</span>
                        <div class="card-rarity" id="modal-rarity">Common</div>
                    </div>
                    <div class="card-stats">
                        <div class="stat-item">
                            <span class="stat-label">Tấn công:</span>
                            <span class="stat-value" id="modal-attack">50</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Phòng thủ:</span>
                            <span class="stat-value" id="modal-defense">50</span>
                        </div>
                    </div>
                    <div class="card-effect">
                        <h3>Hiệu Ứng Đặc Biệt</h3>
                        <div class="effect-name" id="modal-effect-name">Effect Name</div>
                        <div class="effect-description" id="modal-effect">Effect description</div>
                        <div class="effect-trigger">
                            <span class="trigger-label">Kích hoạt:</span>
                            <span class="trigger-value" id="modal-activate-on">When condition</span>
                        </div>
                    </div>
                    <div class="card-relations">
                        <div class="relation-item">
                            <span class="relation-label">Tương sinh:</span>
                            <span class="relation-value" id="modal-boost">Element</span>
                        </div>
                        <div class="relation-item">
                            <span class="relation-label">Tương khắc:</span>
                            <span class="relation-value" id="modal-weak">Element</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Setup close button functionality
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add CSS for modal
    const modalStyles = document.createElement('style');
    modalStyles.innerHTML = `
        .card-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: linear-gradient(145deg, rgba(26, 33, 46, 0.95), rgba(19, 24, 35, 0.9));
            margin: 10% auto;
            padding: 0;
            border: 1px solid var(--color-highlight);
            width: 80%;
            max-width: 800px;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(115, 93, 143, 0.5);
            position: relative;
            animation: modalFadeIn 0.4s ease;
        }
        
        @keyframes modalFadeIn {
            from {opacity: 0; transform: translateY(-50px);}
            to {opacity: 1; transform: translateY(0);}
        }
        
        .close-modal {
            color: var(--color-text-secondary);
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
        }
        
        .close-modal:hover {
            color: var(--color-highlight);
            transform: scale(1.2);
        }
        
        .modal-body {
            display: flex;
            padding: 2rem;
            gap: 2rem;
        }
        
        .card-preview {
            width: 240px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .card-preview-image {
            width: 100%;
            height: 336px;
            border-radius: 8px;
            overflow: hidden;
            margin: 1rem 0;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
            border: 2px solid rgba(255, 255, 255, 0.1);
            position: relative;
        }
        
        .card-preview-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .card-front {
            width: 100%;
            padding: 1.5rem;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-shadow: var(--card-shadow);
            background: linear-gradient(145deg, rgba(26, 33, 46, 0.9), rgba(19, 24, 35, 0.8));
            border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .card-details {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .card-header h2 {
            margin: 0 0 0.5rem 0;
            color: var(--color-highlight);
        }
        
        .card-subtitle {
            font-style: italic;
            color: var(--color-text-secondary);
            font-size: 1rem;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .card-rarity {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .card-rarity.common {
            background-color: rgba(150, 150, 150, 0.2);
            border: 1px solid rgba(150, 150, 150, 0.5);
            color: #d0d0d0;
        }
        
        .card-rarity.rare {
            background-color: rgba(0, 112, 221, 0.2);
            border: 1px solid rgba(0, 112, 221, 0.5);
            color: #5aafff;
        }
        
        .card-rarity.epic {
            background-color: rgba(163, 53, 238, 0.2);
            border: 1px solid rgba(163, 53, 238, 0.5);
            color: #c88eff;
        }
        
        .card-rarity.legendary {
            background-color: rgba(255, 128, 0, 0.2);
            border: 1px solid rgba(255, 128, 0, 0.5);
            color: #ffb366;
        }
        
        .card-stats {
            display: flex;
            gap: 2rem;
            margin-bottom: 1rem;
        }
        
        .stat-item, .relation-item {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 0.8rem 1.2rem;
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat-label, .relation-label, .trigger-label {
            font-weight: 600;
            color: var(--color-text-secondary);
            margin-right: 0.5rem;
        }
        
        .stat-value, .relation-value, .trigger-value {
            font-weight: 700;
            color: var(--color-text);
        }
        
        .card-effect {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 1.2rem;
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 1rem;
        }
        
        .card-effect h3 {
            margin-top: 0;
            margin-bottom: 1rem;
            color: var(--color-highlight);
            font-size: 1.2rem;
        }
        
        .effect-name {
            font-weight: 700;
            color: var(--color-text);
            margin-bottom: 0.8rem;
            font-size: 1.1rem;
        }
        
        .effect-description {
            color: var(--color-text-secondary);
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .effect-trigger {
            font-size: 0.9rem;
            padding-top: 0.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .card-relations {
            display: flex;
            gap: 1rem;
        }
        
        /* Element color styling */
        .element-symbol {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 1rem 0;
            font-size: 2.2rem;
            transition: all 0.5s ease;
            background-color: rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: visible;
        }

        /* Add card glow effect in modal */
        .card-preview-image::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 8px;
            opacity: 0.7;
            pointer-events: none;
            transition: opacity 0.5s ease;
            box-shadow: inset 0 0 30px rgba(var(--element-color-rgb), 0.8);
            animation: elementPulse 3s infinite;
        }

        @keyframes elementPulse {
            0% { opacity: 0.3; }
            50% { opacity: 0.7; }
            100% { opacity: 0.3; }
        }
        
        /* Media queries for responsive design */
        @media screen and (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 5% auto;
            }
            
            .modal-body {
                flex-direction: column;
                align-items: center;
                padding: 1.5rem;
                gap: 1.5rem;
            }
            
            .card-preview {
                width: 200px;
            }
            
            .card-preview-image {
                height: 280px;
            }
            
            .card-stats {
                flex-direction: column;
                gap: 0.8rem;
            }
            
            .card-relations {
                flex-direction: column;
                gap: 0.8rem;
            }
        }
    `;
    
    document.head.appendChild(modalStyles);
}

// Fallback to basic card click handlers if JSON can't be loaded
function setupBasicCardClickHandlers() {
    document.addEventListener('click', function(event) {
        // Check if clicked element is a gallery card or inside one
        const galleryCard = event.target.closest('.gallery-card');
        if (galleryCard) {
            // Get element type and name from the card
            const elementType = galleryCard.getAttribute('data-element') || 'default';
            const cardName = galleryCard.querySelector('h4')?.textContent || 'Unknown Card';
            
            // Get card image path
            const cardImageEl = galleryCard.querySelector('img');
            const imageSrc = cardImageEl ? cardImageEl.src : null;
            
            // Create a basic card data object
            const basicCardData = {
                name: cardName,
                nameEn: `${cardName} (English)`,
                element: elementType,
                rarity: 'common',
                attack: Math.floor(Math.random() * 50) + 50, // Random value as placeholder
                defense: Math.floor(Math.random() * 50) + 50, // Random value as placeholder
                effectName: 'Basic Effect',
                effect: 'This card has a basic effect based on its element.',
                activateOn: 'When played',
                image: imageSrc
            };
            
            // Show card detail modal with basic data
            showCardDetail(basicCardData);
        }
    });
}

// Add click event handlers to gallery cards
function setupCardClickHandlers(cardsData) {
    // Add click event to all gallery cards (current and future)
    document.addEventListener('click', function(event) {
        // Check if clicked element is a gallery card or inside one
        const galleryCard = event.target.closest('.gallery-card');
        if (galleryCard) {
            const cardId = galleryCard.getAttribute('data-id');
            if (cardId) {
                // Find the card data
                const cardData = cardsData.find(card => card.id === cardId);
                if (cardData) {
                    showCardDetail(cardData);
                    return;
                }
            }
            
            // If no data-id attribute, use data-element as fallback
            const elementType = galleryCard.getAttribute('data-element');
            const cardName = galleryCard.querySelector('h4')?.textContent;
            
            // Try to find the card by name and element
            if (elementType && cardName) {
                const cardData = cardsData.find(card => 
                    card.name === cardName && 
                    getElementClass(card.element) === elementType
                );
                
                if (cardData) {
                    showCardDetail(cardData);
                } else {
                    // If still no match, create basic data from the card
                    const cardImageEl = galleryCard.querySelector('img');
                    const imageSrc = cardImageEl ? cardImageEl.src : null;
                    
                    const basicCardData = {
                        name: cardName,
                        nameEn: `${cardName} (English)`,
                        element: elementType,
                        rarity: 'common',
                        attack: Math.floor(Math.random() * 50) + 50,
                        defense: Math.floor(Math.random() * 50) + 50,
                        effectName: 'Basic Effect',
                        effect: 'This card has a basic effect based on its element.',
                        activateOn: 'When played',
                        image: imageSrc
                    };
                    
                    showCardDetail(basicCardData);
                }
            }
        }
    });
}

// Show card detail in modal
function showCardDetail(card) {
    const modal = document.getElementById('card-detail-modal');
    if (!modal) return;
    
    // Helper function to determine element relationship
    function getRelationships(element) {
        const relationships = {
            metal: { boosts: 'Thủy (Water)', weakTo: 'Hỏa (Fire)' },
            wood: { boosts: 'Hỏa (Fire)', weakTo: 'Kim (Metal)' },
            water: { boosts: 'Mộc (Wood)', weakTo: 'Thổ (Earth)' },
            earth: { boosts: 'Kim (Metal)', weakTo: 'Mộc (Wood)' },
            fire: { boosts: 'Thổ (Earth)', weakTo: 'Thủy (Water)' }
        };
        
        return relationships[element] || { boosts: 'None', weakTo: 'None' };
    }
    
    // Create an image element for the card preview
    const cardPreview = document.getElementById('modal-card-name').parentElement;
    
    // Remove any existing image if present
    const existingImage = cardPreview.querySelector('.card-preview-image');
    if (existingImage) {
        existingImage.remove();
    }
    
    // Create a new image container
    const cardImage = document.createElement('div');
    cardImage.className = 'card-preview-image';
    
    // Set image path
    let imagePath;
    
    // If card.image is a full URL, use it directly
    if (card.image && (card.image.startsWith('http') || card.image.startsWith('/'))) {
        imagePath = card.image;
    } else {
        // Otherwise, construct the path
        imagePath = `images/arts/${card.element}/${card.image || 'default.png'}`;
    }
    
    // Create image with proper error handling
    cardImage.innerHTML = `
        <img src="${imagePath}" alt="${card.name}">
    `;
    
    // Set CSS variable for element color for the glow effect
    const elementColors = {
        metal: '197, 209, 235',
        wood: '115, 185, 92',
        water: '62, 136, 194',
        earth: '181, 131, 90',
        fire: '230, 76, 76'
    };
    
    cardImage.style.setProperty('--element-color-rgb', 
        elementColors[card.element] || '138, 104, 212');
    
    // Insert the image after the card name but before the element symbol
    const elementSymbol = document.getElementById('modal-element-symbol');
    cardPreview.insertBefore(cardImage, elementSymbol);
    
    // Update modal content with card data
    document.getElementById('modal-card-name').textContent = card.name;
    document.getElementById('modal-name').textContent = card.name;
    document.getElementById('modal-name-en').textContent = card.nameEn || '';
    
    // Set element symbol icon
    const elementSymbolEl = document.getElementById('modal-element-symbol');
    elementSymbolEl.innerHTML = getElementIcon(card.element);
    elementSymbolEl.className = `element-symbol ${card.element}`;
    
    // Style element symbol based on element
    const elementCSSColors = {
        metal: 'var(--color-metal)',
        wood: 'var(--color-wood)',
        water: 'var(--color-water)',
        earth: 'var(--color-earth)',
        fire: 'var(--color-fire)'
    };
    
    elementSymbolEl.style.color = elementCSSColors[card.element] || 'white';
    elementSymbolEl.style.borderColor = elementCSSColors[card.element] || 'white';
    elementSymbolEl.style.boxShadow = `0 0 15px ${elementCSSColors[card.element] || 'white'}`;
    
    // Set rarity
    const rarityElem = document.getElementById('modal-rarity');
    rarityElem.textContent = card.rarity ? card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1) : 'Common';
    rarityElem.className = `card-rarity ${card.rarity || 'common'}`;
    
    // Set stats
    document.getElementById('modal-attack').textContent = card.attack || '50';
    document.getElementById('modal-defense').textContent = card.defense || '50';
    
    // Set effect details
    document.getElementById('modal-effect-name').textContent = card.effectName || 'Basic Effect';
    document.getElementById('modal-effect').textContent = card.effect || 'This card has a basic effect.';
    document.getElementById('modal-activate-on').textContent = card.activateOn || 'When played';
    
    // Set relationships
    const relationships = getRelationships(card.element);
    document.getElementById('modal-boost').textContent = relationships.boosts;
    document.getElementById('modal-weak').textContent = relationships.weakTo;
    
    // Display modal
    modal.style.display = 'block';
    
    // Add special particle effects for the card in the modal
    addModalCardParticles(card.element);
}

// Add elemental particle effects to the modal card
function addModalCardParticles(elementType) {
    // Get the preview image container
    const previewImage = document.querySelector('.card-preview-image');
    if (!previewImage) return;
    
    // Remove any existing particles
    const existingParticles = previewImage.querySelector('.modal-particles');
    if (existingParticles) {
        existingParticles.remove();
    }
    
    // Create particle container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'modal-particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 5;
    `;
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        
        // Random size
        const size = Math.random() * 6 + 3; // 3-9px
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Animation duration and delay
        const duration = Math.random() * 3 + 3; // 3-6s
        const delay = Math.random() * 2; // 0-2s
        
        // Element-specific color
        const colors = {
            metal: 'rgba(197, 209, 235, 0.7)',
            wood: 'rgba(115, 185, 92, 0.7)',
            water: 'rgba(62, 136, 194, 0.7)',
            earth: 'rgba(181, 131, 90, 0.7)',
            fire: 'rgba(230, 76, 76, 0.7)'
        };
        
        const color = colors[elementType] || 'rgba(138, 104, 212, 0.7)';
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            top: ${posY}%;
            left: ${posX}%;
            opacity: 0;
            box-shadow: 0 0 ${size/2}px ${color};
            animation: modalParticleFloat ${duration}s ease-in-out ${delay}s infinite;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add animation keyframes
    if (!document.getElementById('modal-particle-animation')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-particle-animation';
        styleSheet.innerHTML = `
            @keyframes modalParticleFloat {
                0% { transform: translateY(0); opacity: 0; }
                20% { opacity: 0.7; }
                80% { opacity: 0.5; }
                100% { transform: translateY(-30px) translateX(${Math.random() > 0.5 ? '+' : '-'}15px); opacity: 0; }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Add particles to the preview image
    previewImage.appendChild(particlesContainer);
}

// Helper function to get element icon
function getElementIcon(element) {
    const icons = {
        metal: '<i class="fas fa-circle"></i>',
        wood: '<i class="fas fa-leaf"></i>',
        water: '<i class="fas fa-water"></i>',
        earth: '<i class="fas fa-mountain"></i>',
        fire: '<i class="fas fa-fire"></i>'
    };
    
    return icons[element] || '<i class="fas fa-circle"></i>';
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