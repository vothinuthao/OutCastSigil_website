/**
 * Main performance optimization script for The Outcast's Sigil website
 * - Provides resource prioritization
 * - Implements progressive loading strategy
 * - Handles critical CSS and JS
 * - Defers non-critical resources
 */

// Configuration - Adjust these values based on site structure
const optimizationConfig = {
    // Critical path resources that should load first
    criticalResources: {
        css: ['main.css', 'responsive.css'],
        js: ['image-optimizer.js', 'lazy-loading.js']
    },
    // Resources that can be deferred
    deferredResources: {
        css: ['card.css', 'gallery.css', 'gallery-page.css'],
        js: ['card.js', 'gallery.js', 'card-detail.js']
    },
    // Main loading states
    loadingStates: {
        LOADING: 'loading',
        INTERACTIVE: 'interactive',
        COMPLETE: 'complete'
    },
    // Media breakpoints for responsive loading
    breakpoints: {
        mobile: 767,
        tablet: 1023
    }
};

// Initialize performance optimization
function initPerformanceOptimization() {
    // Set loading state in the document
    document.documentElement.dataset.loadingState = optimizationConfig.loadingStates.LOADING;
    
    // Track page load performance
    trackPageLoadPerformance();
    
    // Apply progressive enhancement techniques
    applyProgressiveEnhancement();
    
    // Handle resource prioritization
    prioritizeResources();
    
    // Setup event listeners for page states
    setupLoadingStateListeners();
}

// Track and log page load performance
function trackPageLoadPerformance() {
    // Check if Performance API is available
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            // Wait for a moment to get complete timing
            setTimeout(() => {
                const timing = window.performance.timing;
                
                // Calculate key metrics
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                const domReadyTime = timing.domComplete - timing.domLoading;
                const interactiveTime = timing.domInteractive - timing.navigationStart;
                
                // Log performance metrics
                console.log(`Page load time: ${loadTime}ms`);
                console.log(`DOM ready time: ${domReadyTime}ms`);
                console.log(`Time to interactive: ${interactiveTime}ms`);
                
                // Store metrics for potential reporting
                window.pagePerformance = {
                    loadTime,
                    domReadyTime,
                    interactiveTime
                };
            }, 0);
        });
    }
}

// Apply progressive enhancement based on device capabilities
function applyProgressiveEnhancement() {
    // Get device capability level (basic → advanced)
    const deviceCapability = getDeviceCapabilityLevel();
    
    // Add capability level to document for CSS targeting
    document.documentElement.dataset.capability = deviceCapability;
    
    // Apply enhancements based on capability
    switch (deviceCapability) {
        case 'advanced':
            // Enable all animations and effects
            enableAdvancedFeatures();
            break;
        
        case 'medium':
            // Enable most features but limit animations
            enableMediumFeatures();
            break;
        
        case 'basic':
        default:
            // Minimal features for low-end devices
            enableBasicFeatures();
            break;
    }
}

// Determine device capability level
function getDeviceCapabilityLevel() {
    // Check for hardware concurrency (CPU cores)
    const cpuCores = navigator.hardwareConcurrency || 1;
    
    // Check device memory if available (in GB)
    const deviceMemory = navigator.deviceMemory || 1;
    
    // Check viewport width
    const viewportWidth = window.innerWidth;
    
    // Check connection type if available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connection ? connection.effectiveType : '4g';
    
    // Determine level based on device capabilities
    if (
        cpuCores >= 4 && 
        deviceMemory >= 4 && 
        viewportWidth >= optimizationConfig.breakpoints.tablet &&
        ['4g', '3g'].includes(connectionType)
    ) {
        return 'advanced';
    } else if (
        cpuCores >= 2 && 
        deviceMemory >= 2 && 
        viewportWidth >= optimizationConfig.breakpoints.mobile &&
        ['4g', '3g'].includes(connectionType)
    ) {
        return 'medium';
    } else {
        return 'basic';
    }
}

// Enable advanced features for high-end devices
function enableAdvancedFeatures() {
    // Enable all animations
    document.documentElement.classList.add('enable-animations');
    
    // Load high-resolution images
    document.querySelectorAll('[data-quality]').forEach(img => {
        img.dataset.quality = 'high';
    });
    
    // Enable particle effects and complex animations
    const style = document.createElement('style');
    style.innerHTML = `
        .element-particle { display: block; }
        .card-particles { display: block; }
        @media (prefers-reduced-motion: no-preference) {
            .element-card { animation: elementCardFloat 6s ease-in-out infinite; }
            .gallery-card { animation: gentleFloat 8s ease-in-out infinite; }
        }
    `;
    document.head.appendChild(style);
}

// Enable medium features for mid-range devices
function enableMediumFeatures() {
    // Enable limited animations
    document.documentElement.classList.add('enable-animations');
    document.documentElement.classList.add('reduce-animations');
    
    // Load medium-resolution images
    document.querySelectorAll('[data-quality]').forEach(img => {
        img.dataset.quality = 'medium';
    });
    
    // Reduce animation complexity
    const style = document.createElement('style');
    style.innerHTML = `
        .element-particle { display: none; }
        .card-particles { display: block; opacity: 0.5; }
        @media (prefers-reduced-motion: no-preference) {
            .element-card { animation: elementCardFloat 8s ease-in-out infinite; }
            .gallery-card { animation: gentleFloat 10s ease-in-out infinite; }
        }
        
        /* Simplified animations */
        @keyframes elementCardFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        @keyframes gentleFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }
    `;
    document.head.appendChild(style);
}

