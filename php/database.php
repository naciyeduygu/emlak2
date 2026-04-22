<?php
/**
 * Emlak Web Sitesi - Veritabanı Bağlantı Dosyası
 * 
 * Bu dosya, Node.js/Express backend ile MySQL veritabanı arasında
 * veri transferi için kullanılabilecek PHP fonksiyonlarını içerir.
 * 
 * Mevcut proje React + Node.js + MySQL kullanıyor ancak,
 * ihtiyaç durumunda PHP ile veri işleme için bu dosya kullanılabilir.
 */

// Veritabanı Yapılandırması
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'emlak_db');
define('DB_PORT', getenv('DB_PORT') ?: 3306);

// CORS Başlıkları
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Veritabanı Bağlantı Sınıfı
class Database {
    private $connection;
    private $host;
    private $user;
    private $pass;
    private $db;
    private $port;
    
    public function __construct() {
        $this->host = DB_HOST;
        $this->user = DB_USER;
        $this->pass = DB_PASS;
        $this->db = DB_NAME;
        $this->port = DB_PORT;
        
        $this->connect();
    }
    
    /**
     * Veritabanına bağlan
     */
    private function connect() {
        try {
            $this->connection = new mysqli(
                $this->host,
                $this->user,
                $this->pass,
                $this->db,
                $this->port
            );
            
            if ($this->connection->connect_error) {
                throw new Exception("Veritabanı Bağlantı Hatası: " . $this->connection->connect_error);
            }
            
            // UTF-8 Karakterset Ayarı
            $this->connection->set_charset("utf8mb4");
            
        } catch (Exception $e) {
            $this->handleError($e->getMessage());
        }
    }
    
    /**
     * SQL Sorgusu Çalıştır
     */
    public function query($sql) {
        $result = $this->connection->query($sql);
        
        if (!$result && $this->connection->error) {
            $this->handleError("SQL Hatası: " . $this->connection->error);
            return false;
        }
        
        return $result;
    }
    
    /**
     * Hazırlanmış Sorgu (Prepared Statement)
     */
    public function prepare($sql) {
        return $this->connection->prepare($sql);
    }
    
