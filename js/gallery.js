// Emlak Web Sitesi - Fotoğraf Galerisi Modülü

class ImageGallery {
  constructor(options = {}) {
    this.options = {
      containerSelector: options.containerSelector || '.gallery-container',
      mainImageSelector: options.mainImageSelector || '.main-image',
      thumbnailSelector: options.thumbnailSelector || '.thumbnail',
      autoPlay: options.autoPlay || false,
      autoPlayInterval: options.autoPlayInterval || 5000,
      ...options
    };
    
    this.currentIndex = 0;
    this.autoPlayTimer = null;
    this.init();
  }
  
  init() {
    this.container = document.querySelector(this.options.containerSelector);
    if (!this.container) return;
    
    this.mainImage = this.container.querySelector(this.options.mainImageSelector);
    this.thumbnails = this.container.querySelectorAll(this.options.thumbnailSelector);
    
    if (this.thumbnails.length === 0) return;
    
    this.setupEventListeners();
    this.markCurrentThumbnail();
    
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  setupEventListeners() {
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        this.selectImage(index);
        this.stopAutoPlay();
      });
      
      thumbnail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectImage(index);
        }
      });
    });
    
    // Klavye navigasyonu
    document.addEventListener('keydown', (e) => {
      if (!this.container.contains(document.activeElement)) return;
      
      if (e.key === 'ArrowLeft') {
        this.previousImage();
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
      }
    });
  }
  
  selectImage(index) {
    if (index < 0 || index >= this.thumbnails.length) return;
    
    this.currentIndex = index;
    const thumbnail = this.thumbnails[index];
    const imageUrl = thumbnail.getAttribute('data-image') || thumbnail.src;
    const imageAlt = thumbnail.getAttribute('alt') || 'Emlak İlanı Görseli';
    
    // Smooth transition
    this.mainImage.style.opacity = '0';
    
    setTimeout(() => {
      this.mainImage.src = imageUrl;
      this.mainImage.alt = imageAlt;
      this.mainImage.style.opacity = '1';
    }, 300);
    
    this.markCurrentThumbnail();
  }
  
  markCurrentThumbnail() {
    this.thumbnails.forEach((thumb, index) => {
      if (index === this.currentIndex) {
        thumb.classList.add('active');
        thumb.setAttribute('aria-current', 'true');
      } else {
        thumb.classList.remove('active');
        thumb.setAttribute('aria-current', 'false');
      }
    });
  }
  
  nextImage() {
    const nextIndex = (this.currentIndex + 1) % this.thumbnails.length;
    this.selectImage(nextIndex);
  }
  
  previousImage() {
    const prevIndex = (this.currentIndex - 1 + this.thumbnails.length) % this.thumbnails.length;
    this.selectImage(prevIndex);
  }
  
  startAutoPlay() {
    this.autoPlayTimer = setInterval(() => {
      this.nextImage();
    }, this.options.autoPlayInterval);
  }
  
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
  
  destroy() {
    this.stopAutoPlay();
    this.thumbnails.forEach(thumb => {
      thumb.removeEventListener('click', null);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageGallery;
}