// Enable basic features for low-end devices
function enableBasicFeatures() {
    // Disable most animations
    document.documentElement.classList.add('disable-animations');
    
    // Load low-resolution images
    document.querySelectorAll('[data-quality]').forEach(img => {
        img.dataset.quality = 'low';
    });
    
    // Disable particle effects and complex animations
    const style = document.createElement('style');
    style.innerHTML = `
        .element-particle { display: none; }
        .card-particles { display: none; }
        .element-card { animation: none !important; }
        .gallery-card { animation: none !important; }
        
        /* Disable transitions that aren't critical */
        .card-front, .card-back,
        .gallery-card .card-image,
        .element-symbol {
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Prioritize loading of critical resources
function prioritizeResources() {
    // Load critical CSS first
    loadCriticalCSS();
    
    // Defer non-critical CSS
    deferNonCriticalCSS();
    
    // Defer non-critical JavaScript
    deferNonCriticalJS();
    
    // Preload critical images
    preloadCriticalImages();
}

// Load critical CSS inline to avoid render blocking
function loadCriticalCSS() {
    // Critical CSS should be inlined in <head> for fastest rendering
    
    // Check if we need to add preload for critical stylesheets
    optimizationConfig.criticalResources.css.forEach(cssFile => {
        // Create preload link for critical CSS
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'style';
        preloadLink.href = `styles/${cssFile}`;
        document.head.appendChild(preloadLink);
    });
}

// Defer loading of non-critical CSS
function deferNonCriticalCSS() {
    // Get all stylesheet links
    const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
    
    styleLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // If it's a non-critical CSS file
        if (optimizationConfig.deferredResources.css.some(file => href.includes(file))) {
            // Change to preload and use onload to apply it
            link.rel = 'preload';
            link.as = 'style';
            link.onload = function() {
                this.onload = null;
                this.rel = 'stylesheet';
            };
            
            // Create a print media query to trick browser into background loading
            link.media = 'print';
            link.addEventListener('load', function() {
                this.media = 'all';
            });
        }
    });
}

// Defer loading of non-critical JavaScript
function deferNonCriticalJS() {
    // Find all script tags
    const scripts = document.querySelectorAll('script[src]');
    
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        
        // If it's a non-critical JS file
        if (optimizationConfig.deferredResources.js.some(file => src.includes(file))) {
            // Set to defer loading
            script.defer = true;
            
            // For really non-critical scripts, use async loading
            if (src.includes('gallery.js') || src.includes('card-detail.js')) {
                script.async = true;
            }
        }
    });
}

// Preload critical images (hero, logo, first visible section)
function preloadCriticalImages() {
    // Define critical images to preload
    const criticalImages = [
        // Logo image
        document.querySelector('.logo-img img')?.src,
        // Hero background
        document.querySelector('#hero')?.style.backgroundImage?.replace(/url\(['"]?([^'"]+)['"]?\)/i, '$1'),
        // First visible card image
        document.querySelector('.element-card:first-child .card-front')?.querySelector('img')?.src
    ].filter(Boolean); // Remove undefined entries
    
    // Preload critical images
    criticalImages.forEach(imageSrc => {
        if (!imageSrc) return;
        
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = imageSrc;
        document.head.appendChild(preloadLink);
    });
}

// Setup page loading state listeners
function setupLoadingStateListeners() {
    // Update loading state when DOM is interactive
    document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.dataset.loadingState = optimizationConfig.loadingStates.INTERACTIVE;
        
        // Show critical content first
        document.querySelectorAll('.critical-content').forEach(el => {
            el.classList.add('loaded');
        });
    });
    
    // Update loading state when page is fully loaded
    window.addEventListener('load', () => {
        document.documentElement.dataset.loadingState = optimizationConfig.loadingStates.COMPLETE;
        
        // Start deferred animations
        document.querySelectorAll('.deferred-animation').forEach(el => {
            el.classList.add('can-animate');
        });
        
        // Initialize resource cleanup after a short delay
        setTimeout(cleanupAfterLoad, 2000);
    });
}

// Clean up resources after page load
function cleanupAfterLoad() {
    // Remove any temporary loaders
    document.querySelectorAll('.temp-loader').forEach(loader => {
        loader.parentNode.removeChild(loader);
    });
    
    // Clean up any initialization objects we no longer need
    delete window.initPerformanceState;
}

// Listen for device capability change (like orientation change)
function listenForCapabilityChange() {
    // Listen for orientation change which might affect performance budget
    window.addEventListener('orientationchange', debounce(() => {
        // Recheck device capability
        const newCapabilityLevel = getDeviceCapabilityLevel();
        
        if (newCapabilityLevel !== document.documentElement.dataset.capability) {
            document.documentElement.dataset.capability = newCapabilityLevel;
            
            // Reapply appropriate features
            switch (newCapabilityLevel) {
                case 'advanced':
                    enableAdvancedFeatures();
                    break;
                case 'medium':
                    enableMediumFeatures();
                    break;
                case 'basic':
                    enableBasicFeatures();
                    break;
            }
        }
    }, 500));
}

// Debounce helper function
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Execute optimization as soon as possible
document.addEventListener('DOMContentLoaded', function() {
    initPerformanceOptimization();
    listenForCapabilityChange();
});

// Start immediately for early optimization
if (document.readyState === 'loading') {
    // Document still loading, set initial state
    document.documentElement.dataset.loadingState = optimizationConfig.loadingStates.LOADING;
} else {
    // Document already loaded, initialize everything
    initPerformanceOptimization();
    listenForCapabilityChange();
}