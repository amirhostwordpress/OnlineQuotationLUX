-- 1. Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Add user_id to quotations table
ALTER TABLE quotations
    ADD COLUMN user_id INT NULL,
    ADD CONSTRAINT fk_quotations_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL; 