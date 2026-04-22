<?php
/**
 * ============================================
 * EMLAK - Veritabanı Konfigürasyonu
 * ============================================
 */

// Veritabanı Konfigürasyonu
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'emlak_db');
define('DB_PORT', 3306);

// Hata Raporlama
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Europe/Istanbul');

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Veritabanı Bağlantısı
class Database {
    private $connection;
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $port = DB_PORT;

    public function connect() {
        $this->connection = new mysqli(
            $this->host,
            $this->user,
            $this->pass,
            $this->db_name,
            $this->port
        );

        // Bağlantı Hatası Kontrolü
        if ($this->connection->connect_error) {
            die(json_encode([
                'success' => false,
                'message' => 'Veritabanı Bağlantı Hatası: ' . $this->connection->connect_error
            ]));
        }

        // UTF-8 Ayarı
        $this->connection->set_charset("utf8mb4");

        return $this->connection;
    }

    public function getConnection() {
        return $this->connection;
    }

    public function close() {
        if ($this->connection) {
            $this->connection->close();
        }
    }
}

// Veritabanı Başlatma
$db = new Database();
$conn = $db->connect();

/**
 * SQL Sorguları - Tablo Oluşturma
 * Aşağıdaki SQL'i phpMyAdmin'de çalıştırın
 */

$sql_create_tables = "

-- Kategoriler Tablosu
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- İlanlar Tablosu
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    location VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    property_type ENUM('satılık', 'kiralık') NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    rooms INT,
    bathrooms INT,
    area DECIMAL(10, 2),
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_type (property_type),
    INDEX idx_status (status),
    INDEX idx_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- İletişim Mesajları Tablosu
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message LONGTEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- İlan Talepleri Tablosu
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin Kullanıcıları Tablosu
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

";

// Örnek Kategoriler Ekleme
$sql_insert_categories = "
INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Daire', 'Apartman daireleri'),
(2, 'Villa', 'Müstakil villalar'),
(3, 'Ofis', 'Ticari ofis alanları'),
(4, 'Arsa', 'Boş arsa ve inşaat alanları'),
(5, 'Depo', 'Depo ve endüstriyel alanlar');
";

// Örnek Admin Kullanıcı (Şifre: admin123)
$admin_password = password_hash('admin123', PASSWORD_BCRYPT);
$sql_insert_admin = "
INSERT IGNORE INTO admin_users (username, email, password, role, status) VALUES
('admin', 'admin@emlak.com', '$admin_password', 'admin', 'active');
";

?>
