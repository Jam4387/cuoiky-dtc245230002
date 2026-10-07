SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  title VARCHAR(150),
  bio TEXT,
  email VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  link VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admins (username, password) 
VALUES ('admin', '12345')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO profile (full_name, title, bio, email) 
VALUES (
  'Vàng Thị Dẳm', 
  'Sinh viên Lớp Hệ thống thông tin K23A - Khoa CNTT, Trường Công nghệ thông tin và Truyền thông Thái Nguyên (ICTU)', 
  'Ngày sinh: 29/06/2006 | Quê quán: Xín Mần - Hà Giang', 
  'damvt@example.com'
)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO projects (title, description, link) 
VALUES ('Dự án mẫu', 'Mô tả dự án mẫu', '#')
ON DUPLICATE KEY UPDATE id=id;

SET FOREIGN_KEY_CHECKS = 1;
