# Emlak Web Sitesi - Proje Yapısı

## 📂 Dosya Organizasyonu

```
emlak_sitesi/
│
├── 📁 assets/                          # Statik Dosyalar
│   ├── 📁 css/
│   │   └── style.css                   # Ana CSS Dosyası (Sofistike Tasarım)
│   ├── 📁 js/
│   │   ├── app.js                      # Ana JavaScript (Filtreleme, Favoriler, Formlar)
│   │   └── gallery.js                  # Fotoğraf Galerisi Modülü
│   └── 📁 img/                         # Emlak Görselleri
│
├── 📁 pages/                           # HTML Sayfaları
│   ├── index.html                      # Ana Sayfa
│   ├── about.html                      # Hakkımızda Sayfası
│   ├── contact.html                    # İletişim Sayfası
│   ├── properties.html                 # İlanlar Listeleme
│   └── property-detail.html            # İlan Detay Sayfası
│
├── 📁 client/                          # React Frontend (Mevcut)
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Home.tsx                # Ana Sayfa (React)
│   │   │   ├── Listings.tsx            # İlanlar Listeleme
│   │   │   ├── PropertyDetail.tsx      # İlan Detayı
│   │   │   ├── Contact.tsx             # İletişim Sayfası
│   │   │   └── About.tsx               # Hakkımızda Sayfası
│   │   ├── 📁 components/
│   │   ├── 📁 hooks/
│   │   ├── 📁 contexts/
│   │   ├── App.tsx                     # Ana Uygulama Bileşeni
│   │   ├── main.tsx                    # Entry Point
│   │   └── index.css                   # Global Stiller (Tailwind)
│   ├── index.html                      # HTML Template
│   └── 📁 public/
│
├── 📁 server/                          # Node.js Backend (Mevcut)
│   ├── 📁 _core/
│   │   ├── index.ts                    # Server Entry Point
│   │   ├── context.ts                  # tRPC Context
│   │   ├── oauth.ts                    # OAuth Yapılandırması
│   │   ├── llm.ts                      # LLM Entegrasyonu
│   │   ├── map.ts                      # Google Maps Proxy
│   │   ├── notification.ts             # Bildirim Sistemi
│   │   └── storage.ts                  # S3 Storage
│   ├── routers.ts                      # tRPC Prosedürleri
│   ├── db.ts                           # Veritabanı Sorguları
│   ├── storage.ts                      # Dosya Depolama Yardımcıları
│   └── auth.logout.test.ts             # Test Dosyası
│
├── 📁 drizzle/                         # Veritabanı (Mevcut)
│   ├── schema.ts                       # Veritabanı Şeması
│   ├── 0001_outgoing_gorgon.sql        # Migration SQL
│   └── 📁 meta/                        # Migration Metadata
│
├── 📁 shared/                          # Paylaşılan Dosyalar
│   ├── const.ts                        # Sabitler
│   └── types.ts                        # TypeScript Türleri
│
├── database.php                        # PHP Veritabanı Bağlantı Dosyası
├── package.json                        # NPM Bağımlılıkları
├── tsconfig.json                       # TypeScript Yapılandırması
├── vite.config.ts                      # Vite Yapılandırması
├── drizzle.config.ts                   # Drizzle ORM Yapılandırması
├── vitest.config.ts                    # Vitest Yapılandırması
├── README.md                           # Proje Belgeleri
├── STRUCTURE.md                        # Bu Dosya
└── todo.md                             # Proje TODO Listesi
```

## 🎯 Dosya Açıklamaları

### assets/css/style.css
**Amaç**: Ana stil dosyası - sofistike emlak tasarımı
**İçerik**:
- Renk paleti (krem, kahverengi, altın)
- Tipografi (Bodoni Moda, Lora, Inter)
- Responsive grid ve flexbox
- Button ve card stilleri
- Form öğeleri
- Utility classes

**Kullanım**:
```html
<link rel="stylesheet" href="assets/css/style.css">
```

### assets/js/app.js
**Amaç**: Ana JavaScript işlevselliği
**Özellikler**:
- Mobil menü toggle
- Filtreleme paneli
- Form doğrulama
- Favori yönetimi (localStorage)
- Sayfalama
- Event listeners

**Sınıflar**:
- `PropertyGallery` - Fotoğraf galerisi
- `PropertyFilter` - İlan filtreleme
- `FormValidator` - Form doğrulama
- `FavoriteManager` - Favori yönetimi
- `Pagination` - Sayfalama

### assets/js/gallery.js
**Amaç**: Gelişmiş fotoğraf galerisi modülü
**Özellikler**:
- Thumbnail navigasyonu
- Otomatik oynatma
- Klavye navigasyonu (Arrow keys)
- Smooth transitions
- Accessibility support

**Kullanım**:
```javascript
const gallery = new ImageGallery({
  containerSelector: '.gallery-container',
  autoPlay: true,
  autoPlayInterval: 5000
});
```

### pages/index.html
**Amaç**: Ana sayfa HTML şablonu
**Bölümler**:
- Header/Navigation
- Hero bölümü
- Öne çıkan ilanlar
- Hizmetler
- İstatistikler
- CTA (Çağrı-Harakete)
- Footer

