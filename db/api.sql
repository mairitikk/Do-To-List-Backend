-- Lens Database Schema
CREATE DATABASE IF NOT EXISTS lens_db;

USE lens_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    name VARCHAR(100),
    address TEXT,
    role ENUM(
        'admin',
        'photographer',
        'trainer',
        'user'
    ) NOT NULL DEFAULT 'user',
    email_confirmed TINYINT(1) DEFAULT 0,
    confirmation_token VARCHAR(255),
    token_expiry BIGINT,
    created_at BIGINT NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Galleries table
CREATE TABLE IF NOT EXISTS galleries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id VARCHAR(36) NOT NULL,
    logo_url TEXT,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY,
    gallery_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date VARCHAR(255),
    description TEXT,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiration_date VARCHAR(255),
    expiration_days INT,
    FOREIGN KEY (gallery_id) REFERENCES galleries (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    url TEXT,
    thumbnail_url TEXT,
    filename VARCHAR(255),
    price DECIMAL(10, 2) DEFAULT 0.00,
    is_watermarked TINYINT(1) DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- User-Event junction table
CREATE TABLE IF NOT EXISTS user_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    assigned_at BIGINT NOT NULL,
    UNIQUE KEY unique_user_event (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    customer_email VARCHAR(100) NOT NULL,
    items JSON,
    total DECIMAL(10, 2) NOT NULL,
    date VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id VARCHAR(36),
    default_price DECIMAL(10, 2) DEFAULT 10.00,
    enable_credit_card TINYINT(1) DEFAULT 0,
    enable_paypal TINYINT(1) DEFAULT 0,
    paypal_client_id VARCHAR(255),
    brand_color VARCHAR(20),
    header_bg VARCHAR(20),
    footer_bg VARCHAR(20),
    accent_color VARCHAR(20),
    fussball_de_token VARCHAR(255),
    branch_name VARCHAR(100) UNIQUE,
    instagram_url VARCHAR(255),
    background_image_url VARCHAR(255),
    logo_url VARCHAR(255),
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Terms table
CREATE TABLE IF NOT EXISTS terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id VARCHAR(36),
    terms_of_service LONGTEXT,
    privacy_policy LONGTEXT,
    data_processing_agreement LONGTEXT,
    child_content_consent LONGTEXT,
    updated_at BIGINT,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Event visits table
CREATE TABLE IF NOT EXISTS visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    timestamp BIGINT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;