    /**
     * Tüm İlanları Getir
     */
    public function getAllProperties($limit = 10, $offset = 0) {
        $sql = "SELECT * FROM properties WHERE status = 'published' 
                ORDER BY created_at DESC LIMIT ? OFFSET ?";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    /**
     * İlan Detayını Getir
     */
    public function getPropertyById($id) {
        $sql = "SELECT * FROM properties WHERE id = ? AND status = 'published'";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result()->fetch_assoc();
        return $result ?: null;
    }
    
    /**
     * İlanları Filtrele
     */
    public function filterProperties($filters = []) {
        $sql = "SELECT * FROM properties WHERE status = 'published'";
        $params = [];
        $types = "";
        
        // Fiyat Filtresi
        if (isset($filters['min_price'])) {
            $sql .= " AND price >= ?";
            $params[] = $filters['min_price'];
            $types .= "i";
        }
        
        if (isset($filters['max_price'])) {
            $sql .= " AND price <= ?";
            $params[] = $filters['max_price'];
            $types .= "i";
        }
        
        // Konum Filtresi
        if (isset($filters['location']) && $filters['location']) {
            $sql .= " AND location = ?";
            $params[] = $filters['location'];
            $types .= "s";
        }
        
        // Oda Sayısı Filtresi
        if (isset($filters['rooms'])) {
            $sql .= " AND rooms = ?";
            $params[] = $filters['rooms'];
            $types .= "i";
        }
        
        // İlan Türü Filtresi
        if (isset($filters['type']) && $filters['type']) {
            $sql .= " AND type = ?";
            $params[] = $filters['type'];
            $types .= "s";
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        if (isset($filters['limit'])) {
            $sql .= " LIMIT ?";
            $params[] = $filters['limit'];
            $types .= "i";
        }
        
        $stmt = $this->prepare($sql);
        
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    /**
     * Yeni İlan Ekle
     */
    public function addProperty($data) {
        $sql = "INSERT INTO properties 
                (title, description, price, location, rooms, bathrooms, area, type, image_url, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param(
            "ssisiiiss",
            $data['title'],
            $data['description'],
            $data['price'],
            $data['location'],
            $data['rooms'],
            $data['bathrooms'],
            $data['area'],
            $data['type'],
            $data['image_url']
        );
        
        if ($stmt->execute()) {
            return $this->connection->insert_id;
        }
        
        return false;
    }
    
    /**
     * İlanı Güncelle
     */
    public function updateProperty($id, $data) {
        $updates = [];
        $params = [];
        $types = "";
        
        foreach ($data as $key => $value) {
            $updates[] = "$key = ?";
            $params[] = $value;
            $types .= "s";
        }
        
        $params[] = $id;
        $types .= "i";
        
        $sql = "UPDATE properties SET " . implode(", ", $updates) . " WHERE id = ?";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        return $stmt->execute();
    }
    
    /**
     * İlanı Sil
     */
    public function deleteProperty($id) {
        $sql = "DELETE FROM properties WHERE id = ?";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param("i", $id);
        
        return $stmt->execute();
    }
    
    /**
     * İletişim Formu Gönder
     */
    public function addContactMessage($data) {
        $sql = "INSERT INTO contact_messages 
                (name, email, phone, subject, message, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param(
            "sssss",
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['subject'],
            $data['message']
        );
        
        return $stmt->execute();
    }
    
    /**
     * İlan Talebi Gönder
     */
    public function addInquiry($data) {
        $sql = "INSERT INTO inquiries 
                (property_id, user_id, name, email, phone, message, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param(
            "iissss",
            $data['property_id'],
            $data['user_id'],
            $data['name'],
            $data['email'],
            $data['phone'],
            $data['message']
        );
        
        return $stmt->execute();
    }
    
    /**
     * Favori İlan Ekle
     */
    public function addFavorite($user_id, $property_id) {
        $sql = "INSERT INTO favorites (user_id, property_id, created_at) 
                VALUES (?, ?, NOW())";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param("ii", $user_id, $property_id);
        
        return $stmt->execute();
    }
    
    /**
     * Favori İlan Kaldır
     */
    public function removeFavorite($user_id, $property_id) {
        $sql = "DELETE FROM favorites WHERE user_id = ? AND property_id = ?";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param("ii", $user_id, $property_id);
        
        return $stmt->execute();
    }
    
    /**
     * Kullanıcının Favori İlanlarını Getir
     */
    public function getUserFavorites($user_id) {
        $sql = "SELECT p.* FROM properties p 
                INNER JOIN favorites f ON p.id = f.property_id 
                WHERE f.user_id = ? AND p.status = 'published'
                ORDER BY f.created_at DESC";
        
        $stmt = $this->prepare($sql);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
    /**
     * İstatistikler Getir
     */
    public function getStatistics() {
        $stats = [];
        
        // Toplam Satılan Mülk
        $result = $this->query("SELECT COUNT(*) as count FROM properties WHERE type = 'sale'");
        $stats['sold'] = $result->fetch_assoc()['count'];
        
        // Toplam Kiralanan Mülk
        $result = $this->query("SELECT COUNT(*) as count FROM properties WHERE type = 'rent'");
        $stats['rented'] = $result->fetch_assoc()['count'];
        
        // Toplam İlan
        $result = $this->query("SELECT COUNT(*) as count FROM properties WHERE status = 'published'");
        $stats['total'] = $result->fetch_assoc()['count'];
        
        // Ortalama Fiyat
        $result = $this->query("SELECT AVG(price) as avg_price FROM properties WHERE status = 'published'");
        $stats['avg_price'] = round($result->fetch_assoc()['avg_price']);
        
        return $stats;
    }
    
    /**
     * Hata İşleme
     */
    private function handleError($message) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
        exit;
    }
    
    /**
     * Bağlantıyı Kapat
     */
    public function close() {
        if ($this->connection) {
            $this->connection->close();
        }
    }
    
    /**
     * Destruktor
     */
    public function __destruct() {
        $this->close();
    }
}

// Veritabanı Örneği Oluştur
$db = new Database();

// API Endpoints

// GET - Tüm İlanları Getir
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'properties') {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    $properties = $db->getAllProperties($limit, $offset);
    
    echo json_encode([
        'success' => true,
        'data' => $properties
    ]);
}

// GET - İlan Detayı
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'property') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'İlan ID gerekli']);
        exit;
    }
    
    $property = $db->getPropertyById($id);
    
    echo json_encode([
        'success' => true,
        'data' => $property
    ]);
}

// POST - İlanları Filtrele
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'filter') {
    $filters = [
        'min_price' => isset($_POST['min_price']) ? (int)$_POST['min_price'] : null,
        'max_price' => isset($_POST['max_price']) ? (int)$_POST['max_price'] : null,
        'location' => isset($_POST['location']) ? $_POST['location'] : null,
        'rooms' => isset($_POST['rooms']) ? (int)$_POST['rooms'] : null,
        'type' => isset($_POST['type']) ? $_POST['type'] : null,
        'limit' => isset($_POST['limit']) ? (int)$_POST['limit'] : 10
    ];
    
    $properties = $db->filterProperties($filters);
    
    echo json_encode([
        'success' => true,
        'data' => $properties
    ]);
}

// POST - İletişim Formu
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'contact') {
    $data = [
        'name' => isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '',
        'email' => isset($_POST['email']) ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '',
        'phone' => isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : '',
        'subject' => isset($_POST['subject']) ? htmlspecialchars($_POST['subject']) : '',
        'message' => isset($_POST['message']) ? htmlspecialchars($_POST['message']) : ''
    ];
    
    if ($db->addContactMessage($data)) {
        echo json_encode([
            'success' => true,
            'message' => 'Mesajınız başarıyla gönderildi'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Mesaj gönderilemedi'
        ]);
    }
}

// GET - İstatistikler
elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['action'] === 'statistics') {
    $stats = $db->getStatistics();
    
    echo json_encode([
        'success' => true,
        'data' => $stats
    ]);
}

// Hatalı İstek
else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Geçersiz istek'
    ]);
}

?>
