/**
 * Image optimization functions for The Outcast's Sigil website
 * - Converts images to WebP format on the fly
 * - Detects browser support for modern formats
 * - Provides fallback for older browsers
 */

// Check if browser supports WebP
function checkWebpSupport() {
    return new Promise(resolve => {
        const webpImg = new Image();
        webpImg.onload = function() { resolve(true); };
        webpImg.onerror = function() { resolve(false); };
        webpImg.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    });
}

// Create srcset for responsive images
function generateSrcset(basePath, imgName, formats) {
    const srcsetArray = [];
    
    formats.forEach(format => {
        srcsetArray.push(`${basePath}${imgName}-${format.width}w.${format.ext} ${format.width}w`);
    });
    
    return srcsetArray.join(', ');
}

// Initialize image optimization
async function initImageOptimizer() {
    // Check WebP support
    const supportsWebP = await checkWebpSupport();
    
    // Store in window object for other scripts to use
    window.imageSupport = {
        webp: supportsWebP
    };
    
    // Apply to all images that need optimization
    const imagesToOptimize = document.querySelectorAll('[data-optimize="true"]');
    
    imagesToOptimize.forEach(img => {
        const basePath = img.getAttribute('data-base-path') || './images/';
        const imgName = img.getAttribute('data-img-name');
        const imgType = img.getAttribute('data-img-type') || 'card';
        
        if (!imgName) return;
        
        // Define responsive image formats
        let formats = [];
        
        if (supportsWebP) {
            // WebP formats at different sizes
            formats = [
                { width: 480, ext: 'webp' },
                { width: 768, ext: 'webp' },
                { width: 1200, ext: 'webp' }
            ];
        } else {
            // JPG fallback at different sizes
            formats = [
                { width: 480, ext: 'jpg' },
                { width: 768, ext: 'jpg' },
                { width: 1200, ext: 'jpg' }
            ];
        }
        
        // For card images, use smaller sizes
        if (imgType === 'card') {
            formats = supportsWebP ? 
                [{ width: 240, ext: 'webp' }, { width: 480, ext: 'webp' }] : 
                [{ width: 240, ext: 'jpg' }, { width: 480, ext: 'jpg' }];
        }
        
        // Generate and set srcset
        img.srcset = generateSrcset(basePath, imgName, formats);
        
        // Set default src as fallback (smallest size)
        const fallbackExt = supportsWebP ? 'webp' : 'jpg';
        const fallbackWidth = imgType === 'card' ? 240 : 480;
        img.src = `${basePath}${imgName}-${fallbackWidth}w.${fallbackExt}`;
        
        // Add sizes attribute if not present
        if (!img.sizes) {
            if (imgType === 'card') {
                img.sizes = "(max-width: 768px) 140px, 240px";
            } else {
                img.sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px";
            }
        }
    });
}

// Execute when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initImageOptimizer();
});