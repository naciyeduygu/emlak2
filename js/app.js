/**
 * ============================================
 * EMLAK - Ana JavaScript Dosyası
 * ============================================
 * 
 * Özellikleri:
 * - Mobil menü yönetimi
 * - Filtreleme sistemi
 * - Form doğrulama
 * - Favori yönetimi (localStorage)
 * - Sayfalama
 * - Smooth scroll
 */

'use strict';

// ============================================
// PROPERTY GALLERY CLASS
// ============================================

class PropertyGallery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        if (!this.container) return;
        
        const images = this.container.querySelectorAll('img');
        this.images = Array.from(images);
        this.setupGallery();
    }

    setupGallery() {
        if (this.images.length === 0) return;

        this.images.forEach((img, index) => {
            img.addEventListener('click', () => this.showImage(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    }

    showImage(index) {
        this.currentIndex = index;
        this.images.forEach((img, i) => {
            img.style.opacity = i === index ? '1' : '0.5';
        });
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(this.currentIndex);
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(this.currentIndex);
    }
}

// ============================================
// PROPERTY FILTER CLASS
// ============================================

class PropertyFilter {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProperties();
    }

    setupEventListeners() {
        // Arama butonu
        const searchBtn = document.querySelector('.btn-primary');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.applyFilters());
        }

        // Enter tuşu
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyFilters();
        });
    }

    loadProperties() {
        // Örnek veriler
        this.properties = [
            {
                id: 1,
                title: 'Lüks Daire - Merkez',
                price: 2500000,
                type: 'satılık',
                location: 'Merkez',
                rooms: 3,
                bathrooms: 2,
                area: 150
            },
            {
                id: 2,
                title: 'Şehir Manzaralı Daire',
                price: 1800000,
                type: 'satılık',
                location: 'Şehir Merkezi',
                rooms: 2,
                bathrooms: 1,
                area: 100
            },
            {
                id: 3,
                title: 'Bahçeli Villa - Sakin Bölge',
                price: 3500000,
                type: 'satılık',
                location: 'Sakin Bölge',
                rooms: 4,
                bathrooms: 3,
                area: 250
            }
        ];
        this.filteredProperties = [...this.properties];
    }

    applyFilters() {
        const locationInput = document.querySelector('input[placeholder="Konum ara..."]');
        const typeSelect = document.querySelector('select');

        const location = locationInput ? locationInput.value.toLowerCase() : '';
        const type = typeSelect ? typeSelect.value : '';

        this.filteredProperties = this.properties.filter(prop => {
            const matchLocation = !location || prop.location.toLowerCase().includes(location);
            const matchType = !type || type === 'İlan Türü' || prop.type === type.toLowerCase();
            return matchLocation && matchType;
        });

        this.currentPage = 1;
        this.displayResults();
    }

    displayResults() {
        const resultsContainer = document.querySelector('.grid-3');
        if (!resultsContainer) return;

        if (this.filteredProperties.length === 0) {
            resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Arama kriterlerinize uygun ilan bulunamadı.</p>';
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedResults = this.filteredProperties.slice(startIndex, endIndex);

        resultsContainer.innerHTML = paginatedResults.map(prop => `
            <div class="card">
                <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop" alt="${prop.title}" class="card-image">
                <h3>${prop.title}</h3>
                <p style="color: #a67c52; font-weight: 600; margin-bottom: 0.5rem;">₺${prop.price.toLocaleString('tr-TR')}</p>
                <p style="font-size: 0.95rem; margin-bottom: 1rem;">${prop.rooms} Oda • ${prop.bathrooms} Banyo • ${prop.area} m²</p>
                <p style="font-size: 0.9rem; color: #4a3728; margin-bottom: 1rem;">${prop.location} konumunda, modern tasarım ve kaliteli yapı.</p>
                <button class="btn btn-accent" onclick="alert('İlan detay sayfasına yönlendirileceksiniz')">Detayları Gör</button>
            </div>
        `).join('');
    }
}

// ============================================
// FORM VALIDATOR CLASS
// ============================================

class FormValidator {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.validateForm(e, form));
        });
    }

    validateForm(e, form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                this.showError(input, 'Bu alan zorunludur');
            } else {
                this.clearError(input);
            }

            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    this.showError(input, 'Geçerli bir e-posta adresi girin');
                }
            }

            // Phone validation
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    this.showError(input, 'Geçerli bir telefon numarası girin');
                }
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    }

    showError(input, message) {
        input.style.borderColor = '#d32f2f';
        const error = document.createElement('small');
        error.style.color = '#d32f2f';
        error.style.display = 'block';
        error.style.marginTop = '0.25rem';
        error.textContent = message;
        input.parentNode.appendChild(error);
    }

    clearError(input) {
        input.style.borderColor = '#d4c8b8';
        const error = input.parentNode.querySelector('small');
        if (error) error.remove();
    }
}

// ============================================
// FAVORITE MANAGER CLASS
// ============================================

class FavoriteManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn')) {
                const propertyId = e.target.dataset.propertyId;
                this.toggleFavorite(propertyId);
            }
        });
    }

    toggleFavorite(propertyId) {
        const index = this.favorites.indexOf(propertyId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(propertyId);
        }
        this.saveFavorites();
        this.updateUI(propertyId);
    }

    saveFavorites() {
        localStorage.setItem('emlak_favorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const saved = localStorage.getItem('emlak_favorites');
        return saved ? JSON.parse(saved) : [];
    }

    updateUI(propertyId) {
        const btn = document.querySelector(`[data-property-id="${propertyId}"]`);
        if (btn) {
            btn.classList.toggle('favorited');
        }
    }

    isFavorite(propertyId) {
        return this.favorites.includes(propertyId);
    }
}

// ============================================
// PAGINATION CLASS
// ============================================

class Pagination {
    constructor(totalItems, itemsPerPage = 6) {
        this.totalItems = totalItems;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(totalItems / itemsPerPage);
    }

    getCurrentPageItems(items) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return items.slice(startIndex, endIndex);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Smooth scroll to element
 */
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    const propertyFilter = new PropertyFilter();
    const formValidator = new FormValidator();
    const favoriteManager = new FavoriteManager();

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                smoothScroll(href);
            }
        });
    });

    // Log initialization
    console.log('✅ Emlak Web Sitesi başarıyla yüklendi');
    console.log('📊 Bileşenler:', {
        propertyFilter: 'Aktif',
        formValidator: 'Aktif',
        favoriteManager: 'Aktif'
    });
});

// ============================================
// EXPORT FOR EXTERNAL USE
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PropertyGallery,
        PropertyFilter,
        FormValidator,
        FavoriteManager,
        Pagination,
        smoothScroll,
        formatCurrency,
        debounce,
        throttle
    };
}
