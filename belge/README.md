# Emlak Web Sitesi - Sofistike Gayrimenkul Çözümü

Profesyonel ve sofistike bir emlak işletmesi için tasarlanmış, tam özellikli bir web platformu.

## 📁 Proje Yapısı

```
emlak_sitesi/
├── assets/                    # Statik dosyalar
│   ├── css/
│   │   └── style.css         # Ana stil dosyası
│   ├── js/
│   │   ├── app.js            # Ana JavaScript dosyası
│   │   └── gallery.js        # Fotoğraf galerisi modülü
│   └── img/                  # Görseller
├── pages/                     # HTML sayfaları
│   ├── index.html            # Ana sayfa
│   ├── about.html            # Hakkımızda
│   ├── contact.html          # İletişim
│   ├── properties.html       # İlanlar listeleme
│   └── property-detail.html  # İlan detayı
├── client/                    # React Frontend (Mevcut)
├── server/                    # Node.js Backend (Mevcut)
├── drizzle/                   # Veritabanı şeması
├── database.php              # PHP Veritabanı Bağlantı Dosyası
├── package.json              # Proje bağımlılıkları
└── README.md                 # Bu dosya
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Arka Plan**: Minimalist Krem (#f5f0eb)
- **Ana Metin**: Koyu Kahverengi (#2c1810)
- **Vurgu Rengi**: Altın/Bronz (#a67c52)
- **Sınırlar**: Açık Gri (#d4c8b8)

### Tipografi
- **Başlıklar**: Bodoni Moda (Didone Serif)
- **Gövde Metni**: Lora (Serif)
- **Detaylar**: Inter (Sans-serif)

### Estetik Özellikler
- Asimetrik denge
- Bol negatif alan
- İnce geometrik çizgiler
- Yüksek kontrast metin
- Dergi kapağı hissi

## 🚀 Teknoloji Yığını

### Frontend
- **React 19** - UI Framework
- **Tailwind CSS 4** - Styling
- **TypeScript** - Type Safety
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **tRPC** - Type-safe API
- **MySQL/TiDB** - Database

### Ek Özellikler
- **Manus OAuth** - Kimlik Doğrulama
- **S3 Cloud Storage** - Dosya Depolama
- **Google Maps** - Konum Haritası
- **LLM Integration** - AI Özellikleri

## 📋 Özellikler

### 1. Ana Sayfa
- Hero bölümü (büyük Didone başlık, arama çubuğu)
- Öne çıkan 6 ilan
- Sunulan hizmetler
- İstatistikler (satılan/kiralanan mülk sayıları)
- CTA bölümü

### 2. İlanlar Listeleme
- Grid görünümü (3 sütun)
- Filtreleme (ilan türü, konum, fiyat, oda sayısı)
- Sıralama (fiyat, tarih, popülarite)
- Sayfalama
- Arama işlevi

### 3. İlan Detayı
- Fotoğraf galerisi (ana resim + thumbnail'ler)
- Mülk özellikleri (oda, banyo, alan, yıl)
- Detaylı açıklama
- Konum haritası (Google Maps)
- İrtibat formu
- Favori ekleme butonu

### 4. Admin Paneli
- Yeni ilan ekleme
- Mevcut ilanları düzenleme
- İlan silme
- Yayın durumu kontrolü
- İletişim formları yönetimi

### 5. İletişim Sayfası
- İletişim formu (ad, e-posta, telefon, mesaj)
- Ofis bilgileri (telefon, e-posta, adres, çalışma saatleri)
- Harita entegrasyonu

### 6. Hakkımızda Sayfası
- Şirket hikayesi
- Ekip üyeleri
- Müşteri yorumları

### 7. Kullanıcı Sistemi
- OAuth ile kayıt ve giriş
- Favori ilanları kaydetme
- İlan talepleri gönderme
- Kullanıcı profili

## 🔧 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 22.13.0+
- npm veya pnpm
- MySQL 8.0+

### Adımlar

1. **Bağımlılıkları Yükle**
```bash
pnpm install
```

2. **Veritabanını Kur**
```bash
pnpm drizzle-kit migrate
```

3. **Ortam Değişkenlerini Ayarla**
```bash
# .env dosyası oluştur
DATABASE_URL=mysql://user:password@localhost:3306/emlak_db
JWT_SECRET=your_secret_key
VITE_APP_ID=your_app_id
```

4. **Geliştirme Sunucusunu Başlat**
```bash
pnpm dev
```

5. **Üretim İçin Derle**
```bash
pnpm build
```

6. **Üretim Sunucusunu Başlat**
```bash
pnpm start
```

## 📚 API Endpoints (tRPC)

### Properties (İlanlar)
- `properties.list` - Tüm ilanları listele
- `properties.getById` - İlan detayını getir
- `properties.filter` - İlanları filtrele
- `properties.create` - Yeni ilan oluştur (Admin)
- `properties.update` - İlan güncelle (Admin)
- `properties.delete` - İlan sil (Admin)

### Favorites (Favoriler)
- `favorites.add` - Favoriye ekle
- `favorites.remove` - Favoriden kaldır
- `favorites.list` - Kullanıcının favorilerini listele

### Inquiries (İlan Talepleri)
- `inquiries.create` - Yeni talebi gönder
- `inquiries.list` - Talepleri listele (Admin)

### Contact Messages (İletişim)
- `contact.send` - İletişim formu gönder
- `contact.list` - Mesajları listele (Admin)

## 🗄️ Veritabanı Şeması

### properties (İlanlar)
```sql
CREATE TABLE properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  location VARCHAR(255),
  rooms INT,
  bathrooms INT,
  area DECIMAL(10, 2),
  type ENUM('sale', 'rent'),
  image_url VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### favorites (Favoriler)
