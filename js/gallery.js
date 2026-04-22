/**
 * ============================================
 * EMLAK - Fotoğraf Galerisi Modülü
 * ============================================
 * 
 * Özellikleri:
 * - Thumbnail navigasyonu
 * - Otomatik oynatma
 * - Klavye navigasyonu
 * - Accessibility support
 * - Touch gestures
 */

'use strict';

class AdvancedGallery {
    constructor(options = {}) {
        this.options = {
            autoplay: options.autoplay !== false,
            autoplayInterval: options.autoplayInterval || 5000,
            enableKeyboard: options.enableKeyboard !== false,
            enableTouch: options.enableTouch !== false,
            enableThumbnails: options.enableThumbnails !== false,
            ...options
        };

        this.galleries = [];
        this.currentGalleries = new Map();
        this.autoplayTimers = new Map();
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    /**
     * Initialize all galleries on page
     */
    init() {
        const galleryContainers = document.querySelectorAll('[data-gallery]');
        
        if (galleryContainers.length === 0) {
            console.warn('⚠️ Galeri konteyneri bulunamadı');
            return;
        }

        galleryContainers.forEach((container, index) => {
            this.initializeGallery(container, index);
        });

        // Setup event listeners
        this.setupEventListeners();
    }

    /**
     * Initialize individual gallery
     */
    initializeGallery(container, index) {
        const galleryId = container.getAttribute('data-gallery') || `gallery-${index}`;
        const images = container.querySelectorAll('img');

        if (images.length === 0) {
            console.warn(`⚠️ Galeri ${galleryId} içinde resim bulunamadı`);
            return;
        }

        const gallery = {
            id: galleryId,
            container: container,
            images: Array.from(images),
            currentIndex: 0,
            isPlaying: this.options.autoplay
        };

        this.galleries.push(gallery);
        this.currentGalleries.set(galleryId, gallery);

        // Create gallery structure
        this.createGalleryStructure(gallery);

        // Start autoplay if enabled
        if (this.options.autoplay) {
            this.startAutoplay(galleryId);
        }
    }

    /**
     * Create gallery HTML structure
     */
    createGalleryStructure(gallery) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-wrapper';
        wrapper.setAttribute('data-gallery-id', gallery.id);

        // Main image display
        const mainDisplay = document.createElement('div');
        mainDisplay.className = 'gallery-main';
        mainDisplay.innerHTML = `
            <img src="${gallery.images[0].src}" alt="${gallery.images[0].alt || 'Resim'}" class="gallery-main-image">
            <div class="gallery-controls">
                <button class="gallery-btn gallery-prev" aria-label="Önceki Resim">❮</button>
                <button class="gallery-btn gallery-next" aria-label="Sonraki Resim">❯</button>
            </div>
            <div class="gallery-counter">
                <span class="gallery-current">1</span> / <span class="gallery-total">${gallery.images.length}</span>
            </div>
        `;

        // Thumbnails
        if (this.options.enableThumbnails && gallery.images.length > 1) {
            const thumbnails = document.createElement('div');
            thumbnails.className = 'gallery-thumbnails';
            
            gallery.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.alt = img.alt || `Resim ${index + 1}`;
                thumb.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
                thumb.setAttribute('data-index', index);
                thumbnails.appendChild(thumb);
            });

