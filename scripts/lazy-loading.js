/**
 * Lazy loading implementation for The Outcast's Sigil website
 * - Loads images only when they're about to enter the viewport
 * - Uses Intersection Observer API with fallback
 * - Includes progressive loading with placeholders
 */

// Configuration options
const lazyLoadConfig = {
    rootMargin: '200px 0px',  // Load images when they're within 200px of viewport
    placeholderColor: 'rgba(13, 17, 26, 0.8)',
    placeholderShimmer: true,
    threshold: 0.1 // 10% of the element needs to be visible
};

// Initialize lazy loading
function initLazyLoad() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        setupIntersectionObserver();
    } else {
        // Fallback for older browsers
        loadImagesOnScroll();
    }
    
    // Also set up lazy loading for element cards and other animation elements
    setupLazyAnimations();
}

// Setup Intersection Observer for images
function setupIntersectionObserver() {
    const lazyImages = document.querySelectorAll('[data-src], [data-srcset], [data-bg-src], .lazy-load');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Handle background images
                if (img.hasAttribute('data-bg-src')) {
                    const src = img.getAttribute('data-bg-src');
                    img.style.backgroundImage = `url(${src})`;
                    img.removeAttribute('data-bg-src');
                    
                    // Add loading animation
                    img.classList.add('fade-in');
                }
                // Handle regular images
                else if (img.hasAttribute('data-src') || img.hasAttribute('data-srcset')) {
                    if (img.hasAttribute('data-srcset')) {
                        img.srcset = img.getAttribute('data-srcset');
                        img.removeAttribute('data-srcset');
                    }
                    
                    if (img.hasAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                    }
                    
                    // Add loading class for transition
                    img.classList.add('is-loading');
                    
                    // Set loaded class when image is actually loaded
                    img.onload = function() {
                        img.classList.remove('is-loading');
                        img.classList.add('is-loaded');
                    };
                }
                
                // For any lazy load element (images or other components)
                if (img.classList.contains('lazy-load')) {
                    img.classList.remove('lazy-load');
                    img.classList.add('loaded');
                }
                
                // Stop observing image after it's loaded
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: lazyLoadConfig.rootMargin,
        threshold: lazyLoadConfig.threshold
    });
    
    // Start observing all lazy images
    lazyImages.forEach(image => {
        imageObserver.observe(image);
        
        // Add placeholder if it's an image and doesn't have one
        if ((image.tagName === 'IMG') && !image.src) {
            setupImagePlaceholder(image);
        }
    });
    
    // Observe gallery cards for animation
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        imageObserver.observe(card);
    });
}

// Fallback lazy loading using scroll event
function loadImagesOnScroll() {
    const lazyImages = document.querySelectorAll('[data-src], [data-srcset], [data-bg-src], .lazy-load');
    
    // Add placeholder to all images
    lazyImages.forEach(img => {
        if ((img.tagName === 'IMG') && !img.src) {
            setupImagePlaceholder(img);
        }
    });
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 200 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to load visible images
    function loadVisibleImages() {
        lazyImages.forEach(img => {
            if (isInViewport(img)) {
                // Handle background images
                if (img.hasAttribute('data-bg-src')) {
                    const src = img.getAttribute('data-bg-src');
                    img.style.backgroundImage = `url(${src})`;
                    img.removeAttribute('data-bg-src');
                    img.classList.add('fade-in');
                }
                // Handle regular images
                else if (img.hasAttribute('data-src') || img.hasAttribute('data-srcset')) {
                    if (img.hasAttribute('data-srcset')) {
                        img.srcset = img.getAttribute('data-srcset');
                        img.removeAttribute('data-srcset');
                    }
                    
                    if (img.hasAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                    }
                    
                    img.classList.add('is-loading');
                    
                    img.onload = function() {
                        img.classList.remove('is-loading');
                        img.classList.add('is-loaded');
                    };
                }
                
                // For any lazy load element
                if (img.classList.contains('lazy-load')) {
                    img.classList.remove('lazy-load');
                    img.classList.add('loaded');
                }
            }
        });
    }
    
    // Load visible images on scroll
    window.addEventListener('scroll', throttle(loadVisibleImages, 200));
    window.addEventListener('resize', throttle(loadVisibleImages, 200));
    
    // Load initial images that are already in viewport
    loadVisibleImages();
}

// Setup image placeholder
function setupImagePlaceholder(img) {
    // Add placeholder class
    img.classList.add('img-placeholder');
    
    // Create a shimmer effect with CSS
    if (lazyLoadConfig.placeholderShimmer) {
        const placeholderStyles = document.createElement('style');
        placeholderStyles.innerHTML = `
            .img-placeholder {
                background-color: ${lazyLoadConfig.placeholderColor};
                position: relative;
                overflow: hidden;
            }
            .img-placeholder::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    rgba(255,255,255,0) 0%, 
                    rgba(255,255,255,0.1) 50%, 
                    rgba(255,255,255,0) 100%);
                animation: placeholder-shimmer 1.5s infinite;
                background-size: 200% 100%;
            }
            @keyframes placeholder-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            .is-loading {
                opacity: 0.5;
                transition: opacity 0.3s ease-in-out;
            }
            .is-loaded {
                opacity: 1;
                transition: opacity 0.3s ease-in-out;
            }
        `;
        
        // Add styles only once
        if (!document.getElementById('lazy-load-styles')) {
            placeholderStyles.id = 'lazy-load-styles';
            document.head.appendChild(placeholderStyles);
        }
    }
}

// Lazy load animations for element cards and other components
function setupLazyAnimations() {
    const animatedElements = document.querySelectorAll('.element-card, .section-intro, .game-features, .gameplay-content');
    
    // If Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class to trigger animation
                    entry.target.classList.add('visible', 'revealed');
                    
                    // Stop observing after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        // Start observing all animated elements
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    } 
    // Fallback for browsers without IntersectionObserver
    else {
        window.addEventListener('scroll', throttle(function() {
            animatedElements.forEach(element => {
                const position = element.getBoundingClientRect();
                
                // If element is in viewport
                if (position.top <= window.innerHeight * 0.9) {
                    element.classList.add('visible', 'revealed');
                }
            });
        }, 200));
    }
}

// Throttle helper function to limit function calls
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoad();
});