### pages/properties.html
**Amaç**: İlanlar listeleme sayfası
**Özellikler**:
- Filtreleme paneli (fiyat, konum, oda, tür)
- İlan kartları grid görünümü
- Sayfalama kontrolleri
- Responsive tasarım

### pages/property-detail.html
**Amaç**: Tek ilanın detay sayfası
**Özellikler**:
- Fotoğraf galerisi
- Mülk özellikleri
- Detaylı açıklama
- Harita
- İrtibat formu
- Favori butonu

### database.php
**Amaç**: PHP veritabanı bağlantı ve API
**Fonksiyonlar**:
- `getAllProperties()` - Tüm ilanları getir
- `getPropertyById()` - İlan detayını getir
- `filterProperties()` - İlanları filtrele
- `addProperty()` - Yeni ilan ekle
- `updateProperty()` - İlanı güncelle
- `deleteProperty()` - İlanı sil
- `addContactMessage()` - İletişim formu
- `addInquiry()` - İlan talebi
- `addFavorite()` - Favoriye ekle
- `getUserFavorites()` - Kullanıcı favorileri
- `getStatistics()` - İstatistikler

**Endpoints**:
- `GET /database.php?action=properties` - İlanları listele
- `GET /database.php?action=property&id=1` - İlan detayı
- `POST /database.php?action=filter` - İlanları filtrele
- `POST /database.php?action=contact` - İletişim formu
- `GET /database.php?action=statistics` - İstatistikler

### client/src/pages/Home.tsx
**Amaç**: React ana sayfa bileşeni
**Özellikler**:
- Hero bölümü
- Öne çıkan ilanlar (tRPC)
- Hizmetler listesi
- İstatistikler (tRPC)
- CTA bölümü

### client/src/pages/Listings.tsx
**Amaç**: React ilanlar listeleme sayfası
**Özellikler**:
- Filtreleme (tRPC)
- İlan kartları
- Sayfalama
- Loading states

### server/routers.ts
**Amaç**: tRPC API prosedürleri
**Prosedürler**:
- `properties.list` - İlanları listele
- `properties.filter` - İlanları filtrele
- `properties.getById` - İlan detayı
- `properties.create` - Yeni ilan (Admin)
- `properties.update` - İlanı güncelle (Admin)
- `properties.delete` - İlanı sil (Admin)
- `favorites.add` - Favoriye ekle
- `favorites.remove` - Favoriden kaldır
- `inquiries.create` - Talebi gönder
- `contact.send` - İletişim formu

### drizzle/schema.ts
**Amaç**: Veritabanı şeması tanımı
**Tablolar**:
- `users` - Kullanıcılar
- `properties` - İlanlar
- `favorites` - Favoriler
- `inquiries` - İlan talepleri
- `contact_messages` - İletişim formları

## 🔄 Veri Akışı

### İlanları Listeleme
```
Frontend (React/HTML)
    ↓
tRPC API (properties.list)
    ↓
Backend (Express/Node.js)
    ↓
Veritabanı (MySQL)
    ↓
JSON Yanıt
    ↓
Frontend Render
```

### İlanları Filtreleme
```
Filtreleme Formu
    ↓
JavaScript (app.js) veya React
    ↓
tRPC API (properties.filter)
    ↓
Backend Sorgusu
    ↓
Veritabanı (WHERE koşulları)
    ↓
Filtrelenmiş Sonuçlar
    ↓
Frontend Güncelleme
```

### İletişim Formu
```
HTML/React Form
    ↓
Form Doğrulama (JavaScript)
    ↓
tRPC API (contact.send) veya PHP
    ↓
Veritabanı Kayıt
    ↓
E-posta Bildirimi
    ↓
Başarı Mesajı
```

## 🎨 Stil Hiyerarşisi

```
Global Stiller (style.css)
    ↓
Tailwind CSS (client/src/index.css)
    ↓
Component Stiller (React components)
    ↓
Inline Stiller (Gerektiğinde)
```

## 🔐 Güvenlik Katmanları

```
Frontend Validasyon
    ↓
Backend Validasyon (tRPC)
    ↓
Veritabanı Constraints
    ↓
OAuth Kimlik Doğrulama
    ↓
Role-based Access Control
```

## 📊 Performans Optimizasyonları

- **Lazy Loading**: Görseller ve bileşenler
- **Caching**: Browser ve server-side
- **Compression**: Gzip ve Brotli
- **CDN**: Statik dosyalar
- **Database Indexing**: Sık sorgulanan alanlar
- **Query Optimization**: Efficient SQL

## 🚀 Deployment Yapısı

```
Production Server
    ├── Frontend (Vite Build)
    ├── Backend (Node.js)
    ├── Database (MySQL)
    ├── S3 Storage (Images)
    └── CDN (Static Assets)
```

## 📝 Notlar

- React ve HTML sayfaları paralel olarak çalışabilir
- PHP dosyası opsiyonel olarak kullanılabilir
- Tüm API çağrıları tRPC üzerinden yapılır
- Veritabanı şeması Drizzle ORM tarafından yönetilir
- CSS ve JavaScript modüler ve yeniden kullanılabilir

---

**Son Güncelleme**: Nisan 2026