            wrapper.appendChild(mainDisplay);
            wrapper.appendChild(thumbnails);
        } else {
            wrapper.appendChild(mainDisplay);
        }

        // Replace original container
        gallery.container.innerHTML = '';
        gallery.container.appendChild(wrapper);

        // Store references
        gallery.wrapper = wrapper;
        gallery.mainImage = wrapper.querySelector('.gallery-main-image');
        gallery.prevBtn = wrapper.querySelector('.gallery-prev');
        gallery.nextBtn = wrapper.querySelector('.gallery-next');
        gallery.thumbnails = wrapper.querySelectorAll('.gallery-thumbnail');
        gallery.counter = wrapper.querySelector('.gallery-current');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        this.galleries.forEach(gallery => {
            // Navigation buttons
            if (gallery.prevBtn) {
                gallery.prevBtn.addEventListener('click', () => this.prevImage(gallery.id));
            }
            if (gallery.nextBtn) {
                gallery.nextBtn.addEventListener('click', () => this.nextImage(gallery.id));
            }

            // Thumbnails
            gallery.thumbnails.forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    this.goToImage(gallery.id, index);
                });
            });

            // Keyboard navigation
            if (this.options.enableKeyboard) {
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prevImage(gallery.id);
                    if (e.key === 'ArrowRight') this.nextImage(gallery.id);
                });
            }

            // Touch gestures
            if (this.options.enableTouch) {
                gallery.container.addEventListener('touchstart', (e) => {
                    this.touchStartX = e.changedTouches[0].screenX;
                });

                gallery.container.addEventListener('touchend', (e) => {
                    this.touchEndX = e.changedTouches[0].screenX;
                    this.handleSwipe(gallery.id);
                });
            }

            // Pause autoplay on hover
            gallery.container.addEventListener('mouseenter', () => {
                this.pauseAutoplay(gallery.id);
            });

            gallery.container.addEventListener('mouseleave', () => {
                if (this.options.autoplay) {
                    this.startAutoplay(gallery.id);
                }
            });
        });
    }

    /**
     * Show specific image
     */
    goToImage(galleryId, index) {
        const gallery = this.currentGalleries.get(galleryId);
        if (!gallery) return;

        // Validate index
        if (index < 0 || index >= gallery.images.length) return;

        gallery.currentIndex = index;
        this.updateGalleryDisplay(gallery);

        // Reset autoplay
        if (this.options.autoplay) {
            this.pauseAutoplay(galleryId);
            this.startAutoplay(galleryId);
        }
    }

    /**
     * Next image
     */
    nextImage(galleryId) {
        const gallery = this.currentGalleries.get(galleryId);
        if (!gallery) return;

        gallery.currentIndex = (gallery.currentIndex + 1) % gallery.images.length;
        this.updateGalleryDisplay(gallery);
    }

    /**
     * Previous image
     */
    prevImage(galleryId) {
        const gallery = this.currentGalleries.get(galleryId);
        if (!gallery) return;

        gallery.currentIndex = (gallery.currentIndex - 1 + gallery.images.length) % gallery.images.length;
        this.updateGalleryDisplay(gallery);
    }

    /**
     * Update gallery display
     */
    updateGalleryDisplay(gallery) {
        const currentImage = gallery.images[gallery.currentIndex];

        // Update main image
        gallery.mainImage.src = currentImage.src;
        gallery.mainImage.alt = currentImage.alt || 'Resim';

        // Update counter
        if (gallery.counter) {
            gallery.counter.textContent = gallery.currentIndex + 1;
        }

        // Update thumbnails
        gallery.thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === gallery.currentIndex);
        });

        // Add animation
        gallery.mainImage.style.animation = 'none';
        setTimeout(() => {
            gallery.mainImage.style.animation = 'fadeIn 0.3s ease-in';
        }, 10);
    }

    /**
     * Handle swipe gestures
     */
    handleSwipe(galleryId) {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextImage(galleryId); // Swiped left
            } else {
                this.prevImage(galleryId); // Swiped right
            }
        }
    }

    /**
     * Start autoplay
     */
    startAutoplay(galleryId) {
        const gallery = this.currentGalleries.get(galleryId);
        if (!gallery || !this.options.autoplay) return;

        // Clear existing timer
        if (this.autoplayTimers.has(galleryId)) {
            clearInterval(this.autoplayTimers.get(galleryId));
        }

        const timer = setInterval(() => {
            this.nextImage(galleryId);
        }, this.options.autoplayInterval);

        this.autoplayTimers.set(galleryId, timer);
    }

    /**
     * Pause autoplay
     */
    pauseAutoplay(galleryId) {
        if (this.autoplayTimers.has(galleryId)) {
            clearInterval(this.autoplayTimers.get(galleryId));
            this.autoplayTimers.delete(galleryId);
        }
    }

    /**
     * Stop all galleries
     */
    stopAll() {
        this.autoplayTimers.forEach((timer) => clearInterval(timer));
        this.autoplayTimers.clear();
    }

    /**
     * Destroy gallery
     */
    destroy(galleryId) {
        this.pauseAutoplay(galleryId);
        this.currentGalleries.delete(galleryId);
        this.galleries = this.galleries.filter(g => g.id !== galleryId);
    }
}

// ============================================
// CSS STYLES FOR GALLERY
// ============================================

const galleryStyles = `
    .gallery-wrapper {
        position: relative;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .gallery-main {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: 8px;
        background-color: #f5f0eb;
    }

    .gallery-main-image {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
        animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .gallery-controls {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
        pointer-events: none;
    }

    .gallery-btn {
        pointer-events: all;
        background-color: rgba(166, 124, 82, 0.8);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gallery-btn:hover {
        background-color: rgba(166, 124, 82, 1);
        transform: scale(1.1);
    }

    .gallery-counter {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    .gallery-thumbnails {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        overflow-x: auto;
        padding: 0.5rem 0;
    }

    .gallery-thumbnail {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0.6;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        flex-shrink: 0;
    }

    .gallery-thumbnail:hover {
        opacity: 0.8;
    }

    .gallery-thumbnail.active {
        opacity: 1;
        border-color: #a67c52;
    }

    @media (max-width: 768px) {
        .gallery-btn {
            width: 35px;
            height: 35px;
            font-size: 1rem;
        }

        .gallery-thumbnail {
            width: 50px;
            height: 50px;
        }
    }
`;

// ============================================
// INJECT STYLES
// ============================================

const styleSheet = document.createElement('style');
styleSheet.textContent = galleryStyles;
document.head.appendChild(styleSheet);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize gallery
    const gallery = new AdvancedGallery({
        autoplay: true,
        autoplayInterval: 5000,
        enableKeyboard: true,
        enableTouch: true,
        enableThumbnails: true
    });

    console.log('✅ Galeri modülü başarıyla yüklendi');
});

// ============================================
// EXPORT
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedGallery;
}
