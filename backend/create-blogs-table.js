require('dotenv').config();
const pool = require('./config/database');

async function createBlogsTable() {
  try {
    console.log('Creating blogs table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(500),
        author VARCHAR(100) DEFAULT 'Admin',
        status ENUM('draft', 'published') DEFAULT 'draft',
        published_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_status (status),
        INDEX idx_published_at (published_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✓ Blogs table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error creating blogs table:', error);
    process.exit(1);
  }
}

createBlogsTable();
