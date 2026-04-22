// Emlak Web Sitesi - Ana JavaScript Dosyası

// DOM Öğeleri
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');
const filterBtn = document.querySelector('.filter-btn');
const filterPanel = document.querySelector('.filter-panel');

// Mobil Menü Toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });
}

// Filtreleme Paneli Toggle
if (filterBtn) {
  filterBtn.addEventListener('click', () => {
    filterPanel.classList.toggle('active');
  });
}

// Fotoğraf Galerisi
class PropertyGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.mainImage = this.container.querySelector('.main-image');
    this.thumbnails = this.container.querySelectorAll('.thumbnail');
    this.currentIndex = 0;
    
    this.initializeGallery();
  }
  
  initializeGallery() {
    this.thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.selectImage(index);
      });
    });
  }
  
  selectImage(index) {
    this.currentIndex = index;
    const selectedThumb = this.thumbnails[index];
    const imageUrl = selectedThumb.getAttribute('data-image');
    
    // Aktif thumbnail'i işaretle
    this.thumbnails.forEach(thumb => thumb.classList.remove('active'));
    selectedThumb.classList.add('active');
    
    // Ana görseli güncelle
    this.mainImage.style.opacity = '0';
    setTimeout(() => {
      this.mainImage.src = imageUrl;
      this.mainImage.style.opacity = '1';
    }, 300);
  }
}

// İlan Filtreleme
class PropertyFilter {
  constructor() {
    this.priceRange = document.getElementById('price-range');
    this.locationSelect = document.getElementById('location');
    this.roomsSelect = document.getElementById('rooms');
    this.typeSelect = document.getElementById('type');
    this.applyFilterBtn = document.querySelector('.apply-filter-btn');
    
    if (this.applyFilterBtn) {
      this.applyFilterBtn.addEventListener('click', () => this.applyFilters());
    }
  }
  
  applyFilters() {
    const filters = {
      price: this.priceRange?.value,
      location: this.locationSelect?.value,
      rooms: this.roomsSelect?.value,
      type: this.typeSelect?.value
    };
    
    console.log('Filtreler uygulanıyor:', filters);
    this.filterProperties(filters);
  }
  
  filterProperties(filters) {
    const properties = document.querySelectorAll('.property-card');
    
    properties.forEach(property => {
      let show = true;
      
      // Fiyat filtresi
      if (filters.price) {
        const propertyPrice = parseInt(property.getAttribute('data-price'));
        if (propertyPrice > parseInt(filters.price)) {
          show = false;
        }
      }
      
      // Konum filtresi
      if (filters.location && filters.location !== 'all') {
        const propertyLocation = property.getAttribute('data-location');
        if (propertyLocation !== filters.location) {
          show = false;
        }
      }
      
      // Oda sayısı filtresi
      if (filters.rooms && filters.rooms !== 'all') {
        const propertyRooms = property.getAttribute('data-rooms');
        if (propertyRooms !== filters.rooms) {
          show = false;
        }
      }
      
      // İlan türü filtresi
      if (filters.type && filters.type !== 'all') {
        const propertyType = property.getAttribute('data-type');
        if (propertyType !== filters.type) {
          show = false;
        }
      }
      
      // Görünürlüğü ayarla
      property.style.display = show ? 'block' : 'none';
      if (show) {
        property.classList.add('fade-in');
      }
    });
  }
}

// Form Doğrulama
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validateForm()) {
      this.submitForm();
    }
  }
  
  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
      
      // Email doğrulama
      if (input.type === 'email' && !this.isValidEmail(input.value)) {
        input.classList.add('error');
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  submitForm() {
    const formData = new FormData(this.form);
    
    // API çağrısı yapılacak
    console.log('Form gönderiliyor:', Object.fromEntries(formData));
    
    // Başarı mesajı göster
    alert('Formunuz başarıyla gönderildi!');
    this.form.reset();
  }
}

// Favori İlanlar
class FavoriteManager {
  constructor() {
    this.favoriteButtons = document.querySelectorAll('.favorite-btn');
    this.initializeFavorites();
  }
  
  initializeFavorites() {
    this.favoriteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.toggleFavorite(e));
    });
  }
  
  toggleFavorite(e) {
    const btn = e.target;
    const propertyId = btn.getAttribute('data-property-id');
    
    btn.classList.toggle('active');
    
    if (btn.classList.contains('active')) {
      this.addToFavorites(propertyId);
      btn.textContent = '♥ Favorilere Eklendi';
    } else {
      this.removeFromFavorites(propertyId);
      btn.textContent = '♡ Favorilere Ekle';
    }
  }
  
  addToFavorites(propertyId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }
  
  removeFromFavorites(propertyId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== propertyId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

// Sayfalama
class Pagination {
  constructor(itemsPerPage = 6) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.initializePagination();
  }
  
  initializePagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    paginationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.handlePageChange(e));
    });
  }
  
  handlePageChange(e) {
    const btn = e.target;
    const action = btn.getAttribute('data-action');
    
    if (action === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (action === 'next') {
      this.currentPage++;
    }
    
    this.updateDisplay();
  }
  
  updateDisplay() {
    const items = document.querySelectorAll('.property-card');
    const totalPages = Math.ceil(items.length / this.itemsPerPage);
    
    items.forEach((item, index) => {
      const page = Math.floor(index / this.itemsPerPage) + 1;
      item.style.display = page === this.currentPage ? 'block' : 'none';
    });
    
    // Sayfa numarasını güncelle
    const pageInfo = document.querySelector('.page-info');
    if (pageInfo) {
      pageInfo.textContent = `Sayfa ${this.currentPage} / ${totalPages}`;
    }
  }
}

// Sayfa Yüklendiğinde Başlat
document.addEventListener('DOMContentLoaded', () => {
  // Galeriler
  const galleries = document.querySelectorAll('[data-gallery]');
  galleries.forEach(gallery => {
    new PropertyGallery(gallery.id);
  });
  
  // Filtreleme
  if (document.querySelector('.filter-panel')) {
    new PropertyFilter();
  }
  
  // Form Doğrulama
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    new FormValidator(form.id);
  });
  
  // Favoriler
  if (document.querySelector('.favorite-btn')) {
    new FavoriteManager();
  }
  
  // Sayfalama
  if (document.querySelector('.pagination-btn')) {
    new Pagination();
  }
  
  console.log('Emlak Web Sitesi Yüklendi ✓');
});