```sql
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (property_id) REFERENCES properties(id)
);
```

### inquiries (İlan Talepleri)
```sql
CREATE TABLE inquiries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  user_id INT,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);
```

### contact_messages (İletişim Formları)
```sql
CREATE TABLE contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📱 Responsive Tasarım

- **Mobil** (< 480px): Tek sütun, dokunmatik optimizasyonu
- **Tablet** (480px - 768px): İki sütun, orta seviye spacing
- **Masaüstü** (> 768px): Üç sütun, geniş spacing

## 🔐 Güvenlik

- **Kimlik Doğrulama**: Manus OAuth
- **Şifreleme**: SSL/TLS
- **Veri Doğrulama**: Server-side validation
- **SQL Injection Koruması**: Prepared statements
- **CORS**: Kontrollü cross-origin istekleri

## 📊 Performans

- **Sayfa Yükleme**: < 2 saniye
- **API Yanıt Süresi**: < 500ms
- **Görüntü Optimizasyonu**: WebP format, lazy loading
- **Caching**: Browser ve server-side caching

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

**Veritabanı Bağlantı Hatası**
```bash
# DATABASE_URL'yi kontrol et
echo $DATABASE_URL

# MySQL sunucusunun çalışıp çalışmadığını kontrol et
mysql -h localhost -u root -p
```

**Port Zaten Kullanımda**
```bash
# Farklı port kullan
PORT=3001 pnpm dev
```

**Bağımlılık Hatası**
```bash
# Bağımlılıkları temizle ve yeniden yükle
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📖 Belgelendirme

- [React Belgeleri](https://react.dev)
- [Express Belgeleri](https://expressjs.com)
- [tRPC Belgeleri](https://trpc.io)
- [Drizzle ORM Belgeleri](https://orm.drizzle.team)
- [Tailwind CSS Belgeleri](https://tailwindcss.com)

## 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.

## 👥 Destek

Sorularınız veya sorunlarınız için lütfen iletişim sayfasından bize ulaşın.

---

**Son Güncelleme**: Nisan 2026
**Sürüm**: 1.0.0
