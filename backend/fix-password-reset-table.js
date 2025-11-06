const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPasswordResetTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('📦 Connected to database');

    // Drop existing table to start fresh
    await connection.query('DROP TABLE IF EXISTS password_resets');
    console.log('🗑️  Dropped existing password_resets table');

    // Create unified password_resets table that supports both OTP and token methods
    const createTableQuery = `
      CREATE TABLE password_resets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        admin_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NULL,
        otp VARCHAR(6) NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_email (email),
        INDEX idx_otp (otp),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createTableQuery);
    console.log('✅ Unified password_resets table created successfully!');

    console.log('\n📋 Table Structure:');
    console.log('   - id: Auto-increment primary key');
    console.log('   - admin_id: Reference to admins table (REQUIRED)');
    console.log('   - email: Admin email (for lookup)');
    console.log('   - token: Reset token for link-based reset (optional)');
    console.log('   - otp: 6-digit OTP code (optional)');
    console.log('   - expires_at: Expiration time');
    console.log('   - used: Whether the reset has been used');
    console.log('   - created_at: Creation timestamp');
    console.log('\n✅ This table now supports BOTH token and OTP methods!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

fixPasswordResetTable();
