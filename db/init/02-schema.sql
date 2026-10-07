CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS profile (
  id INT PRIMARY KEY, full_name VARCHAR(100), title VARCHAR(100),
  bio TEXT, email VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(150) NOT NULL,
  description TEXT, link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO profile VALUES (1, 'Nguyễn Văn A', 'Sinh viên CNTT', 'Giới thiệu bản thân...', 'a@example.com');
INSERT INTO projects(title, description, link) VALUES ('Dự án mẫu', 'Mô tả dự án mẫu', 'https://github.com');
