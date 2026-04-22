/**
 * ============================================
 * EMLAK - Dinamik İlanlar Yönetimi
 * ============================================
 */

'use strict';

class ListingsManager {
    constructor() {
        this.listings = this.generateListings();
        this.filteredListings = [...this.listings];
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.init();
    }

    /**
     * Örnek ilanları oluştur
     */
    generateListings() {
        const images = [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1512917774080-9b274b3f5798?w=400&h=250&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
        ];

        return [
            {
                id: 1,
                title: 'Lüks Daire - Merkez',
                location: 'Beşiktaş, İstanbul',
                price: 2500000,
                type: 'satılık',
                category: 'daire',
                rooms: 3,
                bathrooms: 2,
                area: 150,
                image: images[0],
                featured: true,
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 2,
                title: 'Şehir Manzaralı Daire',
                location: 'Şişli, İstanbul',
                price: 1800000,
                type: 'satılık',
                category: 'daire',
                rooms: 2,
                bathrooms: 1,
                area: 100,
                image: images[1],
                featured: true,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                id: 3,
                title: 'Bahçeli Villa - Sakin Bölge',
                location: 'Sarıyer, İstanbul',
                price: 3500000,
                type: 'satılık',
                category: 'villa',
                rooms: 4,
                bathrooms: 3,
                area: 250,
                image: images[2],
                featured: true,
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                id: 4,
                title: 'Modern Ofis Alanı',
                location: 'Maslak, İstanbul',
                price: 1200000,
                type: 'satılık',
                category: 'ofis',
                rooms: 1,
                bathrooms: 1,
                area: 80,
                image: images[3],
                featured: false,
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
            },
            {
                id: 5,
                title: 'Kiralık Daire - Üniversite Yakını',
                location: 'Fatih, İstanbul',
                price: 15000,
                type: 'kiralık',
                category: 'daire',
                rooms: 1,
                bathrooms: 1,
                area: 50,
                image: images[4],
                featured: false,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                id: 6,
                title: 'Plaj Manzaralı Daire',
                location: 'Kadıköy, İstanbul',
                price: 4200000,
                type: 'satılık',
                category: 'daire',
                rooms: 3,
                bathrooms: 2,
                area: 180,
                image: images[5],
                featured: true,
                date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000)
            },
            {
                id: 7,
                title: 'Kiralık Villa - Orman Manzarası',
                location: 'Eyüp, İstanbul',
                price: 25000,
                type: 'kiralık',
                category: 'villa',
                rooms: 4,
                bathrooms: 3,
                area: 200,
                image: images[6],
                featured: false,
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 8,
                title: 'Ticari Alan - Merkez Lokasyon',
                location: 'Taksim, İstanbul',
                price: 800000,
                type: 'satılık',
                category: 'ofis',
                rooms: 1,
                bathrooms: 1,
                area: 60,
                image: images[7],
                featured: false,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        ];
    }

    /**
     * Initialize
     */
    init() {
        this.setupEventListeners();
        this.render();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e));
        }

        // Search form
        const searchBtn = document.querySelector('.btn-search-submit');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleAdvancedSearch());
        }
    }

    /**
     * Handle filter
     */
    handleFilter(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        this.currentFilter = e.target.dataset.filter;
        this.applyFilters();
    }

    /**
     * Handle sort
     */
    handleSort(e) {
        this.currentSort = e.target.value;
        this.applyFilters();
    }

    /**
     * Handle advanced search
     */
    handleAdvancedSearch() {
        const location = document.getElementById('locationInput').value.toLowerCase();
        const type = document.getElementById('typeSelect').value;
        const category = document.getElementById('categorySelect').value;
        const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

        this.filteredListings = this.listings.filter(listing => {
            const matchLocation = !location || listing.location.toLowerCase().includes(location);
            const matchType = !type || listing.type === type;
            const matchCategory = !category || listing.category === category;
            const matchPrice = listing.price >= minPrice && listing.price <= maxPrice;
            return matchLocation && matchType && matchCategory && matchPrice;
        });

        this.applySort();
        this.render();
    }

    /**
     * Apply filters
     */
    applyFilters() {
        if (this.currentFilter === 'all') {
            this.filteredListings = [...this.listings];
        } else {
            this.filteredListings = this.listings.filter(
                listing => listing.type === this.currentFilter
            );
        }

        this.applySort();
        this.render();
    }

    /**
     * Apply sort
     */
    applySort() {
        switch (this.currentSort) {
            case 'newest':
                this.filteredListings.sort((a, b) => b.date - a.date);
                break;
            case 'price-low':
                this.filteredListings.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredListings.sort((a, b) => b.price - a.price);
                break;
        }
    }

    /**
     * Format price
     */
    formatPrice(price) {
        if (price >= 1000000) {
            return (price / 1000000).toFixed(1) + 'M ₺';
        } else if (price >= 1000) {
            return (price / 1000).toFixed(0) + 'K ₺';
        }
        return price + ' ₺';
    }

    /**
     * Render listings
     */
    render() {
        const grid = document.getElementById('listingsGrid');
        if (!grid) return;

        if (this.filteredListings.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="font-size: 1.2rem; color: #4a3728;">Arama kriterlerinize uygun ilan bulunamadı.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.filteredListings.map(listing => `
            <div class="listing-card" onclick="openListingDetail(${listing.id})">
                <div class="listing-image">
                    <img src="${listing.image}" alt="${listing.title}">
                    <div class="listing-badge">${listing.type === 'satılık' ? 'SATILSA' : 'KİRALIK'}</div>
                </div>
                <div class="listing-content">
                    <h3 class="listing-title">${listing.title}</h3>
                    <div class="listing-location">
                        <span>📍</span>
                        <span>${listing.location}</span>
                    </div>
                    <div class="listing-price">${this.formatPrice(listing.price)}</div>
                    <div class="listing-features">
                        <div class="listing-feature">
                            <span>🛏️</span>
                            <span>${listing.rooms} Oda</span>
                        </div>
                        <div class="listing-feature">
                            <span>🚿</span>
                            <span>${listing.bathrooms} Banyo</span>
                        </div>
                        <div class="listing-feature">
                            <span>📐</span>
                            <span>${listing.area} m²</span>
                        </div>
                    </div>
                    <div class="listing-actions">
                        <button class="btn-detail">Detayları Gör</button>
                        <button class="btn-favorite" onclick="toggleFavorite(event, ${listing.id})">❤️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Open listing detail
 */
function openListingDetail(id) {
    alert(`İlan #${id} detay sayfasına yönlendirileceksiniz`);
    // window.location.href = `listing-detail.html?id=${id}`;
}

/**
 * Toggle favorite
 */
function toggleFavorite(e, id) {
    e.stopPropagation();
    const btn = e.target;
    btn.style.color = btn.style.color === 'red' ? '#a67c52' : 'red';
    
    // Save to localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    const listingsManager = new ListingsManager();
    console.log('✅ İlanlar yönetim sistemi başlatıldı');
});
