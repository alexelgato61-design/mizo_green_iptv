const pool = require('./config/database');

async function addWhatsAppOption() {
  let connection;
  
  try {
    connection = await pool.getConnection();
    console.log('Adding use_whatsapp column to plans table...');
    
    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'plans' 
      AND COLUMN_NAME = 'use_whatsapp'
    `);
    
    if (columns.length > 0) {
      console.log('✓ Column use_whatsapp already exists in plans table');
    } else {
      // Add use_whatsapp column
      await connection.execute(`
        ALTER TABLE plans 
        ADD COLUMN use_whatsapp BOOLEAN DEFAULT FALSE 
        AFTER buy_link
      `);
      
      console.log('✓ Successfully added use_whatsapp column to plans table');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

addWhatsAppOption();
